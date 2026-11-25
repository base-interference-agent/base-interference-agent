> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Cobalt

> Cobalt improves the B20 token standard, adds validity transactions, introduces dynamic node upgrades, and migrates TEE signer registration to onchain attestation verification.

| | Status | Date |
| - | - | - |
| Sepolia | Live | September 23, 2026 |
| Mainnet | Live | September 30, 2026 |

## Features

> [accordion] B20 Improvements
>
> **Base** · Precompile
>
> Cobalt brings improvements to the B20 token standard: schedule multiplier updates, transfer blocked simplification, and new Union and Intersect policies.

> [accordion] Validity Transactions
>
> **Base** · Transactions
>
> Cobalt introduces validity transactions: signed transactions that Base includes only when onchain conditions (balance, storage, block-number, and Flashblock-index predicates) match. Use them for conditional swaps, withdrawals, and other state-dependent actions. Flashblock-index predicates are no longer supported: since Denim retired Flashblocks, Base rejects transactions that use them. See [Validity Transactions](https://docs.base.org/specifications/build-transaction/validity-transactions.md) for the full specification.

> [accordion] Dynamic Upgrades
>
> **Base** · RPC
>
> Dynamic Upgrades introduces an Ethereum smart contract that stores upgrade timestamps for Base nodes, allowing nodes to query the contract and apply changes live. It runs in metrics-only mode on Mainnet while data is collected to validate that upgrades work smoothly.

> [accordion] TEE Registration Migration
>
> **Base** · Infrastructure
>
> Cobalt changes how new Trusted Execution Environment (TEE) signers are registered: AWS Nitro attestations are trustlessly verified fully onchain using checked P-384 hints, replacing the RISC Zero and Boundless proving flow. Registration is faster and no longer depends on an external offchain proving service. Enclave key generation, PCR0 image selection, and proof verification are unchanged. See [Hinted Registration Migration](https://docs.base.org/specifications/base-protocol/proofs/registrar.md#hinted-registration-migration) for what changed and [Registrar](https://docs.base.org/specifications/base-protocol/proofs/registrar.md) for the full specification.
