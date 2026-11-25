> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Interface and data flow

> How the o1 Launchpad home, create, token, and profile pages connect wallet actions with live and indexed chain data.

The o1 Launchpad interface combines wallet-signed actions, live contract reads, Uniswap v4 market data, public token profiles, and confirmed chain events. The blockchain remains authoritative for tokens, pools, balances, fees, and ownership.

## Main pages

| Page | What users can do |
| - | - |
| Home | Discover launches, switch between All, Crypto, and available Stocks views, view **Trending now**, sort by trending, newest, liquidity, or 24-hour volume, and filter by paired asset |
| Create | Choose Standard, Tax or \$O launches, configure token identity, paired asset, public profile, and profile-editing preference, preview the result, and sign the launch transaction |
| Token | Review the token and creator, view the chart and market statistics, trade, inspect holders, read announcements, add comments, and use product-specific fee, dividend or burn actions |
| Profile | View a creator's launches and public identity; connected owners can edit their o1 profile, claim fees, claim Tax dividends, review Standard referrals, and manage supported token profile or announcement features |

**Trending now** is a discovery view based on indexed market activity. Ranked views also require adequate pool coverage and current market data, and placement is dynamic. They are not recommendations or guarantees of future performance.

Global search works across supported chains and accepts a token name, symbol, creator address, or token address. Results can be scoped to crypto-paired or stock-paired markets and filtered by paired asset. Base, Robinhood, BSC, Monad and X Layer have published stock catalogs; only assets registered on the selected chain's live factory are available for new creation. Monad has crypto and stock markets with MON/USDC/WETH and wrapped xStock filters, and the same chain-scoped Trending, Volume, New and Liquidity feeds. Token pages expose transactions, holders, fees and updates; allocations depend on launch data, and staking requires a chain deployment. Public availability and data completeness depend on deployed indexer and provider coverage. Indexed historical data remains chain-scoped. A creator's signed o1 profile, including its display name, bio, avatar, and socials, is separate from the optional onchain token profile permission chosen for each launch.

## Discovery and transparency

The current interface adds context around the onchain market without replacing it as the source of truth:

* homepage statistics distinguish activity in official launch pools from tracked activity across other pools for o1-launched tokens;
* Trending now and ranked feeds use current market activity, liquidity, pool-coverage checks, and data freshness;
* stock-paired rows show the selected Stock Token and its provider label;
* token charts can mark launch start, creator or connected-wallet trades, and announcements;
* holder rows label known launch infrastructure, liquidity pools, exchanges, DeFi contracts, the creator, and the connected wallet when data is available;
* every token page carries a safety notice to review liquidity, live sell quotes, and holders before trading.

Discovery labels and third-party identity enrichment are informational. Contract addresses, balances, pools, and confirmed events remain authoritative.

## Token creation flow

**1. Configure and preview**

The creator enters the token identity, socials, paired asset, and profile-editing preference. The page previews the fixed supply, opening value, current creation fee, and permanent pool.

**2. Review the launch**

The o1 confirmation screen shows the paired asset, supply, permanent liquidity, current creation fee, profile permission, and the token address preview.

**3. Prepare and sign**

After the creator confirms the review, the interface stores the public token profile on IPFS and refreshes the selected pair, active launch contracts, settings, and chain time. Base and Robinhood use a separate factory for each product. Standard and Tax each share their factory across crypto and stock routes; \$O launches use the wstO-paired route. The creator then confirms the launch transaction in their wallet.

**4. Open the token page**

After confirmation, the token page presents the new token, live Uniswap market, trades, holders, and public announcements.

The wallet is the only signing surface. o1's interface and data services never hold the user's private key.

## Shared creator-fee flow

For a fee-sharing launch, the token and vault are created in one transaction. The launching wallet, fee vault and creator fee wallet are shown separately because they have different roles. The token's Fees tab shows the split; Profile shows your creator earnings and X fee shares.

Confirmed launches, X registrations, payouts and creator-position changes update the displayed information. A handover changes the current creator fee wallet without changing the original launching wallet or the former creator's earlier earnings. X usernames are display labels; the permanent X ID determines who owns a share.

Before you register or claim, the app checks the onchain account link, ownership and available fees. Recent transactions can take a short time to appear. If a transaction is pending, check its status before submitting another one; a page refresh does not cancel it.

