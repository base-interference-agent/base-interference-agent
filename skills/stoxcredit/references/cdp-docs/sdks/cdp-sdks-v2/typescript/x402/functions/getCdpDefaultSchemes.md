> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# getCdpDefaultSchemes

```ts theme={null}
function getCdpDefaultSchemes(): CdpSchemeRegistration[];
```

Defined in: [server-extensions.ts:187](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server-extensions.ts#L187)

Returns the default CDP scheme registrations:

* `exact` for all EVM networks (`eip155:*`)
* `upto` for all EVM networks (`eip155:*`)
* `exact` for all Solana networks (`solana:*`)

Pass the result to `paymentMiddlewareFromConfig` (Express / Hono) or
any other framework adapter to replicate the same scheme coverage
when building middleware manually.

## Returns

[`CdpSchemeRegistration`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/index#cdpschemeregistration)\[]

Array of scheme+network registrations for EVM (exact+upto) and Solana (exact).

## Example

```typescript theme={null}
import { getCdpDefaultSchemes, createCdpFacilitatorClient } from "@coinbase/cdp-sdk/x402";
import { paymentMiddlewareFromConfig } from "@x402/express";

app.use(paymentMiddlewareFromConfig(routes, createCdpFacilitatorClient(), getCdpDefaultSchemes()));
```
