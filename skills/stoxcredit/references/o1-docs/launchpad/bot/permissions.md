> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Permissions and safety

> What o1 Bot can do, what stays under Owner control, and how expiry and revocation work.

Setup authorizes restricted launch operations from your smart account so that a valid X request can execute without asking your Owner wallet to sign each launch.

## What the Bot can do

The permission is restricted to reviewed launch-factory operations: create a supported token, or create and execute the explicitly requested atomic Dev Buy. Launch requests are also checked for the connected X identity, supported chain and quote, valid fields and funding.

It does not grant general wallet access.

| Operation | Restricted Bot permission |
| - | - |
| Supported token launch | Allowed while permission is valid |
| Supported launch with explicit Dev Buy | Allowed while permission is valid and funds are available |
| Ordinary token swap or transfer | Not allowed |
| Withdraw funds | Not allowed; requires Owner wallet |
| Claim fees or edit token metadata | Not allowed by this launch permission |
| Renew, revoke or change permissions | Not allowed; requires Owner wallet |

## Duration and spending

New setup and Owner-approved renewals use a **30-day** launch permission. The portal shows your account's actual expiry.

> [!WARNING]
>
> The current permission version has **no cumulative native-asset spending cap**. Its restriction is which launch operations it can call, not a lifetime ETH budget. ETH already held by the account, and ETH deposited later, can fund permitted launches while access remains valid. Fund only the balance you intend to make available for this purpose.

Older permissions can retain a **0.10 ETH cumulative native-value cap** until replaced through Owner-approved renewal. Depositing more ETH does not raise that cap. Check the permission installed on your account instead of assuming every account has the newest version.

Application request limits and per-Post Dev Buy amounts do not turn an uncapped permission into a cryptographic cumulative spending limit.

## Renew or revoke

Use **Permissions** in the o1 Bot portal to inspect access, renew it or revoke it. These actions require your Owner wallet's approval. Wait for onchain confirmation before relying on the changed permission state.

Revocation prevents subsequent use of that permission; it does not reverse a transaction that already executed. Check any pending or uncertain launch before taking further action.

## X identity and session safety

* Protect the connected X account: a valid launch instruction from that identity can spend smart-account funds within the permitted operations.
* Disconnecting or switching your connected Web3 wallet also signs you out of the current X website session and clears the previous account display. See [switching wallets or X accounts](https://docs.o1.exchange/launchpad/bot/wallet-and-fees.md#switch-wallets-or-x-accounts).
* Website sign-out does not unlink the X identity, change the smart account's Owner or revoke an onchain permission. It does not by itself stop authorized Bot launches.
* Sending [stop](https://docs.o1.exchange/launchpad/bot/commands.md#stop-future-requests) opts the X identity out of future requests; it does not revoke the onchain permission.
* Deleting or editing a Post is not a reliable way to cancel a transaction already being processed.
* Never include a seed phrase or private key in a Post, a metadata field or a support message.

For a failed setup, expired permission or uncertain transaction, see [Troubleshooting](https://docs.o1.exchange/launchpad/bot/troubleshooting.md).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.