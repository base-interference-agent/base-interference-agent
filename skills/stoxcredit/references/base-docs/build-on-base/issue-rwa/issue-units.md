> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Issue Units to Holders

> Distribute B20 Asset units to multiple approved holders in one batch.

Distribute shares to multiple holders in one all-or-nothing transaction with B20 Asset's `batchMint`. Every recipient must pass the token's mint-receiver policy, and the combined issuance must stay below its supply cap.

> [!NOTE]
>
> Real-world asset (RWA) tokenization is one of many use cases for the [B20 Asset standard](https://docs.base.org/specifications/b20/concepts/token-types.md#4-asset). The examples on this page use a stock token for illustration; the same flows apply to other asset types.
>
> Tokenized securities examples shown for illustration. Base is a general-purpose blockchain; issuance and compliance are the responsibility of the issuer under applicable law.

> [!NOTE]
>
> New to B20? See the [B20 Token Standard](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md) for the concepts and a full launch walkthrough. These samples target `base-std@1505323`, `viem@2.55.11`, and Base Foundry `v1.1.1`.

## Issue and Verify the Shares

```typescript TypeScript lines wrap expandable highlight={8} theme={null}
import { parseUnits, type Address } from "viem";
import { publicClient } from "../../shared/clients.js";
import { assetAbi, b20Abi } from "../abi.js";
import { sendContract } from "../write.js";

export async function issueShares(token: Address, holders: [Address, Address]) {
  const amounts = [parseUnits("600", 6), parseUnits("400", 6)] as const;
  await sendContract({ address: token, abi: assetAbi, functionName: "batchMint", args: [holders, amounts] });
  const balances = await Promise.all(holders.map((holder) => publicClient.readContract({ address: token, abi: b20Abi, functionName: "balanceOf", args: [holder] })));
  if (balances[0] !== amounts[0] || balances[1] !== amounts[1]) throw new Error("Unexpected issuance balances");
}
```

```solidity Solidity lines wrap expandable highlight={8} theme={null}
    function issueShares(address token, address alice, address bob) public {
        address[] memory recipients = new address[](2);
        recipients[0] = alice;
        recipients[1] = bob;
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 600e6;
        amounts[1] = 400e6;
        IB20Asset(token).batchMint(recipients, amounts);
    }
```

```bash CLI lines wrap expandable highlight={1} theme={null}
base-cast send "$TOKEN_ADDRESS" "batchMint(address[],uint256[])" \
  "[$ALICE,$BOB]" "[600000000,400000000]" --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY"
base-cast call "$TOKEN_ADDRESS" "balanceOf(address)(uint256)" "$ALICE" --rpc-url "$RPC_URL"
```

See the [B20 token standard](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md) for the complete interface, roles, and policies.

> [!TIP]
>
> Alice holds 600 EXM and Bob holds 400 EXM after the all-or-nothing batch.

> [!WARNING]
>
> The entire batch reverts if lengths differ, a recipient fails policy, or total supply would exceed the cap.

## See Also

> [card] [Restrict Eligible Holders](https://docs.base.org/build-on-base/issue-rwa/restrict-eligible-holders.md)
>
> Gate who can hold with policies.

> [card] [Announce a Change to Holders](https://docs.base.org/build-on-base/issue-rwa/announce-a-distribution.md)
>
> Disclose additional issuance or another holder-impacting change onchain.
