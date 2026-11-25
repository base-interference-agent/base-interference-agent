> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Deposit to a Ledger

> Move funds from Base into a private ledger through the Portal contract, with the recipient encrypted onchain.

> [!TIP]
>
> Base Ledgers is in early access. [Request access](https://www.coinbase.com/developer-platform/developer-interest) to run your own ledger, or use [Coinbase Managed](https://docs.cdp.coinbase.com/payments/overview) for a managed service built on it.

A deposit moves funds from Base into the ledger through the `Portal` contract. The asset, amount, and sender settle publicly on Base, but the recipient is encrypted, so many deposits to one account can't be linked. See [Private Transactions](https://docs.base.org/get-started/private-transactions.md).

## What's Exposed Onchain

| Data | Public? | Why |
| - | - | - |
| Asset | Public | The Portal settles the transfer on Base. |
| Amount | Public | The Portal settles the transfer on Base. |
| Sender | Public | The address that submits the deposit. |
| Recipient | Hidden | Encrypted so deposits to one account can't be linked or attributed. |

A deposit can also require an attestation or permission, for example to gate who can deposit.

## See Also

> [card] [Transfer inside a ledger](https://docs.base.org/build-on-base/ledgers/transfer.md)
>
> Move value privately between accounts.

> [card] [Withdraw from a ledger](https://docs.base.org/build-on-base/ledgers/withdraw.md)
>
> Move funds from a ledger back to Base.
