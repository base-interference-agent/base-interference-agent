> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Restrict Eligible Holders

> Keep units within an approved set of holders by binding a B20 allowlist to issuance and transfers.

Create an allowlist in the [Policy Registry](https://docs.base.org/specifications/b20/concepts/policies.md#21-the-registry-and-the-token), then apply it when shares are issued, sent, or received. Accounts remain ineligible until the policy admin adds them.

> [!NOTE]
>
> Real-world asset (RWA) tokenization is one of many use cases for the [B20 Asset standard](https://docs.base.org/specifications/b20/concepts/token-types.md#4-asset). The examples on this page use a stock token for illustration; the same flows apply to other asset types.
>
> Tokenized securities examples shown for illustration. Base is a general-purpose blockchain; issuance and compliance are the responsibility of the issuer under applicable law.

> [!NOTE]
>
> New to B20? See the [B20 Token Standard](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md) for the concepts and a full launch walkthrough. These samples target `base-std@1505323`, `viem@2.55.11`, and Base Foundry `v1.1.1`.

## Create and Bind the Eligibility Policy

```typescript TypeScript lines wrap expandable highlight={7,10} theme={null}
import { parseEventLogs, type Address } from "viem";
import { account } from "../../shared/clients.js";
import { POLICY_REGISTRY, b20Abi, policyRegistryAbi, scope } from "../abi.js";
import { sendContract } from "../write.js";

export async function restrictStockHolders(token: Address, holders: Address[]) {
  const receipt = await sendContract({ address: POLICY_REGISTRY, abi: policyRegistryAbi, functionName: "createPolicyWithAccounts", args: [account.address, 1, holders] });
  const [created] = parseEventLogs({ abi: policyRegistryAbi, logs: receipt.logs, eventName: "PolicyCreated" });
  for (const policyScope of [scope("MINT_RECEIVER_POLICY"), scope("TRANSFER_SENDER_POLICY"), scope("TRANSFER_RECEIVER_POLICY")]) {
    await sendContract({ address: token, abi: b20Abi, functionName: "updatePolicy", args: [policyScope, created.args.policyId] });
  }
  return created.args.policyId;
}
```

```solidity Solidity lines wrap expandable highlight={2,5,6,7} theme={null}
    function restrictStock(address token, address admin, address[] memory holders) public returns (uint64 id) {
        id = StdPrecompiles.POLICY_REGISTRY.createPolicyWithAccounts(
            admin, IPolicyRegistry.PolicyType.ALLOWLIST, holders
        );
        IB20(token).updatePolicy(B20Constants.MINT_RECEIVER_POLICY, id);
        IB20(token).updatePolicy(B20Constants.TRANSFER_SENDER_POLICY, id);
        IB20(token).updatePolicy(B20Constants.TRANSFER_RECEIVER_POLICY, id);
    }
```

```bash CLI lines wrap expandable highlight={2,7} theme={null}
CREATE_TX=$(base-cast send "$POLICY_REGISTRY" \
  "createPolicyWithAccounts(address,uint8,address[])" "$ADMIN" 1 "[$ALICE,$BOB]" \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY" --json | jq -r .transactionHash)
POLICY_TOPIC=$(base-cast receipt "$CREATE_TX" --rpc-url "$RPC_URL" --json | jq -r '.logs[0].topics[1]')
POLICY_ID=$(base-cast to-dec "$POLICY_TOPIC")
for SCOPE in MINT_RECEIVER_POLICY TRANSFER_SENDER_POLICY TRANSFER_RECEIVER_POLICY; do
  base-cast send "$TOKEN_ADDRESS" "updatePolicy(bytes32,uint64)" "$(base-cast keccak "$SCOPE")" "$POLICY_ID" \
    --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY"
done
```

See the [B20 token standard](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md) for the complete interface, roles, and policies.

> [!TIP]
>
> The same allowlist policy gates mint recipients, transfer senders, and transfer recipients.

> [!WARNING]
>
> Seed all intended holders before binding an allowlist. An unlisted account becomes ineligible immediately.

## See Also

> [card] [Restrict Who Can Initiate Transfers](https://docs.base.org/build-on-base/issue-rwa/restrict-transfer-initiators.md)
>
> Require a designated initiator for every transfer.

> [card] [Pause Transfers](https://docs.base.org/build-on-base/issue-rwa/pause-transfers.md)
>
> Halt transfers in an emergency.
