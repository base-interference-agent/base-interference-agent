> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# How it works

> The complete o1 Launchpad lifecycle from setup and token creation to trading, fee claims, announcements, and staking.

Creators use the o1 interface to configure a token and approve the launch transaction in their wallet. The launch contracts create the token and its Uniswap market together. The creator pays the selected launch product’s creation fee plus network gas. The blockchain is the source of truth, while o1 organizes confirmed public data so launches, trades, fees, holders, and announcements are easy to view.

## End-to-end lifecycle

**1. Configure the launch**

The creator chooses Standard, Tax or \$O launches, then supplies a name, symbol, image, paired asset, optional links and a profile-editing preference. Tax launches also configure their taxes, allocations, dividend threshold and anti-sniping choice. \$O launches use the displayed Factory burn rates without fee-allocation controls.

**2. Review the launch**

The o1 confirmation screen presents the paired asset, fixed supply, permanent liquidity, current creation fee, profile permission, and the token address preview.

**3. Prepare current settings**

After the creator confirms the review, the app stores the token image and public profile on IPFS, includes that metadata link in the launch request, and refreshes the selected paired asset, creation fee, supply, liquidity settings, and current chain time.

**4. Sign the launch**

The creator approves the launch transaction and pays any displayed creation fee plus the chain's network gas. Base and Robinhood Standard/Tax use a 0.001 ETH fee. \$O launches on Base and Robinhood have no creation fee. Monad charges 100 MON, Arc charges 2 native USDC, BSC charges 0.003 BNB, X Layer charges 0.02 OKB, and Elysium charges 0.025 HYPE.

**5. Create the token**

Base Standard creates a native B20 token with no administrator; Base Tax and \$O create fixed-supply ERC-20s. On Robinhood, Monad, Arc, BSC, X Layer and Elysium, o1 creates a fixed-supply ERC-20 with no owner or additional minting function. The fixed 1 billion supply is created once.

**6. Open permanent liquidity**

The launch contracts open the Uniswap v4 pool at the configured starting price and place the complete fixed supply into permanent liquidity.

**7. Optionally execute the Dev Buy**

When the creator explicitly enables it, the Base, Robinhood, Monad, Arc, BSC, X Layer or Elysium launch contracts execute one protected purchase in the same transaction, funded with native currency (or, on an Elysium USDC pair, with USDC). The toggle is off by default, and a failed purchase reverts the complete launch.

**8. Open the launch page**

After confirmation, the launch page shows the token profile, live market, trading interface, trades, holders, and announcements.

**9. Optionally use staking**

Wallet-held tokens may be deposited into a separate compatible staking vault. A launch does not create a vault automatically, and vault creation remains an independent permissionless transaction.

## Where each asset lives

| Asset | Location | Who can move it |
| - | - | - |
| Initial token supply | Seeded into the permanent Uniswap liquidity position | Trading moves tokens between the pool and wallets; the launch position itself cannot be removed |
| Staked wallet tokens | The separate staking contract | The participant can withdraw principal according to the selected vault's fixed policy |
| Creation fee | Paid to the configured fee recipient in the launch transaction | The creator's wallet pays the exact live fee shown before signing |
| Accrued swap fees | A dedicated claimable balance for each recipient | Standard creator/platform/referrer, or Tax creator/protocol/integrator, according to the launch configuration |
| Tax dividends | Rewards earned as trades happen | Eligible holders claim their earned share |
| Tax collected burn tokens | Held until someone burns them | Anyone may send them to the dead address; no payment to the caller |
| \$O launch wstO fee | Collected and burned by the Hook during each successful swap | Actual wstO supply reduction, with no claim or later burn action |
| \$O backing wstO | The separate wstO vault | Vault redemptions return underlying; fee-only burns leave it there |
| User trade funds | The user's wallet and the Uniswap pool during the trade | The transaction approved by the user |

## Swap lifecycle

**1. Review the trade**

The interface shows the input amount, estimated output, minimum received, price impact, current fee, slippage limit, and estimated network fee. It automatically applies a short, route-specific transaction deadline.

**2. Sign with the wallet**

The wallet submits a trade for the amount the user chose to spend or sell.

**3. Apply pool and fee logic**

