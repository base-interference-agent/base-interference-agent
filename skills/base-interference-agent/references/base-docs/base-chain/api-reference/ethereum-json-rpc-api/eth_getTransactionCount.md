> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_getTransactionCount

> Returns the number of transactions sent from an address (the nonce).

Returns the number of transactions sent from an address. This value is the account's current nonce — the value to use as `nonce` when constructing the next transaction.

> [!NOTE]
>
> Since [Denim](https://docs.base.org/upgrades/denim/overview.md), Base produces a canonical block every 200ms and Flashblocks are retired. The `"pending"` tag is still accepted, but it no longer returns Flashblocks preconfirmation state. Use `"latest"` for the count of transactions in canonical blocks. If you submit transactions at high frequency, track the next nonce in your application and reconcile it with `"latest"`, rather than relying on a single RPC read to avoid nonce gaps or reuse. See [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md).

## Parameters

**address** `string` *required*

The 20-byte address to query.

**block** `string` *required*

Block number in hex, or `"latest"`, `"pending"`, `"safe"`, `"finalized"`, `"earliest"`.

## Returns

**result** `string`

The transaction count (nonce) as a hexadecimal string.

## Example

```bash Standard (latest confirmed) lines wrap expandable theme={null}
curl https://mainnet.base.org \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getTransactionCount",
    "params": ["0x742d35Cc6634C0532925a3b8D4C9dD0b4f3BaEa", "latest"],
    "id": 1
  }'
```

```json Response theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x4d2"
}
```
