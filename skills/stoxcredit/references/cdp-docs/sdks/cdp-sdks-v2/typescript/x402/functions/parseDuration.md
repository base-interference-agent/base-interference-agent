> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# parseDuration

```ts theme={null}
function parseDuration(input: Duration): number;
```

Defined in: [guardrails/types.ts:197](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L197)

Converts a [Duration](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/Duration) to milliseconds.

Accepts a non-negative number (already in milliseconds) or a shorthand
string: `"500ms"`, `"30s"`, `"5m"`, `"1h"`, `"24h"`, `"7d"`.

## Parameters

### input

[`Duration`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/Duration)

The duration value to parse.

## Returns

`number`

The duration in milliseconds.

## Throws

`"amount_unparseable"` if the input can't be parsed.
