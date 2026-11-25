> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# List Positions

> Return an address's share balance and current asset value in every Base Earn vault.

Returns wallet-held shares and their current underlying-asset valuation. One row per vault in the catalog, including zero balances. For Upshift, shares already in the redemption queue are not included; see [Get Redemption](https://docs.base.org/sdks/base-earn/api-reference/get-redemption.md).

A valuation is not guaranteed withdrawal proceeds.

## Query Parameters

**address** `string` *required*

The end user's wallet, as a 20-byte `0x` hex address.

```bash cURL wrap theme={null}
curl "https://api.base.org/earn/v1/lend/positions?address=0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
```

```typescript TypeScript wrap theme={null}
const { positions } = await earn("GET", `/lend/positions?address=${encodeURIComponent(address)}`);
const position = positions.find(p => p.vaultId === vault.vaultId);
```

```python Python wrap theme={null}
positions = earn("GET", f"/lend/positions?address={address}")["positions"]
position = next((p for p in positions if p["vaultId"] == vault["vaultId"]), None)
```

```json 200 (Upshift row) lines expandable wrap theme={null}
{
  "positions": [
    {
      "vaultId": "8d068ba8-072e-421c-b553-6cf989cefeec",
      "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "network": "base",
      "asset": { "address": "0xcb585250f852C6c6bf90434AB21A00f02833a4af", "symbol": "cbXRP", "decimals": 6 },
      "share": { "address": "0xf7CF01e5d58b3F1Ba228920978c47B5B79b67bF4", "symbol": "upXRP", "decimals": 6 },
      "shares": "999682",
      "assets": "999999",
      "assetsAfterFee": "999996"
    }
  ],
  "nextPageToken": ""
}
```

## Response Fields

**shares** `string`

The wallet's share-token balance, in atomic units of the share token.

**assets** `string`

The current value of `shares`, in atomic units of the asset.

**assetsAfterFee** `string`

Upshift only. `assets` net of the vault's current withdrawal fee. Absence does not mean zero fees.
