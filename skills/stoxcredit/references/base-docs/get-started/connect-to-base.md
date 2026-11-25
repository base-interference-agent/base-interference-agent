> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Connect to Base

> Network details for Base Mainnet and Base Sepolia: RPC endpoints, chain IDs, and block explorers.

Base is a standard EVM chain, so any Ethereum tool, wallet, or library works unchanged. Just point it at the network details below.

## Network Details

| | Base Mainnet | Base Sepolia (testnet) |
| - | - | - |
| RPC endpoint | `https://mainnet.base.org` | `https://sepolia.base.org` |
| Transaction submission | `https://mainnet-sequencer.base.org` | `https://sepolia-sequencer.base.org` |
| Chain ID | `8453` | `84532` |
| Currency | ETH | ETH |
| Block explorer | [basescan.org](https://basescan.org) | [sepolia.basescan.org](https://sepolia.basescan.org) |

> [!NOTE]
>
> Use the transaction submission endpoint only to send transactions. Use the RPC endpoint for all other requests.

> [!WARNING]
>
> The public RPC endpoints are free, rate limited, and best effort. They are not suitable for production apps.
>
> `https://mainnet.base.org` and `https://sepolia.base.org` do not serve the `debug`, `trace`, or `txpool` namespaces. Base Mainnet removed these namespaces and lowered the read-request rate limit on October 8, 2026 ([status notice](https://status.base.org/incidents/jrs0dpj60tqz)).
>
> If your app uses these namespaces or needs higher throughput, use a dedicated RPC provider from the [Builder Stack](https://docs.base.org/get-started/builder-stack.md) or [run your own Base node](https://docs.base.org/specifications/node-operators/run-a-node.md).

## Next Steps

> [card] [Get Funds](https://docs.base.org/get-started/get-funds.md)
>
> Fund an address to start transacting.

> [card] [Make a Transaction](https://docs.base.org/get-started/make-a-transaction.md)
>
> Send your first transaction on Base.
