> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_estimateGas

> Estimates the gas required for a transaction.

Returns an estimate of how much gas is required to execute a transaction. The estimate may be larger than the gas actually used at execution time.

> [!NOTE]
>
> Since [Denim](https://docs.base.org/upgrades/denim/overview.md), Base produces a canonical block every 200ms and Flashblocks are retired. The `"pending"` tag is still accepted, but it no longer returns Flashblocks preconfirmation state. Use `"latest"` for the newest canonical state. See [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md).

## Parameters

**transaction** `object` *required*

The transaction object to estimate gas for.

**Transaction Fields**

**from** `string`

Address the transaction is sent from. Optional.

**to** `string`

Address the transaction is sent to. Optional for contract deployments.

**gas** `string`

Gas limit. Optional; a high default is used if omitted.

**gasPrice** `string`

Gas price in wei for legacy transactions. Optional.

**maxFeePerGas** `string`

EIP-1559 maximum total fee per gas. Optional.

**maxPriorityFeePerGas** `string`

EIP-1559 maximum priority fee per gas. Optional.

**value** `string`

Value to transfer in wei. Optional.

**data** `string`

ABI-encoded call data. Optional.

**block** `string`

Block to estimate against. Optional; defaults to `"latest"`.

## Returns

**result** `string`

The estimated gas amount as a hexadecimal integer.

## Error Codes

| Code | Message | Description |
| - | - | - |
| `-32000` | execution reverted | The transaction would revert. The error `data` field may contain a revert reason. |

## Example

```bash Standard lines wrap expandable theme={null}
curl https://mainnet.base.org \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_estimateGas",
    "params": [{
      "from": "0xd3CdA913deB6f4967b2Ef66ae97DE114a83bcc01",
      "to": "0x4200000000000000000000000000000000000006",
      "value": "0x2c68af0bb14000"
    }],
    "id": 1
  }'
```

```json Response theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x5208"
}
```
