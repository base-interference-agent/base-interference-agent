> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Void an Authorization

> Return the remaining escrowed authorization to the payer or let the payer reclaim it after expiry.

Close an authorization that you will not capture. The operator can call `void` at any time to return all remaining capturable funds. If the operator becomes inactive, the payer can call `reclaim` at or after `authorizationExpiry`.

> [!NOTE]
>
> This guide's payment flow is based on the [Commerce Payments Protocol](https://github.com/base/commerce-payments).

| Path | Caller | Available when |
| - | - | - |
| `void(paymentInfo)` | Operator | Any time a capturable balance remains |
| `reclaim(paymentInfo)` | Payer | At or after `authorizationExpiry` |

## Void the Remaining Authorization

`void` returns the complete `capturableAmount`; there is no partial-void operation. Capture the final fulfilled amount first, then void the remainder.

```typescript TypeScript lines wrap expandable highlight={5,8,13-14} theme={null}
export async function voidAuthorization(payment: StoredProtocolPayment) {
  const [, capturableAmount] = await publicClient.readContract({
    address: AUTH_CAPTURE_ESCROW,
    abi: authCaptureEscrowAbi,
    functionName: "paymentState",
    args: [payment.paymentInfoHash],
  });
  if (capturableAmount === 0n) throw new Error("Authorization has no remaining funds");
  const simulation = await publicClient.simulateContract({
    account,
    address: AUTH_CAPTURE_ESCROW,
    abi: authCaptureEscrowAbi,
    functionName: "void",
    args: [payment.paymentInfo],
  });
  const hash = await walletClient.writeContract(simulation.request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash, confirmations: 2 });
  if (receipt.status !== "success") throw new Error("Payment void reverted");
  return receipt;
}
```

Both `void` and `reclaim` set `capturableAmount` to zero while leaving any previously captured `refundableAmount` unchanged.

> [!TIP]
>
> Verify `PaymentVoided` or `PaymentReclaimed`, and match its amount to the capturable balance immediately before the return.

> [!WARNING]
>
> After authorization expiry, the operator and payer can race to return the same remainder through `void` or `reclaim`. One succeeds and the other reverts with `ZeroAuthorization`; process either event idempotently as the terminal authorization return.

## See Also

> [card] [Authorize a Payment](https://docs.base.org/build-on-base/accept-payments/authorize-a-payment.md)
>
> Configure the authorization and recovery windows.

> [card] [Refund a Payment](https://docs.base.org/build-on-base/accept-payments/refund-a-payment.md)
>
> Return value that was already captured.
