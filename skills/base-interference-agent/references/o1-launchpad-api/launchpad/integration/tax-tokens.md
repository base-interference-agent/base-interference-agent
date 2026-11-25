> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Tax contract integration

> Integrate the inclusive Base, Robinhood, BSC, Monad, X Layer, Arc and Elysium tax suites, with exact units, launch parameters, reward claims and event attribution.

All seven Tax deployments use **inclusive** tax encoding, **fee-accrual** Dividend accounting and **holder-authorized** claims. Each has independent Factory, Hook, escrow, adapter and helper bindings.

| Chain | Chain ID | Tax deployment and snapshot |
| - | - | - |
| Base | `8453` | [`base-mainnet-tax-token-v2`](https://docs.o1.exchange/launchpad/reference/base-tax-suite.json) |
| Robinhood | `4663` | [`robinhood-mainnet-tax-token-v2`](https://docs.o1.exchange/launchpad/reference/robinhood-tax-suite.json) |
| BSC | `56` | [`bsc-mainnet-tax-token-v2`](https://docs.o1.exchange/launchpad/reference/bsc-tax-suite.json) |
| Monad | `143` | [`monad-mainnet-tax-token-v2`](https://docs.o1.exchange/launchpad/reference/monad-tax-suite.json) |
| X Layer | `196` | [`xlayer-mainnet-tax-token-v2`](https://docs.o1.exchange/launchpad/reference/xlayer-tax-suite.json) |
| Arc | `5042` | [`arc-mainnet-tax-token-v2`](https://docs.o1.exchange/launchpad/reference/arc-tax-suite.json) |
| Elysium | `99901` | [`elysium-mainnet-tax-token-v2`](https://docs.o1.exchange/launchpad/reference/elysium-tax-suite.json) |

Resolve existing tokens by their chain and originating factory, then use that deployment's ABI and capabilities from the [suite registry](https://docs.o1.exchange/launchpad/reference/launch-contract-suites.json). A chain ID alone does not distinguish Base B20 launches from Tax ERC-20 launches. Read current policy, quote registration, creation availability and router prerequisites before preparing a launch.

Each snapshot records contract identities, documented settings and dated onchain observations. Arc and Elysium support crypto pairs only. Arc uses `ArcTaxDividend` for shared native/ERC-20 USDC balances and fixed-token payments; see [Arc currency and claims](#arc-currency-and-claims).

## Read and prepare a launch

Read `taxPolicy()`, `configVersion()`, `launchSupply()`, `quoteConfig(quote)`, `quoteRevision(quote)`, `nativeLaunchFee()` and `launchCreationEnabled()` at one recent block. Also resolve the current adapter for an atomic buy. Tax does not expose the Standard suite's fee-component arrays or `baseFeeBps()`.

`TaxPolicy` contains:

| Group | Fields |
| - | - |
| `taxFeeBounds` | `minimumBuyTaxRate`, `maximumBuyTaxRate`, `minimumSellTaxRate`, `maximumSellTaxRate` |
| `protocolFeeConfiguration` | `protocolTaxShare`, `minimumProtocolFeeRate`, `maximumProtocolFeeRate`, `protocolFeeRecipient` |
| `antiSnipeConfiguration` | `startTotalFeeRate`, `windowSeconds` |
| Dividend floor | `minimumDividendHoldingRequirement`, in raw launched-token units |

The Tax `LaunchParams` tuple retains the identity, metadata, salt, quote, expected version and deadline fields, and adds:

| Field | Contents |
| - | - |
| `taxConfiguration` | `buyTaxRate`, `sellTaxRate`, `creatorAllocationShare`, `burnAllocationShare`, `dividendAllocationShare`, `integratorAllocationShare`, `minimumDividendHolding` |
| `creatorFeeRecipient` | Destination for future creator credits |
| `integratorFeeRecipient` | Frozen launch attribution; a positive share requires a valid nonzero recipient |
| `antiSnipeEnabled` | Creator's explicit opt-in |

Use the complete Tax ABI when encoding; Standard launch tuples are incompatible. `previewTaxConfiguration(configuration)` returns `configVersion`, `buyRates`, `sellRates`, `dividendsEnabled` and `minimumDividendHoldingRequirement`. It validates the economic configuration, not every recipient, payment or route requirement of a complete launch.

Predict the ERC-20 with `launchTokenInitCodeHash(launchParams)` and the bound token deployer's creation formula, including finalized metadata and tax inputs. Mine the required `01` suffix. Do not reuse a Standard B20 prediction or the Standard ERC-20 `launchTokenBytecodeHash` method.

`createLaunch` requires exactly the native launch fee. For native-funded `createLaunchAndBuy`, include the launch fee plus the buy input. ERC-20-funded direct integrations approve the bound adapter for the buy input and send the native launch fee separately. Simulate the complete route and payment. An atomic buy pays ordinary buy tax; only its surcharge is exempt. A failed buy rolls back the launch.

## Exact percentage units

| Value | Raw input |
| - | -: |
| 100% | `100000000` |
| 1% | `1000000` |
| 0.5% | `500000` |
| 0.000001% | `1` |

Rates and allocation shares use checked `uint32` inputs. Token amounts use their currency's base units. With 18 launched-token decimals, 10,000 tokens is `10000000000000000000000`.

Parse decimal strings exactly and reject more than six percentage decimals. Do not pass BPS into these fields. Derived rates returned by the Hook use `RATE_SCALE = 10^24`, not the input scale or token decimals. API `slippage_bps` still uses BPS and is a separate unit.

For positive total `T`, protocol share `s`, floor `m`, ceiling `M`, allocation shares `wC/wB/wD/wI`, and `D = 100000000`:

```text theme={null}
P2 = min(max(T * s, m * D), M * D)
R2 = T * D - P2
protocolRate = P2 * D
creatorRate = R2 * wC
burnRate = R2 * wB
dividendRate = R2 * wD
integratorRate = R2 * wI
```

Widen before multiplication. Keep this intermediate precision rather than rounding protocol to an input step first. The quote rate is protocol, creator, dividend and integrator rates plus any surcharge; burn is a separate launched-token rate. Use full-precision integer math with the contract's rounding when reproducing amounts. Do not add quote-token and launched-token raw amounts.

### Zero and boundary rules

* The current 1% minimum rejects zero. A future policy can permit exactly zero on either or both sides; zero returns zero ordinary fees before the protocol clamp.
* Every positive total must cover the protocol floor. With a 0.5% floor, 0.3% rejects; a permitted 0% to 10% range admits zero or 0.5% through 10%.
* Each allocation may be zero. If either side has a remainder, the four shares must sum to 100%.
* If neither side has a remainder, all four shares and the selected minimum holding must be zero, and no Dividend clone is created.
* With dividends enabled, the selected minimum must meet the current factory floor and not exceed supply. With dividends disabled, use zero for the selected minimum.
* A zero protocol share still applies a positive floor. A zero protocol maximum requires a zero minimum and means zero protocol, not an unlimited maximum.
* Duration zero is valid factory configuration; creator opt-out works and opt-in rejects. For positive duration, opening must cover the permitted maximum taxes on both sides.
* The configured ordinary 10% maximum is not an immutable cap. The fixed combined ceiling is 99%. Zero ordinary taxes do not independently disable an enabled surcharge or the separate launch fee.

The owner uses `setTaxPolicy`, or the focused `setTaxFeeBounds`, `setProtocolFeeConfiguration`, `setAntiSnipeConfiguration` and `setMinimumDividendHoldingRequirement`. All validate the proposed complete state. Coordinated changes can be applied atomically; identical valid policy settings emit no update and do not advance the version. Launches still enforce their actual `expectedConfigVersion` onchain.

Ordinary payout validation excludes this suite's known non-paying dependencies, including the current adapter and its router/swap caller. An unset adapter skips those endpoint checks and still permits a plain launch; an initial buy requires a configured adapter. Compatible smart wallets and splitters remain supported. Validate through the complete preview/simulation path; adapter changes do not reroute historical credits.

## Trading and routing

Use the exact registered pool key and `poolConfig(poolId)` for its frozen configuration. `effectiveFeeRates(poolId, isBuy)` returns `(Rates rate, bool exactOutputRestricted)`. The `Rates` tuple contains `quoteRate`, `burnRate`, `protocolRate`, `creatorRate`, `dividendRate`, `integratorRate`, `surchargeRate`, including the current timestamp-based surcharge. Check the returned restriction flag as well as the amounts; a rounded-zero surcharge can still restrict exact-output swaps.

The Hook supports these four settlement cases. `F = 10^24`, `q` is the derived quote rate, `b` the burn rate, `G` gross specified input and `N` requested net output. Pool amounts are raw deltas before the final Hook fee adjustment.

| Case | Fee on specified amount | Fee on the other leg |
| - | - | - |
| Buy, exact quote input | `floor(G*q/F)` quote | `floor(poolTokenOutput*b/(F-q))` tokens |
| Sell, exact token input | `floor(G*b/F)` tokens | `floor(poolQuoteOutput*q/(F-b))` quote |
| Buy, exact token output | `ceil(N*b/(F-q-b))` tokens | `ceil(poolQuoteInput*q/(F-q))` quote |
| Sell, exact quote output | `ceil(N*q/(F-q-b))` quote | `ceil(poolTokenInput*b/(F-b))` tokens |

These formulas do not override signed settlement limits, full-fill requirements, slippage or router capabilities. Tiny amounts may round to zero or be unexecutable. The Public API exposes exact-input only. Exact-output is restricted during an applicable anti-sniping window, including its rounded-zero tail; no surcharge restriction applies when opening equals the side's ordinary rate.

Each Base, Robinhood, BSC, Monad, X Layer, Arc and Elysium Tax deployment uses its own bound launch-buy adapter and reuses its chain's configured SwapX router. Robinhood uses ETH and its own wrapped ETH address, `0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73`; never substitute Base WETH. BSC uses native BNB and WBNB `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`; Binance-Peg USDC uses 18 decimals. The BSC launch-buy adapter accepts the shared eight-field route input and translates it into the router's ten-field descriptors; do not send the external router tuple as adapter input. Router Hook approval and the requested route must both be valid. Do not reuse the Standard adapter: its immutable Factory and Hook bindings differ. Successful execution with a specific route does not prove that every aggregator supports custom Hooks, every stock quote or every funding path.

Simulate the requested route and surface failure without a silent fallback; see [SwapX routers](https://docs.o1.exchange/launchpad/reference/production-contracts.md#swapx-router-upgrade-review).

Monad uses WMON `0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A` and the router's **no-deadline interface**. WETH is a separate quote, never the native wrapper. The transaction flow still enforces its own deadlines. Updated real-router fork tests cover MON, MON-funded USDC and MON-funded WETH in clean and one-wei pre-existing-native states. Wrapped xStock pairs route MON to USDC through Uniswap v3 or PancakeSwap v3, then USDC to the wrapper through hook-free Uniswap v4 USDC/wrapper pools; apply the wrapper's `convertToAssets` rate once for USD values.

X Layer uses WOKB `0xe538905cf8410324e03A5A23C1c177a474D59b2b`; xETH is a separate quote. Its adapter uses the eight-field deadline interface, allows explicit wrapped-native input, caps external pool fees at 10,000 and disables external V4. The upgraded router approves both minimal-v4 and Tax Hooks, and the updated application resolves the originating suite through an explicit allowlist. Unknown Hooks reject. Do not reuse the Standard adapter or silently select another router.

Elysium uses WHYPE `0xbA876237B0F021A6c6D852d6c26E107997cC5E81`; USDC is a separate six-decimal quote. Its `ElysiumSwapXLaunchBuyAdapter` is bound to the Elysium SwapX router proxy `0x37DfD6117fcf065eda0B55D8547A78F8B2221987`, uses the eight-field deadline interface, allows explicit wrapped-native input, caps external pool fees at 10,000, disables external V4 and reports `nativeV3InputSupported() == true`. A USDC-paired launch takes a USDC-funded Dev Buy only, because Elysium has no HYPE/USDC Uniswap v3 pool. That router proxy is a default Dividend exclusion. The fixed Dividend claim helper is `0x0262213FDb91102958fF1109F1c6DE46a0F890A6`. Do not reuse the Standard adapter.

Ordinary ERC-20 transfers are untaxed. Unrelated pools without this Hook do not pay its fees. The Hook-data comment retains its existing offset after the 20-byte address slot. Inclusive Tax ignores that slot financially and emits a zero financial referrer; integrator attribution comes from launch configuration, never the swap caller's referral field.

## Dividends and batching

Resolve the token's clone with `dividendOf(token)` and verify its token, factory, Hook, FeeEscrow, PoolManager and fixed helper bindings. A zero clone address means dividends are disabled.

### Reward assignment

The Hook credits the clone's quote-currency escrow entry and calls `notifyDividendFee(amount)` during fee accounting. That notification assigns rewards to the shares recorded at that exact checkpoint. Claiming does not perform another allocation.

Newly delivered buy tokens normally participate from subsequent fees; an existing eligible balance may earn from that buy. Seller participation depends on whether input tokens were transferred before or after the Hook's checkpoint. Use the actual route and callback order, not a universal pre-trade or post-trade snapshot assumption.

Transfers settle previously earned rewards before changing the holder's shares. A new balance cannot collect earlier trading rewards. Small amounts use the contract's magnified integer accounting and conservative rounding; rounding residue is not reassigned to later buyers or protocol merely because individual claims round to zero.

If `totalShares()` is zero, the Hook credits that trade's dividend portion directly to the launch's frozen protocol recipient and emits `DividendTaxRedirected`. There is no holder allocation or second ledger in this case. The recipient claims it through ordinary Fees, together with its other credits for that currency. The ordinary protocol clamp does not cap this separately attributed dividend portion.

### Individual and Claim all withdrawals

* Outside Arc, `withdrawDividends()` claims for the caller and unwraps whenever `rewardToken` is the wrapped-native token, including a WETH-paired launch on a chain where WETH is that wrapper. Monad WETH is not WMON and is not unwrapped to MON. Arc always transfers the fixed ERC-20 reward token; see [Arc currency and claims](#arc-currency-and-claims).
* `withdrawDividendsFor(holder, unwrapWrappedNative)` permits only that holder or the exact fixed helper. Authorization runs even when no amount is payable.
* Excluded holders and zero entitlements return false without payment. A payout failure reverts the claim.

To keep WETH as WETH, call `withdrawDividendsFor(yourWallet, false)`. The app preserves ERC-20 quote rewards and selects native payment for ETH, BNB, MON or OKB pairs; the no-argument contract function does not infer that UI preference.

For cross-token Claim all, use `TaxDividendClaimHelper.claimDividends(Claim[])`. Each claim contains `token` and `unwrapWrappedNative`. The helper derives the holder from `msg.sender`, validates the full batch against its registry and clone bindings, rejects duplicates and permits 1 to 64 unique tokens. It returns `(paidCount, bool[] paid)`.

One failed withdrawal reverts every payment and funding operation in that helper transaction. A zero-payment entry can succeed without increasing paidCount. Earlier independent transactions are unaffected. Use confirmed `DividendPaid` events for payment amounts; the helper's count is a summary, not an amount or a promise that simulation results remain current.

Smart wallets must execute as the wallet entitled to the rewards. Recorded receivers remain authoritative. The helper holds no rewards, cannot select arbitrary holders and cannot execute arbitrary calldata. Claims require no token approval, Permit2 or extra signature authorization. Generic Multicall3 is not a trusted claim helper.

### Automatic claim funding

If the clone already holds enough backing, it pays from that balance. Otherwise, it redeems its **entire** outstanding quote-currency entry through unchanged `FeeEscrow.claimFor`, pays only the claimant's earned amount and retains the rest for other holders. Funding moves previously reserved fees; it neither assigns new rewards nor removes the locked liquidity position.

| Read | Meaning |
| - | - |
| `withdrawableDividendOf(holder)` | Recorded unpaid earnings; exclusion or a failed payment can prevent withdrawal |
| `accumulativeDividendOf(holder)` | Unpaid earnings plus rewards already paid |
| `pendingDividendFunding()` | Outstanding escrow backing, not rewards waiting for distribution |
| `availableRewardBacking()` | Held reward assets plus outstanding escrow backing; native quotes also count held native currency |
| `requiredRewardBacking()` | Assigned minus paid, including rounding residue |
| `rewardBackingDeficit()` | Shortfall between required and available accounting backing |

Simulate the exact claim. An aggregate deficit does not necessarily block a smaller claim, and zero deficit does not guarantee successful receiver, token or wrapper transfers. Exceptionally large full-entry escrow redemptions retain the signed settlement limit; partial redemption is not supported.

### Reward contributions and backing

Anyone may call `depositDividends(amount)` to contribute new rewards to holders eligible at execution. It measures the actual received amount, then allocates it. A zero amount or no eligible shares returns false without taking funds. Temporary holdings can participate in a voluntary contribution; there is no holding-duration requirement.

`replenishBacking(amount)` restores assets without assigning new entitlements. It works even with zero current shares; excess replenishment does not create a refund right. A plain donation also does not create new rewards. Use replenishment, rather than a new dividend deposit, to replace backing removed through recovery.

Both contribution functions pull the clone's fixed ERC-20 `rewardToken` and require an allowance to the clone. Native-quote contributions outside Arc therefore use wrapped native, not transaction value. Arc uses the six-decimal ERC-20 USDC interface or the fixed cirBTC reward token. Other token transfers do not become rewards for that quote. These contribution allowances are unrelated to approval-free claims.

### Exclusions and administrative controls

Mandatory exclusions are zero, the dead address, the token, its Dividend clone, factory, Hook, FeeEscrow, PoolManager and fixed claim helper. Additional defaults are copied only into future clones. For an existing launch, the factory owner or creator administrator uses `setLaunchDividendExclusions(token, accounts, excluded)`; mandatory exclusions cannot be removed. Default and per-call address batches are bounded to 64.

Verify V2 pair addresses through a trusted factory's `getPair`, V3 through `getPool` for each relevant pair and fee tier, and shared custody through authoritative manager or vault identities. Excluding a factory or router does not exclude its pools. Alternative paired assets need their own checks. Do not trust pool-like getters alone or exclude all contract wallets. The [chain-specific settings](https://docs.o1.exchange/launchpad/reference/live-configuration.md#tax-release-overview) and snapshots above list each deployment's additional custody exclusions. Do not copy exclusions between chains.

Unknown pools may still earn until excluded; claim authorization does not remove their shares. Exclusion preserves previous earnings but blocks claims while excluded. Re-inclusion uses the current balance and resumes future eligibility without backfilling excluded periods.

The other owner/creator-admin operations are `refreshLaunchDividendShares`, `setLaunchDividendReceiver`, `emergencyWithdrawDividendAssets`, `adminSetCreatorFeeRecipient` and `adminReassignCreatorRights`. Receiver changes do not authorize strangers to claim. Recovery may remove unpaid backing without erasing liabilities; these are explicit trusted administrative powers.

## Burn redemption

Read `FeeEscrow.owed(0x000000000000000000000000000000000000dEaD, token)` and optionally call `claimFor` for that same pair. Anyone may call; payment goes to the dead address. The entire recipient/currency ledger entry is redeemed, and other recipients remain untouched. It does not reduce `totalSupply`.

The Hook mints ERC-6909 claims and credits escrow during swaps; it does not physically transfer burn tokens during settlement. A separate failed redemption preserves the completed swap and credit. An uncaught redemption failure composed into the same transaction reverts the whole transaction. Ordinary FeeEscrow `claimFor` remains permissionless, and `claimTo` remains caller-owned.

## Events and accounting

| Event source | Events and use |
| - | - |
| Factory | `Launched` establishes identity; `LaunchTaxConfigured` records the admitted policy, tax inputs, integrator and creator anti-sniping choice; `TaxPolicyUpdated` affects later launches |
| Hook | `ProtocolFeeCredited`, `AntiSnipeFeeCredited`, `CreatorTaxCredited`, `DividendTaxCredited`, `IntegratorTaxCredited` attribute quote credits; `DividendTaxRedirected` identifies the zero-eligible-holder portion credited to protocol; `BurnTaxCredited` attributes launched-token credits |
| Hook | `IntegratorAttributed`, `PoolRegistered`, `CreatorRightsUpdated`, `Seeded` and `Trade` provide pool and trading context |
| Escrow | `Credited` and `Claimed` are aggregate accounting and actual redemption; they are not additional tax charges |
| Dividend | `DividendFeeAccrued`, `DividendsAllocated`, `DividendPaid`, `VoluntaryDividendDeposited`, share/debt/pending-balance changes, exclusions, receiver changes and recovery/replenishment events |
| Helper | `DividendsClaimed(holder, requestedCount, paidCount)` reports the completed group's payment count |

`DividendsAllocated` records automatic reward assignment from trading fees or voluntary contributions; it does not require a separate distribution action.

Match `DividendTaxRedirected` to its pool, quote currency, frozen recipient and corresponding escrow credit within the same swap interval. Count the dividend portion once, either to the clone or to protocol, including when recipients overlap. Protocol redemptions aggregate categories and cannot prove which source was withdrawn first.

Do not count a specialized credit and the corresponding generic escrow credit as two fees. Do not count escrow funding of a Dividend clone as payment to a holder. Burn allocation and dead-address delivery are different records. Zero credits emit no credit event; a successful swap still emits its Trade event.

Index by `(chainId, transactionHash, logIndex)`, retain originating suite and clone bindings, and handle replay/reorgs without duplicating balances. Pair Trade with PoolManager deltas and transaction context for direction and trader identity; `Trade.executor` is not necessarily the user. Do not add raw burn tokens to quote-denominated fee totals. Trading eligibility follows the Hook's actual checkpoint; voluntary contributions and unknown-pool participation have the [boundaries described above](#reward-contributions-and-backing).

## API and compatibility

Use [`GET /config?chain_id=8453&launch_product=tax&active_only=false`](https://docs.o1.exchange/launchpad/api/read-endpoints#tax-configuration-and-dividend-discovery), substituting the chain ID from the deployment table above. Require the matching suite and an available quote in the response before preparing a launch. Monad and Arc use `market=standard` only. New launch requests set `launch_product: "tax"` and `tax.format: "inclusive"`; see [the exact example](https://docs.o1.exchange/launchpad/api/launches.md#tax-token-launches). The API supports optional [atomic Dev Buy](https://docs.o1.exchange/launchpad/api/launches.md#atomic-dev-buy) using native currency or admitted paired-token funding, with approvals and full-transaction simulation.

The API's dividend prepare endpoint returns **independent transaction steps**, not the UI helper's atomic cross-token batch. Use `operation: "claim"` for fee-accrual tokens. Distribution is not a separate current-suite action. See [Dividend API actions](https://docs.o1.exchange/launchpad/api/claims-and-creator-actions.md#dividend-actions).

The registry's `contractVersion: "tax-token-v1"` is an internal ABI-family identifier, not the deployment version. The deployment IDs are `base-mainnet-tax-token-v2`, `robinhood-mainnet-tax-token-v2`, `bsc-mainnet-tax-token-v2`, `monad-mainnet-tax-token-v2`, `xlayer-mainnet-tax-token-v2`, `arc-mainnet-tax-token-v2` and `elysium-mainnet-tax-token-v2`, with `taxAbi: "inclusive"` and `dividendAccounting: "fee-accrual"`. Use all these fields and the exact contract addresses when selecting interfaces.

The historical registry retains earlier identities for event recognition and direct recovery. Index-only deployments are not public launch or transaction-preparation targets. Never route their tokens to the current contracts. Decode each deployment with its own ABI and accounting capability; shared version-family names do not make Dividend behavior interchangeable.

## Arc currency and claims

Arc Tax has only nonzero ERC-20 quote addresses: USDC (`0x3600000000000000000000000000000000000000`, six decimals) and cirBTC (`0x171a4217b86a807a64eb94757db6849fb4bdbaa0`, eight decimals). Native USDC has 18 decimals and shares the ERC-20 USDC balance; it is not another asset or a wrapped token.

* The **2-USDC launch fee** uses `2000000000000000000` native units. Native Dev Buy amounts must convert exactly by `1e12` into ERC-20 units; the adapter rejects unrepresentable inputs and partial spend.
* `ArcTaxDividend` overrides currency admission/payment only. Both `withdrawDividendsFor` unwrap preferences and helper preferences transfer the fixed ERC-20 reward token. USDC claim amounts and payment events use six decimals; cirBTC uses eight. Never call WETH-style `deposit` or `withdraw` on Arc USDC.
* Backing counts the ERC-20 balance once. `depositDividends` and `replenishBacking` require an allowance for the fixed ERC-20 reward currency, while claims need no approval. Native USDC donations/recovery affect the same backing; native recovery amounts use 18 decimals. Donations do not assign new rewards.
* Shared holder authorization, recorded receivers, atomic helper failure, trade-time accrual and zero-eligible-holder protocol credits remain unchanged. A blocked receiver/token transfer can still revert a payout; simulate the exact claim.

The registered launch PoolManager is mandatory-excluded. The additional Infinity-style Vault default is `0x238a358808379702088667322f80aC48bAd5e6c4`, confirmed at block 23,158,561. It is verified pooled custody, not an assertion of official Pancake Arc deployment. Defaults affect future clones only. Unknown pools and the accepted administrative recovery risks remain.

Source publication is recorded through Sourcify. The Arc API returns unsigned claim steps and supports exact-input trading through its configured routes. Discover supported payment and receipt assets in `/config`; keep native-USDC transaction units separate from ERC-20 amounts.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.