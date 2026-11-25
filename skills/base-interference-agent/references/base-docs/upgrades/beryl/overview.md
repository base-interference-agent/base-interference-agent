> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Beryl

> Beryl makes Base a first-class issuance platform with B20 tokens, more capital efficient with reduced withdrawal delays, and more scalable with Reth V2.

| | Status | Date |
| - | - | - |
| Sepolia | Live | June 18, 2026 |
| Mainnet | Live | June 25, 2026 |

## Features

> [accordion] Reth V2
>
> **Base** · Execution
>
> Ships Reth V2 as the reference execution client for Base nodes, delivering significant sync speed and throughput improvements.

> [accordion] Faster Withdrawals
>
> **Base** · Proofs
>
> The single-proof dispute game finalization window is reduced from 7 days to 5 days. The dual-proof fast path (TEE + ZK) introduced in Azul remains at 1 day. Shortening the single-proof window frees capital for fast-bridge liquidity providers.

> [accordion] B20
>
> **Base** · Precompile
>
> B20 implements the ERC-20 specification, making it interoperable with all existing systems built on ERC-20 like wallets, exchanges, data indexers, and onchain protocols. What's different is how it runs. Rather than deploying a Solidity contract, B20 tokens execute as Rust precompiles inside the node.
