> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Reconcile with Memos

> Tag stablecoin operations with an onchain reference so you can match them to offchain records at scale.

Tie onchain activity back to your books. A **memo** attaches a `bytes32` reference to an operation and emits a `Memo` event alongside it, so reconciliation is a log query instead of a deposit address per customer. Every core call has a memo variant: `mintWithMemo`, `burnWithMemo`, `transferWithMemo`, and `transferFromWithMemo`.

If you operate the merchant side and need a settlement report across captures, refunds, and payouts, see [Reconcile payments](https://docs.base.org/build-on-base/accept-payments/reconcile-payments.md).

> [!NOTE]
>
> New to B20? See the [B20 Token Standard](https://docs.base.org/specifications/b20.md) for the concepts and a full launch walkthrough. These samples target `base-std@1505323`, `viem@2.55.11`, and Base Foundry `v1.1.1`.

## Attach and Read an Invoice Memo

```typescript TypeScript lines wrap expandable highlight={7,10} theme={null}
import { hexToString, parseEventLogs, parseUnits, stringToHex, type Address } from "viem";
import { b20Abi } from "../abi.js";
import { sendContract } from "../write.js";

export async function payWithMemo(token: Address, merchant: Address) {
  const memo = stringToHex("invoice-8842", { size: 32 });
  const receipt = await sendContract({
    address: token,
    abi: b20Abi,
    functionName: "transferWithMemo",
    args: [merchant, parseUnits("25", 6), memo],
  });
  const [event] = parseEventLogs({ abi: b20Abi, logs: receipt.logs, eventName: "Memo" });
  return hexToString(event.args.memo, { size: 32 }).replace(/\0+$/, "");
}
```

```bash CLI lines wrap expandable highlight={2} theme={null}
MEMO=$(base-cast format-bytes32-string "invoice-8842")
TX=$(base-cast send "$TOKEN_ADDRESS" "transferWithMemo(address,uint256,bytes32)" \
  "$MERCHANT" 25000000 "$MEMO" --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" --json | jq -r .transactionHash)
base-cast receipt "$TX" --rpc-url "$RPC_URL"
```

See the [B20 token standard](https://docs.base.org/specifications/b20.md) for the complete interface, roles, and policies.

> [!TIP]
>
> The receipt contains `Transfer` followed immediately by `Memo`, with `invoice-8842` encoded as `bytes32`.

> [!NOTE]
>
> Join a memo to the preceding operation with `(transactionHash, logIndex - 1)`. Keep the offchain invoice ID unique.

## See Also

> [card] [Request a Commerce Payment](https://docs.base.org/build-on-base/accept-payments/request-a-payment.md)
>
> Use a compatible collector when token policies allow protocol payment transfers.

> [card] [Query B20 Events (CDP SQL API)](https://docs.cdp.coinbase.com/data/sql-api/b20-events)
>
> Reconcile at scale with the CDP SQL API.
