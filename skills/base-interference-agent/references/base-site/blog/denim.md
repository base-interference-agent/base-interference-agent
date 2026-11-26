# blog/denim

Source: https://www.base.org/blog/denim.md

# Introducing Base Denim

> Base’s fourth upgrade, Denim, is now live on mainnet.

- Date: 2026-11-05
- Author: Base Engineering Team
- URL: https://www.base.org/blog/denim

**tl;dr Base’s fourth upgrade, Denim, is now live on mainnet. Denim brings native 200ms blocks to Base that replaces flashblocks: five complete canonical blocks every second. Contracts can now read time to the millisecond onchain, and B20 gets additional transfer checks and simpler compliance controls.**

Base’s north star is to bring the world onchain, starting with trading, financing, and payments. Those use cases need a chain that updates state often and lets builders reason about time precisely. Denim changes the block cadence of Base itself: instead of one block every two seconds with a pending-state preview in between, Base now produces a full canonical block every 200 milliseconds.

## What’s in Denim?

Denim delivers [three changes](https://docs.base.org/upgrades/denim/overview?utm_source=base_dot_org#b20-improvements):

- Native 200ms blocks: five complete canonical blocks per second, replacing Flashblocks
- `BaseTime`: millisecond-resolution time for contracts and RPC clients
- B20 improvements: additional transfer checks and reusable compliance policies

---

## Native 200ms blocks

Before Denim, Base produced one canonical block every two seconds. Flashblocks filled the gap by streaming incremental pending-state updates for the block being built, so apps could show a preview of state before the block landed.

Base now produces five canonical blocks per second, and each one is a real block, not a preview. There is no pending state to reconcile and no separate stream to subscribe to. Block production is simpler, more consistent, and more reliable.

Including a transaction in a 200ms block does not by itself make it final. Like every Base block, it becomes safe when its batch is posted to Ethereum and final when Ethereum finalizes that batch.

![Diagram comparing one 2-second block with ten Flashblocks previews before Denim to ten native 200ms canonical blocks after Denim](https://www.base.org/images/blog/denim/01.webp)

Blocks cannot skip slots. Each block’s full timestamp is exactly 200ms after its parent’s, and the protocol validates that progression, so the cadence is a property of the chain rather than of the sequencer’s wall clock.

### Why native blocks beat Flashblocks

**No preconfirmation reorgs.** A Flashblock was a preview of a block still being built, and a preview can be dropped from the block that finally lands. Apps that showed Flashblock state had to be ready to walk it back. A 200ms block is not a preview of anything: it is the canonical block, with the same guarantees as every other block on Base. Reorgs caused by flashblocks are gone, along with the separate Flashblocks stream that could degrade while block production continues.

**Every standard RPC just works.** Sub-second state no longer lives behind a special subscription or a “pending” tag with Flashblocks-aware semantics. `eth_subscribe("newHeads")`, `eth_getLogs`, `eth_call`, `eth_getTransactionReceipt` and every other standard JSON-RPC method return 200ms state out of the box, so viem, ethers, Foundry and existing indexers work without a Flashblocks client or a reconciliation layer.

**Faster canonical inclusion.** Before Denim, Base produced a canonical block every two seconds. Now it produces one every 200ms. Apps read receipts and state directly from canonical blocks, with no preconfirmed state to reconcile later. Apps that need stronger guarantees can wait for a block to become safe or finalized, as they could before Denim.

**Finer-grained time for DeFi.** Five blocks per second give lending, trading and rewards protocols five opportunities per second to react: liquidations can execute in the first block after a price update rather than the next two-second block, and oracles and keepers can act on a 200ms cadence. With [`BaseTime`](https://docs.base.org/upgrades/denim/200ms-blocks?utm_source=base_dot_org#basetime-metadata-deposit), contracts also get the millisecond clock to match, so interest accrual, reward streaming and yield calculations can run at 200ms resolution instead of once per second.

![Diagram: before Denim, apps reconcile a Flashblocks stream with standard JSON-RPC; after Denim, apps use standard JSON-RPC with canonical blocks every 200ms](https://www.base.org/images/blog/denim/02.webp)

### Flashblocks is retired

Denim replaces Flashblocks. Base no longer produces Flashblocks streams, and the “pending” block tag no longer returns a preconfirmed state. Applications that consumed Flashblocks need to move to canonical block and RPC streams:

| Before Denim | After Denim |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `eth_subscribe("newFlashblocks")` | `eth_subscribe("newHeads")` |
| `eth_subscribe("pendingLogs")` | `eth_subscribe("logs")` |
| `eth_subscribe("newFlashblockTransactions")` | `eth_subscribe("newHeads")`, then fetch each block’s transactions |
| `eth_getBalance`, `eth_call`, `eth_getBlockByNumber`, etc. with “pending” | The same methods against the latest canonical block |

The full mapping is in [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks?utm_source=base_dot_org).

### `block.number` advances ten times faster

Because Base now produces ten times as many blocks per second, any contract or offchain system that treats a block count as a duration will see that duration shrink to one tenth of its intended length. `block.timestamp` is unaffected and still advances in whole seconds.

Review any logic of this shape:

- Timelocks, cooldowns and exit delays written as `block.number - start >= N`
- Vesting, emission and difficulty schedules measured in blocks
- Per-block rate limits or caps that reset when `block.number` changes
- Deadlines set as `expirationBlock = block.number + N`
- Governance voting delay and period in blocks, including `ERC20Votes` with the default block-number `clock()`
- Fixed-cardinality TWAP oracles, which now cover roughly half as much wall-clock history before `observe()` reverts

Where you can redeploy or upgrade, replace block-count durations with `block.timestamp` comparisons. Where a block count is governance-tunable, multiply it by ten. The [200ms Native Blocks](https://docs.base.org/upgrades/denim/200ms-blocks?utm_source=base_dot_org#block-number-based-contract-logic) spec has the full table.

---

## BaseTime

With BaseTime, your app can measure elapsed time and check deadlines with millisecond precision, whether you’re running an auction, expiring an order or calculating rewards.

Ethereum block headers store timestamps in whole seconds, and Denim keeps that unchanged: `block.timestamp` in the EVM and the timestamp field in JSON-RPC responses are still seconds. With five blocks per second, five consecutive blocks share the same `block.timestamp`. A contract that accrues interest, streams rewards or expires orders by comparing timestamps sees zero elapsed time between four of every five blocks, then a full second jump.

`BaseTime` supplies the missing milliseconds, so time onchain moves with every block instead of stepping once per second.

![Chart: BaseTime.timestampMs() rises 200ms every block while block.timestamp stays flat for five blocks, then jumps one second](https://www.base.org/images/blog/denim/03.webp)

Every Denim block carries a `BaseTime` metadata update at transaction index 1, right after the L1 info deposit, that writes the block’s sub-second part (0, 200, 400, 600 or 800) to the `BaseTime` predeploy at:

```
0x4200000000000000000000000000000000000030
```

Because the deposit executes before user transactions, any contract in the block can read the block’s full millisecond timestamp.

### Code example

Use case: a contract that needs sub-second time, such as an auction or order-expiry check:

```solidity
interface IBaseTime {
 function timestampMillisPart() external view returns (uint16); // 0, 200, 400, 600 or 800
 function timestampMs() external view returns (uint64); // full Unix time in milliseconds
}

IBaseTime constant BASE_TIME = IBaseTime(0x4200000000000000000000000000000000000030);

function isExpired(uint64 expiresAtMs) internal view returns (bool) {
 return BASE_TIME.timestampMs() >= expiresAtMs;
}
```

### Millisecond timestamps over RPC

Tooling gets the same precision without calling the predeploy. Block and header responses (`eth_getBlockByHash`, `eth_getBlockByNumber`, `eth_getHeaderByHash`, `eth_getHeaderByNumber`, `eth_subscribe("newHeads")`) add an optional `timestampMs` field, and mined transactions, logs and receipt logs add an optional `blockTimestampMs`. For example, a block at 42.200 seconds returns:

```json
{
 "timestamp": "0x2a",
 "timestampMs": "0xa4d8"
}
```

These values come from the authenticated `BaseTime` metadata in each block, not from an estimate based on the seconds field. The existing timestamp field is unchanged, so clients that ignore the new fields keep working. Pre-Denim blocks omit the new fields.

---

## B20 improvements

Denim adds B20 transfer checks and tools for managing issuer-defined compliance controls and policies. These changes help prevent accidental sends to the token’s own address, enforce issuer transfer rules consistently, and reuse compliance lists. Existing integrations keep working unless noted below. `PolicyRegistry` gains one view, `invertedPolicyId`. The token interface gains no new functions, events or errors.

### Reusable compliance lists

Cobalt lets issuers combine policies with `AND` and `OR` operators. Denim adds `NOT`. Any policy ID can be inverted by setting a reserved bit, and `isAuthorized` returns the opposite of the base policy’s result. Members live on the base policy and are shared, not copied, so an issuer can use one address list to mean “only these addresses” in one scope and “exclude these addresses” in another, with no second list to keep in sync.

**Example breakdown**

1. A compliance provider maintains one sanctioned allowlist whose members are sanctioned addresses.
2. The issuer builds a composite transfer policy, KYC `AND NOT` sanctioned, passing `invertedPolicyId(sanctioned)` as the second child.
3. A transfer to Alex, who is KYC-verified and not on the sanctions list, settles. If the provider adds Alex to the sanctions list, the next transfer to him fails. Nothing else changes, because the inverse reads the same list.

### Stronger transfer controls for regulated assets

Issuers of restricted securities often require every transfer to be initiated by an approved party, such as a transfer agent. B20’s `TRANSFER_EXECUTOR_POLICY` is the allowlist for that pattern, but before Denim it only applied to `transferFrom` calls made by someone other than the holder. A holder could bypass it by calling `transfer` directly.

After Denim, `TRANSFER_EXECUTOR_POLICY` is checked on `msg.sender` for every transfer path, matching how the sender and receiver policies already work. B20 tokens launched with `TRANSFER_EXECUTOR_POLICY` set, will automatically inherit the new behavior noted above. Tokens that never set an executor policy keep the always-allow default and see no change.

**Example breakdown**

1. A fund’s token sets `TRANSFER_EXECUTOR_POLICY` to an allowlist containing only its transfer agent.
2. The agent calls `transferFrom(alice, bob, 500)` after Alice has approved it. The transfer succeeds.
3. Alice calls `transfer(bob, 500)` directly. Before Denim this succeeded; after Denim it reverts with `PolicyForbids`, because Alice is not an allowlisted initiator.

**Note:** The issuer chooses whether to set an executor policy and who is on it; Base does not decide who may initiate transfers.

### Protection against lost funds

Users sometimes paste the token’s own address as the recipient. A B20 token is a precompile with no holder key, so tokens credited to it were stuck unless the issuer seized them back. After Denim, any transfer, mint or seizure whose recipient is the token’s own address reverts with the existing `InvalidReceiver` error, the same error wallets already handle for `address(0)`.

**Example breakdown**

1. Alex copies the wrong address from an explorer and tries to send 500 tokens to the token contract itself.
2. The transfer reverts with `InvalidReceiver`. Alex’s balance is unchanged, and the wallet shows the same error it shows for a send to the zero address.
3. Self-sends, sends to other B20 tokens, approvals and burns are unaffected. An issuer can still recover a balance that reached the token address before Denim with `seizeWithMemo(address(token), treasury, amount, memo)` if they have opted into seize functionality for their token.

For technical details and migration steps, see the Denim B20 changelog: [Token Receiver](https://docs.base.org/base-chain/specs/reference/b20/changelog/03-denim-b20-token-receiver?utm_source=base_dot_org), [Transfer Executor Enforcement](https://docs.base.org/base-chain/specs/reference/b20/changelog/03-denim-b20-transfer-executor-enforcement?utm_source=base_dot_org) and [NOT / Invert Policies](https://docs.base.org/base-chain/specs/reference/b20/changelog/03-denim-policyregistry-not-policy?utm_source=base_dot_org).

---

## How Denim impacts you

### Users

No action needed. Transactions land in canonical blocks that arrive every 200ms, and mistaken sends to a B20 token’s own address now fail instead of locking funds.

### App and wallet developers

If you consume Flashblocks or use the “pending” block tag, migrate to canonical block subscriptions and the latest block: see [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks?utm_source=base_dot_org). If you need sub-second time, read `timestampMs` from block responses or call the `BaseTime` predeploy.

### Contract developers

Audit any logic that converts block counts to time. `block.number` now advances ten times faster in wall-clock time; `block.timestamp` is unchanged. See [Block-Number-Based Contract Logic](https://docs.base.org/upgrades/denim/200ms-blocks?utm_source=base_dot_org#block-number-based-contract-logic).

### Trading teams and market infrastructure

You now observe a canonical state every 200ms, the next block is never more than 200ms away, and blocks, transactions and logs carry millisecond timestamps. There is no pending-state stream to reconcile against canonical blocks and no preconfirmation that can be dropped from the final block.

### DeFi protocols

Lending, DEX and rewards protocols get five blocks per second to liquidate, rebalance and update, and can read `BaseTime.timestampMs()` to accrue interest, stream rewards and expire orders at 200ms resolution instead of once per 2 second. Review block-count timing assumptions before relying on the new cadence.

### RPC providers, indexers and explorers

Expect ten times the block count per unit time, and the new optional `timestampMs` and `blockTimestampMs` fields on block, transaction, log and receipt responses. Flashblocks streams have stopped. Bridges and proof flows that read historical block hashes using BLOCKHASH retain the same number of values, but that history now covers one tenth of the elapsed time.

### Issuers

If your token sets a restrictive `TRANSFER_EXECUTOR_POLICY`, add holders (or a policy covering them) to the executor allowlist if you want holder-initiated transfers to keep working. Treat the token’s own address as an invalid recipient in your tooling. Use `invertedPolicyId` to replace mirrored allow and block lists.

If there’s something we can do better, we want to hear it. Reach us on [X](https://x.com/buildonbase), [Discord](https://discord.com/invite/buildonbase), or [GitHub](https://github.com/base/base/issues).

---

Disclaimer: Base is open-source, permissionless blockchain infrastructure. Base provides neutral protocol infrastructure only and does not control the persons, applications, or assets that use it. B20 tokens are deployed, configured, and administered solely by their respective issuers; issuer-controlled features such as minting, burning, freezing, and seizure are exercised at the issuer's sole discretion. Including a transaction in a block does not by itself make it final.

References to third-party issuers or assets are informational and not an endorsement. Except with respect to assets that Coinbase or its affiliates expressly issue (which are offered only in eligible jurisdictions and governed by their own terms and disclosures), Coinbase, including Base, is not the issuer, investment adviser, broker, dealer, underwriter, promoter, distributor, or transfer agent for any B20 token or transaction, and nothing here is investment advice or a recommendation to buy or sell any digital asset. Forward-looking statements about future upgrades, features, or performance are subject to change and are not commitments to deliver.

Illustrative examples are hypothetical and are provided solely to demonstrate potential use cases for new functionality. They are not exhaustive and do not constitute a recommendation, solicitation, or representation that any particular use case, strategy, application, asset or outcome will be available, suitable, profitable or successful.
