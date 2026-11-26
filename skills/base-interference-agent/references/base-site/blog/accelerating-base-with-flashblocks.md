# blog/accelerating-base-with-flashblocks

Source: https://www.base.org/blog/accelerating-base-with-flashblocks.md

# We’re making Base 10x faster with Flashblocks

> Bringing near-instant responsiveness to apps on Base Mainnet.

- Date: 2025-05-15
- Author: Danyal Prout
- URL: https://www.base.org/blog/accelerating-base-with-flashblocks

People expect lightning-fast responses when interacting with apps, and a snappy user experience is key to enabling the global onchain economy. With Flashblocks, a technology built by [Flashbots](https://www.flashbots.net/), Base chain will have 200-millisecond “preconfirmation blocks” making transactions feel instant. This will make Base 10x faster than it is today, slated to go live this Summer.

If you're a builder, node operator, or wallet interested in integrating Flashblocks on Base, you can [integrate them on Base Sepolia](https://docs.base.org/chain/flashblocks/apps?utm_source=base_dot_org) today in preparation for the full rollout on Base Mainnet. We recommend reading ahead to understand what is required to integrate Flashblocks and give your app’s users a 10x faster experience.

---

## Bringing Flashblocks to Base Mainnet

Currently, Base creates a new block every 2 seconds. Flashblocks are sub-blocks issued by the block builder and streamed to nodes every 200ms, allowing for early confirmation times.

![](https://www.base.org/images/blog/accelerating-base-with-flashblocks/01.webp)

Each Flashblock contains ~10% of the transactions (by gas) of a regular block, and a series of Flashblocks can be combined to recreate a full block. They are an optional addition for nodes and applications that want to have a faster UX. Without making any changes, nodes and applications will continue to function the same way they do today.

Since enabling Flashblocks on Base Sepolia, we’ve seen up to 10x reduction in transaction inclusion times (see appendix below) from users around the world. To experience the speed firsthand, see Flashblocks live on testnet in [our demo](https://flashblocks.base.org/) and try some of [the apps](https://x.com/neodaoist/status/1895229868532457898) that other builders have built.

![Comparison of tx inclusion times with and without Flashblocks](https://www.base.org/images/blog/accelerating-base-with-flashblocks/02.webp 'Comparison of tx inclusion times with and without Flashblocks')

---

## How apps, wallets, and indexers can integrate Flashblocks

#### Integrating Flashblocks

At a high level, there are two ways you can integrate Flashblocks:

1. **Recommended:** Use an [RPC provider](https://docs.base.org/chain/flashblocks/apps?utm_source=base_dot_org#rpc-api) that supports Flashblocks.
2. Subscribe to Flashblocks from the [websocket](https://docs.base.org/chain/flashblocks/apps?utm_source=base_dot_org#websocket-api).

We strongly recommend that you use an RPC provider instead of subscribing to the websocket as it’ll support the libraries you're familiar with today and supports graceful fallback in the event of a Flashblock outage.

You can find detailed information on [how to integrate](https://docs.base.org/chain/flashblocks/apps?utm_source=base_dot_org#overview) Flashblocks into your application, [RPC endpoint support](https://docs.base.org/chain/flashblocks/apps?utm_source=base_dot_org#rpc-api) and [which libraries support Flashblocks](https://docs.base.org/chain/flashblocks/apps?utm_source=base_dot_org#libraries) in our docs.

#### Transaction Ordering

Flashblocks will change transaction ordering within blocks in two key ways:

**Timing**

Flashblocks are built every 200ms, each ordering a portion of the block. Unlike the current system where later-arriving transactions with higher priority fees can be placed at the top of the block, Flashblocks creates a time-based constraint. Once a Flashblock is built and broadcast, its transaction ordering is locked even if a transaction with a higher priority fee arrives later, it cannot be included in earlier, already built Flashblocks.

**High Gas Limits**

If your app creates transactions with large gas limits, we recommend monitoring to detect any changes in inclusion latency. Transactions with gas limits over 1/10 of the current block gas limit (currently 14 million gas), face additional constraints:

- Each Flashblock can only use a portion of the block's total gas limit
- Flashblock 1: up to 1/10 of the total gas
- Flashblock 2: up to 2/10 of the total gas
- And so on for subsequent Flashblocks

Consequently, transactions with large gas requirements must wait for later Flashblocks with sufficient gas capacity. For example, a transaction exceeding 1/10 of the block's gas limit cannot be included in Flashblock 1 and must wait for Flashblock 2 or later.

#### Understanding reverts, reorgs and reliability

**Reorgs**

When the Flashblocks stream differs from the final block, there has been a reorg. This will result in some RPC responses returning data that could be different from the final block. In our initial release, this may happen. Although we expect it to be very infrequent, your application needs to be able to handle them. We plan to reduce how often these reorgs occur in future updates.

**Revert Protection**

In our initial release, revert protection will not be enabled. Transactions will continue to revert on Base as they do today. We plan to investigate enabling revert protection in future updates as part of our ongoing development roadmap.

**Reliability**

If there is a Flashblocks outage the chain will continue to progress, but fallback to the standard two second block times. During an outage:

- RPC calls and sending transactions will continue to work, with slower transaction inclusion
- The websocket endpoint will not return any data\

Outages are expected to be infrequent - our SLA for Flashblocks uptime is 99.9%.

### Node Operator Integrations

Flashblocks are an _optional_ feature for your nodes. When not activated, your nodes will function exactly as they do today. Activating Flashblocks makes two changes to the execution client:

1. They connect to the Flashblocks data stream
2. Flashblock information will be used to modify the responses of some ETH RPC endpoints

#### Enabling Flashblocks

You'll need to run our [Base Reth binary](https://github.com/base/node-reth) with integrated Flashblocks support. If you're interested in seeing Flashblocks compatibility with other execution clients, please submit an issue on the [base/node](https://github.com/base/node) repository, and we'll explore expanding support.

For full configuration instructions and setup guidance, refer to our [documentation](https://docs.base.org/chain/flashblocks/node-providers?utm_source=base_dot_org).

#### Receiving Flashblocks

As Flashblocks are built, they’re broadcast immediately by the [sequencer](https://specs.optimism.io/background.html?highlight=sequencer#sequencers) over a websocket. Our [websocket endpoints](https://docs.base.org/chain/flashblocks/apps?utm_source=base_dot_org#websocket-api) are publicly available but rate limited. If you operate a large number of nodes please reach out and we can provide you with an authenticated endpoint which will have minimal rate limiting.

#### RPC Modifications

Receiving a Flashblock, causes the nodes to update their internal in-memory state of the pending block, which is used to modify the responses to some ETH RPC’s.

If you have a caching or routing layer in front of your nodes, you may need to modify the behaviour for certain RPC endpoints. A full list of endpoints can be found [here](https://docs.base.org/chain/flashblocks/apps?utm_source=base_dot_org#rpc-api).

#### Reliability

If there’s an outage of any part of the Flashblocks infrastructure nodes will continue to work as they do today with two second block times and blocks being distributed over the P2P network.

Our SLA for Flashblocks uptime is 99.9%. We’ve designed our infrastructure and node integration to gracefully handle Flashblock outages and fallback to the current situation of two second blocktimes.

### Staying in the Loop

We’re really excited to see what you build with Flashblocks. We recommend following [@base](https://x.com/base) to receive the latest updates on Flashblocks.
For questions or support, please reach out to us on [Discord](https://base.org/discord) or [@BuildOnBase](https://x.com/buildonbase).

### Appendix

We’re measuring transaction inclusion time as, the total time it takes to:

1. Send a transaction to Base
2. Include the transaction in a block
3. Share the block to other nodes on the network
4. User fetch a receipt of inclusion

You can reproduce our results using the [transaction latency tester](https://github.com/base/transaction-latency).

By making a handful of internal infrastructure improvements, we believe we can further reduce the transaction inclusion latency by another 80-120ms.
