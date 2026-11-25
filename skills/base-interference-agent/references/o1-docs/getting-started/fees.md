> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Trading Fees

> The more you trade, the more you earn back!

## Fees

### Cashback Program

Our universal cashback program applies across all markets - spot, prediction markets, and future markets. You level up as you trade more, earning greater cashbacks that reduce your effective trading fees.

#### Tier 1

* Cashback: 0.2%
* Net Fee Reduction: 0.20%

#### Tier 2

* Cashback: 0.25%
* Net Fee Reduction: 0.25%

#### Tier 3

* Cashback: 0.30%
* Net Fee Reduction: 0.30%

#### Tier 4

* Cashback: 0.35%
* Net Fee Reduction: 0.35%

#### Tier 5

* Cashback: 0.40%
* Net Fee Reduction: 0.40%

The cashback is applied to your base trading fee, regardless of the market type you're trading in.

### Spot Market

**Base Fee:** 1.00%

With our cashback program, your effective trading fees for spot markets are:

* **Tier 1:** 0.80% (1.00% - 0.20% cashback)
* **Tier 2:** 0.75% (1.00% - 0.25% cashback)
* **Tier 3:** 0.70% (1.00% - 0.30% cashback)
* **Tier 4:** 0.65% (1.00% - 0.35% cashback)
* **Tier 5:** 0.60% (1.00% - 0.40% cashback)

### Prediction Market

For prediction market trades, we use a dynamic fee structure based on market conditions:

**Base Fee Formula:** `Fee = round_up(0.07 × C × P × (1 - P))`

Where:

* **C** is the amount of shares being traded
* **P** is the current probability (price) of the outcome, expressed as a decimal between 0 and 1
* The result is rounded up to the nearest unit

**Note:** Cashback from our tier program applies to the calculated fee, reducing your effective trading costs.

#### How it Works

The fee calculation automatically adjusts based on:

1. **Trade Size (C):** Larger trades incur proportionally higher fees
2. **Market Probability (P):** The fee changes based on how certain the market is about an outcome
3. **Volatility Factor (P × (1 - P)):** This reaches maximum when P = 0.5 (50% probability), meaning the market is most uncertain

#### Base Fee Examples (Before Cashback)

* When **P = 0.5** (50% probability): Maximum fee = `0.07 × C × 0.25 = 0.0175 × C`
* When **P = 0.1** (10% probability): Fee = `0.07 × C × 0.09 = 0.0063 × C`
* When **P = 0.9** (90% probability): Fee = `0.07 × C × 0.09 = 0.0063 × C`
* When **P = 0.01 or 0.99** (extreme probabilities): Minimum fee = `0.07 × C × 0.0099 ≈ 0.000693 × C`

This dynamic fee structure ensures:

* **Fair pricing** based on market uncertainty
* **Lower fees** when outcomes are more certain (very high or very low probabilities)
* **Balanced liquidity provision** across all probability levels
* **Additional savings** through our universal cashback program

### Perpetuals (Perps)

We integrate with Hyperliquid Build Code to provide perpetual futures trading. Our platform charges the industry's lowest builder fee of **0.010%** for perpetual trades.

**Builder Fee:** 0.010%

This ultra-low builder fee provides exceptional value for perpetual futures traders.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.