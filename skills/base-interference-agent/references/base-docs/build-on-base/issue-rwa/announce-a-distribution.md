> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Announce a Change to Holders

> Wrap a holder-impacting change on a B20 Asset with an onchain disclosure using announce: additional issuance, multiplier updates, treasury burns, or a notice with no onchain effect.

Issuers of a B20 Asset need a paved way to disclose a change that affects holders, and indexers need a reliable way to tell which changes were announced. `announce` combines the state change and the disclosure in one transaction: it emits `Announcement` before the inner calls and `EndAnnouncement` after them. This guide uses a stock dividend as its worked example; the same bracket applies to any operator-driven change on a B20 Asset, including multiplier updates, treasury burns, and notices with no onchain effect.

> [!NOTE]
>
> Real-world asset (RWA) tokenization is one of many use cases for the [B20 Asset standard](https://docs.base.org/specifications/b20/concepts/token-types.md#4-asset). The examples on this page use a stock token for illustration; the same flows apply to other asset types.
>
> Tokenized securities examples shown for illustration. Base is a general-purpose blockchain; issuance and compliance are the responsibility of the issuer under applicable law.

> [!NOTE]
>
> New to B20? See the [B20 Token Standard](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md) for the concepts and a full launch walkthrough. These samples target `base-std@1505323`, `viem@2.55.11`, and Base Foundry `v1.1.1`.

## Before You Start

You need all of the following:

* A B20 Asset you administer, with `DEFAULT_ADMIN_ROLE` so you can grant roles.
* An account that will call `announce` (the operator). Grant it `OPERATOR_ROLE`.
* Any role the wrapped calls need, granted to the same operator. `batchMint` and `mintWithMemo` need `MINT_ROLE`; `burnWithMemo` needs `BURN_ROLE`; the multiplier setters already use `OPERATOR_ROLE`.
* A never-used `id`, a holder-facing `description`, and optionally a `uri` to the full offchain record.

This surface exists only on **B20 Asset**. Stablecoin has no announcements.

### How an Announcement Works

`announce(internalCalls, id, description, uri)` runs in this order:

1. Emit `Announcement(caller, id, description, uri)`.
2. Run every entry in `internalCalls` atomically. Each entry is ABI-encoded calldata against this asset (at least 4 bytes), not a `(target, calldata)` pair. Inner calls keep their own role gates and run with the operator as `msg.sender`.
3. Emit `EndAnnouncement(id)`.

If any inner call fails, the whole transaction reverts and `id` stays free. A successful `announce` consumes `id` for the asset's lifetime; `isAnnouncementIdUsed(id)` then returns `true`. `description` and `uri` are operator-supplied and not verified by the asset. Nesting `announce` inside an inner call reverts `AnnouncementInProgress`.

For indexers: pair `Announcement` and `EndAnnouncement` by `id`, not only by adjacency. Every effect between the two logs belongs to the announced action. A state change that is not inside a bracket was invoked directly, not through `announce`.

## Announce and Distribute Additional Units

Grant the roles once per token:

```solidity Grant OPERATOR_ROLE and MINT_ROLE theme={null}
asset.grantRole(asset.OPERATOR_ROLE(), operator);
asset.grantRole(asset.MINT_ROLE(), operator);
```

Then encode the inner call and announce it. This example wraps `batchMint` to issue a stock dividend in additional units:

```typescript TypeScript lines wrap expandable highlight={9,13} theme={null}
import { encodeFunctionData, parseUnits, type Address } from "viem";
import { publicClient } from "../../shared/clients.js";
import { assetAbi } from "../abi.js";
import { sendContract } from "../write.js";

export async function announceStockDividend(token: Address, holders: Address[]) {
  const mint = encodeFunctionData({
    abi: assetAbi,
    functionName: "batchMint",
    args: [holders, [parseUnits("30", 6), parseUnits("20", 6)]],
  });
  const id = `dividend-${Date.now()}`;
  await sendContract({
    address: token,
    abi: assetAbi,
    functionName: "announce",
    args: [[mint], id, "Five-percent stock dividend", "https://example.com/actions/dividend"],
  });
  const used = await publicClient.readContract({ address: token, abi: assetAbi, functionName: "isAnnouncementIdUsed", args: [id] });
  if (!used) throw new Error("Announcement was not recorded");
}
```

```solidity Solidity lines wrap expandable highlight={3,4} theme={null}
function announceDividend(address token, address[] memory recipients, uint256[] memory amounts) public {
    bytes[] memory calls = new bytes[](1);
    calls[0] = abi.encodeCall(IB20Asset.batchMint, (recipients, amounts));
    IB20Asset(token).announce(
        calls,
        "2026-stock-dividend-01",
        "Five-percent stock dividend",
        "https://example.com/announcements/2026-01"
    );
    require(IB20Asset(token).isAnnouncementIdUsed("2026-stock-dividend-01"), "announcement missing");
}
```

Recipients must pass `MINT_RECEIVER_POLICY`, `MINT` must not be paused, and `batchMint` is all-or-nothing. On success the asset emits `Announcement`, then one `Transfer(address(0), recipient, amount)` per recipient, then `EndAnnouncement`. With `mintWithMemo` instead of `batchMint`, the order is `Announcement`, `Transfer`, `Memo`, `EndAnnouncement`.

> [!TIP]
>
> `Announcement` and `EndAnnouncement` carry the same `id`, the inner `Transfer` events sit between them, and `isAnnouncementIdUsed(id)` returns `true`.

> [!NOTE]
>
> This example issues additional units. It does not distribute cash. A reinvested dividend that only rescales displayed balances is a multiplier update; see the next section and [Apply a Multiplier](https://docs.base.org/build-on-base/issue-rwa/apply-a-multiplier.md).

## Announce Other Changes

The same bracket discloses any operator-driven change. Each scenario lists the roles the operator needs and the events the asset emits.

### Multiplier Update

Wrap `updateUIMultiplier(newMultiplier, effectiveAt)`. A 2-for-1 split uses `2e18`; a reverse split uses a value below `1e18`. The operator needs `OPERATOR_ROLE` only.

```solidity Announce a multiplier update lines wrap expandable highlight={3} theme={null}
function announceMultiplierUpdate(address token, uint256 newMultiplier, uint256 effectiveAt) public {
    bytes[] memory calls = new bytes[](1);
    calls[0] = abi.encodeCall(IB20Asset.updateUIMultiplier, (newMultiplier, effectiveAt));
    IB20Asset(token).announce(
        calls,
        "2026-multiplier-01",
        "2-for-1 multiplier update",
        "https://example.com/announcements/2026-multiplier-01"
    );
}
```

On success the asset emits `Announcement`, `UIMultiplierUpdated`, then `EndAnnouncement`. `UIMultiplierUpdated` means the schedule was recorded, not that the multiplier is already active. A direct `updateUIMultiplier` with no `announce` still works; indexers should flag it as undisclosed.

To replace a live pending update, cancel and reschedule in one `announce` so both calls share the operator:

```solidity Cancel and reschedule in one announcement wrap theme={null}
bytes[] memory calls = new bytes[](2);
calls[0] = abi.encodeCall(IB20Asset.cancelUIMultiplierUpdate, ());
calls[1] = abi.encodeCall(IB20Asset.updateUIMultiplier, (newMultiplier, effectiveAt));
IB20Asset(token).announce(calls, id, description, uri);
```

### Treasury Burn

Wrap `burnWithMemo(amount, memo)`. The call burns the operator's own balance and is not policy-gated. The operator needs `OPERATOR_ROLE` and `BURN_ROLE`. `BURN` must not be paused.

```solidity Announce a treasury burn wrap theme={null}
bytes[] memory calls = new bytes[](1);
calls[0] = abi.encodeCall(IB20Asset.burnWithMemo, (amount, memo));
IB20Asset(token).announce(calls, id, "Treasury burn", uri);
```

On success the asset emits `Announcement`, `Transfer(operator, address(0), amount)`, `Memo`, then `EndAnnouncement`. `totalSupply` decreases. Do not use the deprecated `burnBlocked`. To take units from a holder and then destroy them, [seize](https://docs.base.org/build-on-base/issue-rwa/seize-and-cancel-units.md) first, then announce the burn from the treasury.

### Notice With No Onchain Effect

Pass an empty `internalCalls` array. The operator needs `OPERATOR_ROLE` only. The asset emits `Announcement` then `EndAnnouncement` with nothing between them. The `id` is still consumed.

```solidity Notice only theme={null}
IB20Asset(token).announce(new bytes[](0), id, description, uri);
```

## Common Errors

These errors follow the order `announce` checks them. Inner-call failures follow.

| Error | Cause | Fix |
| - | - | - |
| `AccessControlUnauthorizedAccount(caller, OPERATOR_ROLE)` | Caller does not hold `OPERATOR_ROLE`. | Grant `OPERATOR_ROLE` to the operator. |
| `AnnouncementIdAlreadyUsed(id)` | A prior successful `announce` consumed `id`. | Choose a new single-use `id`. |
| `InternalCallMalformed(call)` | An inner-call blob is shorter than 4 bytes. | Pass ABI-encoded calldata that includes a selector. |
| `AnnouncementInProgress()` | An inner call targeted `announce`. | Do not nest `announce`. |
| `InternalCallFailed(call)` | An inner call reverted. The reason is not bubbled. | Replay `call` directly to see the underlying error, then fix the cause. |

Typical inner causes of `InternalCallFailed`: missing `MINT_ROLE` or `BURN_ROLE`, paused `MINT` or `BURN`, `UIMultiplierUpdateExists`, `PolicyForbids`, `SupplyCapExceeded`, `InsufficientBalance` (on burn, against the operator's own balance). A Solidity `Panic` such as overflow propagates raw and is not wrapped as `InternalCallFailed`.

## See Also

> [card] [Apply a Multiplier](https://docs.base.org/build-on-base/issue-rwa/apply-a-multiplier.md)
>
> Schedule, cancel, or override a multiplier update.

> [card] [Issue Units to Holders](https://docs.base.org/build-on-base/issue-rwa/issue-units.md)
>
> Mint asset units to holders.
