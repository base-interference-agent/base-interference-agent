> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# CDP_SUPPORTED_EXTENSIONS

```ts theme={null}
const CDP_SUPPORTED_EXTENSIONS: Record<string, unknown>;
```

Defined in: [server-extensions.ts:79](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server-extensions.ts#L79)

Static extension declarations that `createX402Server` injects into every
route regardless of route-specific metadata.

Both gas-sponsoring entries are present. Their presence signals to the x402
EVM client that the CDP Facilitator can cover Permit2 gas costs; the client
only activates the path when `requirements.extra.assetTransferMethod` is
`"permit2"`, so the declarations are harmless for EIP-3009 and Solana routes.

Bazaar is NOT in this set — it is injected separately because it requires
per-route metadata (HTTP method, path template) to build its declaration.
