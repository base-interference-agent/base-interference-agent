> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Fees, anti-snipe, and referrals

> Creation fees, paired-asset swap fees, the opening anti-snipe period, referral links, attribution rules, and trade comments.

Standard and Tax launches pay their factory's current native creation fee plus gas. **Standard tokens** use the creator/platform/referrer swap-fee model below. **Tax tokens** use creator-selected inclusive buy/sell totals. **\$O launches on Base and Robinhood** have no creation fee and burn their entire suite trading fee in wstO. None of these products adds another product's fee model on top.

## Creation fees

| Chain and route | Paired assets | Current creation fee |
| - | - | -: |
| Base Standard / Tax | A supported crypto asset or Stock Token for the selected product | 0.001 ETH |
| Base / Robinhood \$O | wstO | None |
| Robinhood | ETH, USDG, or a registered Robinhood Stock Token | 0.001 ETH |
| Monad | MON, USDC, WETH and 10 wrapped xStocks | 100 MON |
| Arc | USDC or registered cirBTC | 2 native USDC |
| BSC | BNB, USDC or a registered bStock | 0.003 BNB |
| X Layer | OKB, USDC, xETH and 45 wrapped stocks | 0.02 OKB |
| Elysium | HYPE or USDC | 0.025 HYPE |

The creator also pays the network gas required to confirm the launch transaction. Each Standard or Tax factory uses one global native fee for every quote: 0.001 ETH on Base/Robinhood, 100 MON on Monad, 2 native USDC on Arc, 0.003 BNB on BSC, 0.02 OKB on X Layer, and 0.025 HYPE on Elysium. A USDG-paired Robinhood launch does not pay its creation fee in USDG. The \$O factory has no launch-fee setting.

Creation fees are mutable settings for future launches. Read the active factory immediately before preparing a transaction.

