> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# List Vaults

> Return the Base Earn vault catalog with live onchain state, provider, withdrawal mode, token addresses, and decimals.

Returns the catalog of enabled vaults with live onchain state. Use it to resolve the `vaultId` you send on writes, the vault's `provider` and `withdrawalMode`, and token addresses and decimals.

For Morpho Earn, select a vault with `provider: "morpho"` and `withdrawalMode: "synchronous"`, then use its `vaultId` for deposits and withdrawals.

## Query Parameters

**network** `string` *required*

Must be `base`.

```bash cURL wrap theme={null}
curl "https://api.base.org/earn/v1/lend/vaults?network=base"
```

```typescript TypeScript wrap theme={null}
const { vaults } = await earn("GET", "/lend/vaults?network=base");
// configuredVaultId is the approved vault selected by your app or user.
const vault = vaults.find(v => v.vaultId === configuredVaultId &&
  v.provider === "morpho" && v.withdrawalMode === "synchronous");
if (!vault) throw new Error("Selected Morpho vault is not available");
```

```python Python wrap theme={null}
vaults = earn("GET", "/lend/vaults?network=base")["vaults"]
vault = next((v for v in vaults if v["vaultId"] == configured_vault_id
              and v["provider"] == "morpho"
              and v["withdrawalMode"] == "synchronous"), None)
if vault is None:
    raise RuntimeError("Selected Morpho vault is not available")
```

```json 200 (Upshift row) lines expandable wrap theme={null}
{
  "vaults": [
    {
      "vaultId": "8d068ba8-072e-421c-b553-6cf989cefeec",
      "network": "base",
      "name": "Clearstar cbXRP Yield Vault",
      "provider": "upshift",
      "withdrawalMode": "queued",
      "asset":  { "address": "0xcb585250f852C6c6bf90434AB21A00f02833a4af", "symbol": "cbXRP", "decimals": 6 },
      "share":  { "address": "0xf7CF01e5d58b3F1Ba228920978c47B5B79b67bF4", "symbol": "upXRP", "decimals": 6 },
      "vaultAddress": "0x2c4198361F5aF870EC2bE0fffe243610cDe7F84b",
      "depositsPaused": false,
      "withdrawalsPaused": false,
      "redemptionLagSeconds": "259200"
    }
  ],
  "nextPageToken": ""
}
```

The TypeScript and Python examples use the `earn()` helper from [Call the API](https://docs.base.org/sdks/base-earn/call-the-api.md). Response examples use illustrative values; never submit them as transactions.

## Response Fields

**vaultId** `string`

The identifier returned by discovery. Use it unchanged in API requests; it is not a contract address.

**provider** `string`

`morpho` or `upshift`.

**withdrawalMode** `string`

`synchronous` (Morpho) uses [Withdraw](https://docs.base.org/sdks/base-earn/api-reference/withdraw.md). `queued` (Upshift) uses [Request Withdraw](https://docs.base.org/sdks/base-earn/api-reference/request-withdraw.md) and [Claim](https://docs.base.org/sdks/base-earn/api-reference/claim.md).

**asset** `object`

The deposit token's `address`, `symbol`, and `decimals`. USDC uses 6 decimals.

**share** `object`

The share token's `address`, `symbol`, and `decimals`. Share decimals can differ from the asset's; read both independently from discovery.

**vaultAddress** `string`

The vault contract address. For this Morpho integration, it is also the share-token address.

**depositsPaused, withdrawalsPaused, redemptionLagSeconds** `Upshift only`

Morpho omits Upshift's `assetsAfterFee`, `depositsPaused`, `withdrawalsPaused` and `redemptionLagSeconds`. Absence does not mean zero fees or guaranteed availability.
