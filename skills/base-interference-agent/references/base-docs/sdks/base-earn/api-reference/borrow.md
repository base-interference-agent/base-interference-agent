> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Borrow

> Build an unsigned, atomic transaction batch that borrows from a Morpho Blue market on Base, optionally adding collateral in the same batch.

> [!NOTE]
>
> Launch preview. See [Morpho Borrow](https://docs.base.org/sdks/base-earn/morpho-borrow.md) for market selection, fees, and repayment.

Build an unsigned transaction batch. Omit both collateral fields to borrow against existing collateral. Include both to add collateral and borrow together. Amounts must be positive integer strings in the relevant token's atomic units, not floating-point or human decimal amounts.

## Body Parameters

**address** `string` *required*

The wallet that owns the position, executes the batch and receives the net proceeds.

**productId** `string` *required*

The supported Morpho Blue product on Base, as a canonical UUID.

**debtMarketAssetId** `string` *required*

The selected product's loan-asset identifier.

**netAmount** `string` *required*

The amount the user receives, in loan-token atomic units. Minimum 400 atomic units; net amount plus fee must fit in `uint256`.

**builderCode** `string` *required*

Your app's registered builder code.

**collateralMarketAssetId** `string`

The selected product's collateral-asset identifier. Must be paired with `collateralAmount`.

**collateralAmount** `string`

Collateral to add, in that token's atomic units. Must be paired with `collateralMarketAssetId`.

## Borrow Against Existing Collateral

These examples request 1,000 USDC net from a supported market with USDC as its loan token (6 decimals). The position must already have enough collateral to support the total debt, including the fee. Product and asset IDs below are application configuration, not example IDs to copy.

```bash cURL lines expandable wrap theme={null}
curl -X POST "https://api.base.org/earn/v1/borrow/morpho/transact" \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "<wallet_address>",
  "productId": "<morpho_product_id>",
  "debtMarketAssetId": "<loan_asset_id>",
  "netAmount": "1000000000",
  "builderCode": "your_registered_builder_code"
}'
```

```typescript TypeScript lines expandable wrap theme={null}
const batch = await earn("POST", "/borrow/morpho/transact", {
  address,
  productId: selectedMarket.productId,
  debtMarketAssetId: selectedMarket.debtMarketAssetId,
  netAmount: "1000000000", // 1,000 USDC; this example assumes 6 decimals
  ...attribution,
});
// Show netAmount, feeAmount and grossDebtAmount before wallet approval.
// execute must submit the complete batch atomically; see Executing calls.
await execute(batch);
```

```python Python lines expandable wrap theme={null}
batch = earn("POST", "/borrow/morpho/transact", {
    "address": address,
    "productId": selected_market["productId"],
    "debtMarketAssetId": selected_market["debtMarketAssetId"],
    "netAmount": "1000000000",  # 1,000 USDC; assumes 6 decimals
    **attribution,
})
# Show the fee breakdown, then send the complete batch to the wallet.
# The wallet integration must execute it atomically.
execute(batch)
```

## Add Collateral and Borrow Together

Use the same endpoint with both collateral fields. Read collateral decimals independently from loan-token decimals. The amount to add must come from the user's selection and must support the requested debt. The cURL example requests 1,000 USDC net (6 decimals); replace the collateral amount with the user's chosen amount in collateral-token atomic units.

```bash cURL lines expandable wrap theme={null}
curl -X POST "https://api.base.org/earn/v1/borrow/morpho/transact" \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "<wallet_address>",
  "productId": "<morpho_product_id>",
  "debtMarketAssetId": "<loan_asset_id>",
  "netAmount": "1000000000",
  "collateralMarketAssetId": "<collateral_asset_id>",
  "collateralAmount": "<collateral_amount_in_atomic_units>",
  "builderCode": "your_registered_builder_code"
}'
```

```typescript TypeScript lines expandable wrap theme={null}
const batch = await earn("POST", "/borrow/morpho/transact", {
  address,
  productId: selectedMarket.productId,
  debtMarketAssetId: selectedMarket.debtMarketAssetId,
  netAmount: requestedNetAtomicAmount,
  collateralMarketAssetId: selectedMarket.collateralMarketAssetId,
  collateralAmount: selectedCollateralAtomicAmount,
  ...attribution,
});
await execute(batch);
```

```python Python lines expandable wrap theme={null}
batch = earn("POST", "/borrow/morpho/transact", {
    "address": address,
    "productId": selected_market["productId"],
    "debtMarketAssetId": selected_market["debtMarketAssetId"],
    "netAmount": requested_net_atomic_amount,
    "collateralMarketAssetId": selected_market["collateralMarketAssetId"],
    "collateralAmount": selected_collateral_atomic_amount,
    **attribution,
})
execute(batch)
```

The examples use `earn()` and `attribution` from [Call the API](https://docs.base.org/sdks/base-earn/call-the-api.md) and `execute()` from [Execute Calls in a Wallet](https://docs.base.org/sdks/base-earn/execute-calls.md).

## Response Fields

The response includes the wallet batch and the following fee fields. Amount fields use the loan token's atomic units. The gross amount is the new borrowing from this action, not the wallet's total outstanding debt.

| Response field | Meaning |
| - | - |
| `netAmount` | Loan proceeds paid to the user's wallet. |
| `feeAmount` | The origination fee financed into this borrowing. |
| `grossDebtAmount` | Net proceeds plus the origination fee. |
| `feeRateBps` | `25`. |
| `feeRecipient` | `0x93e6E5386225aFd0965d20162F819827cdD6C524`. |
| `atomicRequired` | `true`. All returned calls must execute as a single atomic batch. |
| `capabilities.dataSuffix` | Builder attribution data. Preserve it when submitting the batch. |
| `version`, `from`, `chainId`, `calls[]` | The unsigned wallet envelope described in [Execute Calls in a Wallet](https://docs.base.org/sdks/base-earn/execute-calls.md). |

Pass only the wallet envelope fields to the wallet, not the fee-display fields. Preserve every returned call, its order and the attribution suffix. A wallet that cannot execute this batch atomically cannot use this borrowing flow; there is no sequential transaction fallback.
