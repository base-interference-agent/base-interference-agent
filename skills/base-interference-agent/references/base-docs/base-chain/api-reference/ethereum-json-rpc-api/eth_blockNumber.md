> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_blockNumber

> Returns the number of the most recently mined block.

Returns the number of the most recently mined block.

## Parameters

No parameters.

## Returns

**result** `string`

The current block number as a hexadecimal string.

## Example

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 1
}
```

```json Response theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x158a0e9"
}
```
