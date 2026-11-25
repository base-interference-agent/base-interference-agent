> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Earn

> Deposit Base USDC from a wallet created in o1, and withdraw it at any time.

Earn is the Base USDC yield page in o1 Terminal. Choose **Earn** in the navigation, or open [o1.exchange/earn](https://o1.exchange/earn) while Base is selected. The page subtitle is "Put idle USDC to work through Turnkey Earn."

The only asset is USDC on Base. The card is titled **USDC on Base** and names the vault provider, **Aave** or **Morpho**, together with the vault name. When more than one vault is listed, choose it from the selector in the card header.

Earn is available only while Base is the selected network. Switching to another network leaves the page.

> [!WARNING]
>
> **Net APY is not a promised return.** The rate can change. **Est. daily** is calculated from the current Net APY and balance, and the page states that it is not a guarantee. Depositing moves your USDC into the Aave or Morpho vault named on the card. That vault carries smart-contract and counterparty risk. **Earned this position** and **Lifetime earned** can be negative if the position value falls.

## Key properties

> [card] Base USDC
>
> The only supported asset is USDC on Base.

> [card] Wallets created in o1
>
> Deposit and withdraw with a Base wallet created in o1. Imported wallets cannot use Earn.

> [card] Withdraw at any time
>
> There is no lockup or cooldown. If new deposits are paused, withdrawals stay open.

> [card] Sponsored gas
>
> The Gas line reads **Sponsored**. A deposit still uses USDC that is already in the selected wallet.

## What you see

The action card has **Deposit** and **Withdraw**. It shows **Net APY** when a rate is available.

**Fee** is the current fee for the selected product. When the fee is zero or not set, the line reads **None**. **Gas** reads **Sponsored**.

While the position value is above zero, the **Position** panel shows:

* **Current value**: the USDC value of the open position.
* **Net deposited**: deposits minus withdrawals for this position.
* **Days staked**: how long this open position has existed, plus the date it started. Under one day it reads `< 1 day`.
* **Earned this position**: current value minus net deposited.
* **Est. daily**: an estimate prefixed with `~`, from the current Net APY and balance. The value is marked "Estimated from current Net APY and balance. Not a guarantee."

**Lifetime earned** is shown above those rows and includes the open position. A **MAX** withdrawal keeps that figure visible after the position closes. Before the first deposit, the panel reads **Your balance and lifetime earned will appear after the first deposit.**

**Activity** lists deposits and withdrawals for the selected wallet and product. Filter by action (**Deposit** or **Withdraw**) and by status (**Confirming**, **Confirmed**, or **Failed**). When a transaction hash is available, the Tx column links to Basescan. An empty list reads **Deposits and withdrawals will show up here.**

## Deposit

**1. Open Earn on Base**

Sign in and select Base. Choose **Earn**.

**2. Select a wallet created in o1**

Use the wallet menu and pick a Base wallet created in o1. Your main wallet is marked **Main**. An imported wallet shows **Imported wallets can't use Earn. Switch to a wallet created in o1.**

**3. Enter a USDC amount**

Stay on **Deposit**. **Balance** is the USDC in the selected wallet. Enter an amount, or choose **25%**, **50%**, **75%**, or **MAX**.

**4. Confirm the deposit**

Check **Fee** and **Gas**, then select **Deposit**. The banner names the amount and the steps **Signed**, **Submitted**, and **Confirming on Base**. You can leave and come back while it confirms. This wallet cannot start a second Earn transaction until the current one finishes.

## Withdraw

**1. Choose Withdraw**

Select **Withdraw**. **Balance** switches to the current position value. The amount must be greater than 0 and no larger than that value.

**2. Confirm the withdrawal**

Choose **25%**, **50%**, **75%**, or **MAX**, then select **Withdraw**. **MAX** withdraws the open position. Gas is sponsored, and the same confirmation banner appears. USDC is withdrawn to the selected wallet after the transaction confirms.

A pause on new deposits does not close withdrawals. The position panel reads **New deposits are paused. Withdrawals stay open.** The deposit card shows that same line while **Deposit** is selected. You can still withdraw when the product is ready and the current value is above 0.

## When an action is blocked

| Message | What to do |
| - | - |
| Sign in to deposit or withdraw. | Sign in to o1 Terminal. |
| This account has no Base wallet yet. | Create a Base wallet in o1. |
| Imported wallets can't use Earn. Switch to a wallet created in o1. | Choose a wallet that was created in o1. |
| This product is not ready for deposits. | The product is not ready, so both deposit and withdraw stay closed. |
| New deposits are paused. Withdrawals stay open. | Switch to **Withdraw** to take USDC out. |
| Enter an amount greater than 0 within your balance. | Use an amount above 0 that fits the balance shown on the card. |
| This wallet already has an Earn transaction in progress. | Wait until that transaction confirms or fails. |

> [!NOTE]
>
> Earn is separate from [O Staking](https://docs.o1.exchange/staking/introduction.md), which deposits O and returns wstO with no built-in yield. It is also separate from [Launchpad staking vaults](https://docs.o1.exchange/launchpad/staking/overview.md) and from [referral rewards](https://docs.o1.exchange/features/referrals-rewards.md).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.