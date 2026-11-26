# blog/advancing-ethereum-interoperability-with-rrc-7755

Source: https://www.base.org/blog/advancing-ethereum-interoperability-with-rrc-7755.md

# Advancing Ethereum interoperability with RRC-7755

> TL;DR: We're sharing our research on RRC-7755; An interoperability standard for secure cross-chain communication, without needing to trust any third parties.

- Date: 2025-05-14
- Author: Jack Chuma
- URL: https://www.base.org/blog/advancing-ethereum-interoperability-with-rrc-7755

### Introduction

Moving assets and information between blockchains today often involves navigating a complex web of bridges, each with its own security considerations and user experiences. This fragmentation hinders the potential of a truly interconnected onchain world. Recognizing this critical gap, and drawing inspiration from thought leaders like Vitalik Buterin for foundational, trust-minimized interoperability, our team at Base developed [RRC-7755](https://github.com/ethereum/RIPs/blob/master/RIPS/rip-7755.md). This standard challenges prevailing approaches by aiming for secure cross-chain communication without relying on trusted intermediaries.

We successfully built a system demonstrating secure, trustless cross-chain messaging is technically achievable. RRC-7755 proves that you _can_ verify actions across chains using only the underlying security of the blockchains themselves.

However, implementing this rigorous security on today's infrastructure revealed significant economic hurdles, particularly the high gas costs for proof verification and capital lockup opportunity costs resulting from the lengthy challenge periods inherent to optimistic rollups like Base.

These economic realities make the current RRC-7755 implementation impractical for frequent, low-value use cases on optimistic rollups today. While this led us to pause direct work on RRC-7755, the project was successful in yielding  crucial insights and establishing a clear "north star." The principles and the technical hurdles encountered point directly towards zk-rollups, where near-instant finality drastically reduces the economic friction, making this trustless model highly promising. We hope this deep dive serves as a useful benchmark and reference point for future interoperability designs, particularly in the zk space – both for our team and the wider community.

This post details the technical journey of RRC-7755: how it works, the security guarantees it provides, the economic lessons learned, and why its design principles remain a valuable benchmark for the future of interoperability, especially within the ZK ecosystem.

### The Blockchain Archipelago: Islands Without Bridges

#### The Island Problem

Imagine the crypto ecosystem as an archipelago of islands. Each island (blockchain) has its own unique culture, rules, and resources. Ethereum is the largest, most established island, but as it became increasingly crowded and expensive to live there, people began settling on nearby islands – Layer 2 solutions like Base, Optimism, and Arbitrum.

These new islands solved critical problems – they’re cheaper to live on, faster to travel around, and some are specially designed for particular activities like gaming or finance. But there’s one problem: traveling between islands is expensive and complicated.

When users and applications need to operate across multiple chains, they face a fundamental challenge: how do you safely and easily move value and information between these isolated environments? Without effective “bridges” between islands, the ecosystem remains fragmented, with resources and opportunities in silos.

#### Unique Cross-Chain Security Challenges

Most existing cross-chain bridges necessitate significant trust assumptions. They rely on intermediary systems–validator networks, multi-signature schemes, or optimistic verification–to attest to the state of affairs across different blockchains. While functional, this model forces users and applications to trust the bridge operators, their security protocols, and the effectiveness of mechanisms like challenge periods.

This reliance on trust becomes precarious when dealing with the unique complexities of cross-chain communication, introducing risks rarely seen within a single blockchain:\

1. **State finality variance:** Different blockchains achieve transaction finality at different rates and with varying degrees of certainty. Attempting to synchronize operations across chains with divergent finality characteristics creates exploitable timing gaps. Malicious actors could potentially leverage these differences to execute double-spends or create inconsistent states across chains, leading to potential financial loss or protocol instability.
2. **Chain reorganizations:** Blockchain histories, particularly near the tip of the chain, can sometimes be rewritten (a “reorg”). While often short-lived, a reorg on either the source or destination chain during a bridging operation can invalidate a previously confirmed cross-chain transaction. This poses a significant risk, as assets or messages thought to be settled might effectively disappear from the ledger history.
3. **Message propagation guarantees:** Ensuring messages are reliably relayed between chains requires robust economic incentives for the relaying actors. Inadequate or poorly designed incentive structures can lead to message delays, censorship, or outright failure to deliver, potentially halting cross-chain interactions or locking user funds.
4. **Security asymmetry:** Blockchains possess varying levels of economic security, consensus algorithm robustness, and validator set decentralization. Transacting between chains with disparate security profiles inherently exposes the interaction to the security level of the weaker chain. Assets originating from a high-security chain could become vulnerable if bridged to or interacted with via a chain with lower security guarantees, creating systemic risk.

These complexities impede the development of truly secure cross-chain applications. They force developers to build complex mitigations or accept counterparty risk. Addressing these fundamental challenges requires moving beyond trust-based models towards verifiable, cryptographic guarantees for cross-chain interactions that embody the principle of “don’t trust, verify”.

### RRC-7755: A Secure Bridge Between Islands

Before diving into the technical details of how RRC-7755 works, let’s explore its fundamental approach to solving the cross-chain communication problem. While existing bridges sacrifice security for convenience, RRC-7755 takes a different path: leveraging cryptographic proofs to create a trustless verification system that requires no third-party validators.

#### How It Works: A Simple Flow

RRC-7755 operates through a straightforward flow that involves both onchain and offchain components:

1. **Request:** A user on Chain A specifies an action they want to take on Chain B and offers compensation to anyone who can execute it
2. **Alert:** The Chain A `Outbox` contract emits an event, alerting a network of specialized actors called “fulfillers”
3. **Delivery:** A fulfiller executes the request on Chain B
4. **Call Routing:** The Chain B `Inbox` contract routes the specified calls to their corresponding accounts
5. **Verification:** The fulfillment creates a receipt on Chain B
6. **Proof:** The fulfiller creates a proof that this receipt exists on Chain B and presents it to Chain A
7. **Compensation:** Chain A verifies the proof and releases payment to the fulfiller

![](https://www.base.org/images/blog/advancing-ethereum-interoperability-with-rrc-7755/01.webp)

The user does not need to trust the fulfiller, as the proof itself serves as incontrovertible evidence that the message was delivered exactly as requested.

#### The User Experience

From a user perspective, RRC-7755 functions almost like using a single chain – there’s no need to switch networks, interact with complex bridge interfaces, or manage tokens on multiple chains. The underlying complexity is handled by the protocol and fulfillers, creating a seamless experience.

Another way to think about this system is it’s a mechanism to shift all risk and friction involved in cross-chain interactions away from users and towards sophisticated offchain actors that are designed to handle it.

This simplicity is crucial for mainstream adoption. A decentralized application using RRC-7755 can offer users the ability to interact with contracts across multiple chains without requiring them to understand the technical complexities involved.

When paired with [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) smart accounts, the protocol can also preserve a critical property for DeFi applications: maintaining the original user’s identity as the message sender on the destination chain. This enables permissioned cross-chain interactions that were previously impossible with traditional accounts, opening up new possibilities for secure cross-chain DeFi.

### Understanding Storage Proofs

This is where things get exciting. RRC-7755 boasts a settlement layer that verifies messages were delivered exactly as intended, with no added trust assumptions beyond those already present in Ethereum L1 and the L2s involved. This is enabled by [EIP-1186](https://eips.ethereum.org/EIPS/eip-1186) storage proofs — a cryptographic technique for verifying smart contract storage values. Let's break this down.

#### The Digital Notary: A Real-World Analogy

Imagine you’re buying a house in New York while living in California. You need absolute certainty that the property deed exists and hasn’t been tampered with, but you can’t physically visit the New York County Clerk’s office yourself.

In the traditional world, you’d rely on trusted intermediaries – lawyers, title companies, and escrow services – to verify these facts for you. You’re essentially trusting these third parties to tell you the truth.

Storage proofs eliminate the need for this trust. They’re like having a technological system that lets you directly verify the exact contents of that property deed in the New York records office without leaving your home in California – and with certainty that the information hasn’t been altered.

#### Merkle Trees

To understand how storage proofs work, we first need to grasp a fundamental data structure used extensively in blockchains: the [Merkle tree](https://en.wikipedia.org/wiki/Merkle_tree). Merkle trees provide a way to efficiently and securely verify the integrity of large datasets.

![](https://www.base.org/images/blog/advancing-ethereum-interoperability-with-rrc-7755/02.webp)

The core idea is simple:

1. Individual data items (the “leaves” of the tree) are hashed.
2. Pairs of these hashes are concatenated and then hashed together to form the next level of nodes.
3. This process repeats, pairing and hashing nodes, until only a single hash remains: the root.

This structure has two critical properties essential for our purposes:\

1. **Tamper Evidence:** The Merkle root acts as a unique, fixed-size fingerprint for the entire dataset. If even a single byte of data in any leaf changes, the resulting Merkle root will be completely different.
2. **Efficient Verification:** To prove that a specific piece of data exists within the dataset, one only needs to provide the data itself and the sequence of hashes linking it back to the root. Anyone can use this relatively small proof to recalculate the root hash and verify the data’s inclusion and integrity without needing access to the entire dataset. The size of this proof typically grows logarithmically with the size of the dataset, making verification highly efficient even for enormous amounts of data.

#### How Ethereum Stores Data

Ethereum doesn’t actually use standard Merkle trees but rather a more sophisticated data structure called a [Merkle Patricia Trie](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/) (MPT).

The MPT combines the verification properties of Merkle trees with additional features that make it efficient for storing and updating key-value pairs–perfect for Ethereum’s needs. This structure allows for efficient lookups, insertions, and most importantly, cryptographic verification of the entire state.

Ethereum’s state is organized in a hierarchical structure:

```
Global State Root -> Account -> Account Storage Root -> Contract Data
```

At the top level, Ethereum maintains a global state root—a 32-byte hash that cryptographically represents the entire state of the blockchain. From this single hash, you can verify any piece of state in the system.

Each Ethereum account (whether a user wallet or smart contract) is stored in this state trie and contains four essential fields:

- `nonce`: A counter tracking the number of transactions sent from this account
- `balance`: The amount of ETH held by the account (measured in wei)
- `storageRoot`: A hash pointing to another MPT containing the account’s storage data
- `codeHash`: For smart contracts, a hash of the contract’s bytecode

For smart contracts, the storageRoot is particularly important. It points to yet another MPT that organizes all the contract’s state variables. This nested structure creates a cryptographically verifiable path from the global state root to any specific piece of data stored in any contract.

What makes this architecture powerful is that any change to any variable in any smart contract will propagate upward, changing the contract’s storage root, which changes the account’s metadata in the state trie, which ultimately changes the global state root. This provides a tamper-proof mechanism to verify the entire state of Ethereum with a single hash.

This precise, hierarchical organization of state data is what enables storage proofs, which we’ll explore next.

#### Storage Proofs

A storage proof is essentially a cryptographic path that leads from a known state root to a specific piece of data. It allows anyone to verify that a particular value exists at a specific storage location within a contract, without needing to trust any intermediary.

To create a storage proof, we:

1. Start with a known state root
2. Follow a path to a specific account
3. Navigate to a particular storage slot within that account

The resulting proof is a collection of hashes that lets a verifier reconstruct this path and confirm the data’s authenticity. Most RPC providers offer methods to generate these proofs, making them accessible for practical applications.

#### Nested Storage Proofs

RRC-7755’s innovation comes from extending this concept to cross-chain verification through nested storage proofs.

![](https://www.base.org/images/blog/advancing-ethereum-interoperability-with-rrc-7755/03.webp)

For a smart contract on Chain A to verify information about Chain B:\

1. Chain A must have access to Layer 1’s state root
2. Chain B must publish its state root to Layer 1
3. Chain A can then verify:

 1. That Chain B’s state root is part of L1’s state
 2. That a specific piece of data exists within Chain B’s state

This creates a cryptographic chain of trust:

```
Chain A -> Ethereum L1 -> Chain B -> Specific Data
```

The [EIP-4788](https://eips.ethereum.org/EIPS/eip-4788) proposal standardizes how Ethereum L2s can access L1 beacon roots, enabling the first link in this chain. Every L2 already publishes some form of state to L1, enabling the second link.

This breakthrough means a contract on one chain can cryptographically verify what happened on another chain without requiring trust in any validators, oracles, or other third parties.

### Under the Hood: RRC-7755 Implementation

While we’ve covered the high-level flow of RRC-7755 earlier, let’s examine the key technical components that make this system work in practice. We’ll focus on two particularly elegant aspects of the implementation: the contract architecture and the identity preservation mechanism.

#### Smart Contract Architecture

RRC-7755 uses a pair of specialized contracts to handle cross-chain communication:

- **Outbox Contract (on the source chain):** Manages request creation, compensation locking, and proof verification. When a user wants to execute actions on another chain, they submit their request to the Outbox, which generates a unique message ID and locks the specified compensation amount.
- **Inbox Contract (on the destination chain):** Receives and executes the user’s requested actions. When execution succeeds, it stores an execution receipt in a deterministic storage slot that can be cryptographically verified later. This receipt is the target of the storage proofs detailed in the previous section allowing the source chain to release compensation.

What makes this architecture powerful is its simplicity. There are no privileged admin roles, no external validators, and no multi-signature schemes. The entire system operates through transparent, immutable contracts whose behavior is guaranteed by the underlying blockchains.

#### Solving the Identity Problem

One challenging aspect of cross-chain communication is preserving a user’s identity. In traditional bridge systems, when a message arrives on the destination chain, it comes from the bridge contract–not the original user. This creates significant limitations for applications that need to verify who authorized an action.\

RRC-7755 solves this through native integration with ERC-4337 smart accounts. Here’s how it works in simplified terms:\

1. Instead of directly executing calls, the Inbox can act as a “paymaster” for ERC-4337 UserOperations
2. This allows the original user’s smart account to execute the actions, rather than the Inbox itself
3. As a result, destination contracts see the call as coming from the user’s account, not the bridge\

The technical implementation achieves this by having the Inbox contract take on dual roles:

- As a standard contract executing user-specified calls
- As an ERC-4337 paymaster providing gas funding for UserOps

This flexibility allows RRC-7755 to support both basic cross-chain messaging and advanced identity-preserving interactions, making it suitable for a wide range of applications.

### Economic Viability

While our storage proof system provides strict security guarantees, building trustless systems in the real world means confronting economic realities. Why isn’t RRC-7755 the default bridge everywhere _today?_ It boils down to the costs borne by fulfillers.\

**The Fulfiller’s Burden**

Imagine a fulfiller bridging assets, say 10 ETH from Arbitrum to Base using RRC-7755:

1. Alice wants 10 ETH on Base, initiated from Arbitrum. She locks 10 ETH + a bounty on Arbitrum.
2. Bob, a fulfiller, **fronts his own 10 ETH** on Base to send to Alice immediately.
3. Bob executes, gets a proof, and submits it back to Arbitrum to claim Alice’s original 10 ETH + the bounty.\

For this system to work, Alice’s bounty must cover Bob’s costs:\

1. **Gas on Destination (Base):** Executing Alice’s request.
2. **Gas on Source (Arbitrum):** Verifying the proof to claim the bounty.
3. **The Big One: Capital Opportunity Cost:** Bob’s 10 ETH is locked until the proof is verified on Arbitrum.\

This opportunity cost is where the current friction lies, driven by two key factors inherent in today’s L2 infrastructure:\

1. **The Price of Proof:** Verifying a nested storage proof on an EVM chain isn’t cheap–think 800k to 1M gas. Plus, the proofs themselves (12 - 15 kB) incur significant L1 data costs for rollups. While we see clear paths to optimize these verification costs dramatically (potentially by 10x!), they represent a hurdle today.
2. **Optimistic Rollup Finality:** This is the showstopper for optimistic rollups like Base _right now_. They require a ~7-day challenge period before their state is considered final on Ethereum L1. Since RRC-7755 relies on these L1 state roots for its absolute security guarantee, fulfillers must wait this entire period before their proof is valid. Locking capital for 7 days creates a substantial opportunity cost, making the required bounty prohibitively high for most transactions compared to faster, trust-based alternatives. This is a fundamental economic consequence of the optimistic rollup security model.

These economics make RRC-7755 impractical for frequent, small-value transfers _to optimistic rollups_ today. The security premium is simply too high.

**But here’s the crucial pivot:** This economic barrier largely dissolves with **zk-rollups**. Why?\

1. **Near-Instant Finality:** ZK proofs, once verified on L1, offer immediate finality. No 7-day challenge period.
2. **Minimal Opportunity Cost:** The delay shrinks from 7 days to minutes or hours (the time it takes the zk-rollup to batch and post to L1). This drastically cuts the fulfiller’s capital lockup cost.
3. **Proof Optimization Synergy:** The gas and data optimizations mentioned earlier apply equally, making zk verification even more efficient.

While the verification gas costs need optimization across the board, the fundamental blocker – the 7-day capital lockup – vanishes with ZK.

Beyond the raw cost components, determining the _appropriate_ bounty presents its own challenge that still needs to be solved. RRC-7755 itself doesn't prescribe a pricing mechanism. This leaves users guessing, risking transaction failure if the bounty is too low, or overpaying if it's too high. The likely solution involves offchain coordination, potentially through Request-for-Quote (RFQ) systems where users pre-negotiate prices with fulfillers or fulfiller networks. While functional, this reliance on offchain infrastructure introduces user experience friction and could potentially centralize price discovery around dominant fulfiller networks, somewhat counter to the protocol's core goals of decentralization and neutrality.

### RRC-7755: Achievements and Future Landscape

Designing and implementing RRC-7755 was an important undertaking for us in exploring the future of blockchain interoperability. We successfully built a system demonstrating that trust-minimized messaging between chains, grounded in the security principles of the underlying blockchains, is technically feasible. In an ecosystem grappling with the security complexities of cross-chain bridges, this project provided a concrete implementation of a cryptographically secure approach. The concepts explored have resonated within the ecosystem, influencing ongoing work and discussions around interoperability.

#### Technical Properties Achieved

- **Security:** Implemented a cross-chain state verification system using storage proofs rooted in L1 state, allowing Chain A to mathematically verify state on Chain B without new trusted third parties. This replaces external attestations with cryptographic proof.
- **Expressiveness:** Supported arbitrary EVM calls specified by the user, offering a low-level, unconstrained primitive for developers building cross-chain applications, enabling a wide range of use cases.
- **Decentralization:** Operated via a permissionless network of "fulfiller" actors, eliminating privileged roles for relaying or verification and enhancing resilience by avoiding centralized dependencies.
- **Identity Preservation:** Integrated natively with ERC-4337 smart accounts, allowing the user's account (not a bridge contract) to be the msg.sender on the destination chain, crucial for permissioned DeFi and other identity-aware applications.
- **Responsive User Experience:** Separated rapid offchain execution by fulfillers from later onchain settlement, providing users near-immediate feedback while maintaining cryptographic security guarantees for fulfiller compensation.

#### Future Directions

Building and testing an RRC-7755 implementation surfaced key challenges and pointed towards powerful future solutions for interoperability:

- **Zero-Knowledge Proofs:** The high gas cost of traditional storage proofs highlighted the potential of ZK proofs (like Groth16) for cross-chain verification, offering the same mathematical certainty with dramatic reductions in proof size (~98%) and gas cost (~66%).
- **Proof Aggregation:** Inspired research into batch verification systems, potentially reducing per-request proof costs by 70-80% at scale by verifying multiple proofs in a single transaction.
- **Chain Integration Standards:** The complexity of supporting unique L2 data posting methods spurred efforts towards standardizing how L2s commit state to L1, simplifying integration and maintenance for future cross-chain systems.
- **Protocol Resilience:** Underlined the need for cross-chain protocols to gracefully handle chain upgrades and forks, leading to more robust designs incorporating fault tolerance and optional fallback mechanisms.
- **Economic Design & Intents:** The fulfiller model sparked innovation around cross-chain capital markets and intent-based architectures, suggesting models where liquidity providers could fund fulfillers, creating a foundational economic layer for the broader cross-chain landscape.

### Conclusion

RRC-7755 demonstrated that secure, trustless cross-chain messaging is technically achievable, and appears to have resonated within the ecosystem. Several projects are exploring similar verification methods, including the proposed [Message Broadcasting System](https://gist.github.com/godzillaba/210f346310d73c03a8bda6dea208ab3a) from Offchain Labs, [The Compact](https://github.com/Uniswap/the-compact) by Uniswap or [Across Protocol's](https://across.to/) settlement layer. Our efforts provided a concrete example of how cryptographic certainty might be approached for cross-chain interactions.

The development process highlighted key economic considerations. While the verification costs present a challenge, the primary hurdle for immediate, broad adoption on optimistic rollups like Base is the ~7-day finality window, which imposes significant capital costs on fulfillers. The principles, however, align well with **zk-rollups**, whose near-instant finality drastically reduces this economic friction, offering a promising path for this model.

Given the lack of economic viability for Base, we are pausing development on RRC-7755 for now. The project served its purpose by proving the technical concept and providing valuable insights. It stands as a useful benchmark and reference point for future interoperability designs, particularly in the zk space – both for our team and the wider community.

RRC-7755 is a powerful reminder that we _can_ advance blockchain technology and user experience without abandoning our core values of decentralization and trust-minimization. Building this future–a truly global, open, onchain economy–requires tackling precisely these kinds of hard, foundational problems.

At Base, we work hard every day building reliable infrastructure to support innovation, creativity and freedom onchain. **We’re actively seeking pioneers to join us in this mission.** If you’re passionate about solving hard technical problems in this domain, [we’re hiring](https://www.base.org/jobs) — and we’d love to hear from you.\

Follow us on social to stay up to date with the latest: [X](https://x.com/base) ([Base team on X](https://x.com/i/lists/1876354838289932418)) | [Farcaster](https://warpcast.com/base/) | [Discord](https://discord.com/invite/buildonbase?utm_source=dotorg&utm_medium=nav)
