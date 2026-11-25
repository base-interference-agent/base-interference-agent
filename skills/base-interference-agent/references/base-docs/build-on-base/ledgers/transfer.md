> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Transfer Inside a Ledger

> Move balances between accounts inside a ledger while keeping the sender, recipient, and amount off the public chain.

> [!TIP]
>
> Base Ledgers is in early access. [Request access](https://www.coinbase.com/developer-platform/developer-interest) to run your own ledger, or use [Coinbase Managed](https://docs.cdp.coinbase.com/payments/overview) for a managed service built on it.

Once funds are in a ledger, accounts can transfer, swap, and earn yield while balances and activity stay off public block explorers. Only deposits and withdrawals touch Base. Everything in between is private. See [Private Transactions](https://docs.base.org/get-started/private-transactions.md).

## What's Exposed Onchain

| Data | Public? | Why |
| - | - | - |
| Sender | Hidden | The transfer stays inside the ledger. |
| Recipient | Hidden | The transfer stays inside the ledger. |
| Amount | Hidden | The transfer stays inside the ledger. |
| Activity | Hidden | Nothing about the transfer lands on Base. |

The ledger stays agnostic to the offchain system behind it, so you run your own bookkeeping and custom transaction logic.

## See Also

> [card] [Deposit to a ledger](https://docs.base.org/build-on-base/ledgers/deposit.md)
>
> Move funds from Base into a ledger.

> [card] [Withdraw from a ledger](https://docs.base.org/build-on-base/ledgers/withdraw.md)
>
> Move funds from a ledger back to Base.
