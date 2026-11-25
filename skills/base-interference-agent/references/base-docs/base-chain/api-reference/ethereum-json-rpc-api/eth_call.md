> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_call

> Executes a message call without creating a transaction.

Executes a message call immediately without broadcasting a transaction to the network. No gas is consumed on-chain. Used to read contract state or simulate calls.

> [!NOTE]
>
> Since [Denim](https://docs.base.org/upgrades/denim/overview.md), Base produces a canonical block every 200ms and Flashblocks are retired. The `"pending"` tag is still accepted, but it no longer returns Flashblocks preconfirmation state. Use `"latest"` for the newest canonical state. See [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md).

## Parameters

**transaction** `object` *required*

The transaction call object.

**Transaction Fields**

**from** `string`

Address the call is sent from. Optional; defaults to the zero address.

**to** `string` *required*

Address the call is directed to.

**gas** `string`

Gas provided for the call as a hexadecimal integer. Defaults to a high limit if omitted.

**gasPrice** `string`

Gas price in wei as a hexadecimal integer. For legacy transactions. Optional.

**maxFeePerGas** `string`

EIP-1559 maximum total fee per gas. Optional.

**maxPriorityFeePerGas** `string`

EIP-1559 maximum priority fee per gas. Optional.

**value** `string`

Value transferred in wei as a hexadecimal integer. Optional.

**data** `string`

ABI-encoded call data: the 4-byte function selector followed by encoded arguments. Optional.

**block** `string` *required*

Block number in hex, or `"latest"`, `"pending"`, `"safe"`, `"finalized"`, `"earliest"`.

## Returns

**result** `string`

The return value of the call as a hex-encoded byte array.

## Error Codes

| Code | Message | Description |
| - | - | - |
| `-32000` | execution reverted | The call reverted. The `data` field in the error object contains the ABI-encoded revert reason when available. |

## Example

```bash Standard (latest) lines wrap expandable theme={null}
curl https://mainnet.base.org \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [
      {
        "to": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "data": "0x70a082310000000000000000000000004200000000000000000000000000000000000006"
      },
      "latest"
    ],
    "id": 1
  }'
```

```json Response theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x0000000000000000000000000000000000000000000000000000000005f5e100"
}
```
