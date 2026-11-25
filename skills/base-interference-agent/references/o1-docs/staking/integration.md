> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Integrate wstO

> Call the wstO vault directly: functions, approvals, permit, quoting, receivers, errors, and events.

This page is for wallets, protocols, and apps that call the wstO vault directly. Addresses are listed on [Contracts](https://docs.o1.exchange/staking/contracts.md).

> [!WARNING]
>
> **wstO is not ERC-4626.** It has no `mint`, `withdraw`, or `max*` functions, and `deposit` and `redeem` take extra slippage and deadline arguments. Do not use a generic ERC-4626 adapter.

## Functions

All amounts are in base units, and deadlines are Unix timestamps in seconds.

```solidity theme={null}
// State-changing (besides standard ERC-20 and EIP-2612 permit)
function deposit(uint256 assets, address receiver, uint256 minShares, uint256 deadline) returns (uint256 shares);
function redeem(uint256 shares, address receiver, address owner, uint256 minAssets, uint256 deadline) returns (uint256 assets);
function burn(uint256 shares);

// Read-only
function previewDeposit(uint256 assets) view returns (uint256);
function previewRedeem(uint256 shares) view returns (uint256);
function convertToShares(uint256 assets) view returns (uint256);
function convertToAssets(uint256 shares) view returns (uint256);
function exchangeRate() view returns (uint256); // O per wstO, scaled by 1e18
function totalAssets() view returns (uint256);
function asset() view returns (address);
function shareSink() view returns (address);
function config() view returns (address);
function initialized() view returns (bool);
```

Previews and conversions revert instead of falling back to 1:1 when the vault holds no O or has no supply. To check whether deposits are open, call `depositsPaused()` on the Protocol Config returned by `config()`.

## Approvals

| Action | Approval |
| - | - |
| Deposit O | `O.approve(vault, amount)` first. There is no deposit with permit |
| Redeem your own wstO | None |
| Redeem another holder's wstO | A wstO allowance from the owner, through `approve` or `permit` |

Permit approves wstO only, never the underlying O. Read the EIP-712 domain with `eip712Domain()` instead of hardcoding it. On every deployed vault it is `{ name: "Wrapped Staked O", version: "1", chainId, verifyingContract: vault }`.

## Quote, then protect

1. Take `minShares` from `previewDeposit`, or `minAssets` from `previewRedeem`, less the user's slippage tolerance.
2. Quote again right before submitting. If a preview returns 0, block submission, because the call would revert.
3. Before a deposit, compare `previewRedeem(previewDeposit(assets))` with `assets`. `minShares` cannot show the O lost to rounding, and this check can.
4. Simulate the transaction and decode the custom errors below.

There are no fees. The only loss is rounding down, which stays in the vault: less than the value of one share base unit per deposit, and at most one O base unit per redemption. Because the exchange rate never decreases, a fresh `previewRedeem` result is a safe `minAssets`.

## Receivers to reject

The vault rejects `address(0)`, `0x…01`, `0x…02`, and the vault itself as the receiver of `deposit` and `redeem`. It still accepts some destinations from which nothing can ever move. Integrations must reject:

* the Permanent Share Sink as the receiver of `redeem`, because the O would leave the vault for an address that can never move it;
* the O token contract as any receiver;
* a plain wstO `transfer` to the vault address.

Send shares to the Permanent Share Sink only when the intent is to lock them permanently.

## Do not

* Do not send O directly to the vault. It mints no wstO, raises the rate for every holder, and cannot be recovered.
* Do not expose `burn` in a user interface. It destroys wstO for nothing in return.
* Do not use `exchangeRate()` as a price oracle. Donations can raise it at any time.

## Errors

| Error | Cause |
| - | - |
| `DepositsPaused()` | Deposits are paused in the Protocol Config |
| `DeadlineExpired()` | `block.timestamp` is later than `deadline` |
| `SlippageExceeded(uint256 minimum, uint256 actual)` | The result is below `minShares` or `minAssets` |
| `InvalidAddress()` | The receiver is rejected |
| `InvalidAmount()` | An amount or minimum is zero, or `owner` is the zero address |
| `NotInitialized()` | The vault is not initialized |
| `InsolventVault()` | The vault holds no O or has no wstO supply, so no rate can be computed |
| `UnexpectedAssetAmount()` | The O balance did not change by exactly the expected amount |

## Events

| Contract | Event |
| - | - |
| Vault | `Deposit(address indexed caller, address indexed receiver, uint256 assets, uint256 shares)` |
| Vault | `Redeem(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)` |
| Vault | `SharesBurned(address indexed burner, uint256 shares)` |
| Vault | `Initialized(address indexed receiver, uint256 seedAssets, uint256 donatedAssets, uint256 sinkShares)` |
| Protocol Config | `DepositsPauseChanged(bool paused, address indexed caller)` |
| Protocol Config | `GuardianUpdated(address indexed oldGuardian, address indexed newGuardian)` |

Scan history in bounded windows starting from the vault creation block on [Contracts](https://docs.o1.exchange/staking/contracts.md#vault-parameters). Public RPCs limit `eth_getLogs` ranges, for example to 500 blocks on Base and 50,000 blocks on Robinhood Chain, and are not archive nodes.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.