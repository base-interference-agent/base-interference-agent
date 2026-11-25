> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Morpho Borrow

> Borrow a Morpho Blue market's loan asset against supported collateral on Base with the Base Earn API, including market selection, origination fees, and repayment.

Borrow a Morpho Blue market's loan asset against supported collateral, or add collateral and borrow in a single transaction batch. The user's wallet owns the position and receives the loan proceeds. Earn deposits and borrow positions are separate: depositing into an earn vault does not provide collateral for borrowing.

> [!NOTE]
>
> Launch preview. The examples below describe the upcoming Morpho Borrow release at `https://api.base.org/earn/v1`.

## Collateral, Debt, and Liquidation

A Morpho Blue market defines its collateral token, loan token, oracle, interest-rate model and liquidation loan-to-value threshold (LLTV). Read the selected market's terms rather than hardcoding a collateral pair or threshold.

LTV is debt value divided by collateral value. Debt includes the financed origination fee and increases as interest accrues. Changes in collateral value can make a position liquidatable. Show current risk and leave a buffer below the liquidation threshold.

## Select a Market

Use the `productId`, `debtMarketAssetId` and, when adding collateral, `collateralMarketAssetId` supplied for your supported Morpho Blue market on Base. These are API identifiers, not token addresses or onchain market IDs. A lend `vaultId` cannot be used here.

The Borrow endpoint does not list markets or read positions. Before integrating, obtain the supported market identifiers and token decimals for your app, and connect a position-data source for current collateral, debt and risk.

## Origination Fee

Each borrow has a fixed 25 bps (0.25%) origination fee, calculated on the net proceeds and rounded down in loan-token atomic units. The fee is financed into the debt; it is not deducted from the requested net proceeds. Interest accrues on the gross borrowing. Fee overrides and additional recipients are not accepted.

```text Fee calculation wrap theme={null}
feeAmount = floor(netAmount × 25 / 10000)
grossDebtAmount = netAmount + feeAmount

Example for a USDC loan (6 decimals):
netAmount       = "1000000000"  // user receives 1,000 USDC
feeAmount       = "2500000"     // 2.50 USDC origination fee
grossDebtAmount = "1002500000"  // 1,002.50 USDC before interest
```

See [Borrow](https://docs.base.org/sdks/base-earn/api-reference/borrow.md) for the request fields and the fee fields in the response.

## End-to-End: Morpho Borrow

**1. Select a market**

Select a supported market and load the user's current collateral, debt and risk. Confirm the wallet supports atomic execution on Base.

**2. Choose amounts**

Let the user choose the net loan amount and, optionally, collateral to add. Show the fee, gross borrowing and liquidation risk.

**3. Request a batch**

Request a fresh batch from [`POST /borrow/morpho/transact`](https://docs.base.org/sdks/base-earn/api-reference/borrow), including your `builderCode`. Check the returned economics against the amounts shown to the user.

**4. Execute atomically**

Ask the user's wallet to approve and execute the complete batch atomically. Use the [wallet execution example](https://docs.base.org/sdks/base-earn/execute-calls.md#batch-capable-wallet), which forwards the attribution suffix and disables sequential fallback.

**5. Refresh and monitor**

Wait for successful execution, then refresh the position and loan-token balance. Continue showing accrued debt and liquidation risk.

## Position Management and Repayment

This release covers borrowing against existing collateral and adding collateral with borrowing. It does not add Base Earn endpoints for position reads, repayment, standalone collateral deposits or collateral withdrawals. Connect those capabilities through a separate Morpho integration (see the [Morpho documentation](https://docs.morpho.org/)) before offering borrowing to users. A complete user experience must include position monitoring and a working repayment path.

To close a position, account for accrued interest and repay outstanding debt before withdrawing the remaining collateral. Do not use the original `netAmount` as the repayment amount. Refresh position data after each confirmed action and treat missing risk data as unavailable, not as zero risk.
