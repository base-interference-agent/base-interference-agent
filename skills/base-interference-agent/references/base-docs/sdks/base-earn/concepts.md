> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Base Earn Concepts

> Understand Morpho and Upshift vaults, withdrawal modes, atomic units, slippage bounds, and queued withdrawals in the Base Earn API.

## Morpho Earn

Deposit USDC into an approved Morpho vault to receive shares. Withdraw by specifying an asset amount and executing the returned transactions. There is no separate withdrawal queue or claim step; withdrawals still depend on available liquidity.

Use the vault returned by the catalog, even if it allocates funds to another underlying vault. Its share token represents the user's position. Do not substitute an underlying strategy address.

[`GET /lend/vaults?network=base`](https://docs.base.org/sdks/base-earn/api-reference/list-vaults) lists supported vaults in `vaults[]`. For Morpho Earn, select a vault with `provider: "morpho"` and `withdrawalMode: "synchronous"`, then use its `vaultId` for deposits and withdrawals.

Morpho omits Upshift's `assetsAfterFee`, `depositsPaused`, `withdrawalsPaused` and `redemptionLagSeconds`. Absence does not mean zero fees or guaranteed availability.

### Amounts and Slippage

All lend amounts are positive decimal strings in atomic units, bounded by `uint256`. For USDC, `"1000000"` is 1 USDC. Do not send floats, scientific notation or human decimal amounts. USDC uses 6 decimals; share decimals can differ. Read both independently from discovery.

The approve-based deposit path does not accept `maxSlippageBps` and does not enforce a deposit slippage guard. Do not present estimated shares as a guaranteed minimum. Preserve all returned approval targets and calls.

[`POST /lend/withdraw`](https://docs.base.org/sdks/base-earn/api-reference/withdraw) takes an amount in asset units, not shares, plus `maxSlippageBps`: a required integer, `0` through `9999`. Explicit `0` means zero tolerance. `50` means 0.5%. The allowed maximum is not a recommendation; obtain the user's chosen tolerance.

Do not call `/lend/request-withdraw`, `/lend/redemptions` or `/lend/claim` for Morpho. Those endpoints serve queued withdrawals and return `400` for an incompatible provider.

## Upshift Earn

Upshift supports earning through curated vaults, including the Clearstar cbXRP vault. Discovery, position reads and deposits use the same endpoints as Morpho. Withdrawals use a queued request followed by a claim. Read current token metadata, pause flags and waiting periods from the catalog.

`withdrawalMode: "queued"` selects this lifecycle. Sending an Upshift vault to `POST /lend/withdraw` returns `400`. The instant-redeem path is not exposed.

### Vaults, Assets, and Shares

A vault accepts one asset (cbXRP for the current vault) and mints a share token (upXRP) that represents the depositor's claim. The value of each share changes as the vault earns yield or incurs losses. [`GET /lend/positions`](https://docs.base.org/sdks/base-earn/api-reference/list-positions) reports both the shares an address holds and what they are worth today.

### Amounts Are Atomic Units

Every amount in requests and responses is a decimal string in the token's smallest unit: `assets` in the asset's decimals, `shares` in the share token's decimals. For cbXRP (6 decimals), 1 cbXRP is `"1000000"`. No floats, no scientific notation. This is the same unit the calldata uses, so nothing is rounded between your request and the transaction.

### Withdrawal Takes Two Steps

Upshift vaults redeem asynchronously. [`request-withdraw`](https://docs.base.org/sdks/base-earn/api-reference/request-withdraw) moves shares into a queue keyed by the user's address and a **UTC date**. After the waiting period reported by `redemptionLagSeconds`, the entry matures and [`claim`](https://docs.base.org/sdks/base-earn/api-reference/claim) pays out the assets. Nothing is delivered in the first step.

* `request-withdraw` returns `estimatedClaimDate`, computed at the current block. The real queue date comes from the mined transaction's timestamp plus the lag, so confirm it from the receipt before claiming; it can roll to the next UTC day.
* [`GET /lend/redemptions`](https://docs.base.org/sdks/base-earn/api-reference/get-redemption) tells you whether a claim for a given date would succeed right now, and why not otherwise.
* The vault also offers an instant redemption with a fee. This API does not expose it.

## Builder Codes

Include your registered `builderCode` on every write. TypeScript and Python examples use the `attribution` helper from [Call the API](https://docs.base.org/sdks/base-earn/call-the-api.md).

## Addresses Are Parameters

The API never signs. `address` is the end user's wallet, passed as a parameter, and becomes `from` in the returned batch. Only the user's wallet authorizes the transaction.
