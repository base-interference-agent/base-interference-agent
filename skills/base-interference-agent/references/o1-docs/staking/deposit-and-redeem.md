> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Deposit and redeem

> Deposit O for wstO, redeem wstO for O, and read the vault page in the O Staking app.

You can deposit and redeem at [staking.o1.exchange](https://staking.o1.exchange). You need a wallet holding O on Base or Robinhood Chain, plus a little ETH on the same network for gas.

The app sends wstO and O only to the connected wallet. It has no transfer feature.

## Deposit O

**1. Connect and choose a network**

Connect your wallet and select Base or Robinhood Chain in the header. If your wallet is on another network, the app asks you to switch.

**2. Enter an amount**

Choose **Deposit** and enter an amount of O, or select **MAX**. The panel shows the wstO you will receive, the exchange rate, and the minimum you will receive.

**3. Set the slippage tolerance**

Choose 0.1% (default), 0.5%, or 1%. The minimum received is the current quote less this tolerance. If the rate moves past it before your transaction executes, the deposit reverts and your O stays in your wallet.

**4. Approve O**

The first deposit needs an approval that lets the vault transfer your O. By default the app approves the exact amount. Select **Unlimited approval** to skip this step on future deposits.

**5. Confirm the deposit**

The app fetches a fresh quote and simulates the transaction before your wallet opens. The transaction expires if it is not executed within 20 minutes.

Before each deposit, the app also checks how much rounding would cost. If redeeming the quoted wstO right away would return less O than you deposit by more than your slippage tolerance, the app blocks the deposit.

## Redeem wstO

**1. Choose Redeem**

Select **Redeem** and enter an amount of wstO, or select **MAX**. Redeeming your own wstO needs no approval.

**2. Confirm the redemption**

The app uses a fresh quote as the minimum O you will receive. The exchange rate never decreases, so no slippage setting is needed. O is sent to your connected wallet.

Redemptions are available at all times, including while deposits are paused.

> [!WARNING]
>
> Never send O directly to the vault address. It mints no wstO and cannot be recovered. Always use **Deposit**.

## Read the vault page

| Item | Meaning |
| - | - |
| TVL | O held by the vault, with a USD estimate when a price is available |
| Exchange Rate | O redeemable for one wstO |
| wstO Supply | Total wstO, including permanently locked shares |
| My Position | Your wstO balance and the O it currently redeems for |
| Vault History | TVL and wstO supply over the last 1, 7, or 30 days |
| Transactions | Confirmed deposits, redemptions, and burns for this vault |
| Vault Details | Contract addresses, deposit status, fees (0%), and locked shares |

History and transactions are rebuilt from onchain events. If they show as unavailable, only the display is affected. Your balance and the vault are not.

## Messages and fixes

| Message | Meaning | What to do |
| - | - | - |
| Deposits paused | New deposits are paused for this vault | Wait for deposits to reopen. Redemptions still work |
| The rate changed. Refresh the quote and try again. | The quote moved past your minimum before execution | Submit again with a fresh quote |
| Transaction expired. Please submit again. | The transaction was not executed within 20 minutes | Submit again |
| Insufficient allowance. Approve first. | The vault cannot transfer enough of your O | Approve O, then deposit |
| Amount too small | The amount would mint or return zero | Enter a larger amount |
| Rounding would cost this deposit more than your slippage tolerance | The amount is small relative to the exchange rate | Enter a larger amount or a higher tolerance |
| Vault not deployed on this network | There is no vault on the selected network | Choose Base or Robinhood Chain |


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.