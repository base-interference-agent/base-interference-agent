# blog/scaling-base-looking-towards-the-upcoming-pectra-upgrade

Source: https://www.base.org/blog/scaling-base-looking-towards-the-upcoming-pectra-upgrade.md

# Scaling Base: Looking towards the upcoming Pectra upgrade

> One of Base’s 2024 roadmap initiatives is making onchain accessible and affordable for everyone. We’re focused on delivering fast, low-cost transactions on a secure, decentralized…

- Date: 2024-09-04
- Author: Base
- URL: https://www.base.org/blog/scaling-base-looking-towards-the-upcoming-pectra-upgrade

One of Base’s [2024 roadmap initiatives](https://base.mirror.xyz/Ouwm--AtTIVyz40He3FxI0fDAC05lOQwN6EzFMD_2UM) is making onchain accessible and affordable for everyone. We’re focused on delivering fast, low-cost transactions on a secure, decentralized L2 to enable global participation in the onchain economy.

We’re showcasing our progress in this new blog series, **_Scaling Base_**, where we’ll share updates and our plan as we bring a billion people onchain. In this installment, we’re sharing our approach to increase data availability capacity as we look towards the integration of PeerDAS in the upcoming Pectra upgrade.

### Scaling Base since launch

Ethereum introduced EIP-4844 in March of this year—an upgrade that resulted in a 100x reduction in L2 gas fees by decoupling them from Ethereum Mainnet fees. This decoupling is what allows the combined network to scale: If a Layer 2 gets congested, it can act independently to increase its target capacity and bring transaction fees back down.

As a result, we’ve scaled Base’s throughput by 4x since launching it a year ago, increasing the gas target per block from 2.5 Mgas/s to 10 Mgas/s to keep fees under one cent as activity grows. This has only been possible due to a huge amount of hard work from both the Base core team and the entire ecosystem of builders scaling the OP Stack, Ethereum clients, and the EVM.

### Where we go from here: 1 Mgas/s increase per week

A few months ago, we set an ambitious goal: achieving 1 Ggas/s capacity for Base. We know that the journey to get there will require a lot of hard work and collaboration across many teams. Taking a step back, we realized that both for our internal team and for the broader ecosystem, the more _predictability_ we can provide in our scaling journey, the easier it will be to plan and coordinate the necessary work.

To provide this clarity, we’re shifting the way we think about scaling Base: we are going to commit to an ongoing rate of gas target increase, then _do the work_ to ensure we can achieve that increase by scaling across all the key properties.

**To start, we are publicly committing to increasing the Base gas target by 1 Mgas/s each week, starting in late September.** These increases will be subject to continued monitoring and testing—and if we need to change plans, we’ll communicate our key learnings and changes clearly. As we continue to scale the underlying infrastructure and build confidence, our goal is to then grow the rate of increase (e.g. 2 Mgas/s per week) to accelerate our progress towards 1 Ggas/s.

![](https://www.base.org/images/blog/scaling-base-looking-towards-the-upcoming-pectra-upgrade/01.webp)

If you’re building on Base, or helping scale the infrastructure powering Base, our hope is that you can use this guidance as a north star for coordinating and planning your efforts. And if you have feedback on our approach, we’d love to hear it!

### Pectra and PeerDAS

As Base continues to scale, we’re looking towards the Ethereum community to integrate the necessary mainnet upgrades to increase L1 data availability—ensuring that L2s can continue to bring the next billion users onchain.

For the past two years, we have collaborated with the Ethereum core developer community on this mission, beginning with EIP-4844. This upgrade—co-led by the Base team, OP Labs, and Ethereum Core Developers—significantly reduced costs on Base and other L2s by introducing blob space and providing a fixed amount of blob space for data availability.

But with increasing demand, our projections show that the current limits will not meet Base’s requirements in the coming year. This is where PeerDAS comes in.

PeerDAS (Peer Data Availability Sampling), a protocol change in the upcoming Pectra hard fork, addresses this by increasing total blob capacity without requiring every node to download every blob. It ensures Ethereum nodes can access all blob data while only downloading a fraction, significantly reducing network bandwidth requirements and unlocking substantial data availability capacity.

The Base core team has been actively working towards preparing PeerDAS for inclusion in the Pectra upgrade:

- We’re collaborating with [ethPandaOps](https://ethpandaops.io/) to conduct network analysis on PeerDAS devnets, providing essential data to inform recommendations.
- We’re contributing to the implementation within Prysm which is being used to drive the initial analyses.

### PeerDAS blob capacity

Alongside these contributions, we’re advocating for a significant increase in blob capacity alongside activation of PeerDAS. This is crucial for scaling efforts, allowing more data to be processed without overloading individual nodes.

Any bandwidth-affecting protocol change should naturally face developer scrutiny, given the risks of introducing network instability and networking related denial-of-service attacks. Due to the complexity of PeerDAS, some have advocated for its inclusion while keeping the blob capacity unchanged at first. This approach would push any increase in data availability capacity to a subsequent upgrade, which could be many months (if not a year) after Pectra activates in 2025.

While the final details of PeerDAS are still being discussed, we believe its architecture allows for existing bandwidth-limited stakers to safely participate. Additionally, [EIP-7251](https://eips.ethereum.org/EIPS/eip-7251), also planned for Pectra, should reduce attestation and sync_committee p2p traffic, the main consumer of node bandwidth.

### Imposing a higher minimum price for blob data

One argument against a capacity increase is that L1 nodes need to be fairly compensated for the compute, storage and bandwidth required for providing data availability. When demand for blobs is below target, prices fall to the bare minimum: 1 wei per byte of blob data. Demand exceeding target capacity allows for a market-based pricing mechanism to kick in, resulting in better recovery of the costs incurred on L1 nodes.

We think that addressing this problem by constraining DA capacity is a step in the wrong direction; instead, we suggest a different approach, ensuring a healthy market for blob space so that the network is fairly compensated while keeping it unconstrained. Some potential solutions are to raise minimum blob fees or implement a different fee mechanism for blob data.

### Increasing the target to achieve positive-sum scaling

Post EIP-4844, L2 transaction fees will remain decoupled from Ethereum Mainnet fees as long as the average demand for blobs stays below the target (currently 3 per block).

So far, we've only seen a few instances where blob demand has exceeded this target for extended periods. Some may view below-target blob demand as a reason to proceed conservatively. However, with Base’s scaling plan and L2 demand growing, we expect the demand to consistently meet or exceed capacity within the coming months. Exceeding the target would end the decoupling of transaction fees—disallowing L2s to independently increase capacity and maintain low fees.

When data availability hits target capacity, scaling becomes a zero-sum game—one L2's increased throughput would negatively impact another. We aim to create a positive sum scaling environment. Implementing PeerDAS and increasing the blob count are crucial steps to achieving this goal.

![](https://www.base.org/images/blog/scaling-base-looking-towards-the-upcoming-pectra-upgrade/02.webp)

### L2 protocol improvements

L1 data availability can be indirectly scaled through L2 protocol improvements that reduce the required data. The OP Stack already features innovations like span batch data layout and Brotli compression from the Fjord upgrade, which improved Base’s data compression ratio by 25%. Future enhancements include stateful compression and aggregatable signatures for L2 transactions and UserOps. These improvements, while helpful, are the icing on the cake. Ultimately, the data availability capacity of mainnet must grow in order to support a healthy scaling roadmap.

### Looking forward

As Ethereum continues to grow, any increase in data availability capacity will eventually be absorbed by organic demand. While a market-based pricing regime for data availability is inevitable, maintaining decoupled fees for as long as possible will allow Ethereum to scale more rapidly to its full potential.
