> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# X402Server

Defined in: [server.ts:843](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server.ts#L843)

A CDP-powered x402 resource server that **extends** `x402HTTPResourceServer`.

It is a drop-in replacement anywhere an `x402HTTPResourceServer` is
expected — pass it directly to `paymentMiddlewareFromHTTPServer`, Hono /
Next.js adapters, or any other framework integration.

Use `createX402Server()` (or `X402Server.create()`) to obtain an initialized
instance. The constructor is intentionally private; call the factory instead.

In addition to the full `x402HTTPResourceServer` surface (`initialize()`,
`processHTTPRequest()`, `processSettlement()`, `requiresPayment()`, etc.)
this class exposes `payToEvmAddress` and `payToSvmAddress` for the
provisioned receiver wallets.

## Extends

* `x402HTTPResourceServer`

## Properties

### payToEvmAddress

```ts theme={null}
readonly payToEvmAddress: `0x${string}` | undefined;
```

Defined in: [server.ts:849](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server.ts#L849)

EVM address of the receiver wallet. `undefined` when no EVM wallet was
provisioned (no `eip155:*` route, and `payToConfig` did not supply an
`evm` address).

***

### payToSvmAddress

```ts theme={null}
readonly payToSvmAddress: string | undefined;
```

Defined in: [server.ts:855](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server.ts#L855)

Solana address of the provisioned receiver wallet. `undefined` when no
Solana wallet was provisioned (no `solana:*` route, and `payToConfig` did
not supply a `solana` address).

***

### ownerWallet

```ts theme={null}
readonly ownerWallet: string | undefined;
```

Defined in: [server.ts:860](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server.ts#L860)

Owner account name for `"smart"` receiver wallets, otherwise `undefined`.
Only set when `payToConfig.type` is `"smart"`.

## Accessors

### resourceServer

#### Get Signature

```ts theme={null}
get resourceServer(): x402ResourceServer;
```

Defined in: [server.ts:894](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server.ts#L894)

The underlying `x402ResourceServer` with EVM and Solana schemes registered.

##### Returns

`x402ResourceServer`

The `x402ResourceServer` instance used by this server.

## Methods

### create()

```ts theme={null}
static create(config: CdpX402ServerConfig): Promise<X402Server>;
```

Defined in: [server.ts:910](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server.ts#L910)

Provisions CDP receiver wallets (unless `payToConfig.type` is `"address"`),
resolves routes, constructs the HTTP resource server, and syncs supported
schemes with the CDP facilitator.

This is the async entry point for `X402Server`. Prefer the module-level
`createX402Server()` wrapper for convenience.

#### Parameters

##### config

[`CdpX402ServerConfig`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/index#cdpx402serverconfig)

Credential, wallet, and route configuration.

#### Returns

`Promise`\<`X402Server`>

A fully initialized `X402Server` instance ready to be passed to
any framework middleware.

***

### initialize()

```ts theme={null}
initialize(): Promise<void>;
```

Defined in: [server.ts:1068](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server.ts#L1068)

Initializes the underlying resource server (facilitator support sync +
route validation) exactly once.

`createX402Server()` already calls this before returning, and framework
adapters such as `paymentMiddlewareFromHTTPServer` call `initialize()`
again on startup. The base implementation re-fetches facilitator support
on every call, so this override memoizes the first run to avoid a redundant
facilitator round-trip. The promise is cleared on failure so a later call
can retry.

#### Returns

`Promise`\<`void`>

A promise that resolves once initialization has completed.

#### Overrides

```ts theme={null}
x402HTTPResourceServer.initialize
```
