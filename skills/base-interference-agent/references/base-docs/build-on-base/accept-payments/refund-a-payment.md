> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Refund a Payment

> Return captured value to the original payer within the refund window.

Refund all or part of a protocol charge or capture before `refundExpiry`. The refundable limit is maintained onchain, and refunds are always sent to `paymentInfo.payer`.

> [!NOTE]
>
> This guide's payment flow is based on the [Commerce Payments Protocol](https://github.com/base/commerce-payments).

## Fund and Submit the Refund

Captured funds have already left escrow. The deployed `OperatorRefundCollector` sources replacement liquidity from `paymentInfo.operator`, so approve it for the refund amount before calling `refund`.

```typescript TypeScript lines wrap expandable highlight={8-11,16-17,26-27} theme={null}
export async function refundPayment(
  payment: StoredProtocolPayment,
  refundAmount: bigint,
) {
  const [, , refundableAmount] = await publicClient.readContract({
    address: AUTH_CAPTURE_ESCROW,
    abi: authCaptureEscrowAbi,
    functionName: "paymentState",
    args: [payment.paymentInfoHash],
  });
  if (refundAmount > refundableAmount) throw new Error("Refund exceeds captured amount");
  const approval = await publicClient.simulateContract({
    account,
    address: payment.paymentInfo.token,
    abi: refundApprovalAbi,
    functionName: "approve",
    args: [OPERATOR_REFUND_COLLECTOR, refundAmount],
  });
  const approvalHash = await walletClient.writeContract(approval.request);
  await publicClient.waitForTransactionReceipt({ hash: approvalHash, confirmations: 2 });

  const refund = await publicClient.simulateContract({
    account,
    address: AUTH_CAPTURE_ESCROW,
    abi: authCaptureEscrowAbi,
    functionName: "refund",
    args: [payment.paymentInfo, refundAmount, OPERATOR_REFUND_COLLECTOR, "0x"],
  });
  const hash = await walletClient.writeContract(refund.request);
  return publicClient.waitForTransactionReceipt({ hash, confirmations: 2 });
}
```

Every charge or capture increases `refundableAmount` by its gross amount. Fees do not reduce that limit. Every refund decreases it by the amount returned.

> [!TIP]
>
> Verify `PaymentRefunded(paymentInfoHash, amount, tokenCollector)`, the transfer to the stored payer, and the updated `refundableAmount` before completing the return.

> [!WARNING]
>
> Refund accounting is not refund liquidity. The operator or another independently authorized source must provide the tokens. Never reuse residual payer authorization to fund a refund.

## See Also

> [card] [Verify a Payment](https://docs.base.org/build-on-base/accept-payments/verify-a-payment.md)
>
> Confirm the original protocol settlement and payment hash.

> [card] [Reconcile Payments](https://docs.base.org/build-on-base/accept-payments/reconcile-payments.md)
>
> Match refunds to charges and captures.
