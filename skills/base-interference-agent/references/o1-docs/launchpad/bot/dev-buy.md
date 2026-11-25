> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Dev Buy

> Buy tokens during an ETH-paired Base launch with an explicit amount and atomic execution.

Dev Buy is an optional purchase made in the same transaction as your launch. It is **off unless you explicitly request it**. It is not a command to buy an existing token.

## Example

Attach one supported image and post from your connected X account:

```text theme={null}
@o1_bot Launch on Base
Name: My Token
Symbol: MYTOKEN
Quote: ETH
Dev Buy: 0.001 ETH
```

The amount is the purchase input, **not** the total transaction budget. Your smart account also needs ETH for the launch fee and network gas.

## Requirements

| Setting | Bot V1 |
| - | - |
| Chain and pair | Base, with `Quote: ETH` |
| Account | Activated user smart account with a valid launch permission |
| Amount | Explicit positive decimal ETH amount, up to 18 decimal places |
| Slippage tolerance | Fixed at 1%; not configurable through X |
| Token recipient | Your smart account |
| No-setup creator path | Dev Buy is not supported |

Do not use `max`, `all`, percentages, an omitted amount or a separate buy instruction. For a launch without a purchase, leave out the Dev Buy field.

## Execution and fees

The launch and purchase execute atomically. If the purchase cannot satisfy the protected minimum output, or another step reverts, the entire launch and purchase revert together. There is no successful launch with a silently skipped requested Dev Buy.

The purchase pays the pool's ordinary trading fee, but not the launch anti-snipe surcharge. The launch fee and network gas are separate. Slippage protection is not a guarantee of a future price or resale value.

> [!WARNING]
>
> A failure detected before submission does not send a launch transaction. A transaction submitted and then reverted can still consume network gas. If submission status is unknown, do not assume it failed and repost.

## Verify the purchase

After a successful launch:

1. Open the linked launch transaction and check the purchase and token transfers.
2. Open **Wallet** in the o1 Bot portal and inspect the smart account's token balance.
3. Use the token contract address, not just its name or symbol, to identify the asset.

Being the creator alone does not mean you hold tokens. Without a Dev Buy, the initial supply goes into locked liquidity. If the activity is still indexing, check the transaction before treating a missing asset row as a failed purchase.

Tokens held by the smart account can be [withdrawn to your bound Owner wallet](https://docs.o1.exchange/launchpad/bot/wallet-and-fees.md#withdraw-to-your-owner-wallet). The Bot itself cannot perform ordinary withdrawals or sell those tokens through X.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.