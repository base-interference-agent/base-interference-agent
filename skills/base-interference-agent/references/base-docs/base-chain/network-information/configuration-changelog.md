> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Configuration Changelog

> A log of configuration changes to the Base networks.

This page tracks configuration changes to the Base networks, including updates to block building, network fees, and other network parameters.

## Base Mainnet

| Date | Change | Documentation |
| - | - | - |
| November 19, 2026 | Shut down the public Flashblocks WebSocket endpoint (`wss://mainnet.flashblocks.base.org/ws`) | [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md#migrate-from-flashblocks) |
| November 13, 2026 | Started broadcasting each block as soon as it is built, with the 150ms seal deadline kept as a fallback, and started taking the transaction pool snapshot for every block at build start for all transactions, not only validity transactions | [Block Building](https://docs.base.org/specifications/transactions/transaction-ordering.md#block-building) |
| November 5, 2026 | Denim: Moved to a canonical block every 200ms, retired Flashblocks, and increased the EIP-1559 Denominator from 100 to 1,000 to keep the same fee adjustment per second | [200ms Native Blocks](https://docs.base.org/upgrades/denim/200ms-blocks.md) |
| May 28, 2026 | Azul: Reduced per-transaction gas maximum to 16,777,216 (2^24) via EIP-7825 | [Per-Transaction Gas Maximum](https://docs.base.org/specifications/transactions/throughput-and-limits.md#per-transaction-gas-maximum) |
| March 25, 2026 | Decreased EIP-1559 Denominator to 100 and Elasticity to 5 | [EIP-1559 Fee Parameters](https://docs.base.org/specifications/transactions/network-fees.md#eip-1559-fee-parameters) |
| February 19, 2026 | Increased Minimum Base Fee to 5,000,000 wei | [Minimum Base Fee](https://docs.base.org/specifications/transactions/network-fees.md#minimum-base-fee) |
| February 4, 2026 | Increased EIP-1559 Denominator to 125 | [EIP-1559 Fee Parameters](https://docs.base.org/specifications/transactions/network-fees.md#eip-1559-fee-parameters) |
| February 2, 2026 | Increased Minimum Base Fee to 2,000,000 wei | [Minimum Base Fee](https://docs.base.org/specifications/transactions/network-fees.md#minimum-base-fee) |
| January 22, 2026 | Increased Minimum Base Fee to 1,000,000 wei | [Minimum Base Fee](https://docs.base.org/specifications/transactions/network-fees.md#minimum-base-fee) |
| December 18, 2025 | Increased Minimum Base Fee to 500,000 wei | [Minimum Base Fee](https://docs.base.org/specifications/transactions/network-fees.md#minimum-base-fee) |
| December 4, 2025 | Enabled Minimum Base Fee (200,000 wei) | [Minimum Base Fee](https://docs.base.org/specifications/transactions/network-fees.md#minimum-base-fee) |
| September 17, 2025 | Enabled Per-Transaction Gas Maximum | [Per-Transaction Gas Maximum](https://docs.base.org/specifications/transactions/throughput-and-limits.md#per-transaction-gas-maximum) |
| September 11, 2025 | Ended testing Per-Transaction Gas Maximum | [Per-Transaction Gas Maximum](https://docs.base.org/specifications/transactions/throughput-and-limits.md#per-transaction-gas-maximum) |
| September 10, 2025 | Started testing Per-Transaction Gas Maximum | [Per-Transaction Gas Maximum](https://docs.base.org/specifications/transactions/throughput-and-limits.md#per-transaction-gas-maximum) |
| July 7, 2025 | Enabled Flashblocks | [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md) |
| May 15, 2025 | Ended testing Flashblocks | [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md) |
| May 15, 2025 | Started testing Flashblocks | [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md) |

## Base Sepolia

| Date | Change | Documentation |
| - | - | - |
| November 19, 2026 | Shut down the public Flashblocks WebSocket endpoint (`wss://sepolia.flashblocks.base.org/ws`) | [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md#migrate-from-flashblocks) |
| October 21, 2026 | Denim: Moved to a canonical block every 200ms, retired Flashblocks, and increased the EIP-1559 Denominator from 100 to 1,000 to keep the same fee adjustment per second | [200ms Native Blocks](https://docs.base.org/upgrades/denim/200ms-blocks.md) |
| April 20, 2026 | Azul: Reduced per-transaction gas maximum to 16,777,216 (2^24) via EIP-7825 | [Per-Transaction Gas Maximum](https://docs.base.org/specifications/transactions/throughput-and-limits.md#per-transaction-gas-maximum) |
| February 19, 2026 | Increased Minimum Base Fee to 5,000,000 wei | [Minimum Base Fee](https://docs.base.org/specifications/transactions/network-fees.md#minimum-base-fee) |
| February 10, 2026 | Increased EIP-1559 Denominator to 125 | [EIP-1559 Fee Parameters](https://docs.base.org/specifications/transactions/network-fees.md#eip-1559-fee-parameters) |
| February 10, 2026 | Increased Minimum Base Fee to 2,000,000 wei | [Minimum Base Fee](https://docs.base.org/specifications/transactions/network-fees.md#minimum-base-fee) |
| November 20, 2025 | Enabled Minimum Base Fee (200,000 wei) | [Minimum Base Fee](https://docs.base.org/specifications/transactions/network-fees.md#minimum-base-fee) |
| September 3, 2025 | Enabled Per-Transaction Gas Maximum | [Per-Transaction Gas Maximum](https://docs.base.org/specifications/transactions/throughput-and-limits.md#per-transaction-gas-maximum) |
| February 25, 2025 | Enabled Flashblocks | [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md) |
