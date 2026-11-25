> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Deposit

> Build the approve and deposit calls to put an asset into a Morpho or Upshift vault on Base.

Builds the calls to deposit `assets` into any enabled vault: usually an ERC-20 `approve` on the asset followed by the vault deposit. The approve is omitted when the allowance already covers the amount, and a zero-reset approve is prepended for tokens that need it, so expect one to three calls. Execute them all, in order. See [Execute Calls in a Wallet](https://docs.base.org/sdks/base-earn/execute-calls.md).

The approve-based deposit path does not accept `maxSlippageBps` and does not enforce a deposit slippage guard. Do not present estimated shares as a guaranteed minimum. Preserve all returned approval targets and calls.

## Body Parameters

**address** `string` *required*

The end user's wallet, owner and receiver.

**vaultId** `string` *required*

The approved ID from [discovery](https://docs.base.org/sdks/base-earn/api-reference/list-vaults.md).

**assets** `string` *required*

Positive amount in the asset's atomic units. For USDC, `"1000000"` is 1 USDC.

**builderCode** `string` *required*

Required. The registered builder code for your app.

```bash cURL lines expandable wrap theme={null}
curl -X POST "https://api.base.org/earn/v1/lend/deposit" \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "<wallet_address>",
  "vaultId": "<morpho_vault_id>",
  "assets": "1000000",
  "builderCode": "your_registered_builder_code"
}'
```

```typescript TypeScript wrap theme={null}
const batch = await earn("POST", "/lend/deposit", {
  address, vaultId: vault.vaultId,
  assets: (1n * 10n ** BigInt(vault.asset.decimals)).toString(),
  ...attribution,
});
// Pass the batch to the user's wallet. See Executing calls.
await execute(batch);
```

```python Python wrap theme={null}
batch = earn("POST", "/lend/deposit", {
    "address": address, "vaultId": vault["vaultId"],
    "assets": str(10 ** vault["asset"]["decimals"]), **attribution,
})
# Your wallet integration signs, submits and checks receipts.
execute(batch)
```

```json 200 (Upshift) lines expandable wrap theme={null}
{
  "version": "2.0.0",
  "from": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "chainId": "0x2105",
  "calls": [
    { "to": "0xcb585250f852C6c6bf90434AB21A00f02833a4af", "value": "0", "data": "0x095ea7b3…" },
    { "to": "0x2c4198361F5aF870EC2bE0fffe243610cDe7F84b", "value": "0", "data": "0xf45346dc…" }
  ]
}
```

The examples use `earn()` and `attribution` from [Call the API](https://docs.base.org/sdks/base-earn/call-the-api.md).
