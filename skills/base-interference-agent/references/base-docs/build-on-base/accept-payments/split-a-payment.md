> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Split a Payment

> Split one token amount across marketplace recipients with exact basis-point accounting and no stranded dust.

Pay a seller, platform, and referrer in one transaction. Express every share in basis points, require the shares to total 10,000, and assign integer-division remainder to one designated recipient.

## Calculate and Send Exact Shares

```solidity Payout.sol lines wrap expandable highlight={13-18,23} theme={null}
function splitPayment(
    bytes32 splitId,
    uint256 amount,
    address[] calldata recipients,
    uint16[] calldata sharesBps,
    uint256 remainderRecipient
) external {
    if (processed[splitId]) revert BatchAlreadyProcessed(splitId);
    if (recipients.length == 0 || recipients.length != sharesBps.length) revert InvalidArrayLengths();
    if (recipients.length > MAX_RECIPIENTS || remainderRecipient >= recipients.length) revert TooManyRecipients();

    uint256 totalBps;
    uint256 distributed;
    uint256[] memory amounts = new uint256[](recipients.length);
    for (uint256 i; i < recipients.length; ++i) {
        totalBps += sharesBps[i];
        amounts[i] = amount * sharesBps[i] / 10_000;
        distributed += amounts[i];
    }
    if (totalBps != 10_000) revert InvalidBasisPoints();
    amounts[remainderRecipient] += amount - distributed;
    processed[splitId] = true;

    for (uint256 i; i < recipients.length; ++i) {
        require(token.transferFrom(msg.sender, recipients[i], amounts[i]), "transfer failed");
        emit PayoutSent(splitId, msg.sender, recipients[i], amounts[i]);
    }
}
```

```typescript TypeScript backend lines wrap expandable highlight={7-9,12-16} theme={null}
export async function splitPayment(
  payout: Address,
  splitReference: string,
  amount: string,
  recipients: Address[],
  sharesBps: number[],
  remainderRecipient = 0,
) {
  if (sharesBps.reduce((sum, share) => sum + share, 0) !== 10_000) {
    throw new Error("Shares must total 10,000 basis points");
  }
  const splitId = keccak256(toHex(splitReference));
  const simulation = await publicClient.simulateContract({
    account,
    address: payout,
    abi: payoutAbi,
    functionName: "splitPayment",
    args: [splitId, parseUnits(amount, 6), recipients, sharesBps, BigInt(remainderRecipient)],
  });
  const hash = await walletClient.writeContract(simulation.request);
  return publicClient.waitForTransactionReceipt({ hash, confirmations: 2 });
}
```

The contract emits `PayoutSent` for every leg with the shared `splitId`. That reference fills the role of a payout memo for both USDC and B20 without depending on token-specific memo methods.

> [!TIP]
>
> All shares sum to the input amount exactly, including the rounding remainder, and the split routes each leg directly from the payer to its recipient.

> [!WARNING]
>
> Define who receives rounding remainder in your commercial terms. Also approve only the amount needed for the split and verify recipient addresses before submitting the transaction.

## See Also

> [card] [Send a Payout](https://docs.base.org/build-on-base/accept-payments/send-a-payout.md)
>
> Send arbitrary amounts to a bounded recipient batch.

> [card] [Reconcile Payments](https://docs.base.org/build-on-base/accept-payments/reconcile-payments.md)
>
> Export split legs under their shared reference.
