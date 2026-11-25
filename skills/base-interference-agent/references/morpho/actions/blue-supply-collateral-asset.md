# Blue Supply Collateral Asset (Actions API)

Builds and simulates wallet calls for supplying an exact collateral-asset amount to an existing market on the registered Morpho Blue deployment.

Private API only. An API key is required. Use https://private.api.morpho.org. [Request an API key](https://docs.morpho.org/request-api-key/).

Source: https://docs.morpho.org/api/actions/blue/blue-supply-collateral-asset

## Request

`POST /v0/actions/blue/markets/{market-selector}/supply-collateral`

## Parameters

| Name | In | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `market-selector` | path | string | yes | Morpho Blue market selector formatted as <chain_id>:<market_id>. The chain ID is at most 9007199254740991. |

## Request body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `account` | string | in some variants | Checksummed action account; the zero address is rejected. |
| `calldata_origin` | string | no | Optional per-request integration attribution tag. When the deployment also configures a base origin, transactions end with [timestamp][calldata_origin][base origin]. This analytics tag is not an authentication signal. |
| `expires_at` | integer | no | Optional Unix timestamp in seconds when the action expires. Defaults to 30 minutes from now. Must be more than 60 seconds and at most two hours from now. |
| `amount` | object | in some variants |  |
| `amount.unit` | string (`assets`) | yes |  |
| `amount.value` | string | yes | Exact collateral-token amount to supply in base units. |
| `funding` | object | in some variants | Select ERC-20, native-currency, or balance-based automatic funding. Native and auto modes require a maximum native spend. |
| `funding.type` | string (`erc20`, `native`, `auto`) | yes |  |
| `funding.max_native_assets` | string | when `type` is `native`, `auto` | Exact amount in token base units. |
| `signature_mode` | string (`none`, `auto`) | no | Controls typed-data requirements. "none" returns prerequisite approval and authorization calls without requesting signatures. "auto" reuses sufficient allowances, otherwise requests ERC-2612 permits when the on-chain domain matches, and falls back to approval calls. Morpho authorization uses signatures. Smart-contract accounts (excluding EIP-7702 delegated EOAs) receive calls only. Defaults to "none". |
| `continuation` | string | in some variants |  |
| `signatures[]` | object[] | in some variants | Signatures collected for this continuation. Every signature ID must be unique and match one requested signature. |
| `signatures[].id` | string | yes |  |
| `signatures[].signature` | string | yes |  |

Example (Supply collateral with ERC-20 funding):

```json
{
  "account": "0x545b6Cc751F0C47C202694cf835db2E3C071400A",
  "amount": {
    "unit": "assets",
    "value": "1000000"
  },
  "funding": {
    "type": "erc20"
  }
}
```

Example (Fund the collateral with native currency):

```json
{
  "account": "0x6aBB9Aeb93e9aF04c8D9FD2b84BF6ca8EDC3eAf2",
  "amount": {
    "unit": "assets",
    "value": "1000000"
  },
  "funding": {
    "type": "native",
    "max_native_assets": "1000000"
  }
}
```

Example (Select collateral funding from the wallet balance):

```json
{
  "account": "0x6aBB9Aeb93e9aF04c8D9FD2b84BF6ca8EDC3eAf2",
  "amount": {
    "unit": "assets",
    "value": "1000000"
  },
  "funding": {
    "type": "auto",
    "max_native_assets": "1000000"
  }
}
```

## Response 200

A token signature request or prepared collateral-supply calls with simulation results.

| Header | Type | Description |
| --- | --- | --- |
| `Morpho-Action-Proof` | string | Integrity proof for this response. |
| `Cache-Control` | string (`private, no-store, no-transform`) | Action responses are not cacheable. |

