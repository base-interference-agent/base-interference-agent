> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# base_transactionStatus

> Checks whether a transaction is in the node mempool. Not available on the public Base endpoints.

Checks whether a specific transaction is present in the node's mempool. Use it to confirm that a node received a submitted transaction before the transaction appears in a block. When the node is configured to forward transactions to a sequencer, it forwards the status query there.

> [!WARNING]
>
> The public endpoints `https://mainnet.base.org` and `https://sepolia.base.org` reject this method with error `-32603` (`failed to fetch transaction status: Request rejected 403`). Call it on your own [Base node](https://docs.base.org/specifications/node-operators/run-a-node.md) or on an [RPC provider](https://docs.base.org/get-started/builder-stack.md) that exposes it.

> [!NOTE]
>
> Requires [base/base](https://github.com/base/base) minimum client version v0.3.0.

## Parameters

**transactionHash** `string` *required*

The 32-byte transaction hash to query.

## Returns

**result** `object`

Transaction status object.

**Status Fields**

**status** `string`

`"Known"` if the transaction is present in the mempool. `"Unknown"` if it has not been seen by this node.

## Example

```bash cURL theme={null}
curl http://localhost:8545 \
  -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"base_transactionStatus","params":["0xabc123..."],"id":1}'
```

```json Known theme={null}
{"jsonrpc": "2.0", "id": 1, "result": {"status": "Known"}}
```

```json Unknown theme={null}
{"jsonrpc": "2.0", "id": 1, "result": {"status": "Unknown"}}
```

```json Public endpoint theme={null}
{"jsonrpc": "2.0", "id": 1, "error": {"code": -32603, "message": "failed to fetch transaction status: Request rejected `403`"}}
```
