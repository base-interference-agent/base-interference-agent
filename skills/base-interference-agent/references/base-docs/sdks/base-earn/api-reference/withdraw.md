> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Withdraw

> Build the calls to withdraw an asset amount from a Morpho vault on Base in one step, with an explicit slippage bound.

> [!NOTE]
>
> Morpho vaults only (`withdrawalMode: "synchronous"`). Sending an Upshift vault to `POST /lend/withdraw` returns `400`. For Upshift, use [Request Withdraw](https://docs.base.org/sdks/base-earn/api-reference/request-withdraw.md).

Withdraw an amount in asset units, not shares. Execute all returned calls in order, including any token approvals. Call targets may differ from the vault address. The response has no `estimatedClaimDate` because there is no queue or claim step.

Withdrawals still depend on available liquidity.

## Body Parameters

**address** `string` *required*

The end user's wallet, owner and receiver.

**vaultId** `string` *required*

The approved ID from [discovery](https://docs.base.org/sdks/base-earn/api-reference/list-vaults.md).

**assets** `string` *required*

Positive integer string in USDC atomic units.

**maxSlippageBps** `integer` *required*

Required integer, `0` through `9999`. Explicit `0` means zero tolerance. `50` means 0.5%. The allowed maximum is not a recommendation; obtain the user's chosen tolerance.

**builderCode** `string` *required*

Required. The registered builder code for your app.

```bash cURL lines expandable wrap theme={null}
curl -X POST "https://api.base.org/earn/v1/lend/withdraw" \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "<wallet_address>",
  "vaultId": "<morpho_vault_id>",
  "assets": "1000000",
  "maxSlippageBps": 50,
  "builderCode": "your_registered_builder_code"
}'
```

```typescript TypeScript wrap theme={null}
const batch = await earn("POST", "/lend/withdraw", {
  address, vaultId: vault.vaultId,
  assets: (1n * 10n ** BigInt(vault.asset.decimals)).toString(),
  maxSlippageBps: 50, // example only; use the user's chosen tolerance
  ...attribution,
});
await execute(batch);
```

```python Python wrap theme={null}
batch = earn("POST", "/lend/withdraw", {
    "address": address, "vaultId": vault["vaultId"],
    "assets": str(10 ** vault["asset"]["decimals"]),
    "maxSlippageBps": 50,  # example only; use the user's chosen tolerance
    **attribution,
})
execute(batch)
```

```json 200 (Morpho) lines expandable wrap theme={null}
{
  "version": "2.0.0",
  "from": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "chainId": "0x2105",
  "calls": [
    { "to": "<call_target_address>", "value": "0", "data": "0x…" }
  ]
}
```

The examples use `earn()` and `attribution` from [Call the API](https://docs.base.org/sdks/base-earn/call-the-api.md).

## Response

The response is the standard batch envelope described in [Execute Calls in a Wallet](https://docs.base.org/sdks/base-earn/execute-calls.md): `version`, `from`, `chainId`, and ordered `calls[]`, plus `atomicRequired` and `capabilities` when the plan needs them.

The example response shows the envelope shape for a single-call withdrawal. The call target and calldata are placeholders: use the values the API returns, which may include more than one call and a target other than the vault address.
