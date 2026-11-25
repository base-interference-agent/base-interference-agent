> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# $O launch integration

> Integrate Base and Robinhood $O launches, atomic Dev Buy, immediate quote burns and complete trade receipts.

Resolve each suite by chain ID and its originating Factory. Both use **`wsto-burn-v1`** interfaces and ordinary **ERC-20** launched tokens.

| Chain | Chain ID | Suite | Configuration |
| - | - | - | - |
| Base | `8453` | `base-mainnet-wsto-burn-v1` | [Snapshot](https://docs.o1.exchange/launchpad/reference/base-wsto-suite.json) |
| Robinhood | `4663` | `robinhood-mainnet-wsto-burn-v1` | [Snapshot](https://docs.o1.exchange/launchpad/reference/robinhood-wsto-suite.json) |

Use the suite's ERC-20 launch interface, not the Standard B20 or Tax launch tuple.

See the [Base](https://docs.o1.exchange/launchpad/reference/production-contracts.md#base-wsto-contracts) and [Robinhood](https://docs.o1.exchange/launchpad/reference/production-contracts.md#robinhood-wsto-contracts) deployed addresses and [user guide](https://docs.o1.exchange/launchpad/wsto/overview.md). Keep the suite, quote and router identities bound to the prepared transaction, and simulate the complete route at the requested amount.

The [XORS burn-suite audit](https://docs.o1.exchange/launchpad/security.md#wsto-burn-suite-audit) covers the reviewed core suite and original direct-wstO adapter specialization. Its scope does not include the Base or Robinhood ETH-funded adapters, shared routers or application. Match audit coverage to the exact implementation used by your integration.

## Read before preparing

Read these at a consistent recent block:

| Contract | Required reads |
| - | - |
| Factory | `configVersion()`, `launchCreationEnabled()`, `launchSupply()`, `tickSpacing()`, `bandTemplate()`, `defaultBurnRates()` |
| Quote registry | `quoteConfig(quoteToken)`, `quoteRevision(quoteToken)` |
| Bindings | Factory `hook()`, `poolManager()`, `tokenDeployer()`, `announcementRegistry()`, `settlementReserve()`, `launchBuyAdapter()`; Hook `factory()`, `poolManager()`, `launchBuyAdapter()` |
| Existing pool | Hook `poolConfig(poolId)`, plus the exact Uniswap pool key |
| Reserve | `quoteReserveBalance(quoteToken)` and physical quote balance at PoolManager; neither replaces complete transaction simulation |

`defaultBurnRates()` returns `buyBurnRate` and `sellBurnRate`. These apply to new pools. `poolConfig(poolId)` returns `initialized`, `tokenIsCurrency0` and the pool's frozen `burnRates`. It is the authoritative burn configuration for an existing pool.

There is no `nativeLaunchFee()`, FeeEscrow, fee-component list, Tax allocation graph or Dividend contract in this suite. Do not call those interfaces on this Factory.

## Launch parameters and payment

The `LaunchParams` fields for \$O launches, in ABI order, are:

```text theme={null}
string tokenName
string tokenSymbol
string tokenContractURI
bytes32 creatorSalt
address quoteToken
uint64 expectedConfigVersion
uint64 deadline
bool metadataEditable
string[] metadataKeys
string[] metadataValues
```

Use `createLaunch(LaunchParams)` for plain creation with **zero value**. Finalize metadata before predicting the address with `launchTokenBytecodeHash(LaunchParams)` and the bound token deployer's prediction. The creator-scoped salt must be unused, and the token address must end in `01`.

`createLaunchAndBuy(LaunchParams, LaunchBuyParams)` creates the pool and performs one exact-input creator buy. `LaunchBuyParams` contains `fundingToken`, `amountIn`, `minAmountOut` and `routeData`. Set a positive meaningful minimum from a simulation of the **complete create-and-buy transaction**, then simulate the final calldata again. A quote against an existing pool alone cannot validate atomic creation.

| Funding | `fundingToken` | Factory transaction value | Approval |
| - | - | - | - |
| Native ETH | Zero address | Exactly `amountIn` in wei | None |
| Held wstO | wstO address | Zero | Creator approves the currently attached adapter for wstO |

The adapter admits native ETH through the exact acquisition/vault path and a direct held-quote purchase. It does not admit \$O-, USDC- or USDG-funded Dev Buy. Those assets' token-page settlement support is a separate capability. A replacement adapter does not inherit approvals granted to its predecessor.

Both Factory and Hook must point to the selected adapter. The Factory initiates execution through the Hook; only the configured Hook may call the adapter. The Hook's one-use context binds the exact new pool and expected swap caller. The purchased tokens go to the creator. This is not a buy-fee exemption.

An expired deadline, changed protected configuration, used salt, incomplete route spend, invalid binding or insufficient final output reverts the complete creation and purchase. Quote opening-frame revisions are separate from `configVersion`: execution deliberately uses the latest registered starting tick. An atomic buy's final minimum protects output, not a fixed USD launch valuation.

## Rate units and swap accounting

Burn-rate scale **D = 100,000,000**. One percent is **1,000,000**; the permitted range is **0 through 99,000,000**. Inputs have six decimal places of percentage precision, not BPS. Token amounts use the currency's own raw units; wstO has 18 decimals.

The Hook supports all four swap modes, subject to full fills, meaningful positive output and signed amount bounds:

| Mode | Quote burn calculation |
| - | - |
| Exact-input buy | `floor(grossQuoteInput * buyRate / D)`; remaining input reaches the pool |
| Exact-input sell | `floor(poolQuoteOutput * sellRate / D)`; remaining output goes to the seller |
| Exact-output buy | `ceil(poolQuoteInput * buyRate / (D - buyRate))`, added to the pool's quote input |
| Exact-output sell | `ceil(requestedNetQuoteOutput * sellRate / (D - sellRate))`; the pool must supply net output plus this fee |

Use integer math with the documented rounding. Exact-output dust can round a positive fee up to one raw unit. Zero or rounded-zero fees skip `take` and `burn(0)` but still emit `Trade`. Amounts and grossed-up values must fit the Hook's positive `int128` magnitude limit; a valid percentage alone does not guarantee an executable amount.

`beforeSwap` adjusts specified-side accounting when necessary. `afterSwap` checks full execution, takes the actual fee from PoolManager into the Hook and calls the quote's **`burn(uint256)`**. It verifies exact Hook and Manager balance changes and exact `totalSupply` reduction, preserving pre-existing Hook donations. Hook return deltas account for the fee. There is no redemption into \$O, dead-address transfer, keeper or delayed burn.

Core exact-output support does not mean every router supports it. The website uses exact-input trades. Use actual core deltas, including any upstream protocol charge, rather than adding that charge twice.

### Hook data

Final launch-pool `hookData` must be **empty or exactly 32 bytes** containing a UTF-8 comment padded with trailing zeroes. Reject comments over 32 bytes. There is no referral-address prefix or financial referral allocation. Do not reuse the two-word comment encoding from Standard or Tax routes; its 64-byte payload will revert.

Vault-operation descriptor data is separate. Never place its minimum/deadline tuple in the final Hook comment field.

## Settlement reserve

Uniswap's `afterSwap` callback runs before a conventional router pays its input debt. The reserve provides physical quote tokens inside PoolManager so the Hook can perform an immediate burn during that callback. It permits ordinary swap-first, settle-later routing; it does not make arbitrary routers or unfunded quoters compatible.

`WstOSettlementReserve` accounts for its **own ERC-6909 claims** in PoolManager. `quoteReserveBalance(quoteToken)` reads that claim balance, not the pool's LP balance or an accumulated burn total. Physical assets stay in PoolManager's shared custody. Swaps do not spend down the reserve's claims as fee revenue; the trader pays the burn through settlement.

Only the current **Factory owner** may call `depositQuoteReserve(quoteToken, amount)` or `withdrawQuoteReserve(quoteToken, amount, recipient)`. Withdrawals redeem only this reserve's claims and require available physical assets. `recoverReserveAsset` handles direct donations to the reserve, not launch liquidity. The owner may withdraw the whole reserve claim balance; there is no enforced minimum buffer.

Insufficient physical wstO at the moment of a positive burn causes the transaction to revert atomically. This is especially relevant to the first buy or large buys before input payment. Quote registration and enabled creation do not prove sufficient inventory. More reserve funding can address that constraint, but does not increase the separate acquisition pool's liquidity. Never derive guaranteed route capacity from the claim balance alone.

## Vault and router integration

The reviewed Base acquisition route uses the attached **`WstOUsdcMetadexNativeLaunchBuyAdapter`** [`0xB504A15dF9A870BeBBA81825f2B7c6e17ECBDB73`](https://basescan.org/address/0xB504A15dF9A870BeBBA81825f2B7c6e17ECBDB73) and existing SwapX proxy, on the Aero MetaDEX WETH/USDC pool [`0x4A7af46bC8aBc00048c6c7920a1488DAF568366c`](https://basescan.org/address/0x4A7af46bC8aBc00048c6c7920a1488DAF568366c) and \$O/USDC pool [`0x1FB0642cFA71994B7572a104d99CfeC6B58615E4`](https://basescan.org/address/0x1FB0642cFA71994B7572a104d99CfeC6B58615E4):

```text theme={null}
ETH → WETH/USDC pool → $O/USDC pool → wstO deposit → launch pool
```

The adapter verifies the permitted pools and their factory/currencies/spacing, exact vault/underlying, connected four-operation route, deadline, final launch pool and protected output. Unspent intermediate assets or unexpected changes to adapter/router balances reject the entire Dev Buy. Do not silently reuse the older \$O/WETH adapter or arbitrary pool descriptors.

The Robinhood route uses **`WstORobinhoodV4LaunchBuyAdapter`** and its chain's SwapX proxy:

```text theme={null}
ETH → WETH/USDG v3 → USDG/$O v4 → wstO deposit → launch pool
```

The [Robinhood snapshot](https://docs.o1.exchange/launchpad/reference/robinhood-wsto-suite.json) lists the acquisition pools. Keep their settings separate from the final launch pool:

| Operation | Pool settings |
| - | - |
| WETH/USDG v3 | Fee `100`, exact pool and factory from the snapshot |
| \$O/USDG v4 | Currency0 \$O, currency1 USDG, fee `100`, spacing `1`, zero Hook, empty Hook data |
| Final wstO/launch-token pool | Fee `0`, spacing `200`, suite Hook and permitted comment |

The external v4 pool ID is not a contract address: its SwapX descriptor uses zero `poolAddress` and the complete pool key. For native Robinhood funding, the first descriptor names WETH while the Factory receives native ETH value. SwapX handles wrapping and native delivery. USDG has six decimals; ETH, WETH, \$O and wstO have 18.

Both adapters enforce full input consumption and final output protection. Token-page trades use the router directly; Dev Buy uses the adapter attached to the Factory and Hook.

The deployed vaults have custom selectors:

```solidity theme={null}
deposit(uint256 assets, address receiver, uint256 minimumShares, uint256 deadline)
redeem(uint256 shares, address receiver, address owner, uint256 minimumAssets, uint256 deadline)
previewDeposit(uint256 assets)
previewRedeem(uint256 shares)
asset()
totalAssets()
totalSupply()
burn(uint256 shares)
```

Do not encode generic ERC-4626 deposit/redeem selectors. `burn` destroys the caller's own shares without returning underlying assets. Fee burning does not require arbitrary-holder burn permission. Quote admission also requires standard untaxed transfers; balance and supply checks are not a substitute for reviewing the vault's governance and implementation.

Token-page routes may start or end with ETH, USDC on Base or USDG on Robinhood, \$O or wstO. Quotes must simulate the real vault operation and Hook burn with a funded caller. Sells redeem after the burn, using the changed share conversion. Enforce final minimum output in the **user's selected receipt asset**. A reference USD price, standalone pool quote or one successful small trade does not prove executable larger-route liquidity.

## Events and attribution

| Event | Interpretation |
| - | - |
| Factory `Launched` | New token, pool, original creator, quote, supply and spacing |
| Factory `LaunchBuyExecuted` | Creator, funding currency/input, final token output and actual adapter |
| Hook `PoolRegistered` | Pool/token/quote identity and frozen buy/sell burn rates |
| Hook `Seeded` | Launch tokens added to permanent liquidity |
| Hook `Trade` | Pool, executor, direction, quote, gross quote amount, launch-token amount, burn amount and comment |
| Hook `QuoteBurned` | A positive actual quote-supply burn succeeded |
| Reserve deposit/withdrawal events | Reserve custody movements, not trading revenue or burns |

Read the **whole receipt** before classifying logs. `PoolRegistered` and `Seeded` precede the Factory's `Launched` event; the optional Dev Buy's burn/trade and `LaunchBuyExecuted` follow it in the same transaction. Resolve exactly one matching factory launch for each registration by its factory, token and pool; do not depend on a launch record already existing from an earlier log.

`Trade.executor` is a router/callback identity, not automatically the wallet. Use the Factory's creator attribution for its atomic Dev Buy and verified router/receipt context for ordinary trades. Intermediate ETH/USDC/USDG/\$O movements are not extra launch-pool volume. Robinhood's external v4 acquisition emits PoolManager swap logs in the same receipt; attribute launch trading only to the exact launch pool ID and Hook. `LaunchBuyExecuted.amountIn` uses its funding currency; `Trade.grossQuoteAmount` uses wstO.

For per-pool burn totals, match `QuoteBurned` to the successful trade and count it once. Do not add `Trade.burnAmount` and `QuoteBurned.burnAmount` together. Retain zero-burn trades, deduplicate by chain/transaction/log identity and handle reorgs. `totalSupply()` is global wstO supply, not a read of one pool's historical fee burns; deposits and redemptions also change it.

## Public API

Select `launch_product=wsto` on Base or Robinhood configuration queries and `launch_product: "wsto"` in launch requests. Use `market: "standard"` and the wstO address as `quote_address`; do not send a `tax` object. The API prepares the matching ERC-20 launch tuple and checks the live burn settings.

Optional `dev_buy` supports native ETH or held wstO. Set `funding_token` explicitly to the zero address for ETH or the wstO address for held shares. For compatibility, omitting it on an \$O launch means **held wstO**, while Standard and Tax default to native funding. Native ETH uses transaction value and needs no input-token approval. Held wstO requires allowance to the attached adapter and may require approval followed by a second preparation.

For existing tokens, `settlement_token` selects ETH, USDC on Base or USDG on Robinhood, \$O or wstO for exact-input buys and sells. Omitting it selects the pool's wstO quote. Never substitute raw ETH amounts for wstO amounts or alter API-provided route calldata. The API does not expose the Hook's exact-output modes.

See [launch preparation](https://docs.o1.exchange/launchpad/api/launches.md#o-launches), [Dev Buy approvals](https://docs.o1.exchange/launchpad/api/launches.md#atomic-dev-buy), [trading](https://docs.o1.exchange/launchpad/api/trading.md#o-launch-trades) and [configuration discovery](https://docs.o1.exchange/launchpad/api/read-endpoints.md#dev-buy-and-settlement-assets) for request examples and runtime checks.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.