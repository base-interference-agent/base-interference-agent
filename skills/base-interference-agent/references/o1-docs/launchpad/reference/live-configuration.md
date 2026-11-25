> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Live configuration

> Launch settings for Base, Robinhood, Monad, Arc, BSC, X Layer and Elysium, including paired assets, supply, liquidity and fees.

Launch settings vary by chain and product. Read the active factory before preparing a transaction; the verification dates below identify when these reference values were checked.

## Standard launch settings

The retained Standard suites use the fixed-supply and permanent-liquidity model. Their separately dated reference settings below do not describe Tax or \$O launch economics:

| Setting | Current value |
| - | - |
| Token supply | 1 billion (1,000,000,000) tokens with 18 decimals |
| Opening value | FDV close to USD 4,000 under the quote assumptions below |
| Liquidity | One permanent token-side range using the complete fixed supply |
| Base swap fee | 1% of the paired-asset amount |
| Base-fee distribution | 50% creator, 30% platform, 20% valid referrer |
| Anti-snipe fee | Arc: 0% surcharge, normal 1% fee from launch; Base, Robinhood, Monad, BSC, X Layer and Elysium: 99% total to 1% over 20 seconds |
| Fee currency | The pool's selected paired asset |
| Creation fee | Base/Robinhood: 0.001 ETH; Monad: 100 MON; Arc: 2 native USDC; BSC: 0.003 BNB; X Layer: 0.02 OKB; Elysium: 0.025 HYPE |

