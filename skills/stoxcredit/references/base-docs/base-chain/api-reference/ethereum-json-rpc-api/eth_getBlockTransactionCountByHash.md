> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_getBlockTransactionCountByHash

> Returns the number of transactions in a block by block hash.

Returns the number of transactions in a block matching the given block hash.

## Parameters

**blockHash** `string` *required*

The 32-byte block hash.

## Returns

**result** `string`

The number of transactions in the block as a hexadecimal integer. `null` if no block was found.

## Example

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "method": "eth_getBlockTransactionCountByHash",
  "params": ["0x5c330e55a190f82ea486b61e5b12e27dfb4fb3cecfc5746886ef38ca1281bce8"],
  "id": 1
}
```

```json Response theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1f"
}
```
