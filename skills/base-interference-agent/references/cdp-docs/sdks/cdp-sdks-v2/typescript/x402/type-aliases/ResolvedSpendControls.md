> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# ResolvedSpendControls

```ts theme={null}
type ResolvedSpendControls = Readonly<{
  maxAmountPerPayment?: {
     atomic: bigint;
     asset?: string;
  };
  maxCumulativeSpend?: {
     atomic: bigint;
     asset?: string;
  };
  maxCumulativeSpendWindowMs?: number;
  allowedNetworks: ReadonlySet<Network>;
  allowedAssets: ReadonlySet<Asset>;
  allowedPayees: ReadonlySet<Address>;
  approachingLimitThresholds: ReadonlyArray<number>;
  onApproachingLimit?: (spent: Amount, limit: Amount) => void;
  tracker: SpendTracker;
}>;
```

Defined in: [guardrails/apply.ts:70](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/apply.ts#L70)

The active spend controls configuration after defaults are filled in.
