> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_getBlockByNumber

> Returns block information by number.

Returns information about a block by its number.

> [!NOTE]
>
> Since [Denim](https://docs.base.org/upgrades/denim/overview.md), Base produces a canonical block every 200ms and Flashblocks are retired. The `"pending"` tag is still accepted, but it no longer returns Flashblocks preconfirmation state. Use `"latest"` for the newest canonical block. See [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md).

## Parameters

**block** `string` *required*

Block number in hex, or `"latest"`, `"pending"`, `"safe"`, `"finalized"`, `"earliest"`.

**fullTransactions** `boolean` *required*

If `true`, returns full transaction objects. If `false`, returns only transaction hashes.

## Returns

**result** `object`

A block object, or `null` if no block was found.

**Block Fields**

**number** `string`

Block number in hex.

**hash** `string`

Block hash.

**parentHash** `string`

Hash of the parent block.

**nonce** `string`

PoW nonce. Always `"0x0000000000000000"` on Base (PoS).

**sha3Uncles** `string`

Hash of the uncles list. Always empty on Base.

**logsBloom** `string`

Bloom filter for the block's logs.

**transactionsRoot** `string`

Root of the transaction trie.

**stateRoot** `string`

Root of the final state trie.

**receiptsRoot** `string`

Root of the receipts trie.

**miner** `string`

Address of the fee recipient (coinbase).

**difficulty** `string`

Always `"0x0"` on Base (PoS).

**mixHash** `string`

Present in all blocks; repurposed for PoS consensus (bytes32 hex).

**extraData** `string`

Arbitrary data field set by the sequencer.

**size** `string`

Block size in bytes (hex).

**gasLimit** `string`

Maximum gas allowed in this block (hex).

**gasUsed** `string`

Total gas used in this block (hex).

**timestamp** `string`

Unix timestamp (hex).

**timestampMs** `string`

Optional. Unix timestamp in milliseconds (hex). Present on blocks produced after Denim activated; omitted when the block's BaseTime metadata is unavailable. See [Denim Millisecond Timestamps](#denim-millisecond-timestamps).

**transactions** `array`

Array of transaction hashes or full transaction objects.

**uncles** `array`

Always `[]` on Base.

**withdrawals** `array`

Always `[]` on Base.

**withdrawalsRoot** `string`

Merkle root of the withdrawals list (EIP-4895, bytes32 hex).

**baseFeePerGas** `string`

EIP-1559 base fee per gas (hex).

**blobGasUsed** `string`

Total blob gas used (EIP-4844, hex).

**excessBlobGas** `string`

Excess blob gas for blob fee calculation (EIP-4844, hex).

**parentBeaconBlockRoot** `string`

Parent beacon block root (EIP-4788).

**requestsHash** `string`

Hash of requests (EIP-7685).

## Denim Millisecond Timestamps

Since Denim, the block object adds an optional `timestampMs` field: a JSON-RPC quantity containing the full Unix timestamp in milliseconds. The existing `timestamp` field stays in Unix seconds.

The response omits `timestampMs` when the block's BaseTime metadata has been pruned or is otherwise unavailable. See [200ms Blocks](https://docs.base.org/upgrades/denim/200ms-blocks.md#rpc) for the full list of affected methods.

## Example

```bash Standard (latest sealed block) lines wrap expandable theme={null}
curl https://mainnet.base.org \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getBlockByNumber",
    "params": ["latest", false],
    "id": 1
  }'
```

```json Response lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "baseFeePerGas": "0x4c5ba2",
    "blobGasUsed": "0xb9de0",
    "difficulty": "0x0",
    "excessBlobGas": "0x0",
    "extraData": "0x01000003e80000000500000000004c4b40",
    "gasLimit": "0x2625a00",
    "gasUsed": "0x85c85d",
    "hash": "0xc7606a636472047a045be098c777057201f12a903c2238fccb0e9b9e72264eb2",
    "logsBloom": "0x061a8d80...",
    "miner": "0x4200000000000000000000000000000000000011",
    "mixHash": "0xf7268a47462cbc19e56acb53e9d9d1716ef34293827b1c9ed3ceb003002f804d",
    "nonce": "0x0000000000000000",
    "number": "0x334692d",
    "parentBeaconBlockRoot": "0x3d5367430f7db600df51781cddf5a322e6948026771cb8d98e62bae81b4eb3d6",
    "parentHash": "0xc180c982f00fa42199f5c97bc415c8ed5ea485d9a943124ecf86c441b435764d",
    "receiptsRoot": "0xd1c586640c2e44303a6f3c9c2b22e832cdb5f573418d00cd8a1713b359533c48",
    "requestsHash": "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "size": "0x32d9",
    "stateRoot": "0x0644b4cdfec7b9f9856b1092d6bc6ff9218bf75802d821413b1f7990b1cfe2ca",
    "timestamp": "0x6aed6870",
    "timestampMs": "0x1a1af5ff7d8",
    "transactions": [
      "0xb4ddc8dc2601a068ca4e28833a3370cf603c8b9b3ccde208c30798eb5a92df95",
      "..."
    ],
    "transactionsRoot": "0xdf525be81fb51e1d0668a4395358251616f7cdcff83db37ab6c31f67714ffafb",
    "uncles": [],
    "withdrawals": [],
    "withdrawalsRoot": "0x7e243ab5d6c0c4cf4b4b12fdb3e58d971fb91453cf1fffdec2742f129d17c3dd"
  }
}
```
