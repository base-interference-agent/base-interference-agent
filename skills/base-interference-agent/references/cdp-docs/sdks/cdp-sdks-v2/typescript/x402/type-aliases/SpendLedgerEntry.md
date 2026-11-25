> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# SpendLedgerEntry

```ts theme={null}
type SpendLedgerEntry = {
  atomicAmount: bigint;
  asset: Asset;
  network: Network;
  payTo: Address;
  at: number;
};
```

Defined in: [guardrails/types.ts:108](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L108)

A single recorded payment in the spend ledger.

## Properties

### atomicAmount

```ts theme={null}
atomicAmount: bigint;
```

Defined in: [guardrails/types.ts:109](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L109)

***

### asset

```ts theme={null}
asset: Asset;
```

Defined in: [guardrails/types.ts:110](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L110)

***

### network

```ts theme={null}
network: Network;
```

Defined in: [guardrails/types.ts:111](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L111)

***

### payTo

```ts theme={null}
payTo: Address;
```

Defined in: [guardrails/types.ts:112](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L112)

***

### at

```ts theme={null}
at: number;
```

Defined in: [guardrails/types.ts:113](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L113)
