# blog/multiproofs-on-base

Source: https://www.base.org/blog/multiproofs-on-base.md

# Multiproofs on Base

> We plan to launch multiproofs on mainnet, which provides a pathway for faster withdrawals, brings us closer to Stage 2 decentralization, and improves security.

- Date: 2026-05-21
- Author: Roger Bai
- URL: https://www.base.org/blog/multiproofs-on-base

## The Path Towards Decentralization

Decentralization is one of the most important goals and principals at Base, as we strongly believe that this is what a global, free, onchain economy requires. We took the initial step towards this goal with:

- [Fault Proofs](https://www.base.org/blog/fault-proofs-are-now-live-on-base-mainnet): In October 2024, a decentralized proof system was set up allowing anyone to move funds between Ethereum and Base without relying on trusted authorities. Any user can permissionlessly make a claim as to the state of Base and any user can challenge a claim.

- [Security Council](https://www.base.org/blog/base-has-reached-stage-1-decentralization): In April 2025, a decentralized committee reflecting Base’s values was set up to approve Base upgrades.

With the above, we achieved Stage 1 decentralization, the first milestone in Vitalik Buterin’s [decentralization framework](https://ethereum-magicians.org/t/proposed-milestones-for-rollups-taking-off-training-wheels/11571).

We have now set our sights on the next and final decentralization milestone: Stage 2. A technical requirement of stage 2 decentralization is the ability to detect and handle bugs onchain. Our new multiproof system consisting of TEE and ZK provers not only accomplishes this, but also:

- Improves user experience and liquidity efficiency by enabling faster withdrawals.
- Improves security as less financial resources are now required to defend against attacks.

As the main component for our journey towards Stage 2, this new system expresses Base’s commitment to decentralization as well as our security-first and user-first mindset. Below, we explore the specifics of various proof systems to better understand the technological landscape that informed our multiproof solution.

## Proof Systems

### Optimistic Proof Systems

Along with several other L2s, we started our path towards decentralization with an optimistic proof system. In this design, participants make a proposal as to what the state of Base is and this claim is optimistically accepted as the truth. If it is an invalid proposal, someone must actively challenge it, in which a dispute protocol would take place to determine who is correct.

While this system was an excellent initial step towards moving trust from central authorities to code, it faced certain limitations:

- **Heavily Involved Process:** The dispute protocol is an interactive process where it may take dozens of transactions for a dispute to resolve. Due to this and the possibility of delay attacks, enough time had to be given to allow honest defenders to respond.
- **Onchain Complexity:** The dispute protocol for resolving challenges is very complex. In the case of our previous fault dispute system, it needed a smart contract that mimics how a virtual machine would operate. This was a very difficult problem to solve and became hard to maintain.

**Bond Requirements:** To deter incorrect actions, participants needed to put up bonds, where one would lose their bond if found to be dishonest. The previous fault dispute system required hundreds of ETH in bonds if fully played out, straining the resources of honest defenders in the worst case.

### Validity Proof Systems

Validity systems are where proving the state of a chain is required, as opposed to an optimistic system where verification generally never occurs and is only needed if there is disagreement among participants. In particular, every block in a proposal is proved to be correct.

These systems solve some of the issues optimistic systems face, such as:

- **Non-Interactive Process**: Proofs are generated offchain and verified onchain in a single transaction, no longer needing to provide time for participants to perform several steps. As a result, the complexity of these systems is mainly placed in offchain components.
- **No Bonds**: Assuming that the proof system works properly, there are no possible dishonest actions to take, meaning bonds are not needed.

There are two main validity systems at the moment: Zero-knowledge (ZK) and trusted execution environments (TEE).

#### ZK Proof Systems

These are decentralized systems that prove the state of a chain through advanced mathematics and cryptography. There are also hybrid models that combine an optimistic and ZK approach, but time for challenges and bonds is still required, albeit with much lower bond requirements than the full optimistic setup. Examples of these are [Op-Succinct](https://github.com/succinctlabs/op-succinct) and [Kailua](https://github.com/boundless-xyz/kailua).

However, the main drawbacks preventing full adoption are:

- **Complexity:** The offchain components rely on advanced mathematics and cryptography, which are difficult to soundly implement. Detailed specifications, proper theory-to-implementation practices, and formal methods are artifacts that give us confidence in a ZK prover.
- **Cost:** The resources needed to prove Base blocks in real-time are high, especially as we look to scale the chain further. Fortunately, there have been many advances in this field bringing costs to a likely manageable level in the future.

#### TEE Proof Systems

TEE proofs provide assurance for integrity from a hardware point-of-view. These proofs ensure that the state of Base was derived correctly and not tampered with. They are also efficient to produce and cheap to verify.

The main downside is that this is a centralized option. Trusting a TEE requires trusting an authority, such as AWS or Intel. TEEs can be further divided into physical TEEs and cloud-based ones, each with their own downsides:

- There are known attacks against TEEs if one has physical access, such as side-channel attacks
- Cloud-based TEEs include another layer of trust: the cloud provider

## Our Solution: Multiproofs with TEE and ZK

The solution we landed on is a combination of TEE and ZK provers, a system inspired by Vitalik’s [L2 finalization roadmap](https://ethereum-magicians.org/t/a-simple-l2-security-and-finalization-roadmap/23309). At a high-level, the proof system:

- Requires either a TEE or ZK proof to finalize a proposal
- Allows fast finalization (at most 1 day) if both TEE and ZK proofs are present
- Allows a ZK proof to overrule a TEE proof
- Raises a soundness alert when contradictory proofs exist

We immediately obtain the following:

- Better liquidity efficiency due to fast finality when both TEE and ZK proofs are present
- Decentralization as proposing remains permissionless with ZK proofs and permissionless components override permissioned ones
- Technical requirements for Stage 2 since we can now detect proof system bugs onchain

We view ZK proving as the ideal setup for the future. However, before we can get there, we need to build our confidence and knowledge of this technology in order for us to fully rely on it later. That is why as an intermediary step, we view TEE proofs as the main way to progress the proof system while maintaining safeguards as we gain confidence in ZK technology.

### Security

As the proof system is what secures Base, it was the main focal point in the design process. By shifting from an optimistic system to a validity one (a proof is required for every proposal), we raise the assurance that each claim is correct.

The main worry now is if there is a vulnerability in a prover and an incorrect proof can be produced. We address this with the following added functionalities:

- **Soundness Alerts**: If contradictory proofs exist, such as two ZK proofs for the same block number with different claims, then the proof system automatically disables the associated prover.
- **Intermediary Roots**: While proving a proposal requires proving every block the proposal covers, showing a contradiction only requires showing disagreement with one block. This is where intermediary roots come in, which are subclaims every couple of blocks in a proposal. Showing a contradiction with a subclaim is enough to contradict the entire claim, raising a soundness alert. As a result, defenders do not have to disprove an entire proposal, but only a small portion, reducing the requirements on defender resources.

Our choice of SP1 as the current ZK prover reflects this, as it is one of the most performant and secure prover on the market right now, backed by several audits and formal verification.

## Future Roadmap

The new proof system was designed with a particular end state in mind: full ZK proving. This will allow us to have near instantaneous withdrawals, a feature we believe will be great for users.

To get there, we will be exploring ways to:

- **Improve ZK Security and Efficiency:** We are looking at changes we can make to the chain to make real-time proving a reality and we are always evaluating various ZKVMs to see how this technology is improving.

- **Decreasing Finality Times**: As confidence and efficiency in ZK improves, we will be looking to decrease the time it takes a proposal to finalize, ideally to just a couple of minutes.

This next chapter in our journey towards full decentralization on Base is defined by the launch of the multiproof system, an architecture that secures our network while laying the groundwork for improved  user experience and liquidity efficiency via decreased withdrawal times. By leveraging the complementary strengths of TEE and ZK proofs, we have not only met the technical requirements for Stage 2 decentralization but have also established a robust framework for future innovation. As we continue to evaluate ZK technology and work towards decreasing finality times, we are dedicated to realizing our ultimate goal: a credibly neutral, secure, and performant L2 that is ready to scale the onchain economy to a billion users.
