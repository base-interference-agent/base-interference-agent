> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# normalizeNetwork

```ts theme={null}
function normalizeNetwork(network: string): `${string}:${string}`;
```

Defined in: [guardrails/normalize.ts:39](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/normalize.ts#L39)

Converts a network identifier to its canonical CAIP-2 form.

Accepts CAIP-2 strings (`"eip155:8453"`) and legacy short forms
(`"base"`, `"base-sepolia"`, `"solana-devnet"`, …).

## Parameters

### network

`string`

The network identifier to normalize.

## Returns

`` `${string}:${string}` ``

The canonical CAIP-2 network identifier.

## Throws

`"network_not_allowed"` if the input is not recognized.
