> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# SpendControlError

Defined in: [guardrails/types.ts:78](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L78)

Thrown when a payment is blocked by the configured spend controls.

## Extends

* `Error`

## Constructors

### Constructor

```ts theme={null}
new SpendControlError(
   code: SpendControlErrorCode, 
   message: string, 
   details?: SpendControlErrorDetails): SpendControlError;
```

Defined in: [guardrails/types.ts:92](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L92)

Creates a SpendControlError with the given code and message.

#### Parameters

##### code

[`SpendControlErrorCode`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/SpendControlErrorCode)

The error code identifying the violation type.

##### message

`string`

Human-readable error message.

##### details?

[`SpendControlErrorDetails`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/type-aliases/SpendControlErrorDetails) = `{}`

Optional structured context for the error.

#### Returns

`SpendControlError`

#### Overrides

```ts theme={null}
Error.constructor
```

## Properties

### code

```ts theme={null}
readonly code: SpendControlErrorCode;
```

Defined in: [guardrails/types.ts:80](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L80)

* Identifies the type of violation.

***

### details

```ts theme={null}
readonly details: SpendControlErrorDetails;
```

Defined in: [guardrails/types.ts:83](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/guardrails/types.ts#L83)

* Structured context for the error (always defined, may be empty).
