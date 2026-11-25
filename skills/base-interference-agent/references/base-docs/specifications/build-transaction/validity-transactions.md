> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Validity Transactions

> Submit signed transactions that Base considers when onchain conditions match.

Validity Transactions let you submit a signed transaction with conditions on Base state. The API supports legacy, EIP-2930, and EIP-1559 transactions; EIP-1559 is recommended. Use them for conditional swaps, withdrawals, and other state-dependent actions.

## How It Works

Submit a signed raw transaction and a non-empty `validity` array. The current API supports balance, nonce, storage, and block-number predicates. Base rejects transactions that use the retired `flashblock_index` predicate.

A transaction is eligible only when every predicate matches. Base checks predicates before inclusion. A pending transaction can become eligible after an earlier transaction changes the state it watches.

EIP-1559 Validity Transactions use normal fee fields. Eligibility does not reserve block space or guarantee inclusion.

## Lifetime and Privacy

Use `block_number` predicates to constrain when a transaction can be included. Use the sender's nonce when replacing a pending transaction.

Validity criteria are sent separately from the signed transaction. They do not appear in the resulting onchain transaction. Do not include secrets in calldata or predicate values.

## Next Steps

> [card] [Build a Validity Transaction](https://docs.base.org/specifications/build-transaction/build-a-validity-transaction.md)
>
> Sign and submit a transaction with Viem.

> [card] [Validity Transaction RPC](https://docs.base.org/specifications/build-transaction/base_sendRawTransactionValidity.md)
>
> Review the request format.

> [card] [Predicates and Safety](https://docs.base.org/specifications/build-transaction/predicates-and-safety.md)
>
> Learn predicate rules, safety limits, expiry, and replacement.

> [card] [Troubleshooting](https://docs.base.org/specifications/build-transaction/troubleshooting.md)
>
> Diagnose submission and inclusion issues.
