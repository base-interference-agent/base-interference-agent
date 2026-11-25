> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# net_version

> Returns the current network ID as a string.

Returns the current network ID as a decimal string.

## Parameters

No parameters.

## Returns

**result** `string`

The network ID as a decimal string. `"8453"` for Base Mainnet, `"84532"` for Base Sepolia.

## Example

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "method": "net_version",
  "params": [],
  "id": 1
}
```

```json Response (Base Mainnet) theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "8453"
}
```
