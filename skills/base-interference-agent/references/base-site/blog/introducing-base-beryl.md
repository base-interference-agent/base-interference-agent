# blog/introducing-base-beryl

Source: https://www.base.org/blog/introducing-base-beryl.md

# Introducing Base Beryl

> Beryl makes Base a first-class issuance platform with the B20 token standard, more capital efficient with a reduced withdrawal delay, and more scalable with Reth V2

- Date: 2026-06-18
- Author: Conner Swenberg
- URL: https://www.base.org/blog/introducing-base-beryl

**TL;DR:** Base Beryl testnet is now live. Our second network upgrade, arrives on mainnet June 25, 2026. Beryl makes Base a first-class issuance platform with the B20 token standard, more capital efficient with a reduced withdrawal delay, and more scalable with Reth V2.

Azul, our first network upgrade, established the Base Stack as a new foundation for the chain: a simpler protocol that improves auditability and security, and a multiproof system that improves security, user experience, and capital efficiency.

Beryl leverages that foundation to ship its first custom precompiles alongside refinements to protocol security and scalability. It's also a test of how quickly we can ship: Beryl lands just four weeks after Azul, a pace that was practically impossible before our migration to the Base Stack.

## What's in Beryl?

Beryl delivers three headline changes:

1. **B20**: introduces a native token standard
2. **Reduced Withdrawal Delay**: improves capital efficiency
3. **Reth V2**: removes barriers to further scaling

## B20

B20 is Base's native token standard: a template for creating new tokens that leverages code embedded in the chain itself instead of smart contracts on top. We made it to streamline compliant asset issuance and to unlock the features and performance that are critical to the long-term success of Base's economy.

