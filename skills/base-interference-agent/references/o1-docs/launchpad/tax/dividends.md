> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Holder dividends

> Earn a share of trading rewards while eligible and claim directly from your wallet.

When a Tax token includes dividends, each trade in its launch pool assigns rewards to eligible holders. Rewards use the pool's **paired asset**: an ETH pair earns ETH, a BNB pair earns BNB, a MON pair earns MON, an OKB pair earns OKB, a HYPE pair earns HYPE, a USDC pair earns its chain's USDC, a Robinhood USDG pair earns USDG, and a stock pair earns that Stock Token.

**Rewards are assigned automatically. Claim them when you're ready.** No staking deposit or token approval is needed to claim.

## How you earn

The creator chooses the dividend allocation and minimum holding at launch. The documented factory floor is **10,000 tokens** on Base, Robinhood, BSC, Monad, X Layer, Arc and Elysium, but a creator may choose a higher threshold, up to the fixed supply.

1. A trade generates a dividend fee in the paired asset.
2. The contract divides it based on each holder's share of the eligible tokens when the fee is recorded.
3. Your share becomes an earned reward that you can claim later.

For example, if a trade contributes 10 USDC and your wallet holds 2% of the eligible tokens when the fee is recorded, you earn approximately 0.20 USDC. Small amounts follow the contract's integer rounding.

Newly bought tokens normally begin earning from subsequent trades. If you already held an eligible balance, that existing balance may earn from your own buy. The contract's actual transfer and fee order determines participation; buying tokens does not give you a share of earlier trading rewards.

## Eligibility

* Your full token balance counts when it meets the token's minimum and your address is eligible.
* Falling below the minimum stops new earnings until you qualify again.
* Selling or transferring tokens does not transfer rewards you have already earned.
* If nobody qualifies when a trade's dividend fee is recorded, that portion goes to the token's fixed protocol recipient. It does not wait for future buyers.

A very high threshold may leave nobody eligible, especially when tokens are held in excluded pools or sent to the dead address. The threshold stays fixed for each token. Rewards depend on trading activity and eligible balances; there is no guaranteed return.

## Claim your rewards

The token's **Dividends** section shows your claimable rewards, total earned, minimum holding and rewards claimed. Select **Claim rewards** to collect the unpaid amount.

Your profile's **Dividends** tab brings supported tokens together, including unpaid earnings from tokens you have sold. **Claim all** claims one group of payable rewards on the displayed page in one transaction. If more groups remain, claim again. Use **Next tokens** to find more positions.

If a payout reverts, none of that transaction's payments complete; earlier successful claims stay paid. Check a submitted transaction's status before retrying. A transaction with no payment is not a reward payout. Balances refresh after confirmation; indexed activity can take longer to appear.

Claiming pays only your earned amount to your payout address. Other holders' earned rewards and the pool's locked liquidity remain unchanged.

## Receiving rewards

Claim from the wallet that owns the entitlement, including a compatible smart wallet. Claims pay that wallet unless an administrator has recorded a different receiver. The dedicated Claim all helper acts only for its caller; another person cannot force your withdrawal.

Outside Arc, the app pays native rewards as ETH, BNB, MON or OKB, and ERC-20 rewards as their recorded token. Direct integrations can request wrapped payment for native rewards. You still need native currency for transaction gas.

## Arc rewards

Arc rewards are paid in the pool's ERC-20 paired asset: six-decimal USDC or eight-decimal cirBTC. Native and ERC-20 USDC share one balance, so claiming USDC also changes that shared balance. There is no wrapped USDC conversion or extra claim approval. The minimum holding, earned rewards and Claim all rules above remain the same.

## Exclusions and administration

The launch PoolManager, mandatory system addresses and configured custody addresses are excluded from rewards. Other pools may still qualify until identified and explicitly excluded. Tokens held by an exchange, pool or staking contract do not give your own wallet the corresponding dividend entitlement.

The factory owner or creator administrator can manage exclusions, change payout receivers and recover assets from the Dividend contract. Creating a token does not grant these administrator powers.

Exclusion stops new earnings and blocks claims while the address is excluded. Previously earned rewards remain recorded. Mandatory system exclusions cannot be removed; changes to default exclusions apply only to future launches. Existing tokens need their own authorized update.

Asset recovery can remove backing for unpaid rewards and prevent claims until funds are restored. These powers cannot change the token's fixed trading taxes or unlock its liquidity. See [Configuration and governance](https://docs.o1.exchange/launchpad/architecture/deployment-governance.md#tax-policy-and-dividend-administration).

Holder dividends are separate from [staking rewards](https://docs.o1.exchange/launchpad/staking/overview.md) and [creator, protocol or partner fees](https://docs.o1.exchange/launchpad/trading/claims.md). Integrators can also make [voluntary reward contributions](https://docs.o1.exchange/launchpad/integration/tax-tokens.md#reward-contributions-and-backing).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.