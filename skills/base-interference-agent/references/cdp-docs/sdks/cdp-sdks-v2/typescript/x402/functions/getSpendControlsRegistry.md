> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# getSpendControlsRegistry

```ts theme={null}
function getSpendControlsRegistry(client: x402Client): 
  | SpendControlsRegistry
  | undefined;
```

Defined in: [guardrails/apply.ts:692](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/apply.ts#L692)

Look up the settlement-aware [SpendControlsRegistry](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/index#spendcontrolsregistry) attached to an
`x402Client` by [applySpendControls](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/functions/applySpendControls).

## Parameters

### client

`x402Client`

The x402Client to look up the registry for.

## Returns

\| [`SpendControlsRegistry`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/index#spendcontrolsregistry)
\| `undefined`

The registry, or undefined if spend controls were not applied.
