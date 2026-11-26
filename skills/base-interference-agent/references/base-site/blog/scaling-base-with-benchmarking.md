# blog/scaling-base-with-benchmarking

Source: https://www.base.org/blog/scaling-base-with-benchmarking.md

# Scaling Base safely with end-to-end benchmarking

> TL;DR: To scale Base Chain safely, we built an end-to-end benchmarking framework to test Ethereum client performance under real-world conditions. These benchmarks help us identify…

- Date: 2025-11-13
- Author: Julian Meyer
- URL: https://www.base.org/blog/scaling-base-with-benchmarking

**TL;DR:** To scale Base Chain safely, we built an end-to-end benchmarking framework to test Ethereum client performance under real-world conditions. These benchmarks help us identify bottlenecks, validate hardware configurations, and ensure Base can continue to scale reliably while maintaining sub-cent, sub-second transactions.

As Base grows, we’re seeing more onchain activity than ever before, with an all-time high of [15.4M+ transactions](https://x.com/WilsonCusack/status/1987902566223827401) recorded this week. To meet growing demand, we’re significantly investing in scaling efforts:   for example, this month alone we’ve [doubled Base Chain’s capacity](https://www.base.org/blog/scaling-base-doubling-capacity-in-30-days).

To scale safely, we must anticipate any performance challenges that could arise _ahead of time_ so we can keep growing without bottlenecks. To accomplish this, we built [Base Benchmark](https://github.com/base/benchmark): a new Ethereum L2 benchmarking tool, which simulates running the chain at higher loads to identify bottlenecks in the execution client.

## **Why did we build Base Benchmark?**

The biggest scaling challenge we face today is execution speed. Many variables can affect execution speed, such as machine size, available cache, and client implementation. Additionally, transaction patterns vary widely across blocks, so a hardware setup that works perfectly for one CPU-bound workload may not work as well for a storage-bound workload. Also, different precompiles, storage operations, and transaction types can lead to variable performance across clients.

When we increase Base Chain’s gas limit, we need to ensure the network continues to run smoothly and transactions are processed quickly for everyone. This means ensuring that the gas limit we plan to scale to is safe across all traffic types and patterns, and that we have a good understanding of the recommended hardware configurations for nodes. As we scale, the chain must remain resilient to processing spam and other resource intensive transactions.

We needed a way to test the worst case blocks under various conditions. Unfortunately, testnets aren’t sufficient for simulating worst case conditions because state size (the size of all accounts/contract data deployed on the blockchain) has a huge impact on storage performance, and testnets generally don’t have the same state size as mainnet.

We considered various alternatives, but none offered the automation and flexibility that we wanted in a blockchain performance testing tool.

- [Spamoor](https://github.com/ethpandaops/spamoor), [contender](https://github.com/flashbots/contender), [tx-fuzz](https://github.com/MariusVanDerWijden/tx-fuzz): These tools allow generating a transaction workload, but don’t handle setting up the network and collecting metrics. We designed Base Benchmark to allow running these as external transaction generators.
- [Kurtosis](https://github.com/kurtosis-tech/kurtosis): This sets up an L1 blockchain to run transaction spammers against, but we wanted an automated and lightweight mechanism to setup and teardown hundreds of test chains quickly.
- [Bloatnet](https://cperezz.github.io/bloatnet-website/index.html): This is a public test network with a large amount of state, allowing storage opcodes to be more accurately tested. However, we want to test with an actual Base Mainnet snapshot. Results weren’t ready as of the time of this blog post.

\
Since no existing tools fulfilled all the requirements enabling us to scale safely and efficiently, we built our own tool.

## **Base Benchmark**

Base Benchmark is our tool for testing Ethereum client performance against various transaction workloads.

With Base Benchmark, a user defines a benchmark suite to run. We allow testing various gas targets, transaction payloads, clients, and tuning options. Each combination of these runs a block builder that accepts transactions from RPC and builds blocks using the engine API, along with a verifier which accepts built blocks and applies them to the chain state.

Importantly, Base Benchmark also supports running benchmarks from a snapshot, building blocks on top of an existing chain like Base Mainnet. This allows us to quickly test storage operations against a database with a large state size.

Base Benchmark helps client developers and anyone who runs L2 nodes measure performance. It can answer questions like:

- How fast can the sequencer build blocks?
- How fast can validators validate those blocks?
- How fast can we prove execution of a block?
- What are the slowest precompiles/opcodes in Reth?
- How much performance gain will I see after a specific optimization is made?

Let’s take a look at some of the ways Base Benchmark can be used to measure and compare client performance.

### **Use Case 1: Comparing performance of Ethereum clients**

Base is in the process of moving from mostly running Geth to mostly running Reth. Unlike Geth, Reth syncs blocks in stages, and stores less data, which makes it faster in many cases.

To compare client speeds we ran a simple benchmark on different cloud instance types, using a chain with no state and mimicking the opcode and storage distribution of Base mainnet. The benchmark tool will run a benchmark for each combination of parameters. This was intended as an approximate simulation rather than an  accurate comparison. The results for one of the transaction payloads is shown below.

![Link to Results](https://www.base.org/images/blog/scaling-base-with-benchmarking/01.webp 'Link to Results')

The results page is a great starting point for understanding overall performance and notice any issues that warrant deeper investigation.

For each test case, the benchmark tool first builds blocks by sending transactions to a sequencer. We measure how fast the sequencer can accept incoming transactions. After a certain gas limit, the sequencer stops accepting transactions and builds smaller blocks. This helps us understand the limits of our sequencer under conditions very close to what we would see on Base Mainnet.\
\
After sequencing the blocks, the blocks are then tested for syncing speed by sending them to a separate validator node. The validator node has to do the work of executing the block, but can skip the mempool work that the sequencer already did. This helps us test how fast external nodes other than the sequencer can process transactions. We run our sequencer on a large server to be able to handle the sequencing workload, but we don’t expect everyone to run Base on such a large server.

_This testing is critical to ensure we scale with accurate measurements of the limitations of validator nodes run by teams outside Base._

In this test, Reth outperforms Geth. The actual benchmarks we use are more complicated and still in development, but this shows how the tool can be used to compare Ethereum L2 client implementations.

### **Use Case 2: Comparing machine instance types**

Another question we often get is: what is the optimal node configuration for my validator node? Base Benchmark helps answer this by providing a consistent workload to benchmark against.

For this test, we ran our suite of tests against two different instance types: AWS i7ie.48xlarge and GCP z3-highmem-88-highlssd. We can easily compare the metrics of each instance.

Again, this benchmark run is not necessarily indicative of real-world performance, but provides a good relative testing setup for investigating performance issues in clients.

![Link to results](https://www.base.org/images/blog/scaling-base-with-benchmarking/02.webp 'Link to results')

The metrics page shown above allows for comparing the block-by-block performance of each testing setup. This allows node providers to test out performance on various node sizes before switching, and also allows us to ensure that gas limit increases are safe across a range of clients and configurations. This page also includes metrics breaking down how long each phase of block processing took.

### **Use Case 3: Tuning node parameters like cache size**

Finally, we can use this tool to test the performance impact of code and parameter changes. For example, we can test Reth with the SAFE_NO_SYNC flag on MDBX which removes the need for committing to disk in exchange for possibly losing some transactions if the program crashes.

![Link to results](https://www.base.org/images/blog/scaling-base-with-benchmarking/03.webp 'Link to results')

The results of this test showed a negligible difference between the DURABLE and SAFE_NO_SYNC options in Reth. This means there may not be a huge benefit to turning on the SAFE_NO_SYNC option in Reth.

This run shows how the benchmark tool can be helpful for testing out new client features. Reth recently added parallel state root calculation which could be interesting to compare against single-threaded calculation. Base Benchmark should make it easier for client developers to push performance forward.\
\
All of the configuration and results for these tests are available at [this link](https://github.com/meyer9/base-benchmark-results/tree/main/configs).

## **How Ethereum can scale faster by identifying DoS risks**

In the long run, scaling is all about doing more with less. By reducing risks like DoS vulnerabilities, updates like certain EIPs can unlock higher scaling ceilings, allowing the network to grow faster and serve more users.\
\
For example, in the Dencun hardfork, one change reduced the possibility of slow database operations triggered by the SELFDESTRUCT opcode. By reducing the performance burden of the opcode, Ethereum removed a security risk that was worsened by scaling. The new Base Benchmark tool aims to surface bottlenecks like this so we can get ahead of addressing them to continue scaling Base safely.

## **Help make Ethereum Faster**

With Base Benchmark, our hope is to have a standardized set of benchmarks that we can run for any client to evaluate scaling limits. [You can download and run Base Benchmark immediately by following the instructions in the repo.](https://github.com/base/benchmark)

For node providers running Base, we suggest following our [recommended hardware specs](https://docs.base.org/base-chain/node-operators/performance-tuning?utm_source=base_dot_org) and the configuration available in the [base/node](https://github.com/base/node) repo. We encourage you to play around with different hardware specs and configurations using the Base Benchmark tool to measure performance. Our hope is that we can collaborate to improve node configurations so everyone can benefit from performance tuning improvements.

If you are a client developer, we highly recommend [implementing the client in Base Benchmark](https://github.com/base/benchmark/tree/main/runner/clients) to include it in our testing suite. This will help compare performance of different transaction types against other clients to find performance regressions or optimization opportunities. Once implemented, the client will show up on our [public test page](https://base.github.io/benchmark/#/latest).

Anybody else is welcome to contribute to transaction payloads that can be tested, supported nodes and configurations, and metrics to collect. Although we currently support Geth and Reth out of the box, we’d love to expand support to other clients like Nethermind and Erigon.

As part of building in the open, we intend to make our benchmarking results public and share them out as part of our scaling journey and process. Right now, our [public test page](https://base.github.io/benchmark/#/latest) shows results from a devnet run with no existing state. We’ll soon expand this to include results run on Base Mainnet state.

---

If you’re interested in helping us build a global economy that increases innovation, creativity, and freedom, [we’re hiring](https://www.base.org/jobs).

Follow us on social to stay up to date with the latest: [X](https://x.com/base) ([Base team on X](http://x.com/i/lists/1876354838289932418)) | [Base App](https://base.app/profile/base?tab=posts) | [Discord](https://discord.com/invite/buildonbase?utm_source=dotorg&utm_medium=nav)
