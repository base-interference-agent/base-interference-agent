> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_getTransactionReceipt

> Returns the receipt for a mined transaction. Receipts are only available after a transaction is included in a block.

Returns the receipt for a transaction by its hash. Returns `null` for transactions that are pending or have not been mined.

> [!NOTE]
>
> Receipts are only available for mined transactions. Base produces a canonical block every 200ms, so a receipt is available once the transaction is included in one of those blocks. To detect inclusion as it happens, subscribe to `eth_subscribe("newHeads")` and fetch transactions for each canonical block.

> [!NOTE]
>
> Since [Denim](https://docs.base.org/upgrades/denim/overview.md), Base produces a canonical block every 200ms and Flashblocks are retired, so `newFlashblockTransactions` and Flashblocks preconfirmation state are unavailable. See [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md).

## Parameters

**transactionHash** `string` *required*

The 32-byte transaction hash.

## Returns

**result** `object | null`

The transaction receipt object, or `null` if the transaction has not been mined.

**Receipt Fields**

**transactionHash** `string`

32-byte transaction hash.

**transactionIndex** `string`

Index of the transaction in the block (hex).

**blockHash** `string`

32-byte hash of the block containing this transaction.

**blockNumber** `string`

Block number (hex).

**from** `string`

20-byte sender address.

**to** `string`

20-byte recipient address. `null` for contract deployments.

**cumulativeGasUsed** `string`

Total gas used in the block up to and including this transaction (hex).

**effectiveGasPrice** `string`

Actual gas price paid per unit of gas for this transaction (hex).

**gasUsed** `string`

Gas used by this specific transaction (hex).

**contractAddress** `string | null`

Address of the created contract, or `null` if not a deployment.

**logs** `array`

Array of log objects emitted by this transaction. For blocks produced after Denim activated, each log includes an optional `blockTimestampMs` field with the block timestamp in milliseconds. See [200ms Blocks](https://docs.base.org/upgrades/denim/200ms-blocks.md#log-and-receipt-timestamps).

**logsBloom** `string`

256-byte bloom filter for the logs in this receipt.

**type** `string`

Transaction type: `"0x0"` Legacy, `"0x1"` Access List, `"0x2"` EIP-1559, `"0x7e"` Deposit (L1→L2).

**status** `string`

`"0x1"` for success, `"0x0"` for failure (revert).

**blobGasUsed** `string`

Blob gas consumed by this transaction (EIP-4844). `null` for non-blob transactions.

**l1Fee** `string`

Total L1 data fee paid for this transaction (hex). Base L2 field.

**l1GasUsed** `string`

Amount of L1 gas used for the L1 data portion of this transaction (hex). Base L2 field.

**l1GasPrice** `string`

L1 gas price at the time of inclusion (hex). Base L2 field.

**l1BlobBaseFee** `string`

Blob base fee on L1 at the time of inclusion (hex). Base L2 field.

**l1BlobBaseFeeScalar** `string`

Scalar applied to the blob base fee for L1 fee calculation (hex). Base L2 field.

**l1BaseFeeScalar** `string`

Scalar applied to the L1 base fee for L1 fee calculation (hex). Base L2 field.

**daFootprintGasScalar** `string`

Base-specific DA footprint scalar (hex).

**depositNonce** `string`

Nonce used for the deposit transaction (hex). Present on type `0x7e` transactions only.

**depositReceiptVersion** `string`

Deposit receipt version (hex). Present on type `0x7e` transactions only.

## Error Codes

| Code | Message | Description |
| - | - | - |
| `-32000` | transaction indexing is in progress | The node is still indexing transactions. Retry after the node has finished syncing. |

## Example

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionReceipt",
  "params": ["0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238"],
  "id": 1
}
```

```json Response (type 0x7e deposit) lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "blobGasUsed": null,
    "blockHash": "0x491bca01d4bc076d60833dbd973fe031a74e7ae31866bf70d077619e09edb6ff",
    "blockNumber": "0x2c31b0b",
    "contractAddress": null,
    "cumulativeGasUsed": "0xb48a",
    "daFootprintGasScalar": "0x94",
    "depositNonce": "0x2c31b0e",
    "depositReceiptVersion": "0x1",
    "effectiveGasPrice": "0x0",
    "from": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0001",
    "gasUsed": "0xb48a",
    "l1BaseFeeScalar": "0x8dd",
    "l1BlobBaseFee": "0x582765",
    "l1BlobBaseFeeScalar": "0x101c12",
    "l1Fee": "0x0",
    "l1GasPrice": "0x6bdbf6f",
    "l1GasUsed": "0x71d",
    "logs": [],
    "logsBloom": "0x000...000",
    "status": "0x1",
    "to": "0x4200000000000000000000000000000000000015",
    "transactionHash": "0x03c8f106f18ad94190e763e21b584c5825b2f4c61f1274c0e8abe65b4476cd51",
    "transactionIndex": "0x0",
    "type": "0x7e"
  }
}
```

```json Not Found theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": null
}
```
