> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Send a Payout

> Send a referenced batch of token payouts in one transaction without leaving funds in the payout contract.

Send one referenced batch to employees, creators, suppliers, or sellers. The contract pulls each amount directly from the sender to its recipient, so it does not retain a pooled token balance between transactions.

## Deploy the Payout Contract

```solidity Payout.sol lines wrap expandable highlight={2-4,8-9} theme={null}
function sendPayouts(bytes32 batchId, address[] calldata recipients, uint256[] calldata amounts) external {
    if (processed[batchId]) revert BatchAlreadyProcessed(batchId);
    if (recipients.length == 0 || recipients.length != amounts.length) revert InvalidArrayLengths();
    if (recipients.length > MAX_RECIPIENTS) revert TooManyRecipients();
    processed[batchId] = true;

    for (uint256 i; i < recipients.length; ++i) {
        require(token.transferFrom(msg.sender, recipients[i], amounts[i]), "transfer failed");
        emit PayoutSent(batchId, msg.sender, recipients[i], amounts[i]);
    }
}
```

Approve the deployed contract for the total batch amount, then submit recipients and amounts from the same sender.

```typescript TypeScript backend lines wrap expandable highlight={2,4-8} theme={null}
export async function sendPayouts(
  payout: Address,
  batchReference: string,
  recipients: Address[],
  amounts: string[],
) {
  if (recipients.length !== amounts.length) throw new Error("Recipient and amount counts differ");
  const batchId = keccak256(toHex(batchReference));
  const simulation = await publicClient.simulateContract({
    account,
    address: payout,
    abi: payoutAbi,
    functionName: "sendPayouts",
    args: [batchId, recipients, amounts.map((amount) => parseUnits(amount, 6))],
  });
  const hash = await walletClient.writeContract(simulation.request);
  return publicClient.waitForTransactionReceipt({ hash, confirmations: 2 });
}
```

> [!TIP]
>
> The transaction emits one `PayoutSent` event per recipient under the same `batchId`, and the sum of token transfers matches your approved batch total.

> [!WARNING]
>
> Cap batch size from measured gas usage and keep the contract's `MAX_RECIPIENTS` bound. A single failed token transfer reverts the entire batch.

Do not approve the public `Multicall3` contract as an ERC-20 spender. Downstream token calls see Multicall3 as `msg.sender`, and any caller can ask that general-purpose contract to invoke `transferFrom` against an allowance you grant it. Use a purpose-built contract that fixes who can initiate payouts and how recipients are selected.

## See Also

> [card] [Split a Payment](https://docs.base.org/build-on-base/accept-payments/split-a-payment.md)
>
> Calculate basis-point shares and assign rounding exactly.

> [card] [Reconcile Payments](https://docs.base.org/build-on-base/accept-payments/reconcile-payments.md)
>
> Join payout events to your ledger reference.
