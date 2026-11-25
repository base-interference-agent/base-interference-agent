> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# buildBazaarDeclaration

```ts theme={null}
function buildBazaarDeclaration(method: string, path: string): Record<string, unknown>;
```

Defined in: [server-extensions.ts:113](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server-extensions.ts#L113)

Builds a minimal Bazaar `DiscoveryExtension` declaration from an HTTP method
and path template. It carries enough information for Bazaar to index the route;
users who need richer metadata (queryParams, body example, output schema, path-param
types) should override by setting `extensions.bazaar` explicitly in their route
config.

Wire shape follows `github.com/x402-foundation/x402/go/extensions/bazaar`:

* GET/HEAD/DELETE → `QueryInput`  (`{ type, method }`)
* POST/PUT/PATCH  → `BodyInput`   (`{ type, method, bodyType: "json", body: {} }`)

For body methods `body` is required by the Bazaar `BodyDiscoveryInfo` contract
(`body: Record<string, unknown>`). An empty object is used since the route's
body shape is not known at declaration time; users who need a richer schema
should override `extensions.bazaar` in their route config.

## Parameters

### method

`string`

Uppercase HTTP verb, e.g. `"GET"` or `"POST"`.

### path

`string`

Path template, e.g. `"/report"` or `"/users/:id"`.

## Returns

`Record`\<`string`, `unknown`>

A Bazaar `DiscoveryExtension` declaration object.
