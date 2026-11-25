> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Charge on a Schedule

> Create one escrow-backed charge per billing period using a wallet spend permission.

Use the deployed `SpendPermissionPaymentCollector` when a wallet approves repeated collection. Your scheduler still creates a fresh `PaymentInfo` and unique salt for every billing period because each protocol payment can be charged only once.

> [!NOTE]
>
> This guide's payment flow is based on the [Commerce Payments Protocol](https://github.com/base/commerce-payments).

## Charge One Billing Period

The collector reconstructs a spend permission from `PaymentInfo`: the payer is the account, the collector is the spender, the token and allowance come from the payment, and `preApprovalExpiry` is the permission end. Encode the permission signature and optional MagicSpend withdrawal request as `collectorData`.

Use a durable billing key such as `subscriptionId:periodStart` before submitting the protocol charge.

```typescript TypeScript lines wrap expandable highlight={8-10,15,19-20,28} theme={null}
export async function chargeSubscriptionPeriod(args: {
  paymentInfo: PaymentInfo;
  collectorData: Hex;
  billingKey: string;
  amount: bigint;
  store: BillingStore;
}) {
  if (!(await args.store.reserveOnce(args.billingKey))) {
    throw new Error("Billing period was already submitted");
  }
  const simulation = await publicClient.simulateContract({
    account,
    address: AUTH_CAPTURE_ESCROW,
    abi: authCaptureEscrowAbi,
    functionName: "charge",
    args: [
      args.paymentInfo,
      args.amount,
      SPEND_PERMISSION_PAYMENT_COLLECTOR,
      args.collectorData,
      0n,
      zeroAddress,
    ],
  });
  const hash = await walletClient.writeContract(simulation.request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash, confirmations: 2 });
  if (receipt.status !== "success") throw new Error("Scheduled charge reverted");
  await args.store.complete(args.billingKey, hash);
  return receipt;
}
```

A successful charge emits `PaymentCharged` and creates a protocol `refundableAmount` for that billing period.

> [!TIP]
>
> Store the billing key, `paymentInfoHash`, charge transaction, amount, and spend-permission usage in one durable workflow.

> [!WARNING]
>
> The [Commerce Payments Protocol](https://github.com/base/commerce-payments) does not run a scheduler. Protect the operator key, serialize retries, and do not reuse a prior period's `PaymentInfo` or salt.

## See Also

> [card] [Request a Payment](https://docs.base.org/build-on-base/accept-payments/request-a-payment.md)
>
> Use the same charge lifecycle for a one-time checkout.

> [card] [Refund a Payment](https://docs.base.org/build-on-base/accept-payments/refund-a-payment.md)
>
> Reverse a charged billing period before refund expiry.