Verify the `Morpho-Action-Proof` header before signing typed data or sending calls: [Verify Action API responses](https://docs.morpho.org/api/actions/verify-responses.md).

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | object | yes |  |
| `data.action_id` | string | yes | Opaque identifier for this action. |
| `data.status` | string (`prepared`, `simulation_failed`, `signature_required`) | yes |  |
| `data.chain_id` | integer | yes | EVM chain identifier. |
| `data.account` | string | yes | Checksummed EVM address. |
| `data.expires_at` | integer | yes | Unix timestamp in seconds when the action response expires. Variable-rate market and Midnight actions default to 30 minutes from now, and vault actions default to two hours from now, unless the request sets `expires_at`. Quote-priced Midnight actions expire earlier when an offer they take expires sooner, and are only returned with at least 5 minutes remaining. Finalize signature-required actions with more than 60 seconds remaining. Direct Midnight collateral supply, direct Midnight redemption, and Vault V2 force redeem do not enforce this deadline onchain. |
| `data.market` | object | when `status` is `prepared`, `simulation_failed` |  |
| `data.market.id` | string | yes |  |
| `data.market.collateral_asset` | object | yes |  |
| `data.market.collateral_asset.address` | string | yes | Checksummed EVM address. |
| `data.amount` | object | when `status` is `prepared`, `simulation_failed` |  |
| `data.amount.unit` | string (`assets`) | yes |  |
| `data.amount.value` | string | yes | Collateral-token amount in base units. |
| `data.calls[]` | object[] | when `status` is `prepared` |  |
| `data.calls[].id` | string | yes |  |
| `data.calls[].kind` | string (`approval`, `authorization`, `blue_supply_collateral`, `blue_withdraw_collateral`) | yes | Call type. `approval` and `authorization` calls must be sent before the final action call. |
| `data.calls[].to` | string | yes | Checksummed EVM address. |
| `data.calls[].data` | string | yes |  |
| `data.calls[].value` | string | yes | Native currency amount in wei sent with the call, as a decimal string. |
| `data.action` | string (`blue.supply_collateral`) | yes |  |
| `data.resolved_funding` | object | when `status` is `prepared`, `simulation_failed` |  |
| `data.resolved_funding.wrapped_asset` | string | yes | Checksummed EVM address. |
| `data.resolved_funding.max_native_assets` | string | yes | Exact amount in token base units. |
| `data.resolved_funding.erc20_assets` | string | yes | Exact amount in token base units. |
| `data.resolved_funding.native_assets` | string | yes | Exact amount in token base units. |
| `data.simulation` | object | when `status` is `prepared`, `simulation_failed` |  |
| `data.simulation.status` | string (`success`, `failed`) | yes |  |
| `data.simulation.block` | object | when `status` is `success` | Chain state context used for the successful simulation. |
| `data.simulation.block.number` | string | yes | Block number used as the simulation execution context. |
| `data.simulation.block.timestamp` | integer | yes | Unix timestamp of the simulation execution block, in seconds. |
| `data.simulation.wallet_changes[]` | object[] | when `status` is `success` | Changes to the selected account's spendable native-currency and ERC-20 balances. Protocol position changes are reported separately. |
| `data.simulation.wallet_changes[].asset` | object | yes | Native currency or ERC-20 token affected by the simulation. |
| `data.simulation.wallet_changes[].asset.type` | string (`erc20`, `native`) | yes |  |
| `data.simulation.wallet_changes[].asset.address` | string | when `type` is `erc20` | Checksummed EVM address. |
| `data.simulation.wallet_changes[].difference` | string | yes | Change to the selected account's spendable balance, in asset base units. |
| `data.simulation.position_changes` | object | when `status` is `success` | Simulated changes to the account's Morpho Blue position. |
| `data.simulation.position_changes.supply_shares` | string | yes | Change to Morpho Blue supply shares. |
| `data.simulation.position_changes.borrow_shares` | string | yes | Change to Morpho Blue borrow shares. |
| `data.simulation.position_changes.collateral_assets` | string | yes | Change to supplied collateral, in collateral-token base units. |
| `data.simulation.effects` | object | when `status` is `success` | Collateral supply confirmed by the simulation. |
| `data.simulation.effects.supplied_collateral_assets` | string | yes | Collateral supplied, in collateral-token base units. |
| `data.simulation.sender_simulated_as_delegated` | boolean (`true`) | no | Present when `account` holds smart-contract code on a chain whose simulation requires an EOA sender (Monad). The simulation then ran `account` as an EIP-7702 delegated account executing its own bytecode against its own storage. Inside the simulation, `EXTCODESIZE` and `EXTCODEHASH` on `account` observe the 23-byte delegation designator, and the first call into `account` pays about 2,600 extra gas for the cold delegate access. |
| `data.simulation.failure` | object | when `status` is `failed` |  |
| `data.simulation.failure.code` | string (`ACCESS_RESTRICTED`, `CAP_EXCEEDED`, `EXECUTION_REVERTED`, `FUNDS_RETAINED`, `INSUFFICIENT_ALLOWANCE`, `INSUFFICIENT_BALANCE`, `INSUFFICIENT_LIQUIDITY`, `NONCE_ALREADY_USED`, `POSITION_UNHEALTHY`, `SIGNATURE_EXPIRED`, `SIGNATURE_INVALID`, `SLIPPAGE_EXCEEDED`) | yes | Stable reason why the prepared action was rejected by simulation. |
| `data.simulation.failure.message` | string | yes | Human-readable explanation of the simulation failure. |
| `data.simulation.failure.call_id` | string | no | Identifier of the candidate wallet call that failed, when available. |
| `data.signatures[]` | object[] | when `status` is `signature_required` | Typed-data signatures required to continue this action. Every signature requirement ID must be unique. |
| `data.signatures[].id` | string | yes |  |
| `data.signatures[].kind` | string (`authorization`, `permit`) | yes |  |
| `data.signatures[].typed_data` | object | yes |  |
| `data.signatures[].typed_data.domain` | object | yes |  |
| `data.signatures[].typed_data.types` | object | yes |  |
| `data.signatures[].typed_data.primaryType` | string | yes |  |
| `data.signatures[].typed_data.message` | object | yes |  |
| `data.continuation` | string | when `status` is `signature_required` |  |

Example (Prepared collateral supply):

```json
{
  "data": {
    "action_id": "act_0123456789abcdef0123456789abcdef",
    "status": "prepared",
    "chain_id": 8453,
    "account": "0x545b6Cc751F0C47C202694cf835db2E3C071400A",
    "expires_at": 1791475548,
    "market": {
      "id": "0x8793cf302b8ffd655ab97bd1c695dbd967807e8367a65cb2f4edaf1380ba1bda",
      "collateral_asset": {
        "address": "0x4200000000000000000000000000000000000006"
      }
    },
    "amount": {
      "unit": "assets",
      "value": "1000000"
    },
    "resolved_funding": {
      "wrapped_asset": "0x4200000000000000000000000000000000000006",
      "max_native_assets": "0",
      "erc20_assets": "1000000",
      "native_assets": "0"
    },
    "calls": [
      {
        "id": "call_0",
        "kind": "approval",
        "to": "0x4200000000000000000000000000000000000006",
        "data": "0x095ea7b30000000000000000000000004d28d900e381ece4b351302f1abe588496793a2b00000000000000000000000000000000000000000000000000000000000f4240",
        "value": "0"
      },
      {
        "id": "call_1",
        "kind": "blue_supply_collateral",
        "to": "0x4D28D900e381eCE4B351302f1Abe588496793A2b",
        "data": "0xb1268765000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda029130000000000000000000000004200000000000000000000000000000000000006000000000000000000000000fea2d58cefcb9fcb597723c6bae66ffe4193afe400000000000000000000000046415998764c29ab2a25cbea6254146d50d226870000000000000000000000000000000000000000000000000bef55718ad6000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000002400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
…
```

Example (Prepared native-funded collateral supply):

```json
{
  "data": {
    "action_id": "act_0123456789abcdef0123456789abcdef",
    "status": "prepared",
    "chain_id": 8453,
    "account": "0x6aBB9Aeb93e9aF04c8D9FD2b84BF6ca8EDC3eAf2",
    "expires_at": 1791824588,
    "market": {
      "id": "0x8793cf302b8ffd655ab97bd1c695dbd967807e8367a65cb2f4edaf1380ba1bda",
      "collateral_asset": {
        "address": "0x4200000000000000000000000000000000000006"
      }
    },
    "amount": {
      "unit": "assets",
      "value": "1000000"
    },
    "calls": [
      {
        "id": "call_0",
        "kind": "blue_supply_collateral",
        "to": "0x4D28D900e381eCE4B351302f1Abe588496793A2b",
        "data": "0xb1268765000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda029130000000000000000000000004200000000000000000000000000000000000006000000000000000000000000fea2d58cefcb9fcb597723c6bae66ffe4193afe400000000000000000000000046415998764c29ab2a25cbea6254146d50d226870000000000000000000000000000000000000000000000000bef55718ad6000000000000000000000000000000000000000000000000000000000000000f42400000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000002400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006acd12cc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000
…
```

Example (Collateral supply simulation failed):

```json
{
  "data": {
    "action_id": "act_0123456789abcdef0123456789abcdef",
    "status": "simulation_failed",
    "chain_id": 8453,
    "account": "0x545b6Cc751F0C47C202694cf835db2E3C071400A",
    "expires_at": 1791475548,
    "market": {
      "id": "0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836",
      "collateral_asset": {
        "address": "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf"
      }
    },
    "amount": {
      "unit": "assets",
      "value": "1000000000000"
    },
    "resolved_funding": {
      "wrapped_asset": "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
      "max_native_assets": "0",
      "erc20_assets": "1000000000000",
      "native_assets": "0"
    },
    "action": "blue.supply_collateral",
    "simulation": {
      "status": "failed",
      "failure": {
        "code": "INSUFFICIENT_BALANCE",
        "message": "The account balance is insufficient.",
        "call_id": "call_1"
      }
    }
  }
}
```