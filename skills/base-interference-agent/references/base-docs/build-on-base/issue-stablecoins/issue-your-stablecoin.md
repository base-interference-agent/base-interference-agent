> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Issue Your Stablecoin

> Create a fiat-backed stablecoin on Base with one B20 factory call.

Create a fiat-backed token with one call to the [B20 Factory](https://docs.base.org/specifications/b20/reference/interfaces/ib20-factory/create-b20), using the `STABLECOIN` variant. Decimals are fixed at `6`, and the token carries an immutable, self-declared currency code such as `USD`. The type is sealed into the token address at creation and cannot change.

> [!NOTE]
>
> New to B20? See the [B20 Token Standard](https://docs.base.org/specifications/b20.md) for the concepts and a full launch walkthrough. These samples target `base-std@1505323`, `viem@2.55.11`, and Base Foundry `v1.1.1`.

## How the Stablecoin Variant Works

Passing `STABLECOIN` to `createB20` writes discriminant byte `0x01` into position `[10]` of the token address. After the call returns:

* `decimals()` returns `6` (hardcoded; you do not pass a decimals value).
* `currency()` returns the immutable code you provided (for example `"USD"`). B20 checks the format only, not that the code is a real currency.
* The `IB20Stablecoin` surface is live at that address.
* Asset-only selectors (`announce`, `updateUIMultiplier`, `batchMint`) do not execute on this address.

The `currency` field is required and must be uppercase ASCII `A` to `Z` only. An empty code reverts `MissingRequiredField`; any other byte reverts `InvalidCurrency`.

## Create and Verify the Stablecoin

```typescript TypeScript lines wrap expandable highlight={26} theme={null}
import { encodeAbiParameters, encodeFunctionData, keccak256, parseAbiParameters, parseEventLogs, stringToBytes } from "viem";
import { account } from "../../shared/clients.js";
import { B20_FACTORY, b20Abi, factoryAbi, role } from "../abi.js";
import { sendContract } from "../write.js";

export async function createStablecoin() {
  const salt = keccak256(stringToBytes("merchant-usd-v1"));
  const params = encodeAbiParameters(
    parseAbiParameters(
      "(uint8 version,string name,string symbol,address initialAdmin,string currency)",
    ),
    [{ version: 1, name: "Merchant USD", symbol: "MUSD", initialAdmin: account.address, currency: "USD" }],
  );
  const initCalls = [
    encodeFunctionData({
      abi: b20Abi,
      functionName: "grantRole",
      args: [role("MINT_ROLE"), account.address],
    }),
    encodeFunctionData({
      abi: b20Abi,
      functionName: "updateSupplyCap",
      args: [10_000_000n * 10n ** 6n],
    }),
  ];
  const receipt = await sendContract({
    address: B20_FACTORY,
    abi: factoryAbi,
    functionName: "createB20",
    args: [1, salt, params, initCalls],
  });
  const [created] = parseEventLogs({ abi: factoryAbi, logs: receipt.logs, eventName: "B20Created" });
  return created.args.token;
}
```

```solidity Solidity lines wrap expandable highlight={1} theme={null}
    function createStablecoin(address admin) public returns (address token) {
        B20FactoryLib.B20RoleHolders memory holders = B20FactoryLib.B20RoleHolders({
            minter: admin,
            burner: admin,
            burnBlocker: admin,
            pauser: admin,
            unpauser: admin,
            metadataAdmin: admin
        });
        bytes[] memory roles = B20FactoryLib.buildRoleGrants(holders);
        bytes[] memory settings = new bytes[](1);
        settings[0] = B20FactoryLib.encodeUpdateSupplyCap(10_000_000e6);
        token = StdPrecompiles.B20_FACTORY.createB20(
            IB20Factory.B20Variant.STABLECOIN,
            keccak256("merchant-usd-v1"),
            B20FactoryLib.encodeStablecoinCreateParams("Merchant USD", "MUSD", admin, "USD"),
            B20FactoryLib.concat(roles, settings)
        );
    }
```

The `params` blob is ABI-encoded with a leading `version` byte (currently `1`) as `B20StablecoinCreateParams`: `version`, `name`, `symbol`, `initialAdmin`, and `currency`. Optional `initCalls` run on the new token in the same transaction; the factory drops access after they complete.

See the [B20 token standard](https://docs.base.org/specifications/b20.md) for the complete interface, roles, and policies.

> [!TIP]
>
> The factory emits `B20Created`, and the returned token address is ready for minting.

> [!WARNING]
>
> B20 tokens are open by default. Configure roles, policies, and the supply cap during creation before issuing value.

## See Also

> [card] [Mint Supply](https://docs.base.org/build-on-base/issue-stablecoins/mint-supply.md)
>
> Increase circulating supply.

> [card] [Restrict Who Can Hold It](https://docs.base.org/build-on-base/issue-stablecoins/restrict-who-can-hold.md)
>
> Allowlist eligible holders.
