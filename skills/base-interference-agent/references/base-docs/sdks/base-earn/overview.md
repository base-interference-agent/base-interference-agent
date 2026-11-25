> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Base Earn API

> Earn and borrow on Base with the wallet you already use. Get unsigned transactions for Morpho and Upshift, then have the user's wallet sign and submit them.

Base Earn lets your app offer yield and collateral-backed borrowing on Base without changing wallet providers. Your app requests unsigned transactions; the user's wallet approves and submits them.

> [!NOTE]
>
> The Base Earn API is in developer preview. Upshift Earn is available in early access. Morpho Earn, Morpho Borrow, and Aave v4 are coming soon.

## Supported Protocols

| Protocol | Availability | What users can do |
| - | - | - |
| [Morpho](https://morpho.org/) | Coming soon | Earn yield on USDC or borrow against supported collateral. |
| [Upshift](https://www.upshift.finance/) | Early access | Earn yield on cbXRP through a curated vault. |
| Aave v4 | Coming soon | Borrow against supported collateral. |

Yield is variable and funds are exposed to protocol risk. Withdrawals depend on liquidity and protocol conditions. Borrowing also carries liquidation risk.

For Earn, discovery, position reads, and deposits use the same endpoints for Morpho and Upshift. Read each vault's `withdrawalMode` to choose the exit flow: `synchronous` (Morpho) has no queue or claim step, and `queued` (Upshift) uses a request followed by a claim.

## Quick Start

```text Base URL theme={null}
https://api.base.org/earn/v1
```

Append the endpoint path to this URL. For example, list vaults with `GET https://api.base.org/earn/v1/lend/vaults?network=base`.

You need a connected wallet on Base, the required tokens and gas, and a vault selected from the catalog. Read token decimals and identifiers from discovery. Response examples use illustrative values and abbreviated calldata; never submit them as transactions.

> [tab] Start with Morpho Earn
>
> **1. Get a builder code**
>
> Get a [builder code](https://docs.base.org/specifications/builder-codes/overview.md) from your project in [Base Dashboard](https://dashboard.base.org?utm_source=docs).
>
> **2. List vaults**
>
> Call [`GET /lend/vaults?network=base`](https://docs.base.org/sdks/base-earn/api-reference/list-vaults). Select an approved row with `provider: "morpho"` and `withdrawalMode: "synchronous"`.
>
> **3. Deposit**
>
> Build a deposit with [`POST /lend/deposit`](https://docs.base.org/sdks/base-earn/api-reference/deposit), using `assets` in atomic units and the discovered `vaultId`. Execute every returned call in order.
>
> **4. Read positions**
>
> Read [`GET /lend/positions?address=...`](https://docs.base.org/sdks/base-earn/api-reference/list-positions) after confirmation.
>
> **5. Withdraw**
>
> To exit, use [`POST /lend/withdraw`](https://docs.base.org/sdks/base-earn/api-reference/withdraw) with an asset amount and explicit `maxSlippageBps`. There is no queue or claim step.
>
> For [Morpho Borrow](https://docs.base.org/sdks/base-earn/morpho-borrow.md), start with market selection and the borrow walkthrough. Borrow uses separate product and market-asset identifiers; a lend `vaultId` is not a borrow product ID.

> [tab] Integrate Upshift's queued exit
>
> **1. List vaults**
>
> Discover the Upshift vault with [`GET /lend/vaults?network=base`](https://docs.base.org/sdks/base-earn/api-reference/list-vaults).
>
> **2. Deposit**
>
> Deposit an asset amount with [`POST /lend/deposit`](https://docs.base.org/sdks/base-earn/api-reference/deposit).
>
> **3. Request a withdrawal**
>
> Read the wallet's shares, then call [`POST /lend/request-withdraw`](https://docs.base.org/sdks/base-earn/api-reference/request-withdraw) with `shares`, not assets.
>
> **4. Check the redemption**
>
> Execute the request, persist the confirmed UTC claim date, and poll [`GET /lend/redemptions`](https://docs.base.org/sdks/base-earn/api-reference/get-redemption).
>
> **5. Claim**
>
> When claimable, build and execute [`POST /lend/claim`](https://docs.base.org/sdks/base-earn/api-reference/claim).
>
> Do not send an Upshift vault to `/lend/withdraw`.

Aave v4 is not part of the Morpho release. See [Coming Soon: Aave v4](#coming-soon-aave-v4) for scope and integration status.

## Endpoints

| Method | Path | Providers | Description |
| - | - | - | - |
| `GET` | `/lend/vaults` | All | [List vaults](https://docs.base.org/sdks/base-earn/api-reference/list-vaults.md). |
| `GET` | `/lend/positions` | All | [List an address's positions](https://docs.base.org/sdks/base-earn/api-reference/list-positions.md). |
| `POST` | `/lend/deposit` | All | [Build a deposit](https://docs.base.org/sdks/base-earn/api-reference/deposit.md). |
| `POST` | `/lend/withdraw` | Morpho | [Build a synchronous withdrawal](https://docs.base.org/sdks/base-earn/api-reference/withdraw.md). |
| `POST` | `/lend/request-withdraw` | Upshift | [Queue shares for redemption](https://docs.base.org/sdks/base-earn/api-reference/request-withdraw.md). |
| `GET` | `/lend/redemptions` | Upshift | [Check a queued redemption](https://docs.base.org/sdks/base-earn/api-reference/get-redemption.md). |
| `POST` | `/lend/claim` | Upshift | [Claim a matured redemption](https://docs.base.org/sdks/base-earn/api-reference/claim.md). |
| `POST` | `/borrow/morpho/transact` | Morpho | [Borrow, optionally adding collateral](https://docs.base.org/sdks/base-earn/api-reference/borrow.md). Launch preview. |

## Coming Soon: Aave v4

Aave v4 borrowing support is coming soon. Users will be able to supply supported collateral, borrow, manage debt and repay through Base Earn.

Supported markets and API details will be announced at release. Aave v4 is not included in the Morpho launch.

## Next Steps

> [card] [Call the API](https://docs.base.org/sdks/base-earn/call-the-api.md)
>
> Set up a backend helper for calling the API.

> [card] [Concepts](https://docs.base.org/sdks/base-earn/concepts.md)
>
> Providers, withdrawal modes, atomic units, and queued withdrawals.

> [card] [Morpho Borrow](https://docs.base.org/sdks/base-earn/morpho-borrow.md)
>
> Market selection, origination fees, and the borrow walkthrough.

> [card] [Execute Calls in a Wallet](https://docs.base.org/sdks/base-earn/execute-calls.md)
>
> Verify and send the returned batch with viem.

> [card] [End-to-End Lend Examples](https://docs.base.org/sdks/base-earn/lend-example.md)
>
> Morpho and Upshift walkthroughs, plus testing guidance.

## Related Documentation

* [EIP-5792: wallet call batches](https://eips.ethereum.org/EIPS/eip-5792).
* [Morpho vault integration concepts](https://docs.cdp.coinbase.com/get-started/demo-apps/app-examples/morpho-integration). This example uses CDP wallets; its endpoints are separate from Base Earn.
* [Morpho documentation](https://docs.morpho.org/). Protocol concepts, borrowing mechanics and liquidation risk.
