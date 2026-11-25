> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Delta

> Overview of the Delta hardfork, introducing span batches to reduce L1 data costs by compressing multiple L2 blocks into single batcher transactions.

## Activation Timestamps

| Network | Activation timestamp |
| - | - |
| `mainnet` | `1708560000` (2024-02-22 00:00:00 UTC) |
| `sepolia` | `1703203200` (2023-12-22 00:00:00 UTC) |

The Delta upgrade uses a *L2 block-timestamp* activation-rule, and is specified only in the rollup-node (`delta_time`).

## Consensus Layer

[span-batches]: https://docs.base.org/upgrades/delta/span-batches.md

The Delta upgrade consists of a single consensus-layer feature: [Span Batches][span-batches].
