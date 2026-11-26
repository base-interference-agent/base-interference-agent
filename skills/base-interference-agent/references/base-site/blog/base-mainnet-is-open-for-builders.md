# blog/base-mainnet-is-open-for-builders

Source: https://www.base.org/blog/base-mainnet-is-open-for-builders.md

# Base Mainnet is Open for Builders

> TL;DR: After completing our launch criteria, Base mainnet is now open for builders ahead of general availability in early August. As a reminder, Base has no plans to issue a…

- Date: 2023-07-13
- Author: Base
- URL: https://www.base.org/blog/base-mainnet-is-open-for-builders

**_TL;DR: After completing our launch criteria, Base mainnet is now open for builders ahead of general availability in early August. As a reminder, Base has no plans to issue a network token. In the weeks ahead, we’re inviting early builders to deploy on Base mainnet, commemorated with a Genesis Builder NFT. And we’re asking everyone to hold on publicly exposing their user facing dapps until early August, when we’ll open Base to the world, together._**

We're building Base to bring the next million builders and billion users onchain. As a reminder, Base is a secure, low-cost, builder-friendly Ethereum L2 built on the OP Stack. Since our [testnet launch](https://base.mirror.xyz/jjQnUq_UNTQOk7psnGBFOsShi7FlrRp8xevQUipG_Gk) in late February, we've connected with incredible builders and have watched their projects start to thrive on Base, enabling onchain [restaurants, games, communities, and advocacy](https://base.mirror.xyz/gxOzGCE-9C7cNZBCo4Ubkkxr87L8BcHDfn5HViSdYGg).

After completing our [launch criteria](https://base.mirror.xyz/gxOzGCE-9C7cNZBCo4Ubkkxr87L8BcHDfn5HViSdYGg), it’s now time to take the next step: Base mainnet is now open for builders. This first phase of mainnet enables builders to deploy their products onto Base in preparation for our mainnet GA in early August, when we’ll begin welcoming the next billion users onchain.

During this phase, we are providing hands-on support from our team in the #base-developers channel in our [Base Discord](https://base.org/discord) and a ‘Genesis Builder’ NFT to commemorate those who join us from the very beginning. **We’re also asking _everyone_ to hold on publicly exposing their integration until early August, at which point we’ll open Base to the world, together.**

You can get started building by [visiting our documentation](http://docs.base.org?utm_source=base_dot_org):

- **RPC access for building on Base.** During this phase, you can access a mainnet RPC for Base via `developer-access-mainnet.base.org`. After our public launch in early August, mainnet.base.org will become available as a mainnet RPC. These endpoints are rate limited, so should not be used for production usage — for production applications, we recommend running your own [node](https://github.com/base-org/node) or accessing a node through any of the providers below.
- **Bridging ETH for building on Base**. During this phase, there will _not_ be a publicly available bridge UI. Builders can bridge ETH to Base for gas for deployments using the portal proxy contract, which you can find and see a full guide for using [here](https://docs.base.org/tools/bridges?utm_source=base_dot_org). NOTE: Do not send any asset other than ETH to the portal proxy contract.

A number of tools are live on Base mainnet today to support builders as they integrate:

- Node providers including [Blockdaemon](https://www.blockdaemon.com/protocols/base), [QuickNode](https://www.quicknode.com/chains/base) and [Blast](https://blastapi.io/public-api/base)
- Smart Wallet Infrastructure from [Safe Wallet](https://app.safe.global/welcome?chain=base)
- Block explorers including [Basescan](http://basescan.org) and [Blockscout](http://base.blockscout.com)
- Data indexers including [The Graph](https://thegraph.com/studio/), [Goldsky](https://app.goldsky.com/) and [Covalent](https://www.covalenthq.com/docs/networks/base/)
- Developer tooling from [Thirdweb](https://thirdweb.com/base)

We can’t wait to see what you’ll build.

## Unpacking our progress: the launch journey so far

Our mainnet launch was dependent on multiple criteria that prioritized safety and security, ensuring that Base mainnet would offer a reliable experience for builders and users. We’re proud to share that we’ve now completed all of these criteria:

![](https://www.base.org/images/blog/base-mainnet-is-open-for-builders/01.webp)

When we completed these criteria, we've made significant strides bringing Base to mainnet:

- The Regolith Hardfork in April allowed us to keep up-to-date with the latest OP Stack releases and have at least one hardfork under our belt.
- We worked closely with Optimism to learn from their experience bringing Optimism to mainnet, including a thorough infrastructure review. This ensured that our architecture and operations for the mainnet node software, sequencer, batcher, proposer, nodes, and routing layers are robust and efficient.
- The [successful upgrade of Optimism’s Bedrock release on June 6](https://twitter.com/optimismFND/status/1666850591669202965) gave us confidence in the release and improved the underlying OP Stack platform with reduced transaction fees, shorter deposit times, improved proof modularity, and enhanced node performance.
- We completed multiple in-depth [security reviews](https://base.mirror.xyz/_SiAx8dQRYJJ4lygkJc0QvBKvf16VVm7_-mdWMdFv20)**,** including internal audits from Coinbase protocol experts and external audits that engaged more than 100 security researchers. We’re continuing to develop solutions to enhance the security of Base and the OP Stack, and support other teams building on OP Stack chains.
- Similar to [Optimism’s upgrade to Bedrock](https://gov.optimism.io/t/final-upgrade-proposal-bedrock-v2/5548#h-2-weeks-stability-10), we observed demonstrated stability for the software release that will power Base mainnet. We define stability as no prolonged sequencer downtime, no batcher downtime exceeding 6 hours, and no proposer downtime exceeding 12 hours.
- Testnet incidents that occurred over the last few months, like the Regolith hardfork and [Builder Quests surge](https://base.mirror.xyz/WQOrCEJVT1lHdzsRxIhnrOqrT1prwus33JGx9rt1Fn4), helped us hone our operational practice, improve our monitoring and make improvements that scale Base along with every other OP Stack chain.

We’re grateful for the community’s patience as we worked through these criteria and we’re excited to welcome everyone on to a secure, scalable, and builder-friendly Base.

## Inviting all developers: become a Genesis Builder

We believe that builders on Base will create the next generation of products that bring one billion users onchain. So we're welcoming developers to launch their products on Base Mainnet now, with our hands-on support and focus. With our mainnet GA launch in early August, we’ll welcome everyday users to feel how onchain is the next online with a seamless, easy, secure experience across hundreds of products on Base.

To celebrate our earliest builders on Base, we’re introducing the Genesis Builder NFT, a non-transferable NFT designed by artist [Klara Vollstaedt](https://klara.art/), whose work The Fall was recently featured in a [Christie's sale](https://nft.christies.com/nft/the-fall). The Genesis Builder NFT is a permanent onchain record of your early support of the Base mission of bringing the world onchain. We’ll also use this record to make sure that Genesis Builders have everything they need to build on Base, including access to hands-on support through a gated Discord channel with the Base team.

To earn a Genesis Builder NFT, a dapp must deploy on Base and complete the onchain application at [builder.base.org](http://builder.base.org). There are three tiers to the Genesis Builder NFT, corresponding to time of deployment:

- 🥇Gold Tier: submit eligible application by mainnet GA in early August
- 🥈Silver Tier: submit eligible application by end of August
- 🥉Bronze Tier: submit eligible application by end of September

![](https://www.base.org/images/blog/base-mainnet-is-open-for-builders/02.webp)

To earn the Genesis Builder NFT, deploy your dapp on Base starting today and come to mainnet with us in early August.

**Starting now:**

- Deploy your dapp’s contract
- Verify and publish contract source code via [Basescan](https://basescan.org/verifyContract)
- Submit contract for decoding via [Dune](https://dune.com/contracts/new)
- Connect deployer wallet to [builder.base.org](https://builder.base.org) and complete the form (\<2min)
- Do **not** deploy your front-end until our Mainnet GA launch in early August, when we open Base for everyone

**At Mainnet GA in early August:**

- Deploy your dapp’s front-end on Base
- Share with your community on Discord / Twitter (tag @BuildOnBase)
- Check wallet for the Genesis Builder NFT in the following weeks
- Connect your wallet and Discord to the [Base Guild](https://guild.xyz/buildonbase), granting you access to a gated discord channel

## Mint “Base is for builders” today

![](https://www.base.org/images/blog/base-mainnet-is-open-for-builders/03.webp)

If you haven’t already, we invite you to explore the Base network and mint “Base is for builders,” a commemorative NFT you can earn to celebrate this moment. This open mint starts today at 11am ET and will run until August 13 at 11am ET. There are no additional fees except for a gas fee to mint. To earn this:

1. Go read the Base mainnet genesis block message (hint: `extraData`)
2. Sign the message using [EIP-191](https://eips.ethereum.org/EIPS/eip-191) (version `0x45`)
3. Submit this signature to the `mint(bytes)` function of the NFT contract to mint the “Base is for builders” NFT\*

You can find the contract on [Basescan](https://basescan.org/address/0x1fc10ef15e041c5d3c54042e52eb0c54cb9b710c) or [Blockscout](https://base.blockscout.com/address/0x1fc10ef15e041c5d3c54042e52eb0c54cb9b710c).

_\*Note: There is no front-end interface for minting, please use a developer tool to call the contract directly. Use any third-party interface and/or tools at your own risk._

We’re excited to build our onchain future together.
