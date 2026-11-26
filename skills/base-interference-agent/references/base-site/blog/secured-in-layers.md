# blog/secured-in-layers

Source: https://www.base.org/blog/secured-in-layers.md

# How Base is secured in layers

> Base is secured in layers, so if one ever falls short, another is there to catch it. Here's how each layer works, and what teams building on Base can do to add their own.

- Date: 2026-11-24
- Author: Base
- URL: https://www.base.org/blog/secured-in-layers

Security is on a lot of people's minds right now. At Base, it's shaped how we've built from day one, and today we're sharing how we approach it, so you can keep building on Base with confidence.

Base is secured in layers, so if one ever falls short, another is there to catch it. A flaw in new code would have to get past internal and external audits and an AI-powered review. A harmful upgrade would need sign-off from both Coinbase and an independent Security Council. Base has two independent provers, and each proposed state must come with a proof from at least one of them. And automated monitors watch all of it.

Here's how each layer works, and what teams building on Base can do to add their own.

## The code: every upgrade is reviewed, then stress-tested

Every Base network upgrade is reviewed by our own security engineers and by outside auditors before it ships. Before shipping, each upgrade also goes through an internal AI-powered audit that probes the code for weaknesses.

For major upgrades, we open the code to the public. Before Azul, our first independent upgrade, we ran a public audit competition with a $250,000 reward pool. And a [second $250,000 competition](https://immunefi.com/audit-competition/audit-comp-base-everest/information/) is open now.

Once code ships, our bug bounties stay open: up to $5M on Cantina for Base's smart contracts and up to $1M on HackerOne for infrastructure.

We also keep the system small, because every piece we remove is one less thing to secure. Denim, our fourth upgrade this year, went live on November 5 and replaced Flashblocks with native 200ms blocks, which let us retire Flashblocks, span batches and the infrastructure behind them. Cobalt, which shipped in September, moved registration for one of our two provers (more on those below) onchain, removing an external dependency.

## No single key can change Base

Audits catch bugs. They can't stop someone with the keys from pushing a harmful change, so no one holds those keys alone. Upgrades to Base's core contracts need approval from both Coinbase and an independent Security Council of 11 members, at least 8 of whom must sign. Coinbase can't upgrade Base on its own, and neither can the Council.

Every privileged action on Base's core contracts, including each Security Council signature, raises an alert that our security team reviews.

## Multiple proof systems check Base's state

Even if everything above failed, we have multiple proof systems that settle the bridge to Ethereum as the final check. We post Base's transaction data to Ethereum, and Base's state has to be proven there before any withdrawal to L1 is paid out.

That check uses [multiproofs](https://www.base.org/blog/multiproofs-on-base). Base has two independent provers, and each proposed state must come with a proof from at least one of them.

The first is a trusted execution environment (TEE) prover. A TEE is a sealed-off area of a computer that runs code in isolation, designed so that even the machine's operator can't tamper with the result. Our TEE prover re-runs Base's blocks inside AWS Nitro Enclaves and signs the outcome.

The second is a zero-knowledge (ZK) prover built on SP1, open-source software developed by Succinct. A ZK proof uses cryptography to show that Base's blocks were processed correctly, and a contract on Ethereum can check it without re-running the blocks or trusting whoever produced it.

Two systems built in different ways are unlikely to fail in the same way. If they ever disagree, the ZK proof takes precedence, and anyone who spots an incorrect state can challenge it with a ZK proof. A withdrawal backed by one proof completes after five days, which leaves time for a challenge. When both proofs agree, it can complete in about a day.

You also don't need us to get your funds out. Anyone can propose Base's state by depositing a small amount of ETH, called a bond, with Base's proof contracts on Ethereum. The bond gives proposers a financial stake in getting it right.

## Continuous monitoring

Automated monitoring watches Base's bridge, proof system and core contracts continuously, using tooling from monitoring partners. When a monitor fires, it is triaged and routed to the engineers who own that system, with the likely cause and next steps attached. We also follow activity across the Base ecosystem and can flag concerns to the teams building on it.

## What builders can do

Everything above protects the chain. It can't protect an app whose admin key sits in one hot wallet. We run the protocol; teams building on Base secure their own contracts, keys and admin access, and users secure their wallets.

Most losses in crypto come from compromised keys and admin access, not flaws in the chain itself. If you're building on Base, start here:

- **Key management.** No single key should be able to move significant funds. Use multisigs or MPC, set spending limits and keep hot wallet balances low.
- **Monitoring.** Set alerts on admin functions, large transfers and unusual contract activity.
- **Audits.** Audit before launch and after any significant change, and publish a security contact so researchers can reach you.
- **Account delegation.** If you use EIP-7702 to upgrade accounts, delegate only to audited contracts you trust. Our [guide to safe EIP-7702 upgrades](https://www.base.org/blog/securing-eip-7702-upgrades) covers the patterns we recommend.
- **Disclosure.** Report vulnerabilities in Base through Coinbase's [bug bounty program on HackerOne](https://hackerone.com/coinbase).

## Where we're headed

ETHBEAT rates Base Stage 1, a milestone we reached in April 2025. Each upgrade since has removed code, dependencies or trust in a single party, including Coinbase, and our next upgrade is already in development.

The fastest way to help is to try to break it. Enter the [open audit competition](https://immunefi.com/audit-competition/audit-comp-base-everest/information/) or submit through our bug bounties. If you're building on Base and want to talk through your setup, reach us on X or GitHub.

Disclaimer: Base is open-source, permissionless blockchain infrastructure. Base provides neutral protocol infrastructure only and does not control the persons, applications, or assets that use it. Including a transaction in a block does not by itself make it final.

This post describes how Base is built and is general information only. It is not legal advice, security advice, or investment advice, and it is not a recommendation to buy, sell, or use any product. Builders are responsible for their own contracts, keys, and admin access, and for their own legal and regulatory obligations; consult your own counsel and security reviewers before relying on anything described here. Nothing in this post is a commitment to deliver any future upgrade or feature.
