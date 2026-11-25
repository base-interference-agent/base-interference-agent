> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Get Redemption

> Check whether a queued Upshift redemption for an address, vault, and UTC date is claimable now.

> [!NOTE]
>
> Upshift vaults only (`withdrawalMode: "queued"`). Sending a Morpho vault to this endpoint returns `400`. For Morpho, use [Withdraw](https://docs.base.org/sdks/base-earn/api-reference/withdraw.md).

Returns the queued redemption for one address, vault, and UTC date. `claimable` is the result of simulating the claim now. When it's `false`, `problem` says why: not yet matured, nothing queued for that date, or vault paused. Poll this endpoint after [Request Withdraw](https://docs.base.org/sdks/base-earn/api-reference/request-withdraw.md), then call [Claim](https://docs.base.org/sdks/base-earn/api-reference/claim.md) with the same date.

## Query Parameters

**address** `string` *required*

The end user's wallet, as a `0x` hex address.

**vaultId** `string` *required*

From the [vault catalog](https://docs.base.org/sdks/base-earn/api-reference/list-vaults.md).

**claimDate** `string` *required*

The UTC queue date, formatted as `YYYY-MM-DD`.

```bash cURL wrap theme={null}
curl "https://api.base.org/earn/v1/lend/redemptions?address=0x742d35Cc6634C0532925a3b844Bc454e4438f44e&vaultId=8d068ba8-072e-421c-b553-6cf989cefeec&claimDate=2026-10-05"
```

```typescript TypeScript wrap theme={null}
const red = await earn("GET",
  `/lend/redemptions?address=${address}&vaultId=${vault.vaultId}&claimDate=${claimDate}`);
if (!red.claimable) console.log("not yet:", red.problem);
```

```python Python wrap theme={null}
red = earn("GET", f"/lend/redemptions?address={address}&vaultId={vault['vaultId']}&claimDate={claim_date}")
if not red["claimable"]:
    print("not yet:", red.get("problem"))
```

```json 200 lines expandable wrap theme={null}
{
  "vaultId": "8d068ba8-072e-421c-b553-6cf989cefeec",
  "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "network": "base",
  "claimDate": "2026-10-05",
  "shares": "999682",
  "assets": "999999",
  "assetsAfterFee": "999996",
  "claimable": false,
  "problem": "execution reverted: TooEarly()"
}
```

## Response Fields

**claimable** `boolean`

Whether a claim for this date would succeed right now, based on a simulation.

**problem** `string`

The reason the claim would fail. Present only when `claimable` is `false`.