Arc uses 18-decimal native USDC for the launch fee. Trading fees and claims use the selected pool quote: six-decimal ERC-20 USDC or eight-decimal cirBTC. Only native and ERC-20 USDC share one balance; cirBTC is a separate asset. Arc Standard has [no anti-snipe surcharge](https://docs.o1.exchange/launchpad/reference/live-configuration.md#arc-mainnet) for new launches; its normal 1% trading fee still applies. Arc Tax has separate creator-selected taxes and optional anti-sniping.

## Normal swap fee

The normal-fee, anti-snipe and financial referral sections below describe **Standard tokens**. They do not add fees or allocations to Tax or \$O launches.

The normal swap fee is **1% of the paired-asset amount**. With a valid referrer, that 1% is divided as follows:

| Recipient | Share of the 1% fee | Equivalent share of the trade |
| - | -: | -: |
| Creator | 50% | 0.5% |
| Platform | 30% | 0.3% |
| Referrer | 20% | 0.2% |

If a trade has no valid referrer, the unused 0.2% referral share goes to the platform. Fees are always denominated in the selected paired asset:

* an ETH market charges ETH;
* an OKB market charges OKB;
* a HYPE market charges HYPE;
* a USDC market charges USDC;
* a USDG market charges USDG;
* a stock-paired market charges its selected Stock Token.

For a stock-paired buy, the fee comes from the Stock Token paid. For a stock-paired sell, the fee comes from the Stock Token received.

## Sharing the creator allocation

On supported new launches, [Share creator fees](https://docs.o1.exchange/launchpad/trading/share-creator-fees.md) splits the **creator allocation**, not the whole trading fee. It does not add a new trading charge or change platform/referral earnings. For Tax, the vault divides the token's configured creator funds while protocol, dividends, burn and integrator allocations stay separate.

For example, if a Standard trade generates 5 USDC of creator fees, a 60% creator / 30% X A / 10% X B split assigns 3 USDC, 1.5 USDC and 0.5 USDC. These are example earnings, not an additional fee rate. Read each token's actual split in its Fees tab.

## Opening anti-snipe period

**Arc Standard has 0% anti-sniping surcharge for launches created after the September 15, 2026 configuration update.** The normal 1% swap fee applies from launch, with creator, platform and referral allocations unchanged. Earlier Arc pools retain their original fee schedule.

> [accordion] Technical detail: why the contract still stores 1 second
>
> The contract requires a positive window value, so it stores the minimum of 1 second. This is not an active surcharge period: the opening total fee equals the base fee (both 100 bps), so no extra anti-sniping fee applies at any point.

On **Base, Robinhood, Monad, BSC, X Layer and Elysium**, trading remains open when the pool launches. The total fee starts at 99% and decreases linearly to the normal 1% fee over a 20-second window.

The configured schedule on Base, Robinhood, Monad, BSC, X Layer and Elysium is:

| Time since launch | Approximate total fee |
| -: | -: |
| At launch | 99% |
| 5 seconds | 74.5% |
| 10 seconds | 50% |
| 15 seconds | 25.5% |
| 20 seconds and later | 1% |

The creator and referrer shares are calculated from the normal 1% fee. The temporary amount above 1% is the anti-snipe surcharge and goes to the platform.

Where a surcharge is configured, the optional atomic Dev Buy is the launch-time exception. It pays the normal 1% base fee but not the anti-snipe surcharge. The toggle is off by default, the exemption can be used only inside that launch transaction, and later buys follow the pool's frozen configuration. New Arc Standard pools charge the normal 1% for both the Dev Buy and later trades.

> [!NOTE]
>
> o1 uses input-amount swaps: traders enter how much they want to spend or sell, and those swaps remain available throughout the opening period. Direct integrations that request an exact output are rejected while the pool's surcharge window is active. With equal opening and base fees, the Hook treats that window as inactive on new Arc Standard pools. This does not add exact-output support to the o1 interface, Public API, or every router.

## Get a referral link

o1 provides two types of referral links:

| Link | Where to copy it | When it applies |
| - | - | - |
| Global referral | Open your profile and select **Referral** | Used as your general referral across o1 Launchpad |
| Token referral | Open a token page, connect your wallet, and select **Referral link** | Applies first to that token on that chain |

The **Profile** link on a profile page is only a public profile link. It does not set referral attribution unless it also contains a referral parameter.

## Which referral is used

For each token, the interface checks referral attribution in this order:

1. a token-specific referral for that exact chain and token;
2. the connected wallet's previously saved global referral;
3. a global referral saved in the current browser.

If the first candidate is invalid, the interface tries the next valid candidate. Opening a token-specific referral link also becomes the global fallback when the visitor does not already have one. Once a wallet has saved a global referral, later global links do not replace it; a token-specific link can still take priority for its exact chain and token.

When a connected wallet first uses a browser-saved global referral, the interface may request a gasless signature to save that attribution to the wallet profile. This is not a token approval or an onchain transaction.

When the trader submits a swap, the interface includes the selected referral address with that trade. `LaunchHook` applies its own onchain reserved-address checks before crediting the referrer's share. An invalid referral never blocks the swap: the hook ignores it and sends the unused referral share to the platform.

## Referral protections

A referral is rejected by the o1 interface or Public API when it points to:

* the trader's connected wallet;
* the original or current launch creator, or the current creator fee recipient;
* the platform fee receiver;
* an empty or malformed address;
* the hook, factory, fee escrow, PoolManager, swap router, or execution contract.

The hook independently rejects the empty address, the v4 executor it sees as `sender`, the current creator, the current creator fee recipient, and its factory, escrow, PoolManager, or hook dependencies. Because a routed swap's onchain `sender` can be an execution contract rather than the trader wallet, direct integrations must enforce the broader trader and platform restrictions before encoding hook data. If no candidate is valid, the trade still works and the referral share goes to the platform.

## Claiming fees

Creator, platform, and referral balances accumulate until claimed. Creators and referrers can open their connected Profile page and use **Fee claims**, where balances are grouped by ETH, stablecoin, or Stock Token. See [Claims](https://docs.o1.exchange/launchpad/trading/claims.md) for the complete interface flow and [Functions and events](https://docs.o1.exchange/launchpad/reference/events-functions.md) for direct contract integration.

## Tax-token fees

Tax totals include protocol. The remaining allocation goes to creator funds, dividends, burns and any launch-time integrator. Recipient fees and dividends use the paired asset; burns use the launched token. Tax uses the chain-specific creation fees listed above, including 2 native USDC on Arc. See the [launch settings](https://docs.o1.exchange/launchpad/reference/live-configuration.md) and [Tax tokens](https://docs.o1.exchange/launchpad/tax/overview.md) for examples and optional anti-sniping.

Tax supports public trade comments, but a referral link does not change its frozen integrator attribution.

## \$O launch fees

The Base and Robinhood defaults are 1% buy and 1% sell, charged in wstO and burned during the swap. Pool rates are frozen at launch. There are no creator, platform, referral, integrator or dividend allocations and no anti-sniping surcharge. Ordinary transfers are untaxed. The same burn applies to Dev Buy.

Gas and external ETH/USDC/\$O conversion costs are additional. See [\$O launches](https://docs.o1.exchange/launchpad/wsto/overview.md#a-simple-burn-example) for buy/sell examples and supply effects.

## Trade comments

A trader may attach an optional comment of up to 32 UTF-8 bytes. The comment is included with the public onchain trade record. Standard includes referral attribution; \$O trades record their burn amount without a referrer. Integrators must use the [suite-specific Hook data](https://docs.o1.exchange/launchpad/integration/wsto.md#hook-data).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.