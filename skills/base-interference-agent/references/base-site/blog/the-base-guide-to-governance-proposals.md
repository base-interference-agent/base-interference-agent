# blog/the-base-guide-to-governance-proposals

Source: https://www.base.org/blog/the-base-guide-to-governance-proposals.md

# The Base Guide to Governance Proposals

> Since our testnet launch, dapps and community members have been asking how they can support bringing new products to the Base ecosystem. Many dapps, particularly those governed by…

- Date: 2023-06-13
- Author: Base
- URL: https://www.base.org/blog/the-base-guide-to-governance-proposals

Since our testnet launch, dapps and community members have been asking how they can support bringing new products to the Base ecosystem. Many dapps, particularly those governed by DAOs, require a formal governance process to deploy on Base. Writing a proposal is the first step in helping community members make a decentralized decision.

Base has an ambitious vision: bringing the next billion users onchain. Accomplishing this vision will take the support and collaboration of the whole space. We are grateful for community members who share our vision. To support them in this critical work, this guide breaks down the _why_, _what_, and _how_ of bringing a dapp or protocol to Base.

If you’re thinking about writing a governance proposal, we encourage you to engage with your community and confirm that you are the right person to submit the proposal before you begin. Proposals that succeed will be the result of thoughtful, measured consensus building, which come from trusted members of a community. It’s always worth confirming with your community whether there is something already in the works. As you work on your proposal, feel free to borrow language or content from this guide to get started, and refer to proposals written by other authors:

- [\[Uniswap\] Deploy Uniswap v3 on Base](https://gov.uniswap.org/t/deploy-uniswap-v3-on-base/21249)
- [\[Aave\] Aave V3 Deployment on Base](https://governance.aave.com/t/temp-check-aave-v3-deployment-on-base/13177)
- [\[Moonwell\] MIP-39: Activate Moonwell on Base Mainnet](https://forum.moonwell.fi/t/mip-39-activate-moonwell-on-base-mainnet/414)
- [\[Balancer\] Deploy Balancer to Base](https://forum.balancer.fi/t/bip-263-deploy-balancer-to-base/4663)

_Note: Coinbase does not endorse, support, or promote third-party governance proposals. The links above are shared only for informational purposes._

## Overview

Base is designed to be a secure, low-cost, developer-friendly chain that makes it incredibly easy to build. It is built on the open-source OP Stack. While incubated within Coinbase, Base aims to progressively [decentralize](https://base.mirror.xyz/H_KPwV31M7OJT-THUnU7wYjOF16Sy7aWvaEr5cgHi8I) and be a permissionless, open ecosystem where anyone can build or participate.

We are joining the Optimism team as the second core dev on the OP Stack and will continue to work with them towards our shared vision of a “[Superchain](https://stack.optimism.io/docs/understand/explainer/)” scaling Ethereum.

Base is currently in testnet, and in the last three months, we’ve seen incredible traction from builders:

- In the first week of Base testnet, approximately [18K developers deployed 55K smart contracts](https://base.mirror.xyz/rA5v_0BTc5AwmZdnui7ku82FzF1aTE6TJ_3vds9ymBc).
- The “Base, Introduced” NFT to commemorate our testnet launch had ~[485K mints](https://mint.fun/0xd4307e0acd12cf46fd6cf93bc264f5d5d1598792).
- During the Base Builder Quest, 1.1M wallets deployed smart contracts on Base to mint the commemorative NFT.
- Authors can refer to [BaseScan](https://goerli.basescan.org/) and [Base Blockscout](https://base-goerli.blockscout.com/), as well as dashboards from [analytics providers like Flipside](https://flipsidecrypto.xyz/?d_project=base).

## Why Protocols Should Consider Deploying on Base

By deploying on Base, protocols can increase their user base while helping build a richer onchain economy.

![](https://www.base.org/images/blog/the-base-guide-to-governance-proposals/01.webp)

**Access users and assets in the Coinbase ecosystem**

Coinbase supports customers across 100+ countries, and a growing number are expected to come onchain as the dapp ecosystem matures. We want to facilitate a win for both the users and the builders growing the onchain economy. By deploying on Base, protocols can get in front of users in the Coinbase ecosystem. And in turn, users will get to experience a diversity of dapps.

_Note to authors:_ To read about the history, context, and philosophy regarding our decision to build Base, please see our [blog](https://base.mirror.xyz/jjQnUq_UNTQOk7psnGBFOsShi7FlrRp8xevQUipG_Gk). For the most up-to-date financials, please see our [Investor Relations website](https://investor.coinbase.com/home/default.aspx).

**Build towards a multichain vision and reach a more diverse audience onchain**

We believe the onchain future will consist of multiple chains that interoperate and scale together. Base is built on Optimism’s OP Stack with the vision of building a standard, modular, rollup agnostic [Superchain](https://app.optimism.io/superchain/) scaling Ethereum — a mesh of highly-integrated chains which eventually becomes one fluid experience for users. Many protocols share this vision that the future is multichain, and interoperability is key. By building on Base, protocols can easily integrate with the eventual Superchain and interact with users across multiple chains.

_Note to authors:_ To read more about how we are working with Optimism, please see our [blog post](https://base.mirror.xyz/H_KPwV31M7OJT-THUnU7wYjOF16Sy7aWvaEr5cgHi8I). For more information about the Superchain, please see [this article](https://app.optimism.io/superchain/).

**Foster a more vibrant decentralized and permissionless ecosystem**

Base is closely aligned with the values of Ethereum and the broader cryptoeconomy, and champions decentralization and permissionlessness. We are participating as the second core dev on the OP Stack, and contributing resources to improve the underlying infrastructure and accelerate onchain adoption across the ecosystem.

_Note to authors:_ We will be sharing more on our mainnet timeline soon, but encourage authors to proceed with early governance processes (e.g. RFCs, temperature checks) as we’ll be coming to mainnet in short order. For the most up-to-date news on launch plans, please refer to our [Twitter](https://twitter.com/BuildOnBase), [Blog](https://base.mirror.xyz/), and [Discord](https://discord.base.org/).

## Key Value Propositions & Core Principles

Base is a key part of Coinbase’s “[secret master plan](https://base.mirror.xyz/jjQnUq_UNTQOk7psnGBFOsShi7FlrRp8xevQUipG_Gk)” – the platform on which the next generation of dapps delivering value and utility to customers will be built.

Base is built by Coinbase builders, for builders everywhere,  and leverages the last decade of Coinbase’s experience building crypto products.

Base will serve as both a home for Coinbase’s onchain products and an open ecosystem where anyone can build. Our goal is to go live with support across onchain Coinbase products and leading dapps across verticals to provide users with a rich, intuitive onchain experience from day one of mainnet.

We recently shared our [criteria for mainnet](https://base.mirror.xyz/gxOzGCE-9C7cNZBCo4Ubkkxr87L8BcHDfn5HViSdYGg), and will be sharing more information in the coming days. In the meantime, any developer can deploy on Base testnet today, with docs available at [docs.base.org](https://docs.base.org/?utm_source=base_dot_org).

### Key Value Propositions

- **Secured by Ethereum:** Base is built with the security and scalability you need to power your decentralized apps. It leverages the underlying security of Ethereum, along with Coinbase’s best practices, to enable protocols to confidently onramp into Base from Coinbase, Ethereum L1, and other interoperable chains.
- **Empowered by Coinbase:** Base makes it easy to build decentralized apps with access to Coinbase’s products, users, and tools. Seamless Coinbase product integrations, easy fiat onramps, and powerful acquisition tools enable developers to join the Coinbase ecosystem.
- **Big features, small fees:** Base offers full EVM compatibility at a fraction of the cost and is committed to pushing forward the developer platform. Protocols can set up gasless transactions for dapps with easy developer APIs for account abstraction, and securely build multichain applications with easy-to-use bridges.
- **Open source:** Foundational software for the global cryptoeconomy should be fully open source and freely available. Base is built on the MIT-licensed OP Stack, in collaboration with Optimism. It aims to be decentralized, permissionless, and open to anyone with the vision of creating a standard, modular, rollup agnostic superchain powered by Optimism. Together, Base and Optimism are working to create a thriving community of other developers. This toolkit is an open platform that _anyone_ can contribute to, fork and extend to help the cryptoeconomy scale. [Learn more about how Base is working with Optimism.](https://base.mirror.xyz/H_KPwV31M7OJT-THUnU7wYjOF16Sy7aWvaEr5cgHi8I)

### Core Principles

- **A bridge, not an island:** Base is designed to provide easy, secure access to Ethereum L1, other L2s, as well as other L1 ecosystems. Coinbase customers are encouraged to start on Base, but to explore outside of Base: Base is a “bridge” for users into the crypto ecosystem. It’s an easy-to-use default on-chain experience with access to products on other chains. Along with making Base interoperable with other chains, Coinbase will continue supporting as many chains as possible across Coinbase products.
- **Decentralized & Open Source:** Decentralization is essential for the cryptoeconomy to remain open, global, and accessible to everyone. While Base has started by being incubated inside of Coinbase, the team is deeply committed to progressing towards full decentralization over the years ahead. With the increased resourcing that Coinbase brings to the OP Stack, Base plans to progress from a [Stage 0 to Stage 1](https://ethereum-magicians.org/t/proposed-milestones-for-rollups-taking-off-training-wheels/11571) rollup in 2023 and a Stage 2 rollup in 2024. [Learn more about Base’s approach to decentralization here.](https://base.mirror.xyz/H_KPwV31M7OJT-THUnU7wYjOF16Sy7aWvaEr5cgHi8I)
- **For everyone:** Base has a vision to be an open ecosystem, seeded with Coinbase products, users, and assets. Base will work with the broader community to bring the chain to life. This is Day 1 of Base’s journey and the team couldn’t be more excited about the incredible community already building alongside them.

![](https://www.base.org/images/blog/the-base-guide-to-governance-proposals/02.webp)

During testnet launch, we received interest from many builders to deploy on Base. We are excited to support these teams and many others in building with us.

_Note to authors:_ For more information about our philosophy and background, please see our [blog post](https://base.mirror.xyz/jjQnUq_UNTQOk7psnGBFOsShi7FlrRp8xevQUipG_Gk).

## Default Bridge Information: L1\<>L2 Messaging

The Base network reuses Optimism’s native Bedrock bridge without modification. This bridge implementation has undergone audits from both the Optimism and the Base side, and is now responsible for securing [billions of dollars in TVL on Optimism mainnet](https://l2beat.com/scaling/projects/optimism).

**From L1 to L2:**

- Users can send arbitrary messages from L1 to L2
- User calls the bridge contract on L1
- Messages sent to the bridge are included in blocks on L2 by the Base sequencer (responsible for building the L2 blocks)
- Sequencer must include L1 messages on L2 within a certain window of time
- After the window of time has passed, decentralized validator nodes will automatically include L1 messages

**From L2 to L1:**

- User calls bridge contract on L2
- L2 state trie root is committed back to a smart contract on the L1 by the sequencer (this will be used to prove L2 state)
- A user’s transaction will then enter a pending state known as the challenge window
- The state commitment can be removed during the challenge window if needed
- Once fault proofs are rolled out, anyone can challenge the state commitment

**Between L2s:**

- We are working on interoperability standards between L2s and will update the community as we progress. For now, please refer to the "[Low Latency L2 to L2 Message Passing](https://stack.optimism.io/docs/understand/explainer/#low-latency-l2-to-l2-message-passing)" section in Optimism's Superchain Explainer.
- In the meantime, you can bridge funds between L2s (e.g. Optimism \<> Base) via our native bridge or 3rd party bridges.

Both Base and Optimism are working together on a shared vision of decentralization, including rolling out fault proofs, and decentralizing L2 state root submission, which would allow users to withdraw funds from the L2 even in the event of a sequencer failure.

## Fault Proofs and Decentralization

At mainnet launch, Base will be running the identical codebase as OP Mainnet and as such, fault proofs will not be available. We are working with OP Labs to harden the security guarantees of Bedrock and accelerate the timeline for decentralized fault proofs on the OP Stack. You can read more about our plans in our overview of our decentralization roadmap [here](https://base.mirror.xyz/H_KPwV31M7OJT-THUnU7wYjOF16Sy7aWvaEr5cgHi8I) and we will share more updates on this in the months ahead via our [blog](https://base.mirror.xyz/).

## Our Vision Ahead

We are excited to bring the next billion users onchain together with dapps and communities that share our vision. We want to support builders across the ecosystem to ensure the cryptoeconomy remains open, permissionless, decentralized, and accessible to all.

We believe that onchain is the next online, and are working hard to get there. We can’t wait for you to be part of this journey.

- [Base.org](https://base.org/)
- [Base Developer Docs](https://docs.base.org/?utm_source=base_dot_org)
- [Base Discord](https://base.org/discord)
- [Base Twitter](https://twitter.com/buildonbase)
