> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Introduction

> Create a fixed-supply token with permanent Uniswap v4 liquidity, with Standard, Tax and $O launch products.

o1 Launchpad turns a token concept into a live onchain market. Configure your token, choose a supported paired asset, and launch with permanently locked Uniswap v4 liquidity.

Base, Robinhood, BSC, Monad and X Layer have **Standard** and **Tax** suites for crypto or stock pairs. Monad pairs are MON, USDC, WETH and wrapped xStocks. Arc offers Standard and Tax for USDC and cirBTC crypto pairs. Elysium offers Standard and Tax for HYPE and USDC crypto pairs. The create page shows the pairs available for your selected chain and token type.

Base and Robinhood also support **[\$O launches](https://docs.o1.exchange/launchpad/wsto/overview.md)**: ERC-20 launches paired with wstO, backed by \$O. Their only suite trading charge burns wstO immediately, with no creation fee, dividends or recipient allocations. Choose **\$O** on the Base or Robinhood Create page.

> [card] 1 billion fixed supply
>
> Current launches create exactly 1 billion tokens with 18 decimals.

> [card] Opening FDV near USD 4,000
>
> Current launches target an opening fully diluted valuation close to USD 4,000.

> [card] Permanent liquidity
>
> The Uniswap v4 market opens at launch, and its liquidity is permanently locked by the launch contracts.

> [card] No paired-asset deposit
>
> The complete fixed supply seeds the token side of the market without a creator ETH or quote-token deposit.

> [card] Stock-paired markets
>
> Pair your launch with a supported Stock Token on Base, Robinhood, BSC, Monad or X Layer. Base, Robinhood, BSC, Monad and X Layer support both Standard and Tax products.

> [card] Current creation fees
>
> Base and Robinhood Standard/Tax launches currently pay 0.001 ETH. \$O launches on Base and Robinhood have no creation fee. Monad charges 100 MON, Arc charges 2 native USDC, BSC is configured for 0.003 BNB, X Layer uses 0.02 OKB, and Elysium uses 0.025 HYPE. Network gas is additional.

## Standard, Tax and \$O launches

**Standard** uses the platform's configured creator, platform and referral fee split. **Tax**, deployed on Base, Robinhood, BSC, Monad, X Layer, Arc and Elysium, lets the creator choose separate buy and sell taxes, then divide the remainder after protocol between creator funds, dividends and burns. The ordinary tax already includes protocol.

Base Standard creates B20 tokens; Base Tax creates ERC-20 tokens. Both use fixed supply and permanent Uniswap v4 liquidity. Tax applies in the launch pool, not to ordinary wallet transfers or every unrelated pool. The [seven Tax deployments](https://docs.o1.exchange/launchpad/integration/tax-tokens.md) share the inclusive-tax model with chain-specific currencies and bindings. See [Tax tokens](https://docs.o1.exchange/launchpad/tax/overview.md) for the launch and reward options.

**\$O launches** create ERC-20 tokens on Base and Robinhood. The default buy and sell rates each burn 1% of the quote-side wstO amount. Each pool keeps its launch-time rates. The launched token is not burned by this fee. Burning wstO can increase backing per remaining share, but does not guarantee a market-price increase. See the [product comparison](https://docs.o1.exchange/launchpad/wsto/overview.md#how-it-differs-from-standard-and-tax).

## Standard launch model

| Property | Current value |
| - | - |
| Mainnet deployments | Base (`8453`), Robinhood (`4663`), Monad (`143`), Arc (`5042`), BSC (`56`), X Layer (`196`) and Elysium (`99901`) |
| Token type | Native B20 token on Base; fixed-supply ERC-20 on Robinhood, Monad, Arc, BSC, X Layer and Elysium |
| Market routes | Crypto and stocks on Base/Robinhood/BSC/Monad/X Layer; crypto only on Arc and Elysium |
| Paired assets | Chain-specific crypto assets and, where supported, Stock Tokens. See [Live configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#standard-routes-and-paired-assets) for the list |
| Supply | 1,000,000,000 tokens, 18 decimals |
| Opening FDV | Close to USD 4,000 at the configured opening price |
| Pool | A real Uniswap v4 market between the launch token and its selected paired asset |
| Liquidity | The complete fixed supply, added without a creator paired-asset deposit |
| Lock | Permanent and enforced by the launch contracts |
| Base swap fee | 1% in the paired asset |
| Fee split | 50% creator, 30% platform, 20% referrer of the base fee |
| Anti-snipe | Arc: 0% surcharge, normal 1% fee from launch; Base, Robinhood, Monad, BSC, X Layer and Elysium: 99% total to 1% over 20 seconds |
| Creation fee | Base/Robinhood: 0.001 ETH; Monad: 100 MON; Arc: 2 native USDC; BSC: 0.003 BNB; X Layer: 0.02 OKB; Elysium: 0.025 HYPE |
| Optional at launch | Editable profile information, socials, and other public details |

Supported assets and factory settings may change for future launches. Read the current [Live configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md) before preparing a transaction.

## From token setup to live market

**1. Design the launch**

Choose the token identity, paired asset, public profile, and profile-editing preference.

**2. Create the fixed supply**

The launch contracts create 1 billion tokens with no ongoing mint authority.

**3. Open permanent liquidity**

The complete supply is placed into the token's Uniswap v4 pool, permanently locked, and available for trading immediately.

**4. Use launch features**

Use the features supported by the selected product: fee claims, profile tools, announcements, optional staking, and Tax dividends or burns where configured.

The Uniswap v4 pool is the token's market from launch. Buyers exchange the paired asset for tokens from the locked position. As trading continues, the paired asset accumulates inside the same position and remains part of its permanent liquidity.

## Choose a path

> [card] [Launch from X with o1 Bot](https://docs.o1.exchange/launchpad/bot/quickstart.md)
>
> Set up a smart account and mention @o1\_bot. Bot V1 supports Standard crypto-paired launches on Base, with an optional ETH Dev Buy.

> [card] [Launch a token](https://docs.o1.exchange/launchpad/create/token-creation.md)
>
> Identity, metadata, paired-asset selection, profile control, and the wallet transaction.

> [card] [Launch against a stock](https://docs.o1.exchange/launchpad/create/stock-paired-launches.md)
>
> How supported Base, Robinhood, BSC, Monad and X Layer Stock Tokens work as paired assets and fee currencies.

> [card] [Run your own launchpad](https://docs.o1.exchange/launchpad/launchpads/overview.md)
>
> Launchpad of Launchpads: create a launchpad on Base or Robinhood. Tokens launched on it pay your launchpad a share of their tax.

> [card] [Tax tokens and rewards](https://docs.o1.exchange/launchpad/tax/overview.md)
>
> Inclusive trading taxes, creator funds, holder dividends and token burns.

> [card] [\$O launches](https://docs.o1.exchange/launchpad/wsto/overview.md)
>
> Pair with wstO, backed by \$O, and burn quote-token fees automatically with each trade.

> [card] [Understand liquidity](https://docs.o1.exchange/launchpad/trading/liquidity.md)
>
> Opening-price assumptions, changing pool inventory, and the permanent liquidity lock.

> [card] [Review fees](https://docs.o1.exchange/launchpad/trading/fees-referrals.md)
>
> Creation fees, the anti-snipe clock, paired-asset swap fees, referrals, and comments.

> [card] [Create or join a staking vault](https://docs.o1.exchange/launchpad/staking/overview.md)
>
> Fund a fixed-epoch reward program or stake wallet-held tokens for time-weighted rewards.

> [card] [Auction creator rights](https://docs.o1.exchange/launchpad/auctions/overview.md)
>
> The current creator can auction creator rights. The highest bidder receives future creator fees.

> [card] [Plan a launch](https://docs.o1.exchange/launchpad/launch-planning.md)
>
> Prepare the market, public profile, launch review, and post-launch communication.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.