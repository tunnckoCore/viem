/**
 * TODO:  Heaps more test cases :D
 *        - Complex calldata types
 *        - Complex return types (tuple/structs)
 *        - Calls against blocks
 */

import { describe, expect, test } from 'vitest'
import {
  accounts,
  publicClient,
  testClient,
  wagmiContractConfig,
  walletClient,
} from '../../_test'
import { baycContractConfig } from '../../_test/abis'
import { encodeFunctionData } from '../../utils'
import { mine } from '../test'
import { sendTransaction } from '../wallet'

import { deployContract } from './deployContract'
import { getTransactionReceipt } from './getTransactionReceipt'
import { readContract } from './readContract'

describe('wagmi', () => {
  test('default', async () => {
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'balanceOf',
        args: ['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC'],
      }),
    ).toEqual(3n)
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'getApproved',
        args: [420n],
      }),
    ).toEqual('0x0000000000000000000000000000000000000000')
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'isApprovedForAll',
        args: [
          '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
          '0x0000000000000000000000000000000000000000',
        ],
      }),
    ).toEqual(false)
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'name',
      }),
    ).toEqual('wagmi')
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'ownerOf',
        args: [420n],
      }),
    ).toEqual('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC')
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'supportsInterface',
        args: ['0x1a452251'],
      }),
    ).toEqual(false)
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'symbol',
      }),
    ).toEqual('WAGMI')
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'tokenURI',
        args: [420n],
      }),
    ).toMatchInlineSnapshot(
      '"data:application/json;base64,eyJuYW1lIjogIndhZ21pICM0MjAiLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhkcFpIUm9QU0l4TURJMElpQm9aV2xuYUhROUlqRXdNalFpSUdacGJHdzlJbTV2Ym1VaVBqeHdZWFJvSUdacGJHdzlJbWh6YkNneE1UY3NJREV3TUNVc0lERXdKU2tpSUdROUlrMHdJREJvTVRBeU5IWXhNREkwU0RCNklpQXZQanhuSUdacGJHdzlJbWh6YkNneU9EZ3NJREV3TUNVc0lEa3dKU2tpUGp4d1lYUm9JR1E5SWswNU1ETWdORE0zTGpWak1DQTVMakV4TXkwM0xqTTRPQ0F4Tmk0MUxURTJMalVnTVRZdU5YTXRNVFl1TlMwM0xqTTROeTB4Tmk0MUxURTJMalVnTnk0ek9EZ3RNVFl1TlNBeE5pNDFMVEUyTGpVZ01UWXVOU0EzTGpNNE55QXhOaTQxSURFMkxqVjZUVFk1T0M0MU1qa2dOVFkyWXpZdU9USXhJREFnTVRJdU5UTXROUzQxT1RZZ01USXVOVE10TVRJdU5YWXROVEJqTUMwMkxqa3dOQ0ExTGpZd09TMHhNaTQxSURFeUxqVXlPUzB4TWk0MWFESTFMakExT1dNMkxqa3lJREFnTVRJdU5USTVJRFV1TlRrMklERXlMalV5T1NBeE1pNDFkalV3WXpBZ05pNDVNRFFnTlM0Mk1Ea2dNVEl1TlNBeE1pNDFNeUF4TWk0MWN6RXlMalV5T1MwMUxqVTVOaUF4TWk0MU1qa3RNVEl1TlhZdE5UQmpNQzAyTGprd05DQTFMall3T1MweE1pNDFJREV5TGpVekxURXlMalZvTWpVdU1EVTVZell1T1RJZ01DQXhNaTQxTWprZ05TNDFPVFlnTVRJdU5USTVJREV5TGpWMk5UQmpNQ0EyTGprd05DQTFMall3T1NBeE1pNDFJREV5TGpVeU9TQXhNaTQxYURNM0xqVTRPV00yTGpreUlEQWdNVEl1TlRJNUxUVXVOVGsySURFeUxqVXlPUzB4TWk0MWRpMDNOV013TFRZdU9UQTBMVFV1TmpBNUxURXlMalV0TVRJdU5USTVMVEV5TGpWekxURXlMalV6SURVdU5UazJMVEV5TGpVeklERXlMalYyTlRZdU1qVmhOaTR5TmpRZ05pNHlOalFnTUNBeElERXRNVEl1TlRJNUlEQldORGM0TGpWak1DMDJMamt3TkMwMUxqWXdPUzB4TWk0MUxURXlMalV6TFRFeUxqVklOams0TGpVeU9XTXROaTQ1TWlBd0xURXlMalV5T1NBMUxqVTVOaTB4TWk0MU1qa2dNVEl1TlhZM05XTXdJRFl1T1RBMElEVXVOakE1SURFeUxqVWdNVEl1TlRJNUlERXlMalY2SWlBdlBqeHdZWFJvSUdROUlrMHhOVGN1TmpVMUlEVTBNV010Tmk0NU16SWdNQzB4TWk0MU5USXROUzQxT1RZdE1USXVOVFV5TFRFeUxqVjJMVFV3WXpBdE5pNDVNRFF0TlM0Mk1Ua3RNVEl1TlMweE1pNDFOVEV0TVRJdU5WTXhNakFnTkRjeExqVTVOaUF4TWpBZ05EYzRMalYyTnpWak1DQTJMamt3TkNBMUxqWXlJREV5TGpVZ01USXVOVFV5SURFeUxqVm9NVFV3TGpZeVl6WXVPVE16SURBZ01USXVOVFV5TFRVdU5UazJJREV5TGpVMU1pMHhNaTQxZGkwMU1HTXdMVFl1T1RBMElEVXVOakU1TFRFeUxqVWdNVEl1TlRVeUxURXlMalZvTVRRMExqTTBOV016TGpRMk5TQXdJRFl1TWpjMklESXVOems0SURZdU1qYzJJRFl1TWpWekxUSXVPREV4SURZdU1qVXROaTR5TnpZZ05pNHlOVWd6TWpBdU9ESTRZeTAyTGprek15QXdMVEV5TGpVMU1pQTFMalU1TmkweE1pNDFOVElnTVRJdU5YWXpOeTQxWXpBZ05pNDVNRFFnTlM0Mk1Ua2dNVEl1TlNBeE1pNDFOVElnTVRJdU5XZ3hOVEF1TmpKak5pNDVNek1nTUNBeE1pNDFOVEl0TlM0MU9UWWdNVEl1TlRVeUxURXlMalYyTFRjMVl6QXROaTQ1TURRdE5TNDJNVGt0TVRJdU5TMHhNaTQxTlRJdE1USXVOVWd5T0RNdU1UY3lZeTAyTGprek1pQXdMVEV5TGpVMU1TQTFMalU1TmkweE1pNDFOVEVnTVRJdU5YWTFNR013SURZdU9UQTBMVFV1TmpFNUlERXlMalV0TVRJdU5UVXlJREV5TGpWb0xUSTFMakV3TTJNdE5pNDVNek1nTUMweE1pNDFOVEl0TlM0MU9UWXRNVEl1TlRVeUxURXlMalYyTFRVd1l6QXROaTQ1TURRdE5TNDJNaTB4TWk0MUxURXlMalUxTWkweE1pNDFjeTB4TWk0MU5USWdOUzQxT1RZdE1USXVOVFV5SURFeUxqVjJOVEJqTUNBMkxqa3dOQzAxTGpZeE9TQXhNaTQxTFRFeUxqVTFNU0F4TWk0MWFDMHlOUzR4TURSNmJUTXdNUzR5TkRJdE5pNHlOV013SURNdU5EVXlMVEl1T0RFeElEWXVNalV0Tmk0eU56WWdOaTR5TlVnek16a3VOalUxWXkwekxqUTJOU0F3TFRZdU1qYzJMVEl1TnprNExUWXVNamMyTFRZdU1qVnpNaTQ0TVRFdE5pNHlOU0EyTGpJM05pMDJMakkxYURFeE1pNDVOalpqTXk0ME5qVWdNQ0EyTGpJM05pQXlMamM1T0NBMkxqSTNOaUEyTGpJMWVrMDBPVGNnTlRVekxqZ3hPR013SURZdU9USTVJRFV1TmpJNElERXlMalUwTmlBeE1pNDFOekVnTVRJdU5UUTJhREV6TW1FMkxqSTRJRFl1TWpnZ01DQXdJREVnTmk0eU9EWWdOaTR5TnpJZ05pNHlPQ0EyTGpJNElEQWdNQ0F4TFRZdU1qZzJJRFl1TWpjemFDMHhNekpqTFRZdU9UUXpJREF0TVRJdU5UY3hJRFV1TmpFMkxURXlMalUzTVNBeE1pNDFORFpCTVRJdU5UWWdNVEl1TlRZZ01DQXdJREFnTlRBNUxqVTNNU0EyTURSb01UVXdMamcxT0dNMkxqazBNeUF3SURFeUxqVTNNUzAxTGpZeE5pQXhNaTQxTnpFdE1USXVOVFExZGkweE1USXVPVEZqTUMwMkxqa3lPQzAxTGpZeU9DMHhNaTQxTkRVdE1USXVOVGN4TFRFeUxqVTBOVWcxTURrdU5UY3hZeTAyTGprME15QXdMVEV5TGpVM01TQTFMall4TnkweE1pNDFOekVnTVRJdU5UUTFkamMxTGpJM00zcHRNemN1TnpFMExUWXlMamN5TjJNdE5pNDVORE1nTUMweE1pNDFOekVnTlM0Mk1UY3RNVEl1TlRjeElERXlMalUwTlhZeU5TNHdPVEZqTUNBMkxqa3lPU0ExTGpZeU9DQXhNaTQxTkRZZ01USXVOVGN4SURFeUxqVTBObWd4TURBdU5UY3lZell1T1RReklEQWdNVEl1TlRjeExUVXVOakUzSURFeUxqVTNNUzB4TWk0MU5EWjJMVEkxTGpBNU1XTXdMVFl1T1RJNExUVXVOakk0TFRFeUxqVTBOUzB4TWk0MU56RXRNVEl1TlRRMVNEVXpOQzQzTVRSNklpQm1hV3hzTFhKMWJHVTlJbVYyWlc1dlpHUWlJQzgrUEM5blBqd3ZjM1puUGc9PSJ9"',
    )
    expect(
      await readContract(publicClient, {
        ...wagmiContractConfig,
        functionName: 'totalSupply',
      }),
    ).toEqual(558n)
  })
})

test('fake contract address', async () => {
  await expect(() =>
    readContract(publicClient, {
      abi: wagmiContractConfig.abi,
      address: '0x0000000000000000000000000000000000000069',
      functionName: 'totalSupply',
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    "The contract method \\"totalSupply\\" returned no data (\\"0x\\"). This could be due to any of the following:
    - The contract does not have the function \\"totalSupply\\",
    - The parameters passed to the contract function may be invalid, or
    - The address is not a contract.
     
    Contract: 0x0000000000000000000000000000000000000000
    Function: totalSupply()
            > \\"0x\\"

    Version: viem@1.0.2"
  `)
})

// Deploy BAYC Contract
async function deployBAYC() {
  const hash = await deployContract(walletClient, {
    ...baycContractConfig,
    args: ['Bored Ape Wagmi Club', 'BAYC', 69420n, 0n],
    from: accounts[0].address,
  })
  await mine(testClient, { blocks: 1 })
  const { contractAddress } = await getTransactionReceipt(publicClient, {
    hash,
  })
  return { contractAddress }
}