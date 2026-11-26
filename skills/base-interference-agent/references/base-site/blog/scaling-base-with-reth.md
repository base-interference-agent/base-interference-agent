# blog/scaling-base-with-reth

Source: https://www.base.org/blog/scaling-base-with-reth.md

# Scaling Base With Reth

> Unlocking the future of Base

- Date: 2024-12-18
- Author: Danyal Prout
- URL: https://www.base.org/blog/scaling-base-with-reth

## Introduction

One of Base’s core tenets is to build in the open, including talking about our work with the Base community. Today, we’re launching the Base engineering blog to do more of just that. Our first blog post will explore our technical efforts to scale execution layer clients.

In our mission to continue scaling Base, we intend to use Reth for all our archive nodes and will make continuous ongoing investment to ensure that Reth seamlessly integrates with the OP Stack and remains user-friendly for Base operators. We encourage others to follow suit.

## Using Reth

A Base node consists of two pieces of software: a consensus client (e.g. [op-node](https://github.com/ethereum-optimism/optimism/tree/develop/op-node)) and an execution client, which is responsible for processing user transactions, constructing blocks and serving [RPC calls](https://www.quicknode.com/docs/ethereum). As part of our efforts to continue scaling Base, the Base core team has been rigorously evaluating the performance of various execution clients.

Currently, OP Stack chains primarily use [Geth](https://github.com/ethereum-optimism/op-geth), as it is the canonical OP Stack execution client. However, there are other clients such as [Reth](https://github.com/paradigmxyz/reth) and [Nethermind](https://github.com/NethermindEth/nethermind) that support OP Stack chains – each with their own design and tradeoffs. Our long-term vision is for Base to be a multi-execution client chain, where there is diversity of clients for both sequencing and validating the chain. This is critical for any high-availability chain. We have already avoided multiple outages on Base by running Reth in conjunction with Geth \[[1](https://www.base.org/blog/scaling-base-with-reth)\]

Scaling execution client performance is constrained by various hardware limitations (see [this blog series from Paradigm](https://www.paradigm.xyz/2024/03/how-to-raise-the-gas-limit-1)). While Geth has been a very stable and performant execution client for Base, we’re beginning to encounter challenges due to the increased usage of the network:

- **Disk Usage Requirements** - The disk space required to operate a Base Geth archive node is growing ~500Gb/week.
- **Provisioning New Nodes** - Given the large database size, when provisioning a new Geth archive node, it takes ~15 hours to download a snapshot and sync to tip.
- **Long Running Database Compactions** - As the amount of write traffic increases, we’ve encountered long running [database compactions](https://github.com/google/leveldb/blob/main/doc/impl.md#compactions), resulting in Geth nodes falling behind.

Our immediate concern is the storage requirements for running a Base archive node, which impact the first two bullet points. This is especially relevant given that we recommend [NVMe](https://en.wikipedia.org/wiki/NVM_Express) storage for operating a node, which has a soft limit of 30TB and a maximum limit of 60TB for many node operators. \[[2](https://www.base.org/blog/scaling-base-with-reth)\]

## Why use Reth?

Reth has several appealing qualities. A couple initially stood out to us when determining which execution clients to explore:

- **OP Stack Support** - Reth has [built in OP Stack support](https://github.com/paradigmxyz/reth/tree/main/crates/optimism).
- **Growing Ecosystem** - lots of Reth based OP Stack tooling (e.g. [Kona](https://github.com/anton-rs/kona), [op-succinct](https://blog.succinct.xyz/op-succinct/)) is being created.

In addition, there are properties Reth anecdotally improved, that we decided to benchmark ourselves:

- **Reduced Disk Usage** - Reth has a different [database structure](https://github.com/paradigmxyz/reth/blob/main/docs/design/database.md#table-layout), which requires much less storage than Geth. This design is particularly efficient at storing historical state.
- **EVM Performance** - Revm [promises improved performance](https://github.com/ziyadedher/evm-bench?tab=readme-ov-file#evm-bench) allowing us to scale Base further.

From our latest benchmarking, you can see the impact of these qualities. We see large improvements for Reth over Geth in both disk usage and block building performance.

| | **Geth (archival)** | **Reth (archival)** | **Improvement %** |
| ------------------------- | ------------------- | ------------------- | ----------------- |
| **Current Disk Usage** | 16.61TB | 2.74TB | 83.5% |
| **Weekly Disk Growth** | ~560GB | ~50GB | 91.1% |
| **Block Building p50** | 374ms | 260ms | 30.5% |
| **Block Building p95** | 1660ms | 560ms | 66.3% |
| **Block Building p99** | 2319ms | 698ms | 69.9% |
| **Block Building p999** | 3079ms | 889ms | 71.1% |
| **Provisioning New Node** | 15 hours | 3 hours | 80% |

_(methodology_ [_below_](https://www.base.org/blog/scaling-base-with-reth)_)_

The [order of magnitude slower growth of disk](https://www.base.org/stats) usage allows Reth archive clients to stay below the 30TB NVMe limit until the middle of the 2030’s at current growth rates, whereas for Geth we anticipate hitting the limit around May 2025.

![State size per client](https://www.base.org/images/blog/scaling-base-with-reth/01.webp 'State size per client')

Finally, there are a couple more benefits of Reth which we’ve seen to be true during our initial work migrating parts of the Base infrastructure to Reth:

- **Contributor Friendly** - We’ve been able to easily add support for a handful of OP Stack hardforks  ([Fjord](https://github.com/bluealloy/revm/pull/1420), [Holocene](https://github.com/paradigmxyz/reth/pull/11473)).
- **Quicker Historical Sync** - We’ve found that Reth’s staged sync allows new nodes to sync to the tip of the chain significantly faster.

All the benefits of Reth we’ve observed and benchmarked have led us to treating Reth as a core execution client for Base.

## Preparing for the future

In the short term, we use Reth for all of our archive nodes, while continuing to run Geth full nodes for the sequencer. We’ll continue to invest in ensuring that Reth fully supports the OP Stack and that it’s easy to run a Base Reth node. In 2025 our goal is to also use Reth for sequencing – taking us one step closer to gigagas.

### Node Operators

**Early 2025**

Starting early 2025, we want to encourage node operators to begin evaluating Reth for their archive nodes. To help this effort, we have daily Reth [snapshots](https://docs.base.org/tutorials/run-a-base-node/?utm_source=base_dot_org#snapshots) and Base-specific Reth [images](https://github.com/base-org/node/pkgs/container/node-reth).

**May 2025**

We expect Geth storage requirements will be ~30TB. We would recommend running Reth archive nodes and Geth full nodes.

In the unlikely event of a fork between Geth and Reth, the Geth chain will still be considered canonical.

### Core Network

**Now**

For sequencing and fault proofs, Base will continue to use Geth full nodes and [op-program](https://github.com/ethereum-optimism/optimism/tree/develop/op-program) (the canonical fault proof implementation), as Geth is the reference client for the op-stack and the op-program fault-proof program uses the Geth EVM.

For the other nodes we operate, we’re running duplicate Reth and Geth clusters. If you’ve sent a transaction on Base recently, it likely went via a Reth node!

**Late 2025**

Once there are production ready releases of [Kona](https://github.com/anton-rs/kona) and [Asteric](https://github.com/ethereum-optimism/asterisc), we plan to make Reth the canonical client for Base. This means, if there is a divergence in execution clients, Reth will be considered the source of truth. We believe this will help unlock the next chapter of scalability for Base.

**2026**

Our long term goal is to have at least three execution clients for all the core network nodes.

Having multiple clients, provers, and a robust multi-proof system will allow us to move from a single reference client and move to a ⅔ consensus approach for sequencing and proving.

### Conclusion

As we continue to scale Base, optimizing execution clients is crucial for performance and efficiency. Using Reth will help us unlock the next chapter of scaling Base to 1 Gigagas/second.

We would like to thank all the execution client teams we’ve spoken to and collaborated with over the last year, with a special thanks to the Reth team (especially [Georgios](https://x.com/gakonst) & [Matthias](https://x.com/mattsse_)).

Stay tuned for more updates as we progress towards our goal of bringing a billion people onchain.

---

## FAQ

### **What Incidents did operating Reth & Geth concurrently prevent?**

1. Long Running Database Compactions on LevelDB Geth Archive Nodes

 1. During this time we had several core-network Geth nodes have 30+ minute compactions during which time the nodes were unavailable. The Reth nodes continued to gossip blocks and process new transactions from users.

2. Misconfiguration of Geth

 1. We misconfigured the gas limit on our Geth mempool nodes which caused them to fork onto their own chain.
 2. As the Reth nodes were configured separately, they continued to operate correctly.

### **Why is there this limit?**

Cloud providers have limited configurations of servers with NVMe storage. For example, on AWS, the fastest NVMe machine types are [i4i](https://aws.amazon.com/ec2/instance-types/i4i/), which have a limit of 30TB. They also offer a slower NVMe machine type, [i3en](https://aws.amazon.com/ec2/instance-types/i3en/) which offers NVMe drives up to 60TB.

### **How were the benchmarks run?**

- Tests were run on an [i3en.12xlarge](https://instances.vantage.sh/aws/ec2/i3en.12xlarge)
- The NVMes were RAID0’d together and formatted as EXT4
- Blocks were then ingested via the [replayor](https://github.com/danyalprout/replayor) and the results were recorded.
- Both Reth and Geth were configured as archive nodes
- Geth was configured to use LevelDB and hashdb.
- 5,000 block range on Base mainnet (from 13087231 to 13092230), note this range was chosen due to having a large number of expensive blocks.
