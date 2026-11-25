> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# getCdpExtensionRegistrations

```ts theme={null}
function getCdpExtensionRegistrations(): ResourceServerExtension[];
```

Defined in: [server-extensions.ts:241](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server-extensions.ts#L241)

Returns `ResourceServerExtension` registrations for all CDP-supported extensions.

These register enrichment handlers on `x402ResourceServer` so that routes
whose `extensions` include a CDP extension key get the correct
`PaymentRequired.extensions[key]` value.

`createX402Server()` calls this automatically. Call it manually only when
building a resource server without `createX402Server`:

```typescript theme={null}
import { x402ResourceServer } from "@x402/core/server";
import { getCdpExtensionRegistrations } from "@coinbase/cdp-sdk/x402";

const server = new x402ResourceServer(facilitatorClient);
for (const ext of getCdpExtensionRegistrations()) {
  server.registerExtension(ext);
}
```

## Returns

`ResourceServerExtension`\[]

Array of `ResourceServerExtension` registrations for gas-sponsoring and Bazaar.
