> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Earnings and burns

> The vault splits launchpad income into the owner share and the burn fund. Holders burn launchpad tokens to claim the burn fund.

Each launchpad has a vault. The vault receives the launchpad share of every token on the launchpad, in the paired asset of each token. It keeps a separate record for each currency.

## How the vault splits income

When new income arrives in a currency, the vault splits it:

| Part | Share | Who gets it |
| - | - | - |
| Owner share | 50% | The payout address of the launchpad owner |
| Burn fund | 50% | The wallet that burns the required launchpad tokens |

Registration fixes the owner share. The vault rounds the owner share down. The burn fund receives the rest. The vault takes no protocol fee. The protocol takes its part earlier, in the Tax hook of each token.

Income moves from the Tax fee escrow into the vault with a claim. Any wallet can start that claim. The app does it for you when you claim or burn.

Any wallet can also donate to a vault. The vault adds a donation completely to the burn fund. A donation gives no owner share.

## Claim the owner share

The launchpad owner sees **Launchpad fees** in **Earnings** on the launchpad page, in the **Earnings** tab of **Manage**, and in the profile.

* **Claim all currencies** claims every currency with an owner balance.
* **Claim shown** claims the currencies on the current page.

The vault pays the owner share to the payout address. One claim covers up to 100 currencies. A launchpad with more currencies uses pages.

If the app cannot read some amounts, **Claim all currencies** stops. Use **Claim shown**, or refresh the amounts.

## Burn launchpad tokens to claim the burn fund

Any wallet can claim the burn fund. The wallet burns a fixed amount of launchpad tokens and receives the burn fund in the currencies that it selects. The burn amount is **100,000 launchpad tokens**, which is 0.01% of the supply.

**1. Open the burn panel**

Select **Claim fees** in **Earnings** on the launchpad page. The panel is **Burn tokens to claim fees**.

**2. Review the amounts**

The panel shows **You burn** and **You receive** for each currency, with a USD estimate when a price is available.

**3. Approve and confirm**

Approve the launchpad token if the wallet asks for it. Then confirm **Burn tokens and claim fees**.

The vault moves your launchpad tokens to the dead address `0x000000000000000000000000000000000000dEaD`. The burn is permanent. A burn fund held in the launchpad token itself also goes to the dead address.

One burn can claim up to 20 currencies. The app hides **Claim fees** when known prices show that the burn costs more than the burn fund. A missing price does not hide it, so check the value yourself before you burn. The burn amount and the burn fund must both be above zero.

Each currency has a minimum amount, and the burn reverts when a delivery is below it. The burn also has a deadline and a nonce. When another wallet burns first, your request fails. Refresh the amounts and review again.

## Earnings summary

The **Earnings** section shows these values:

| Value | Meaning |
| - | - |
| Total earned | All income that the vault received |
| Burned | Launchpad tokens that wallets burned to claim the burn fund |
| Burn fund | The current burn fund in each currency |

The page also links to the vault contract as **Earnings contract**.

## What a pause does not stop

A pause of new launchpads or new token launches never stops these actions:

* The owner claim of the owner share.
* The burn of launchpad tokens to claim the burn fund.
* Trades of existing tokens.

No role can hold funds inside a vault.

## Burn amount changes

The registry owner sets the burn amount for new launchpads. The threshold setter can change the burn amount of one launchpad. The amount must stay from 0.0001% to 1% of the launchpad token supply. A pending burn that uses the old amount fails.

## When the owner changes

The vault pays the owner share to the payout address at the time of the claim. The handover sets the payout address of the new owner. The app thus claims the owner share of the seller when the seller proposes the new owner. The seller can claim later income until the new owner accepts. After that, the new owner receives the owner share that the seller did not claim. See [Transfer a launchpad](https://docs.o1.exchange/launchpad/launchpads/transfer.md).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.