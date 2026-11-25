> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Validity Transaction RPC

> Submit a signed raw transaction with validity predicates.

Submits a signed legacy, EIP-2930, or EIP-1559 transaction with predicates that control when Base can include it. EIP-1559 is recommended.

> [!WARNING]
>
> This method is available on Base Mainnet and Base Sepolia through the sequencer endpoints listed in [Connect to Base](https://docs.base.org/get-started/connect-to-base.md), and on Vibenet.

## Parameters

Pass two parameters. The first is a signed, serialized transaction. The second contains a non-empty `validity` array.

The `validity` array must include a `block_number` predicate with an upper bound (`<`, `<=`, or `=`). The last block it allows must be no earlier than the block being built and within 60 seconds of submission. See [Expiry](https://docs.base.org/specifications/build-transaction/predicates-and-safety.md#expiry).

The block number in this example is a placeholder. Before you submit, call [`eth_blockNumber`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_blockNumber) and use the latest block number plus `10`, as a `0x`-prefixed hexadecimal string.

```json Request lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "base_sendRawTransactionValidity",
  "params": [
    "0x<signed-raw-transaction>",
    {
      "validity": [
        {
          "type": "storage",
          "params": {
            "address": "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
            "slot": "0x8",
            "mask": "0xff",
            "op": "=",
            "value": "0x2a"
          }
        },
        {
          "type": "block_number",
          "params": {
            "op": "<=",
            "value": "0x11a6a1"
          }
        }
      ]
    }
  ]
}
```

## Predicates

| Type | Parameters |
| - | - |
| `balance` | `address`, `op`, `value` |
| `nonce` | `address`, `op`, `value` |
| `storage` | `address`, `slot`, `op`, `value`, optional `mask` |
| `block_number` | `op`, `value` |
| `flashblock_index` | Not supported. See the warning below. |

The supported operators are `<`, `<=`, `=`, `!=`, `>`, and `>=`. Predicate values use `0x`-prefixed hexadecimal strings. The `mask` defaults to all ones.

> [!WARNING]
>
> The `flashblock_index` predicate type is no longer supported. The field remains in the request format for compatibility, but the method rejects any request that includes it with the error `flashblock_index predicates are not supported after Denim: blocks are built every 200ms without flashblocks`. Use `block_number` to bound inclusion.

## Limits

In [base/base v1.4.2](https://github.com/base/base/blob/v1.4.2/crates/execution/txpool/src/validity.rs), the node accepts up to 64 predicates per transaction by default. Treat this as an implementation default, not a stable API guarantee. The method rejects a request with more predicates than the limit.

Each transaction also needs a `block_number` expiry. Read [Expiry](https://docs.base.org/specifications/build-transaction/predicates-and-safety.md#expiry) for expiry rules.

These docs do not yet specify a separate storage-read cost or limit for `storage` predicates. They also do not specify whether validity transactions propagate to other nodes. Do not depend on either behavior.

## Returns

**result** `string`

The 32-byte hash of the submitted transaction.

Returning a hash confirms acceptance. It does not confirm inclusion.

## Errors

The method returns JSON-RPC errors. Handle an unavailable method, invalid parameters, and a missing transaction hash.

Error codes and messages are not yet stable.

Read [Predicates and Safety](https://docs.base.org/specifications/build-transaction/predicates-and-safety.md) for evaluation rules. Read [Troubleshooting](https://docs.base.org/specifications/build-transaction/troubleshooting.md) when a transaction is not included.
