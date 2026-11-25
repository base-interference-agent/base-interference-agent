> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_chainId

> Returns the chain ID of the current network.

Returns the chain ID of the current network per [EIP-695](https://eips.ethereum.org/EIPS/eip-695).

## Parameters

No parameters.

## Returns

**result** `string`

The chain ID as a hexadecimal string. `"0x2105"` (8453) for Base Mainnet, `"0x14a34"` (84532) for Base Sepolia.

## Example

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "method": "eth_chainId",
  "params": [],
  "id": 1
}
```

```json Response (Base Mainnet) theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x2105"
}
```

```json Response (Base Sepolia) theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x14a34"
}
```
