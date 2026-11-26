# blog/1-step-crypto-payments

Source: https://www.base.org/blog/1-step-crypto-payments.md

# How Base Pay Delivers 1-Step Crypto Payments

> TL;DR: Introducing a new standard for one-step crypto payments. Try it on Shopify today using Base Pay here, and start building with it here.

- Date: 2025-12-09
- Author: Wilson Cusack
- URL: https://www.base.org/blog/1-step-crypto-payments

**TL;DR:** Introducing a new standard for one-step crypto payments. Try it on Shopify today using Base Pay [here](https://coinbaseshop.com/), and start building with it [here](https://base.github.io/account-sdk/prolink-playground).

---

Payments are one of the most exciting areas in crypto today, but the actual experience of paying with crypto leaves a lot to be desired. Generally, it is a two to three step process, requiring a user to switch context between their wallet and the app where they are paying multiple times:

1. Connect wallet
2. Switch network (if needed)
3. Sign

Crypto payments are constrained by wallet APIs and UX patterns that were built for a different era: one in which users were connecting a wallet to an app for a long lived session. For onchain payments to succeed at scale, we must provide something far simpler.

**Today, we're excited to introduce a new standard for one-step crypto payments.** It's built on open standards that are available to anyone, ready to be adopted industry-wide. Try it on Shopify today using Base Pay [here](https://coinbaseshop.com/), and start building with it [here](https://base.github.io/account-sdk/prolink-playground).

There are three innovations powering this experience:

1. Prolinks
2. Stateless Interactions
3. Callbacks

Let's dive into each.

## 1. Prolinks

Prolinks are a new standard ([ERC-8050](https://github.com/ethereum/ERCs/pull/1261)) for representing JSON-RPC requests in a highly compressed URI.

There have been several previous attempts to standardize a URI format for wallet requests. However, past ERCs have been too opinionated, e.g. assuming that the URI represents a transaction.

Prolinks are generic: allowing communication about any existing or future wallet APIs. They are also size efficient, leveraging protocol buffers and Brotli compression.

## 2. Stateless Interactions

This simplified payments flow also requires wallet APIs that can function without an existing app connection. Historically, wallets will reject API calls like eth_sendTransaction if the user does not have an existing connection to the app. For one-time interactions like payments, this leads to a very cumbersome experience of having to connect and pay as separate steps.

[EIP-5792](https://eips.ethereum.org/EIPS/eip-5792)’s wallet_sendCalls dropped the requirement of a `from` address, allowing apps to make transaction requests without knowing anything about the user. This leads to better experiences and is also more privacy friendly.

wallet_sign ([ERC-7871](https://eips.ethereum.org/EIPS/eip-7871)), used by Base Pay on Shopify, works the same way; users can skip the unnecessary setup and pay immediately

## 3. Callbacks

Finally, the wallet needs a way to share info (e.g. status updates, transaction hash, signed data, etc.) back to the app. The web2 world has a time-tested solution: callbacks.

We bring callbacks into the onchain world via a new EIP-5792-compliant capability: [data callback](https://github.com/ethereum/ERCs/pull/1216). (This is the same capability powering our [Profile feature](https://docs.base.org/base-account/reference/core/capabilities/datacallback?utm_source=base_dot_org) for Base Account!)

## Start building with Base Pay

**Try the new Base Pay experience** [**here**](https://coinbaseshop.com/)**, and start building with the developer playground** [**here**](https://base.github.io/account-sdk/prolink-playground)**.** We’re excited to collaborate with other wallets and payment providers to see these standards improved and adopted.

---

Follow us on social to stay up to date with the latest: [X](https://x.com/base) ([Base team on X](https://x.com/i/lists/1876354838289932418)) | [Base App](https://base.app/profile/base?tab=posts) | [Discord](https://discord.com/invite/buildonbase?utm_source=dotorg&utm_medium=nav)
