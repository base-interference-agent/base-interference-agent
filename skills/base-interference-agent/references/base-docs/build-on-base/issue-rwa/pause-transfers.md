> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Pause Transfers

> Pause transfers on a B20 Asset token during an incident while leaving minting and burning available.

Pause the `TRANSFER` feature during an incident without stopping issuance or cancellation. B20 grants pause and unpause through separate roles so you can separate emergency response from recovery authority.

> [!NOTE]
>
> Real-world asset (RWA) tokenization is one of many use cases for the [B20 Asset standard](https://docs.base.org/specifications/b20/concepts/token-types.md#4-asset). The examples on this page use a stock token for illustration; the same flows apply to other asset types.
>
> Tokenized securities examples shown for illustration. Base is a general-purpose blockchain; issuance and compliance are the responsibility of the issuer under applicable law.

> [!NOTE]
>
> New to B20? See the [B20 Token Standard](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md) for the concepts and a full launch walkthrough. These samples target `base-std@1505323`, `viem@2.55.11`, and Base Foundry `v1.1.1`.

## Pause and Resume Stock Transfers

```typescript TypeScript lines wrap expandable highlight={7} theme={null}
import { type Address } from "viem";
import { publicClient } from "../../shared/clients.js";
import { b20Abi } from "../abi.js";
import { sendContract } from "../write.js";

export async function setStockTransfersPaused(token: Address, paused: boolean) {
  await sendContract({ address: token, abi: b20Abi, functionName: paused ? "pause" : "unpause", args: [[0]] });
  const current = await publicClient.readContract({ address: token, abi: b20Abi, functionName: "isPaused", args: [0] });
  if (current !== paused) throw new Error("Unexpected transfer pause state");
}
```

```bash CLI lines wrap expandable highlight={1,4} theme={null}
base-cast send "$TOKEN_ADDRESS" "pause(uint8[])" "[0]" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY"
base-cast call "$TOKEN_ADDRESS" "isPaused(uint8)(bool)" 0 --rpc-url "$RPC_URL"
base-cast send "$TOKEN_ADDRESS" "unpause(uint8[])" "[0]" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY"
```

`pause` and `unpause` each accept a `PausableFeature[]` array. Pass `[0]` to target `TRANSFER` only. The four pausable features are `TRANSFER` (0), `MINT` (1), `BURN` (2), and `SEIZE` (3). Pausing one feature does not affect the others. A holder can still transfer while `MINT` is paused, and a minter can still mint while `TRANSFER` is paused.

Passing an empty array reverts `EmptyFeatureSet`. A feature already in the requested state is a no-op; the call does not revert. After the call, read `isPaused(feature)` to confirm the current state. The event emitted (`Paused` or `Unpaused`) carries the exact array you passed, not the resulting paused set.

If a caller attempts an operation while its feature is paused, the call reverts `ContractPaused(feature)`.

> [!TIP]
>
> Transfer pause state changes without pausing mint or burn.

> [!NOTE]
>
> `pause` requires `PAUSE_ROLE`. `unpause` requires `UNPAUSE_ROLE`. These are separate roles, so grant recovery authority more narrowly than emergency pause authority.

## See Also

> [card] [Restrict Eligible Holders](https://docs.base.org/build-on-base/issue-rwa/restrict-eligible-holders.md)
>
> Gate who can hold with policies.

> [card] [Seize and Cancel Units](https://docs.base.org/build-on-base/issue-rwa/seize-and-cancel-units.md)
>
> Move units from an ineligible holder to safekeeping, then cancel them.
