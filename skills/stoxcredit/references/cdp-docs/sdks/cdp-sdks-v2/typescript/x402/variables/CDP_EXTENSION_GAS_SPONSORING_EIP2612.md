> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# CDP_EXTENSION_GAS_SPONSORING_EIP2612

```ts theme={null}
const CDP_EXTENSION_GAS_SPONSORING_EIP2612: "eip2612GasSponsoring";
```

Defined in: [server-extensions.ts:41](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server-extensions.ts#L41)

Extension key for EIP-2612 gas-sponsored Permit2 payments.

When advertised in `PaymentRequired.extensions`, the x402 EVM client
automatically signs an EIP-2612 permit if Permit2 allowance is insufficient
— the CDP Facilitator submits the permit transaction, covering the user's gas.
