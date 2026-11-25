> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Launch a token on a launchpad

> Launch a Tax token on a launchpad. The launchpad sets launch rules and receives a share of the tax.

A token that you launch on a launchpad is a [Tax token](https://docs.o1.exchange/launchpad/tax/overview.md) on the chain of the launchpad, Base or Robinhood. It joins the launchpad when it launches. The launchpad receives a share of its tax for the life of the token.

## Start the launch

Open the page of the launchpad and select the launch action. The create page shows **Launch a token on** and the launchpad name. The form is the Tax create form, with the terms of the launchpad added.

Each token launch on a launchpad pays a 0.001 ETH launch fee, plus network gas and any Dev Buy.

On Base, the token can pair with the 15 Base crypto assets. On Robinhood, it can pair with ETH or USDG. A launchpad can limit these assets.

## Launchpad terms

Each launchpad sets one of two tax modes:

| Mode | What you see | What you can change |
| - | - | - |
| The launchpad sets its share | "This launchpad sets its share at" a percent | Your buy tax, sell tax, creator funds, dividends and burns. The **Launchpad funds** share is fixed |
| The launchpad sets the tax | "This launchpad sets the tax." | Nothing in the tax. You use the exact values of the launchpad |

The launchpad share is a percent of the tax that remains after the protocol fee. It sits next to creator funds, dividends and burns in the split. All shares must add up to 100%.

## Launch rules

The launchpad owner can also set these rules:

| Rule | Effect |
| - | - |
| Who can launch | **Anyone**, **Allowlist** or **Closed** |
| Paired assets | A launchpad can limit the paired assets. It can allow at most 64 assets |
| Tax ranges | Minimum and maximum values for the buy tax, sell tax and each share |
| Dividend threshold | Minimum and maximum token amounts for the dividend minimum |

The create page shows the rules of the launchpad. A rule change applies to new tokens only. Existing tokens keep their tax and their launchpad.

## When you cannot launch

The form shows **You cannot launch here** when a rule blocks you. These are the usual causes:

* The launchpad is closed.
* The launchpad uses an allowlist, and your wallet is not on it.
* The launchpad allows no paired asset now.
* The rules of the launchpad conflict with the tax rules of the market. Contact the launchpad owner.
* o1 paused token launches on this launchpad, or on all launchpads.

If the launchpad changes its tax while you fill in the form, the form shows **Tax terms changed**. Review the new terms, then launch.

## How the launchpad accepts a token

The launch names the vault of the launchpad as its integrator. Before the pool opens, the Tax hook asks the vault to accept the launch. The vault checks the pauses and every launch rule. When the vault rejects the launch, the complete launch transaction fails, and no token exists.

The app does the same check and a simulation before the wallet request. A rejected launch thus usually stops before you sign.

> [!WARNING]
>
> If the vault gives no answer, for example because the check runs out of gas, the launch can complete without membership. The token then exists, but it is not on the launchpad. The token still pays its fixed launchpad share to the vault. Nobody can remove that share or add the membership later. The app shows the result after the launch.

## After the launch

* The launch result shows the launchpad that lists the token.
* The launchpad owner can hide the token from the launchpad page, restore it or pin it. A hidden token still trades on o1.
* Your creator funds, dividends and burns work as for any Tax token. See [Claim creator funds](https://docs.o1.exchange/launchpad/trading/claims.md).
* The launchpad share, the tax and the split of your token never change.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.