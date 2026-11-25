> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# fromCdpEvmAccount

```ts theme={null}
function fromCdpEvmAccount(account: CdpEvmAccount): ClientEvmSigner;
```

Defined in: [account-signers.ts:28](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/account-signers.ts#L28)

Converts a CDP EVM server account (EOA) into an x402-compatible signer.

## Parameters

### account

[`CdpEvmAccount`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/CdpEvmAccount)

A CDP EVM account from `cdpClient.evm.getOrCreateAccount()`

## Returns

`ClientEvmSigner`

A `ClientEvmSigner` compatible with `@x402/evm`'s `registerExactEvmScheme`
