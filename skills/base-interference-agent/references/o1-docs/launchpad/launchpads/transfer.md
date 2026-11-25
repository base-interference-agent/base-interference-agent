> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Transfer a launchpad

> Move a launchpad and the creator rights of its token to a new owner. The two transfers are separate.

A launchpad and the creator rights of its token are two separate things. Each one moves with its own proposal and its own acceptance.

| Item | Contract | What it controls |
| - | - | - |
| Launchpad ownership | Launchpad registry | Launch rules, identity, page, tokens, payout address and the owner share |
| Creator rights of the launchpad token | \$O launch factory | Name, symbol and metadata of the launchpad token |

> [!WARNING]
>
> The contracts do not hold payment, and they do not link the two transfers. A buyer must pay the seller only after the buyer accepts both the creator rights and the launchpad.

## Seller steps

**1. Claim your owner share**

Claim the owner share before the handover. After the acceptance, the payout address of the new owner receives the owner share that you did not claim.

**2. Propose the new owner**

Open **Manage**, then the **Ownership** tab. Under **Transfer launchpad ownership**, enter the new owner address and select **Propose new owner**. The proposal claims your owner share first. If that claim fails, the proposal does not start, and **Earnings** shows the reason. After the new owner accepts, you can no longer manage this launchpad.

**3. Propose the creator rights**

On the page of the launchpad token, propose the creator rights to the same wallet. You can cancel this proposal until the buyer accepts it.

Until the new owner accepts, you stay the owner. You can claim income that arrives in this period. You can also cancel the launchpad proposal.

## Buyer steps

The launchpad page shows **Launchpad ownership waiting for you** to the proposed wallet.

**1. Accept the creator rights**

Accept the creator rights of the launchpad token on the launchpad page or on the token page.

**2. Accept the launchpad**

Select **Accept ownership** and confirm the payout address. The app sends your wallet address as the expected creator. The registry rejects the acceptance when your wallet does not hold the creator rights.

**3. Pay the seller**

Pay only after both acceptances complete.

## What changes after the handover

* Owner fees go to the payout address of the new owner.
* The new owner controls the launch rules, identity, page, tokens and payout address.
* The URL, the launchpad token, the owner share and the burn amount do not change.
* Existing tokens on the launchpad keep their tax and their membership.

When the registry allowlist is on, the new owner must be on it. The allowlist is off.

## Known limit

The contracts do not escrow payment, and they do not make sure that both transfers complete.

* A seller can cancel the launchpad proposal after the buyer accepts the creator rights.
* After both acceptances, the buyer can refuse to pay. The seller cannot reverse either transfer.
* The app makes the buyer hold the creator rights before the launchpad acceptance. A direct contract call with zero as `expectedCreator` skips that check.

Payment after both acceptances protects the buyer. The seller keeps the payment risk. Use a trusted counterparty or a separate escrow arrangement.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.