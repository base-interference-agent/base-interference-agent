> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# normalizeAsset

```ts theme={null}
function normalizeAsset(asset: string): string;
```

Defined in: [guardrails/normalize.ts:83](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/normalize.ts#L83)

Normalizes an asset identifier for allow-list comparisons.

EVM contract addresses (`0x` + 40 hex chars) are lower-cased. Everything
else (Solana mints, symbolic names) is returned unchanged.

## Parameters

### asset

`string`

The asset identifier to normalize.

## Returns

`string`

The normalized asset identifier.
