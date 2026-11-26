# blog/glamsterdam-proposals

Source: https://www.base.org/blog/glamsterdam-proposals.md

# L1 Upgrades: The Glamsterdam proposals we’re most excited about

> TLDR: With the Fusaka upgrade scheduled to go live on Ethereum mainnet on December 3, the core dev community has now shifted their attention to deciding which EIPs to include in…

- Date: 2025-11-18
- Author: Matt Beuttenmuller
- URL: https://www.base.org/blog/glamsterdam-proposals

**_TLDR: With the Fusaka upgrade scheduled to go live on Ethereum mainnet on December 3, the core dev community has now shifted their attention to deciding which EIPs to include in the next upgrade: Glamsterdam. The Base engineering team is most excited by six EIPs that fall into three categories: blob scaling (_**[**_EIP-8070_**](https://eips.ethereum.org/EIPS/eip-8070)**_), gas repricing (_**[**_EIP-2780_**](https://eips.ethereum.org/EIPS/eip-2780) **_and_** [**_EIP-8032_**](https://eips.ethereum.org/EIPS/eip-8032)**_), and builder UX improvements (_**[**_EIP-5920_**](https://eips.ethereum.org/EIPS/eip-5920)**_,_** [**_EIP-7907_**](https://eips.ethereum.org/EIPS/eip-7907)**_, and_** [**_EIP-8024_**](https://eips.ethereum.org/EIPS/eip-8024)**_)._**

Upgrades to the Ethereum L1 can have major benefits for users and builders on Base. For example, the Fusaka upgrade will [enable an 8x increase of blobs](https://x.com/buildonbase/status/1945196759346540781?s=20) on a scheduled and safe basis via [PeerDAS](https://eips.ethereum.org/EIPS/eip-7594) and [BPO hardforks](https://eips.ethereum.org/EIPS/eip-7892). This increase in blob capacity will provide Base and other L2s with the data availability (DA) capacity necessary to continue to scale and support more users and builders coming onchain.

The next Ethereum upgrade, Glamsterdam, is expected to hit mainnet in 2026. The headliner EIPs for Glamsterdam are [EIP-7732: Enshrined Proposer-Builder Separation](https://eips.ethereum.org/EIPS/eip-7732) (ePBS) and [EIP-7928: Block-Level Access Lists](https://eips.ethereum.org/EIPS/eip-7928), which will support increased blob capacity and more efficient execution performance, respectively. The Ethereum core dev community is now in the process of submitting their support for the non-headliner EIPs they would like to see included.

From the list of nearly 50 non-headliner EIPs proposed for inclusion, we have boiled our list down to six that we see as most promising. The EIPs we are most excited about fall into three categories: blob scaling, gas repricing, and builder UX improvements. It’s important to note that exclusion from the list below does not mean we are necessarily against any EIP; however, we do share the concern raised by EthPandaOps and others during the [November 13 All Core Devs call](https://github.com/ethereum/pm/issues/1790) that if [EIP-7805: Fork-Choice Inclusion Lists (FOCIL)](https://eips.ethereum.org/EIPS/eip-7805) is included in Glamsterdam, the complexity and unknowns of testing it alongside ePBS could delay the upgrade beyond 2026. While we do not think we should introduce further complexity and risk to Glamsterdam by including FOCIL, the censorship resistance properties FOCIL will bring to Ethereum are important for all users and we hope FOCIL will be prioritized in a future upgrade.

---

## Blob scaling

As we covered above and in our [scaling blog](https://www.base.org/blog/scaling-base-doubling-capacity-in-30-days) from last month, blobs play an important role in scaling the Ethereum ecosystem. When blob usage is consistently saturated, L1 DA can become a bottleneck for L2s such as Base to support more onchain activity.

Both PeerDAS and Glamsterdam’s consensus layer (CL) headliner, [EIP-7732](https://eips.ethereum.org/EIPS/eip-7732), will support an increasing blob target; however, as the blob target begins to grow beyond 48/block, the execution layer (EL) blobpool is expected to become the [primary consumer of a given node’s bandwidth](https://eips.ethereum.org/EIPS/eip-8070#motivation). [EIP-8070](https://eips.ethereum.org/EIPS/eip-8070) will address these bandwidth concerns.

#### EIP-8070: Sparse Blobpool ([spec](https://eips.ethereum.org/EIPS/eip-8070))

**What is EIP-8070?**

Similar to how PeerDAS allows for sampling of blob data on the CL, the Sparse Blobpool EIP will allow for cell-level, custody-aligned sampling on the EL. This EIP would reduce the probability of an EL node sampling a full blob payload to p = 0.15. This means EL nodes have a p = 0.85 probability of sampling the same custody assignment as their CL counterpart and downloading as little as 1/8 of the blob data. Altogether, this is expected to reduce the average bandwidth consumption of the blobpool by ~4x.

**Why is EIP-8070 important?**

Ensuring that both the CL _and_ EL can support higher blob targets is important for Base and Ethereum to continue to scale and support more usage. As stated by the EIP’s authors, the EL blobpool [dominated average bandwidth consumption](https://eips.ethereum.org/EIPS/eip-8070#motivation) on full nodes in Fusaka devnets with high blob targets. This raises the concern that block and attestation propagation will not have enough bandwidth left to consume. If block and attestation propagation lack proper bandwidth, network liveness and stability could be put at risk, which would make raising the blob target any further a nonstarter.

---

## Gas repricing

Gas mispricings are one of the biggest issues for scaling Base today, since execution client performance is bottlenecked by needing to efficiently build any block. A block full of the most mispriced opcodes can create major strain on performance due to the requirement for sequencer and validator nodes to be able to handle the worst-case. These worst-case blocks greatly limit how high we can scale.

Glamsterdam’s gas repricings intend to more accurately set gas costs with the goal of reducing the impact of scaling bottlenecks created by mispricings and inefficient gas models. These repricings are organized in a meta-EIP: [EIP-8007](https://eips.ethereum.org/EIPS/eip-8007). While there are many interesting proposals in the EIP-8007 directory, [EIP-2780](https://eips.ethereum.org/EIPS/eip-2780) and [EIP-8032](https://eips.ethereum.org/EIPS/eip-8032) strike us as the most impactful for Base Chain.

#### EIP-2780: Reduce intrinsic transaction gas ([spec](https://eips.ethereum.org/EIPS/eip-2780))

**What is EIP-2780?**

As its title suggests, EIP-2780 reduces the intrinsic base cost of a transaction from 21,000 to 4,500, which would make the gas cost of a simple ETH transfer 6,000. In addition, this EIP introduces _GAS_NEW_ACCOUNT_ which charges an extra 25,000 when a transfer targets an empty account (i.e. more accurately charges for the state growth caused by account creation) and refines gas accounting around cold/warm account reading and writing.

**Why is EIP-2780 important?**

EIP-2780 will make simple ETH transfers less expensive for Base users in addition to allowing for more of them in a given block. In addition, the _GAS_NEW_ACCOUNT_ portion of this EIP will allow for more accurately priced account creation on Base Chain (assuming its value can be tweaked at the L2 level), reducing potential scaling bottlenecks.

#### EIP-8032: Size-Based Storage Gas Pricing ([spec](https://eips.ethereum.org/EIPS/eip-8032))

**What is EIP-8032?**

EIP-8032 intends to help with state bloat concerns by dynamically pricing SSTORE operations based on a given contract’s storage size. In doing so, this EIP more accurately aligns storage write costs with the work EVM clients perform. In addition, this EIP uses an activation threshold parameter to ensure that the progressive increases to storage writes only impact extremely large contracts.

**Why is EIP-8032 important?**

The current gas pricing model is not accurately tuned for contracts with large storage size, leaving both Ethereum mainnet and Base susceptible to state bloat often caused by contracts intended for low-cost data anchoring and spam. These types of contracts increase state root calculation time, creating a scaling bottleneck that penalizes normal usage of our network. By adjusting the gas pricing model to capture the O(log(n)) cost of storage root calculation, Base can continue to scale for normal usage by builders and users.

---

## Builder UX improvements

Builders are foundational to Base. With this in mind, it is important to us to ensure our builders have a secure and smooth experience building on Base Chain. [EIP-5920](https://eips.ethereum.org/EIPS/eip-5920), [EIP-7907](https://eips.ethereum.org/EIPS/eip-7907), and [EIP-8024](https://eips.ethereum.org/EIPS/eip-8024) will help improve this experience.

#### EIP-5920: PAY opcode ([spec](https://eips.ethereum.org/EIPS/eip-5920))

**What is EIP-5920?**

EIP-5920 introduces a new _PAY_ opcode that can be used for ETH transfers without the need to call into the recipient address.

**Why is EIP-5920 important?**

This will benefit builders who need to transfer ETH to their contracts by removing the need to call into the recipient address and transfer execution context to that address. This change will remove a major reentrancy vector and reduce security considerations for our builders.

#### EIP-7907: Meter Contract Code Size and Increase Limit ([spec](https://eips.ethereum.org/EIPS/eip-7907))

**What is EIP-7907?**

EIP-7907 increases both the contract code size limit (from 24KB to 48KB) and the initcode size limit (from 48KB to 96KB). In addition, it introduces gas metering (4 gas per 32 bytes above 24KB) to prevent a potential DoS vector via these larger contracts.

**Why is EIP-7907 important?**

EIP-7907 would allow our builders to deploy more complex logic in a single contract. Our builders have given us feedback that the current code size limit is too restrictive and requires them to break their more complex contracts into multiple smaller contracts. This practice introduces additional technical complexity and is also gas inefficient due to the necessity of cross-contract calls.

#### EIP-8024: Backward compatible SWAPN, DUPN, EXCHANGE ([spec](https://eips.ethereum.org/EIPS/eip-8024))

**What is EIP-8024?**

EIP-8024 introduces three new instructions: _SWAPN_, _DUPN_, and _EXCHANGE_. These instructions allow compilers to access deep stack items below the depth of 16 currently supported by the _SWAP\*_ and _DUP\*_ instructions.

**Why is EIP-8024 important?**

Once these new instructions are supported in solidity compilers, they will reduce the occurrence of stack too deep errors, which in turn will relieve friction for smart contract developers and make smart contract development more approachable for newer Solidity developers.

---

## Conclusion

Base is excited to see Ethereum continue to improve with next year’s Glamsterdam upgrade. We believe [EIP-8070](https://eips.ethereum.org/EIPS/eip-8070), [EIP-2780](https://eips.ethereum.org/EIPS/eip-2780), [EIP-8032](https://eips.ethereum.org/EIPS/eip-8032), [EIP-5920](https://eips.ethereum.org/EIPS/eip-5920), [EIP-7907](https://eips.ethereum.org/EIPS/eip-7907), and [EIP-8024](https://eips.ethereum.org/EIPS/eip-8024) are the most impactful for our users and builders.

If you are a Base user or builder and have other EIPs you think would be impactful to you, please let us know and show your support on the relevant [Ethereum Magicians](https://ethereum-magicians.org/) thread. Another resource we recommend checking out is [Forkcast](https://forkcast.org/), a great tool developed by the Ethereum Foundation to provide an overview of a given upgrade’s EIPs and the Ethereum upgrade process more generally.
