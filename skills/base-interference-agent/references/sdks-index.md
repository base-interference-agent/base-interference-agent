# Base SDKs, APIs, and docs index

Source: https://docs.base.org/sdks/overview and https://docs.base.org/llms.txt.
This is an index, not the page contents. To answer a detailed question, fetch the
linked page (the `.md` URL) and answer from it.

## Products on the SDKs overview
- **Base Chain API**: JSON-RPC, WebSocket subscriptions, and debug tracing against Base nodes. https://docs.base.org/base-chain/api-reference/rpc-overview.md
- **Base Earn API**: earn and borrow on Base from any wallet, using unsigned transactions ready to sign. https://docs.base.org/sdks/base-earn/overview.md
- **Base Verify API**: prove verified account ownership and enforce Sybil-resistant eligibility policies. https://docs.base.org/sdks/base-verify/overview.md
- **Foundry for Base**: build and test Base-native contracts locally with Foundry v1.8.4 or later. https://docs.base.org/sdks/base-anvil.md
- **Tokenized Stocks API**: https://docs.base.org/sdks/tokenized-stocks/overview.md
- **Retired or moved products** (OnchainKit, MiniKit and mini apps, Base Account SDK, Base MCP): https://docs.base.org/sdks/migrated-products.md

## Which page for which question
- Ethereum JSON-RPC: https://docs.base.org/base-chain/api-reference/rpc-overview.md
- eth_subscribe: https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_subscribe.md
- Debug API, debug_traceTransaction: https://docs.base.org/base-chain/api-reference/debug-api/debug_traceTransaction.md
- Migrate from Flashblocks: https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md
- Build on Base overview: https://docs.base.org/build-on-base/overview.md

## Base Earn API (lend, borrow, vaults)
- Concepts: /sdks/base-earn/concepts.md
- Call the API: /sdks/base-earn/call-the-api.md
- Execute calls in a wallet: /sdks/base-earn/execute-calls.md
- Lend example: /sdks/base-earn/lend-example.md
- Morpho borrow: /sdks/base-earn/morpho-borrow.md
- Endpoints: list vaults (/api-reference/list-vaults.md), list positions (/api-reference/list-positions.md), deposit (/api-reference/deposit.md), withdraw (/api-reference/withdraw.md), request withdraw (/api-reference/request-withdraw.md), get redemption (/api-reference/get-redemption.md), claim (/api-reference/claim.md), borrow (/api-reference/borrow.md)
- Errors: /sdks/base-earn/errors.md. FAQ: /sdks/base-earn/faq.md
- All under https://docs.base.org/sdks/base-earn/

## Base Verify API (identity and eligibility)
- Verify social accounts: https://docs.base.org/sdks/base-verify/verify-social-accounts.md
- Verify users onchain: https://docs.base.org/sdks/base-verify/verify-users-onchain.md

## Tokenized Stocks API
- Overview: https://docs.base.org/sdks/tokenized-stocks/overview.md
- Endpoints (under https://docs.base.org/sdks/tokenized-stocks/api-reference/): list-tokenized-stocks, list-protocol-contract-addresses, list-nav-feed-addresses, get-token-total-supply, get-token-metadata, get-token-icon, get-token-prospectus, list-cached-prospectuses, get-corporate-action (each `.md`)

## Gas and fees (pricing)
- Network fees: https://docs.base.org/specifications/transactions/network-fees.md
- Gas price: eth_gasPrice, eth_estimateGas, eth_feeHistory, eth_maxPriorityFeePerGas, all under https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/ (each `.md`)

## MCP and AI agents
- Base docs MCP server: https://docs.base.org/get-started/docs-mcp.md
- Resources for AI agents: https://docs.base.org/get-started/resources-for-ai-agents.md
- Builder Codes for agent developers: https://docs.base.org/specifications/builder-codes/for-agent-developers.md

## Grants, builders, creators, and posting
- The docs index has no page titled grants or posting. The creators and builders pages mention grants: https://docs.base.org/get-started/creators.md and https://docs.base.org/get-started/builders.md.
- No posting or publishing docs were found. Say so instead of guessing.

## Not yet read in full
Only the titles and URLs above were checked. Read the linked page before answering details.

## Grants (source: builders.md and creators.md, read on the date of this commit)
- **Builder Grant Program**: up to $5,000 in grants plus GTM and product support, for teams building on Base in one of six areas: prediction markets; token launchpads; DeFi 2.0 (lending, borrowing, looping, yield, vaults, tokenized equities); agents (commerce, x402, autonomous trading); new asset creation; consumer apps focused on transaction growth. Apply: https://forms.gle/urqjBJYJjR6Vqqre6
  - The docs say grants are given selectively and that the first step is integrating Builder Codes: https://docs.base.org/specifications/builder-codes/overview.md
- **Creator Grant Program** (for creators, not builders): up to $4,000 for creators already covering Base. Apply: https://forms.gle/sZ5cBADdXLfbbe1R8
- Related, not grants: Base Ecosystem Fund (https://www.base.org/ecosystem-fund), Base Batches accelerator (https://www.base.org/batches), Builder Stack (https://docs.base.org/get-started/base-services-hub.md).
