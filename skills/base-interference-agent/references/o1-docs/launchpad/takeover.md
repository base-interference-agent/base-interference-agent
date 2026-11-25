> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Community takeover

> Apply to take over creator rights for an eligible token, understand the application fee, and follow your request.

A community takeover (CTO) lets you apply to become the current creator of an existing o1 Launchpad token. If approved and confirmed onchain, the new creator address receives creator rights and future creator fees.

> [!NOTE]
>
> **Which tokens are eligible?** CTO requests are available only for tokens launched through the upgraded o1 Launchpad v4 contracts that support community takeovers. Tokens launched on older contracts before this upgrade are **not eligible**. Eligibility depends on the contracts used to launch the token, not just its launch date. Tax tokens are not eligible for community takeover applications. Select the token's network and paste its contract address in **Developers → Takeover** to check eligibility before applying.

> [!NOTE]
>
> The application fee is non-refundable. Payment submits your request for review and does not guarantee approval or transfer creator rights by itself.

## How to apply

Open **Developers → Takeover** in [o1 Launchpad](https://launch.o1.exchange) and connect the wallet you want to submit from.

1. **Find the token.** Select its network in the header, then find the token or paste its contract address. Check the network and full address before continuing. The form checks whether the token is eligible for a takeover request.
2. **Fill in the details.** Enter the new creator wallet address and a Telegram handle or other contact details. The new creator address can differ from your submitting wallet. Use an address your intended creator controls: it will also receive future creator fees.
3. **Explain your request.** Complete the questions shown, including why you are requesting the takeover. Follow the displayed required fields and character limits.
4. **Sign and pay.** Review the displayed application fee, sign the wallet message, and complete the one-time card payment through Stripe. The signature authorizes your application; it does not perform the takeover. Your request enters review once payment is confirmed.

## Help us review your application

Use clear, accurate information and a contact we can reach. In your answers, we recommend explaining:

* your role in the project or community;
* why a takeover is needed and what you plan to do next;
* relevant public project or community links that help support your request.

These details help us understand your plans and review your request.

## Track your request

Return to Takeover with the same submitting wallet connected. **Your requests** appears below the form and includes requests across networks.

| Status | What it means |
| - | - |
| Awaiting payment | Complete payment to send your request for review. You can resume an existing checkout while it remains open. |
| In review | Payment is confirmed and your request is awaiting a decision. |
| Approved | The takeover is complete. The new address holds creator rights and receives future creator fees. |
| Rejected | The request was declined. You can update the application and apply again, but a new application fee is required. |

Only one active application can proceed for a token at a time. If you were charged but payment confirmation is delayed, wait a moment and refresh before trying again.

## What approval changes

Approval takes effect through an onchain transaction. The address you supplied becomes both the current creator and the recipient of future creator fees. Creator rights include publishing announcements and editing supported profile information where editing was enabled at launch.

The original creator remains part of the launch history, and previously earned fees stay with their existing recipient. Token balances, supply, trading-fee rates, and locked liquidity remain unchanged.

See [Fee claims](https://docs.o1.exchange/launchpad/trading/claims.md) for how earned fees are collected.

## Tokens with shared creator fees

A token launched with [Share creator fees](https://docs.o1.exchange/launchpad/trading/share-creator-fees.md) has a separate **creator fee position** inside its vault. The contract's scoped reassignment changes that position and its limited permissions, preserves the X allocations and their percentages, and leaves earlier unpaid creator fees with the former wallet. A 0% creator position can also be reassigned.

To preserve the split, a takeover must reassign the **vault's creator fee position**. A full Factory-rights takeover is a different action and can redirect future fees away from the vault. Confirm which action is being requested before proceeding. The V4 creator admin, or Tax owner/creator admin, can perform the scoped reassignment. Tax tokens remain ineligible for the public takeover application form.

Neither operation changes token supply, wallet balances or locked liquidity. To sell the creator fee position, use its [creator-position auction](https://docs.o1.exchange/launchpad/auctions/overview.md#tokens-with-shared-creator-fees). The ordinary creator-rights auction does not take the vault's underlying Factory rights.

## Selling creator rights

If you already hold creator rights and want to sell them, open [Auctions](https://docs.o1.exchange/launchpad/auctions/overview.md). A takeover request on this page asks for a reviewed reassignment instead.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.