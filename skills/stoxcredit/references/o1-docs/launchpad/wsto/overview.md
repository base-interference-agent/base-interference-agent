> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# How it works

> Launch a token paired with wstO, backed by $O, with trading fees that burn wstO immediately.

**\$O launches** create a fixed-supply ERC-20 token paired with **wstO** on Base and Robinhood. Buy and sell fees burn wstO during each trade, reducing its total supply while leaving its underlying \$O backing in the vault.

wstO is the paired asset, not the token you create. Your launched token keeps its fixed supply and permanent Uniswap v4 liquidity.

Create an \$O launch on **Base or Robinhood** through the [website](https://docs.o1.exchange/launchpad/create/token-creation.md) or [Public API](https://docs.o1.exchange/launchpad/api/launches.md#o-launches).

## How it differs from Standard and Tax

| Feature | Standard | Tax | \$O launches |
| - | - | - | - |
| Trading charge | Configured fee sharing | Creator-selected inclusive taxes | Pool's fixed buy/sell wstO burn rates |
| Fee destination | Creator, platform and referrer | Protocol plus selected allocations | Entire suite trading fee is burned |
| Burn asset | No built-in burn allocation | Launched token | wstO paired asset |
| Burn timing | Not applicable | Collected tokens sent to a dead address separately | Actual supply burn in the swap transaction |
| Dividends or fee claims | Recipient fee claims | Recipient claims and optional dividends | None from this suite |
| Anti-sniping surcharge | Chain-specific | Optional at launch | None |
| Base / Robinhood creation fee | 0.001 ETH | 0.001 ETH | None; network gas still applies |
| Ordinary wallet transfers | Untaxed | Untaxed | Untaxed |

The default burn rates are **1% on buys and 1% on sells**. See the [Base](https://docs.o1.exchange/launchpad/reference/live-configuration.md#base-wsto-suite) and [Robinhood](https://docs.o1.exchange/launchpad/reference/live-configuration.md#robinhood-wsto-suite) launch settings. Governance can change the defaults for future launches within 0% to 99%. Each pool permanently keeps the rates set when it launches; creators do not choose an allocation or fee recipient.

External conversion pools can charge their own fees. Network gas and any upstream protocol charges are separate from the suite's burn fee.

## What is wstO?

wstO is an ERC-20 share token backed by \$O held in its vault. The vault and the wstO token use the same address within each chain: see [Base](https://docs.o1.exchange/launchpad/reference/production-contracts.md#base-wsto-contracts) and [Robinhood](https://docs.o1.exchange/launchpad/reference/production-contracts.md#robinhood-wsto-contracts).

* **Deposit \$O:** the vault receives \$O and issues wstO at its current conversion rate.
* **Redeem wstO:** the vault destroys the redeemed shares and returns the corresponding \$O. There is no withdrawal cooldown in this integration.
* **Burn a trading fee:** the launch Hook destroys the wstO it collected, without withdrawing \$O.

Do not assume that one wstO always equals one \$O. Use the current vault preview for the amount being converted. Deposits can be paused by the vault's separate governance, and conversion limits, rounding and transaction deadlines still apply.

This backing vault is different from the optional [staking reward vaults](https://docs.o1.exchange/launchpad/staking/overview.md). Creating an \$O launch does not create a new backing vault or staking program.

## A simple burn example

At a 1% buy rate, a buy spending **100 wstO** burns **1 wstO** and uses **99 wstO** for the launch-pool purchase. The buyer receives the resulting launched tokens.

At a 1% sell rate, if selling launched tokens produces **100 wstO** before the burn fee, **1 wstO** is burned and the seller receives **99 wstO**. A route paying the seller in \$O, USDC, USDG or ETH then converts that remaining wstO.

These are exact-input examples before any separate route costs. Integer rounding applies, so a tiny fee can round to zero. The final quote includes the route's conversion, burn and slippage protection.

Only swaps through the suite's launch Hook contribute to this mechanism. Wallet transfers, centralized exchanges and separate pools do not automatically burn wstO for this suite.

## Create and buy

Choose **\$O** on Base or Robinhood in the [Create flow](https://docs.o1.exchange/launchpad/create/token-creation.md): enter a name, symbol, image and optional profile details, then review the wstO pair and burn rates.

The current factory creates **1 billion tokens with 18 decimals**. All of them seed permanently locked, token-only liquidity. Plain creation requires gas but no creation fee, wstO deposit or initial purchase.

The optional website **Dev Buy** uses ETH:

| Chain | Atomic Dev Buy |
| - | - |
| Base | Create token and pool → ETH → USDC → \$O → wstO → new token → creator |
| Robinhood | Create token and pool → ETH → USDG → \$O → wstO → new token → creator |

The \$O-to-wstO step deposits into the vault on the selected chain. No bridge is involved in the launch transaction.

The router handles native wrapping within the acquisition route. You do not need to hold or approve wstO for this ETH-funded flow. Leave additional ETH for gas. The normal buy burn applies to the actual wstO entering the launch purchase, not to the original ETH amount.

Creation and the purchase are one atomic transaction. A failed conversion, incomplete input spend, insufficient output or failed burn reverts the whole launch. You can choose a smaller Dev Buy or launch without one; increasing slippage cannot fix unavailable liquidity or a failed vault operation.

The Public API also accepts wstO already held in your wallet for Dev Buy. See [funding and approvals](https://docs.o1.exchange/launchpad/api/launches.md#atomic-dev-buy). The [o1 Bot V1 flow](https://docs.o1.exchange/launchpad/bot/quickstart.md) is limited to Standard crypto-paired Base launches.

## Trading after launch

The token page and Public API support these payment and receipt assets:

| Pay with or receive | Base | Robinhood |
| - | - | - |
| wstO | Direct launch-pool trade | Direct launch-pool trade |
| \$O | Deposit for wstO, then trade | Deposit for wstO, then trade |
| Stablecoin | USDC → \$O → wstO → token | USDG → \$O → wstO → token |
| ETH | ETH → USDC → \$O → wstO → token | ETH → USDG → \$O → wstO → token |

Sells reverse these paths, including vault redemption and native ETH delivery when selected.

The pool is always paired with wstO. Selecting ETH, USDC or USDG changes your payment or receipt asset, not the pool's paired asset. Sells through the vault redeem the net wstO after the burn, using the resulting vault state. Approve only the spender shown for the selected route. Native ETH inputs need no ERC-20 approval; token inputs and sells may require one.

Each quote checks the entire route at the requested size. Acquisition-pool liquidity, launch-pool liquidity, the vault and the [settlement reserve](https://docs.o1.exchange/launchpad/integration/wsto.md#settlement-reserve) are separate constraints. A larger trade can fail even if a smaller one works.

## Price, supply and burn totals

Burning shares can increase the \$O backing per remaining wstO share. For example, 100 \$O backing 100 wstO becomes 100 \$O backing 99 wstO after a one-wstO fee burn, before any other activity.

This **does not burn \$O or guarantee a higher market price**. \$O's price can fall, deposits and redemptions change supply, and executable prices depend on pool liquidity and demand. The launch pool prices your new token against wstO; reducing wstO's global supply does not automatically change that pool's price or add liquidity.

The displayed wstO USD price uses \$O's reference price and the vault conversion on the selected chain. Each chain has its own vault conversion rate, so wstO share values can differ. It is a reference valuation, not a guaranteed sale price. Supply comes from the token contract. Liquidity and top-market estimates depend on available market data; missing coverage is not proof of zero liquidity.

**Total wstO burned** on a launched token's page means the accumulated confirmed fee burns from **that token's launch pool**. It is not the total across every launch, every voluntary burn or vault redemption. There is no claim button: the trade already completed the burn.

## Creator rights and risks

Creators retain announcements and optional profile editing, with the suite's creator-rights transfer process. These rights do not grant creator fees, minting, transfer control or liquidity withdrawal.

The burn mechanism relies on the external vault, router and available settlement inventory. Governance can manage that inventory and future launch settings but cannot withdraw the permanently locked launch position. Review the [XORS burn-suite audit](https://docs.o1.exchange/launchpad/security.md#wsto-burn-suite-audit), [security boundaries](https://docs.o1.exchange/launchpad/security.md#wsto-suite-boundaries) and current quote before signing.

> [card] [Contract integration](https://docs.o1.exchange/launchpad/integration/wsto.md)
>
> Exact interfaces, units, swap accounting and event attribution.

> [card] [Base contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#base-wsto-contracts)
>
> Factory, Hook, reserve, adapter and wstO vault identities.

> [card] [Robinhood contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#robinhood-wsto-contracts)
>
> Factory, Hook, reserve, adapter and wstO vault identities.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.