![](https://www.base.org/images/blog/introducing-base-beryl/01.webp)

B20 implements the ERC-20 specification, making it interoperable with all existing systems built on ERC-20 like wallets, exchanges, data indexers, and onchain protocols. What's different is how it runs. Rather than a conventional smart contract, a B20 is a [precompiled contract](https://www.evm.codes/precompiled): its logic runs natively in the node software, written in Rust and executed directly instead of as onchain EVM bytecode.

Issuers can deploy and configure tokens of all kinds: stablecoins, real-world assets, and onchain-native tokens. When deploying new tokens, we've consistently seen issuers rebuild compliance features from scratch, slowing their speed to market and introducing the risk of missteps. To accelerate issuing new high-quality assets, B20 comes with an Issuer Toolkit purpose-built for teams facing these requirements.

### Available today: Issuer Toolkit

| **Feature** | **Details** |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| ERC-20 compatible | Full ERC-20 parity, so B20s are drop-in for existing wallets, explorers, and tooling |
| ERC-2612 permits | Signature-based approvals, so holders can approve spenders without a separate transaction |
| Role-based access control | Roles gate mint, burn, pause, and metadata changes |
| Supply management | Mint and burn, with optional supply caps |
| Transfer policies | Authorize transfers granularly by sender, receiver, and executor, with separate control over mint receivers |
| Burn blocked assets | Burn the balance of a policy-blocked address, supporting the common freeze-and-seize path that regulated issuers need |
| Transfer memos | Optional memos on transfers, mints, and burns for payment IDs, compliance tags, or settlement correlation |

Everything in the toolkit builds on code audited by Base and Spearbit, with ongoing work to broaden adoption, interoperability, and accessibility for issuers on the standard.

B20 also ships in variants: use-case-specific versions of the standard, each tuned to a type of issuer. Two are available in the Beryl upgrade:

1. **Asset**: A general-purpose variant for assets of all kinds. Includes configurable decimals, issuer-defined extra metadata, event-based announcements, and a multiplier mechanism for rebasing.
2. **Stablecoin**: A focused variant for fiat-backed assets. Includes fixed 6-decimal precision and an issuer-defined currency code.

### Coming soon: frontier features and performance

Because B20 runs natively in the node rather than through the EVM, the node has deeper control over token operations than a standard contract allows. That opens the door to capabilities and optimizations a standard contract can't reach.

Upcoming feature additions to B20 include:

- **Pay transaction fees**: pay gas in your own token, no ETH required.
- **Virtual addresses**: create unique deposit addresses that forward to a shared account.
- **Indexed data**: fetch aggregated balances, transfer history, and token metadata directly from Base Node RPCs, no external indexer required.

- **Lower fees & higher throughput**: ~50% cheaper transfers; doubling transfers per second

## Reduced Withdrawal Delay

Beryl shortens the time users wait to finalize a withdrawal from Base to Ethereum. This is a better experience for users, and it lets bridging providers put their capital to work sooner.

Withdrawing assets from Base to Ethereum is a critical guarantee: users must always be able to get their assets back. Operationally, a withdrawal has two steps, initiating and finalizing, separated by a protocol-enforced delay. Azul shortened that delay with [Multiproofs](https://www.base.org/blog/multiproofs-on-base): when both proof systems agree a withdrawal is legitimate, it can finalize in one day. But this expedited path is rarely used, due to the cost of generating the required zero-knowledge proof. Beryl targets the more common single-proof path instead, cutting its delay from 7 days to 5.

The 7-day window dates to Base's earlier fault-proof system, where long delays existed so honest challengers could respond to disputes. With Multiproofs, finalization instead requires a positive TEE or ZK proof, so the remaining delay serves a narrower purpose: leaving time to detect and disable a faulty prover before a withdrawal finalizes. That lets the window safely shrink, and we're doing it iteratively, starting at 5 days, as our monitoring and proving systems mature.

## Reth V2

[Reth](https://github.com/paradigmxyz/reth) is a high-performance Ethereum execution client and now the sole client used by Base since Azul, giving us a single, fast codebase to optimize against. Reth V2 is the next round of that work, targeting the two things that most constrain a high-throughput chain: how much disk a node needs, and how quickly it can compute state roots.

Storage V2 meaningfully reduces node disk usage across full, minimal, and archive nodes, giving us headroom to scale, both on the hot path of block building and across the supporting nodes that serve reliable access to chain state.

Reth V2 also improves node performance,  letting us raise block gas targets and limits without overloading the sequencer or rpc nodes..This lets us provide more blockspace for builders on Base.

Together these keep Base on the path to its scaling targets, with more performance work queued for future upgrades. Read more about Reth V2 improvements in its [official blog post](https://www.paradigm.xyz/2026/04/releasing-reth-2-0).

## How Beryl impacts you

### Users

No action needed. If you withdraw through the canonical L1 Bridge, you'll wait two fewer days to finalize most withdrawals, 5 days instead of 7.

### Node Operators

Action required: upgrade to the [latest node versions](https://docs.base.org/base-chain/specs/upgrades/beryl/overview?utm_source=base_dot_org#required-software) before [activation timestamps](https://docs.base.org/base-chain/specs/upgrades/beryl/overview?utm_source=base_dot_org#activation-timestamps). You'll also notice lower resource consumption thanks to Reth V2's storage optimizations.

### Developers

Try deploying a new native token with B20, choosing the Asset or Stablecoin variant. Or just use B20 tokens in your app, where they behave as standard ERC-20s with no special integration required. See the [developer docs](https://docs.base.org/base-chain/specs/upgrades/beryl/b20?utm_source=base_dot_org) and [deployment guide](https://docs.base.org/get-started/launch-b20-token?utm_source=base_dot_org) to get started.

### Auditors

Help us harden Beryl. Submit offchain and infrastructure issues through [HackerOne](https://hackerone.com/coinbase), smart contract details through [Cantina](https://cantina.xyz/bounties/55316f42-3c5e-4746-9bd0-0f18dcbc344b), and anything else to security@coinbase.com. Full reporting guidance is in the [security docs](https://docs.base.org/base-chain/security/report-vulnerability?utm_source=base_dot_org).

## What's next

Beryl is one upgrade in an ongoing series we now control end to end. It's live on Base Sepolia today for testing and activates on Base Mainnet June 25.

After Beryl comes Cobalt, targeted for September. We expect it to include:

- **Native account abstraction**: makes smart accounts first-class at the protocol level, bringing gas sponsorship and transaction batching without extra contracts
- **B20 enhancements**: adds gas payment in B20 tokens, lower transfer costs, higher throughput, and new payment features
- **Unified node binary**: combines the consensus and execution clients into a single base binary, simplifying running a node

If there's something we can do better, we want to hear it. Reach us on [X](https://x.com/buildonbase), [Discord](https://discord.com/invite/buildonbase) or [Github](https://github.com/base/base/issues).

Disclaimer: Base is open-source, permissionless blockchain infrastructure. Base provides neutral protocol infrastructure only and does not control the persons, applications, or assets that use it. B20 tokens are deployed, configured, and administered solely by their respective issuers; issuer-controlled features such as minting, burning, freezing, and seizure are exercised at the issuer's sole discretion. References to third-party issuers or assets are informational and not an endorsement. Except with respect to assets that Coinbase or its affiliates expressly issue (which are offered only in eligible jurisdictions and governed by their own terms and disclosures), Coinbase, including Base, is not the issuer, investment adviser, broker, dealer, underwriter, promoter, distributor, or transfer agent for any B20 token or transaction, and nothing here is investment advice or a recommendation to buy or sell any digital asset. Forward-looking statements about future upgrades, features, or performance are subject to change and are not commitments to deliver.
