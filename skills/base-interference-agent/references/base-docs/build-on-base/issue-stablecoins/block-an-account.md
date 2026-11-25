> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Block an Account

> Stop a specific address from moving your stablecoin when a compliance hold requires it, without affecting other holders.

Sometimes you need to stop one address from moving your stablecoin: a compliance hold or a support request. A **blocklist** denies only the addresses you list and leaves every other holder untouched. Bind it to the sender scope so a blocked account can't send.

> [!NOTE]
>
> New to B20? See the [B20 Token Standard](https://docs.base.org/specifications/b20.md) for the concepts and a full launch walkthrough. These samples target `base-std@1505323`, `viem@2.55.11`, and Base Foundry `v1.1.1`.

## Block and Verify an Account

```typescript TypeScript lines wrap expandable highlight={7,10} theme={null}
import { type Address } from "viem";
import { publicClient } from "../../shared/clients.js";
import { POLICY_REGISTRY, policyRegistryAbi } from "../abi.js";
import { sendContract } from "../write.js";

export async function setBlocked(policyId: bigint, holder: Address, blocked: boolean) {
  await sendContract({
    address: POLICY_REGISTRY,
    abi: policyRegistryAbi,
    functionName: "updateBlocklist",
    args: [policyId, blocked, [holder]],
  });
  const authorized = await publicClient.readContract({
    address: POLICY_REGISTRY,
    abi: policyRegistryAbi,
    functionName: "isAuthorized",
    args: [policyId, holder],
  });
  if (authorized === blocked) throw new Error("Unexpected blocklist state");
}
```

```solidity Solidity lines wrap expandable highlight={4} theme={null}
    function setBlocked(uint64 policyId, address holder, bool blocked) public {
        address[] memory accounts = new address[](1);
        accounts[0] = holder;
        StdPrecompiles.POLICY_REGISTRY.updateBlocklist(policyId, blocked, accounts);
        require(StdPrecompiles.POLICY_REGISTRY.isAuthorized(policyId, holder) != blocked, "wrong policy state");
    }
```

```bash CLI lines wrap expandable highlight={1} theme={null}
base-cast send "$POLICY_REGISTRY" "updateBlocklist(uint64,bool,address[])" \
  "$BLOCKLIST_ID" true "[$ACCOUNT]" --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY"
base-cast call "$POLICY_REGISTRY" "isAuthorized(uint64,address)(bool)" \
  "$BLOCKLIST_ID" "$ACCOUNT" --rpc-url "$RPC_URL"
```

See the [B20 token standard](https://docs.base.org/specifications/b20.md) for the complete interface, roles, and policies.

> [!TIP]
>
> `isAuthorized(policyId, account)` returns `false` while the account is blocked.

> [!WARNING]
>
> This only stops outgoing transfers when the blocklist is bound to `TRANSFER_SENDER_POLICY`. Unblock with the same call and `false`.

## Make a Blocked Account Recoverable

Blocking under `TRANSFER_SENDER_POLICY` freezes the account's outgoing transfers. It does not, on its own, let you move the balance out. Seize reads a separate scope, `SEIZE_EXEMPT_POLICY`, whose check is inverted: an account that is **not** authorized under the attached policy is seizable. Attach the same blocklist there so a single hold both freezes the account and makes it recoverable:

```solidity Attach the blocklist to the seize scope theme={null}
token.updatePolicy(token.SEIZE_EXEMPT_POLICY(), blocklistId);
```

Attach a blocklist, never an allowlist, to `SEIZE_EXEMPT_POLICY`: an empty allowlist authorizes nobody, which would make every holder seizable. See [Recover Funds](https://docs.base.org/build-on-base/issue-stablecoins/recover-funds.md) for the seize itself.

## See Also

> [card] [Recover Funds](https://docs.base.org/build-on-base/issue-stablecoins/recover-funds.md)
>
> Move a blocked balance to safekeeping with seizeWithMemo.

> [card] [Pause Activity](https://docs.base.org/build-on-base/issue-stablecoins/pause-activity.md)
>
> Freeze all token activity.
