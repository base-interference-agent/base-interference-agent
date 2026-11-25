> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Single-sided liquidity

> How the opening value, token-only liquidity, changing pool inventory, and permanent Uniswap v4 market work.

Every launch opens a real Uniswap v4 pool. All tokens available to the market begin on the token side of the opening price, so the creator does not need to deposit ETH, OKB, HYPE, USDC, USDG, a Coinbase crypto major, or a Stock Token as liquidity.

## Current market setup

| Setting | Current value |
| - | - |
| Pair | Launch token and the creator's selected paired asset |
| Opening value | FDV close to USD 4,000 under the current quote assumptions |
| Pool supply | Complete fixed supply |
| Liquidity | One continuous token-side range beginning at the opening price |
| Range share | 100% of the pool supply |
| Position owner | The suite's launch Hook |
| Removal | Permanently disabled |

The liquidity range uses Uniswap's spacing value of `200`. This controls where the range can begin and end; it does not force prices or trades to move in fixed steps.

## Opening FDV

Current launches have a fixed supply of **1 billion (1,000,000,000) tokens**. The opening FDV is the opening token price multiplied by that complete supply.

| Quote assumption | Current opening target |
| - | - |
| ETH, MON, BNB, OKB, HYPE or WETH at the current factory-managed opening reference | FDV close to USD 4,000 |
| USDC at USD 1 | FDV close to USD 4,000 |
| USDG at USD 1 | FDV close to USD 4,000 |
| Supported Stock Token at its configured reference price | FDV close to USD 4,000 |
| wstO using \$O's reference price and the current vault conversion | Opening valuation depends on the registered wstO tick and current share value |

FDV is a valuation reference, not money raised or deposited. Its USD value changes with the paired asset's market price. Paired-asset price references can update the opening setting for future launches without changing an existing pool. Trading moves each live token price according to its own Uniswap v4 market activity.

## How inventory changes

**1. The market opens with tokens**

The permanent position starts with the pool supply in launch tokens and no paired-asset deposit from the creator.

**2. Buys add the paired asset**

Buyers send the selected paired asset, such as ETH, OKB, HYPE, USDC, USDG, a supported Coinbase crypto major, or a supported Stock Token, and receive launch tokens. Launch-token inventory decreases while paired-asset inventory increases.

**3. Sells return tokens**

Sellers send launch tokens back to the pool and receive the paired asset at the live Uniswap v4 price.

**4. The position stays active**

Remaining launch tokens and the accumulated paired asset continue supporting the market inside the same permanent position.

Because the position starts with launch tokens and no paired-asset inventory, early sell quotes depend on assets added by earlier buys. A sell may be limited or unavailable until the pool has enough native currency, stablecoin, crypto-major, or Stock Token inventory to return.

```text theme={null}
pool supply = 1,000,000,000 tokens
```

## Token-only launch check

Before the launch completes, the contracts verify that opening the position requires launch tokens only. If a configuration would require native currency, a stablecoin, a crypto major, or a Stock Token from the creator, the transaction stops.

## Why liquidity is permanent

* the suite's launch Hook owns the position;
* its liquidity cannot be decreased or removed;
* outside accounts cannot modify the locked position or add their own liquidity in that launch pool;
* there is no transferable LP token or position NFT;
* there is no administrator withdrawal or recovery path.

The assets remain inside Uniswap. o1 can adjust settings for later launches but cannot remove or rewrite an existing position.

## Tax tokens and other pools

Tax on Base, Robinhood, BSC, Monad, X Layer, Arc and Elysium preserves the same liquidity lock and zero LP fee in its launch pool. Its creator/dividend/burn/integrator allocations do not include automatic liquidity provision. Tax burn delivery removes collected tokens from usable circulation; it does not add liquidity or guarantee a price increase.

These restrictions apply to the launch pool. Other people can create separate pools, but trading there does not automatically contribute to the launch token's taxes. See [dividend eligibility](https://docs.o1.exchange/launchpad/tax/dividends.md#exclusions-and-administration) for how pool-held tokens affect rewards.

## \$O launch liquidity

\$O launches retain the same locked, token-only position and zero launch-pool LP fee. The burn reduces wstO supply, not launched-token supply. It does not add liquidity or mechanically increase the pool price.

The settlement reserve is separate from the locked launch position. It provides temporary physical inventory for immediate burns before a router settles its input. Its owner can redeem only the reserve's own claims, not withdraw the launch LP position. Insufficient inventory reverts the affected transaction; a reserve deposit cannot fix an illiquid external ETH/USDC/\$O conversion pool. See [settlement accounting](https://docs.o1.exchange/launchpad/integration/wsto.md#settlement-reserve).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.