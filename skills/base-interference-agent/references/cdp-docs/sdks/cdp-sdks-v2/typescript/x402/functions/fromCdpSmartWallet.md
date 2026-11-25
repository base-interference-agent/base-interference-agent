> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# fromCdpSmartWallet

```ts theme={null}
function fromCdpSmartWallet(account: CdpSmartAccount): ClientEvmSigner;
```

Defined in: [account-signers.ts:78](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/account-signers.ts#L78)

Converts a CDP Smart Account (EvmSmartAccount) into an x402-compatible signer.

CDP Smart Accounts differ from EOAs in that their `signTypedData` requires a
`network` parameter. This adapter derives the network automatically from the
EIP-712 domain's `chainId`.

## Parameters

### account

[`CdpSmartAccount`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/index#cdpsmartaccount)

A CDP Smart Account from `cdpClient.evm.getOrCreateSmartAccount()`

## Returns

`ClientEvmSigner`

A `ClientEvmSigner` compatible with `@x402/evm`'s `registerExactEvmScheme`
