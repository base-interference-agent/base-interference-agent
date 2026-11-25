> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# createCdpFacilitatorClient

```ts theme={null}
function createCdpFacilitatorClient(args?: CdpFacilitatorClientArgs): HTTPFacilitatorClient;
```

Defined in: [facilitator.ts:180](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/facilitator.ts#L180)

Creates a CDP-authenticated x402 facilitator client.

The returned client is pre-configured with the CDP hosted facilitator URL
and CDP JWT-based authentication. It implements the `HTTPFacilitatorClient`
interface from `@x402/core/server` and can be passed directly to
`x402ResourceServer` as a drop-in replacement for a self-hosted facilitator.

Credentials are resolved in order: explicit args → `CDP_API_KEY_ID` /
`CDP_API_KEY_SECRET` environment variables.

## Parameters

### args?

[`CdpFacilitatorClientArgs`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/index#cdpfacilitatorclientargs)

Optional credential overrides.

## Returns

`HTTPFacilitatorClient`

A configured `HTTPFacilitatorClient` ready for use with `x402ResourceServer`.

## Throws

If neither explicit args nor environment variables provide credentials.

## Examples

Drop-in replacement for a self-hosted facilitator:

```typescript theme={null}
import { createCdpFacilitatorClient } from "@coinbase/cdp-sdk/x402";
import { x402ResourceServer } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";

// Set CDP_API_KEY_ID and CDP_API_KEY_SECRET in your environment
const facilitator = createCdpFacilitatorClient();

const server = new x402ResourceServer(facilitator)
  .register("eip155:8453", new ExactEvmScheme());
```

Explicit credentials:

```typescript theme={null}
const facilitator = createCdpFacilitatorClient({
  apiKeyId: "my-key-id",
  apiKeySecret: "my-key-secret",
});
```
