> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Settlement Pending and Reconciliation

The CDP Facilitator can return an HTTP `500` response from
[`POST /v2/x402/settle`](https://docs.cdp.coinbase.com/api-reference/v2/rest-api/x402-facilitator/settle-payment) with:

```json theme={null}
{
  "success": false,
  "errorReason": "settlement_pending",
  "transaction": "0x...",
  "network": "eip155:8453"
}
```

`settlement_pending` is a non-terminal outcome. The Facilitator submitted the transaction to the
network, but did not observe its final confirmation within the synchronous settlement window. The
transaction might still confirm after the response is returned.

> [!WARNING]
>
> Do not treat `success: false` as proof that the payment failed. Do not create another payment,
> change the payment requirements, or broadcast a replacement transaction until you reconcile the
> original transaction. Doing so can charge the buyer twice.

## Automatic SDK reconciliation

The canonical x402 resource-server SDKs automatically reconcile this outcome. When settlement
returns `settlement_pending` with a non-empty `transaction`, the resource server rebroadcasts the
exact same payment payload and payment requirements once. The Facilitator checks the previously
broadcast transaction instead of broadcasting another transaction.

This is a single retry. If it also returns `settlement_pending`, the SDK returns that pending
outcome to your integration so you can monitor it to a terminal state. The implementation is
consistent across the x402 Foundation resource servers for
[TypeScript](https://github.com/x402-foundation/x402/blob/main/typescript/packages/core/src/server/x402ResourceServer.ts),
[Python](https://github.com/x402-foundation/x402/blob/main/python/x402/server_base.py), and
[Go](https://github.com/x402-foundation/x402/blob/main/go/server.go).

The CDP SDK's
[`createX402Server()`](https://github.com/coinbase/cdp-sdk/blob/main/typescript/packages/cdp-sdk/src/x402/server.ts)
constructs the canonical TypeScript resource server, so it inherits this behavior. You also get
the behavior when you pass a CDP Facilitator client to a canonical x402 resource server.

Calling the Facilitator API or a facilitator client directly does not run the resource-server
retry. Custom REST and direct API integrations must reconcile manually.

## Reconcile a direct API call

When a direct call returns `settlement_pending`:

1. Preserve the complete original request, including `x402Version`, `paymentPayload`, and
   `paymentRequirements`. Also record the response's `network` and `transaction`. For EVM,
   `transaction` is the transaction hash; for Solana, it is the transaction signature.
2. Look up `transaction` on the network identified by `network` using your RPC provider or a block
   explorer. A missing or pending receipt is not a failed payment.
3. If you need the Facilitator to check again, resend the original settle request unchanged once.
   Do not send `transaction` as a new request field. The original payment and authorization context
   lets the Facilitator find and reconcile the transaction it already broadcast.
4. If the response remains `settlement_pending`, stop retrying and continue monitoring the original
   transaction. Do not ask the buyer to authorize another payment while its outcome is unknown.
5. Handle the terminal result:
   * If the transaction confirms successfully or settle returns `success: true`, record the payment
     as settled and deliver the corresponding result only once.
   * If the transaction definitively reverts, fails, or expires, treat the payment as failed. Only
     then request a new payment if the buyer should try again.

For other settlement failures, use the
[settlement error reference](https://docs.cdp.coinbase.com/x402/support/troubleshooting.md#settlement-only). A response with an
`errorReason` other than `settlement_pending` is a terminal settle result unless that error's
reference says otherwise.

## What to read next

* [Configure a production seller](https://docs.cdp.coinbase.com/x402/seller/production-configuration.md) for lifecycle hooks and
  production network settings.
* [CDP Facilitator](https://docs.cdp.coinbase.com/x402/seller/facilitator.md) for supported networks, tokens, and schemes.
