> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Execute Base Earn Calls in a Wallet

> Verify and send the EIP-5792-style call batch returned by Base Earn API writes from a batch-capable wallet or an EOA with viem.

Writes build unsigned [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792)-style batches with `version`, `from`, `chainId` and ordered `calls[]`. Each call has `to`, `data` and a decimal wei `value`. The current lending paths return zero value. Do not replace targets or reconstruct calldata from these examples.

The API checks current chain state before building calls. Those checks cannot guarantee execution: balances, prices and liquidity may change before a transaction is mined. Request fresh calls if the user delays signing.

1. Verify that the connected account matches `from` and is on Base Mainnet, chain ID `8453` or `0x2105`.
2. Show the action, assets, approvals and risks to the user. Confirm gas and token balances.
3. Honor all returned capabilities and atomicity requirements. Preserve attribution suffixes if provided. Do not strip required fields to make a wallet accept the plan.
4. Wait for successful execution, stop on failure and refresh positions. An API response alone is not a completed deposit, withdrawal or borrow.

## Batch-Capable Wallet

With viem, pass any required capabilities and atomicity flag through. The connected wallet must support the plan; do not silently fall back to sequential transactions for an atomic plan.

```typescript Batch-capable wallet (viem) lines expandable wrap theme={null}
// Browser-side wallet integration. The API helper runs on your backend.
import { createWalletClient, custom } from "viem";
import { base } from "viem/chains";
const wallet = createWalletClient({ chain: base, transport: custom(window.ethereum) });

async function execute(batch) {
  const accounts = await wallet.getAddresses();
  if (!accounts.some(a => a.toLowerCase() === batch.from.toLowerCase()))
    throw new Error("Wrong connected account");
  if (BigInt(batch.chainId) !== 8453n || await wallet.getChainId() !== 8453)
    throw new Error("Switch to Base mainnet");
  const { id } = await wallet.sendCalls({
    account: batch.from,
    version: batch.version,
    forceAtomic: batch.atomicRequired === true,
    experimental_fallback: false,
    ...(batch.capabilities === undefined ? {} : { capabilities: batch.capabilities }),
    calls: batch.calls.map(c => ({ to: c.to, data: c.data, value: BigInt(c.value) })),
  });
  return wallet.waitForCallsStatus({ id, throwOnFailure: true });
}
```

## Sequential EOA Execution

The lend flows can execute returned calls sequentially when no atomic capability is required. Wait for each successful receipt before sending the next. If the plan requires atomic execution, or contains capabilities this fallback does not implement, stop and use a compatible wallet.

```typescript EOA, sequential (viem) lines expandable wrap theme={null}
import { createPublicClient, http } from "viem";
const publicClient = createPublicClient({ chain: base, transport: http() });

async function executeSequential(batch) {
  if (batch.atomicRequired || Object.keys(batch.capabilities ?? {}).length)
    throw new Error("This plan needs a capability-aware batch wallet");
  const accounts = await wallet.getAddresses();
  if (!accounts.some(a => a.toLowerCase() === batch.from.toLowerCase()))
    throw new Error("Wrong connected account");
  if (BigInt(batch.chainId) !== 8453n || await wallet.getChainId() !== 8453)
    throw new Error("Switch to Base mainnet");
  const receipts = [];
  for (const c of batch.calls) {
    const hash = await wallet.sendTransaction({
      account: batch.from, to: c.to, data: c.data, value: BigInt(c.value),
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status !== "success") throw new Error(`Transaction failed: ${hash}`);
    receipts.push(receipt);
  }
  return receipts;
}
```

An approval can succeed while a later action fails. Inspect the resulting state and request a fresh plan rather than replaying the old batch. If calling JSON-RPC directly, convert decimal `value` to a hex quantity; viem accepts a `bigint`.
