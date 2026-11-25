> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Troubleshooting

> Diagnose validity transaction submission and inclusion issues.

Use [`eth_getTransactionReceipt`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getTransactionReceipt) to confirm onchain inclusion.

For general transaction issues such as fees, nonces, and gas limits, see [Troubleshooting Transactions](https://docs.base.org/specifications/transactions/troubleshooting-transactions.md).

## RPC Method Is Unavailable

Use an endpoint that supports `base_sendRawTransactionValidity`. The method is available on Base Mainnet and Base Sepolia through the sequencer endpoints listed in [Connect to Base](https://docs.base.org/get-started/connect-to-base.md), and on Vibenet.

## Submission Fails

Confirm that the first parameter is a signed legacy, EIP-2930, or EIP-1559 transaction. Confirm that the second parameter has a non-empty `validity` array.

Check the predicate type, operator, and `0x`-prefixed hexadecimal values. See [Validity Transaction RPC](https://docs.base.org/specifications/build-transaction/base_sendRawTransactionValidity.md) for the request format.

If the error is `flashblock_index predicates are not supported after Denim: blocks are built every 200ms without flashblocks`, remove the `flashblock_index` predicate. Base no longer supports it.

Record the full JSON-RPC error when escalating an issue.

## Transaction Was Not Included

A transaction can remain pending because a predicate is false, another transaction has higher priority, it is replaced, or its maximum block passed.

## Transaction Expired

Submit a new signed transaction with a later `block_number` condition.

## Replacement Is Underpriced

Increase the fee fields, sign again, and retry with the same sender and nonce.

## Get Help

Include the network, RPC provider, transaction hash, predicate type, submission time, and JSON-RPC error. Do not share private keys, authentication data, or full signed transactions in public support channels.

For community support, use the `#developer-chat` channel in the [Base Discord](https://base.org/discord).
