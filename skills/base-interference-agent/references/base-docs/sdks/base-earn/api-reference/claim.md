> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Claim

> Build the claim call that pays out a matured Upshift redemption to the user's address.

> [!NOTE]
>
> Upshift vaults only (`withdrawalMode: "queued"`). Sending a Morpho vault to this endpoint returns `400`. For Morpho, use [Withdraw](https://docs.base.org/sdks/base-earn/api-reference/withdraw.md).

Builds the `claim` call for a matured queue entry. The vault pays out everything queued for that date to `address`. The API simulates the claim first, so a premature or empty claim returns `422` with the reason.

## Body Parameters

**address** `string` *required*

The share holder and receiver of the claim.

**vaultId** `string` *required*

From the approved [vault catalog](https://docs.base.org/sdks/base-earn/api-reference/list-vaults.md).

**claimDate** `string` *required*

The UTC queue date you confirmed and persisted from the mined request-withdraw transaction, formatted as `YYYY-MM-DD`.

**builderCode** `string` *required*

Required. The registered builder code for your app.

```bash cURL wrap theme={null}
curl -X POST -H "Content-Type: application/json" \
  -d '{"address":"0x742d35Cc6634C0532925a3b844Bc454e4438f44e","vaultId":"8d068ba8-072e-421c-b553-6cf989cefeec","claimDate":"2026-10-05","builderCode":"your_registered_builder_code"}' \
  "https://api.base.org/earn/v1/lend/claim"
```

```typescript TypeScript wrap theme={null}
const batch = await earn("POST", "/lend/claim", {
  address, vaultId: vault.vaultId, claimDate, builderCode: "your_registered_builder_code",
});
```

```python Python wrap theme={null}
batch = earn("POST", "/lend/claim", {
    "address": address, "vaultId": vault["vaultId"], "claimDate": claim_date, "builderCode": "your_registered_builder_code",
})
```

```json 200 lines expandable wrap theme={null}
{
  "version": "2.0.0",
  "from": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "chainId": "0x2105",
  "calls": [
    { "to": "0x2c4198361F5aF870EC2bE0fffe243610cDe7F84b", "value": "0", "data": "0xb3c9e83d…" }
  ]
}
```
