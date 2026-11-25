> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_getBlockReceipts

> Returns all transaction receipts for a block.

Returns all transaction receipts for a given block.

> [!NOTE]
>
> This method is available on the public Base RPC endpoints (`mainnet.base.org`, `sepolia.base.org`). They are rate-limited and not suitable for production traffic. For production use, choose an RPC provider from the [Builder Stack](https://docs.base.org/get-started/builder-stack.md).

> [!NOTE]
>
> Since [Denim](https://docs.base.org/upgrades/denim/overview.md), Base produces a canonical block every 200ms and Flashblocks are retired. The `"pending"` tag is still accepted, but it no longer returns Flashblocks preconfirmation state. Use `"latest"` for the newest canonical block. See [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md).

## Parameters

**block** `string` *required*

Block number in hex, or `"latest"`, `"pending"`, `"safe"`, `"finalized"`, `"earliest"`.

## Returns

**result** `array`

Array of receipt objects for each transaction in the block. See [`eth_getTransactionReceipt`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getTransactionReceipt) for the receipt object shape.

## Denim Millisecond Timestamps

> [!NOTE]
>
> Denim is live on Base Mainnet and Base Sepolia. See the [Denim overview](https://docs.base.org/upgrades/denim/overview.md).

Since Denim, each mined log nested in a receipt adds an optional `blockTimestampMs` field with the originating block's timestamp in milliseconds. The receipt object itself does not add a top-level millisecond timestamp.

A log omits `blockTimestampMs` when its block's BaseTime metadata is unavailable. See [200ms Blocks](https://docs.base.org/upgrades/denim/200ms-blocks.md#rpc) for the full list of affected methods.

## Example

```bash Standard (latest) theme={null}
curl https://mainnet.base.org \
  -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBlockReceipts","params":["latest"],"id":1}'
```

```json Response lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "transactionHash": "0xabc123...",
      "blockNumber": "0x158a0e9",
      "status": "0x1",
      "gasUsed": "0x5208",
      "type": "0x2"
    }
  ]
}
```
