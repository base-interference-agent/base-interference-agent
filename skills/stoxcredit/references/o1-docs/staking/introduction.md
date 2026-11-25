> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# O Staking

> Deposit O to receive wstO, redeem it for O at any time, and move O between Base and Robinhood Chain.

O Staking is the vault for the o1 token, \$O. You deposit O and receive wstO (Wrapped Staked O), a standard ERC-20 share of the O held by the vault. You can redeem wstO for O at any time at the current exchange rate.

Open the app at [staking.o1.exchange](https://staking.o1.exchange).

> [!WARNING]
>
> **wstO has no built-in yield.** The vault does not lend, trade, or stake O anywhere else, and it pays no rewards or interest. The exchange rate rises only when O is added to the vault or wstO is burned, so it usually stays constant.

## Key properties

> [card] No fees
>
> Deposits and redemptions charge no fee. Apart from network gas, the only cost is rounding down, and the remainder stays in the vault.

> [card] Redeem at any time
>
> There is no lockup or cooldown. A deposit pause never stops redemptions, transfers, or burns.

> [card] Standard ERC-20 share
>
> wstO does not rebase: your balance changes only when you deposit, redeem, or transfer. It supports EIP-2612 permit.

> [card] Fixed contracts
>
> The vault cannot be upgraded, and no role can move deposited O, mint wstO, or change balances.

## Supported networks

| Network | O | wstO vault |
| - | - | - |
| Base (`8453`) | Native O | [`0x80C6BAE89B636c6Ee96FE8F198c0D6926C2C91df`](https://basescan.org/address/0x80C6BAE89B636c6Ee96FE8F198c0D6926C2C91df) |
| Robinhood Chain (`4663`) | O bridged from Base through LayerZero | [`0xE92bD1C05E4E308792003C8205127A6FA662b4D4`](https://robinhoodchain.blockscout.com/address/0xE92bD1C05E4E308792003C8205127A6FA662b4D4) |

Each network has its own vault, exchange rate, and wstO supply. wstO on one network cannot be redeemed or bridged to the other. To move O between networks, use the [O bridge](https://docs.o1.exchange/staking/bridge.md).

> [!NOTE]
>
> O Staking is separate from [Launchpad staking vaults](https://docs.o1.exchange/launchpad/staking/overview.md), which let anyone create fixed-schedule reward programs for other tokens. [Earn](https://docs.o1.exchange/features/earn.md) is also separate: it deposits Base USDC into an Aave or Morpho vault.

## Explore the documentation

> [card] [How wstO works](https://docs.o1.exchange/staking/how-it-works.md)
>
> Understand the exchange rate, locked shares, and deposit pause.

> [card] [Deposit and redeem](https://docs.o1.exchange/staking/deposit-and-redeem.md)
>
> Deposit O, redeem wstO, and read the vault page.

> [card] [Bridge O](https://docs.o1.exchange/staking/bridge.md)
>
> Move O between Base and Robinhood Chain.

> [card] [Security and audit](https://docs.o1.exchange/staking/security.md)
>
> Review the audit, safety properties, and governance boundary.

> [card] [Contracts](https://docs.o1.exchange/staking/contracts.md)
>
> Find every address with dated onchain readback.

> [card] [Integrate wstO](https://docs.o1.exchange/staking/integration.md)
>
> Call the vault directly from your own contracts or apps.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.