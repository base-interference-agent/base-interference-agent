> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Share creator fees

> Share a new token's creator fees with X profiles, link your receiving account, and claim your earnings.

**Share creator fees** lets you share a new Base token's creator earnings with X profiles. Choose how much goes to the creator wallet and each X account when you launch a Standard or Tax token.

Sharing does not add a trading fee. It divides only the creator's earnings, leaving platform fees, referrals, Tax dividends, burns and integrator allocations unchanged.

## Set the split when creating a token

1. Open **Create** on Base and turn on **Share creator fees**.
2. Choose the **creator fee wallet**. It can differ from the wallet submitting the launch.
3. Find and select the X profiles that should receive a share. Check the username and permanent X ID before confirming.
4. Set percentages that total **100%**, then review the split in the confirmation screen.
5. Confirm the launch in your wallet. Your token, fee vault and optional Dev Buy complete in one transaction. If the transaction fails, none of those steps takes effect.

You can include **up to eight recipients with a positive share**: one creator wallet and up to seven X profiles. With a **0% creator share**, all eight recipients can be X profiles. The creator wallet is still required for announcements and permitted profile edits. You can also assign 100% to the creator wallet. Additional wallet recipients are not supported.

For Tax tokens, the split applies to the **creator funds** you configure in the tax settings. Giving the creator wallet 0% of that split sends the creator funds to the selected X profiles; it does not turn off those funds.

> [!WARNING]
>
> X recipients and percentages cannot change after launch. Selecting an X profile does not mean its owner has accepted or endorsed the token. Fee sharing must be set up when creating the token; it cannot be added to an existing token.

## Understand the addresses

| Label | Meaning |
| - | - |
| Created by | The wallet that submitted the launch. This attribution does not change. |
| Creator fee wallet | Receives the creator's share and holds the associated creator permissions. It can change through an authorized handover. |
| Fee vault | The contract that holds and distributes this token's creator fees. Explorers may show it as the creator because it launches the token on your behalf. |
| X receiving account | The account linked to an X profile to receive its fees. You must control this account to claim or transfer funds. |

The token page's **Fees** tab shows who receives each share. Use **Profile > Fees** to view and claim your earnings. Shares follow the permanent X ID, so changing your username does not change your entitlement. The displayed name may take time to update.

## Receive fees shared with your X profile

**1. Find your fees**

Connect your wallet and open **Profile > Fees > X fee shares**. Already-linked accounts can appear automatically. Otherwise, choose **Connect X** and authorize your profile.

**2. Check your receiving account**

Review the account that will receive your fees. You can reuse your o1 Smart Account without enabling Bot launches. If an existing receiving account is controlled by a different wallet, connect that wallet to continue.

**3. Review a first-time link**

When linking an X profile for the first time, check the profile, network and receiving address. Sign the wallet message, then confirm the registration transaction. The message alone does not complete the link; the transaction costs gas.

**4. Claim and transfer**

Claim your fees into the linked receiving account. Use **Transfer to my wallet** to move funds from a Smart Account to its connected owner wallet. Claiming collects your earnings; transferring moves funds already in the account.

> [!WARNING]
>
> The confirmed X-to-account link cannot be replaced through the app, the Bot or a Registry admin. Make sure you control the receiving account before registering. Losing access to that account can prevent you from collecting future fees and existing unpaid fees.

Someone can share fees with your X profile before you register. Those earnings remain available to claim after linking your account. You can link multiple X profiles you control to the same receiving account; each profile keeps its own share.

Disconnecting X or turning off Bot access does not remove your Smart Account, fee link or earnings. Registration, claims and transfers require your own authorization. While Bot launch permission is active, ETH in that account can still fund permitted Bot launches. See [Bot permissions](https://docs.o1.exchange/launchpad/bot/permissions.md) and [Wallet and fees](https://docs.o1.exchange/launchpad/bot/wallet-and-fees.md).

## How fees are counted

Your share includes fees already in the vault and fees still waiting in the pool's fee escrow. Moving those funds into the vault does not count them twice. Claiming pays your share minus anything you have already received.

For example, suppose **100 USDC of creator-fee income** is split 20% to Alice, 40% to X profile A and 40% to X profile B. Alice earns 20 USDC and each X profile earns 40 USDC, even if the funds are still in escrow. If Alice hands the creator position to Bob, Alice keeps that earlier 20 USDC. Another 50 USDC gives Bob 10 USDC and each X profile another 20 USDC.

A claim pays only your entitlement and leaves everyone else's share available. Fees are paid in the pool's paired asset. Calculations round down to that asset's smallest unit, so tiny amounts can remain in the vault; no admin can withdraw that rounding remainder.

## Handover, Takeover and OTC

Only the **creator position** can move. Its percentage, the X IDs and their percentages remain fixed, and previous creators keep their earlier unpaid fees.

* **Direct handover:** the current creator proposes a recipient and that recipient accepts. Earnings change hands at acceptance, not at proposal.
* **Takeover of the creator position:** an authorized administrator can assign the creator fee position to another wallet without changing X shares.
* **[Creator-position auction](https://docs.o1.exchange/launchpad/auctions/overview.md#tokens-with-shared-creator-fees):** sells only the creator position. Creator fees earned during the auction go to the buyer when the sale completes, or back to the seller if the auction ends without a sale. X shares remain unchanged.

A 0% creator position can still be handed over or reassigned, but cannot be auctioned. Use a flow that explicitly supports the vault's creator position. A full Factory-rights takeover is a different administrative action and can redirect future fees away from the split. See [Community takeover](https://docs.o1.exchange/launchpad/takeover.md#tokens-with-shared-creator-fees) for eligibility and scope.

## Common questions

* **Wrong wallet:** connect the wallet that owns the recorded receiving account. A different X login cannot replace an existing permanent binding.
* **Registration expired:** repeat the review and signing step to get a fresh request.
* **Transaction still pending:** check its status before retrying. A refresh is not a reason to submit a duplicate transaction.
* **No shared tokens yet:** check that you selected the correct X profile and network. New tokens can take a short time to appear; this does not change your earnings.

See [contract addresses](https://docs.o1.exchange/launchpad/reference/production-contracts.md#base-x-linked-fee-vaults) and [security and audit](https://docs.o1.exchange/launchpad/security.md#x-linked-fee-vault-boundaries) for the contracts, permissions and risks.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.