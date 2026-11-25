> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Authorize a Payment

> Move payer funds into escrow for later capture on Base.

Authorize a payment when fulfillment happens after checkout. A successful protocol authorization moves tokens into the operator's escrow store immediately, so later capture does not depend on the payer keeping funds in their wallet.

> [!NOTE]
>
> This guide's payment flow is based on the [Commerce Payments Protocol](https://github.com/base/commerce-payments).

> [!WARNING]
>
> The collector signature is only permission to collect. Treat funds as reserved only after `authorize` succeeds and emits `PaymentAuthorized`.

## Authorize and Store the Payment

Build one immutable `PaymentInfo` with the operator, payer, receiver, token, maximum amount, three ordered expiry timestamps, fee bounds, fee receiver, and a unique salt. Store the exact struct because every later operation recomputes its hash.

The fixture prepares an ERC-3009 collector signature and submits the authorization from `paymentInfo.operator`.

```typescript TypeScript lines wrap expandable highlight={6,11,15-16} theme={null}
export async function authorizePayment(
  merchant: Address,
  orderId: string,
  amount: string,
) {
  const payment = await prepareErc3009Payment(merchant, orderId, amount);
  const simulation = await publicClient.simulateContract({
    account,
    address: AUTH_CAPTURE_ESCROW,
    abi: authCaptureEscrowAbi,
    functionName: "authorize",
    args: [
      payment.paymentInfo,
      payment.paymentInfo.maxAmount,
      ERC3009_PAYMENT_COLLECTOR,
      payment.collectorData,
    ],
  });
  const hash = await walletClient.writeContract(simulation.request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash, confirmations: 2 });
  if (receipt.status !== "success") throw new Error("Payment authorization reverted");
  return { ...payment, authorizationHash: hash };
}
```

| State field | Value after authorization |
| - | - |
| `hasCollectedPayment` | `true` permanently |
| `capturableAmount` | Authorized amount held in escrow |
| `refundableAmount` | `0` until capture |

> [!TIP]
>
> Persist `paymentInfoHash`, the full terms, collector, authorization transaction, and `PaymentAuthorized.amount` against the order.

> [!WARNING]
>
> The payment can be collected only once. Use a new cryptographically random salt for every checkout attempt, including retries after a void or reclaim.

## See Also

> [card] [Capture an Authorization](https://docs.base.org/build-on-base/accept-payments/capture-an-authorization.md)
>
> Settle the escrowed amount before authorization expiry.

> [card] [Void an Authorization](https://docs.base.org/build-on-base/accept-payments/void-an-authorization.md)
>
> Return funds now, or let the payer reclaim after expiry.
