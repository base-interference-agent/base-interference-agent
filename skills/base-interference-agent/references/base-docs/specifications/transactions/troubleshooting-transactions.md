> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Troubleshooting Transactions

> Guide to diagnosing and resolving transaction issues on Base.

For validity transaction issues, see [Validity Transaction Troubleshooting](https://docs.base.org/specifications/build-transaction/troubleshooting.md).

## Transaction Not Being Included

If your transaction is pending for longer than expected, check the following:

### Max Fee Too Low

If your `maxFeePerGas` is lower than the current base fee, your transaction will remain pending until the base fee drops to your specified level.

**Solution**: The `maxFeePerGas` must cover both the base fee and your priority fee. Since the base fee can change with each block, set `maxFeePerGas` high enough to remain valid even if the base fee rises while your transaction is pending. A common approach is:

```text Max Fee Formula theme={null}
maxFeePerGas = baseFee * 2 + maxPriorityFeePerGas
```

This formula (used by [ethers.js](https://github.com/ethers-io/ethers.js/blob/98c49d091eb84a9146dfba8476f18e4c3e3d1d31/src.ts/providers/abstract-provider.ts#L945-L950)) provides headroom for the base fee to double before your transaction becomes unexecutable. You only pay the actual base fee at inclusion time, not the maximum.

> [!NOTE]
>
> Base has a [minimum base fee](https://docs.base.org/specifications/transactions/network-fees.md#minimum-base-fee). Transactions with `maxFeePerGas` below this value will never be included, since the base fee cannot drop below the minimum.

### Priority Fee Too Low

During periods of high demand, transactions compete for block space through priority fees. If your priority fee is too low relative to other transactions, yours may be delayed.

**Solution**: Most users simply wait for congestion to subside. For time-sensitive transactions, use `eth_maxPriorityFeePerGas` to get a priority fee estimate that can outbid enough recent transactions to be included.

> [!NOTE]
>
> If DA throttling is currently in effect, there's no RPC endpoint that calculates priority fee estimates with throttling in mind. During DA throttling, even transactions with high priority fees may be delayed as the sequencer limits L2 transactions to manage its L1 data availability throughput.

### Nonce Gap

If you have a pending transaction with nonce N, all transactions with nonce N+1 or higher will queue behind it, regardless of their fees.

**Solution**: Either wait for the pending transaction to be included, or replace it by submitting a new transaction with the same nonce and a higher fee (at least 10% higher `maxPriorityFeePerGas` and `maxFeePerGas`).

### Nonce Too Low

If you submit a transaction with a nonce that has already been used, it will be rejected.

**Solution**: Query your current nonce using `eth_getTransactionCount` with the `pending` tag to get the next available nonce.

## Transaction Rejected

### Gas Limit Exceeds Maximum

Base enforces a [per-transaction gas maximum](https://docs.base.org/specifications/transactions/throughput-and-limits.md#per-transaction-gas-maximum) of **16,777,216 gas (2^24)**. Transactions specifying a higher gas limit are rejected during block validation.

**Error**: `exceeds maximum per-transaction gas limit`

**Solution**: Reduce the gas limit to 16,777,216 (2^24) or below. If your transaction genuinely requires more gas, you'll need to break it into multiple transactions.

## Transaction Included but Failed

If your transaction was included in a block but shows a failed status:

### Out of Gas

The transaction ran out of gas during execution.

**Solution**: Increase the gas limit. Use `eth_estimateGas` to get a gas estimate, then add a buffer (e.g., 20%) to account for variability.

### Reverted by Contract

The contract execution encountered a revert condition.

**Solution**: Check the transaction on [Basescan](https://basescan.org) to see the revert reason. Common causes include failed require statements, arithmetic errors, or invalid state transitions.

## Slow Confirmation

### Understanding Confirmation Times

Base produces a canonical block every 200ms. The first confirmation is inclusion in a canonical block.

| Confirmation Level | Time | Description |
| - | - | - |
| L2 block inclusion | \~200ms | Transaction included in a sealed L2 block |
| L1 batch inclusion | \~2m | Transaction posted to Ethereum |
| L1 finality | \~20m | Ethereum batch is finalized |

See [Transaction Finality](https://docs.base.org/specifications/transactions/transaction-finality.md) for more details.

## CDP Paymaster Rejections

If you sponsor gas with CDP Paymaster and a userOperation is rejected, read the exact error code and message before you change your configuration. Policy rules such as allowed contracts, allowed methods, and spend limits can apply differently to each userOperation, so an earlier sponsored operation from the same sender does not mean a later one will qualify.

* **`-32002` with `request denied - no sponsorship and address can not pay with accepted token`**: Your gas policy did not sponsor the userOperation, and the sender cannot pay gas with an accepted ERC-20 token. The error `data` lists the `acceptedTokens`. If the sender should pay in a token, check that it has approved the Paymaster for enough of that token, as described in [ERC-20 gas payments](https://docs.cdp.coinbase.com/paymaster/guides/erc20-gas-payments). If the operation should be sponsored, find out why your policy did not sponsor it.
* **Policy rejection messages**: Messages such as `target address not in allowed contracts` or `method not in allowed methods` mean the contract or the function you called is not allowlisted in your Paymaster configuration in CDP Portal. Other messages report spend limits, per-address limits, or missing attestations.

To see the details of a specific request, open the **Logs** tab for Paymaster in CDP Portal. For the full list of codes and messages, see the CDP Paymaster [error reference](https://docs.cdp.coinbase.com/paymaster/reference-troubleshooting/errors) and [troubleshooting guide](https://docs.cdp.coinbase.com/paymaster/reference-troubleshooting/troubleshooting).

## Debugging Tools

* **[Basescan](https://basescan.org)**: View transaction status, logs, and revert reasons
* **[Tenderly](https://tenderly.co)**: Simulate and debug transactions
* **`eth_call`**: Test contract calls without submitting a transaction
* **`eth_estimateGas`**: Estimate gas usage before submitting

## Getting Help

If you're still experiencing issues, reach out in the `#developer-chat` channel in the [Base Discord](https://base.org/discord).
