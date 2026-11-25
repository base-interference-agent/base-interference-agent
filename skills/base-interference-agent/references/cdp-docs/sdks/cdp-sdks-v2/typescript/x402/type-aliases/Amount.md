> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Amount

```ts theme={null}
type Amount = {
  atomic: bigint | string;
  asset?: Asset;
};
```

Defined in: [guardrails/types.ts:31](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L31)

A payment amount in base units (the smallest denomination for the asset),
optionally scoped to a specific asset.

* `atomic` is a non-negative integer. Strings are accepted for convenience.
* `asset` is optional but recommended. When set, caps and totals are scoped to that asset.

## Example

```ts theme={null}
const cap: Amount = {
  atomic: 1_000_000n,
  asset: "0x036cbd53842c5426634e7929541ec2318f3dcf7e",
};
```

## Properties

### atomic

```ts theme={null}
atomic: bigint | string;
```

Defined in: [guardrails/types.ts:32](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L32)

***

### asset?

```ts theme={null}
optional asset: Asset;
```

Defined in: [guardrails/types.ts:33](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L33)
