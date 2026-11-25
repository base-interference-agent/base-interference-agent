> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Migrate From Flashblocks

> Migrate your Flashblocks integration to 200ms blocks.

> [!NOTE]
>
> If you were redirected here from a Flashblocks page or a retired RPC method such as `newFlashblocks`, `newFlashblockTransactions`, or `pendingLogs`, that page was removed because Base retired Flashblocks when it moved to 200ms blocks. Use the tables below to find the replacement.

> [!WARNING]
>
> Denim activated on Base Sepolia on October 21, 2026 at 18:00 UTC and on Base Mainnet on November 5, 2026 at 18:00 UTC. Base stopped producing Flashblocks on both networks at activation, so Flashblocks subscriptions, the Flashblocks WebSocket streams, and Flashblocks pending state no longer return data.

## Summary

Use this guide if your application, infrastructure, or node consumed Flashblocks. Denim replaced Flashblocks with a complete canonical block every 200ms, so Flashblocks subscriptions, streams, and pending state are no longer available. This page lists everything that changed and what to use instead.

## Recommended Action

Inventory every Flashblocks subscription, Flashblocks WebSocket connection, validity transaction that uses `flashblock_index`, node flag that configures Flashblocks, and RPC request that uses the `"pending"` block tag. Replace each one using the tables below.

## Update Integrations for Denim

| Integration to review | Action for Denim |
| - | - |
| `wss://mainnet.flashblocks.base.org/ws` or `wss://sepolia.flashblocks.base.org/ws` | Use `eth_subscribe("newHeads")` or `eth_subscribe("logs")` on a WebSocket-capable RPC provider from the [Builder Stack](https://docs.base.org/get-started/builder-stack.md) or on your own node. Base shut these endpoints down on November 19, 2026, and connections to them now fail. Remove them from your configuration. |
| `eth_subscribe("newFlashblocks")` | Use `eth_subscribe("newHeads")`. |
| `eth_subscribe("pendingLogs")` | Use `eth_subscribe("logs")`. |
| `eth_subscribe("newFlashblockTransactions")` | Use `eth_subscribe("newHeads")`, then fetch transactions for each canonical block. |
| `eth_getBlockByNumber("pending", ...)` | Use normal RPC calls to read the latest canonical blocks. |
| `eth_getBalance(..., "pending")` | Use normal RPC calls to read the latest canonical state. |
| `eth_getTransactionCount(..., "pending", ...)` | Use normal RPC calls to read the latest canonical state. |
| `eth_call(..., "pending")` | Use normal RPC calls to read the latest canonical state. |
| `eth_estimateGas(..., "pending")` | Use normal RPC calls to read the latest canonical state. |
| `eth_simulateV1(..., "pending")` | Keep using `eth_simulateV1`; it simulates against canonical state. The reference moved to [eth\_simulateV1](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_simulateV1.md). |
| `base_transactionStatus` | The method still exists on Base nodes, but the public endpoints reject it. The reference moved to [base\_transactionStatus](https://docs.base.org/base-chain/api-reference/base-api/base_transactionStatus.md). |
| `eth_getTransactionReceipt` for a preconfirmed transaction | Keep polling `eth_getTransactionReceipt`. A receipt is available once the transaction is included in a canonical 200ms block; there are no preconfirmed receipts. |
| `eth_getTransactionByHash` for a preconfirmed transaction | Use canonical transaction data. Block fields are set once the transaction is included in a 200ms block; there are no preconfirmed transaction results. |
| `eth_getLogs` with a range ending at `"pending"` | Use normal RPC calls to query logs from canonical blocks. |
| `eth_getBlockTransactionCountByNumber("pending")` | Use normal RPC calls to read the latest canonical block. |
| Validity transaction with a `flashblock_index` predicate | Remove the predicate and bound the transaction with `block_number` only. Base rejects `flashblock_index` predicates with the error `flashblock_index predicates are not supported after Denim: blocks are built every 200ms without flashblocks`. See [Predicates and Safety](https://docs.base.org/specifications/build-transaction/predicates-and-safety.md). |
| Bridge or proof flow that reads historical block hashes | Review its history assumptions. The 256-block `BLOCKHASH` window and the 8,191-block EIP-2935 history contract keep the same number of entries, but 200ms blocks mean that history covers one tenth of the elapsed time. EIP-4788 beacon roots are stored by timestamp, so their window is unchanged. |

> [!WARNING]
>
> The `"pending"` block tag is still accepted and resolves to the latest canonical block. It no longer exposes Flashblocks preconfirmation state, which has no direct equivalent. The replacements above return canonical data from 200ms blocks.

## Update Node Configuration

Base Mainnet nodes require [base/base v1.5.1](https://github.com/base/base/releases/tag/v1.5.1) or later, and Base Sepolia nodes require [v1.5.0](https://github.com/base/base/releases/tag/v1.5.0) or later. Run the [latest release](https://github.com/base/base/releases/latest). See [Run a Node](https://docs.base.org/specifications/node-operators/run-a-node.md).

Remove these Flashblocks settings from your node configuration:

* The `RETH_FB_WEBSOCKET_URL` environment variable
* `--flashblocks-url` (alias `--websocket-url`)
* `--max-pending-blocks-depth`
* `--flashblocks.ping-interval`

These settings have no effect because Base no longer produces Flashblocks. A future base/base release removes them from the node's command line, so a node that still sets them may fail to start after that upgrade.

## Test on Vibenet

Test your migrated integration on Base Sepolia or [Vibenet](https://docs.base.org/build-on-base/test-on-vibenet.md). For the protocol design and RPC behavior, see [200ms Native Blocks](https://docs.base.org/upgrades/denim/200ms-blocks.md).
