> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Base

> Start building on Base, the blockchain for global finance: connect your agent or tools, choose a solution, find network details and funds, and track network upgrades.

Base is the blockchain for global finance. Transactions land in under a second and typically cost a fraction of a cent.

## Quickstart

1. Connect your agent to Base docs. Add the Base docs MCP server (recommended) so your agent can search and read Base docs on demand. See [MCP Server](https://docs.base.org/get-started/docs-mcp.md).
   * Any coding agent: paste `Install Base Docs MCP: https://docs.base.org/mcp` into its chat to have it add the server.
   * Claude Code: `claude mcp add --transport http base-docs https://docs.base.org/mcp`, then verify with `claude mcp list`.
   * Codex: `codex mcp add base-docs --url https://docs.base.org/mcp`
   * Cursor: in Settings, open Tools & MCP and click Add MCP Server. Add the following to `mcp.json`, then save and restart Cursor.

     ```json theme={null}
     {
       "mcpServers": {
         "base-docs": {
           "url": "https://docs.base.org/mcp"
         }
       }
     }
     ```
   * Other MCP clients: add `https://docs.base.org/mcp` as a remote (HTTP) MCP server.
   * No MCP support: use the docs index at `https://docs.base.org/llms.txt`, or load the full docs file at `https://docs.base.org/llms-full.txt`. The full file is a snapshot. See [Static Docs Files](https://docs.base.org/get-started/docs-llms.md).
2. Choose a solution. Pick what you're building from [Build a Solution](#build-a-solution) below and ask your agent to guide you.

## Build a Solution

* [Integrate DeFi](https://docs.base.org/get-started/integrate-defi.md): add trading, lending, and borrowing to your app with the Base Earn API.
* [Tokenize Assets](https://docs.base.org/get-started/issue-rwa.md): issue and operate real-world assets on Base with the B20 Standard.
* [Issue Stablecoins](https://docs.base.org/get-started/issue-stablecoins.md): run a fiat-backed stablecoin with minting and compliance built in.
* [Accept Payments](https://docs.base.org/get-started/accept-payments.md): take onchain payments from humans and agents, with refunds and payouts.
* [Private Transactions](https://docs.base.org/get-started/private-transactions.md): send confidential enterprise payments with Base Ledgers that settle onchain.

## What's New on Base

* [Cobalt](https://docs.base.org/upgrades/cobalt/overview.md) (live): B20 improvements and validity transactions. Base Sepolia: activated September 23, 2026. Base Mainnet: activated September 30, 2026.
* [Denim](https://docs.base.org/upgrades/denim/overview.md) (live): native blocks at a 200ms cadence. Base Sepolia: activated October 21, 2026. Base Mainnet: activated November 5, 2026. Action needed: [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md).
* [Everest](https://docs.base.org/upgrades/everest/overview.md) (planning): Base Transactions (EIP-8430). Base Sepolia: TBD. Base Mainnet: TBD.

See [All Upgrades](https://docs.base.org/upgrades/overview.md) for every upgrade and its schedule.

## Network Details

| | Base Mainnet | Base Sepolia (testnet) |
| - | - | - |
| RPC endpoint | `https://mainnet.base.org` | `https://sepolia.base.org` |
| Chain ID | `8453` | `84532` |
| Get funds | [Withdraw or bridge](https://docs.base.org/get-started/get-funds.md#mainnet) | [Testnet faucets](https://docs.base.org/get-started/get-funds.md#testnet-base-sepolia) |
| Block explorer | [basescan.org](https://basescan.org) | [sepolia.basescan.org](https://sepolia.basescan.org) |

Vibenet is Base's preview network, where new chain features go live before Base Sepolia. It is for experiments only, and its state can be reset without notice. RPC endpoint `https://rpc.vibes.base.org`, chain ID `84538453`, explorer [chain.base.org/vibenet/explorer](https://chain.base.org/vibenet/explorer), faucet [chain.base.org/vibenet/faucet](https://chain.base.org/vibenet/faucet). See [Test on Vibenet](https://docs.base.org/build-on-base/test-on-vibenet.md).
