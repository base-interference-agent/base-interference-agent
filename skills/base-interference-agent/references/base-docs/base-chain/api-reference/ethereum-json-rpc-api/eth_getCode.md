> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_getCode

> Returns the contract bytecode at an address.

Returns the compiled bytecode at a given address. Returns `"0x"` for externally owned accounts (EOAs).

> [!NOTE]
>
> Since [Denim](https://docs.base.org/upgrades/denim/overview.md), Base produces a canonical block every 200ms and Flashblocks are retired. The `"pending"` tag is still accepted, but it no longer returns Flashblocks preconfirmation state. Use `"latest"` for the newest canonical state. See [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md).

## Parameters

**address** `string` *required*

The 20-byte address to query.

**block** `string` *required*

Block number in hex, or `"latest"`, `"pending"`, `"safe"`, `"finalized"`, `"earliest"`.

## Returns

**result** `string`

The bytecode at the address as a hex string. `"0x"` if there is no code.

## Example

```bash Standard (latest) lines wrap expandable theme={null}
curl https://mainnet.base.org \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getCode",
    "params": ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", "latest"],
    "id": 1
  }'
```

```json Response theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x608060405234801561001057600080fd5b50..."
}
```
