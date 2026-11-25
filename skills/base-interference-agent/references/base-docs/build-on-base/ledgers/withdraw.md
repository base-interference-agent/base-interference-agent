> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Withdraw From a Ledger

> Move funds from a ledger back to Base through the Portal contract, keeping the account behind the withdrawal private.

> [!TIP]
>
> Base Ledgers is in early access. [Request access](https://www.coinbase.com/developer-platform/developer-interest) to run your own ledger, or use [Coinbase Managed](https://docs.cdp.coinbase.com/payments/overview) for a managed service built on it.

Funds leave a ledger through the `Portal` contract on Base. You choose how the Portal validates a withdrawal (from a signature check to full state-transition proofs), and the account behind it stays private, so deposits and withdrawals stay unlinkable. See [Private Transactions](https://docs.base.org/get-started/private-transactions.md).

## What's Exposed Onchain

| Data | Public? | Why |
| - | - | - |
| Asset | Public | Required to settle on Base. |
| Amount | Public | Required to settle on Base. |
| Sender | Hidden | Not revealed by the ledger Portal. |
| Recipient | Public | Required to settle on Base. |

`withdraw()` is an ordinary Base contract call, so you can batch it with other Base actions in one atomic transaction. They settle together or not at all.

## See Also

> [card] [Deposit to a ledger](https://docs.base.org/build-on-base/ledgers/deposit.md)
>
> Move funds from Base into a ledger.

> [card] [Transfer inside a ledger](https://docs.base.org/build-on-base/ledgers/transfer.md)
>
> Move value privately between accounts.
