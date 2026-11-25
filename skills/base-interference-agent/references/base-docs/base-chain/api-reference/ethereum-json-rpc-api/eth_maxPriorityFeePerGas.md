> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_maxPriorityFeePerGas

> Returns the suggested EIP-1559 priority fee (tip) per gas.

Returns a suggested value for `maxPriorityFeePerGas` to use in an EIP-1559 transaction. This is the tip paid to the sequencer on top of the base fee.

## Parameters

No parameters.

## Returns

**result** `string`

The suggested priority fee per gas in wei as a hexadecimal string.

## Example

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "method": "eth_maxPriorityFeePerGas",
  "params": [],
  "id": 1
}
```

```json Response theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0xf4240"
}
```