Uniswap calculates the result and the Hook applies the launch's fees. Standard fees and Tax protocol/creator/dividend/integrator credits use the paired asset. A Tax burn allocation uses launched tokens. The \$O launch Hook instead burns wstO quote fees immediately.

**4. Settle the swap**

The user receives the trade output. Ordinary recipient fees become claimable independently. Tax dividends are assigned to eligible holders during the trade; collected burn tokens can be sent to the dead address separately.

Trading begins immediately. o1 uses input-amount swaps for both buys and sells: the trader chooses how much to spend or sell, and the interface protects the minimum amount received with a slippage limit. These swaps remain available while the anti-snipe fee decreases. New Arc Standard launches have no anti-snipe surcharge and pay the normal 1% fee from launch. The documented Standard settings on Base, Robinhood, Monad, BSC, X Layer and Elysium use a 20-second schedule. Tax on Base, Robinhood, BSC, Monad, X Layer, Arc and Elysium has creator opt-in and declines toward its own buy or sell total. Earlier pools keep their frozen settings.

The optional atomic Dev Buy is a one-time launch path on Base, Robinhood, Monad, Arc, BSC, X Layer and Elysium. It pays the ordinary fee for the selected product, including the Tax buy total, but not the anti-snipe surcharge. Later buys use the ordinary trading rules.

\$O launches have no anti-sniping surcharge or fee exemption. Their ETH Dev Buy acquires \$O, deposits it for wstO and pays the normal launch-pool buy burn. Later trades can settle in ETH, USDC, \$O or wstO when the whole route is executable. See [the complete flow](https://docs.o1.exchange/launchpad/wsto/overview.md#create-and-buy).

## Chain-specific token creation

> [tab] Base mainnet
>
> Standard creates a native B20 token; Tax and \$O create fixed-supply ERC-20s. Standard and Tax each have a factory for supported crypto assets and Stock Tokens; the separate \$O factory launches against wstO. If the creator opts in, they may retain permission to update profile information only.

> [tab] Robinhood, Monad, Arc, BSC, X Layer and Elysium
>
> o1 creates a standard ERC-20 with a fixed supply. It has no owner and no function to mint more tokens, pause transfers, upgrade the contract, or recover tokens. The selected route can pair it with a supported crypto asset or Stock Token.

## Crypto and stock markets

> [tab] Crypto
>
> Crypto-paired launches use the selected chain's native currency, a supported stablecoin or another registered crypto asset. Standard fees and Tax creator/protocol/integrator/dividend rewards use that asset; Tax burn credits use launched tokens.

> [tab] Stocks
>
> Stock-paired launches are supported on Base, Robinhood, BSC, Monad and X Layer. Buys spend the selected Stock Token, sells receive it, and recipient fees and Tax dividends are denominated in it. Tax burn credits remain in launched tokens. See [Stock-paired launches](https://docs.o1.exchange/launchpad/create/stock-paired-launches.md).

## Profile information, comments, and announcements

| Feature | How it appears |
| - | - |
| Token profile | The image, description, website, X, Telegram, and other public fields are loaded from the IPFS metadata referenced by the token |
| Profile updates | When profile editing is enabled, the creator wallet can update the supported token identity and public information |
| Trade comments | A trader may attach a short comment of up to 32 UTF-8 bytes; it becomes public onchain data |
| Creator announcements | The current creator can publish updates through the separate announcement contract; original launch provenance remains unchanged |

Comments and announcements are public onchain records. Announcements use a separate contract, so the creator does not gain permission to create tokens, control transfers, or remove liquidity.

## What can change later

o1 governance can update supported paired assets, their opening-price references, creation fees, supply, liquidity settings, and swap fees for **future** launches. The announcement registry is bound once. Integrations must read the live fee before preparing a transaction.

Each completed launch keeps its token, original creator, paired asset, fee rates, opening price, liquidity range, and permanent position. Creator rights and the destination for future creator-fee credits can change through their explicit onchain processes. Later economic-policy changes apply only to new launches. Tax Dividend exclusions, receivers and asset recovery have separate [administrative controls](https://docs.o1.exchange/launchpad/tax/dividends.md#exclusions-and-administration).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.