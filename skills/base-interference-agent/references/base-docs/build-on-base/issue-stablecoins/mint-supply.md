> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Mint Supply

> Issue new stablecoin supply on Base as reserves grow, gated by a minter role and an optional supply cap.

When fiat lands in reserves, mint matching supply. Minting is gated by `MINT_ROLE`, and an optional supply cap keeps circulation from exceeding your reserves.

> [!NOTE]
>
> New to B20? See the [B20 Token Standard](https://docs.base.org/specifications/b20.md) for the concepts and a full launch walkthrough. These samples target `base-std@1505323`, `viem@2.55.11`, and Base Foundry `v1.1.1`.

## Mint and Verify Supply

```typescript TypeScript lines wrap expandable highlight={8} theme={null}
import { parseUnits, type Address } from "viem";
import { publicClient } from "../../shared/clients.js";
import { b20Abi } from "../abi.js";
import { sendContract } from "../write.js";

export async function mintAndVerify(token: Address, holder: Address) {
  const amount = parseUnits("1000", 6);
  await sendContract({ address: token, abi: b20Abi, functionName: "mint", args: [holder, amount] });
  const balance = await publicClient.readContract({ address: token, abi: b20Abi, functionName: "balanceOf", args: [holder] });
  if (balance < amount) throw new Error("Minted balance was not recorded");
  return balance;
}
```

```solidity Solidity lines wrap expandable highlight={1} theme={null}
    function mintStablecoin(address token, address holder) public {
        IB20(token).mint(holder, 1_000e6);
        require(IB20(token).balanceOf(holder) >= 1_000e6, "mint not recorded");
    }
```

```bash CLI lines wrap expandable highlight={1} theme={null}
base-cast send "$TOKEN_ADDRESS" "mint(address,uint256)" "$HOLDER" 1000000000 \
  --rpc-url "$RPC_URL" --private-key "$PRIVATE_KEY"
base-cast call "$TOKEN_ADDRESS" "balanceOf(address)(uint256)" "$HOLDER" --rpc-url "$RPC_URL"
```

See the [B20 token standard](https://docs.base.org/specifications/b20.md) for the complete interface, roles, and policies.

> [!TIP]
>
> The holder balance increases by `1,000,000,000` base units, or 1,000 MUSD.

> [!WARNING]
>
> The caller needs `MINT_ROLE`, the recipient must pass `MINT_RECEIVER_POLICY`, and the mint must remain under the supply cap.

## See Also

> [card] [Burn Supply](https://docs.base.org/build-on-base/issue-stablecoins/burn-supply.md)
>
> Remove tokens from supply.

> [card] [Supply Cap (B20 Standard)](https://docs.base.org/specifications/b20/reference/interfaces/ib20/supply-cap)
>
> Supply cap in the B20 standard.
