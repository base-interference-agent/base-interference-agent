> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Denim

> Denim introduces native blocks at a 200ms cadence, onchain millisecond time through BaseTime, millisecond-resolution RPC timestamps, and B20 transfer and policy improvements.

| | Status | Date |
| - | - | - |
| Sepolia | Live | October 21, 2026 |
| Mainnet | Live | November 5, 2026 |

## Features

> [accordion] 200ms Native Blocks
>
> **Base** · RPC
>
> Denim moves Base block production from one canonical block every two seconds to five complete canonical blocks per second, each with its own hash, state root, receipts, and forkchoice lifecycle. Denim replaces Flashblocks, so applications using Flashblocks must migrate to canonical block and RPC streams. See [200ms Native Blocks](https://docs.base.org/upgrades/denim/200ms-blocks.md) and [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md).

> [accordion] BaseTime
>
> **Base** · Predeploy
>
> Denim adds onchain millisecond time through the BaseTime predeploy. A BaseTime metadata deposit supplies the sub-second component of each block's timestamp, letting contracts read the current block's millisecond part while EVM `block.timestamp` stays seconds-based.

> [accordion] Millisecond RPC Timestamps
>
> **Base** · RPC
>
> Block, header, transaction, log, and receipt responses gain optional millisecond-resolution timestamp fields (`timestampMs`, `blockTimestampMs`), derived from authenticated BaseTime metadata. The existing seconds-based `timestamp` field is unchanged for backward compatibility.

> [accordion] B20 Improvements
>
> **Base** · Precompile
>
> Denim tightens B20 transfer rules and extends PolicyRegistry: transfers, mints, and seizes to the token's own address revert, `TRANSFER_EXECUTOR_POLICY` applies to every transfer path, and any policy can be inverted with a NOT flag. See [Token Receiver](https://docs.base.org/base-chain/specs/reference/b20/changelog/03-denim-b20-token-receiver.md), [Transfer Executor Enforcement](https://docs.base.org/base-chain/specs/reference/b20/changelog/03-denim-b20-transfer-executor-enforcement.md), and [NOT / Invert Policies](https://docs.base.org/base-chain/specs/reference/b20/changelog/03-denim-policyregistry-not-policy.md).
