> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Predicates and Safety

> Use validity predicates safely, and understand expiry and replacement for validity transactions.

Predicates are inclusion conditions. They do not guarantee inclusion or successful execution.

## Predicate Types

| Type | Parameters |
| - | - |
| `balance` | `address`, `op`, `value` |
| `nonce` | `address`, `op`, `value` |
| `storage` | `address`, `slot`, `op`, `value`, optional `mask` |
| `block_number` | `op`, `value` |
| `flashblock_index` | Not supported. See [Block Position](#block-position). |

The supported operators are `<`, `<=`, `=`, `!=`, `>`, and `>=`. Predicate values use `0x`-prefixed hexadecimal strings.

## Evaluation

Base evaluates predicates against the state immediately before the transaction would execute. If any predicate is false, the transaction remains pending.

An earlier transaction can change the balance, nonce, or storage value that a pending transaction watches. The pending transaction can then become eligible in the same block.

## Balance Example

```json Balance predicate lines wrap expandable theme={null}
{
  "type": "balance",
  "params": {
    "address": "0x2222222222222222222222222222222222222222",
    "op": ">=",
    "value": "0x1"
  }
}
```

## Nonce Example

```json Nonce predicate lines wrap expandable theme={null}
{
  "type": "nonce",
  "params": {
    "address": "0x2222222222222222222222222222222222222222",
    "op": ">=",
    "value": "0x5"
  }
}
```

A `nonce` predicate compares the account's protocol nonce with `value`. It does not read [EIP-8130](https://docs.base.org/specifications/native-account-abstraction.md) channel nonces. If the account does not exist or was deleted, Base reads its nonce as `0`. The example requires a nonce of at least `5`. Use it to wait for an account's nonce to advance. It does not identify which earlier transaction advanced the nonce, or whether that transaction succeeded.

A nonce mismatch does not expire the transaction, even after the nonce passes a `<`, `<=`, or `=` bound. Base checks the predicate again when the watched nonce changes. The required `block_number` upper bound limits the transaction's lifetime.

## Storage Example

```json Storage predicate lines wrap expandable theme={null}
{
  "type": "storage",
  "params": {
    "address": "0x2222222222222222222222222222222222222222",
    "slot": "0x7",
    "mask": "0xff",
    "op": "=",
    "value": "0x2a"
  }
}
```

Base compares `(storage[address][slot] & mask)` with `value`. Omit `mask` to compare the full storage word.

## Block Position

Use `block_number` to target a block or a range of blocks. Add separate predicates when several conditions must match.

The `flashblock_index` predicate is no longer supported. Base rejects a transaction that includes one with the error `flashblock_index predicates are not supported after Denim: blocks are built every 200ms without flashblocks`.

## Expiry

Every validity transaction must include a `block_number` predicate that sets an upper bound, using `<`, `<=`, or `=`. The bound must be within 60 seconds of submission. This is a time-based limit, not a fixed block count; the equivalent number of blocks depends on block cadence.

## Replacement

A later transaction with the same sender and nonce can replace a pending transaction. If the RPC returns an underpriced-replacement error, increase the fee fields, sign again, and retry.

## Read B20 and Policy Registry State

[B20](https://docs.base.org/specifications/b20.md) tokens and the Policy Registry run as precompiles, but they keep their state in account storage. Each B20 token stores its state at the token address. The Policy Registry stores its state at `0x8453000000000000000000000000000000000002`. A `storage` predicate reads these slots the same way it reads any contract's storage.

The `balance` predicate reads an account's native ETH balance. To gate on a B20 token balance, use a `storage` predicate on the token's balance slot.

### Slot Derivation

B20 and the Policy Registry use [ERC-7201](https://eips.ethereum.org/EIPS/eip-7201) namespaces. A top-level field lives at `root + offset`. A mapping value lives at `keccak256(abi.encode(key, baseSlot))`, where `baseSlot` is `root + offset`. For a nested mapping, hash the outer key first, then hash the inner key against the result. Packed fields follow Solidity packing: byte offset `0` is the lowest-order byte of the word.

| Namespace | Root slot | Read at |
| - | - | - |
| `base.b20` | `0xc78b71fee795ddd74aff64ea9b2474194c938c3196430e10bb5f01ed48434000` | Each B20 token address |
| `base.policy_registry` | `0x00503aeb06982fa1fe3151dc68f90b3946c55c449dfd447e49dcaece71ba4a00` | `0x8453000000000000000000000000000000000002` |

### B20 Token Fields

Offsets from the `base.b20` root. The table lists only the fields a predicate is likely to watch. Offsets `0`–`2` hold the name, symbol, and contract URI, `7` holds role admins, `8` holds the default-admin count, and `13` holds permit nonces. The Asset and Stablecoin variants keep their own fields in separate namespaces (see [Token Types](https://docs.base.org/specifications/b20/concepts/token-types.md)).

| Offset | Field | Encoding |
| - | - | - |
| `3` | `totalSupply` | `uint256` |
| `4` | `balances[account]` | `mapping(address => uint256)` |
| `5` | `allowances[owner][spender]` | `mapping(address => mapping(address => uint256))` |
| `6` | `roles[role][account]` | `mapping(bytes32 => mapping(address => bool))` |
| `9` | Transfer policy IDs | Packed `uint64` values: sender at bytes 0–7, receiver at bytes 8–15, executor at bytes 16–23 |
| `10` | Mint receiver policy ID | `uint64` at bytes 0–7 |
| `11` | Paused features | Bitmask by [`PausableFeature`](https://docs.base.org/specifications/b20/concepts/roles-and-pause) ordinal: `TRANSFER` bit 0, `MINT` bit 1, `BURN` bit 2, `SEIZE` bit 3 |
| `12` | Supply cap | `uint256` |
| `14` | Seize policy IDs | Packed `uint64` values: seize-exempt at bytes 0–7, seize-receiver at bytes 8–15 |

### Policy Registry Fields

Offsets from the `base.policy_registry` root. Policy IDs are `uint64` keys. Bits 56–62 of a policy ID hold its `PolicyType` value (`BLOCKLIST` `0`, `ALLOWLIST` `1`, `UNION` `2`, `INTERSECT` `3`), and bit 63 is the invert flag. For example, `0x0100000000000002` is an allowlist. The table omits offset `2` (pending admins) and offset `3` (the policy ID counter).

| Offset | Field | Encoding |
| - | - | - |
| `0` | `policies[policyId]` | Packed word: admin address in bits 0–159, exists flag in bit 255 |
| `1` | `members[policyId][account]` | `mapping(uint64 => mapping(address => bool))` |
| `4` | `children[policyId]` | Dynamic `uint64[]` of composite child policy IDs |

A `members` flag records list membership, not the `isAuthorized` result. On an allowlist, `true` means the account is authorized. On a blocklist, `true` means the account is blocked.

An [inverted policy ID](https://docs.base.org/specifications/b20/concepts/policies.md#23-inverting-a-policy) has no record of its own. Clear bit 63, read the base policy's slots, and invert the condition you check.

A composite (`UNION` or `INTERSECT`) policy stores child policy IDs, not members, so no single slot holds its result. The array length sits at `keccak256(abi.encode(policyId, root + 4))`. The child IDs are packed four per word, starting at the lowest-order bytes, in the slot at `keccak256(lengthSlot)`. A composite has at most four children, so they fit in that one word. Each child is a simple policy and may carry the invert bit. To watch a composite, read each child's member slot and combine the results yourself. Base requires every predicate in a transaction to hold, so separate predicates can express `INTERSECT`. They cannot express `UNION`.

### Example: Wait for an Allowlist Addition

This example waits until account `0x2222222222222222222222222222222222222222` is added to allowlist policy `0x0100000000000002`. Compute the `members[policyId][account]` slot with `cast index`:

```bash Compute a member slot wrap highlight={4} theme={null}
# members base slot = base.policy_registry root + 1
MEMBERS=0x00503aeb06982fa1fe3151dc68f90b3946c55c449dfd447e49dcaece71ba4a01
PER_POLICY=$(cast index uint64 0x0100000000000002 $MEMBERS)
cast index address 0x2222222222222222222222222222222222222222 $PER_POLICY
# 0xab6b5c5c8192db0f2ec3d37b1368c5e80825e26d023f70403e8633ba8edee364
```

Then wait for that slot to become `1`:

```json Allowlist predicate lines wrap expandable highlight={5,7} theme={null}
{
  "type": "storage",
  "params": {
    "address": "0x8453000000000000000000000000000000000002",
    "slot": "0xab6b5c5c8192db0f2ec3d37b1368c5e80825e26d023f70403e8633ba8edee364",
    "op": "=",
    "value": "0x1"
  }
}
```

To wait until a token's transfers are unpaused, read offset `11` (`0xc78b71fee795ddd74aff64ea9b2474194c938c3196430e10bb5f01ed4843400b`) at the token address with `mask` `0x1` and `value` `0x0`. When you mask a packed field, shift the expected `value` into the same byte position as the mask. Base rejects a storage predicate whose `value` sets bits outside its `mask`.

> [!WARNING]
>
> The storage layout is part of the precompile implementation and can change in a network upgrade. Check the [B20 changelog](https://docs.base.org/specifications/b20/changelog.md) and the [base-std changelog](https://github.com/base/base-std/tree/main/changelog) before you rely on a slot. The [base-std storage layout tests](https://github.com/base/base-std/tree/main/test/unit/storage) show the expected layout.

## Safety

A predicate does not simulate a transaction. Keep critical checks in the application call.

Predicates read raw storage. They cannot call view functions or evaluate computed values. Verify the target contract's storage layout before using a storage predicate.

Do not use transaction placement as a source of randomness. Do not assume a zero-valued slot makes a CREATE2 address, proxy, or uninitialized contract safe to call.

Validity criteria are not recorded onchain. Do not include secrets in calldata or predicate values.
