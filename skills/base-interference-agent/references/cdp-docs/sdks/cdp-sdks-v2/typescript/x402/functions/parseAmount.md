> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# parseAmount

```ts theme={null}
function parseAmount(value: 
  | string
  | bigint
  | Amount, asset?: string): {
  atomic: bigint;
  asset?: string;
};
```

Defined in: [guardrails/types.ts:231](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L231)

Parses an amount into `{ atomic: bigint; asset?: string }`.

## Parameters

### value

The amount value to parse (bigint, string, or Amount object).

`string` | `bigint` | [`Amount`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/Amount)

### asset?

`string`

Optional asset identifier to scope the amount.

## Returns

```ts theme={null}
{
  atomic: bigint;
  asset?: string;
}
```

Parsed amount with atomic bigint value and optional asset.

### atomic

```ts theme={null}
atomic: bigint;
```

### asset?

```ts theme={null}
optional asset: string;
```

## Throws

`"amount_unparseable"` on bad input.
