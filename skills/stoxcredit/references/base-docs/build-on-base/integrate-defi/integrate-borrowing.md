> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Integrate Borrowing

> Let users borrow from Morpho Blue markets on Base against supported collateral through the Base Earn API.

Let users borrow a Morpho Blue market's loan asset against supported collateral through the [Base Earn API](https://docs.base.org/sdks/base-earn/overview.md). One endpoint builds an atomic batch that borrows against existing collateral, or adds collateral and borrows together. The user's wallet owns the position and receives the loan.

> [!NOTE]
>
> Morpho Borrow is a launch preview and is not yet available. Aave v4 borrowing is coming soon; supported markets and API details will be announced at release.

## Before You Integrate

* **Market identifiers.** Use the `productId`, `debtMarketAssetId` and, when adding collateral, `collateralMarketAssetId` supplied for your supported market. These are API identifiers, not token addresses or onchain market IDs. A lend `vaultId` cannot be used here.
* **Position data.** The Borrow endpoint does not list markets or read positions. Connect a separate source for current collateral, debt, and liquidation risk.
* **Repayment.** This release does not add Base Earn endpoints for repayment, standalone collateral deposits, or collateral withdrawals. Connect those through a separate Morpho integration (see the [Morpho documentation](https://docs.morpho.org/)) before offering borrowing; a complete experience needs position monitoring and a working repayment path.
* **Origination fee.** Each borrow has a fixed 25 bps (0.25%) fee on the net proceeds, financed into the debt. See [Origination Fee](https://docs.base.org/sdks/base-earn/morpho-borrow.md#origination-fee).
* **Atomic wallet.** The batch must execute atomically. A wallet that cannot do so cannot use this flow; there is no sequential fallback.

## Add Collateral and Borrow

This example uses `earn()` and `attribution` from [Call the API](https://docs.base.org/sdks/base-earn/call-the-api.md) and the batch-capable `execute()` from [Execute Calls in a Wallet](https://docs.base.org/sdks/base-earn/execute-calls.md#batch-capable-wallet). The Python and Go versions return the batch to the client, which submits it with `execute()`; the Go `earn.Call` helper adds `builderCode` for you. Omit both collateral fields to borrow against existing collateral.

```typescript TypeScript lines wrap expandable highlight={1,5,13,16} theme={null}
const batch = await earn("POST", "/borrow/morpho/transact", {
  address,
  productId: selectedMarket.productId,
  debtMarketAssetId: selectedMarket.debtMarketAssetId,
  netAmount: requestedNetAtomicAmount, // what the user receives, in loan-token atomic units
  collateralMarketAssetId: selectedMarket.collateralMarketAssetId,
  collateralAmount: selectedCollateralAtomicAmount,
  ...attribution,
});

// Show netAmount, feeAmount and grossDebtAmount, and check them against
// what the user chose, before asking for wallet approval.
const { netAmount, feeAmount, grossDebtAmount } = batch;

// Submit the complete batch atomically, preserving capabilities.dataSuffix.
await execute(batch);
```

```python Python lines wrap expandable highlight={1,5,13} theme={null}
batch = earn("POST", "/borrow/morpho/transact", {
    "address": address,
    "productId": selected_market["productId"],
    "debtMarketAssetId": selected_market["debtMarketAssetId"],
    "netAmount": requested_net_atomic_amount,  # what the user receives, in loan-token atomic units
    "collateralMarketAssetId": selected_market["collateralMarketAssetId"],
    "collateralAmount": selected_collateral_atomic_amount,
    **attribution,
})

# Show netAmount, feeAmount and grossDebtAmount, and check them against
# what the user chose, before asking for wallet approval.
net_amount, fee_amount, gross_debt_amount = batch["netAmount"], batch["feeAmount"], batch["grossDebtAmount"]

# Return the complete batch to the client, which submits it atomically with
# execute(), preserving capabilities.dataSuffix.
```

```go Go lines wrap expandable highlight={14,18,28,34} theme={null}
type Market struct {
	ProductID, DebtMarketAssetID, CollateralMarketAssetID string
}

type BorrowFees struct {
	NetAmount       string `json:"netAmount"`
	FeeAmount       string `json:"feeAmount"`
	GrossDebtAmount string `json:"grossDebtAmount"`
}

// earn.Call adds builderCode to the request and returns raw JSON.
func buildBorrow(address string, market Market, requestedNetAtomicAmount, selectedCollateralAtomicAmount string) ([]byte, BorrowFees, error) {
	var fees BorrowFees
	batch, err := earn.Call("POST", "/borrow/morpho/transact", map[string]any{
		"address":                 address,
		"productId":               market.ProductID,
		"debtMarketAssetId":       market.DebtMarketAssetID,
		"netAmount":               requestedNetAtomicAmount, // what the user receives, in loan-token atomic units
		"collateralMarketAssetId": market.CollateralMarketAssetID,
		"collateralAmount":        selectedCollateralAtomicAmount,
	})
	if err != nil {
		return nil, fees, err
	}

	// Show netAmount, feeAmount and grossDebtAmount, and check them against
	// what the user chose, before asking for wallet approval.
	if err := json.Unmarshal(batch, &fees); err != nil {
		return nil, fees, err
	}

	// Return the complete batch unchanged to the client, which submits it
	// atomically with execute(), preserving capabilities.dataSuffix.
	return batch, fees, nil
}
```

After execution succeeds, refresh the position and loan-token balance from your position-data source. Read collateral decimals independently from loan-token decimals.

> [!WARNING]
>
> Debt includes the financed origination fee and grows as interest accrues, and changes in collateral value can make a position liquidatable. Show current loan-to-value and leave a buffer below the market's liquidation threshold. Base Earn does not monitor or defend positions after execution. Treat missing risk data as unavailable, not as zero risk, and never use the original `netAmount` as the repayment amount.

## See Also

> [card] [Morpho Borrow](https://docs.base.org/sdks/base-earn/morpho-borrow.md)
>
> Market selection, origination fees, and repayment.

> [card] [Borrow API Reference](https://docs.base.org/sdks/base-earn/api-reference/borrow.md)
>
> Request fields and fee fields in the response.

> [card] [Execute Calls in a Wallet](https://docs.base.org/sdks/base-earn/execute-calls.md)
>
> Verify and send the returned batch with viem.

> [card] [Integrate Lending](https://docs.base.org/build-on-base/integrate-defi/integrate-lending.md)
>
> Let users deposit into Morpho and Upshift vaults.
