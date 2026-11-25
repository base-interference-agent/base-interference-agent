> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Build on Base

> Build financial products on Base by outcome: integrate DeFi, tokenize assets, issue stablecoins, accept payments, or run private transactions.

Build with native Base standards or integrate protocols already deployed on the network. Pick the financial outcome you need, then follow a short guide for the specific action your product performs.

## Solutions

> [card] [Integrate DeFi](https://docs.base.org/get-started/integrate-defi.md)
>
> Add trading, plus lending, borrowing, and earn products through the Base Earn API.

> [card] [Tokenize Assets](https://docs.base.org/get-started/issue-rwa.md)
>
> Represent real-world assets with B20 Asset issuance, holder controls, and distributions.

> [card] [Issue Stablecoins](https://docs.base.org/get-started/issue-stablecoins.md)
>
> Launch a fiat-backed token with minting, compliance, and reconciliation built in.

> [card] [Accept Payments](https://docs.base.org/get-started/accept-payments.md)
>
> Build the full payment lifecycle: request, authorize, capture, verify, refund, reconcile, and pay out.

> [card] [Private Transactions](https://docs.base.org/get-started/private-transactions.md)
>
> Settle onchain with confidentiality using Base Ledgers.

> [card] [Test on Vibenet](https://docs.base.org/build-on-base/test-on-vibenet.md)
>
> Try everything on a disposable, fully-featured test network.

## Build for Coinbase Wallet

Coinbase Wallet (formerly the Base App) no longer supports mini apps. It treats every app as a standard web app and opens it in its in-app browser, the same way other self-custody wallets do. Farcaster manifests have no effect.

To make your app work in Coinbase Wallet, build a regular web app that connects to the user's wallet with standard Ethereum libraries such as [wagmi](https://wagmi.sh) and [viem](https://viem.sh). You don't need MiniKit, the Farcaster SDK, or a `farcaster.json` manifest. See [Migrated and Deprecated Products](https://docs.base.org/sdks/migrated-products.md#minikit-and-mini-apps).

## Build the Foundation

> [card] [Chain](https://docs.base.org/specifications/overview.md)
>
> Network details, node operations, and protocol specs.

> [card] [SDKs & APIs](https://docs.base.org/base-chain/api-reference/rpc-overview.md)
>
> JSON-RPC and SDK reference.
