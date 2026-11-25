> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# applySpendControls

```ts theme={null}
function applySpendControls(client: x402Client, controls: SpendControls): ResolvedSpendControls;
```

Defined in: [guardrails/apply.ts:209](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/apply.ts#L209)

Attach a [SpendControls](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/SpendControls) configuration to an `x402Client`.

Can only be called once per client — a second call throws
`SpendControlError` (`code: "already_applied"`).

## Parameters

### client

`x402Client`

The client to attach controls to.

### controls

[`SpendControls`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/SpendControls)

The spend controls configuration to apply.

## Returns

[`ResolvedSpendControls`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/ResolvedSpendControls)

A frozen snapshot of the resolved configuration.
