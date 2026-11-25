> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# CDP_EXTENSION_BAZAAR

```ts theme={null}
const CDP_EXTENSION_BAZAAR: "bazaar";
```

Defined in: [server-extensions.ts:59](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server-extensions.ts#L59)

Extension key for Bazaar resource discovery.

Auto-injected by `createX402Server` with a minimal `DiscoveryExtension`
built from the route key (HTTP method + path template). Override by
providing `extensions.bazaar` in your route config with richer metadata
(queryParams, body example, output schema, etc.).
