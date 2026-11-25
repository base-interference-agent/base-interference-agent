> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_gasPrice

> Returns the current gas price in wei.

Returns the current gas price in wei. For EIP-1559 transactions, use [`eth_maxPriorityFeePerGas`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_maxPriorityFeePerGas) and [`eth_feeHistory`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_feeHistory) instead.

## Parameters

No parameters.

## Returns

**result** `string`

The current gas price in wei as a hexadecimal string.

## Example

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "method": "eth_gasPrice",
  "params": [],
  "id": 1
}
```

```json Response theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x5b8d80"
}
```
