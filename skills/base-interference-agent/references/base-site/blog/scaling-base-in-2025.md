# blog/scaling-base-in-2025

Source: https://www.base.org/blog/scaling-base-in-2025.md

# Scaling Base in 2025: Sub-cent transaction fees to bring the world onchain

> TLDR: To build a global onchain economy, we need to scale. To reach our North Star of 1 Ggas/s, we’re charting a path to achieve 250 Mgas/s in 2025. Our main focuses are…

- Date: 2025-02-07
- Author: Anika Raghuvanshi
- URL: https://www.base.org/blog/scaling-base-in-2025

_TLDR: To build a global onchain economy, we need to scale. To reach our North Star of 1 Ggas/s, we’re charting a path to achieve 250 Mgas/s in 2025. Our main focuses are: increasing L1 data availability for rollups, improving client execution speed, ensuring fault proofs continue to run as expected, and maintaining a healthy disk usage for nodes._

Base’s mission is to build a global onchain economy that increases innovation, creativity, and freedom. To achieve this, one of Base’s [five strategic pillars for 2025](https://base.mirror.xyz/gFOLgyrs8jtX4Eqt4Kh6ikWhB3tqrhQoKfddeqZIECs) is to scale Base and drive gas fees down so that everyone, everywhere can come onchain. So far, we’ve scaled throughput on Base to 24 Mgas/s (pronounced “megagas per second”) — nearly 10x of where we were a year ago. But it’s still day one.

Our 2025 goal requires us to go exponentially further to scale throughput more than 10x beyond where we are today, and 100x the scale of Base when we initially launched. This is key to bring a billion people onchain: **scaling allows Base to support more load while keeping user costs low**. Low fees in turn enable more of the world to come onchain.

![](https://www.base.org/images/blog/scaling-base-in-2025/01.webp)

Since the beginning of Base, we’ve emphasized the importance of scaling throughput to keep fees low for users. The Base engineering team worked closely with the Ethereum ecosystem to scale Ethereum data availability through [EIP-4844](https://www.eip4844.com/), enabling blobs to reduce L1 fees on L2s, and more recently we’ve been involved with efforts to [increase L1 blob capacity](https://docs.google.com/document/d/19jZcm5CgWM12Eqg1HRwG_ppd1EL9tduheckBmoFBCNM/edit?tab=t.0#heading=h.hs20rimb4nkm).

In this technical deep dive, we’re detailing our progress in scaling Base so far — and how we’re planning to get to 250 Mgas/s in 2025.

### Scaling Base

Our North Star for throughput is 1 Ggas/s (pronounced “gigagas per second”), ~40x of where we are today. Base needs to scale _at least_ this much to support 1 billion users transacting onchain while ensuring transaction fees stay sub-cent.

We have approached this goal by identifying bottlenecks to scaling Base and the broader Ethereum ecosystem — both short-term and long-term — and proactively addressing them. It is a core part of our strategy to stay aligned with the industry at large to ensure we are building the best future for the Ethereum ecosystem as a whole.

Our definition of a healthy ecosystem means ensuring **Base is for everyone**. To achieve this, we need:

- **Sub-second transactions** – to enable using Base for most real-world applications
- **Sub-cent transactions** – keep Base affordable, even during spikes in traffic
- **A decentralized, open platform** – the only way we can build a truly global economy
- **A symbiotic relationship with Ethereum ecosystem** – synergistic success with Ethereum Mainnet, composable and collaborative with other L2s and L3s

### Bottleneck 1 – L1 Data Availability (DA)

L1 DA, also known as "blobspace," defines the amount of data L2s can post to L1. When blobspace is limited or contested, it leads to a zero-sum situation, where L2s must compete for available space. This is a scenario we want to avoid as it results in high fees for users and limits overall scaling of the ecosystem. However, with the emergence of new L2s and the ongoing scaling of Base and other L2s, we are already facing this challenge. For more people to come onchain, we need more data availability for rollups.

![Since November, blobs have been at target. Source: https://dune.com/hildobby/blobs](https://www.base.org/images/blog/scaling-base-in-2025/02.webp 'Since November, blobs have been at target. Source: https://dune.com/hildobby/blobs')

We have consistently been at DA capacity since the beginning of November 2024. This means that traffic spikes will create high L1 fees on L2s, and increase the overall cost of L2 transactions. Thus, this area is important to address to maintain a healthy ecosystem, both in terms of **_maintaining symbiotic relationships with L1 and other L2s_** as well as **_keeping transactions sub-cent._**

![Source: https://dune.com/hildobby/blobs, as of Feb 7, 2025](https://www.base.org/images/blog/scaling-base-in-2025/03.webp 'Source: https://dune.com/hildobby/blobs, as of Feb 7, 2025')

Base currently consumes around 35% of blobspace and is the largest blob submitter. As we continue to scale, Base will consume more and more blobspace. We have anticipated L1 DA as a scaling bottleneck for a while, and have been actively working on both (1) optimizing DA usage, as well as (2) increasing the overall amount of blobspace available.

To optimize DA usage of OP Stack chains, the Base team helped implement [Brotli compression](https://specs.optimism.io/protocol/fjord/derivation.html#brotli-channel-compression) during batching in the OP stack. This change was included in the [Fjord OP Stack hardfork](https://specs.optimism.io/protocol/fjord/overview.html), and led to a 35% reduction in DA usage. Another improvement, built by OP Stack contributors — span batches — has allowed various OP stack chains to minimize DA usage by encoding consecutive blocks with better format.

![After introducing Brotli compression in Fjord, the ratio of input to output bytes went from 0.4 to 0.25 (~35% reduction)](https://www.base.org/images/blog/scaling-base-in-2025/04.webp 'After introducing Brotli compression in Fjord, the ratio of input to output bytes went from 0.4 to 0.25 (~35% reduction)')

On increasing overall DA, our team has an active and ongoing effort to drive and accelerate [PeerDAS](https://ethresear.ch/t/from-4844-to-danksharding-a-path-to-scaling-ethereum-da/18046), to unlock significantly more DA via data availability sampling. The ambitious goal is for PeerDAS to contain a target of [50 blobs](https://x.com/adietrichs/status/1880392818470056192) at launch, and eventually support 256 or more blobs. This will be critical for bringing a billion people onchain. There are many design challenges and hard technical issues to solve to get there (e.g., optimizing network topology and bandwidth issues in the p2p layer), and we’re excited to work with the ecosystem to solve these.

We are actively collaborating with L1 and L2 communities on PeerDAS research, implementation, and testing. We [strongly advocated for its inclusion](https://base.mirror.xyz/6NDvVKw8x5obo3h1OgQx582hF73m81CnJabgbRneW2Q) in the [Pectra](https://ethereum-magicians.org/t/pectra-network-upgrade-meta-thread/16809) hard fork — but ultimately it was not included. Our team continues to prioritize supporting PeerDAS, with a significant blob increase, in the next hard fork, Fusaka.

_We did get a smaller win in Pectra though_ - we [advocated for](https://docs.google.com/document/d/1mkxfhDNvbT6jFEjH3e6LADsGGh3jEvL_WOt2glFbFfA/edit?tab=t.0#heading=h.v2qm0jqcd4bj) and [provided research on the safety of](https://docs.google.com/document/d/19jZcm5CgWM12Eqg1HRwG_ppd1EL9tduheckBmoFBCNM/edit?tab=t.0#heading=h.hs20rimb4nkm) an increase in blob target. As a result, Pectra will include a doubling of the blob target — the target/limit will go from 3/6 to 6/9.

The following graph shows how Base scaling plans are impacted by blob limits. This graph, and all other extrapolation graphs in this blog, are estimations and could be impacted by several variables. The vertical lines show time-based limits: Pectra is a solid line (relatively set timeline) in early April and Fusaka is a dotted line (in-flux timeline) in December. The horizontal lines convey limits related to Base’s throughput: the dotted lines indicate a projection of when Base’s scale would correspond to consuming half of the overall blobspace and the solid line is if Base consumed all blobspace. These estimates are based on the assumption that blob usage is relatively linear to throughput.

![Prior to Pectra, we anticipate at a throughput of 30 Mgas/s, Base will consume around 50% of blobs. This will double at Pectra. When PeerDAS lands in Fusaka, DA will likely enable our 250 Mgas/s goal.](https://www.base.org/images/blog/scaling-base-in-2025/05.webp 'Prior to Pectra, we anticipate at a throughput of 30 Mgas/s, Base will consume around 50% of blobs. This will double at Pectra. When PeerDAS lands in Fusaka, DA will likely enable our 250 Mgas/s goal.')

We see that until Fusaka lands, unless we have a major breakthrough around DA utilization, blobspace will once again become a blocker to scaling Ethereum rollup throughput.

We plan to support a more frequent and streamlined blob increase schedule (see [proposal from OP Labs](https://ethereum-magicians.org/t/blob-parameter-only-bpo-forks/22623)), separate from the hard fork schedule after PeerDAS is live. We believe this should only be pursued post PeerDAS given the network bandwidth constraints we would likely hit without it. We also believe the community’s focus should remain on shipping PeerDAS as a top priority, given this will be the biggest win long term.

In parallel, we will continue to work on optimizing usage of DA on the Base side. Future work here may include further compression, investigating and proposing ways to batch less data to L1, and state diffs. Even with these optimizations we assume that DA usage will still linearly grow alongside network usage. An approach that may avoid this is to reduce the amount of L1 data per unit of gas. This may look like repricing opcodes or a multidimensional fee mechanism. Directing some traffic to L3s or offloading compute to prover networks would also help, especially applications with high throughput requirements.

### Bottleneck 2 – Client Execution Speed

Client execution performance is a key component of maintaining a healthy node ecosystem, which is important for maintaining a **_decentralized platform_**. This in turn allows Base to handle **_more transactions_** while **_remaining sub-second and sub-cent_**. Under high load, it’s possible for nodes to fall behind the network, and in the worst case, not be able to catch up. We must ensure that block building speeds and sync times stay reliable as we continue to scale Base.

With Base’s current 2-second block times, we have defined the following chain health metrics for execution speed:

- Average (P50) block execution/sync time: \<500ms
- P90 block execution/sync time: \<1s
- P999 block execution/sync time: \<2s

We enforce stricter ranges for our sequencer, but these SLOs ensure the majority of nodes stay in sync with the live state of the chain. We will continue to evaluate and redefine these SLOs as we monitor the health of the overall Base ecosystem.

![Source: base.org/stats. Sequencer nodes (left) and mempool nodes (right) block building performance.](https://www.base.org/images/blog/scaling-base-in-2025/06.webp 'Source: base.org/stats. Sequencer nodes (left) and mempool nodes (right) block building performance.')

Base has been running [op-geth](https://github.com/ethereum-optimism/op-geth) since inception, and to maintain reliable infrastructure, we have performed several optimizations on our Geth nodes, including moving the database architecture from LevelDB to PebbleDB, and moving from a hash based storage layout to path based, both of which yielded minor improvements in block building speed.

Despite these improvements, we expect to hit a bottleneck in Geth’s block building speed, likely around 40–50 Mgas/s. Given this, we began benchmarking alternative high-performance execution clients. [Reth](https://github.com/paradigmxyz/reth), built by the Paradigm team, proved promising with ~70% improvement for p999 block building speeds. We recently published a [blog post](https://www.base.org/blog/scaling-base-with-reth) with detailed findings. We are actively migrating to running Reth for all of our node software, and encouraging others in the ecosystem to do the same. We anticipate that this will roughly 2–3x our existing limit today.

![Client performance bottlenecks include a soft limit of ~40 Mgas/s for Geth execution performance and ~100 Mgas/s for Reth.](https://www.base.org/images/blog/scaling-base-in-2025/07.webp 'Client performance bottlenecks include a soft limit of ~40 Mgas/s for Geth execution performance and ~100 Mgas/s for Reth.')

As part of our execution client performance analysis, [we found that](https://www.youtube.com/live/ta7yY51RK2Q?t=7845s), regardless of the execution client, state access makes up a significant portion of latency. Blocks that contain high volumes of storage access take almost 30 times longer to execute than blocks with no storage access. Furthermore, for workloads with minimal state access, clients can likely perform up to ~500 Mgas/s. Because of this finding, we are actively researching database architectures that can reduce state access latency, especially as the state size continues to grow.

For future work on client execution performance, there are a few promising directions to explore. Since the EVM is single threaded, parallel execution could allow nodes, which run modern multi-threaded infra, to better utilize compute resources. Just-in-time or ahead-of-time compilation of EVM bytecode to native code could optimize execution by removing the interpreter’s overhead. A direction that could provide a stepwise improvement is delayed state roots: pipelining transaction execution would give nodes two full slot times instead of one to execute transactions, store state changes, and compute the state root, roughly doubling the time a node has for block building. In addition, if the sequencer provided “access hints” to indicate which storage slots would be accessed, nodes would save time pre-loading relevant state instead of doing this in real-time.

### Bottleneck 3 – Fault Proofs

[Fault proofs are essential](https://base.mirror.xyz/eOsedW4tm8MU5OhdGK107A9wsn-aU7MAb8f3edgX5Tk) for making Base an **_open and decentralized platform_**. To ensure that Base remains decentralized, we must ensure that the Fault Proof System (FPS) is live and running as expected, and that scaling does not introduce incompatibilities.

For the FPS to work as expected, at least one honest actor (a node running the challenger software) must participate to properly defend challenges to the system. As shared in [a previous blog](https://www.base.org/blog/scaling-base-accelerating-decentralization), we created a benchmarking system to validate that any challenges to the FPS can successfully resolve within the allowed time frame (the “challenge window”). The initial results, shared in the blog, showed that the existing FPS on Base comfortably supports scaling Base blocks to a limit of 120 Mgas (60 Mgas/s), with the main constraint coming from memory usage. More recent benchmarks show even more promising results - potentially supporting up to 80–90 Mgas/s gas limit.

This falls significantly short of our 2025 year-end goal of 250 Mgas/s. It is also worth noting that to achieve 250 Mgas/s as the gas _target_ for the year, we would actually need fault proofs to support a gas _limit_ of 500 Mgas/s. Note that the protocol restricts us to a 1:2 ratio for gas target to limit, however a 2:3 ratio generally provides enough buffer for traffic spikes. To modify this, we would need a OP stack protocol change or to [set the limit on the sequencer side](https://x.com/AnikaRaghu/status/1864377101341897197).

We are focusing our efforts in a few areas to achieve these goals. OP Labs has made major improvements to the existing FPS in the OP Stack to address the memory usage bottleneck. These changes include enabling the go runtime’s garbage collection to prevent runaway memory usage growth and moving from 32bit to 64bit MIPS architecture to allow for a larger heap size. This should remove memory issues entirely, meaning that speed becomes the only constraint. We are currently reviewing and benchmarking this updated FPS, called Multithreaded + 64bit Cannon, but it will likely support a gas target of up to ~50 Mgas/s. It is scheduled to go live in early Q2.

![The existing FPS supports ~60 Mgas/s limit (30 Mgas/s target). The new system will likely support ~100 Mgas/s limit (~50 Mgas/s target).](https://www.base.org/images/blog/scaling-base-in-2025/08.webp 'The existing FPS supports ~60 Mgas/s limit (30 Mgas/s target). The new system will likely support ~100 Mgas/s limit (~50 Mgas/s target).')

In addition, the Base engineering team supported the development of [partial span batch validation](https://specs.optimism.io/protocol/holocene/derivation.html#span-batches) in the recent [Holocene OP Stack hardfork](https://specs.optimism.io/protocol/holocene/overview.html), to reduce the amount of blocks a fault proof program needs to execute at once, therefore reducing resource constraints.

Even with these new improvements, though, the existing Fault Proof System uses Geth as the default client. With our ongoing migration to Reth, we are increasingly interested in a Reth based FPS. OP Labs has already created an implementation called [Kona](https://hackmd.io/@clabby/B1H79bqkR), which we are beginning to review as well. We believe this could unlock a stepwise improvement for scaling.

Looking forward, ZK-based Fault Proof Systems could provide another major unlock.

### Bottleneck 4 – State and History Growth

Maintaining a healthy state size and rate of growth is important for a **_healthy and distributed ecosystem of node operators_**. If node operators see nodes running low on disk space to store active or historical state, they can usually scale up their infra to use a larger instance. However, there are limits to the largest instance size that cloud infrastructure providers offer — historically 30TB of low-latency storage. More recently, larger instances are becoming available (AWS now has an option up to 120TB), which push up this hard limit. It is worth noting that these are hard limits that we cannot reverse ourselves out of. If we scale Base and nodes run out of disk space, scaling back down will not solve this problem.

On [base.org/stats](http://base.org/stats), we have visualizations of disk usage for both Geth and Reth archive nodes. Archive nodes store the entire historical state, so their disk usage continues to grow with time. These graphs show the existing usage and projected growth over 1 and 6 months. The graphs illustrate another reason we are [migrating to Reth](https://www.base.org/blog/scaling-base-with-reth) — Reth has shown very promising improvements in terms of overall historical state, as well as rate of growth. If we consider 30TB to be the limit, we are projected to hit this limit in late June with Geth, whereas with Reth, based on the current average rate of growth of ~8.5 GB/day, it will take over 10 years.

![Source: base.org/stats. Disk usage as a proxy for history growth on Geth and Reth archive nodes.](https://www.base.org/images/blog/scaling-base-in-2025/09.webp 'Source: base.org/stats. Disk usage as a proxy for history growth on Geth and Reth archive nodes.')

Note that the numbers above do not take into account Base’s scaling plans. Based on our preliminary analysis, disk usage growth has _not_ been super correlated with gas increases, i.e., higher throughput has not led to an increased rate of growth. This is because history growth depends much more on usage patterns than overall throughput, and this may suggest that even with gas increases, the factors that contribute to history growth are relatively stable.

![Average disk usage growth, as a proxy for history growth, of Geth and Reth archive nodes per day of Base being at a certain gas target (throughput). Unexpectedly, there is no clear upward trend as Base scales. Note there is some missing data for Geth.](https://www.base.org/images/blog/scaling-base-in-2025/10.webp 'Average disk usage growth, as a proxy for history growth, of Geth and Reth archive nodes per day of Base being at a certain gas target (throughput). Unexpectedly, there is no clear upward trend as Base scales. Note there is some missing data for Geth.')

However, increased throughput can definitely open up the possibility of the historical state growing faster, especially as more users come onchain, so these metrics are something we continue to keep tabs on.

To address history growth concerns, we have migrated the majority of our nodes to Reth already, and are working to remove remaining dependencies on Geth archive nodes. In the future, we may consider utilizing alternative solutions for storing and retrieving historical state, such as the [Portal Network](https://ethportal.net/), or traditional sharded databases.

![](https://www.base.org/images/blog/scaling-base-in-2025/11.webp)

Even with a full Reth migration and having more disk space, state will continue to grow, and the most optimized client will eventually run into an upper limit from the active state alone. Therefore, we must consider longer term solutions, such as smarter ways to archive historical state or expire inactive state to prevent uncontrolled growth.

### A Based Future

Putting together everything described so far, the following image shows the full picture of our anticipated scaling bottlenecks. We are going to have to tackle a lot of challenging problems, and likely some additional unknown ones not described here, to achieve our 2025 goal of 250 Mgas/s.

![Base's scaling trajectory overlaid with all scaling bottlenecks, as best estimated today.](https://www.base.org/images/blog/scaling-base-in-2025/12.webp "Base's scaling trajectory overlaid with all scaling bottlenecks, as best estimated today.")

We also recognize that there are certain applications that may have higher requirements around speed and throughput but less demand for the security guarantees of an Ethereum L2, such as games, which might outpace Base’s ability to scale. L3 Appchains may provide a good alternative for hosting these applications.

### Scaling Together

We would not have been able to scale Base by nearly 10x since launch without the support of many teams across the ecosystem — and we’ll continue to collaborate to scale it further. We hope these efforts to scale Base provide learnings and infrastructure to enable other L2s and the rest of the Ethereum ecosystem to scale.

2025 is the year we scale together. We’re looking for collaboration partners to pursue challenges like shipping PeerDAS, state diffs, rearchitecting the storage/database layer, ZK Fault Proofs, and state expiry. If you’re interested in working on creative and ambitious scaling solutions to enable the next billion people to come onchain, [we’re hiring](https://www.base.org/jobs) — and we’d love to hear from you.

Follow us on social to stay up to date with the latest: [X](https://x.com/base) ([Base team on X](https://x.com/i/lists/1876354838289932418)) | [Farcaster](https://warpcast.com/base/) | [Discord](https://discord.com/invite/buildonbase?utm_source=dotorg&utm_medium=nav)
