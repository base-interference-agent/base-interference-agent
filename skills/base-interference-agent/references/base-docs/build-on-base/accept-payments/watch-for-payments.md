> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Watch for Payments

> Watch escrow events, backfill missed blocks, and process confirmed lifecycle changes idempotently.

Turn `AuthCaptureEscrow` logs into a durable payment feed. A WebSocket subscription provides low-latency wakeups, while an overlapping confirmed backfill supplies the canonical source of truth after disconnects or reorgs.

> [!NOTE]
>
> This guide's payment flow is based on the [Commerce Payments Protocol](https://github.com/base/commerce-payments).

## Subscribe and Backfill

Watch the v1.1.0 escrow for `PaymentAuthorized`, `PaymentCharged`, `PaymentCaptured`, `PaymentVoided`, `PaymentReclaimed`, and `PaymentRefunded`. They all share the indexed `paymentInfoHash`.

```typescript TypeScript worker lines wrap expandable highlight={13-18,22,26-29} theme={null}
export async function watchPayments(
  startBlock: bigint,
  store: PaymentEventStore,
) {
  async function backfillConfirmed() {
    const head = await client.getBlockNumber();
    if (head <= confirmations) return;
    const toBlock = head - confirmations;
    const cursor = await store.lastScannedBlock();
    const fromBlock = cursor && cursor > startBlock + confirmations
      ? cursor - confirmations
      : startBlock;
    const logs = await client.getContractEvents({
      address: AUTH_CAPTURE_ESCROW,
      abi: authCaptureEscrowAbi,
      fromBlock,
      toBlock,
      strict: true,
    });

    // Replace the overlap and advance the cursor in one database transaction.
    await store.replaceRange(fromBlock, toBlock, logs);
  }

  await backfillConfirmed();
  return client.watchContractEvent({
    address: AUTH_CAPTURE_ESCROW,
    abi: authCaptureEscrowAbi,
    onLogs: backfillConfirmed,
    onError: (error) => console.error("Payment watcher failed", error),
  });
}
```

Implement `replaceRange` as one database transaction: remove rows in the overlap, insert the current canonical logs, rebuild affected payment state, and advance the cursor only after all writes succeed.

> [!TIP]
>
> After reconnects or short reorgs, the overlap scan converges on canonical protocol events without applying one log twice.

> [!WARNING]
>
> Do not mix v1.0 and v1.1 event ABIs. `PaymentCharged` and `PaymentCaptured` changed event topics when settlement switched from `feeBps` to absolute `feeAmount`.

Choose a confirmation policy that matches your risk tolerance. See [transaction finality](https://docs.base.org/specifications/transactions/transaction-finality.md).

## See Also

> [card] [Verify a Payment](https://docs.base.org/build-on-base/accept-payments/verify-a-payment.md)
>
> Validate each candidate event against its order.

> [card] [Reconcile Payments](https://docs.base.org/build-on-base/accept-payments/reconcile-payments.md)
>
> Produce charge, capture, fee, and refund rows.
