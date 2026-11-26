# blog/flashblocks-deep-dive

Source: https://www.base.org/blog/flashblocks-deep-dive.md

# Flashblocks Deep Dive: How we made Base 10x faster

> To build an open network for the global economy, we’re focused on making Base Chain faster and cheaper with sub-cent, sub-second transactions. And earlier this year, we shipped…

- Date: 2025-09-09
- Author: Cody Wang
- URL: https://www.base.org/blog/flashblocks-deep-dive

To build an open network for the global economy, we’re focused on making Base Chain faster and cheaper with sub-cent, sub-second transactions. And earlier this year, we shipped [Flashblocks on Base mainnet](https://x.com/buildonbase/status/1945618401013239880), making Base 10x faster by reducing effective block times from 2 seconds to just 200 milliseconds.

Launched on July 16th, this concluded a four-month development journey from testnet to mainnet. We built in public, and wanted to share more of the technical details of Flashblocks, the challenges we encountered during our journey, and our learnings. If you're looking for support on integrating your app or infrastructure provider with Flashblocks, we recommend checking out [this blog post](https://www.base.org/blog/accelerating-base-with-flashblocks) and [FAQ page](https://docs.base.org/base-chain/flashblocks/docs?utm_source=base_dot_org).A

## A Primer on Flashblocks

Previously, Base produced a new block every 2 seconds. With Flashblocks (built with [Flashbots](http://flashbots)), the builder streams 200 ms sub-blocks during that 2-second window, giving sub-second preconfirmations so transactions feel instant.

![](https://www.base.org/images/blog/flashblocks-deep-dive/01.webp)

There are 10 Flashblocks per block, and each of them (flashblock_i) can contain up to i/10 of the regular block’s total gas budget. A series of Flashblocks are combined to recreate a full block.

Now that we've covered what Flashblocks are, let's dive into how we implemented them into Base Chain.

## Sequencer Architecture

As part of the Flashblocks launch, we added several new infrastructure components to the sequencer. To contextualize these changes, we share what the sequencer architecture looked like both before and after Flashblocks.

### Architecture before Flashblocks

At Base, we operate a high availability sequencer system, with five sequencer instances.

![](https://www.base.org/images/blog/flashblocks-deep-dive/02.webp)

Each sequencer is made up  of the following infrastructure components:

- [**Op-node**](https://github.com/ethereum-optimism/optimism/tree/develop/op-node): the standard op-stack consensus layer (CL) software
- [**Op-geth**](https://github.com/ethereum-optimism/op-geth): the standard op-stack execution layer (EL) software

 - op-node and op-geth communicate via [Engine APIs](https://hackmd.io/@danielrachi/engine_api) for block building.

- [**Op-conductor**](https://github.com/ethereum-optimism/optimism/tree/develop/op-conductor): the high availability control component, with a raft consensus for leadership election

One sequencer instance functions as the “leader” and is responsible for sequencing by building blocks and propagating them via P2P to other nodes. The remaining four sequencers act as follower Base nodes that synchronize the chain. Leadership transfer occurs if the current leader stops block production within a specified threshold.

### Architecture With Flashblocks

With Flashblocks, we integrated several new components within each single sequencer in the high availability system, to allow for the addition of more custom block building functionality. These include:

- [**Rollup-boost**](https://github.com/flashbots/rollup-boost) (CL\<>EL Engine API proxy)

 - **Why it’s needed for Flashblocks:** Enables sharing Flashblocks with the EL without modifying the CL, by adding a controlled interception point on Engine API calls. It localizes risk and lets us experiment off-protocol
 - **What it unlocks:** A stable seam for future block-building evolutions (e.g. multi-builder), without refactoring CL/EL

- [**Op-rbuilder**](https://github.com/flashbots/op-rbuilder) (out-of-protocol builder @ 200ms cadence)

 - **Why  it’s needed for Flashblocks:** Produces the sub-second Flashblocks, decoupled from the EL
 - **What it unlocks:** A pluggable builder surface for new block building mechanisms (e.g. MEV-aware strategies, auctions across multiple builders)

- [**Websocket proxy**](https://github.com/flashbots/rollup-boost/tree/main/crates/websocket-proxy) (Flashblocks stream fan-out)

 - **Why it’s needed for Flashblocks:** A broadcast layer such that many consumers can read the Flashblocks stream without DoS-ing the builder

- [**Node-reth**](https://github.com/base/node-reth) (RPC surface exposing preconfirmations)

 - **Why it’s needed for Flashblocks:** Converts the streamed Flashblocks into familiar RPCs so apps and wallets can consume preconfirmation state without new SDKs or protocol changes

![](https://www.base.org/images/blog/flashblocks-deep-dive/03.webp)

Both rollup-boost and op-rbuilder were initially built and are currently maintained by Flashbots. While on the Base side we built and are maintaining websocket proxy and node-reth, as well as made specific changes to rollup-boost and op-rbuilder for our needs. Explained in more detail in the reliability section below.

Given these changes, how does a transaction submitted to Base now proceed?

## Lifecycle of a Base Mainnet Transaction

Let’s trace the journey of a transaction when a user sends an `eth_sendRawTransaction` to [mainnet-base.org](http://mainnet-base.org). This flow is similar before and after Flashblocks, with modification to the block building algorithm. The request undergoes the following stages:

![](https://www.base.org/images/blog/flashblocks-deep-dive/04.webp)

1. The request first reaches our DNS provider for resolution of [mainnet-base.org](http://mainnet-base.org).
2. From there, it is routed to the load balancer of the routing software, [Proxyd](https://github.com/ethereum-optimism/infra/tree/main/proxyd)
3. Proxyd then routes the request to the private mempool
4. The mempool receives the request and inserts the transaction into its txpool as a pending transaction
5. The mempool maintains P2P connections with the ELs (op-geth, op-rbuilder), ensuring all pending transactions are sync’d in the ELs for block building
6. During each block building loop, the ELs select transactions from their txpool

### Flashblocks Block Building

With Flashblocks live, we use op-rbuilder as the block builder. Within op-rbuilder, as explained in the previous blog post, the following factors determine when a transaction is chosen

1. **Transaction fee**: for each 200ms block building loop, transactions are ordered by their fee, same as op-geth
2. **Transaction gas limit and remaining gas available**: for each flashblock FB_j, up to j/10 total block gas limit can be used. Therefore, a transaction must have sufficient fee and remain within the available gas for that flashblock

The pseudocode for Flashblock block building that captures the above factors is as follows

```
FUNCTION BuildFlashblocks(pending_transactions, total_block_gas_limit):
 flashblocks = []
 block_gas_used = 0

 FOR j FROM 0 TO MAX_FLASHBLOCKS_PER_BLOCK:
 NEXT_TIME = MONOTONIC_NOW() + 150ms // next block start time
 current_flashblock_gas_limit = (j / 10) * total_block_gas_limit

 // Order pending transactions by fee (descending)
 sorted_transactions = SORT_BY_FEE_DESC(pending_transactions)
 // Select transactions given gas available
 selected_transactions = TOP_TRANSACTIONS_WITHIN_GAS_LIMIT(sorted_transactions, current_flashblock_gas_limit, block_gas_used)

 // Execute transactions
 executed_info, gas_used = EXECUTE_TX(selected_transactions)
 block_gas_used += gas_used
 // Build the flashblock by computing block hash and state root
 flashblock = BUILD_BLOCK(flashblock, executed_info)

 // Wait for the remaining amount of time before building the next flashblock
 WAIT_UNTIL(NEXT_TIME)
 END FOR

 RETURN flashblocks
END FUNCTION
```

See [here](https://github.com/flashbots/op-rbuilder/blob/main/crates/op-rbuilder/src/builders/flashblocks/payload.rs#L197) for the full implementation in op-rbuilder.

### Flashblocks RPC Nodes (Node-reth)

Once the transaction is chosen and mined, it’s included as part of the flashblock data streamed to websocket proxy, which RPC nodes listen to. The RPC nodes cache the flashblock data. The exact definition of the data stream can be found [here](https://github.com/flashbots/rollup-boost/blob/main/crates/rollup-boost/src/flashblocks/primitives.rs#L63), we also explain it more thoroughly in our [documentation page](https://docs.base.org/base-chain/flashblocks/node-providers?utm_source=base_dot_org#interpreting-the-data).

![](https://www.base.org/images/blog/flashblocks-deep-dive/05.webp)

When a flashblocks supported RPC method is called, it retrieves the data from the cache and returns it if available. (E.g. [eth_getTransactionReceipt](https://github.com/base/node-reth/blob/main/crates/flashblocks-rpc/src/rpc.rs#L145))

## Reliability and Performance Improvements

During the development of Flashblocks, we made several improvements to ensure the system is highly available and Flashblocks could consistently be produced in 200ms.

### Enabling Builder Failover

With the integration of op-rbuilder, it became necessary to incorporate builder health into the op-conductor’s health check. We enabled [healthcheck to rollup-boost](https://github.com/ethereum-optimism/optimism/blob/0148766dae790df6d1827c24e7d66013e952a39a/op-conductor/conductor/service.go#L217) which verifies if the builder remains sync’d within the tip of the chain. If the builder falls behind, the op-conductor will initiate a leadership transfer.

This significantly enhances Flashblocks’ availability as Flashblocks will not experience a long period of outage due to unhealthy builders. However, the downside is that if all builders are down, the op-conductor will be unable to elect a healthy leader, leading to a chain halt. Nevertheless, the probability of all builders being down simultaneously is rare, making this a reasonable compromise.

### Optimizing State Root Calculation

In the initial design, the state root was calculated for each flashblock. This was due to the complexity of determining which flashblock would ultimately become the finalized block that the builder needed to return to the op-node. Without a state root, the op-node cannot promote the block as finalized.

While this approach functioned correctly for Base Sepolia, the high transaction volume on Base Mainnet made each state root calculation take approximately 130ms on average. This pushed the total block building time close to 200ms, making it hard to build more than 9 flashblocks, potentially reducing throughput.

In order to fix this, instead of having the builder compute the state root for every flashblock, we modified rollup-boost to take the transactions from the builder, then used an additional FCU to use op-geth to build a block with state root. (Many thanks to Ferran from Flashbots for this suggestion!)

![](https://www.base.org/images/blog/flashblocks-deep-dive/06.webp)

As a result of this change, the P50 Flashblock building time dramatically decreased from 150ms to a mere 10ms, removing this issue as a launch blocker.

![](https://www.base.org/images/blog/flashblocks-deep-dive/07.webp)

### Resolving the Transaction Pool discrepancy between Geth and Reth

Moving our builder from op-geth (Geth based) to op-rbuilder (Reth based) meant shifting from using Geth’s transaction pool implementation to Reth's transaction pool implementation.

Soon after our launch, we observed some unusual behavior: the Coinbase retail staking team's transactions stopped getting included, causing a large backlog of transactions.

We then thoroughly examined the differences between the Geth and Reth transaction pool implementations and identified the following distinctions:

[Geth](https://github.com/ethereum/go-ethereum/blob/master/core/txpool/txpool.go#L37)

- **Pending**: Next-nonce transactions with no nonce-gap.
- **Queued**: Transactions with nonce-gaps.

[Reth](https://github.com/paradigmxyz/reth/blob/main/crates/transaction-pool/src/pool/txpool.rs#L87)

- **Pending**: Next-nonce transactions with a fee higher than the base fee.
- **Queued**:

 - Basefee subpool: Transactions below the base fee, even if they are next-nonce.
 - Transactions with a nonce-gap.

Consequently, if a transaction is a next-nonce transaction but has a fee lower than the base fee, it would remain pending for Geth but be queued for Reth. Once the transaction pool lifetime value is reached, queued transactions are dropped, and Geth would not rebroadcast these transactions as it always assumes pending transactions are successfully P2P'd.

To address this, we built the [Mempool-rebroadcaster](https://github.com/base/infra/tree/master/crates/mempool-rebroadcaster). This tool checks for discrepancies between the Geth and Reth txpools and rebroadcasts transactions between them. This ensures that even if a transaction is dropped from Reth, it continues to be picked up again.

### Reducing Reorg rates

In our initial implementation, builders sent flashblocks directly to the websocket proxy. Because the builder was unaware of the actual time allocated by the op-node for block building, this could lead to tail flashblocks reorgs: the tail flashblocks were streamed out but not included in the actual block.

Flashbots team added a new mechanism to instead of letting the builder to stream to websocket proxy, the builder streams to rollup-boost then rollup-boost streams to websocket proxy. It works as follows

![](https://www.base.org/images/blog/flashblocks-deep-dive/08.webp)

- Op-node sends FCU to rollup-boost, rollup-boost proxies FCU to op-rbuilder to start block building
- In each block building loop, op-rbuilder streams flashblock to rollup-boost, rollup-boost stores the flashblocks in a variable named `best_payload`
- At the end of the block building, op-node sends get_payload to rollup-boost, rollup-boost returns `best_payload`, and clears `best_payload`
- If op-rbuilder continues to send flashblock with the same `payload_id`, it gets rejected

This significantly improved our reorg rate, reducing it from 0.2% to effectively 0:

![](https://www.base.org/images/blog/flashblocks-deep-dive/09.webp)

## Future Work

### RPC Improvements

We’re currently adding new Flashblocks-aware RPCs: `eth_call` and `eth_estimateGas`. Our implementation involves having the node copies over the latest state, replays the Flashblock streams on top, and executes the request against that overlay. This makes simulations and gas estimates reflect preconfirmation state. The feature is in active development and will land after validation and testing.

### Websocket

Websocket is the low-latency backbone for traders and for teams that host their own RPC nodes. We aim to operate the public websocket with high availability and backpressure controls. However, it’s worth noting that applications should try to avoid having dependency on websocket as RPCs provide stable RPC behavior and automatic failover to regular blocks whenever Flashblocks are down.

### Other block building updates

Enabling the custom builder (op-rbuilder) as part of the Flashblocks launch has paved the way for more block building innovation, with the potential to unlock more blockspace capacity and efficiency for Base users, and even provide unique capabilities for developers. To stay up to date on any planned block building changes, follow our [docs](https://docs.base.org/base-chain/network-information/block-building?utm_source=base_dot_org) and [status page](https://status.base.org/).

## Get Involved

- [Running a flashblock-aware RPC node](https://github.com/base/node/tree/main/reth#running-a-reth-node)
- Report problems: [Open a GitHub issue](https://github.com/base/node-reth/issues)
- Questions / feedback: [Join the Discord](https://discord.com/invite/buildonbase?utm_source=dotorg&utm_medium=nav)

---

If you’re interested in helping us build a global economy that increases innovation, creativity, and freedom, [we’re hiring](https://www.base.org/jobs) and would love to hear from you.

Follow us on social to stay up to date with the latest: [X](https://x.com/base) ([Base team on X](https://x.com/i/lists/1876354838289932418)) | [Farcaster](https://warpcast.com/base/) | [Discord](https://discord.com/invite/buildonbase?utm_source=dotorg&utm_medium=nav)