See [Share creator fees](https://docs.o1.exchange/launchpad/trading/share-creator-fees.md) for the user flow and [security](https://docs.o1.exchange/launchpad/security.md#x-linked-fee-vault-boundaries) for the account and verification requirements.

## Trading flow

The token page asks Uniswap v4 for a quote based on how much the trader wants to spend or sell. The interface applies the selected slippage limit and a route-specific deadline, then asks the wallet to submit the exact reviewed transaction through the chain's configured router. X Layer uses SwapX.

> [tab] Paying with native currency
>
> The wallet includes native currency in the swap transaction, including OKB on X Layer. No token approval is needed for native input.

> [tab] Paying with a token
>
> The wallet approves the spender required by the selected route. X Layer swaps approve the SwapX proxy directly; Permit2 is used only by routes that require it. The submitted swap uses the reviewed amount and minimum output.

The flow supports a public trade comment. Standard swaps can also carry financial referral attribution; inclusive Tax swaps use frozen launch-time integrator attribution instead. o1 always submits input-amount swaps, so its normal buy and sell flow remains available during the opening anti-snipe period.

### Trade safeguards

| Setting | Current interface behavior |
| - | - |
| Automatic slippage | 5% |
| Quick choices | 1%, 3%, or 10% |
| High-slippage handling | Warns at 10% or higher and prevents submission at 50% |
| Price impact | Warns at 5% or higher and marks 25% or higher as very high |
| Swap deadline | 4 minutes for SwapX or 10 minutes for Universal Router, set during transaction preparation |

## Standard referral journey

* A profile's **Referral** action copies a global referral link.
* A token page's **Referral link** action copies a link for that token and chain.
* A public **Profile** link is separate and does not set attribution by itself.
* Token-specific attribution takes priority for that token. A previously saved global attribution is the fallback.
* The interface may request one gasless signature to associate a browser-saved global referral with a connected wallet.

See [Fees, anti-snipe, and referrals](https://docs.o1.exchange/launchpad/trading/fees-referrals.md) for the full precedence and validation rules.

## Tax rewards and burns

Tax labels identify the product in discovery and token views. The token's ordinary buy/sell taxes and any current surcharge are separate concepts: the current execution rate may be higher during enabled anti-sniping. The trade quote includes the applicable fees.

**Fees** and **Dividends** are separate. Dividend views show claimable rewards, total earned, minimum holding and rewards claimed. Trading assigns rewards automatically; **Claim all** claims one group of payable earnings on the displayed profile page per transaction. When no holders qualify as a trade's dividend fee is recorded, that portion becomes a protocol fee credit, with separate source attribution. See [Holder dividends](https://docs.o1.exchange/launchpad/tax/dividends.md).

The burn section shows tokens collected through the creator's burn allocation and ready to send to the dead address. Balances refresh after confirmed transactions, including actions made through another interface. Trades in unrelated pools do not automatically contribute to these taxes.

## \$O launches and market data

\$O launch labels identify wstO-paired tokens in discovery. Their Create flow uses ETH for optional Dev Buy. Token-page buys and sells can settle in ETH, USDC on Base or USDG on Robinhood, \$O or wstO when an executable route is available; the pool itself stays paired with wstO. There are no fee-allocation, dividend-claim or manual-burn controls for this product.

The token page's **Total wstO burned** aggregates confirmed fee burns from that launch pool only. It does not sum all suite pools or infer burns from the global token supply. Canonical `QuoteBurned` and `Trade` events are matched once; retries and overlapping receipt collection must not create extra burns. Same-transaction creation and Dev Buy are indexed together, with the creator attributed from the complete receipt. Robinhood acquisition-pool v4 logs must not be counted as launch-pool trades; match the exact pool ID and suite Hook.

wstO's displayed USD price is a reference derived from \$O's reference price and the current vault conversion on the selected chain. It is not a guaranteed trade price. Its supply is an onchain token read. Liquidity, top-market and holder estimates depend on provider coverage; unavailable data must not be interpreted as zero. A launch pool's own price and executable swap quote remain distinct from the paired asset's reference valuation.

## Live and indexed information

| Source | Used for |
| - | - |
| Launch contracts | Current launch settings, fee balances, and creator permissions |
| Uniswap v4 | Pool price, swap quotes, liquidity state, and transaction simulation |
| Confirmed chain events | Launches, trades, claims, announcements, and profile updates |
| IPFS | Public token image and profile document |
| Indexed application data | Search, feeds, charts, holder views, histories, and wallet dashboards |

The indexer keeps the contracts used by both earlier and current launches queryable, while the create flow selects exactly one active factory for the chosen chain, product and market type. Public visibility is separate from indexing: historical index-only Tax entries continue to be indexed without appearing in public views or transaction preparation. Other supported historical markets retain their normal visibility.

Trade attribution uses the confirmed receipt and router context so smart-wallet activity is associated with the correct trader. The hook's `Trade.executor` field alone is not treated as a user-wallet identity.

After a transaction confirms, a page may briefly show that it is syncing while the indexed view updates. Live contract state and confirmed chain events remain the source of truth.

BSC uses the same chain-scoped feed, creation, token and claim model, with BNB, USDC and the published bStock catalog. Chain visibility and the onchain creation switch remain separate. Canonical event collection provides launch/trade/fee completeness; stock reference prices and crypto-provider enrichment do not replace that collection.

X Layer uses the same chain-scoped feeds, search, profiles, token activity and fee projections. Canonical range collection and reconciliation own launch/trade/fee completeness; webhook and receipt hints trigger refresh rather than creating duplicate trades. Supported quotes are native OKB, USDC, xETH and 45 wrapped stocks. Crypto USD metrics use same-chain Codex prices, with WOKB as the native OKB pricing identity. Stock references use TickDB market data with wrapper conversion applied once. Quote amounts retain their exact token units before USD valuation: six decimals for USDC and 18 for the other quotes. External all-pool analytics are collected separately; partial coverage must not hide other chains' available totals.

Elysium uses the same chain-scoped feeds, search, profiles, token activity and fee projections. Its indexing uses canonical range collection plus a QuickNode contract-events webhook, starting at each suite's first block (Standard `307804`, Tax `330297`). As on X Layer, webhook and receipt hints trigger refresh rather than creating duplicate trades. Supported quotes are native HYPE and USDC, with six decimals for USDC and 18 for HYPE.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.