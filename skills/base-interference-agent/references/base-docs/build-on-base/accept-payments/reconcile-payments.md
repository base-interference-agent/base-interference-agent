> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Reconcile Payments

> Build a settlement report from escrow charges, captures, fees, voids, reclaims, and refunds.

Turn confirmed protocol logs into ledger rows keyed by `paymentInfoHash`. The initial authorization or charge establishes immutable payment terms; later events update capturable and refundable accounting.

> [!NOTE]
>
> This guide's payment flow is based on the [Commerce Payments Protocol](https://github.com/base/commerce-payments).

## Build a Settlement Report

Query the v1.1.0 escrow, then create gross, fee, and refund rows from its lifecycle events.

```typescript TypeScript backend lines wrap expandable highlight={5-10,14,22,30} theme={null}
export async function buildSettlementReport(
  fromBlock: bigint,
  toBlock: bigint,
) {
  const logs = await publicClient.getContractEvents({
    address: AUTH_CAPTURE_ESCROW,
    abi: authCaptureEscrowAbi,
    fromBlock,
    toBlock,
    strict: true,
  });
  return logs.flatMap((log) => {
    if (!log.transactionHash) return [];
    if (log.eventName === "PaymentCharged") return [{
      paymentInfoHash: log.args.paymentInfoHash,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      operation: "charge",
      grossAmount: log.args.amount,
      feeAmount: log.args.feeAmount,
    }];
    if (log.eventName === "PaymentCaptured") return [{
      paymentInfoHash: log.args.paymentInfoHash,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      operation: "capture",
      grossAmount: log.args.amount,
      feeAmount: log.args.feeAmount,
    }];
    if (log.eventName === "PaymentRefunded") return [{
      paymentInfoHash: log.args.paymentInfoHash,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      operation: "refund",
      grossAmount: -log.args.amount,
      feeAmount: 0n,
    }];
    return [];
  });
}
```

For every charge or capture:

```text Accounting theme={null}
merchant net = gross amount - fee amount
refundable balance += gross amount
```

For every refund, reduce the refundable balance by the gross refund amount. A void or reclaim reduces only the capturable balance and does not reverse earlier captures.

> [!TIP]
>
> For an authorization, reconcile the authorized amount to captures plus the voided or reclaimed amount plus current `capturableAmount`. Reconcile total charged and captured value to refunds plus current `refundableAmount`.

> [!WARNING]
>
> Run financial reports only through a finalized block range. If you display more recent confirmations, label them provisional and replace them after a reorg.

## See Also

> [card] [Watch for Payments](https://docs.base.org/build-on-base/accept-payments/watch-for-payments.md)
>
> Keep the underlying escrow event index current.

> [card] [Refund a Payment](https://docs.base.org/build-on-base/accept-payments/refund-a-payment.md)
>
> Understand gross refund accounting and liquidity.
