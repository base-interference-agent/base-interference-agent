> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_getStorageAt

> Returns the value of a storage slot at an address.

Returns the value from a storage position at a given address.

> [!NOTE]
>
> Since [Denim](https://docs.base.org/upgrades/denim/overview.md), Base produces a canonical block every 200ms and Flashblocks are retired. The `"pending"` tag is still accepted, but it no longer returns Flashblocks preconfirmation state. Use `"latest"` for the newest canonical state. See [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md).

## Parameters

**address** `string` *required*

The 20-byte address of the storage.

**position** `string` *required*

The storage slot position as a hexadecimal integer.

**block** `string` *required*

Block number in hex, or `"latest"`, `"pending"`, `"safe"`, `"finalized"`, `"earliest"`.

## Returns

**result** `string`

The value at the storage position as a 32-byte hex string.

## Example

```bash Standard (latest) lines wrap expandable theme={null}
curl https://mainnet.base.org \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getStorageAt",
    "params": ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", "0x0", "latest"],
    "id": 1
  }'
```

```json Response theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x0000000000000000000000000000000000000000000000000000000000000001"
}
```
