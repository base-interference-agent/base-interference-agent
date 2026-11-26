# blog/contributing-to-the-scalability-of-base-and-the-op-stack-a-technical-deep-dive

Source: https://www.base.org/blog/contributing-to-the-scalability-of-base-and-the-op-stack-a-technical-deep-dive.md

# Contributing to the Scalability of Base and the OP Stack: A Technical Deep Dive

> We launched the Base testnet in February to bring the next million developers and billion users onchain. Base is powered by the OP Stack and offers a secure…

- Date: 2023-06-07
- Author: Base
- URL: https://www.base.org/blog/contributing-to-the-scalability-of-base-and-the-op-stack-a-technical-deep-dive

**_By Michael de Hoog_**

We [launched the Base](https://base.mirror.xyz/jjQnUq_UNTQOk7psnGBFOsShi7FlrRp8xevQUipG_Gk) testnet in February to bring the next million developers and billion users onchain. Base is an Ethereum L2 powered by the OP Stack that offers a secure, low-cost, developer-friendly way for anyone, anywhere, to build decentralized apps onchain. We’re now working towards bringing [Base to mainnet](https://base.mirror.xyz/gxOzGCE-9C7cNZBCo4Ubkkxr87L8BcHDfn5HViSdYGg), with safety and security as top priorities.

As we progress towards mainnet, we’ve gathered some valuable learnings on scalability and performance that position us for a stronger mainnet, as well as contributing to improving the OP Stack as a whole. Our overall goal is to identify challenges and proactively drive solutions that not only benefit Base, but strengthen the OP Stack as the underlying technology on which many projects will flourish.

In this blog post, we explore the challenges faced after releasing the Base Builder Quests campaign, which resulted in a contract deployment surge on Base testnet. We’ll go through the steps we took to address these issues, illustrating the challenges L2s can face around unique data management and L1 synchronization. This type of  surge hadn’t been observed in a mainnet environment before, and gave us a unique opportunity to identify and implement a solution that helped scale the OP Stack.

## Challenges with L2 data management

L2 networks inherit the security of L1 by publishing their data available on L1. This process involves taking the L2 blocks and writing them to L1 in batches. While this works well under normal circumstances, problems can arise when the L2 experiences a surge in data-heavy transactions, such as contract deployments.

This is what we experienced during our [Base Builder Quests campaign](https://quests.base.org/), when the number of new contract creations on L2 skyrocketed. Over 1M wallet addresses deployed a smart contract on Base testnet, causing the batcher to fall behind in processing the pending data. This led to the "safe head" (L2 blocks committed to L1) lagging behind the "unsafe head" (L2 blocks not yet committed to L1).

Other OP Stack contributors, such as OP Labs, had previously identified this issue via prior synthetic load tests. The Base Builder Quest had quickly reproduced this bottleneck, and required our team to implement some short term fixes and find a longer term solution.

## Identifying and addressing the issue

The first indication of an issue was a surge in gas fees on Base testnet, as the Base blocks were filling up causing the EIP-1559 mechanism to increase the L2 base fee. In response, we implemented an experimental gas limit increase on the testnet to better understand how our testnet would behave. This helped keep the base fee lower to keep up with the demand; however, this move had another effect: the increase in gas per block resulted in larger L2 blocks, which then caused some slowdown in writing those blocks back to the Goerli L1.

To counteract this, we increased the expected compression ratio, decreased the gas limit back to its original size, and reduced the number of confirmations required for writing L2 batches to the L1. Despite these adjustments, the system struggled to reach equilibrium and write the unsafe blocks to the L1, at one point reaching over 4000 uncommitted blocks. It was only after the quests slowed down in the evening that we could close the gap.

## Implementing a long-term solution

The Builder Quest gave us a better understanding of the block batch writing bottleneck. It was clear that we needed a longer-term solution.

To solve for this for the long term, we implemented two changes to the batcher:

1. An improved compression implementation that allows better utilization of L1 transaction calldata ([PR](https://github.com/ethereum-optimism/optimism/pull/5455))
2. Submission of multiple batcher transactions per L1 block, instead of one at a time ([1](https://github.com/ethereum-optimism/optimism/pull/5398), [2](https://github.com/ethereum-optimism/optimism/pull/5637))

Load testing indicates that these changes increased the batcher throughput by up to 5x, essentially limited only by what we can fit into L1 blocks.

![](https://www.base.org/images/blog/contributing-to-the-scalability-of-base-and-the-op-stack-a-technical-deep-dive/01.webp)

## Long-term impact to users

The implemented changes helped improve scalability of Base and the OP Stack, and will also offer several benefits for users at mainnet. First, these changes pave the way for increasing block gas limits, which can enable us to ensure the base fee remains low and the platform remains accessible to users, even as the demand for blockspace increases. Second, these changes will help keep the safe tip in sync with unsafe block production, which is crucial for maintaining the speed of transactions and withdrawals on custodial exchanges that rely on an up-to-date safe block.

Many of the folks now working on Base have spent the last decade scaling crypto at Coinbase. We’re excited to bring that expertise and focus to scaling Base and the OP Stack, which we see as the platform that will power the next generation of crypto, enabling us to bring millions of developers and billions of users onchain.
