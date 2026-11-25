> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# getCdpBatchSettlementScheme

```ts theme={null}
function getCdpBatchSettlementScheme(evmAddress: `0x${string}`): CdpSchemeRegistration;
```

Defined in: [server-extensions.ts:206](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server-extensions.ts#L206)

Creates a `batch-settlement` scheme registration for the given EVM receiver address.

Unlike `exact` and `upto`, the `batch-settlement` scheme requires a receiver address at
construction time (the scheme maintains per-channel state keyed to the receiver). Call
this after the receiver wallet has been provisioned and pass the result to
`resourceServer.register()`.

## Parameters

### evmAddress

`` `0x${string}` ``

EVM address of the payment receiver.

## Returns

[`CdpSchemeRegistration`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/index#cdpschemeregistration)

A scheme+network registration for `batch-settlement` on all EVM networks.
