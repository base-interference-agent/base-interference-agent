> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Fjord

> Overview of the Fjord hardfork, introducing FastLZ-based L1 fee estimation, the RIP-7212 secp256r1 precompile, and brotli channel compression.

## Activation Timestamps

| Network | Activation timestamp |
| - | - |
| `mainnet` | `1720627201` (2024-07-10 16:00:01 UTC) |
| `sepolia` | `1716998400` (2024-05-29 16:00:00 UTC) |

## Execution Layer

* [RIP-7212: Precompile for secp256r1 Curve Support](https://docs.base.org/specifications/base-protocol/execution/precompiles.md#P256VERIFY)
* [FastLZ compression for L1 data fee calculation](https://docs.base.org/upgrades/fjord/exec-engine.md#fees)
* [Deprecate the `getL1GasUsed` method on the `GasPriceOracle` contract](https://docs.base.org/upgrades/fjord/predeploys#l1-gas-usage-estimation)
* [Deprecate the `L1GasUsed` field on the transaction receipt](https://docs.base.org/upgrades/fjord/exec-engine#l1-gas-usage-estimation)

## Consensus Layer

* [Constant maximum sequencer drift](https://docs.base.org/upgrades/fjord/derivation.md#constant-maximum-sequencer-drift)
* [Brotli channel compression](https://docs.base.org/upgrades/fjord/derivation.md#brotli-channel-compression)
* [Increase Max Bytes Per Channel and Max Channel Bank Size](https://docs.base.org/upgrades/fjord/derivation.md#increasing-max_rlp_bytes_per_channel-and-max_channel_bank_size)
