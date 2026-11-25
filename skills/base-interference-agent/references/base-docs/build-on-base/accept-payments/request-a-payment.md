> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Request a Payment

> Request and settle an immediate escrow-backed charge on Base.

Request an immediate payment with the `charge` operation. The payer approves the payment terms and token collection, then your operator collects, settles, and records the amount as refundable in one transaction.

> [!NOTE]
>
> This guide's payment flow is based on the [Commerce Payments Protocol](https://github.com/base/commerce-payments).

> [!NOTE]
>
> These examples use the v1.1.0 `AuthCaptureEscrow` at `0xf96815976523E00e65Be8f34cA5e64b4f41EB19c`. The same CREATE2 address is deployed on Base and Base Sepolia.

## Charge and Verify the Payment

The complete fixture creates a unique `PaymentInfo`, derives its payer-agnostic hash, and asks the payer to sign an ERC-3009 `ReceiveWithAuthorization` for the deployed collector. The operator then submits `charge`.

| Collector | Best for |
| - | - |
| ERC-3009 | USDC and other tokens with native transfer authorizations |
| Permit2 | Broader ERC-20 support after the payer approves Permit2 |
| Pre-approval | Standard ERC-20 allowance plus a payment-specific pre-approval |
| Spend permission | Wallet-based repeated billing workflows |

B20 and other ERC-20 tokens can use Permit2 or the pre-approval collector when their transfer policies allow the collector, operator token store, receiver, and fee receiver to participate.

```typescript TypeScript lines wrap expandable highlight={2,7,11-12} theme={null}
export async function requestPayment(receiver: Address, orderId: string) {
  const payment = await prepareErc3009Payment(receiver, orderId, "5.00");
  const simulation = await publicClient.simulateContract({
    account,
    address: AUTH_CAPTURE_ESCROW,
    abi: authCaptureEscrowAbi,
    functionName: "charge",
    args: [
      payment.paymentInfo,
      payment.paymentInfo.maxAmount,
      ERC3009_PAYMENT_COLLECTOR,
      payment.collectorData,
      0n,
      zeroAddress,
    ],
  });
  const hash = await operatorWallet.writeContract(simulation.request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash, confirmations: 2 });
  if (receipt.status !== "success") throw new Error("Payment charge reverted");
  return { hash, paymentInfoHash: payment.paymentInfoHash };
}
```

The protocol sends `amount - feeAmount` to `paymentInfo.receiver`, sends the fee separately, and increases `refundableAmount` by the full charged amount.

> [!TIP]
>
> Confirm `PaymentCharged`, match its `paymentInfoHash` to the order, and atomically claim the event before fulfillment.

> [!WARNING]
>
> A payer signature is not settlement. Only a successful `charge` receipt proves that collection and distribution completed. Keep `maxFeeBps` narrow and fix `feeReceiver` unless your operator needs to replace a denylisted recipient.

## See Also

> [card] [Authorize a Payment](https://docs.base.org/build-on-base/accept-payments/authorize-a-payment.md)
>
> Reserve funds in escrow and capture after fulfillment.

> [card] [Verify a Payment](https://docs.base.org/build-on-base/accept-payments/verify-a-payment.md)
>
> Confirm protocol events before you fulfill.
