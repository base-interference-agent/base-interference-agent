> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# How taxes work

> Choose trading taxes for creator funds, holder dividends and burns, with protocol fees included.

Tax tokens let creators choose how trading in their launch pool supports the project and its holders. They launch directly into Uniswap v4 with permanent liquidity, just like Standard launches.

On Base, **Standard** creates a B20 token and **Tax** creates a fixed-supply ERC-20. They are separate products. Choosing Tax does not change any existing Standard token.

Each chain has its own Tax deployment and paired assets:

| Chain | Paired assets | Creation fee |
| - | - | - |
| [Base](https://docs.o1.exchange/launchpad/reference/live-configuration.md#base-tax-suite) | ETH, USDC, registered crypto assets and Stock Tokens | 0.001 ETH |
| [Robinhood](https://docs.o1.exchange/launchpad/reference/live-configuration.md#robinhood-tax-suite) | ETH, USDG and registered Stock Tokens | 0.001 ETH |
| [BSC](https://docs.o1.exchange/launchpad/reference/live-configuration.md#bsc-tax-suite) | BNB, Binance-Peg USDC and registered bStocks | 0.003 BNB |
| [Monad](https://docs.o1.exchange/launchpad/reference/live-configuration.md#monad-tax-suite) | MON, USDC, WETH and supported wrapped xStocks | 100 MON |
| [X Layer](https://docs.o1.exchange/launchpad/reference/live-configuration.md#xlayer-tax-suite) | OKB, USDC, xETH and registered wrapped stocks | 0.02 OKB |
| [Arc](https://docs.o1.exchange/launchpad/reference/live-configuration.md#arc-tax-suite) | USDC and cirBTC | 2 native USDC |
| [Elysium](https://docs.o1.exchange/launchpad/reference/live-configuration.md#elysium-tax-suite) | HYPE and USDC | 0.025 HYPE |

The create page shows available pairs and the current creation fee. On Arc, native and ERC-20 USDC share one balance; see [Arc rewards](https://docs.o1.exchange/launchpad/tax/dividends.md#arc-rewards).

## Choose the trading tax

Set a separate **buy tax** and **sell tax**. Each is the complete ordinary tax in the launch pool, including the protocol fee. There is no extra platform or referral trading fee added on top by this suite.

The current launch policy permits **1% to 10%** on each side. The protocol receives 10% of the selected tax, subject to a minimum of **0.5%** and a maximum of **1%** of trading value. The floor means the protocol does not always receive exactly 10% of the tax.

| Selected total tax | Protocol | Left for your allocations |
| - | - | - |
| 1% | 0.5% | 0.5% |
| 3% | 0.5% | 2.5% |
| 10% | 1% | 9% |

Review the trade preview for the expected amount and minimum received after fees and slippage.

The creation fee above is separate from trading taxes and network gas. A route that first acquires the paired asset can also incur that external pool's fees and price impact.

## Split the remainder

Use the allocation controls to split what remains after protocol between:

| Allocation | What it does |
| - | - |
| Creator funds | Earns claimable fees for the creator in the paired asset |
| Holder dividends | Assigns rewards in the paired asset to eligible holders as trades happen |
| Burn | Collects tokens that anyone can later send to the dead address |

The percentages divide the **remainder**, not the whole trade. They must add up to 100%; an unused allocation can be zero. The same split applies to buys and sells, even when their total taxes differ.

For example, with a **3% total tax** and a **60% creator / 40% dividend** split, protocol takes 0.5%. The remaining 2.5% divides into 1.5% creator and 1% dividends. There is no burn allocation in this example.

Tokens launched through an integration can also include a fixed partner allocation from the same remainder. See [Tax contract integration](https://docs.o1.exchange/launchpad/integration/tax-tokens.md) for this option.

## Launch settings

**1. Choose Tax and a paired asset**

Select a supported crypto or stock pair on the chosen network when Tax creation is available. Creator funds and dividends use the paired asset; burns use the token you launch.

**2. Set buy and sell taxes**

Use the sliders for whole percentages or type up to six decimal places. Review the protocol share and split the remainder so the allocations total 100%.

**3. Configure dividends, if enabled**

Choose the minimum holding for rewards, from 10,000 tokens up to the token supply. Set the dividend allocation to zero if you do not want holder dividends.

**4. Review protection and creator settings**

Choose whether to enable anti-sniping, whether metadata can be edited, and the creator funds recipient. An optional Dev Buy happens atomically with launch and pays the ordinary buy tax, without the anti-sniping surcharge.

**5. Confirm the launch**

Review the total taxes, split, minimum holding, creation fee and any Dev Buy. The app prepares the launch before asking you to confirm the transaction in your wallet.

Tax rates, allocation shares, the minimum holding, reward currency and the chosen anti-sniping schedule are fixed for the launched token. Creator rights and the payout address for future creator funds can be transferred. See the [dividend guide](https://docs.o1.exchange/launchpad/tax/dividends.md#exclusions-and-administration) for reward administration.

## Optional anti-sniping

When enabled, the current policy starts the **combined trading fee at 99%**, then reduces it over **20 seconds** toward that side's ordinary buy or sell tax. It is not 99% added on top. The temporary surcharge goes to protocol.

With anti-sniping off, ordinary taxes apply from launch. Review the protection settings shown before confirming your launch; later platform updates do not change an existing token's schedule.

## Where tax applies

Tax applies to swaps through this token's **o1 launch pool**, including supported third-party routes that use that pool. Ordinary wallet transfers are untaxed.

Trading in a separate pool or on a centralized exchange does not automatically contribute to these taxes.

> [card] [Holder dividends](https://docs.o1.exchange/launchpad/tax/dividends.md)
>
> Understand automatic rewards, eligibility and your personal claims.

> [card] [Token burns](https://docs.o1.exchange/launchpad/tax/burns.md)
>
> Send collected burn tokens to the dead address without spending your own tokens.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.