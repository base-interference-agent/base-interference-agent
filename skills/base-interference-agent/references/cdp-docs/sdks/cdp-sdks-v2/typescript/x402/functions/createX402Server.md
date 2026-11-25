> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# createX402Server

```ts theme={null}
function createX402Server(config: CdpX402ServerConfig): Promise<X402Server>;
```

Defined in: [server.ts:1139](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server.ts#L1139)

Creates and initializes a CDP-powered x402 resource server.

Returns an `X402Server` which **extends** `x402HTTPResourceServer` and can
be passed directly to `paymentMiddlewareFromHTTPServer` or any other
framework adapter.

All credential fields fall back to environment variables; an empty `{}`
with a `routes` map is sufficient in most environments.

Pass `payToConfig: { type: "address", evm: "0x...", solana: "..." }` to
provide your own receiver addresses without provisioning a CDP wallet.

## Parameters

### config

[`CdpX402ServerConfig`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/index#cdpx402serverconfig)

Credential, wallet, and route configuration. All credential fields
fall back to environment variables; `routes` is the only required field (or
`configPath` pointing to a JSON file that supplies routes).

## Returns

`Promise`\<[`X402Server`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/classes/X402Server)>

A fully initialized `X402Server` ready to be passed to any framework middleware.

## Examples

```typescript theme={null}
// Set: CDP_API_KEY_ID, CDP_API_KEY_SECRET, CDP_WALLET_SECRET
const server = await createX402Server({
  routes: {
    "GET /report": { price: "$0.01", description: "AI-generated report" },
  },
});
app.use(paymentMiddlewareFromHTTPServer(server));
console.log("EVM receiver:", server.payToEvmAddress);
```

```typescript theme={null}
const server = await createX402Server({
  routes: { "GET /report": { price: "$0.01" } },
  payToConfig: { type: "address", evm: "0x1234...", solana: "ABC..." },
});
```

```typescript theme={null}
const server = await createX402Server({
  routes: {
    "GET /report": {
      accepts: { scheme: "exact", price: "$0.01", network: "eip155:8453", payTo: "" },
    },
  },
});
```

```typescript theme={null}
// x402.config.json: { "routes": { "GET /report": { "price": "$0.01" } } }
const server = await createX402Server({ configPath: "./x402.config.json" });
```
