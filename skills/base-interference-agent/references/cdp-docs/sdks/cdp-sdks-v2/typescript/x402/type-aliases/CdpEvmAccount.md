> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# CdpEvmAccount

```ts theme={null}
type CdpEvmAccount = Pick<EvmAccount, "address" | "signTypedData">;
```

Defined in: [account-signers.ts:20](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/account-signers.ts#L20)

The subset of a CDP EVM server account (EOA) required to sign x402 payments.
Derived from the SDK's EvmAccount type so the adapter stays in sync
with the real account surface.
