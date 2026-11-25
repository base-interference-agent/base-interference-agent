> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_getTransactionByBlockNumberAndIndex

> Returns a transaction by block number and index position.

Returns information about a transaction given a block number and the transaction's index position within that block.

## Parameters

**block** `string` *required*

Block number in hex, or `"latest"`, `"pending"`, `"safe"`, `"finalized"`, `"earliest"`.

**index** `string` *required*

The transaction index position as a hexadecimal integer.

## Returns

**result** `object | null`

A transaction object, or `null` if not found. See [`eth_getTransactionByHash`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getTransactionByHash) for the full field list.

## Example

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionByBlockNumberAndIndex",
  "params": ["latest", "0x0"],
  "id": 1
}
```

```json Response (type 0x7e deposit, index 0x0) lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "blockHash": "0x491bca01d4bc076d60833dbd973fe031a74e7ae31866bf70d077619e09edb6ff",
    "blockNumber": "0x2c31b0b",
    "depositReceiptVersion": "0x1",
    "from": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0001",
    "gas": "0xf4240",
    "gasPrice": "0x0",
    "hash": "0x03c8f106f18ad94190e763e21b584c5825b2f4c61f1274c0e8abe65b4476cd51",
    "input": "0x3db6be2b...",
    "mint": "0x0",
    "nonce": "0x2c31b0e",
    "r": "0x0",
    "s": "0x0",
    "sourceHash": "0xe40ffb1b9f98a24b21e90e3a3cfe49de1eed195618e943da4d029881d3b3e055",
    "to": "0x4200000000000000000000000000000000000015",
    "transactionIndex": "0x0",
    "type": "0x7e",
    "v": "0x0",
    "value": "0x0",
    "yParity": "0x0"
  }
}
```
