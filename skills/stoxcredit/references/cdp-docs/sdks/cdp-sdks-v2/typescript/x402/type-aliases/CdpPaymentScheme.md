> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# CdpPaymentScheme

```ts theme={null}
type CdpPaymentScheme = "exact" | "upto" | "batch-settlement";
```

Defined in: [server.ts:155](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server.ts#L155)

Payment scheme identifiers supported by the simplified CDP route format.

* `"exact"` — (default) Transfer a fixed amount, locked at signing time.
  Supports EVM and Solana networks.
* `"upto"` — Usage-based billing: the client authorizes a maximum amount
  and the server settles the actual amount charged (≤ max) via Permit2.
  EVM-only (`eip155:*`).
* `"batch-settlement"` — High-throughput stateful payment channels. Clients
  deposit once and sign off-chain vouchers per request. EVM-only (`eip155:*`).
