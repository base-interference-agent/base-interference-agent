> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_simulateV1

> Simulates one or more transaction bundles against canonical chain state, with optional state overrides, block overrides, and transfer tracing.

Simulates one or more transaction bundles against the canonical chain state at the block you specify. Supports state overrides, multi-block simulation, and optional transfer tracing. The simulation does not broadcast transactions or change chain state.

## Parameters

**simulationPayload** `object` *required*

The simulation configuration.

**Simulation Payload Fields**

**blockStateCalls** `array` *required*

Array of block state call objects. Each object represents one simulated block.

**Block State Call Fields**

**calls** `array`

Array of transaction call objects to simulate within this block.

**stateOverrides** `object`

Per-address state overrides applied before simulation (e.g., balance, nonce, code, storage). Optional.

**blockOverrides** `object`

Block-level overrides (e.g., `number`, `timestamp`). Optional.

**traceTransfers** `boolean`

If `true`, ETH transfer events are included as logs in the result. Defaults to `false`.

**validation** `boolean`

If `true`, transaction validation (nonce, balance) is enforced. Defaults to `false`.

**blockParameter** `string` *required*

Block to simulate on top of: a block number in hex, or `"latest"`, `"pending"`, `"safe"`, or `"finalized"`. On Base, `"pending"` resolves to the latest canonical block, so `"latest"` and `"pending"` return the same state.

## Returns

**result** `array`

Array of simulated block results, one per entry in `blockStateCalls`. Each entry is a full block object with a `calls` field embedded alongside standard block fields.

**Block Result Fields**

**number** `string`

Simulated block number (hex).

**hash** `string`

Simulated block hash.

**parentHash** `string`

Parent block hash.

**timestamp** `string`

Block timestamp (hex).

**gasLimit** `string`

Gas limit (hex).

**gasUsed** `string`

Total gas used by the simulated calls (hex).

**baseFeePerGas** `string`

Base fee per gas (hex).

**stateRoot** `string`

Always `"0x000...000"` — simulation does not commit state to the trie.

**calls** `array`

Array of individual call results.

**Call Result Fields**

**status** `string`

`"0x1"` for success, `"0x0"` for failure.

**gasUsed** `string`

Gas used as a hexadecimal integer.

**returnData** `string`

Hex-encoded return data.

**logs** `array`

Logs emitted (including ETH transfer logs if `traceTransfers` is `true`).

**error** `string`

Revert reason if the call failed. Optional.

## Example

```bash cURL lines wrap expandable theme={null}
curl https://sepolia.base.org \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_simulateV1",
    "params": [
      {
        "blockStateCalls": [
          {
            "calls": [{"to": "0x...", "data": "0x..."}],
            "stateOverrides": {}
          }
        ],
        "traceTransfers": true,
        "validation": true
      },
      "latest"
    ],
    "id": 1
  }'
```

```json Response lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "baseFeePerGas": "0x0",
      "blobGasUsed": "0x39d0",
      "calls": [
        {
          "gasUsed": "0x5208",
          "logs": [],
          "returnData": "0x",
          "status": "0x1"
        }
      ],
      "difficulty": "0x0",
      "excessBlobGas": "0x0",
      "extraData": "0x01000003e80000000f00000000004c4b40",
      "gasLimit": "0x7270e00",
      "gasUsed": "0x5208",
      "hash": "0x2f2f692821995e39653f63164b2d5d0e0bba66c86c2a199fd3009c0b9906c7b0",
      "logsBloom": "0x000...000",
      "miner": "0x4200000000000000000000000000000000000011",
      "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "nonce": "0x0000000000000000",
      "number": "0x2c31c49",
      "parentBeaconBlockRoot": "0x64e625f8bc74f78539f962aa09d522c63576ff6ad57170c668882d99e669ef52",
      "parentHash": "0x9653660afa4fca3976a21d42ebf849c337e9840993f050fee3affc673a573bf8",
      "receiptsRoot": "0xf78dfb743fbd92ade140711c8bbc542b5e307f0ab7984eff35d751969fe57efa",
      "requestsHash": "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "size": "0x2a6",
      "stateRoot": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "timestamp": "0x6a10957f",
      "transactions": [
        "0xa401668a06b038c488c1abc013676dfe63fc645d182ece34d8b3f40f45689279"
      ],
      "transactionsRoot": "0x0b1328c457d7a8108ea9f2559142890491b680fdb691720b3d0c857c3d11002c",
      "uncles": [],
      "withdrawals": [],
      "withdrawalsRoot": "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
  ]
}
```
