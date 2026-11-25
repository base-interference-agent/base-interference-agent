> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# normalizePayee

```ts theme={null}
function normalizePayee(network: string, payee: string): string;
```

Defined in: [guardrails/normalize.ts:63](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/normalize.ts#L63)

Normalizes a payee address for allow-list comparisons.

EVM addresses are lower-cased; Solana addresses are returned unchanged.

## Parameters

### network

`string`

The network the payee is on.

### payee

`string`

The payee address to normalize.

## Returns

`string`

The normalized payee address.
