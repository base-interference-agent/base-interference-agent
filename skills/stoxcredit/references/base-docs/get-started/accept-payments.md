> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Accept Payments

> Choose an onchain payment lifecycle for commerce checkout, agentic payments, reconciliation, refunds, and payouts on Base.

Accept payments on Base with the lifecycle your product needs. Use the [Commerce Payments Protocol](https://github.com/base/commerce-payments) to charge immediately or reserve funds in escrow before fulfillment, then capture, void, reclaim, or refund under payer-approved terms. The same solution area also covers scheduled collection, reconciliation, payouts, splits, and x402 APIs.

## Payment Lifecycle

| Stage | What happens | Start with |
| - | - | - |
| Charge | The operator collects and settles a protocol payment atomically | [Request a payment](https://docs.base.org/build-on-base/accept-payments/request-a-payment.md) |
| Authorize | The operator moves payer funds into escrow | [Authorize a payment](https://docs.base.org/build-on-base/accept-payments/authorize-a-payment.md) |
| Capture | The operator settles all or part of the escrowed amount | [Capture an authorization](https://docs.base.org/build-on-base/accept-payments/capture-an-authorization.md) |
| Confirm | Your backend verifies confirmed protocol events and claims the order once | [Verify a payment](https://docs.base.org/build-on-base/accept-payments/verify-a-payment.md) |
| Return or distribute | You refund the payer or pay downstream recipients | [Refund a payment](https://docs.base.org/build-on-base/accept-payments/refund-a-payment.md) |

## Take a Payment

> [card] [Request a Payment](https://docs.base.org/build-on-base/accept-payments/request-a-payment.md)
>
> Charge and settle immediately in one transaction.

> [card] [Authorize a Payment](https://docs.base.org/build-on-base/accept-payments/authorize-a-payment.md)
>
> Reserve funds in escrow under immutable payment terms.

> [card] [Capture an Authorization](https://docs.base.org/build-on-base/accept-payments/capture-an-authorization.md)
>
> Settle all or part of the escrowed funds before authorization expiry.

> [card] [Charge on a Schedule](https://docs.base.org/build-on-base/accept-payments/charge-on-a-schedule.md)
>
> Create one protocol charge per billing period with a spend permission.

## Confirm and Reconcile

> [card] [Verify a Payment](https://docs.base.org/build-on-base/accept-payments/verify-a-payment.md)
>
> Validate settlement events and claim each payment once.

> [card] [Watch for Payments](https://docs.base.org/build-on-base/accept-payments/watch-for-payments.md)
>
> Subscribe to escrow events and backfill confirmed blocks.

> [card] [Reconcile Payments](https://docs.base.org/build-on-base/accept-payments/reconcile-payments.md)
>
> Export charges, captures, fees, voids, reclaims, and refunds.

## Refund and Pay Out

> [card] [Refund a Payment](https://docs.base.org/build-on-base/accept-payments/refund-a-payment.md)
>
> Source refund liquidity and return captured value to the payer.

> [card] [Void an Authorization](https://docs.base.org/build-on-base/accept-payments/void-an-authorization.md)
>
> Return the remainder now or let the payer reclaim after expiry.

> [card] [Send a Payout](https://docs.base.org/build-on-base/accept-payments/send-a-payout.md)
>
> Pay a bounded recipient batch under one reference.

> [card] [Split a Payment](https://docs.base.org/build-on-base/accept-payments/split-a-payment.md)
>
> Distribute exact basis-point shares without stranded dust.

## Accept Agentic Payments

> [card] [Charge for an API](https://docs.base.org/build-on-base/accept-payments/charge-for-an-api.md)
>
> Protect a fixed-price route with x402 `exact`.

> [card] [Settle Usage-Based Payments](https://docs.base.org/build-on-base/accept-payments/settle-usage-based-payments.md)
>
> Authorize a maximum and settle measured usage with `upto`.

> [card] [Batch High-Frequency Payments](https://docs.base.org/build-on-base/accept-payments/batch-high-frequency-payments.md)
>
> Advance vouchers per request and settle channels in batches.

> [card] [Call a Paid Service](https://docs.base.org/build-on-base/accept-payments/call-a-paid-service.md)
>
> Enforce network, asset, and spend policy before an agent signs.
