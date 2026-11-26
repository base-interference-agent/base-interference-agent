# blog/scaling-base-sustain-10x-growth

Source: https://www.base.org/blog/scaling-base-sustain-10x-growth.md

# Scaling Base in 2025: Sustaining 10x growth while maintaining sub-cent transactions

> TL;DR: To build a global onchain economy, we need to scale. As Base grows, we’re seeing breakout apps that are bringing 10x more traffic to the network. We build in the open, and…

- Date: 2025-06-18
- Author: Anika Raghuvanshi
- URL: https://www.base.org/blog/scaling-base-sustain-10x-growth

**_TL;DR:_** _To build a global onchain economy, we need to scale. As Base grows, we’re seeing breakout apps that are bringing 10x more traffic to the network. We build in the open, and want to share our learnings as we keep scaling Base, ensuring that we continue to meet growing demand with greater throughput while maintaining sub-cent fees._

Base’s mission is to build a global onchain economy. To achieve this, we’re committed to continuously scaling Base so it can serve as a platform for billions of people to come onchain.

Over the past month, we’ve seen more onchain activity than ever before, with various breakout apps bringing 10x more traffic to Base. For instance, Base recently saw blocks with over 1.5k transactions per second during the Solace launch on [Virtuals](https://app.virtuals.io/geneses), with median fees of remaining under 5 cents:

![TPS on Base during the Solace launch on virtuals at ~11am EST May 29, 2025.](https://www.base.org/images/blog/scaling-base-sustain-10x-growth/01.webp 'TPS on Base during the Solace launch on virtuals at ~11am EST May 29, 2025.')

![Block with over >3k transactions in a block (~1.5k TPS, given 2s blocktimes)](https://www.base.org/images/blog/scaling-base-sustain-10x-growth/02.webp 'Block with over >3k transactions in a block (~1.5k TPS, given 2s blocktimes)')

![Median (Percent 50) fees as 4.3 cents during Solace launch on virtuals at ~3pm UTC May 29, 2025.](https://www.base.org/images/blog/scaling-base-sustain-10x-growth/03.webp 'Median (Percent 50) fees as 4.3 cents during Solace launch on virtuals at ~3pm UTC May 29, 2025.')

As Base continues to grow, our scaling approach is evolving to ensure the network can sustain high traffic periods while maintaining sub-cent transaction fees. Our proactive scaling efforts have successfully handled significant surges in network activity, and we’re continuing to enhance our strategy to support the next generation of apps bringing 100x more traffic to Base.

Our new scaling strategy focuses on optimizing the fee market mechanism to effectively manage network congestion and user demand. Our scaling plan involves several key approaches:

1. **Adjusting the elasticity ratio** to control traffic flow and provide a better user experience
2. **Updating dynamic fee parameters** to improve fee responsiveness
3. **Enhancing network capacity** through targeted infrastructure improvements

This approach ensures that as more people come onchain, they benefit from both affordable fees and fast onchain UX, even during peak times.

We build in the open, and want to share our learnings as we continue to scale. Here’s more on our progress so far, what’s next, and how we’ll continue to scale Base to serve as a platform for the global onchain economy.

### Our scaling approach thus far: Increasing gas target from 2.5 Mgas/s to 35 Mgas/s

To date, we’ve increased Base's throughput by continuously raising the network’s gas target—starting 2.5 Mgas/s at launch and increasing it to 35 Mgas/s so far. Prior to scaling, we saw median fees around ~30 cents. Our scaling efforts have lowered median transaction fees >10x to fractions of a cent. Increasing Base’s throughput future-proofs the network so that it can sustain even bigger spikes in traffic.

![Median fees at ~29 cents in March, just prior to our first gas target increase.](https://www.base.org/images/blog/scaling-base-sustain-10x-growth/04.webp 'Median fees at ~29 cents in March, just prior to our first gas target increase.')

![On a busy day, median fees today are still less than a fraction of a cent.](https://www.base.org/images/blog/scaling-base-sustain-10x-growth/05.webp 'On a busy day, median fees today are still less than a fraction of a cent.')

However, with fees now so low, we’re shifting our focus to better sustain periods of high traffic with greater throughput while continuing to maintain low fees. To better understand how we’re approaching this, we must first provide some context on the fee market mechanism on Base.

### Explaining the fee market mechanism on Base

The transaction fees that control traffic on Base include “base fees” and “priority fees”. This can be compared to an amusement park, where the base fee is the cost to enter the park, and the priority fee is an extra amount you may choose to pay to skip a long line for a ride.

In ideal circumstances, this fast lane enables someone to get a front row seat on the ride, but causes minimal delays to the people in the standard lane. However, sometimes someone in the standard lane could end up waiting indefinitely as new people keep paying extra to skip ahead via the fast lane.

The base and priority fees are used to keep Base’s throughput close to the gas target. This is done via the EIP-1559 fee mechanism: when a block is above target, base fees rise, and when the block is below target, base fees get cheaper. Due to this, average gas used or throughput stabilizes around the gas target. \
\
The “gas limit” dictates the upper bound capacity of a block. Today, the gas limit is 70 Mgas/s and the gas target is half of that at 35 Mgas/s. Given Base’s 2 second block times, this means the gas limit is 140 Mgas/block and target is 70 Mgas/block. This can be visualized in block explorers, where the following block used slightly above the gas target:

![](https://www.base.org/images/blog/scaling-base-sustain-10x-growth/06.webp)

The gas target is essentially the ideal and sustainable number of guests in an amusement park, where everyone is still having a positive experience. The gas limit is the maximum capacity of the park.

### Our observations from scaling thus far

As we proactively scale Base by increasing our gas target alongside the gas limit, we have observed a few trends:

- **Bloated Gas Target**: our current gas target (35 Mgas/s) is higher than the sustained organic traffic on Base. Consequently, we are observing higher rates of spam and inefficient resource usage. Essentially, the amusement park is not at ideal capacity - guests are paying very low fees, but it’s not a sustainable model for the park.
- **Slow Fee Responsiveness and Reliance on Priority Fees:** During traffic spikes, fees have not risen fast enough to account for this increased activity. During peak traffic, some people may submit transactions to the Base mempool, but end up waiting a long time for their transaction to get included, if it ever does. People turn to paying additional priority fees to avoid lines, and only those who pay these extra fees end up having a decent experience. Those in the standard lane pay a deceptively low ticket price to enter the park, but then get stuck in a long, stagnant line for a ride.
- **Scaling bottlenecks:** Somewhat tangential to the other observations, we acknowledge that Base is functioning around the limits of certain scaling bottlenecks, which we have [discussed in the past](https://www.base.org/blog/scaling-base-in-2025). Two specific constraints prevent us from scaling significantly at the moment:

 - **Geth constraints:** node providers sometimes report issues with Geth nodes keeping up during peaks in traffic. Our efforts to migrate to Reth, and some amount of optimizing Geth should reduce this constraint significantly.
 - **L1 DA limits:** Despite the increase of L1 blobs in the recent Pectra hardfork, L1 data availability capacity is still limited, and Base can still exceed these limits at its current gas target. We are actively supporting PeerDAS efforts for the upcoming Fusaka hard fork, which will provide much more wiggle room here.

To understand our path forward, we are reorienting around what our core goals of scaling are: we aim to maintain low fees on Base to bring more people onchain. But simply lowering fees by increasing throughput is not the ultimate marker of success. Importantly, changes in traffic patterns should not degrade user experience or chain functionality.

### Creating a healthier fee market

We started making modifications to our fee market to create a better experience for users and ensure the chain is functioning in a stable and sustainable way.

#### Scaling while _reducing_ throughput

To reduce reliance on priority fees, the base fees need to better control traffic – i.e. people would be better served by paying a fair price to enter an amusement park that isn't overly crowded. If the base fee functions properly, this is like making entrance pricing more expensive during peak times like weekends and holidays, to control traffic and incentivize those with flexibility to come when it’s less busy. This model should make the number of visitors to the park more evenly distributed across days.

We are planning to achieve this by modifying the ratio between gas target and gas limit, also called “elasticity”. As described, this is currently a 2x elasticity ratio, with gas limit being double the gas target. Moving to a higher ratio allows base fees to better signal network congestion. This reduces the need for users to engage in speculative priority fee bidding.

As a result, users are less likely to experience delays in transaction inclusion during traffic spikes. They’ll receive more immediate feedback via an error response if their transaction has too low of a base fee, as opposed to their transaction sitting in the mempool for a long time because they did not pay enough priority fees.

**We’ve decided to update elasticity to 3x** by _reducing_ the gas target from 35 Mgas/s to 25 Mgas/s, and _increasing_ the gas limit from 70 Mgas/s to 75 Mgas/s. This accomplishes a few things:

- **Continuing to scale**: Gas **limit** ultimately dictates the burst capacity of Base, so this change allows Base to continue scaling
- **Scaling safely**: If we kept the gas target the same and moved to a 3x elasticity, we would need to increase the gas limit by 50% to 105 Mgas/s. By making a jump this large, we cannot ensure the health and stability of Base nodes, most of which are operated outside of the Base team.
- **Avoiding L1 DA Limits:** Reducing the gas target will ensure we do not exceed healthy L1 DA consumption levels, while this is still a scaling constraint.

#### More responsive fees

In addition to modifying elasticity, we are adjusting the rate at which fees increase via the “EIP-1559 denominator” value. This makes the base fee respond even more dynamically to account for network congestion, similar to how rideshare app prices update in real time. We have already made modifications to this parameter and seen the fee markets successfully adapting to network congestion more effectively. A higher elasticity value enables a larger range of values here.

Wallet providers should be aware of these changes to make base fees more responsive to transaction demand. Transactions should account for this variability by setting the 1559 `maxFeePerGas` field to a multiple of the latest `baseFee`. We still intend to keep fees very low (\<1 cent) for most use cases, to give users the best experience on Base.

#### Additional explorations

We will continue to evaluate usage of the chain, including the fee market, and explore other ideas to create a healthy ecosystem on Base. Some ideas include:

- **Implementing a minimum base fee**: this should disincentivize spam, but also be low enough that users do not notice an impact.
- **Adjusting calldata costs** to better account for the upper bound of Ethereum L1 DA constraints.
- **Repricing other opcodes** to more accurately reflect execution times and therefore more predictably estimate a “fair” fee.
- **Redesigning the mempool** to better support traffic bursts and provide users more transparency and ability to modify transactions submitted to the sequencer.
- **Explore multidimensional and localized fee markets** to reduce the impact of high traffic for certain launches on everyday chain usage.

These ideas range in complexity and tradeoffs, and we will continue to explore and analyze them based on data and observations.

### What’s next

We will soon increase the gas limit from 70 Mgas/s to 75 Mgas/s and simultaneously reduce the gas target from 35 Mgas/s to 25 Mgas/s. We will continue to monitor and track activity on Base to see how these types of changes impact network functionality. We are also working to redefine our North Star metric for scaling, which has historically been anchored on throughput – since we believe this captures only part of the full picture of our scaling goals.

We continue to scale Base, so it can serve as a platform for billions of people and millions of builders. But it’s still Day 1 - we continue to evaluate the success of our scaling efforts and iterate to maintain low fees for users, thus allowing the world to come onchain.

If you’re interested in helping us build a global economy that increases innovation, creativity, and freedom, [we’re hiring](https://www.base.org/jobs) — and we’d love to hear from you.

Follow us on social to stay up to date with the latest: [X](https://x.com/base) ([Base team on X](https://x.com/i/lists/1876354838289932418)) | [Farcaster](https://warpcast.com/base/) | [Discord](https://discord.com/invite/buildonbase?utm_source=dotorg&utm_medium=nav)
