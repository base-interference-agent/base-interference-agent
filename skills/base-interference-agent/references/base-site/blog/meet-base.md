# blog/meet-base

Source: https://www.base.org/blog/meet-base.md

# Meet Base

> Today, we’re excited to announce the testnet launch of Base: a secure, low-cost, developer-friendly way for anyone, anywhere, to build decentralized apps onchain.

- Date: 2023-02-23
- Author: Base
- URL: https://www.base.org/blog/meet-base

**Today, we’re excited to announce the testnet launch of Base, an Ethereum Layer 2 (L2) network offering a secure, low-cost, developer-friendly way for anyone, anywhere, to build decentralized apps onchain. Our goal with Base is to make onchain the next online and onboard one billion users into the cryptoeconomy. In pursuit of this goal, Base will serve as both a home for Coinbase’s onchain products and an open ecosystem where anyone can build.**

We’re incubating Base inside of Coinbase, leveraging the last decade of our experience building crypto products, and plan to progressively decentralize the chain over time. To support the path toward decentralization, we’re building Base on [Optimism’s OP Stack](http://stack.optimism.io/) with the vision of creating a standard, modular, rollup agnostic [Superchain](http://optimism.io/superchain) powered by Optimism. **We do not plan to issue a new network token.**

Developers can get started building on Base today at [base.org](http://base.org/). In our [Coinbase announcement, we cover what Base is](https://www.coinbase.com/blog/introducing-base). In this post, we go a little deeper into why we’re building Base and how we plan to accelerate the cryptoeconomy.

https://vimeo.com/801590853/5196ab18c2

## Why are we building Base?

From Coinbase’s start, our [secret master plan](https://www.coinbase.com/blog/the-coinbase-secret-master-plan) has been clear and consistent: create an open financial system that increases economic freedom globally. Over the last decade, we’ve progressed through the first three stages of what we envision takes to get there: the protocols (Bitcoin, Ethereum), building the exchange (Coinbase Exchange) to serve as a bridge to digital currencies, and creating a mass market interface for decentralized apps or “dapps“ (Coinbase & Coinbase Wallet). And over the last year, alongside continuing our investments in the first three phases, we’ve increasingly focused on how to unlock the final stage: the apps of the open financial system. **In particular, we’ve asked ourselves what is required to create an environment where thousands of _actually useful_ dapps emerge that can bring 1B+ users into the global cryptoeconomy?**

![](https://www.base.org/images/blog/meet-base/01.webp)

Before we felt like we could answer that question for our customers, we wanted to understand what this looked like _for ourselves_. Today, the majority of Coinbase products are _not_ written as smart contracts and they primarily leverage the same application infrastructure that’s used by other web2 companies. While they allow our customers to _access_ crypto, they aren’t built natively as dapps on the onchain platform _enabled by crypto_. In the last few years, we’ve slowly changed this: USDC, Coinbase Wallet, and cbETH are examples of natively onchain products that drive significant activity and revenue for Coinbase. As we looked towards our future, we wanted to help our teams build _more_ products like these that leverage the full power of the onchain environment. We hypothesized that if we could enable our own teams to make that change, we’d be well positioned to enable other developers to do so, too.

As we talked with our internal teams to understand how we could do this, we saw that they were struggling with two seemingly simple questions:

1. **_How_ should they build dapps?** There are a number of developer toolkits for writing smart contracts — EVM, Rust with Solana, Cosmos-SDK, to name a few — our teams weren’t sure which of these they should use to build their applications. And because we didn’t have a clear “paved road,” we didn’t have the infrastructure that made it easy for teams to get started in a secure way with a rapid pace of development.
2. **_Where_ should they deploy dapps?** Once they’d chosen a toolkit, there were a number of different chains they could deploy on — for instance with EVM, they could deploy to Ethereum L1, an Ethereum L2, or another chain that offers an EVM execution environment. Our teams weren’t sure which of these they should choose and how they could ensure that environment worked well with other Coinbase products.

We found that these two questions were in many cases stopping teams before they started. So, in the first half of 2022, we ran an internal process to answer these questions and create a paved road for internal onchain development. After extensive conversations with external builders and internal teams, we aligned the company on three primary decisions:

1. **EVM as our _primary_ developer platform for dapps.** EVM is the dominant environment today, with a significant majority of developers, activity, and liquidity happening in EVM environments. In addition, EVM already has significant support across the Coinbase product suite, meaning new products will be supported by default.
2. **Ethereum Layer 1 (L1) for the highest value dapps.** Ethereum has established itself as the most mature, secure, and decentralized EVM chain. This makes it an ideal environment for deploying onchain applications that require the _most_ security, like large institutional or business use-cases that settle on the order of billions of dollars.
3. **Ethereum Layer 2 (L2) for dapps that require scale.** Ethereum prioritizes security and decentralization, which leads to high fees that make it unsuitable for applications that aim to reach billions of users. To solve this, the Ethereum scaling strategy is to enable chains secured by Ethereum that enable cheaper transactions (commonly referred to as “Layer 2” or L2). We identified Ethereum L2 as where we’d deploy future Coinbase applications that aim to serve our entire customer base.

While these decisions helped our teams start building faster, they also clarified the next set of opportunities for impact: Ethereum L2 is still too expensive today ($0.05-$0.25 for transactions) and there are a number of L2s, meaning our teams still have to decide between different options. In the second half of 2022, we [began investing in EIP4844](https://www.coinbase.com/blog/supporting-eip-4844-reducing-fees-for-ethereum-layer-2-rollups), which will lower L2 fees by 10-100x, and we started _another_ process to identify what L2 we should choose as the primary home for Coinbase dapps.

As we met with teams building on Ethereum L2, we were blown away by their creativity and insight, as well as the collaborative mindset they brought to scaling Ethereum. We were also excited by the diversity of approaches they were taking, each bringing new learnings for how best to scale the cryptoeconomy.  Through our conversations, we built a better understanding of the key challenges holding back L2s security, scale, and adoption. And we also refined our mental model for what the architecture of Ethereum L1 and L2 would look like in the future.

In particular, we started this process with the thesis that a single L2 would emerge as “dominant” and gradually absorb all activity, creating a near monopoly. With this vision, we were initially coming at the problem as “picking the right one,” where if we picked “wrong,” we risked cutting Coinbase dapps and users off from the majority of activity in the ecosystem. We ended the process with a very different thesis: that there would be many L2s that would have significant activity, serve as “hubs” for different ecosystems, and gradually increase their interoperability until they formed a “mesh” or “superchain” that jointly scaled Ethereum.

With this vision of the future, we asked ourselves: **in a world with many L2s, can we accelerate Coinbase’s mission and the broader cryptoeconomy by building one ourselves?** Coinbase has considered launching a chain two times before (2018, 2020) and each time we’ve decided no. After careful consideration, we decided to say yes and launch Base because:

1. **Base will accelerate the development of Coinbase’s onchain products.** By creating more certainty in where we build, we eliminate the questions that have been stopping our teams before they start. And we create a foundation that we can layer other developer tools around to make building onchain incredibly easy. With Base, we are committing to make it easier for our teams to build onchain rather than off-chain.
2. **Base will bring our customers into the cryptoeconomy.** By creating an environment that is in the Coinbase orbit, has Coinbase-grade security, and is fully onchain, we will be able to bring much more of our activity onchain. We see bringing users and their assets to Base as a stepping stone to them accessing the broader cryptoeconomy. Importantly, we do not want Base to be an island or silo — we want it to be a bridge that is deeply connected to Ethereum L1, other L2s, and even other L1 ecosystems like Bitcoin, Solana, and Cosmos.
3. **Base will increase Coinbase’s investment in core crypto infrastructure.** With our investment in Base, we now have an even larger motivation to help scale the underlying platforms that Base builds on. We’ve started this with our work on [EIP4844](https://www.coinbase.com/blog/supporting-eip-4844-reducing-fees-for-ethereum-layer-2-rollups) and we expect that investment to only increase. We’re excited to contribute back to the core infrastructure that has made our business possible over the last decade.

We see Base as a key component of our secret master plan — phase 3.5 — and believe it will unlock the next generation of dapps that will bring billions of users into the global cryptoeconomy.

## How are we building Base to accelerate the broader cryptoeconomy?

At its core, a chain is very different than Coinbase products today — in particular, it’s meant to be a _platform_, whereas most things we’ve built thus far are _products._ And building a crypto platform with a vision for decentralization and scale means that we need to build on the incredible legacy of decentralized platforms that predate our work. Four key principles have shaped our decision making as we’ve built Base, and they will continue guiding our approach in the years to come.

### A bridge, not an island

We’re designing Base to optimize for easy, secure access to Ethereum L1, other L2s, as well as other L1 ecosystems like Bitcoin, Solana, and Cosmos. We encourage them to start on Base, but go everywhere: we see Base as a “bridge” for users into the cryptoeconomy. It’s an easy-to-use default onchain experience with access to products on other chains. Along with making Base interoperable with other chains, we will continue supporting as many chains as possible across Coinbase products.

### Open source

Foundational software for the global cryptoeconomy should be fully open source and freely available. Base is built on the MIT-licensed OP Stack, in collaboration with Optimism. We’re joining as the second Core Dev team working on the OP Stack to ensure it’s a public good available to everyone. We see this toolkit as an open platform that _anyone_ can contribute to, fork and extend to help the cryptoeconomy scale. Learn more about how we’re working with Optimism.

### Decentralized

Decentralization is essential for the cryptoeconomy to remain open, global, and accessible to everyone. While we’ve begun incubating Base inside of Coinbase, we are deeply committed to progressing towards full decentralization over the years ahead. With the increased resourcing that Coinbase brings to the OP Stack, we are confident Base will progress from a Stage 0 to Stage 1 rollup in 2023 and a Stage 2 rollup in 2024. Learn more about our approach to decentralization here.

### For everyone

Base has a vision to be an open ecosystem, seeded with Coinbase products, users, and assets. We’ll work with the broader community to bring the chain to life. We're thrilled to have an incredible community who will contribute to making Base a robust ecosystem.

![Builders on Base](https://www.base.org/images/blog/meet-base/02.webp 'Builders on Base')

This is Day 1 of our journey with Base and we couldn’t be more excited about the incredible community already building alongside us. If you have thoughts, feedback, or questions about our approach, you can join us in [Discord](https://base.org/discord) to discuss.

## Where we go from here

Our focus right now is running a successful testnet with builders and developers who join the Base ecosystem. We expect this to be an iterative process and look forward to working together to make Base successful.

In the weeks ahead, we’ll share our roadmap to mainnet and provide more developers resources for building on Base — stay tuned.

## Base, Introduced Commemorative NFT

We’re excited to have a free, open edition mint of [Base, Introduced](https://zora.co/collections/0xd4307e0acd12cf46fd6cf93bc264f5d5d1598792) to celebrate the testnet launch and let everyone join the broader Base community.

Mint “[Base, Introduced](https://zora.co/collections/0xd4307e0acd12cf46fd6cf93bc264f5d5d1598792)” — a commemorative NFT that celebrates the initial launch of Base. 1 per address, freely mintable on Zora through Sunday at midnight EST.

## Base Ecosystem Fund

We’re also announcing the Base Ecosystem Fund, which invests in and supports early stage projects building on Base that meet our investment criteria. If you’re interested, please fill out the form [here](https://forms.gle/dbbCnnk38dKFFdfTA).

## Start building on Base today

- [Base.org](https://base.org/)
- [Base Developer Docs](https://docs.base.org/?utm_source=base_dot_org)
- [Base Discord](https://base.org/discord)
- [Base Twitter](https://twitter.com/buildonbase)
