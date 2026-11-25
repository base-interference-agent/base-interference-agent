> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Verify a Payment

> Verify confirmed escrow events and claim each settlement exactly once before fulfillment.

Never fulfill from a wallet signature, submitted transaction hash, or client state. Decode confirmed `AuthCaptureEscrow` events, match their `paymentInfoHash` to the order, and claim each settlement exactly once in persistent storage.

> [!NOTE]
>
> This guide's payment flow is based on the [Commerce Payments Protocol](https://github.com/base/commerce-payments).

## Verify a Protocol Settlement

Use the v1.1.0 escrow address and ABI together. The `PaymentCharged` and `PaymentCaptured` events contain an absolute `uint256 feeAmount`; the v1.0 events used a different field type and event topic.

```typescript Backend lines wrap expandable highlight={12,18-19,22-23} theme={null}
export async function verifyPayment(args: {
  hash: Hash;
  paymentInfoHash: Hash;
  orderId: string;
  store: PaymentStore;
}) {
  const receipt = await publicClient.waitForTransactionReceipt({ hash: args.hash, confirmations: 2 });
  if (receipt.status !== "success") throw new Error("Payment transaction reverted");
  const events = parseEventLogs({
    abi: authCaptureEscrowAbi,
    logs: receipt.logs.filter(
      (log) => log.address.toLowerCase() === AUTH_CAPTURE_ESCROW.toLowerCase(),
    ),
    strict: true,
  });
  const settlement = events.find(
    (event) =>
      (event.eventName === "PaymentCharged" || event.eventName === "PaymentCaptured") &&
      event.args.paymentInfoHash === args.paymentInfoHash,
  );
  if (!settlement) throw new Error("Expected protocol settlement was not found");
  if (!(await args.store.claimOnce(args.paymentInfoHash, args.orderId))) {
    throw new Error("Payment was already used");
  }
  return settlement;
}
```

`PaymentAuthorized` and `PaymentCharged` include the full `PaymentInfo`. Later lifecycle events include only the hash, so join them to the immutable terms stored when you created the order.

> [!TIP]
>
> Only the first confirmed event with the expected chain, escrow address, payment hash, operation, amount, and fee reaches fulfillment.

> [!WARNING]
>
> `claimOnce` must use a database uniqueness constraint and participate in the same durable workflow as fulfillment. A process-local `Set` cannot prevent replay across restarts or workers.

Choose a confirmation depth that matches the value and reversibility of fulfillment. See [transaction finality](https://docs.base.org/specifications/transactions/transaction-finality.md).

## See Also

> [card] [Request a Payment](https://docs.base.org/build-on-base/accept-payments/request-a-payment.md)
>
> Create an immediate protocol charge.

> [card] [Watch for Payments](https://docs.base.org/build-on-base/accept-payments/watch-for-payments.md)
>
> Backfill and process confirmed escrow events.
