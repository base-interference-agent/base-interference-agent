> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Make a Simple Payment

> Send USDC directly from one wallet to another on Base.

Send USDC directly from one wallet to another with a standard ERC-20 transfer. The sender submits the transaction and pays the network fee; after confirmation, the recipient controls the USDC.

## Send USDC

Provide the recipient address and amount, simulate the call, then submit the transaction from the sender's wallet. This example uses USDC on Base Sepolia.

```typescript TypeScript lines wrap expandable highlight={6,10-11} theme={null}
export async function makeSimplePayment(recipient: Address, amount: string) {
  const simulation = await publicClient.simulateContract({
    account,
    address: USDC,
    abi: usdcAbi,
    functionName: "transfer",
    args: [recipient, parseUnits(amount, 6)],
  });
  const hash = await walletClient.writeContract(simulation.request);
  const receipt = await publicClient.waitForTransactionReceipt({ hash, confirmations: 2 });
  if (receipt.status !== "success") throw new Error("USDC transfer reverted");
  return hash;
}
```

> [!TIP]
>
> Confirm the receipt succeeded and its USDC `Transfer` event matches the expected sender, recipient, and amount before treating the payment as complete.

> [!WARNING]
>
> Verify the network and recipient address before signing. A direct USDC transfer has no escrow, authorization, or protocol-managed refund flow.

## See Also

> [card] [Request a Payment](https://docs.base.org/build-on-base/accept-payments/request-a-payment.md)
>
> Add payment terms, settlement verification, and refund accounting.

> [card] [Verify a Payment](https://docs.base.org/build-on-base/accept-payments/verify-a-payment.md)
>
> Verify Commerce Payments Protocol settlements before fulfillment.
