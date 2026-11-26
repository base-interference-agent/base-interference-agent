# blog/base-verify

Source: https://www.base.org/blog/base-verify.md

# Anti-Sybil Infrastructure for the Base Ecosystem

> TL;DR: Base Verify helps apps on Base confirm that users are real people—not bots or the same person pretending to be many. Users log in with 3rd party accounts (X, Instagram…

- Date: 2026-02-09
- Author: Rahul Patni
- URL: https://www.base.org/blog/base-verify

## The Problem: Incentives Don’t Scale Without Identity

Rewards are one of the most powerful growth tools in crypto — and the easiest to exploit.

Across the ecosystem, teams run into the same issues:

- Bots and multi-wallet users frequently drain reward pools
- Gated access leaks almost instantly

The problem isn’t incentives themselves. It’s identity.

**Wallets don’t prove uniqueness.**

Anyone can create unlimited wallets and interact repeatedly. Without stronger identity signals, it’s nearly impossible to reward real users, prevent abuse, or build meaningful reputation.

---

## Introducing Base Verify

Base Verify is anti-Sybil verification infrastructure built into the Base App and now available to the broader ecosystem.

It allows users to prove ownership of real accounts — such as X, Instagram, TikTok, or Coinbase — without revealing credentials or personal data to applications.

Instead of tying access and rewards to wallets alone, Base Verify anchors them to **real-world identity signals** and returns a **deterministic verification token**:

1. **The User proves they own a real account.** They log in to a social platform—X, Instagram, TikTok, or Coinbase—through a familiar "Sign in with..." flow, the same kind used by countless apps.
2. **Base Verify creates a unique identifier.** This identifier is tied to the user's social account, not their wallet. Critically, the same social account always produces the same identifier.
3. **Your app stores that identifier.** The next time anyone tries to claim—even from a different wallet—you check if you've seen their identifier before.

This creates a simple and powerful guarantee:

**One real account equals one claim — regardless of how many wallets a user controls.**

It also unlocks something wallets can’t: the ability to recognize high-value users even when their on-chain activity is minimal. A brand-new wallet might still belong to a Coinbase One subscriber, an X Blue user, or a creator with a large audience. Beyond proving uniqueness, Base Verify can also check whether users meet specific requirements—like having 10,000 followers, holding a Coinbase One subscription, or being a verified creator. Users prove they qualify without revealing the underlying data.

---

## Built for Base Mini Apps

Base Verify already powers identity, reputation, and feed quality inside the Base App. We built it to operate at platform scale first, then opened it to all builders.

For the ecosystem, this means you get access to the same infrastructure we rely on. And because verifications are shared across the Base App, users only need to verify once. That single verification then works across every app that uses Base Verify.

Users verify once, and that verification can unlock value across multiple Mini Apps inside the Base App.

Base Verify is already live and operating at scale:

- **200,000+ verifications** completed and growing

It’s already used in production by Base Mini Apps today. Early partners include:

- **Cody** Uses Base Verify to prevent reward farming and enforce one claim per real account.

- **Scratch** Distributes tokens to high-value users instead of anonymous wallets.\

- **Bracket** Gates $BRACKY airdrops to Coinbase One members, powering sports betting incentives inside a Mini App.

---

## What Base Mini Apps Can Build With Base Verify

**Rewards that can't be farmed:** Ensure incentives go to real people, not wallet farms.

**Tiered access using social proof:** Unlock Mini App features based on signals like follower count or verification status.

**Subscriber-only benefits:** Offer perks to Coinbase One members without building subscription infrastructure.

**Creator programs:** Identify real creators using engagement thresholds instead of empty accounts.

---

## Start Building with Base Verify

Base Verify is available today for builders. Please fill out this [form](https://forms.gle/6L4hWAHkojYcefz27) to request access to Base Verify. Check out the documentation [here](https://www.baseverifydemo.com/docs).

If you’re building incentives, rewards, gated access, or reputation systems inside Mini Apps, we’d love to collaborate.
