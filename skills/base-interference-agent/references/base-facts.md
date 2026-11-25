# Base facts (reference for answering questions)

Source: docs.base.org, as read on the date of this commit. Check the source
links before relying on anything time-sensitive.

## Networks
| Network | Chain ID | RPC (reads) | Transaction submission | Explorer | Currency |
|---|---|---|---|---|---|
| Base Mainnet | 8453 | https://mainnet.base.org | https://mainnet-sequencer.base.org | https://basescan.org | ETH |
| Base Sepolia (testnet) | 84532 | https://sepolia.base.org | https://sepolia-sequencer.base.org | https://sepolia.basescan.org | ETH |

- Use the sequencer URL only to send transactions. Use the RPC URL for everything else.
- Public RPCs are free, rate limited, best effort, and not for production. For production, use a dedicated RPC provider (see the Builder Stack page: https://docs.base.org/get-started/builder-stack.md).
- Docs say Base Mainnet removed the debug, trace, and txpool namespaces and lowered the read rate limit on October 8, 2026 (https://status.base.org/incidents/jrs0dpj60tqz). Confirm current limits before relying on them.
- Vibenet is an experimental preview network: https://docs.base.org/build-on-base/test-on-vibenet.md, faucet at https://chain.base.org/vibenet/faucet. Its RPC and chain ID were not confirmed.

## Bridging
- The old bridge.base.org is deprecated.
- From a Coinbase account: withdraw ETH or USDC and choose Base as the network. No bridge needed.
- From Ethereum: Superbridge (https://superbridge.app/?fromChainId=1&toChainId=8453) or Brid.gg (https://www.brid.gg/?fromChainId=1&toChainId=8453).
- Fast third-party bridges (they do not inherit Base's security): Across (https://app.across.to/bridge), Relay (https://relay.link), Stargate (https://stargate.finance/bridge). Aggregators: Jumper (https://jumper.exchange), Bungee (https://www.bungee.exchange).
- Bitcoin to cbBTC on Base: Garden (https://app.garden.finance/?output-chain=base&output-asset=cbBTC).
- Withdrawals from Base to Ethereum through the standard bridge take 5 days to finalize, or 1 day when both TEE and ZK proofs back the proposal (https://docs.base.org/specifications/base-protocol/bridging/withdrawals.md).

## Testnet funds (Base Sepolia)
- Coinbase Developer Platform faucet: https://portal.cdp.coinbase.com/onchain-tools/faucet (up to 0.1 ETH per 24h, plus USDC, EURC, cbBTC).
- Others: thirdweb (https://thirdweb.com/base-sepolia-testnet), Alchemy (https://www.alchemy.com/faucets/base-sepolia, needs account), QuickNode (https://faucet.quicknode.com/base/sepolia), Chainstack (https://faucet.chainstack.com/, needs API key), ethfaucet (https://ethfaucet.com/networks/base).
- Test USDC: https://faucet.circle.com (select Base Sepolia).

## Token addresses
- Native USDC: Mainnet `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`; Base Sepolia `0x036CbD53842c5426634e7929541eC2318f3dCF7e`.
- USDbC (legacy bridged USDC): `0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA`.
- EURC: Mainnet `0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42`; Base Sepolia `0x808456652fdb597867f38412077A9182bf77359F`.
- CCTP domain for Base: 6.
- Base-Solana bridge contract (Base Mainnet): `0x3eff766C76a1be2Ce1aCF2B69c78bCae257D5188`.

## Wallets
- Docs say any Ethereum wallet, tool, or library works unchanged on Base.
- Coinbase Wallet app: https://wallet.coinbase.com (formerly "Base App").
- Coinbase Wallet SDK docs: https://docs.cdp.coinbase.com/coinbase-wallet/overview.
- Coinbase Developer Platform wallet MCP (a separate product from the Base docs MCP): https://docs.cdp.coinbase.com/ai-agents/coinbase-for-agents/wallet-mcp.

## SDKs, APIs, and tools
- JSON-RPC API: https://docs.base.org/base-chain/api-reference/rpc-overview.md
- Base Earn API (lending, borrowing, vaults): https://docs.base.org/sdks/base-earn/overview.md
- Base Verify API: https://docs.base.org/sdks/base-verify/overview.md
- Foundry for Base: https://docs.base.org/sdks/base-anvil.md (Foundry v1.8.4+, v1.9.0+ for Denim).
- Tokenized Stocks API: https://docs.base.org/sdks/tokenized-stocks/overview.md
- Account SDK: package `@base-org/account`.
- Retired: OnchainKit (`@coinbase/onchainkit`, archived, no replacement library) and MiniKit / mini apps. For new apps, use wagmi (https://wagmi.sh), viem (https://viem.sh), and the Coinbase Developer Platform (https://docs.cdp.coinbase.com).
- No official "Base CLI" was found in the docs.

## Getting started
- Transactions with viem: see https://docs.base.org/get-started/make-a-transaction.md. Use `http('https://mainnet.base.org')` and the `base` chain from `viem/chains`.
- Base produces a block every 200 ms, and the docs say transactions confirm in under a second.
- Build overview: https://docs.base.org/build-on-base/overview.md
- Full docs index: https://docs.base.org/llms.txt

## Not verified
- Builder Stack RPC providers, Vibenet RPC and chain ID, and the full Base Protocol specs were not read.
