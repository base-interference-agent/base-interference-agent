> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# SpendControlErrorDetails

```ts theme={null}
type SpendControlErrorDetails = {
  attempted?: string;
  limit?: string;
  asset?: Asset;
  network?: Network | string;
  payTo?: Address;
  input?: unknown;
};
```

Defined in: [guardrails/types.ts:66](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L66)

Structured context attached to a [SpendControlError](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/classes/SpendControlError).

## Properties

### attempted?

```ts theme={null}
optional attempted: string;
```

Defined in: [guardrails/types.ts:67](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L67)

***

### limit?

```ts theme={null}
optional limit: string;
```

Defined in: [guardrails/types.ts:68](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L68)

***

### asset?

```ts theme={null}
optional asset: Asset;
```

Defined in: [guardrails/types.ts:69](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L69)

***

### network?

```ts theme={null}
optional network: Network | string;
```

Defined in: [guardrails/types.ts:70](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L70)

***

### payTo?

```ts theme={null}
optional payTo: Address;
```

Defined in: [guardrails/types.ts:71](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L71)

***

### input?

```ts theme={null}
optional input: unknown;
```

Defined in: [guardrails/types.ts:72](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L72)