The platform share of swap fees goes to `0x1cAa...1C90`, and the restricted opening-price updater is `0x8BF6...5F29` across the documented configurations. The full addresses are listed in [Production contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#governance-and-fee-recipient).

## Standard routes and paired assets

| Chain and route | Active factory | Paired assets | Creation fee |
| - | - | - | -: |
| Base | `0x1176...63dC` | ETH, USDC, supported crypto assets and Base Stock Tokens | 0.001 ETH |
| Robinhood | `0xcE9C...E5B0d` | ETH, USDG and supported Robinhood Stock Tokens | 0.001 ETH |
| Monad | `0x99C0...5b5b7` | MON, USDC, WETH and supported wrapped xStocks | 100 MON |
| Arc | `0xeE3E...F4605` | USDC and cirBTC | 2 native USDC |
| BSC | `0xeE3E...F4605` | BNB, USDC and supported bStocks | 0.003 BNB |
| X Layer | `0x17D9...9c36` | OKB, USDC, xETH and supported wrapped stocks | 0.02 OKB |
| Elysium | `0x2d74...e978` | HYPE and USDC | 0.025 HYPE |

Within Standard, Base, Robinhood, BSC, Monad and X Layer each share one factory across crypto and stock creation. Arc and Elysium each use one factory for crypto-paired launches. See [Stock-paired launches](https://docs.o1.exchange/launchpad/create/stock-paired-launches.md) for supported stock pairs on each chain.

## Opening assumptions

| Paired asset | Current opening reference |
| - | - |
| Native currencies and other registered crypto assets | Asset-specific reference configured on the selected factory for future launches |
| USDC or USDG | USD 1 |
| Supported Stock Token | Route-specific stock price reference maintained for future launches |

Each paired asset is configured to target an opening FDV close to USD 4,000. The actual USD opening value depends on the paired asset's market price and the selected factory's starting tick.

## Opening value

FDV means token price multiplied by the complete fixed supply:

```text theme={null}
opening FDV = opening token price x 1,000,000,000
```

It is a valuation reference. It is not money raised, paired assets deposited by the creator, or a guaranteed future price.

## Liquidity range

The current configuration places the complete fixed supply into one token-side liquidity range beginning at the opening price.

The range boundaries use Uniswap's spacing value of `200`, which is about 2.02% between places where a range boundary may be set. This does not make trades or prices move in 2.02% jumps; trading moves continuously through the active liquidity.

## Values that can change

Governance may update supply, supported paired assets, opening settings, creation fees, liquidity settings, swap fees, and the platform fee receiver for future launches. The announcement registry is bound once. Every registered paired asset uses per-asset revisions, bounded asset updates, the restricted price updater, and the shared switch for new creation. Integrations should resolve the active factory and read its current values before preparing a transaction.

Once a pool opens, its token supply, original creator, paired asset, opening range, fee rates, anti-snipe timing, and permanent liquidity are fixed for that launch. Current creator rights and the destination for future creator-fee credits can change through explicit onchain functions; already credited balances remain with their recorded recipient.

Use [`production-deployments.json`](https://docs.o1.exchange/launchpad/reference/production-deployments.json) for exact machine-readable values and [Production contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md) for explorer-linked addresses.

## Monad snapshot

Read on **November 5, 2026** at block **119,433,835**: owner and creator admin `0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41`, updater `0x8BF6eb1EaA9bE34a068c56945a36a23520705F29`, configuration version `15`, and creation **enabled**. MON, USDC and WETH are registered with 18, 6 and 18 decimals. See the [Standard snapshot](https://docs.o1.exchange/launchpad/reference/production-deployments.json) for this factory's current ticks and revisions. Treasury and fee-policy observations retain their earlier verification dates; read the factory again before signing.

Monad stock-paired launches use the 10 wrapped xStocks in the [Monad Stock Token catalog](https://docs.o1.exchange/launchpad/create/stock-paired-launches.md#monad-stock-token-catalog), each with 18 decimals, on both the Standard and Tax factories. Stock USD values use the underlying ticker's TickDB price multiplied by the wrapper's `convertToAssets` rate, applied once. Buys are funded with MON or USDC and route through hook-free Uniswap v4 USDC/wrapper pools (0.01% fee, tick spacing 1); Dev Buy can be funded with MON. Configuration version `15`, creation **enabled** and the 100 MON fee were reread on both factories at block **120,887,045** on November 10, 2026. See the [Monad stock snapshot](https://docs.o1.exchange/launchpad/reference/monad-stock-quotes.json) for addresses and starting ticks.

## Arc mainnet

Settings for the [Arc mainnet contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#arc-mainnet). Quote registration, roles, creation status, launch fee and configuration version were reread on November 5, 2026 at block **29,561,700**. The fee-policy and router observations retain their September verification dates.

| Setting | Configured value |
| - | - |
| Chain ID | `5042` |
| Launch creation | Enabled |
| Token supply / tick spacing | 1 billion tokens with 18 decimals / `200` |
| Liquidity | Complete fixed supply in one permanent token-side range |
| Registered pool quotes | ERC-20 USDC (6 decimals) and cirBTC (8 decimals) |
| Starting ticks / revisions | Read the selected quote on its originating factory; see the [snapshot](https://docs.o1.exchange/launchpad/reference/production-deployments.json) |
| Opening reference | Approximately USD 4,000 at USD 1 per USDC |
| Launch fee | 2 native USDC, or `2000000000000000000` in 18-decimal units |
| Base swap fee / distribution | 1%; 50% creator, 30% platform, 20% valid referrer |
| Anti-sniping | Disabled (0% surcharge); normal 1% trading fee applies from launch |
| Trading-fee and claim currency | The pool's paired asset: USDC or cirBTC |
| Launch-buy adapter | Attached |
| SwapX router | Active, with zero router fee |
| Platform treasury | `0x1cAa1962428382106Eb3f29B9719bdF797621C90` |
| Configuration version | `10`, read on November 5, 2026 |

The [September 15 fee update](https://explorer.arc.io/tx/0x49b6c7657b55fff9844cd99e9f9dcc347278d2b653b4e9ce18f93635335aa006) succeeded at block `21019549`. It set `antiSnipeStartTotalBps` to `100`, equal to `baseFeeBps`, and `antiSnipeWindowSeconds` to `1`. The creator/platform/referrer components remain 50/30/20 bps with the same IDs, routing rules and recipient addresses. The stored 1-second value is a contract requirement, not an active surcharge period: no extra anti-sniping fee applies at any point. These settings apply to subsequent launches only; existing pools retain their frozen configuration.

The launch fee and any Dev Buy amount are separate from gas. Native and ERC-20 USDC share one balance; integrations must use the correct units for each interface. Arc's launch governance uses the [shared owner, creator-admin, treasury and updater addresses](https://docs.o1.exchange/launchpad/reference/production-contracts.md#governance-and-fee-recipient). Read the factory's current configuration before preparing a transaction.

Both Standard and Tax have registered Circle Wrapped Bitcoin (`cirBTC`), with 8 decimals at `0x171a4217b86a807a64eb94757db6849fb4bdbaa0`. Its starting ticks differ between the two factories; read the selected one. cirBTC uses its own token price without a UI multiplier or fixed-dollar fallback. Native fees remain 18-decimal USDC, and ERC-20 USDC funding remains six decimals. Trading fees and claims for a cirBTC-paired launch use cirBTC units.

## BSC mainnet

BSC enables launch creation with a 0.003 BNB fee and 23 registered quotes: native BNB, USDC and 21 bStocks, all with 18 decimals. The attached adapter is `0xd94981D2Cac1aBFa9561Fd3F6c0E54357e13E47d`. Quote registration and decimals were reread at block `131696961` on November 5, 2026. Read mutable configuration before signing.

The suite uses the standard 1 billion-token, spacing-200, permanent-liquidity model. Its deployment configuration uses a 1% base swap fee split into creator/platform/referrer components of 50/30/20 bps, with a 99% opening total decreasing over 20 seconds. Existing pools retain their own frozen fee settings.

BNB is the zero-address native quote; WBNB is its separate routing wrapper. BSC USDC has 18 decimals, unlike six-decimal USDC on some other chains. Stock display units use each token's `uiMultiplier`; pool accounting always uses raw 18-decimal balances. Stock USD estimates use the underlying stock's reference price and the token's current conversion multiplier. Opening ticks are stored onchain and must be read independently of current USD estimates.

Owner and creator admin use the shared governance address `0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41`; treasury is `0x1cAa1962428382106Eb3f29B9719bdF797621C90`, and price updater is `0x8BF6eb1EaA9bE34a068c56945a36a23520705F29`. Read the factory for current administrative authority.

## X Layer mainnet

X Layer uses the same shared governance and fee-recipient addresses as the other chains.

| Setting | Value |
| - | - |
| Chain ID | `196` |
| Launch creation | Enabled |
| Registered paired assets | Native OKB, USDC, xETH and 45 wrapped stocks |
| Launch fee | 0.02 OKB (`20000000000000000` raw) |
| Token supply / tick spacing | 1 billion tokens with 18 decimals / `200` |
| Liquidity | Complete fixed supply in one permanent token-side range |
| Base swap fee / distribution | 1%; 50% creator, 30% platform, 20% valid referrer |
| Anti-sniping | 99% total decreasing to 1% over 20 seconds |
| Atomic Dev Buy | Native OKB funding into an OKB-paired pool; non-native pairs require an adapter with native-V3 support and an executable route |
| Governance owner / creator admin | `0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41` |
| Platform treasury | `0x1cAa1962428382106Eb3f29B9719bdF797621C90` |
| Restricted price updater | [`0x8BF6...5F29`](https://xlayerscan.com/address/0x8BF6eb1EaA9bE34a068c56945a36a23520705F29) |

X Layer pairs use native OKB, USDC, xETH or a supported wrapped stock. See the [X Layer stock catalog](https://docs.o1.exchange/launchpad/reference/xlayer-stock-quotes.json) for stock addresses and opening ticks, and the [deployment data](https://docs.o1.exchange/launchpad/reference/production-deployments.json) for paired-asset details.

OKB USD values use WOKB pricing on X Layer, independently of the pool's native-currency address. Opening ticks affect future launches; market prices and existing pool state evolve separately. There is no fixed-USD or other-chain price fallback.

Removing a quote from new creation does not change existing pools or their fee and claim currencies. See [X Layer contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#x-layer-mainnet).

## Elysium mainnet

Elysium uses the same shared governance and fee-recipient addresses as the other chains. Values below were read onchain on **November 4, 2026 (UTC)** at block **543,980**.

| Setting | Value |
| - | - |
| Chain ID | `99901` |
| Launch creation | Enabled |
| Registered paired assets | Native HYPE (18 decimals) and USDC (6 decimals) |
| Starting ticks / revisions | HYPE `-168800` / `1`; USDC `-400600` / `1` |
| Opening reference | FDV close to USD 4,000 |
| Launch fee | 0.025 HYPE (`25000000000000000` raw) |
| Token supply / tick spacing | 1 billion tokens with 18 decimals / `200` |
| Liquidity | Complete fixed supply in one permanent token-side range |
| Base swap fee / distribution | 1%; 50% creator, 30% platform, 20% valid referrer |
| Anti-sniping | 99% total decreasing to 1% over 20 seconds |
| Atomic Dev Buy | HYPE-funded into a HYPE pair; USDC-funded into a USDC pair |
| Launch-buy adapter | [`0x4991...b6d5`](https://elysium.kinetiq.xyz/address/0x49910381EEbDf07024E64591A4C2E8d118DDb6d5), bound to the Elysium SwapX router |
| SwapX router | Active, unpaused, zero router fee |
| Owner / creator admin | [`0x7bfb...BC41`](https://elysium.kinetiq.xyz/address/0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41) |
| Platform treasury | `0x1cAa1962428382106Eb3f29B9719bdF797621C90` |
| Restricted price updater | [`0x8BF6...5F29`](https://elysium.kinetiq.xyz/address/0x8BF6eb1EaA9bE34a068c56945a36a23520705F29) |
| Configuration version | `17` |

HYPE is the zero-address native quote. WHYPE (`0xbA876237B0F021A6c6D852d6c26E107997cC5E81`) is its separate routing wrapper, not another native balance. Elysium has no HYPE/USDC Uniswap v3 pool, so a USDC launch takes a USDC-funded Dev Buy only.

Removing a quote from new creation does not change existing pools or their fee and claim currencies. See [Elysium contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#elysium-mainnet).

## Tax configuration overview

The seven Tax configurations use the same owner/creator admin, protocol treasury, inclusive-tax policy and holder-authorized claims. Fees, paired assets, wrappers and custody exclusions remain chain-specific.

| Chain | Launch fee | Standard quotes | Tax quotes | Additional Dividend exclusions |
| - | - | - | - | - |
| Base | 0.001 ETH | 436 | 436 | 5 |
| Robinhood | 0.001 ETH | 196 | 196 | 4 |
| BSC | 0.003 BNB | 23 | 23 | 3 |
| Monad | 100 MON | 13 | 13 | 4 |
| X Layer | 0.02 OKB | 48 | 48 | 1 |
| Arc | 2 native USDC | 2 | 2 | 1 |
| Elysium | 0.025 HYPE | 2 | 2 | 1 |

Quote registrations, owner/creator-admin roles, creation status and native launch fees were verified on November 5, 2026 against both current factories on every chain. Matching addresses and decimals do not imply matching starting ticks: each factory has its own mutable ticks and revisions. Fee-policy and exclusion observations retain their separate dates below. Additional exclusions are separate from the mandatory exclusions built into each Dividend clone.

## Base Tax suite

Base Tax v2 uses its own factory, with the same governance owner, creator admin, protocol treasury and restricted price updater as the Standard v4 suites. The configuration is:

| Setting | Value |
| - | - |
| New Tax launches | **Enabled** |
| Native launch fee | **0.001 ETH**, excluding gas and any Dev Buy |
| Buy / sell tax bounds | **1% to 10%** each |
| Protocol share | **10% of the selected tax**, clamped to **0.5% to 1% of trading value** |
| Anti-sniping | Creator opt-in; **99% combined opening / 20 seconds** |
| Dividend holding floor | **10,000 tokens** for new dividend-enabled launches |
| Supply / decimals | **1,000,000,000 / 18** |
| Tick spacing | `200` |
| Owner / creator admin | [`0x7bfb...BC41`](https://basescan.org/address/0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41) |
| Protocol treasury | [`0x1cAa...1C90`](https://basescan.org/address/0x1cAa1962428382106Eb3f29B9719bdF797621C90) |
| Restricted price updater | [`0x8BF6...5F29`](https://basescan.org/address/0x8BF6eb1EaA9bE34a068c56945a36a23520705F29) |
| Paired assets | Supported crypto and Stock Tokens listed below |

Read the factory before preparing a transaction. The [configuration data](https://docs.o1.exchange/launchpad/reference/base-tax-suite.json) records the settings and their dated onchain observations.

The supported paired assets are:

* **Crypto:** ETH, USDC, cbBTC, cbDOGE, cbXRP, cbLTC, cbADA, cbMEGA, cbZEC, cbHYPE, VVV, AERO, MORPHO, Basecat, BLUECHIP, worth, BNKR and CLANKER.
* **Stocks:** 418 Stock Tokens in the Base catalog, updated November 24, 2026. See [Base Stock Tokens](https://docs.o1.exchange/launchpad/create/stock-paired-launches.md#base-stock-token-catalog) for the complete list and addresses. The Create page checks current availability for Standard or Tax automatically.

The onchain configuration snapshots retain their **November 10, 2026 verification at Base block 55,357,524**. The create page shows current availability; an optional Dev Buy also requires a working trading route.

The additional exclusions are Pancake Infinity Vault, Balancer V2 Vault, Balancer V3 Vault, Ekubo Core and O1Staking custody. All five were verified at Base block 51,779,077 on September 25, 2026. Mandatory exclusions such as the launch PoolManager are built into each clone and are not entries in that optional list. New defaults do not alter existing clones or identify every token-specific pool.

See [Base Tax contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#base-tax-contracts) and [`base-tax-suite.json`](https://docs.o1.exchange/launchpad/reference/base-tax-suite.json) for exact addresses, amounts, quote registrations and verification dates.

Factory settings govern future launches. Existing pools retain their frozen taxes, protocol and integrator recipients, Dividend threshold and anti-sniping settings. Creator rights and future creator payouts remain explicitly manageable. The creation switch does not pause existing trading or claims.

## Robinhood Tax suite

The deployed `robinhood-mainnet-tax-token-v2` uses the same inclusive policy as Base Tax v2. The configuration follows the shared owner, creator-admin, treasury and updater model used by Base Tax.

| Setting | Value |
| - | - |
| New Tax launches | **Enabled** |
| Native launch fee | **0.001 ETH**, excluding gas and any Dev Buy |
| Buy / sell tax bounds | **1% to 10%** each |
| Protocol share | **10% of the selected tax**, clamped to **0.5% to 1% of trading value** |
| Anti-sniping | Creator opt-in; **99% combined opening / 20 seconds** |
| Dividend holding floor | **10,000 tokens** for new dividend-enabled launches |
| Supply / decimals | **1,000,000,000 / 18** |
| Tick spacing | `200` |
| Owner / creator admin | [`0x7bfb...BC41`](https://robinhoodchain.blockscout.com/address/0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41) |
| Protocol treasury | [`0x1cAa...1C90`](https://robinhoodchain.blockscout.com/address/0x1cAa1962428382106Eb3f29B9719bdF797621C90) |
| Restricted price updater | [`0x8BF6...5F29`](https://robinhoodchain.blockscout.com/address/0x8BF6eb1EaA9bE34a068c56945a36a23520705F29) |
| Paired assets | ETH, USDG and the registered Robinhood Stock Tokens |

All **196 quote addresses and decimals** matched Standard minimal-v4 at Robinhood block **106,215,556** on November 5, 2026. Starting ticks differ for some assets. Use the selected factory's values in the [configuration data](https://docs.o1.exchange/launchpad/reference/robinhood-tax-suite.json); registration alone does not prove an optional native-funded Dev Buy route.

The additional Dividend exclusions are **Pancake Infinity Vault, O1Staking custody, Ekubo Core and Orvex Vault**. Exact addresses are in the snapshot. The Uniswap v4 PoolManager is already a mandatory exclusion in every clone; it does not need an additional default entry. Defaults apply only to future clones. Newly identified pools for existing tokens require a per-launch exclusion; unknown pools are not automatically detected.

Read the factory before preparing a transaction. The configuration data records configuration and dated onchain observations. See [Robinhood Tax contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#robinhood-tax-contracts).

## BSC Tax suite

The deployed `bsc-mainnet-tax-token-v2` uses the same inclusive policy as Base Tax v2. The configuration follows the shared owner, creator-admin, treasury and updater model used by Base Tax.

| Setting | Value |
| - | - |
| New Tax launches | **Enabled** |
| Native launch fee | **0.003 BNB**, excluding gas and any Dev Buy |
| Buy / sell tax bounds | **1% to 10%** each |
| Protocol share | **10% of the selected tax**, clamped to **0.5% to 1% of trading value** |
| Anti-sniping | Creator opt-in; **99% combined opening / 20 seconds** |
| Dividend holding floor | **10,000 tokens** for new dividend-enabled launches |
| Supply / decimals | **1,000,000,000 / 18** |
| Tick spacing | `200` |
| Owner / creator admin | [`0x7bfb...BC41`](https://bscscan.com/address/0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41) |
| Protocol treasury | [`0x1cAa...1C90`](https://bscscan.com/address/0x1cAa1962428382106Eb3f29B9719bdF797621C90) |
| Restricted price updater | [`0x8BF6...5F29`](https://bscscan.com/address/0x8BF6eb1EaA9bE34a068c56945a36a23520705F29) |
| Paired assets | BNB, Binance-Peg USDC and 21 registered bStocks |

All **23 quote addresses and decimals** matched BSC Standard minimal-v4 at block **131,696,961** on November 5, 2026. Starting ticks were read independently. Binance-Peg USDC and all 21 bStocks use **18 decimals**. Native BNB uses the zero address; WBNB is the routing wrapper, not a substitute quote address.

The additional Dividend exclusions are **Pancake Infinity Vault, Balancer V2 Vault and Ekubo Core**. The shared Uniswap v4 PoolManager is already a mandatory exclusion. Defaults apply to future clones only; existing clones need per-launch updates for newly identified pools. Excluding a router or factory does not exclude its pools, and unknown pools may still become eligible.

The [configuration data](https://docs.o1.exchange/launchpad/reference/bsc-tax-suite.json) contains quote addresses and starting ticks, exclusion addresses, adapter bindings and dated configuration observations. See [BSC Tax contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#bsc-tax-contracts).

## Monad Tax suite

The deployed `monad-mainnet-tax-token-v2` uses the same inclusive policy as Base Tax v2. The configuration follows the shared owner, creator-admin, treasury and updater model used by Base Tax.

| Setting | Value |
| - | - |
| New Tax launches | **Enabled** |
| Native launch fee | **100 MON**, excluding gas and any Dev Buy |
| Buy / sell tax bounds | **1% to 10%** each |
| Protocol share | **10% of the selected tax**, clamped to **0.5% to 1% of trading value** |
| Anti-sniping | Creator opt-in; **99% combined opening / 20 seconds** |
| Dividend holding floor | **10,000 tokens** for new dividend-enabled launches |
| Supply / decimals | **1,000,000,000 / 18** |
| Tick spacing | `200` |
| Owner / creator admin | [`0x7bfb...BC41`](https://monadvision.com/address/0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41) |
| Protocol treasury | [`0x1cAa...1C90`](https://monadvision.com/address/0x1cAa1962428382106Eb3f29B9719bdF797621C90) |
| Restricted price updater | [`0x8BF6...5F29`](https://monadvision.com/address/0x8BF6eb1EaA9bE34a068c56945a36a23520705F29) |
| Paired assets | MON, USDC, WETH and 10 wrapped xStocks |

All **three quote addresses and decimals** matched Monad Standard minimal-v4 at block **119,433,835** on November 5, 2026. Starting ticks were read independently. MON uses 18 decimals and the zero address; USDC uses 6 decimals; WETH uses 18 decimals. **WMON wraps native MON; WETH is a separate paired asset.** The 10 wrapped xStocks use 18 decimals and the same starting ticks as Standard; see the [Monad Stock Token catalog](https://docs.o1.exchange/launchpad/create/stock-paired-launches.md#monad-stock-token-catalog). Exact addresses, ticks and revisions are in the [snapshot](https://docs.o1.exchange/launchpad/reference/monad-tax-suite.json).

Additional Dividend exclusions are **Balancer V3 Vault, Ekubo Core, Kuru MarginAccount and Clober BookManager**. The Uniswap v4 PoolManager is mandatory separately. Defaults apply only to future clones; existing tokens require per-launch exclusion updates. Unknown pools are not automatically detected.

Monad uses the [shared governance addresses](https://docs.o1.exchange/launchpad/reference/production-contracts.md#governance-and-fee-recipient). See [Monad Tax contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#monad-tax-contracts).

## X Layer Tax suite

The deployed `xlayer-mainnet-tax-token-v2` uses the same inclusive policy as Base Tax v2. The configuration follows the shared owner, creator-admin, treasury and updater model used by Base Tax.

| Setting | Value |
| - | - |
| New Tax launches | **Enabled** |
| Native launch fee | **0.02 OKB**, excluding gas and any Dev Buy |
| Buy / sell tax bounds | **1% to 10%** each |
| Protocol share | **10% of the selected tax**, clamped to **0.5% to 1% of trading value** |
| Anti-sniping | Creator opt-in; **99% combined opening / 20 seconds** |
| Dividend holding floor | **10,000 tokens** for new dividend-enabled launches |
| Supply / decimals | **1,000,000,000 / 18** |
| Tick spacing | `200` |
| Owner / creator admin | [`0x7bfb...BC41`](https://xlayerscan.com/address/0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41) |
| Protocol treasury | [`0x1cAa...1C90`](https://xlayerscan.com/address/0x1cAa1962428382106Eb3f29B9719bdF797621C90) |
| Restricted price updater | [`0x8BF6...5F29`](https://xlayerscan.com/address/0x8BF6eb1EaA9bE34a068c56945a36a23520705F29) |
| Paired assets | OKB, USDC, xETH and 45 registered wrapped stocks |

Both X Layer factories had **48 registered quotes** at block **75,058,724** on November 5, 2026: native OKB, USDC, xETH and 45 wrapped stocks. Native OKB uses 18 decimals and the zero address; USDC uses 6 decimals; xETH and the registered wrapped stocks use 18 decimals. **WOKB wraps OKB; xETH is a separate quote.** The [Tax snapshot](https://docs.o1.exchange/launchpad/reference/xlayer-tax-suite.json) records its own starting ticks and revisions.

**Balancer V3 Vault** is the additional Dividend default exclusion. The launch PoolManager is mandatory separately. Defaults apply to future clones; newly identified pools for existing tokens require per-launch updates.

The [SwapX router](https://docs.o1.exchange/launchpad/reference/production-contracts.md#swapx-router-upgrade-review) admits both minimal-v4 and Tax Hooks. See [X Layer Tax contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#x-layer-tax-contracts) for contract identities.

## Arc Tax suite

`arc-mainnet-tax-token-v2` uses the inclusive policy and fee-accrual model with Arc-specific ERC-20 reward payments. The settings follow the shared governance pattern:

| Setting | Value |
| - | - |
| New Tax launches | **Enabled** |
| Native launch fee | **2 native USDC**, excluding gas and any Dev Buy |
| Buy / sell tax bounds | **1% to 10%** each |
| Protocol share | **10% of the selected tax**, clamped to **0.5% to 1% of trading value** |
| Anti-sniping | Creator opt-in; **99% combined opening / 20 seconds** |
| Dividend holding floor | **10,000 tokens** for new dividend-enabled launches |
| Supply / decimals | **1,000,000,000 / 18** |
| Tick spacing | `200` |
| Owner / creator admin | [`0x7bfb...BC41`](https://explorer.arc.io/address/0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41) |
| Protocol treasury | [`0x1cAa...1C90`](https://explorer.arc.io/address/0x1cAa1962428382106Eb3f29B9719bdF797621C90) |
| Restricted price updater | [`0x8BF6...5F29`](https://explorer.arc.io/address/0x8BF6eb1EaA9bE34a068c56945a36a23520705F29) |
| Paired assets | USDC and cirBTC |

Arc native USDC has 18 decimals; its ERC-20 interface has six and exposes the same balance. The launch fee is `2000000000000000000` native units. Starting ticks are `-400600` for USDC and `-467200` for cirBTC. There is no separate wrapped USDC. Dividend payments and USDC contributions use six-decimal ERC-20 units; cirBTC rewards use eight. Do not sum native and ERC-20 USDC balances. Arc Tax's optional anti-sniping differs from the Standard suite's zero-surcharge setting.

Quote registration was reread on November 5, 2026 at block **29,561,700**. The Vault exclusion, `0x238a358808379702088667322f80aC48bAd5e6c4`, was verified at block **23,158,561** on September 28, 2026. Its pooled-custody identity was reviewed; this is not a claim of an official Pancake deployment on Arc. The launch PoolManager is a separate mandatory exclusion. Defaults apply only to future clones; unknown/token-specific pools require separate review.

See [Arc Tax contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#arc-tax-contracts) and the [snapshot](https://docs.o1.exchange/launchpad/reference/arc-tax-suite.json) for exact identities and separately dated onchain observations.

## Elysium Tax suite

The deployed `elysium-mainnet-tax-token-v2` uses the same inclusive policy as Base Tax v2. The configuration follows the shared owner, creator-admin, treasury and updater model used by Base Tax. Values were read onchain on **November 4, 2026 (UTC)** at block **543,980**.

| Setting | Value |
| - | - |
| New Tax launches | **Enabled** |
| Native launch fee | **0.025 HYPE**, excluding gas and any Dev Buy |
| Buy / sell tax bounds | **1% to 10%** each |
| Protocol share | **10% of the selected tax**, clamped to **0.5% to 1% of trading value** |
| Anti-sniping | Creator opt-in; **99% combined opening / 20 seconds** |
| Dividend holding floor | **10,000 tokens** for new dividend-enabled launches |
| Supply / decimals | **1,000,000,000 / 18** |
| Tick spacing | `200` |
| Owner / creator admin | [`0x7bfb...BC41`](https://elysium.kinetiq.xyz/address/0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41) |
| Protocol treasury | [`0x1cAa...1C90`](https://elysium.kinetiq.xyz/address/0x1cAa1962428382106Eb3f29B9719bdF797621C90) |
| Restricted price updater | [`0x8BF6...5F29`](https://elysium.kinetiq.xyz/address/0x8BF6eb1EaA9bE34a068c56945a36a23520705F29) |
| Paired assets | HYPE and USDC |
| Configuration version | `16` |

HYPE uses 18 decimals and the zero address; USDC uses 6 decimals. Starting ticks are `-168800` for HYPE and `-400600` for USDC, both at revision `1`. **WHYPE wraps HYPE**; the app pays native HYPE rewards, and direct integrations can request wrapped payment.

The **Elysium SwapX router proxy** `0x37DfD6117fcf065eda0B55D8547A78F8B2221987` is the additional Dividend default exclusion. The launch PoolManager is mandatory separately. Defaults apply to future clones; newly identified pools for existing tokens require per-launch updates.

See [Elysium Tax contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#elysium-tax-contracts) and the [snapshot](https://docs.o1.exchange/launchpad/reference/elysium-tax-suite.json) for exact identities and the dated readback.

## Base \$O launches

**\$O launches** use a separate Base Factory and burn wstO trading fees. The settings are:

| Setting | Value |
| - | - |
| Suite / chain | `base-mainnet-wsto-burn-v1` / Base `8453` |
| Creation | Enabled |
| Owner / creator admin | `0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41` |
| Restricted price updater | `0x8BF6eb1EaA9bE34a068c56945a36a23520705F29` |
| Paired asset | Registered wstO, 18 decimals |
| Buy / sell burn defaults | 1% / 1%; each launched pool freezes its rates |
| Permitted future defaults | 0% through 99% per side, six percentage decimals |
| Creation fee / LP fee | None / zero |
| Anti-sniping / recipient allocations | None |
| Launched supply / decimals | 1,000,000,000 / 18 |
| Tick spacing | `200` |
| Opening price | Managed from \$O reference pricing and the current vault conversion; read the registered tick and revision before preparing a launch |
| Atomic Dev Buy | ETH via USDC, \$O and the vault, or held wstO through the attached adapter |
| Creator-facing fee controls | None; review the Factory burn defaults |

The website uses ETH for Dev Buy. The Public API also supports held wstO. Both support ETH, USDC, \$O and wstO for token-page or API trading. See [API funding and settlement](https://docs.o1.exchange/launchpad/integration/wsto.md#public-api).

wstO is backed by \$O at a changing vault conversion rate. Its opening valuation must use that share value and the registered tick, not assume one wstO equals one \$O. Tick updates affect future launches, not existing pools. Reserve capacity, vault conversion and external pool liquidity must also permit the requested transaction.

See [contracts and governance](https://docs.o1.exchange/launchpad/reference/production-contracts.md#base-wsto-contracts) and [`base-wsto-suite.json`](https://docs.o1.exchange/launchpad/reference/base-wsto-suite.json). The other tables on this page describe Standard or Tax and do not add their launch fees, treasury or reward settings to wstO.

## Robinhood \$O launches

Robinhood uses the same burn-only launch model as Base, with its own vault and USDG acquisition route.

| Setting | Value |
| - | - |
| Suite / chain | `robinhood-mainnet-wsto-burn-v1` / Robinhood `4663` |
| Creation | Enabled |
| Paired asset | Registered Robinhood wstO, 18 decimals |
| Buy / sell burn defaults | 1% / 1%; each launched pool freezes its rates |
| Permitted future defaults | 0% through 99% per side, six percentage decimals |
| Creation fee / LP fee | None / zero |
| Anti-sniping / recipient allocations | None |
| Launched supply / decimals | 1,000,000,000 / 18 |
| Tick spacing | `200` |
| Opening price | \$O reference price and the Robinhood vault conversion; read the current registered tick and revision |
| Atomic Dev Buy | ETH via WETH/USDG v3, \$O/USDG v4 and the vault, or held wstO |
| Creator-facing fee controls | None; review the Factory burn defaults |
| Restricted price updater | `0x8BF6eb1EaA9bE34a068c56945a36a23520705F29` |

The website uses native ETH for Dev Buy; the Public API also accepts held wstO. Token-page and API trading support ETH, USDG, \$O and wstO in both directions. USDG has six decimals; the other route assets have 18. Acquisition costs and transaction gas are separate from the launch-pool burn.

The October 8 readback at block **83,108,272** recorded configuration version `10`, quote revision `1` and starting tick `-117400`. These are dated values, not constants for future preparations. Base and Robinhood vault conversions can differ; do not copy a starting tick or assume bridge-driven price equality. Existing pools retain their launch-time burn rates and are not repriced by later opening-tick updates.

See [Robinhood contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#robinhood-wsto-contracts) and [the dated snapshot](https://docs.o1.exchange/launchpad/reference/robinhood-wsto-suite.json). The Factory's live role reads determine governance authority. Full-route simulation checks external liquidity, vault conversion, output protection and settlement inventory independently.

## Launchpad of Launchpads configuration overview

[Launchpad of Launchpads](https://docs.o1.exchange/launchpad/launchpads/overview.md) runs on Base and Robinhood. Each chain has its own registry, vaults and child Tax suite. Both chains use the same values and the shared governance owner and treasury.

| Chain | Registration fee | Child launch fee | Child paired assets | Reserved URLs |
| - | - | - | - | - |
| Base | 0.001 ETH | 0.001 ETH | 15 | 13 |
| Robinhood | 0.001 ETH | 0.001 ETH | 2 | 13 |

The snapshots read both registries and child factories on October 9, 2026, at Base block `52,397,241` and Robinhood block `84,498,331`. The snapshots give no evidence that any role address is a multisig or a timelock. The burn destination is the fixed dead address `0x000000000000000000000000000000000000dEaD`.

Both registries reserve the same 13 URLs: `admin`, `analytics`, `api`, `app`, `create`, `docs`, `o1-exchange`, `o1exchange`, `official`, `staging`, `swap`, `trade` and `www`. Nobody can register a reserved URL.

## Base Launchpad of Launchpads suite

The deployed child suite `base-mainnet-pads-20261006` and the registry `0x0126...f9Ee` use the shared owner, treasury and updater model. The settings are:

| Setting | Value |
| - | - |
| New launchpads | **Open** |
| New token launches on launchpads | **Enabled** |
| Registration fee | **0.001 ETH**, excluding gas and any Dev Buy |
| Child launch fee | **0.001 ETH**, excluding gas and any Dev Buy |
| Buy / sell tax bounds | **1% to 10%** each |
| Protocol share | **10% of the selected tax**, clamped to **0.5% to 1% of trading value** |
| Anti-sniping | Creator opt-in; **99% combined opening / 20 seconds** |
| Dividend holding floor | **10,000 tokens** for new dividend-enabled launches |
| Supply / decimals | **1,000,000,000 / 18** |
| Tick spacing | `200` |
| Owner share | **50%** of vault income. The registry bounds are 0% to 100% |
| Default launchpad share | **10%** of the tax remainder, set by the app |
| Burn amount | **100,000 launchpad tokens** |
| Owner allowlist | **Off** |
| Reserved URLs | **13**, listed in the [overview](#launchpad-release-overview) |
| Registry owner, guardian, threshold setter and allowlist manager | [`0x7bfb...BC41`](https://basescan.org/address/0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41) |
| Child factory owner / creator admin | [`0x7bfb...BC41`](https://basescan.org/address/0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41) |
| Registration fee and protocol treasury | [`0x1cAa...1C90`](https://basescan.org/address/0x1cAa1962428382106Eb3f29B9719bdF797621C90) |
| Restricted price updater | [`0x8BF6...5F29`](https://basescan.org/address/0x8BF6eb1EaA9bE34a068c56945a36a23520705F29) |
| Paired assets | The Base crypto assets listed below |

Read the registry and the factory before you prepare a transaction. The [configuration data](https://docs.o1.exchange/launchpad/reference/base-launchpad-suite.json) records these settings with its dated onchain observations.

The supported paired assets are:

* **Crypto:** ETH, USDC, cbBTC, cbDOGE, cbXRP, cbLTC, cbADA, cbMEGA, cbZEC, cbHYPE, VVV, AERO, MORPHO, Basecat and BLUECHIP.

The snapshot confirms quote registration on **October 9, 2026 at Base block 52,397,241**. The child factory listed all 15 assets at revision `1`. It did not list wstO. At that block, `0x5519...044D` held the registry owner and the child factory owner roles; `0x7bfb...BC41` holds them now (see [governance](#governance-readback)). Registration does not prove pool liquidity or an executable route.

The additional Dividend exclusions are Pancake Infinity Vault, Balancer V2 Vault, Balancer V3 Vault, Ekubo Core, O1Staking custody and the earlier launchpad registry. Each clone also has mandatory exclusions, for example the launch PoolManager. New defaults do not change existing clones.

See [Base Launchpad of Launchpads contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#base-launchpad-contracts) and [`base-launchpad-suite.json`](https://docs.o1.exchange/launchpad/reference/base-launchpad-suite.json) for exact addresses, amounts, quote registrations and verification dates.

Registry and factory settings govern future launchpads and launches. Existing pools keep their frozen taxes, launchpad share and integrator. The owner share of an existing launchpad does not change. No pause stops trading, owner claims or burn claims.

## Robinhood Launchpad of Launchpads suite

The deployed child suite `robinhood-mainnet-pads-20261009` and the registry `0x4bFa...3B5F` use the shared owner, treasury and updater model. The settings are:

| Setting | Value |
| - | - |
| New launchpads | **Open** |
| New token launches on launchpads | **Enabled** |
| Registration fee | **0.001 ETH**, excluding gas and any Dev Buy |
| Child launch fee | **0.001 ETH**, excluding gas and any Dev Buy |
| Buy / sell tax bounds | **1% to 10%** each |
| Protocol share | **10% of the selected tax**, clamped to **0.5% to 1% of trading value** |
| Anti-sniping | Creator opt-in; **99% combined opening / 20 seconds** |
| Dividend holding floor | **10,000 tokens** for new dividend-enabled launches |
| Supply / decimals | **1,000,000,000 / 18** |
| Tick spacing | `200` |
| Owner share | **50%** of vault income. The registry bounds are 0% to 100% |
| Default launchpad share | **10%** of the tax remainder, set by the app |
| Burn amount | **100,000 launchpad tokens** |
| Owner allowlist | **Off** |
| Reserved URLs | **13**, listed in the [overview](#launchpad-release-overview) |
| SwapX router approval of the child hook | **Approved** |
| Registry owner, guardian, threshold setter and allowlist manager | [`0x7bfb...BC41`](https://robinhoodchain.blockscout.com/address/0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41) |
| Child factory owner / creator admin | [`0x7bfb...BC41`](https://robinhoodchain.blockscout.com/address/0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41) |
| Registration fee and protocol treasury | [`0x1cAa...1C90`](https://robinhoodchain.blockscout.com/address/0x1cAa1962428382106Eb3f29B9719bdF797621C90) |
| Restricted price updater | [`0x8BF6...5F29`](https://robinhoodchain.blockscout.com/address/0x8BF6eb1EaA9bE34a068c56945a36a23520705F29) |
| Paired assets | The Robinhood crypto assets listed below |

Read the registry and the factory before you prepare a transaction. The [configuration data](https://docs.o1.exchange/launchpad/reference/robinhood-launchpad-suite.json) records these settings with its dated onchain observations.

The supported paired assets are:

* **Crypto:** ETH and USDG.

The snapshot confirms quote registration on **October 9, 2026 at Robinhood block 84,498,331**. The child factory listed both assets at revision `1`. It did not list wstO. The SwapX router approved the child hook. A launchpad token trade also needs wstO settlement inventory. See [settlement reserve](https://docs.o1.exchange/launchpad/integration/wsto.md#settlement-reserve). Registration does not prove pool liquidity or an executable route.

The additional Dividend exclusions are Pancake Infinity Vault, O1Staking custody, Ekubo Core and Orvex Vault. Each clone also has mandatory exclusions, for example the launch PoolManager. New defaults do not change existing clones.

See [Robinhood Launchpad of Launchpads contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#robinhood-launchpad-contracts) and [`robinhood-launchpad-suite.json`](https://docs.o1.exchange/launchpad/reference/robinhood-launchpad-suite.json) for exact addresses, amounts, quote registrations and verification dates.

Registry and factory settings govern future launchpads and launches. Existing pools keep their frozen taxes, launchpad share and integrator. The owner share of an existing launchpad does not change. No pause stops trading, owner claims or burn claims.

## Verification history

The active contracts and mutable configuration were checked onchain on **September 2, 2026** at Base block `50,751,475` and Robinhood block `51,982,726`. Paired-asset registrations and launch settings were reread on **September 5, 2026** at Base block `50,902,528` and Robinhood block `54,953,301`.

Factory economics and governance were refreshed on **September 10, 2026** at Base block `51,134,060` and Robinhood block `59,543,669`. Their configuration versions were `13` and `14`; the fee settings were unchanged. Those earlier checks remain historical. The current registered-quote lists were refreshed on **November 5, 2026 (UTC+05:30)** for both current factories on every chain. Base was last updated on **November 24, 2026 (UTC+05:30)**. Machine-readable observations retain their exact UTC timestamps:

| Chain | Read block | Standard registered | Tax registered |
| - | -: | -: | -: |
| Base | 61,755,941 | 436 | 436 |
| Robinhood | 106,215,556 | 196 | 196 |
| BSC | 131,696,961 | 23 | 23 |
| Monad | 119,433,835 | 3 | 3 |
| X Layer | 75,058,724 | 48 | 48 |
| Arc | 29,561,700 | 2 | 2 |
| Elysium | 564,278 | 2 | 2 |

On **November 5, 2026** every current factory and both launchpad registries were read for their roles at one pinned block per chain. Owner and creator admin are `0x7bfb67CD4278838E20e29FC9Fe05DAD63D0BBC41` on all 18 factories (Standard, Tax and \$O on each chain, plus the Base and Robinhood Launchpad of Launchpads child factories), with no pending transfer. The same address holds the registry owner, guardian, threshold setter and allowlist manager roles on both launchpad registries. Earlier readbacks that show `0x5519...044D` are historical.

| Chain | Read block | Factories read |
| - | -: | -: |
| Base | 53,517,648 | 4 |
| Robinhood | 106,185,145 | 4 |
| BSC | 131,690,028 | 2 |
| Monad | 119,423,513 | 2 |
| X Layer | 75,055,603 | 2 |
| Arc | 29,555,506 | 2 |
| Elysium | 544,915 | 2 |

The per-factory values are in `governanceReadback` in [`production-deployments.json`](https://docs.o1.exchange/launchpad/reference/production-deployments.json). The address is not described here as a multisig or timelock.

The review scanned registration events from each factory's deployment and checked registration, decimals, starting ticks and revisions at the listed block. It does not establish liquidity or executable routes for every asset. Historical suites and their original snapshots are unchanged.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.