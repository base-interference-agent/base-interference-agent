# blog/building-for-the-long-term-making-base-faster-simpler-and-more-powerful

Source: https://www.base.org/blog/building-for-the-long-term-making-base-faster-simpler-and-more-powerful.md

# Building for the long-term: making Base faster, simpler, and more powerful

> TLDR: We’re introducing new building blocks that make it faster, simpler, and more powerful to build on Base: Flashblocks, Smart Wallet Sub Accounts, and Base Appchains — plus a…

- Date: 2025-02-27
- Author: Base
- URL: https://www.base.org/blog/building-for-the-long-term-making-base-faster-simpler-and-more-powerful

**TLDR:** _We’re introducing new building blocks that make it faster, simpler, and more powerful to build on Base: Flashblocks, Smart Wallet Sub Accounts, and Base Appchains — plus a new_ [_home base for builders_](https://www.base.org/builders)_._

## **Base is building for the long-term**

Base’s mission is to build a global onchain economy that increases innovation, creativity, and freedom. To further our mission, we need to continue making Base more powerful, easier to use, and faster than ever. We are focused on cultivating an ecosystem of long-term people playing long-term games. We want to support passionate builders who are creating products that solve real needs for real people.

Today, we’re introducing three new building blocks to empower everyone to build onchain: Flashblocks to make Base faster, Base Appchains to help Base scale, and Smart Wallet Sub Accounts to make Base simpler to use.

- **Making Base faster:** Flashblocks make Base 10x faster by bringing effective block times from 2 seconds to 200 milliseconds; the fastest EVM chain to date. We’re inviting builders to start testing Flashblocks on Base Sepolia testnet today.
- **Making Base more powerful:** Base Appchains are Layer-3 chains on Base to help apps scale through dedicated blockspace, powered by the op-enclave framework. Appchains are a natural evolution for apps spending significant amounts on gas credits for their end users.
- **Making Base simpler:** Smart Wallet Sub Accounts are now live on Base testnet — simplifying the UX on Base by reducing wallet pop-ups, improving security, and removing the need to manually manage different onchain accounts.

## **Base is fast: Flashblocks are now live on testnet**

People expect near-instant responses when interacting with apps, and a snappy user experience is key to enabling the global onchain economy.

With Flashblocks, a technology built by [Flashbots](https://www.flashbots.net/), Base chain will have 200-millisecond “preconfirmation blocks”. This will make Base 10x faster than it is today, and the fastest EVM chain to date.

Flashblocks are partial blocks issued by the block builder and streamed to nodes every 200 milliseconds, allowing users to experience early confirmation times with native revert protection. This architecture draws inspiration from innovations in block propagation and execution — such as Solana’s shreds and Celestia's data squares — while introducing novel optimizations for the rollup context. Learn more about how Flashblocks work in [Flashbots’ documentation](https://github.com/flashbots/rollup-boost?tab=readme-ov-file#core-system-workflow).

Flashblocks are now live on Base Sepolia testnet, with a path to mainnet in Q2. [See the demo](https://www.base.org/flashblocks) and [start building with Flashblocks](http://base.dev/flash) today.

## **Base is powerful: Base Appchains are now live**

Base Appchains are Layer-3 chains that provide dedicated blockspace for apps looking to scale further on Base. High traffic, mature apps can take advantage of dedicated infrastructure powered by Coinbase Developer Platform (CDP). Apps that are spending significant funds sponsoring gas (such as with [CDP Paymaster](https://www.coinbase.com/developer-platform/products/paymaster)) should consider launching an Appchain for a more customized experience to meet demand.

[Base Appchains](https://www.base.org/builders/base-appchains) are:

- Built for scale: Using [op-enclave](https://github.com/base/op-enclave), chain state is proven immediately using AWS S3 and AWS Nitro Enclaves. More technical details on how and why we built this can be found in our [Engineering Blog](https://www.base.org/blog/scaling-with-base-appchains). Each Appchain is supported by enterprise-grade infra, with a fully managed sequencer and nodes, maintenance and upgrades, and a ready-made block explorer.
- Customizable: Appchains offer a series of customization options, including custom gas tokens, permission allowlists, and custom fee logic.
- Builder-friendly: Appchains are managed through CDP with builder-friendly pricing and compatibility with Base builder tools like Smart Wallet and CDP Paymaster.

[Blocklords](https://x.com/BLOCKLORDS), [Super Champs](https://x.com/SuperChampsHQ), and [Metacade](https://x.com/Metacade_) are launching Appchains to meet the high demands of onchain gamers. [Proof 8](https://www.proof-8.com/) and [MVL](https://x.com/mvlchain) offer real-world services that must operate at the scale Base Appchains are prepared to deliver. [Decentralized Pictures](https://x.com/DCP_Foundation) is launching an Appchain on Base because of the throughput and scalability needed to distribute onchain cinematic art. [Horizen](https://x.com/horizenglobal)’s Base Appchain will support real-world privacy applications, benefitting from Appchain programmability.

## **Base is simple: Smart Wallet Sub Accounts are now live on testnet**

Over the past year, embedded app wallets have become popular because of their ease of use. However, they can also lead to disjointed experiences — forcing users to juggle multiple accounts, fund each separately, and keep track of assets spread across different accounts.

Smart Wallet Sub Accounts significantly improve UX for end users and DevX for builders. With [fine-grained spend limits](https://docs.base.org/identity/smart-wallet/guides/spend-permissions/overview?utm_source=base_dot_org) and the benefits of a single universal account, we are moving closer to a world where onchain apps “just work”. With Smart Wallet Sub Accounts:

- Users can manage all of their onchain accounts from one universal wallet, removing the need to manually manage assets across multiple apps.
- Users encounter less friction, with fewer signatures, fewer pop-ups, and a streamlined onchain experience.
- Users can securely fund new accounts directly from their universal wallet with spend permissions, helping solve the cold start problem for builders.

Smart Wallet Sub Accounts are powered by our new underlying accounts framework — combining spend permissions, hierarchical account ownership, and [a new ERC](https://github.com/ethereum/ERCs/pull/932) developed by the Base team.

Smart Wallet Sub Accounts are [ready for integration](http://docs.base.org/identity/smart-wallet/guides/sub-accounts/overview?utm_source=base_dot_org) on Base testnet today, and will be live on mainnet in Q2.

Read our [engineering blog](https://www.base.org/blog/subaccounts) to dive into the technical details of Sub Accounts.

## **Base is for builders**

Since day one, Base’s goal has been to empower builders with the tools to create world-class onchain apps. With these new building blocks, we’re making Base faster, simpler, and more powerful than ever before.

And to bring it all together, we launched a new hub — featuring tools, guides, stories, and more — to serve as the home base for builders creating the onchain future:

- A new website with everything you need to build, scale, and monetize your onchain app. Start building today at [base.org/builders](http://base.org/builders).
- A new social handle to keep you in the loop on everything that’s happening in the Base builder community. Follow [@buildonbase](https://x.com/buildonbase).
- A new GitHub for our open-source codebase, for those ready to roll up their sleeves and contribute directly to Base. Get involved at [github.com/base](http://github.com/base).

What will you build?
