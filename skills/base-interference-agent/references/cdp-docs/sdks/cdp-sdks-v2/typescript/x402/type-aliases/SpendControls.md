> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# SpendControls

```ts theme={null}
type SpendControls = {
  maxAmountPerPayment?: Amount;
  maxCumulativeSpend?: Amount;
  maxCumulativeSpendWindow?: Duration;
  allowedNetworks?: Network[];
  allowedAssets?: Asset[];
  allowedPayees?: Address[];
  onApproachingLimit?: (spent: Amount, limit: Amount) => void;
  approachingLimitThresholds?: number[];
  maxLedgerEntries?: number;
  store?: SpendStore;
};
```

Defined in: [guardrails/types.ts:153](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L153)

Configuration for spend controls. All fields are optional.

## Example

```ts theme={null}
const USDC_BASE = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
const controls: SpendControls = {
  maxAmountPerPayment: { atomic: 10_000n, asset: USDC_BASE },
  maxCumulativeSpend: { atomic: 50_000n, asset: USDC_BASE },
  maxCumulativeSpendWindow: "24h",
  allowedNetworks: ["eip155:8453"],
};
```

## Properties

### maxAmountPerPayment?

```ts theme={null}
optional maxAmountPerPayment: Amount;
```

Defined in: [guardrails/types.ts:160](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L160)

Hard per-payment cap. If `asset` is set the cap only applies to payments in
that asset — payments in any other asset are left uncapped by this field
(atomic units are not comparable across assets with different decimals).
Omit `asset` to cap every payment by raw atomic amount.

***

### maxCumulativeSpend?

```ts theme={null}
optional maxCumulativeSpend: Amount;
```

Defined in: [guardrails/types.ts:166](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L166)

Rolling cumulative cap. Unlike `maxAmountPerPayment`, `asset` is required
(enforced when spend controls are applied) because cross-asset atomic units
cannot be summed.

***

### maxCumulativeSpendWindow?

```ts theme={null}
optional maxCumulativeSpendWindow: Duration;
```

Defined in: [guardrails/types.ts:167](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L167)

***

### allowedNetworks?

```ts theme={null}
optional allowedNetworks: Network[];
```

Defined in: [guardrails/types.ts:168](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L168)

***

### allowedAssets?

```ts theme={null}
optional allowedAssets: Asset[];
```

Defined in: [guardrails/types.ts:169](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L169)

***

### allowedPayees?

```ts theme={null}
optional allowedPayees: Address[];
```

Defined in: [guardrails/types.ts:170](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L170)

***

### onApproachingLimit()?

```ts theme={null}
optional onApproachingLimit: (spent: Amount, limit: Amount) => void;
```

Defined in: [guardrails/types.ts:171](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L171)

#### Parameters

##### spent

[`Amount`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/Amount)

##### limit

[`Amount`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/Amount)

#### Returns

`void`

***

### approachingLimitThresholds?

```ts theme={null}
optional approachingLimitThresholds: number[];
```

Defined in: [guardrails/types.ts:172](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L172)

***

### maxLedgerEntries?

```ts theme={null}
optional maxLedgerEntries: number;
```

Defined in: [guardrails/types.ts:173](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L173)

***

### store?

```ts theme={null}
optional store: SpendStore;
```

Defined in: [guardrails/types.ts:174](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L174)
