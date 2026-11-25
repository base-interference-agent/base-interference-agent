> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_unsubscribe

> Cancels an active WebSocket subscription.

Cancels a subscription created with [`eth_subscribe`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_subscribe). The subscription ID is no longer valid after this call.

## Parameters

**subscriptionId** `string` *required*

The subscription ID returned by `eth_subscribe`.

## Returns

**result** `boolean`

`true` if the subscription was successfully cancelled, `false` if the subscription ID was not found.

## Example

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_unsubscribe",
  "params": ["0x1887ec8b9589ccad00000000000532da"]
}
```

```json Response (success) theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": true
}
```

```json Response (not found) theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": false
}
```
