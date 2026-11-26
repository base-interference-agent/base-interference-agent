# blog/next-chapter-for-base-chain-1

Source: https://www.base.org/blog/next-chapter-for-base-chain-1.md

# A new, unified stack for Base Chain

> Base is evolving its tech stack, paving the path for further scaling, innovation, and decentralization.

- Date: 2026-02-18
- Author: Base Engineering Team
- URL: https://www.base.org/blog/next-chapter-for-base-chain-1

**TL;DR:** To accelerate innovation, scaling and security, Base is evolving its foundational software by moving to a unified, Base-operated stack. Once we complete this transition, node operators will need to follow releases from [⁠base/base](https://github.com/base/base) instead of Optimism’s releases. We will communicate more as this date approaches.

## The Evolution of the Stack

The mission Base launched with is the same mission we have today: make it the best place to build and onboard the next billion people into the onchain economy. We knew that this required creating a secure, low-cost, developer-friendly home for anyone, anywhere, to build on top of. To get there quickly, Base launched as an OP Stack chain. Over time, we grew to incorporate a diverse range of software in collaboration with various partners, including Optimism, Flashbots, and Paradigm. These collaborations enabled features like [Flashblocks](https://www.base.org/blog/accelerating-base-with-flashblocks), but also introduced a complex web of external dependencies.

Today, we’re introducing our new [unified stack](https://github.com/base/base) for running Base - where all dependencies and future innovations are now consolidated into a single place. Base was built on the shoulders of giants - we could not have gotten so far so quickly without the world-class technology underpinning the OP Stack and are grateful for the collaboration over the last 3 years.

## Why are we doing this?

We have three objectives:

- **Faster Shipping Cadence:** Consolidating the stack means we can move faster. We're targeting six smaller, tightly scoped hard forks per year, doubling the current schedule (vs three per year currently). We’ll ship upgrades frequently rather than batching risk into infrequent large ones.
- **Reducing Cognitive Overhead:** The protocol spec and codebase should be understandable by a single developer. By focusing on just what Base needs, we’ll radically simplify the stack.
- **Collaborative success with Ethereum:** Base wins when Ethereum wins. We will accelerate to deploy high-impact changes, such as [BAL](https://eips.ethereum.org/EIPS/eip-7928), ahead of the L1 to provide data that informs the Ethereum roadmap.

#### A Unified Stack

Today, the code operating various components of Base, such as the sequencer, is owned by multiple teams and spread across multiple repositories, which adds coordination and maintenance overhead. Our unified solution, base/base, built on open-sourced components such as Reth, allows us to dramatically simplify the number of components, by optimizing them directly for our use case.

![Base Sequencer architecture before and after](https://www.base.org/images/blog/next-chapter-for-base-chain-1/01.webp 'Base Sequencer architecture before and after')

Consolidating into base/base changes how Base packages and releases software for the network. We will ship **one official distribution** for each upgrade: a single Base binary for operating nodes on the network.

This unification does **not** mean Base will be built in isolation. The protocol remains public and specified in the open, and alternative implementations are welcome and encouraged. Any team can build, run, and maintain an independent client that follows the published specs and remains compatible across hard forks.

#### Accelerating Upgrades

Evolving the stack means updating Base’s software and upgrade process. Over the coming months, Base is moving away from the OP Stack, however, we’ll continue to work with Optimism as a client of OP Enterprise: Mission-Critical Support. Once the transition is complete, upgrades and release information will be published through ⁠base/base.

#### Maintaining High Decentralization Guarantees

It was important that in this evolution, we didn’t make any tradeoffs in security or technical decentralization. We are committed to maintaining, and exceeding, the highest standards for rollup safety.

- **Stage 1 Status:** Base remains a Stage 1 Decentralized Rollup.
- **The Base Security Council:**  In lieu of Optimism, we are adding an additional independent signer to the [Base Security Council.](https://docs.base.org/base-chain/security/security-council?utm_source=base_dot_org)
- **Accelerated Security Roadmap:** This also allows us to move faster on our decentralization milestones, including faster withdrawals via a more robust multi-proof system, Base-specific governance, and enhanced neutrality standards that protect economic autonomy across the entire stack.

#### Building in Public

We believe the technology behind Base should be a public good.

- **Open Source Forever:** Base specifications and code will always be public, open for contribution, and available for others to fork.
- **Client Diversity:** We actively encourage the community to build alternative clients and implementations for Base to further harden the network.
- **Ecosystem Tooling:** We will continue to contribute to essential tooling like Foundry and Wagmi, ensuring a great developer experience for building on Base.

Our goal is to assemble the best libraries from across the ecosystem and continually adopt better options as they emerge. We’re open to new partners and libraries that improve performance, security, or decentralization, and we’ll work in public and contribute upstream so the broader ecosystem benefits.

## How does this impact you?

Our goal is to ensure the transition to our consolidated stack is as seamless as possible for the builders, node operators, and users in the Base ecosystem. While the underlying technology is evolving, the experience of using Base will remain consistent. Here is what you can expect:

- **Today:** No immediate action is required. Base will continue operating as it does today, and we will remain compatible with the OP Stack specification (including continued support for existing RPCs). We’ll continue to upstream bug fixes and coordinate security disclosures to help keep the broader Superchain ecosystem safe.
- **Next Few Months:** If you run a Base node, you will need to migrate to our Base client to remain compatible with future hard forks. All RPCs, including those in the optimism namespace, will continue to be fully supported to prevent breaking existing integrations.
- **Longer Term:** As Base matures, the network will become significantly more decentralized and scalable, enabling higher throughput and lower costs. To maintain stability, breaking changes that require node operators and clients to upgrade will be rare, occurring only during scheduled hard forks and communicated well in advance to the community.

## Roadmap Preview

In the spirit of building in public, we are sharing our current working plan for the next several months of hard forks. We will continue to iterate based on community feedback and the evolution of Base.\

| **Release** | **Planned Features & Changes** |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Base V0 (today) | - Establishing Base repositories, deployments, and binaries. - Implementing Flashblock Access Lists for improved transaction speed. |
| Base V1 (upcoming hardfork) | - **Client Consolidation**: Node operators will need to transition to running releases from [⁠base/base](https://github.com/base/base) instead of Optimism’s releases. - **Proof Upgrade:** Transitioning from Optimistic proofs to TEE/ZK proofs for faster finality. - **Fusaka Support:** Implementing Ethereum’s Fusaka upgrades. |
| Base V2 (future hardfork) | - **Block Access Lists:** Enabling more efficient block processing. - **New Transaction Types:** Introducing protocol-level UX improvements for smoother user interactions. |
| Base V3 (future hardfork) | - **Glamsterdam Support:** Aligning with Ethereum's next major L1 upgrade. - **Op-code Repricing:** Adjusting costs to reflect modern hardware performance. - **Economic Changes:** Refining base fee mechanics and network economics. |

## The Road Ahead: Scaling for a Global Economy

Base is moving from a patchwork of dependencies to a single unified stack in base/base. This means node operators will need to migrate to the Base client and releases will run on a faster, more frequent schedule.

We continue to be committed to building in the open: Base’s codebase and protocol remain open-sourced and influenced by Ethereum’s roadmap. Base will continue to raise its decentralization and security bar while we ship updates more predictably and efficiently.

## Join Us

Building the next frontier of the internet is a collective effort. If you are passionate about scaling, securing, or decentralizing the future of Base, we want to hear from you. View our open roles and apply [here](https://www.base.org/jobs).
