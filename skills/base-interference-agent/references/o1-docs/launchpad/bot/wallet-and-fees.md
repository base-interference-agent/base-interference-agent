> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Wallet and fees

> Understand smart-account balances, deposits, withdrawals, Max, and who pays gas.

Your **Owner wallet** is the connected Web3 wallet that controls your **Base smart account**. They are separate addresses with separate balances. Sending ETH to the Owner wallet does not fund the smart account automatically.

## Switch wallets or X accounts

Disconnecting your connected Web3 wallet or switching to a different wallet address also signs you out of the current X website session. The portal clears the previous X account and its displayed account data. This also applies when you change accounts in your wallet extension or disconnect on another page of the site.

To use a different wallet and a different X account, disconnect the current wallet, connect the other wallet, then use **Connect X** to authorize the other X account. For an existing smart account, use its bound Owner wallet. For a new account, complete setup with the intended wallet and X identity.

* First-time setup still allows you to connect X before connecting your first wallet.
* Changing only the network while keeping the same wallet address does not sign you out of X.
* If sign-out fails, the portal keeps the old account hidden. Selecting **Connect X** retries the sign-out before starting another login.

> [!WARNING]
>
> Signing out does not unlink an X identity from its smart account, change the Owner, delete assets or revoke the Bot's onchain permission. Previously authorized Bot launches can continue while permission and other execution requirements remain valid. To remove that permission, use [Permissions](https://docs.o1.exchange/launchpad/bot/permissions.md#renew-or-revoke) and confirm revocation with the bound Owner wallet.

## Who pays?

| Action | Funds and gas |
| - | - |
| Activate or manage permissions | Owner wallet signs and pays the required transaction gas; setup can also fund the smart account's activation needs |
| Deposit through the portal | Owner wallet sends ETH and pays the deposit gas |
| Launch from X | Smart account pays the launch fee and execution gas |
| Launch with Dev Buy | Smart account also pays the explicit purchase amount |
| Withdraw through the portal | Assets leave the smart account; Owner wallet signs and pays gas from its own ETH balance |

This table describes the user-owned smart-account path. Approved no-setup creators use a separate platform-funded launch path without Dev Buy.

## Deposit ETH

Choose **Deposit** in the [o1 Bot portal](https://launch.o1.exchange/o1-bot), review the Base smart-account destination, and confirm in your Owner wallet.

* **Max** is the maximum transferable amount after reserving the estimated deposit gas in your Owner wallet. It is not an account deposit limit or a Bot permission limit.
* A deposit only moves funds. It does not launch a token, request a Dev Buy or extend permission expiry.
* Use ETH on **Base**. Do not treat a balance on another chain as available for this account's Base launch.

## Budget for a launch

```text theme={null}
Required smart-account ETH
= current launch fee + optional Dev Buy amount + execution gas
```

The portal shows the current launch fee; gas varies with execution and network conditions. Do not treat an old screenshot or example purchase amount as an all-in quote. See [Live configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md) for dated protocol fee snapshots.

A small balance can remain after setup if not all activation funding was used. To identify the origin of a specific balance, check that account's incoming transfers and transaction history in the explorer.

> [!NOTE]
>
> Account balance and permission limits are separate. Depositing ETH does not grant new permission, and an active permission does not supply funds. Review the [permission version and expiry](https://docs.o1.exchange/launchpad/bot/permissions.md) before funding.

## Your assets

The Wallet view lists assets actually held by the smart account, including tokens received through Dev Buy. Tokens you created are not automatically wallet holdings, and creator status does not mean you own the entire supply.

Use the contract address and explorer link to distinguish assets with the same name or symbol. The portal can lag behind a confirmed transaction while balances and activity refresh.

## Withdraw to your Owner wallet

Choose **Withdraw** next to an asset, or open the general Withdraw action and select an asset. Review the amount and recipient before confirming.

* V1 sends withdrawals to the **bound Owner Web3 wallet on Base**, not an arbitrary pasted address.
* ETH and supported token holdings can be withdrawn.
* Your Owner wallet signs and needs enough Base ETH to pay gas, including when withdrawing a token.
* For ETH, Max can withdraw the smart account's full available balance because the Owner wallet pays this withdrawal's gas. Doing so can leave the smart account unable to launch again until funded.
* The Bot's restricted launch permission does not authorize it to withdraw assets.

If a withdrawal's confirmation is uncertain, check the existing transaction first. Do not send another withdrawal until you know the previous result.

## Fees shared with your X profile

[X fee shares](https://docs.o1.exchange/launchpad/trading/share-creator-fees.md) are fees that other token creators share with your X profile. Manage them from **Profile > Fees > X fee shares**. Earnings from tokens your Bot account launched appear under **Creator fees**.

You can reuse your existing Smart Account to receive X fee shares. Connect the wallet that controls it to register, claim or transfer funds. You do not need to enable Bot launches, and linking an X profile for fees does not change the Bot's authorized launch identity.

Set up a fee-sharing token through the **Create** page. Bot launch requests do not support fee splits.

Claiming collects earned fees into the registered account. Transferring or withdrawing moves funds already held there to its owner wallet. Revoking Bot permission, signing out or changing a username does not delete the account, remove that fee link or erase earnings. Active Bot permissions can still spend eligible native funds in the same account on permitted launches; receiving fee income does not reserve those funds from the Bot.

## Trade tokens after launch

The Bot cannot buy or sell existing tokens through X. To sell tokens held in the smart account, first withdraw them to the bound Owner wallet, then connect that wallet on the token's trading page and review the trade yourself.

Replying `@o1_bot sell it` or `@o1_bot buy more` directly to your launch confirmation can return the verified token page. `@o1_bot withdraw` points to the portal. These are [guidance replies](https://docs.o1.exchange/launchpad/bot/commands.md#buy-sell-and-withdraw-guidance), not executed transactions; you still review and sign wallet actions manually.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.