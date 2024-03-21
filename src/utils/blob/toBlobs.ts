import * as blobConstants from '../../constants/blob.js'
import {
  BlobSizeTooLargeError,
  type BlobSizeTooLargeErrorType,
  EmptyBlobError,
  type EmptyBlobErrorType,
} from '../../errors/blob.js'
import type { ErrorType } from '../../errors/utils.js'
import type { ByteArray, Hex } from '../../types/misc.js'
import { createCursor } from '../cursor.js'
import { type SizeErrorType, size } from '../data/size.js'
import { type HexToBytesErrorType, hexToBytes } from '../encoding/toBytes.js'
import { type BytesToHexErrorType, bytesToHex } from '../encoding/toHex.js'

type To = 'hex' | 'bytes'

export type ToBlobsParameters<
  data extends Hex | ByteArray = Hex | ByteArray,
  to extends To | undefined = undefined,
> = {
  /** Data to transform to a blob. */
  data: data | Hex | ByteArray
  /** Return type. */
  to?: to | To | undefined
  blobsPerTransaction?: number
  maxBytesPerTransaction?: number
}

export type ToBlobsReturnType<to extends To> =
  | (to extends 'bytes' ? ByteArray[] : never)
  | (to extends 'hex' ? Hex[] : never)

export type ToBlobsErrorType =
  | BlobSizeTooLargeErrorType
  | BytesToHexErrorType
  | EmptyBlobErrorType
  | HexToBytesErrorType
  | SizeErrorType
  | ErrorType

/**
 * Transforms arbitrary data to blobs.
 *
 * @example
 * ```ts
 * import { toBlobs, stringToHex } from 'viem'
 *
 * const blobs = toBlobs({ data: stringToHex('hello world') })
 * ```
 */
export function toBlobs<
  const data extends Hex | ByteArray,
  to extends To =
    | (data extends Hex ? 'hex' : never)
    | (data extends ByteArray ? 'bytes' : never),
>(parameters: ToBlobsParameters<data, to>): ToBlobsReturnType<to> {
  const to =
    parameters.to ?? (typeof parameters.data === 'string' ? 'hex' : 'bytes')
  const data = (
    typeof parameters.data === 'string'
      ? hexToBytes(parameters.data)
      : parameters.data
  ) as ByteArray

  const opts = { ...blobConstants, ...parameters }
  const size_ = size(data)
  if (!size_) throw new EmptyBlobError()
  if (size_ > opts.maxBytesPerTransaction)
    throw new BlobSizeTooLargeError({
      maxSize: opts.maxBytesPerTransaction,
      size: size_,
    })

  const blobs = []

  let active = true
  let position = 0
  while (active) {
    const blob = createCursor(new Uint8Array(opts.bytesPerBlob))

    let size = 0
    while (size < opts.fieldElementsPerBlob) {
      const bytes = data.slice(
        position,
        position + (opts.bytesPerFieldElement - 1),
      )

      // Push a zero byte so the field element doesn't overflow the BLS modulus.
      blob.pushByte(0x00)

      // Push the current segment of data bytes.
      blob.pushBytes(bytes)

      // If we detect that the current segment of data bytes is less than 31 bytes,
      // we can stop processing and push a terminator byte to indicate the end of the blob.
      if (bytes.length < 31) {
        blob.pushByte(0x80)
        active = false
        break
      }

      size++
      position += 31
    }

    blobs.push(blob)
  }

  return (
    to === 'bytes'
      ? blobs.map((x) => x.bytes)
      : blobs.map((x) => bytesToHex(x.bytes))
  ) as ToBlobsReturnType<to>
}
