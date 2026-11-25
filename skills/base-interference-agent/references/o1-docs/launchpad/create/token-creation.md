> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Token creation

> Choose Standard, Tax or $O launches, configure a fixed-supply token and open permanent Uniswap liquidity.

Every launch creates a new fixed-supply token and opens its Uniswap v4 market in the same transaction. The creator does not deposit the paired asset and cannot create more tokens later.

> [!NOTE]
>
> This page describes the web create form. Launching through X has a narrower feature set and different profile-editing defaults. See the [o1 Bot V1 guide](https://docs.o1.exchange/launchpad/bot/quickstart.md) and [X command reference](https://docs.o1.exchange/launchpad/bot/commands.md).

## Choose a launch product

On Base, Robinhood, BSC, Monad, X Layer, Arc and Elysium, choose **Standard** for the standard fee-sharing model or **Tax** to set buy and sell taxes, creator funds, holder dividends and burns. Tax also lets you choose a minimum holding for dividends and optional anti-sniping. Use the sliders or enter percentages with up to six decimal places.

Each chain uses its own factory and paired assets. See the [launch settings](https://docs.o1.exchange/launchpad/reference/live-configuration.md) for all six Tax suites.

Read [Tax tokens](https://docs.o1.exchange/launchpad/tax/overview.md) before choosing those settings. They do not change an existing Standard launch.

On Base and Robinhood, **\$O launches** pair a new ERC-20 with wstO. It has no creation fee, allocation controls or anti-sniping option. The review shows the Factory's buy/sell burn rates, which become fixed for that pool. See [\$O launches](https://docs.o1.exchange/launchpad/wsto/overview.md). The shared identity and profile fields below apply to all three products.

## Form fields

| Field | Requirement |
| - | - |
| Name | Required, maximum 50 characters |
| Symbol | Required, maximum 11 characters and no spaces; letter casing is preserved |
| Image | Required, maximum 2 MB; PNG, JPG, WEBP, or GIF |
| Paired asset | Required; choose a supported crypto asset or Stock Token for the selected chain and product |
| Description | Optional, included in the token's public IPFS profile |
| Website | Optional valid website URL |
| X | Optional X profile URL |
| Telegram | Optional Telegram link |
| Extra information | Optional public key/value entries; keys cannot be empty |
| Profile editing | Optional; grants permission to edit token information only |

## Address suffix

Current Base Standard launches use a B20 address ending in `01`, and the create page previews it before signing. Base Tax, Base \$O and current Robinhood, Monad, Arc, BSC, X Layer and Elysium launches require an ERC-20 address ending in `01`; the app generates it after the final metadata is ready.

The suffix identifies the current o1 launch flow. It does not change the token's permissions, supply, price, or market.

## Supply and liquidity

Current launches create a fixed supply of **1 billion (1,000,000,000) tokens**. The supply cannot increase after launch.

The complete supply is placed into the permanent Uniswap liquidity position when the token launches.

## Token implementation

> [tab] Base Standard B20
>
> The protocol creates a native B20 token with no administrator. Its 1 billion supply is created once. The creator may optionally retain permission to edit profile information, but cannot mint more tokens or control transfers.
>
> Base's B20 protocol contracts are listed in [Production contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md).

> [tab] Other Standard ERC-20
>
> On Robinhood, Monad, Arc, BSC, X Layer and Elysium, o1 creates a Standard fixed-supply ERC-20 with no owner. Its 1 billion supply is created once, and the contract cannot mint more tokens, pause transfers, or be upgraded.
>
> The token supports normal ERC-20 transfers and approvals. Optional profile editing does not grant control over balances or the market.

> [tab] Tax ERC-20
>
> Tax launches create a fixed-supply ERC-20. Trading in the launch pool contributes to the chosen allocations; ordinary wallet transfers are untaxed. The token cannot mint more supply, pause transfers or be upgraded. See [Holder dividends](https://docs.o1.exchange/launchpad/tax/dividends.md) for reward eligibility and administration.

> [tab] \$O ERC-20
>
> The launched token is a fixed-supply ERC-20 with ordinary untaxed transfers and no ongoing mint, pause or upgrade authority. The separate wstO paired asset is burned by launch-pool trading fees; this does not reduce your launched token's supply.

## Crypto-paired and stock-paired routes

Crypto-paired and stock-paired launches share the same fixed supply and permanent liquidity model. The selected paired asset determines the market and payout currency. Tax settings work the same way for both kinds of pair. Standard anti-sniping varies by chain; Tax on Base, Robinhood, BSC, Monad, X Layer, Arc and Elysium lets the creator choose whether to enable it.

| Route | Current paired assets | Recipient fee currency |
| - | - | - |
| Base crypto | ETH, USDC or another registered crypto asset for the selected product | Selected paired asset |
| Base stocks | Registered Base Stock Tokens | Selected Stock Token |
| Robinhood crypto | ETH or USDG | Selected ETH or USDG |
| Robinhood stocks | Supported Stock Tokens | Selected Stock Token |
| Monad crypto / stocks | MON, USDC, WETH and 10 wrapped xStocks | Selected paired asset |
| Arc crypto | USDC or cirBTC, subject to quote registration | Selected paired asset |
| BSC crypto / stocks | BNB, USDC or a registered bStock | Selected paired asset |
| X Layer crypto / stocks | OKB, USDC, xETH and 45 wrapped stocks | Selected paired asset |
| Elysium crypto | HYPE or USDC | Selected paired asset |
| Base and Robinhood \$O launches | wstO | No recipient fees; quote fees are burned |

See [Stock-paired launches](https://docs.o1.exchange/launchpad/create/stock-paired-launches.md) for the current Base, Robinhood, BSC, Monad and X Layer catalogs.

## Share creator fees

On Base, **Share creator fees** divides a new token's creator earnings between one creator wallet and selected X profiles. Up to eight positive allocations must total 100%. A 0% creator share leaves all eight paid slots available for X profiles; the creator wallet still holds the limited creator permissions. Additional wallet recipients are not supported.

The creator fee wallet may differ from the connected launching wallet. The confirmation screen shows the complete split before you sign. X IDs and percentages are permanent, and selecting an X profile does not imply endorsement. A fee vault launches atomically with the token, including a supported Dev Buy.

This option supports new Base Standard and Tax launches, excluding wstO and Pads. See [Share creator fees](https://docs.o1.exchange/launchpad/trading/share-creator-fees.md) for receiving-account setup and claims.

## Optional Dev Buy

The current Base, Robinhood, Monad, Arc, BSC, X Layer and Elysium launch factories can create the token, seed permanent liquidity, and execute one creator purchase atomically through `createLaunchAndBuy`. The **Include Dev Buy** toggle is off by default. When enabled, the creator enters a native ETH amount on Base/Robinhood, MON amount on Monad, native USDC amount on Arc, BNB amount on BSC, OKB amount on X Layer, or HYPE amount on Elysium (USDC amount for an Elysium USDC pair) and reviews the protected minimum output and slippage setting before signing.

On Arc, the adapter uses the six-decimal ERC-20 USDC interface to spend the native USDC buy amount from the same underlying balance. There is no wrap or exchange step between the two USDC interfaces. For a cirBTC pair, routing then exchanges ERC-20 USDC for cirBTC before buying from the launch pool. The launch fee and gas are separate from the buy amount. See [Arc funding amounts](https://docs.o1.exchange/launchpad/integration/direct.md#arc-usdc-amounts-and-approvals) for exact units and approvals.

The Dev Buy pays the pool's ordinary fee: the configured Standard base fee or the creator-selected Tax buy total. It does not pay the anti-snipe surcharge. This exemption applies only to that one atomic creator purchase. Any failure, including output below the protected minimum, reverts the complete launch and buy together. Later purchases follow the pool's frozen fee schedule. New Arc Standard launches have no surcharge on either the Dev Buy or later trades.

For **\$O launches on Base and Robinhood**, the website uses ETH. The route acquires \$O through USDC on Base or USDG on Robinhood, deposits it into that chain's wstO vault, then buys the new token. The normal wstO buy burn applies; there is no surcharge to exempt. You need no wstO approval, and transaction value is the entered ETH amount with gas additional. Plain creation has zero transaction value. All conversion legs and the purchase must succeed together. The Public API and direct contract integrations also support held wstO. See [\$O launch integration](https://docs.o1.exchange/launchpad/integration/wsto.md#launch-parameters-and-payment).

## Profile editing

The default profile is permanently immutable. If the creator opts in, the active launch factory lets the current creator update token profile information after launch.

The creator can update:

* token name;
* token symbol;
* public profile information, including the image, description, website, X, and Telegram;
* extra profile information.

This permission cannot create more tokens, change balances, pause transfers, upgrade the token, or remove liquidity.

## Creator rights

The active launch factory records the launch-time `originalCreator` permanently and separately tracks the `currentCreator`. Standard and Tax additionally track a `creatorFeeRecipient`, which can be changed for future creator-fee credits. The current creator can propose a two-step creator-rights transfer. Announcement authority follows the current creator. Metadata editing also follows that creator when profile editing was enabled at launch. \$O launches retain these project rights without a creator-fee recipient or fee claims.

Creator rights are not token ownership. They do not grant minting, transfer control, upgrades, balance recovery, or liquidity removal. Already credited fee balances stay with the recipient that earned them. The current application does not expose creator-rights management controls; direct integrations must use the verified active-factory ABI.

For a fee-sharing launch, the Factory records the **vault** as creator and fee recipient. The app separately records the submitting wallet as **Created by** and the vault's current **creator fee wallet**. A vault-position handover changes that wallet without transferring the underlying Factory rights or altering X shares. Use the [vault-specific flow](https://docs.o1.exchange/launchpad/trading/share-creator-fees.md#handover-takeover-and-otc), not ordinary Factory-rights transfer calls.

## Transaction safety

The factory rejects a launch if:

* the quote is no longer registered;
* the unique launch identifier was already used;
* the launch settings changed after the app prepared the transaction;
* the deadline has passed;
* the current creation fee or transaction value does not match the active factory configuration;
* profile or liquidity requirements fail;
* the token cannot be created exactly as shown;
* opening the pool would require the creator to supply the paired asset.

The frontend refreshes the launch settings and chain time immediately before submission. If a protected global setting changes while the transaction is pending, the call stops instead of silently using a different configuration. A paired asset's opening-price refresh intentionally uses the latest registered frame when the launch executes.

## Creation result

After confirmation, the app shows the token address and live pool. It also records the paired asset, creation fee, creation route, and market settings from the confirmed transaction. Developers can find exact function and event names in [Functions and events](https://docs.o1.exchange/launchpad/reference/events-functions.md).

BSC supports crypto-paired and stock-paired creation. Its 0.003 BNB launch fee is separate from gas and any Dev Buy input. See [BSC Standard configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#bsc-mainnet) and [BSC Tax configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#bsc-tax-suite).

X Layer uses the same immutable ERC-20 creation flow and a 0.02 OKB launch fee. Quotes include native OKB (18 decimals), USDC (6 decimals), xETH (18 decimals) and 45 wrapped stocks (18 decimals). WOKB is a separate routing wrapper. Ordinary creation needs only the OKB launch fee and gas, with no paired-asset deposit. Optional atomic Dev Buy adds the entered OKB amount to the launch fee. See [X Layer configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#x-layer-mainnet).

Elysium uses the same immutable ERC-20 creation flow and a 0.025 HYPE launch fee for every quote. Quotes are native HYPE (18 decimals) and USDC (6 decimals). WHYPE is a separate routing wrapper. Ordinary creation needs only the HYPE launch fee and gas, with no paired-asset deposit. A HYPE-paired atomic Dev Buy adds the entered HYPE amount to the launch fee. A USDC-paired launch takes a USDC-funded Dev Buy only, because Elysium has no HYPE/USDC Uniswap v3 pool. See [Elysium configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#elysium-mainnet).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.