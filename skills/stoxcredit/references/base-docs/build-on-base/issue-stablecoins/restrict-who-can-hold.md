> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Restrict Who Can Hold It

> Limit transfers of your stablecoin to accounts your KYC program has approved, using B20 transfer policies.

Keep your stablecoin within a known set of holders with an **allowlist**: transfers only settle between accounts your KYC program has approved. You manage the list in the [Policy Registry](https://docs.base.org/specifications/b20/concepts/policies.md#21-the-registry-and-the-token) and bind it to the token's transfer scopes.

> [!NOTE]
>
> New to B20? See the [B20 Token Standard](https://docs.base.org/specifications/b20.md) for the concepts and a full launch walkthrough. These samples target `base-std@1505323`, `viem@2.55.11`, and Base Foundry `v1.1.1`.

## How Policies Work

The Policy Registry is a singleton precompile that stores each member list once. A token stores only a `uint64` policy ID per scope. When a gated function runs, the token calls `isAuthorized(policyId, account)` on the registry. Many tokens can share one policy; an update to the policy is immediately visible to every token that references it.

Scopes gate specific functions. `TRANSFER_SENDER_POLICY` and `TRANSFER_RECEIVER_POLICY` check the sender and recipient on every `transfer` and `transferFrom`. `MINT_RECEIVER_POLICY` checks the recipient on every `mint`. All three default to `ALWAYS_ALLOW` (`0`) until you bind a policy.

An **allowlist** authorizes only accounts in the set. An empty allowlist authorizes nobody, so seed your intended holders before binding the policy.

## Create and Bind a Holder Allowlist

```typescript TypeScript lines wrap expandable highlight={7,10,16} theme={null}
import { parseEventLogs, type Address } from "viem";
import { account, publicClient } from "../../shared/clients.js";
import { POLICY_REGISTRY, b20Abi, policyRegistryAbi, scope } from "../abi.js";
import { sendContract } from "../write.js";

export async function createHolderAllowlist(token: Address, holders: Address[]) {
  const receipt = await sendContract({
    address: POLICY_REGISTRY,
    abi: policyRegistryAbi,
    functionName: "createPolicyWithAccounts",
    args: [account.address, 1, holders],
  });
  const [created] = parseEventLogs({ abi: policyRegistryAbi, logs: receipt.logs, eventName: "PolicyCreated" });
  const policyId = created.args.policyId;
  for (const policyScope of [scope("TRANSFER_SENDER_POLICY"), scope("TRANSFER_RECEIVER_POLICY")]) {
    await sendContract({ address: token, abi: b20Abi, functionName: "updatePolicy", args: [policyScope, policyId] });
  }
  const saved = await publicClient.readContract({ address: token, abi: b20Abi, functionName: "policyId", args: [scope("TRANSFER_RECEIVER_POLICY")] });
  if (saved !== policyId) throw new Error("Policy was not bound");
  return policyId;
}
```

```solidity Solidity lines wrap expandable highlight={2,5,6} theme={null}
    function restrictStablecoin(address token, address admin, address[] memory holders) public returns (uint64 id) {
        id = StdPrecompiles.POLICY_REGISTRY.createPolicyWithAccounts(
            admin, IPolicyRegistry.PolicyType.ALLOWLIST, holders
        );
        IB20(token).updatePolicy(B20Constants.TRANSFER_SENDER_POLICY, id);
        IB20(token).updatePolicy(B20Constants.TRANSFER_RECEIVER_POLICY, id);
        require(IB20(token).policyId(B20Constants.TRANSFER_RECEIVER_POLICY) == id, "policy not bound");
    }
```

```bash CLI lines wrap expandable highlight={2,8} theme={null}
CREATE_TX=$(base-cast send "$POLICY_REGISTRY" \
  "createPolicyWithAccounts(address,uint8,address[])" "$ADMIN" 1 "[$ALICE,$BOB]" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" --json | jq -r .transactionHash)
POLICY_TOPIC=$(base-cast receipt "$CREATE_TX" --rpc-url "$RPC_URL" --json | \
  jq -r '.logs[] | select(.address | ascii_downcase == "0x8453000000000000000000000000000000000002") | .topics[1]' | head -1)
POLICY_ID=$(base-cast to-dec "$POLICY_TOPIC")
for SCOPE in TRANSFER_SENDER_POLICY TRANSFER_RECEIVER_POLICY; do
  base-cast send "$TOKEN_ADDRESS" "updatePolicy(bytes32,uint64)" "$(base-cast keccak "$SCOPE")" "$POLICY_ID" \
    --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY"
done
```

> [!TIP]
>
> The token returns the new policy ID for both transfer policy scopes.

> [!WARNING]
>
> An allowlist denies every account not in the policy. Seed intended holders before binding it, and retain the `PolicyCreated` ID. Membership batches are capped at 64 accounts per call; call `updateAllowlist` to add more after creation.

## Update Membership

After creation, only the policy admin can add or remove accounts. Call `updateAllowlist(policyId, true, accounts)` to add and `updateAllowlist(policyId, false, accounts)` to remove. The change is visible to every token that references the policy on the next call. No second `updatePolicy` is needed on the token.

To combine a KYC allowlist with a sanctions blocklist, create an `INTERSECT` composite policy referencing both simple policies, then bind the composite ID to the token's scopes. See the [B20 token standard](https://docs.base.org/specifications/b20.md) for the full policy type reference.

## See Also

> [card] [Block an Account](https://docs.base.org/build-on-base/issue-stablecoins/block-an-account.md)
>
> Deny a specific address.

> [card] [Policy Integration (B20 Standard)](https://docs.base.org/specifications/b20/concepts/policies.md#32-policy-scopes)
>
> Policy hooks in the B20 standard.
