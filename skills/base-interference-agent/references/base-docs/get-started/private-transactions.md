> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Private Transactions

> Run confidential enterprise payments on Base with Base Ledgers: balances, transfers, and counterparties stay private while funds settle onchain.

> [!TIP]
>
> Base Ledgers is in early access. [Request access](https://www.coinbase.com/developer-platform/developer-interest) to run your own ledger, or use [Coinbase Managed](https://docs.cdp.coinbase.com/payments/overview) for a managed service built on it.

Run your own private payments product on Base with **Base Ledgers**. Balances, transfers, and counterparties stay off public block explorers, while funds settle on Base through a single `Portal` contract. Compliance is enforced at the ledger level with your own KYC controls, funds are self-custodied in a contract you control, and every deposit and withdrawal is an onchain call you can bundle atomically with other Base actions.

## Guides

> [card] [Deposit to a ledger](https://docs.base.org/build-on-base/ledgers/deposit.md)
>
> Move funds from Base into the ledger with an encrypted recipient.

> [card] [Transfer inside a ledger](https://docs.base.org/build-on-base/ledgers/transfer.md)
>
> Move balances inside the ledger with nothing on the public chain.

> [card] [Withdraw from a ledger](https://docs.base.org/build-on-base/ledgers/withdraw.md)
>
> Release funds back to Base while keeping the account private.

## Why Base Ledgers

* **Private by default.** Balances, transactions, and transfers stay off public block explorers. Deposits hide the recipient and withdrawals hide the sender, so the two stay unlinkable.
* **Compliant.** An operator gates the ledger with its own KYC and compliance controls.
* **Composable with Base.** Deposits and withdrawals are onchain calls you can bundle with other actions (deposit-and-act or withdraw-and-swap) that settle together or not at all.
* **Configurable.** Run a ledger on your own terms with self-custodied funds and custom logic for how transactions are processed.

## Built For

> [card] B2B payments
>
> Pay vendors without broadcasting your supplier list to the public chain.

> [card] Payroll & payouts
>
> Run onchain payroll without publishing what every employee or contractor earns.

> [card] Treasury operations
>
> Move balances between corporate accounts, custodians, and counterparties privately.

> [card] Cross-border remittance
>
> Run KYC-gated corridors where sender, recipient, and amount aren't exposed.

## How It Works

A payment moves through three stages: funds enter through the Portal contract, move privately within the ledger, and exit back to Base. The operator runs the services that process each step and decides how to authorize withdrawals.

1. **[Deposit](https://docs.base.org/build-on-base/ledgers/deposit.md).** A user moves funds from Base into the ledger. The recipient is encrypted, so deposits to one account stay unlinked.
2. **[Transfer inside a ledger](https://docs.base.org/build-on-base/ledgers/transfer.md).** Inside the ledger, users transfer, swap, and earn yield while balances and activity remain private.
3. **[Withdraw](https://docs.base.org/build-on-base/ledgers/withdraw.md).** A user moves funds back to Base. Onchain, a withdrawal reveals the asset and amount but not the account behind it.
