> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Pause Activity

> Halt transfers, mints, or burns on your stablecoin independently during an incident, then resume when it's resolved.

If something goes wrong, halt activity fast. B20 pausing is **granular**: stop transfers, mints, or burns independently. `PAUSE_ROLE` and `UNPAUSE_ROLE` are separate, so the ability to stop the token can be held more widely than the ability to resume it.

The four pausable features are `TRANSFER`, `MINT`, `BURN`, and `SEIZE` (enum values `0` to `3`). Each is independent: pausing `MINT` and `BURN` leaves `TRANSFER` active. A caller who holds `MINT_ROLE` still cannot mint while `MINT` is paused.

> [!NOTE]
>
> New to B20? See the [B20 Token Standard](https://docs.base.org/specifications/b20.md) for the concepts and a full launch walkthrough. These samples target `base-std@1505323`, `viem@2.55.11`, and Base Foundry `v1.1.1`.

## Pause and Resume Transfers

```typescript TypeScript lines wrap expandable highlight={7} theme={null}
import { type Address } from "viem";
import { publicClient } from "../../shared/clients.js";
import { b20Abi } from "../abi.js";
import { sendContract } from "../write.js";

export async function setTransfersPaused(token: Address, paused: boolean) {
  await sendContract({
    address: token,
    abi: b20Abi,
    functionName: paused ? "pause" : "unpause",
    args: [[0]],
  });
  const current = await publicClient.readContract({ address: token, abi: b20Abi, functionName: "isPaused", args: [0] });
  if (current !== paused) throw new Error("Pause state did not change");
}
```

```bash CLI lines wrap expandable highlight={1,4} theme={null}
base-cast send "$TOKEN_ADDRESS" "pause(uint8[])" "[0]" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY"
base-cast call "$TOKEN_ADDRESS" "isPaused(uint8)(bool)" 0 --rpc-url "$RPC_URL"
base-cast send "$TOKEN_ADDRESS" "unpause(uint8[])" "[0]" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY"
```

See the [B20 token standard](https://docs.base.org/specifications/b20.md) for the complete interface, roles, and policies.

> [!TIP]
>
> `isPaused(0)` returns `true` after pausing and `false` after resuming.

> [!WARNING]
>
> `pause` and `unpause` accept a `PausableFeature[]` array. Passing an empty array reverts `EmptyFeatureSet`. Transfer is enum value `0`; never pass a hash such as `keccak256("TRANSFER")`. A feature already in the requested state is a no-op. The call does not revert.

## Pausable Features

| Feature | Enum value | Gates |
| - | - | - |
| `TRANSFER` | `0` | `transfer`, `transferFrom`, and memo variants |
| `MINT` | `1` | `mint` and `mintWithMemo` |
| `BURN` | `2` | `burn`, `burnWithMemo`, `burnBlocked` |
| `SEIZE` | `3` | `seizeWithMemo` |

When a paused feature blocks a call, the transaction reverts `ContractPaused(feature)`. The error names only the one feature that blocked the call.

## See Also

> [card] [Block an Account](https://docs.base.org/build-on-base/issue-stablecoins/block-an-account.md)
>
> Deny a specific address.

> [card] [Pause (B20 Standard)](https://docs.base.org/specifications/b20/concepts/roles-and-pause.md#3-pause)
>
> Pause controls in the B20 standard.
