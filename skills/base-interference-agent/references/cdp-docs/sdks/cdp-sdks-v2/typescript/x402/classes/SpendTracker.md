> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# SpendTracker

Defined in: [guardrails/spend-tracker.ts:123](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/spend-tracker.ts#L123)

Tracks spend per asset in an append-only ledger.

## Constructors

### Constructor

```ts theme={null}
new SpendTracker(options?: SpendTrackerOptions): SpendTracker;
```

Defined in: [guardrails/spend-tracker.ts:133](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/spend-tracker.ts#L133)

Creates a new SpendTracker.

#### Parameters

##### options?

[`SpendTrackerOptions`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/index#spendtrackeroptions) = `{}`

Optional configuration for the tracker.

#### Returns

`SpendTracker`

## Methods

### record()

```ts theme={null}
record(input: RecordSpendInput): Promise<SpendLedgerEntry>;
```

Defined in: [guardrails/spend-tracker.ts:151](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/spend-tracker.ts#L151)

Adds a spend entry to the ledger and returns it.

#### Parameters

##### input

[`RecordSpendInput`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/index#recordspendinput)

The spend record to add.

#### Returns

`Promise`\<[`SpendLedgerEntry`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/SpendLedgerEntry)>

The recorded ledger entry.

***

### total()

```ts theme={null}
total(query: TotalSpendQuery): Promise<bigint>;
```

Defined in: [guardrails/spend-tracker.ts:187](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/spend-tracker.ts#L187)

Sum atomic amounts for the given asset, optionally restricted to entries
recorded at or after `since`.

#### Parameters

##### query

[`TotalSpendQuery`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/index#totalspendquery)

Query parameters specifying asset and optional time window.

#### Returns

`Promise`\<`bigint`>

The total atomic amount spent.

***

### prune()

```ts theme={null}
prune(now: number, windowMs?: number): Promise<void>;
```

Defined in: [guardrails/spend-tracker.ts:207](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/spend-tracker.ts#L207)

Drop entries older than `now - windowMs`.

#### Parameters

##### now

`number`

Current timestamp in milliseconds.

##### windowMs?

`number`

Optional rolling window size in milliseconds.

#### Returns

`Promise`\<`void`>

***

### removeEntry()

```ts theme={null}
removeEntry(entry: SpendLedgerEntry): Promise<void>;
```

Defined in: [guardrails/spend-tracker.ts:220](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/spend-tracker.ts#L220)

Removes a previously recorded entry, undoing its contribution to the cumulative total.

#### Parameters

##### entry

[`SpendLedgerEntry`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/SpendLedgerEntry)

The ledger entry to remove.

#### Returns

`Promise`\<`void`>

***

### entries()

```ts theme={null}
entries(): Promise<readonly SpendLedgerEntry[]>;
```

Defined in: [guardrails/spend-tracker.ts:240](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/spend-tracker.ts#L240)

Returns all current ledger entries as a read-only snapshot.

#### Returns

`Promise`\<readonly [`SpendLedgerEntry`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/SpendLedgerEntry)\[]>

All current entries.
