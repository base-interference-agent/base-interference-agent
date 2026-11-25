> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_syncing

> Returns the sync status of the node.

Returns the sync status of the node. Returns `false` when the node is fully synced.

## Parameters

No parameters.

## Returns

**result** `object | boolean`

`false` if the node is fully synced. Otherwise, a sync status object.

**Sync Status Fields (When Syncing)**

**startingBlock** `string`

Block at which the sync started (hex).

**currentBlock** `string`

Current block being processed (hex).

**highestBlock** `string`

Estimated highest block (hex).

## Example

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "method": "eth_syncing",
  "params": [],
  "id": 1
}
```

```json Response (synced) theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": false
}
```
