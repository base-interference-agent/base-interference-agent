> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_getLogs

> Returns logs matching a filter.

Returns an array of all logs matching a given filter object. Particularly useful for indexing on-chain events.

> [!WARNING]
>
> Queries spanning large block ranges or high-activity contracts can time out or be rejected. Keep `fromBlock`-to-`toBlock` ranges under 2,000 blocks for reliable results. Node providers may enforce their own limits.

> [!NOTE]
>
> Since [Denim](https://docs.base.org/upgrades/denim/overview.md), Base produces a canonical block every 200ms and Flashblocks are retired. The `"pending"` tag is still accepted, but it no longer returns Flashblocks preconfirmation state. Query logs from canonical blocks, or stream them with [`eth_subscribe("logs")`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_subscribe). See [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md).

## Parameters

**filter** `object` *required*

The filter options. At least one criterion should be provided.

**Filter Fields**

**fromBlock** `string`

Start of the block range. Block number in hex or a block tag. Defaults to `"latest"`.

**toBlock** `string`

End of the block range. Block number in hex or a block tag. Defaults to `"latest"`.

**address** `string | array`

A contract address or array of addresses to filter by. Optional.

**topics** `array`

Array of 32-byte topic filters. Each position can be `null` (match any), a single topic hex string, or an array of hex strings (match any in the array). Position 0 is typically the `keccak256` hash of the event signature. Optional.

**blockHash** `string`

Restricts logs to the block with this hash. If provided, `fromBlock` and `toBlock` are ignored. Optional.

## Returns

**result** `array`

Array of log objects matching the filter.

**Log Object Fields**

**address** `string`

20-byte address of the contract that emitted the log.

**topics** `array`

Array of 0–4 indexed 32-byte topics. Topic 0 is typically the event signature hash.

**data** `string`

ABI-encoded non-indexed event parameters.

**blockNumber** `string`

Block number in which this log was emitted (hex).

**blockTimestamp** `string`

Unix timestamp of the block containing this log as a hex string. Base L2 extension to the standard Ethereum log schema.

**transactionHash** `string`

32-byte hash of the transaction that emitted this log.

**transactionIndex** `string`

Index of the transaction in the block (hex).

**blockHash** `string`

32-byte hash of the block.

**logIndex** `string`

Log's index position within the block (hex).

**removed** `boolean`

`true` if the log was removed due to a chain reorganization.

## Example

```bash Standard (block range) lines wrap expandable theme={null}
curl https://mainnet.base.org \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getLogs",
    "params": [{
      "fromBlock": "0x12ced00",
      "toBlock": "0x12ced28",
      "address": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]
    }],
    "id": 1
  }'
```

```json Response lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "address": "0x4200000000000000000000000000000000000006",
      "blockHash": "0x89f4c9e23a2f706f0afa9ca8f770c4b7dcbcb73ba7e9b1c29c4a8c1b90c31d24",
      "blockNumber": "0x2c31b0a",
      "blockTimestamp": "0x6a1092f7",
      "data": "0x00000000000000000000000000000000000000000000000080134424aad49d08",
      "logIndex": "0x0",
      "removed": false,
      "topics": [
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        "0x000000000000000000000000b2cc224c1c9fee385f8ad6a55b4d94e92359dc59",
        "0x00000000000000000000000051c72848c68a965f66fa7a88855f9f7784502a7f"
      ],
      "transactionHash": "0x2ca798df9d399b886fb3735414e8d35a20fec080e48eb5e2e75c0f6ec349a725",
      "transactionIndex": "0x1"
    }
  ]
}
```
