> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Transaction Finality

> Detailed information about transaction finality on Base.

Finality refers to the point at which a transaction sent to Base becomes irreversible. This provides guarantees that the transaction will not be rolled back or lost.

Finality works differently for normal transactions that modify Base L2 state than it does for transactions that withdraw funds from Base L2 to Ethereum L1.

> [!NOTE]
>
> **Only transactions that withdraw funds from Base to Ethereum must wait for a withdrawal finalization window** (5 days, or 1 day when both TEE and ZK proofs are present). Regular transactions within Base, such as swaps or sends, *do not* have this wait.

## Finality for Base L2 Transactions

This describes finality for transactions on Base except withdrawal transactions that move funds from Base to Ethereum L1. Base produces a native block every [200ms](https://docs.base.org/upgrades/denim/200ms-blocks.md).

For transactions on Base, finality is not a single time to wait for. Instead, there are 3 stages in time that each provide increasing security guarantees.

![Base transaction finality timeline: L2 block inclusion at approximately 200ms, L1 batch inclusion at approximately 2 minutes, and L1 batch finality at approximately 20 minutes.](https://mintcdn.com/base-a060aa97/wdPT9Ih3wEoiQovI/images/transaction-finality/base-tx-finality.jpeg?fit=max\&auto=format\&n=wdPT9Ih3wEoiQovI\&q=85\&s=2aba514aa3f0ae06e5a7ecbac6f7b4c7)

### 1. L2 Block Inclusion: \~200ms

After roughly 200ms, the sequencer has built the transaction into an L2 block and distributed it to validator nodes.

> [accordion] Near 0% Probability of a Reorg.
>
> * In the history of Base Mainnet, less than 0.00000002% of transactions have ever reorged. The data can be [seen here](https://base.blockscout.com/blocks?tab=reorgs)

### 2. L1 Batch Inclusion: \~2m

After roughly 2 minutes, a Base batch containing the transaction has been posted to Ethereum.

> [accordion] Effectively 0% Probability of a Reorg.
>
> * There has never been a reorg of L2 blocks that were batched to Ethereum L1.
> * **A reorg of Ethereum L1 does not require a reorg of the Base L2 chain.** The sequencer and validator nodes maintain a configurable lag from the tip of Ethereum, so typical L1 reorgs have no effect. In the event of larger Ethereum reorgs, Base can resubmit batch data on L1 without changing the sequenced L2 blocks.

### 3. L1 Batch Finality: \~20m

The Ethereum L1 batch containing the transaction is older than 2 epochs, or 64 L1 blocks.

> [accordion] Effectively 0% Probability of a Reorg.
>
> * L2 blocks that have reached L1 batch finality are protected from reorgs the same way Ethereum finalized blocks are. They are in practice impossible to reverse.

## Finality for Withdrawal Transactions

This describes finality for transactions that move funds from Base to Ethereum.

**Only withdrawals to Ethereum must wait for a finalization window before the funds can be released to the address on Ethereum L1.** This allows Base's proof system to provide extremely high security guarantees for funds bridged to Base.

Since the [Beryl upgrade](https://docs.base.org/upgrades/beryl/reducing-canonical-withdrawal-delay.md), the finalization window is 5 days for a single-proof dispute game and 1 day on the dual-proof fast path, when both a TEE proof and a ZK proof back the same proposal. The window accounts for most of the end-to-end time; waiting for the relevant Base state to be proposed on Ethereum usually adds only about 20 to 60 minutes, plus the prove and finalize transactions. Third-party bridges that release funds faster use their own liquidity and do not change this window.

> [accordion] What Happens During the Finalization Window?
>
> After a withdrawal is initiated on Base, a proposer submits a checkpoint claim on Ethereum through an `AggregateVerifier` game with a TEE or ZK proof. An independent challenger can dispute an invalid claim with a ZK proof. The game's finalization window gives other participants time to verify the claim; when TEE and ZK proofs support the same proposal, the dual-proof path is shorter. See the [Azul proof system](https://docs.base.org/upgrades/azul/proofs.md) for the proof flow.
>
> A withdrawal proven against an invalid claim cannot finalize and must be re-proven against a valid one. Challenging a claim does not reorg the Base chain.

## FAQ

> [accordion] If There Is a Reorg on Ethereum, Will It Cause a Reorg on Base?
>
> In almost all circumstances, no. Base can simply re-submit batch data to Ethereum transparently while the L2 chain continues to progress.

> [accordion] How Long Do Deposit Transactions Take to Finalize?
>
> Transactions moving funds from Ethereum L1 to Base must be initiated on Ethereum and typically get included within 3 minutes by the Base sequencer.

> [accordion] If a Challenger Wins a Dispute Game, Will the L2 Chain Reorg?
>
> No. The output proposal that was challenged is marked invalid, and any actions that used its output root become invalid. Specifically, withdrawals from Base to L1 that proved against this output root must now prove against a different and valid one.
