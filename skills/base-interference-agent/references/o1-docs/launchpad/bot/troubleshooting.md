> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Troubleshooting

> Resolve launch input, funding and permission problems without creating duplicate transactions.

Start with the Bot's reply and the portal's request activity. A generic error message alone does not identify its cause.

## Common problems

| What you see | What to check |
| - | - |
| No reply yet | Confirm the Post mentions @o1\_bot, was sent from the intended X account, and is a direct Post or reply. Check portal activity before posting again |
| No reply after help, template and a partial field | These can consume one request's three-Post classification limit. See [Help and template follow-ups](#help-and-template-follow-ups) |
| Buy, sell or withdraw only returns instructions | Expected: these are guidance replies, not executable X trading or withdrawal commands |
| No token link in a buy or sell reply | Reply directly to your own confirmed launch's success message. The Bot will not guess a token from ambiguous context |
| Specify an enabled chain | Include `Launch on Base` or `Chain: Base` in the request. The portal's selected chain is not enough |
| Missing or invalid image | Attach exactly one PNG, JPG or WEBP photo within the [image limits](https://docs.o1.exchange/launchpad/bot/commands.md#fields) |
| Missing name, symbol or other details | Reply directly to the correction prompt from the same X account with the requested field |
| Setup required | Connect X and the Owner wallet, then finish Base smart-account activation |
| X signed out after disconnecting or switching wallets | Expected: the website session follows wallet changes. Connect the intended wallet and X account again; existing smart accounts require their bound Owner. See [account switching](https://docs.o1.exchange/launchpad/bot/wallet-and-fees.md#switch-wallets-or-x-accounts) |
| Insufficient funds | Fund the **smart account**, not just the Owner wallet, for the launch fee, gas and any Dev Buy |
| Permission invalid or expired | Inspect Permissions in the portal. The Owner may need to renew access and confirm it onchain |
| Dev Buy unsupported | Use the setup smart-account path on Base with `Quote: ETH` and an explicit positive ETH amount |
| Request limit reached | Wait for capacity to become available. Recorded failed requests can count toward the smart-account limit |
| Could not prepare this launch | Check the recorded request detail. Preparation can fail for different reasons, including provider or permission-check errors; it is not necessarily a balance problem |

## When is it appropriate to retry?

> [tab] Awaiting correction
>
> Reply directly to the current launch correction prompt. Do not start another complete launch merely to supply a missing field. A request allows up to two guidance or correction replies in total; help and template follow-ups can consume those replies too.

> [tab] Nothing submitted
>
> Fix the stated cause first. If the request is closed and the Bot explicitly confirms nothing was submitted, send a complete new launch request with its own image. It may be in the same conversation.

> [tab] Pending or unknown
>
> Do not repost or assume failure. Inspect the request and any transaction link, and wait for its outcome to be resolved. An unknown submission might already have reached the chain.

> [!WARNING]
>
> A new Post is a new request and can create another token. Reusing a name or symbol is not a deduplication mechanism.

## Help and template follow-ups

A template is an example, not a saved launch draft. After requesting it, send a complete launch instruction with your own fields and one supported image. Replying only `Symbol: FIX` does not adopt the other sample values.

V1 currently counts help and template messages toward the same three-Post classification limit when they continue one request. After two guidance or correction replies, a third incomplete message can close the request without a final explanation. This is a known limitation, not evidence of an X delivery failure.

If you only asked for help and supplied a partial field, use a complete launch request when ready. If you also sent a complete launch or saw a pending submission, check its status before reposting. Do not infer a failed transaction from silence.

Standalone buy, sell and withdraw guidance uses a separate path and does not use up the active launch's correction attempts. It still respects reply limits and opt-out. See [guidance behavior](https://docs.o1.exchange/launchpad/bot/commands.md#buy-sell-and-withdraw-guidance).

## Launch succeeded, but I do not see tokens

Creating a token does not allocate the initial supply to your wallet. Without a Dev Buy, the supply goes into locked liquidity.

If you requested a Dev Buy, check the confirmed transaction and the **smart account's** token balance, not only the Owner wallet. Use the contract address to identify the token. A delayed asset list or missing reply is not proof that the purchase failed.

See [Verify the purchase](https://docs.o1.exchange/launchpad/bot/dev-buy.md#verify-the-purchase) before retrying.

## Activation or deposit failed

Check the selected network, connected Owner wallet, wallet rejection messages and available Base ETH for gas. An HTTP or RPC error does not by itself mean an X permission or API-key permission is missing.

If a transaction was sent, inspect its receipt before repeating setup or a transfer. A successfully activated smart account does not need to be recreated just because a later request fails.

## What to include in a support report

Share the Post URL, approximate time, Base smart-account address, displayed error, request status and transaction hash if available. Explain whether the request included Dev Buy and its amount.

Do not share private keys, seed phrases, API secrets, authentication headers or private RPC URLs. Use the official [community channels](https://docs.o1.exchange/community/socials.md) for help.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.