> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Request Withdraw

> Build the calls to queue Upshift vault shares for redemption and get an estimated claim date.

> [!NOTE]
>
> Upshift vaults only (`withdrawalMode: "queued"`). Sending a Morpho vault to this endpoint returns `400`. For Morpho, use [Withdraw](https://docs.base.org/sdks/base-earn/api-reference/withdraw.md).

Queues `shares` for redemption. This endpoint takes shares, not assets, so read the balance from [List Positions](https://docs.base.org/sdks/base-earn/api-reference/list-positions.md) first. The batch is usually an approve on the share token followed by `requestRedeem`. The response adds `estimatedClaimDate`.

> [!NOTE]
>
> `estimatedClaimDate` is computed at the current block. The real queue date comes from the mined transaction's timestamp plus the lag, so confirm it from the receipt before claiming; it can roll to the next UTC day. See [Withdrawal Takes Two Steps](https://docs.base.org/sdks/base-earn/concepts.md#withdrawal-takes-two-steps).

## Body Parameters

**address** `string` *required*

Share holder and receiver of assets at claim, as a `0x` hex address.

**vaultId** `string` *required*

From the approved [vault catalog](https://docs.base.org/sdks/base-earn/api-reference/list-vaults.md).

**shares** `string` *required*

Atomic units of the share token, as an integer string, up to the wallet's balance.

**builderCode** `string` *required*

Required. The registered builder code for your app.

```bash cURL wrap theme={null}
curl -X POST -H "Content-Type: application/json" \
  -d '{"address":"0x742d35Cc6634C0532925a3b844Bc454e4438f44e","vaultId":"8d068ba8-072e-421c-b553-6cf989cefeec","shares":"999682","builderCode":"your_registered_builder_code"}' \
  "https://api.base.org/earn/v1/lend/request-withdraw"
```

```typescript TypeScript wrap theme={null}
const req = await earn("POST", "/lend/request-withdraw", {
  address, vaultId: vault.vaultId, shares, builderCode: "your_registered_builder_code",
});
let claimDate = req.estimatedClaimDate; // confirm from the receipt; may roll to the next UTC day
```

```python Python wrap theme={null}
req = earn("POST", "/lend/request-withdraw", {
    "address": address, "vaultId": vault["vaultId"], "shares": shares, "builderCode": "your_registered_builder_code",
})
claim_date = req["estimatedClaimDate"]  # confirm from the receipt; may roll to the next UTC day
```

```json 200 lines expandable wrap theme={null}
{
  "version": "2.0.0",
  "from": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "chainId": "0x2105",
  "calls": [
    { "to": "0xf7CF01e5d58b3F1Ba228920978c47B5B79b67bF4", "value": "0", "data": "0x095ea7b3…" },
    { "to": "0x2c4198361F5aF870EC2bE0fffe243610cDe7F84b", "value": "0", "data": "0x107703ab…" }
  ],
  "estimatedClaimDate": "2026-10-05"
}
```
