# blog/scaling-base-doubling-capacity-in-30-days

Source: https://www.base.org/blog/scaling-base-doubling-capacity-in-30-days.md

# Scaling Base: Doubling capacity in 30 days

> TL;DR: We’re continuing to scale Base to serve as a platform for the global economy. By the end of 2025, our goals are to double Base Chain’s gas limit, improve client…

- Date: 2025-10-28
- Author: Anika Raghuvanshi
- URL: https://www.base.org/blog/scaling-base-doubling-capacity-in-30-days

**TL;DR:** We’re continuing to scale Base to serve as a platform for the global economy. By the end of 2025, our goals are to double Base Chain’s gas limit, improve client performance, and expand L1 data availability to meet growing demand while maintaining sub-cent transaction fees.

_Special thanks to Trent Van Epps (Protocol Guild, Ethereum Foundation), Alex Stokes (Ethereum Foundation), Eli Haims (OP Labs) for reviewing drafts of this blog._

---

Base’s mission is to build a global economy. To achieve this, we’re committed to continuously scaling Base Chain so it can serve as a platform for billions of people to come onchain. We started 2025 at 10x the scale from when we launched Base Chain a year before, and have since made significant progress towards unlocking more capacity to meet growing demand while maintaining sub-cent transaction fees.

At the beginning of this year, we identified multiple [scaling bottlenecks](https://www.base.org/blog/scaling-base-in-2025) that we’ve been proactively addressing through large scaling projects that are now nearing completion, such as migrating our infrastructure to Reth, optimizing performance with TrieDB, and expanding L1 data availability with PeerDAS.

These projects unlock stepwise performance gains that now enable us to scale Base Chain much more quickly. **As a result, in Q4, our goal is to double Base Chain’s gas limit from 75 to 150 Mgas/s.**

## Our progress thus far

Through the first half of 2025, we performed scaling increases on Base Chain nearly every week. As a result, we saw median fees drop from ~30 cents per transaction to fractions of a cent. In mid-Q2, we paused these increases to ensure chain stability and focus on the longer-term scaling efforts that promised to unlock larger scaling gains.

In the past several months, Base has continued to grow: more breakout apps have emerged, bringing 10x more onchain activity to the network. In June 2025, Base Chain successfully handled periods of up to [~1,500 transactions per second](https://www.base.org/blog/scaling-base-sustain-10x-growth) with median fees of under 5 cents.

During this time, we [reflected](https://www.base.org/blog/scaling-base-sustain-10x-growth) on how proactively increasing Base Chain’s gas target ahead of organic traffic can lead to a suboptimal fee market. Therefore, we’re now continuing to scale Base Chain by increasing its **gas limit** (i.e. maximum capacity) instead of the gas target, since gas limit increases have less impact on the fee market. We reserve gas target increases for when we observe high fees.

As we charge ahead with continuing to scale Base Chain’s gas limit, we provide an update on the progress we’ve made on tackling scaling bottlenecks.

## Scaling Bottleneck Review

We have made significant progress towards removing scaling bottlenecks since [our last update](https://www.base.org/blog/scaling-base-reaching-50-mgas-in-q2). As a reminder, we track 4 main scaling bottlenecks:

- **L1 DA**: How much data we can post to Ethereum
- **Client Execution Speed**: How quickly blocks can be built and validated
- **Fault Proof Performance**: How quickly fault proof games can be played out
- **State and History Growth**: How much disk usage nodes are required to maintain

#### Bottleneck 1: L1 Data Availability

On May 7, the Pectra hardfork went live on Ethereum mainnet, doubling the available blob space. For more than 6 months leading up to this, blobs usage was at capacity; after the hardfork, L2s were able to utilize more space and accordingly settle more onchain activity.

![Source: https://dune.com/hildobby/blobs](https://www.base.org/images/blog/scaling-base-doubling-capacity-in-30-days/01.webp 'Source: https://dune.com/hildobby/blobs')

[PeerDAS](https://eips.ethereum.org/EIPS/eip-7594), projected to go live in early December as part of the Fusaka hardfork, represents the next significant advancement for L1 DA. It addresses the challenge of increasing blobs without burdening L1 consensus nodes, by sharding blobs across various nodes.

The implementation of PeerDAS was a huge collaborative effort, with numerous ecosystem teams advocating for its accelerated release ([1](https://www.base.org/blog/achieving-more-blob-space-in-2025), [2](https://www.optimism.io/blog/peerdas-and-a-48-blob-target-in-2025), [3](https://blog.sigmaprime.io/shipping-peerdas.html)), effectively reducing the timeline by several months. Fusaka lays the crucial technical groundwork of PeerDAS, without increasing blobs. Once the implementation is observed to be stable, blobs will increase in Blob Parameter Only (BPO) forks, anticipated to land very shortly after.

| **Projected Date** | **Fork Name** | **New Blob Target** | **New Blob Limit** |
| ------------------ | ------------- | ------------------- | ------------------ |
| 12/3/2025 | Fusaka | 6 (no change) | 9 (no change) |
| 12/9/2025 | BPO 1 | 10 | 15 |
| 1/7/2026 | BPO 2 | 14 | 21 |

As a result, we’re on track to more than 2x blobs as an ecosystem by early 2026, which we hope will be sufficient to support Base Chain and other L2’s continued scaling plans in the near future.

![Pectra and Fusaka have both provided significant benefits to addressing this bottleneck.](https://www.base.org/images/blog/scaling-base-doubling-capacity-in-30-days/02.webp 'Pectra and Fusaka have both provided significant benefits to addressing this bottleneck.')

#### Bottleneck 2: Client Execution Speed

This is our biggest bottleneck today and the focus of several of our active projects.

To scale safely, we need to ensure that both sequencer and validator nodes are able to build blocks fast enough. These blocks continue to become larger as we scale, and we ideally can build confidence in nodes being able to build these larger blocks _before_ we scale. To solve this, we built a [benchmarking tool](https://base.github.io/benchmark/#/latest) to simulate block building times at a gas limit we specify, with various traffic patterns. We will share more details on this tool in the coming weeks, but this groundwork illuminated specific performance constraints we needed to address prior to scaling.

**Effort 1: Reth Everywhere**

We are actively migrating Base Chain nodes from the original default client, op-geth, to our new Base client, based on op-reth, which we have measured to be significantly more performant. We have [made notable progress](https://www.base.org/blog/scaling-base-with-reth) by migrating almost all internal node infrastructure, most recently our sequencer nodes, to Reth.

The only nodes we still run on op-geth are parts of the fault proof system, however we will be moving to Kona, a Reth-based fault proof program built by OP Labs, after an upcoming Base Chain upgrade, U18, enables this.

Finally, to fully realize the performance improvements of Reth, we need to enable Reth to fetch historical state efficiently, which it currently is not designed to do. We designed an [ExEx](https://github.com/op-rs/op-reth/issues/162) to improve efficiency, which we are collaborating with OP Labs to finish implementing and rolling out.

For external validators, we recommend Reth as the default client moving forward.

**Effort 2: TrieDB**

Over a year ago, when our team benchmarked Reth, we noticed that, while Reth was far more performant than Geth, storage reads and writes were the long tail of execution speed. Speeding these up could provide an 8-10x performance improvement.

As a result, we invested in TrieDB: a project which restructured the database format to make fetching state much faster. We’ve been actively developing this project for several months and are close to having a final version. We have [spoken about](https://youtu.be/LOxkZcASH0s?t=3048) and [open-sourced](https://github.com/base/triedb) this project and will be sharing a more detailed technical explainer and timelines soon.

**Effort 3: Resource metering and opcode repricing**

While TrieDB focuses primarily on improving the speed of storage reads and writes, there are other opcodes that are also mispriced today, compared to the resource load they put on the network. The ideal solution would be to reprice these opcodes across the board. This sounds trivial, but in practice is a massive coordination and execution effort, so we are working on this in parallel to a more immediate solution.

One solution is managing resource usage, or “resource metering”, to ensure that Base Chain nodes remain stable while ensuring that user transactions are quickly confirmed. We already use this today [to manage Base Chain's blob usage](https://docs.optimism.io/chain-operators/guides/configuration/batcher#batcher-sequencer-throttling), the most critical resource that rollups rely on to inherit security guarantees from L1. Optimism is formalizing this in the next OP Stack upgrade by [adding _in-protocol_ metering](https://github.com/ethereum-optimism/design-docs/blob/main/protocol/da-footprint-block-limit.md). This allows the congestion management from Ethereum’s EIP-1559 to kick in so users are less likely to experience delays in transaction inclusion.

Separately, we have been working on a new project to revamp the mempool on Base Chain, which enables features like bundle support and transaction status tracking for users. One big scaling benefit of this project is that it allows us to more easily apply resource metering to other resources besides blob usage. There are several open questions and decisions around the design of this, which we will be sharing and soliciting feedback shortly.

**Effort 4: Access lists**

We have begun exploring [Flashblock Access Lists](https://github.com/base/op-rbuilder/blob/de025169183ef7d4bd9cb77ed96515943641e86b/docs/FAL-Flashblock-Access-Lists.md) (FAL), an adaptation of [EIP-7928](https://eips.ethereum.org/EIPS/eip-7928) for OP Stack chains that produce Flashblocks, along with OP Labs. FAL improves execution performance of validator nodes by enabling parallel disk reads, parallel transaction validation, and executionless state updates.

Summarizing all of these efforts around execution, the Reth sequencer migration has made it safe to increase gas limit to at least 150 Mgas/s, and we believe we can unlock a gas limit of 400-500 Mgas/s by early 2026, with efforts like TrieDB and resource metering landing soon.

![Our recent migration of the Base sequencer to Reth has enabled a stepwise performance gain, and as more projects land later this year, we will unlock even more ability to scale.](https://www.base.org/images/blog/scaling-base-doubling-capacity-in-30-days/03.webp 'Our recent migration of the Base sequencer to Reth has enabled a stepwise performance gain, and as more projects land later this year, we will unlock even more ability to scale.')

#### Bottleneck 3: Fault Proof Performance

In our last update, a major bottleneck was fault proof performance. Given that Base Chain still relies on an optimistic proof system, we cannot produce more transaction data than can be properly proven and verified by our proof system. We are bound by how long it takes for fault proof game participants to produce successful challenges.

However, OP Labs produced an improved version of the fault proof system which introduced multi threading and utilized a 64 bit architecture (over 32 bits) - MT+64 Cannon. These two modifications significantly improved performance, and fault proofs have since not been a concern for scaling post rollout.

![Since the upgrade to MT+64 Cannon, fault proofs are not an immediate bottleneck.](https://www.base.org/images/blog/scaling-base-doubling-capacity-in-30-days/04.webp 'Since the upgrade to MT+64 Cannon, fault proofs are not an immediate bottleneck.')

In addition, to continue decentralizing, we are exploring ZK-based proof systems for Base Chain and we believe these could have positive benefits for scaling.

#### Bottleneck 4: State and History Growth

Our “Reth everywhere” efforts have paid strong dividends in managing state and history growth as well. As a result, we do not currently have major concerns for historical growth becoming a scaling blocker in the near term, however this could change as we begin to significantly increase the gas limit. We anticipate that one of the next long term projects we take on to address this challenge will be around state expiry, and the team is beginning to explore potential avenues in this direction.

#### Bottleneck Summary

Combining all of these, we get the following summary graph. Notably, we have cleared the path to scaling to 150 Mgas/s in the next month.

![](https://www.base.org/images/blog/scaling-base-doubling-capacity-in-30-days/05.webp)

## Guardrails

We believe proactively increasing Base Chain’s gas limit is core to supporting a billion people onchain, so the core metric we use to track scaling progress is gas limit per second.

However, the intended impact of scaling is to maintain sub-cent transactions on Base Chain so we must also track fees to ensure we’re sustaining this.

Since transactions can range in complexity and therefore cost, the fee metric we track is the cost of a standard amount of gas usage. We have started with 100k gas – a bit more than what’s used by an average swap.

![Daily report of price paid for 100k gas, broken down by median, p75, p90 and p95 costs.](https://www.base.org/images/blog/scaling-base-doubling-capacity-in-30-days/06.webp 'Daily report of price paid for 100k gas, broken down by median, p75, p90 and p95 costs.')

Besides fees, we also track transaction inclusion time and uptime. These are tangential to scaling, but degradation in these metrics could indicate that we need to scale more or focus on infra reliability. An active goal this quarter is to improve reliability so that 99.9% of blocks are built in less than 2 seconds, which we hope to achieve by landing the projects related to execution speed.

## Looking Forward

As we have observed fees starting to increase on Base Chain during periods of heightened activity, we are committed to accelerating our scaling roadmap to reduce these fees and maintain sub-second, sub-cent transactions on Base.

Our efforts to accelerate scaling have been made possible by the support of many teams across the ecosystem. We are grateful to the protocol teams and infrastructure operators that have been so receptive to and supportive of our scaling efforts.

We’ll continue to collaborate to scale Base Chain to support 1 billion+ users. If you’re interested in working on creative and ambitious scaling solutions to enable the next billion people to come onchain, [we’re hiring](https://www.base.org/jobs), and we’d love to hear from you.

---

Follow us on social to stay up to date with the latest: [X](https://x.com/base) ([Base team on X](https://x.com/i/lists/1876354838289932418)) | [Farcaster](https://warpcast.com/base/) | [Discord](https://discord.com/invite/buildonbase?utm_source=dotorg&utm_medium=nav)
