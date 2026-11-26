# blog/introducing-base-azul

Source: https://www.base.org/blog/introducing-base-azul.md

# Introducing Base Azul

> tl;dr Base Azul, our first independent network upgrade, is targeting mainnet activation on May 13, 2026. Azul makes Base more secure, more performant, and easier to build on.

- Date: 2026-04-21
- Author: Danyal Prout
- URL: https://www.base.org/blog/introducing-base-azul

**tl;dr Base Azul, our first independent network upgrade, is targeting mainnet activation on May 13, 2026. Azul makes Base more secure, more performant, and easier to build on.**

In our [previous post](https://www.base.org/blog/next-chapter-for-base-chain-1), we shared why Base is consolidating onto a streamlined Base stack to ship faster and simplify the protocol. Base Azul is the first network upgrade built on top of this new foundation. Base Azul is now live on testnet and is scheduled for Base Mainnet on May 13.

The Azul upgrade follows months of work for improved stability and consolidating our stack. And it's already paying off. Over the past two months, we've:

- **Increased Builder Reliability**: Reduced the number of empty blocks by ~99% — from ~200/day to ~2/day
- **Increased Chain Throughput**: Sustained multiple 5,000 TPS bursts
- **Shipped Faster**: Cut client releases fortnightly, added new features, and improved validator performance

Security is our top priority for Base. Every onchain component and proof system in Azul has gone through both internal and external audits. And to get as many eyes on the code as possible before activation, we're running an [Immunefi audit competition](https://immunefi.com/audit-competition/audit-comp-base-azul/) from April 21 to May 4, with a $250,000 maximum reward pool for any critical vulnerabilities reported.

## What’s in Azul?

Azul delivers impact in three key areas:

1. **Increases security and decentralization**: Multiproof-driven Stage 2 decentralization
2. **Accelerates the path to 1 gigagas/s**: Performance-focused client stack consolidation
3. **Improves developer experience**: Ethereum Osaka spec alignment

### Increased security and decentralization

With Azul, we're activating multiproofs on Base - a major step in our path toward Stage 2 decentralization. Multiproofs combine TEE and ZK provers into a single system: either proof type can finalize a proposal on its own, but when both agree, withdrawals finalize in as little as one day.

This unlocks faster withdrawals and better capital efficiency for users, while satisfying a core technical requirement of Stage 2: the ability to detect and handle proof system bugs onchain. Posting ZK proofs is permissionless and will override the permissioned TEE proofs if there is a contradiction. The design is inspired by [Vitalik's L2 finalization roadmap](https://ethereum-magicians.org/t/a-simple-l2-security-and-finalization-roadmap/23309) and gives us security-in-depth. An attacker would need to compromise multiple independent systems for fast withdrawals, not just one.

Multiproofs are an intermediary step towards our desired end state of full ZK proving with near-instant withdrawals. Getting there means onboarding additional ZKVMs, investing in real-time proving performance, and progressively shortening finality times as our confidence in the technology grows.

Over the next few weeks, we’ll be sharing a blog post that provides more details. For now you can learn more in our [specification](https://specs.base.org/upgrades/azul/proofs).

### Accelerated the path to 1 gigagas/s

Azul consolidates Base onto a single, performance-focused client stack:

- base-reth-node becomes our sole execution client. Reth has consistently been one of the highest-performing clients on Ethereum, and is providing the headroom to scale Base.
- base-consensus is our new consensus client, based on Kona. It already delivers significantly faster historical sync, and we'll keep optimizing it on the [path to 1 gigagas/s](https://www.base.org/blog/scaling-base-doubling-capacity-in-30-days).

\
Azul drops support for all consensus and execution clients except for base-reth-node and base-consensus. You can get the latest client releases from [base/base](https://github.com/base/base/releases/latest).

![](https://www.base.org/images/blog/introducing-base-azul/01.webp)

We plan to further simplify the node software by combining these into a single binary base in the upcoming months.

### Improve developer experience

Azul aligns Base with Ethereum by adopting the latest execution-layer specs (Osaka). The main changes are:\

| **Change** | **What** | **Why** |
| ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [EIP-7825: Transaction Gas Limit Cap](https://specs.base.org/upgrades/azul/exec-engine#transaction-gas-limit-cap) | Introduces a per-transaction gas cap of ~17 million gas. | Unlocks future validator performance. |
| [EIP-7939: CLZ Opcode](https://specs.base.org/upgrades/azul/exec-engine#clz-opcode) | A new opcode to count the number of leading zeros. | More efficient compute for smart contracts. |
| [Raise the cost of the secp256r1 precompile](https://specs.base.org/upgrades/azul/exec-engine#secp256r1-precompile-gas-cost) | Raise the cost of the secp256r1 P-256 signature verification precompile to make Base match Ethereum. | Consistency with Ethereum. |
| [EIP-7883: MODEXP Gas Cost Increase](https://specs.base.org/upgrades/azul/exec-engine#modexp-gas-cost-increase) | Raises MODEXP gas costs to reflect actual compute cost. | Consistency with Ethereum & reduces DoS vectors. |
| [EIP-7823: Upper-Bound MODEXP](https://specs.base.org/upgrades/azul/exec-engine#upper-bound-modexp) | Caps MODEXP input sizes so gas pricing stays predictable. | Consistency with Ethereum & reduces DoS vectors. |
| [Flashblocks: Decrease Flashblocks payload size](https://specs.base.org/upgrades/azul/exec-engine#remove-account-balances--receipts). | Breaking change to the Flashblocks websocket payload, removing account balances and receipts. | Make the payload smaller, freeing up room for [block access lists](https://blockaccesslist.xyz/) and other performance hints in the future. |

---

## How Azul impacts you

### Users

Users won’t have to take any action for this upgrade. Base just gets faster, safer, and cheaper for you to use. Withdrawals from Base to Ethereum will get faster as the multiproof system matures.

### Node operators

You'll need to migrate to the new Base clients before the network upgrade activates. For the consensus client, you’ll need to run  base-consensus and base-reth-node for the execution client. Step-by-step instructions are in the node operator [upgrade guide](https://docs.base.org/base-chain/node-operators/base-v1-upgrade?utm_source=base_dot_org).

If you serve historical proof RPCs (e.g. `eth_getProof`, `debug_executionWitness` and `debug_executePayload`) you’ll need to enable our historical proofs extension to serve these performantly. More information can be found [here](https://docs.base.org/base-chain/node-operators/run-a-base-node?utm_source=base_dot_org#enable-historical-proofs-rpcs).

### Developers

Most apps require no changes. If you use MODEXP heavily, send very large transactions, or consume the Flashblocks websocket directly, review the spec changes linked above before activation.

### Auditors

For white hats and security researchers, we’re running an audit competition on the testnet code with Immuefi with a reward pool. More information can be found [here](https://immunefi.com/audit-competition/audit-comp-base-azul/).

---

## What's next

Azul is the first of many Base upgrades. In the spirit of building in public, we are sharing our current working plan for the next several months of network upgrades. We will continue to iterate based on community feedback and the evolution of Base.\
\
We expect the next two upgrades to include:

- **End of June**: Performance-focused. Enshrined token standard, Flashblock Access Lists, Glamsterdam EIPs, single client binary and reduced withdrawal times.

- **End of August**: UX-focused. Ship native account abstraction.

In mid-May we're also launching Base Vibenet, a public devnet for developers to experiment with our upcoming features and give us early feedback. Vibenet isn't tied to a hardfork, it's our permanent space to try things ahead of mainnet.

Azul is the first network upgrade on a stack we control end-to-end, and the start of a steady cadence of independent upgrades on the path to a global, free, onchain economy that serves the next billion users.

If there's something we can do better, we want to hear it. Reach us on [X](https://x.com/buildonbase), [Discord](https://discord.com/invite/buildonbase), or [GitHub](https://github.com/base/base/issues).
