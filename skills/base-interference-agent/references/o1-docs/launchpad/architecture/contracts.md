> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Smart contract architecture

> How the launch factories, launch hook, fee escrow, staking contract, announcement registry, and launch tokens work together.

The Standard suites on Base, Robinhood, Monad, Arc, BSC, X Layer and Elysium use the `launchpad-v4-minimal` architecture for launch coordination, permanent liquidity, fees, creator rights, announcements, and optional atomic Dev Buy. The chain-specific token step differs: Base creates and validates a native B20 token, while Robinhood, Monad, Arc, BSC, X Layer and Elysium create a fixed-supply ERC-20 through a dedicated token deployer. Each contract has a narrow responsibility, which makes its authority and custody easier to verify.

Arc uses the same ERC-20 core with an [adapter for native and ERC-20 USDC](#arc-deployment).

> [card] Launch path
>
> The creator signs one factory transaction. It creates the token, opens the Uniswap v4 pool, and places the complete fixed supply into the permanent liquidity position.

> [card] Trading path
>
> The trader signs a swap through Uniswap. Standard and Tax recipient fees become claimable balances; the \$O launch Hook instead burns its wstO fee during the trade. The user receives the resulting trade output.

> [card] Staking path
>
> A vault creator funds an independent reward program. Participants approve and deposit wallet-held tokens, then withdraw principal and claim completed-epoch rewards under the vault's fixed rules.

## X-linked creator-fee vaults

The optional [fee-sharing flow](https://docs.o1.exchange/launchpad/trading/share-creator-fees.md) adds three companions around an admitted Standard or Tax suite. It does not replace the existing Factory, Hook, FeeEscrow or PoolManager.

| Contract | Responsibility | Authority |
| - | - | - |
| `XFeeRecipientRegistry` | Permanently maps each registered X ID to its payout account | Owner can rotate the proof verifier and disable new registration, but cannot replace an existing binding |
| `XFeeVaultFactory` | Creates a vault and launches through the selected suite atomically; records token, vault and initiator | Owner admits suites and compatible marketplaces and controls new activity |
| `XFeeVault` | Fixed implementation cloned once per launch; tracks creator and X entitlements | Each clone has fixed shares and dependencies; the current creator controls only the creator position and supported metadata/announcements |

The vault calls the underlying Factory, so that Factory records the vault as its original/current creator and fee recipient. `VaultLaunched` separately records the real initiating wallet. The purchased tokens from Dev Buy go to that initiator. Launch funding is consumed before activation; it is not creator-fee income.

The vault uses the Factory's current launch-buy adapter and retains the exact spender for allowance checks. Existing Factory configuration-version, deadline and route checks still apply. A failed launch, buy, funding check or final activation check reverts the entire transaction.

Gross income is held quote plus outstanding escrow credit plus prior payouts. Cumulative shares use full-precision integer arithmetic. Escrow redemption moves backing, not entitlement; a creator-position change checkpoints earlier income without forcing a payout to the old creator. See [functions and events](https://docs.o1.exchange/launchpad/reference/events-functions.md#x-linked-fee-vaults) and [security boundaries](https://docs.o1.exchange/launchpad/security.md#x-linked-fee-vault-boundaries).

These contracts are non-upgradeable. The shared implementation is a locked template, not a user fee account. Resolve a token's clone with `vaultOf(factory, token)` and verify its chain and suite. The [deployment reference](https://docs.o1.exchange/launchpad/reference/production-contracts.md#base-x-linked-fee-vaults) lists the three Base contracts.

## Standard contract responsibilities

| Contract | Responsibility | Custody or authority |
| - | - | - |
| Launch factory | Coordinates crypto-paired and stock-paired launches on its deployed chain | Controls future launch settings, paired assets, creator rights, and the global native launch fee on that chain |
| Base token validator | Verifies each created B20 token's supply, policy, roles, and profile-authority boundary | Stateless and called by the Base factory; holds no user funds |
| ERC-20 token deployer | Creates the fixed-supply ERC-20 for its bound launch factory | Callable only by that factory; holds no user funds |
| Launch hook | Opens approved pools, owns permanent positions, and applies swap fees | Owns and permanently locks launch liquidity positions |
| Fee escrow | `FeeEscrow` records and pays each recipient's swap-fee balance | Can pay only balances credited by the hook |
| Launch-buy adapter | Executes the optional atomic buy after the selected factory creates and seeds a launch; Arc uses `ArcSwapXLaunchBuyAdapter` for USDC funding | Each deployment is bound to its chain's factory, hook, PoolManager, and supported routing path |
| Staking contract | Stores fully funded reward programs and participant principal | Holds accounted principal and rewards; its owner controls only the fee for future vault creation |
| Announcement registry | `AnnouncementRegistry` publishes creator-authenticated announcements | Has no token authority and holds no funds |
| Robinhood / Monad / Arc / BSC / X Layer / Elysium token | `LaunchToken` is the fixed-supply ERC-20 implementation | Has no owner or administrative control |

## Factory: launch coordination

`createLaunch` coordinates the complete launch. The selected chain and product determine the factory, and the paired asset determines the market type. For Standard tokens, Base, Robinhood, BSC, Monad and X Layer each use one factory for both crypto-paired and stock-paired launches. Base, Robinhood, BSC, Monad and X Layer each have a separate Tax factory shared by crypto and stock pairs. Arc and Elysium have separate Tax factories for their registered crypto pairs.

The minimal factories also expose `createLaunchAndBuy`. It creates the token, opens and seeds the pool, then executes one protected buy through the chain's configured adapter in the same transaction. An ordinary launch continues to use `createLaunch`. Both methods require creation to be enabled.

| Stage | Factory behavior |
| - | - |
| Validate | Confirms the selected paired asset, route, current creation fee, deadline, profile-editing choice, and launch limits |
| Create token | Creates the fixed supply and verifies the expected immutable token properties |
| Configure market | Records the original creator, current creator fee recipient, frozen fee components, anti-snipe schedule, currencies, and exact pool identity with `LaunchHook` |
| Open pool | Initializes the Uniswap v4 pool at the configured opening price |
| Seed liquidity | Sends the complete fixed supply to the permanent position owned by the hook |
| Publish result | Emits the token address, creator, pool ID, quote, supply, and spacing in `Launched` |

The factory owner may update paired assets, supply, opening prices, liquidity ranges, fees, and the platform fee receiver for future launches. The announcement registry is bound once and cannot be replaced. The minimal factories provide bounded paired-asset updates, revision checks, a restricted opening-price updater, and a switch for new creation. That switch covers every new launch through the factory, regardless of paired asset. These changes cannot rewrite a completed token or pool.

## Launch-buy adapter

The browser prepares SwapX route data, while `SwapXLaunchBuyAdapter` enforces the atomic Dev Buy boundary onchain. The adapter is not a quote engine. It accepts calls only from the configured launch hook, checks that the route starts with the actual funding asset, requires connected non-cyclic hops, and requires the final hop to use the exact newly created launch pool, selected paired asset, launch token, and hook. Routes are bounded to four hops, external pools must match the venues permitted by that deployment, and the creator must receive at least `minAmountOut`. The transaction also stops if it changes any unexpected route-asset or native-currency balance held by the adapter or SwapX router.

Venue support is deployment-specific without changing the factory or UI flow. The active Base adapters (`AeroSwapXLaunchBuyAdapter`) accept configured v3 pools and the older Aerodrome Slipstream factories plus the Aero MetaDEX factory `0x9CB220581b91b0C83223012FE69688b92aD07a76`, reading each MetaDEX pool's own fee. The active Robinhood adapter can also validate constrained external v4 pools through its configured PoolManager. For these adapters, the complete launch reverts if the optional buy cannot satisfy the route and output checks; ordinary `createLaunch` remains independent.

## Managed paired-asset controls

Each Standard or Tax factory keeps its chain's native asset where supported, stablecoins, registered crypto majors and Stock Tokens in one paired-asset registry. The \$O launch Factory instead requires reviewed burn-compatible ERC-20 quotes. Every registered asset has its own availability state, decimals, opening-price frame, and revision.

| Control | Purpose |
| - | - |
| Quote registration | Adds a supported paired asset and its opening-price frame |
| Quote revision | Prevents a stale price update from overwriting a newer one |
| Price updater | May update the opening frame of an existing quote, but cannot add or remove assets or change fees |
| Creation switch | Pauses new launches through that factory; existing pools continue trading and claiming |
| Batch limit | Bounds one quote-management transaction to 64 entries |

Base Standard supports ETH, USDC, the configured Coinbase crypto assets and [Base Stock Tokens](https://docs.o1.exchange/launchpad/create/stock-paired-launches.md#base-stock-token-catalog). Robinhood supports ETH, USDG and its supported Stock Tokens. A paired asset must be registered on the selected factory, with creation enabled, before it can be used for a new launch. Each Tax factory has its own registrations; see [Live configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md) for each product's assets.

## LaunchHook: market enforcement

Each pool receives a frozen configuration when it is created. The hook then enforces the launch market throughout its lifetime.

| Responsibility | Behavior |
| - | - |
| Pool gate | Accepts initialization only for a factory-registered launch |
| Liquidity seed | Creates the token-only position and verifies that no paired asset is required |
| Permanent lock | Rejects every removal and every external liquidity addition |
| Anti-snipe | Calculates the timestamp-based opening surcharge in the paired asset |
| Fee accounting | Splits the base fee between creator, platform, and valid referrer |
| Trade record | Publishes the callback executor, referrer, fee currency, fee amount, and optional comment in the `Trade` event; direction and trader attribution come from the complete receipt |

During the opening anti-snipe period, `LaunchHook` keeps o1's input-amount buy and sell flow open while applying the temporary surcharge. It rejects exact-output requests while the surcharge window is active. New Arc Standard launches configure the opening total equal to the normal 1% base fee, so the surcharge is zero and the Hook treats the window as inactive. Existing pools retain their frozen settings; router support is separate.

The detailed callback and function surface is available in [Functions and events](https://docs.o1.exchange/launchpad/reference/events-functions.md).

## Escrow, staking, and announcements

`FeeEscrow` tracks claimable balances by recipient and currency. Ordinary recipient fees use the paired asset; Tax burn credits use launched tokens. Anyone can trigger payment to the recorded recipient, while a recipient can also redirect their own claim. Only the launch hook can add new fee credits.

The staking contract is separate from token creation. Anyone can create an immutable reward vault for a compatible B20 or ERC-20 token and fund every epoch in advance. Participants deposit wallet-held tokens in independent lots, withdraw according to the vault's fixed policy, and manually claim time-weighted rewards after each epoch. The owner may change the global fee for future vault creation but cannot change or cancel existing vaults, withdraw accounted assets, or pause participant actions. See the [staking guide](https://docs.o1.exchange/launchpad/staking/overview.md).

The announcement contract records each launch token. It resolves authorization through the active factory's current creator rights, so accepted creator-rights changes also move announcement authority. The current creator can post announcements with a unique ID, description, and URI without receiving any token administration role.

## Tax architecture

Base, Robinhood, BSC, Monad, X Layer, Arc and Elysium each have an additional Tax ERC-20 suite. Each retains direct v4 launches, locked liquidity, creator rights and the same FeeEscrow claim model, with its own immutable bindings. It replaces Standard fee components with inclusive taxes.

| Contract | Tax-suite responsibility |
| - | - |
| `TaxRWAERC20LaunchpadFactory` | Validates launch inputs, quotes and policy; coordinates creation and creator administration |
| `TaxLaunchOperations` / `TaxLaunchValidation` | Fixed linked execution and validation; no owner-selectable execution target |
| `TaxLaunchTokenDeployer` / `TaxLaunchToken` | Creates fixed-supply ERC-20s and updates Dividend shares synchronously on transfers |
| `TaxLaunchHook` | Enforces locked liquidity, frozen tax rates, settlement and currency-specific fee credits |
| `FeeEscrow` | Aggregates recipient/currency claims, including optional dead-address redemption |
| `TaxDividendDeployer` / `TaxDividend` (`ArcTaxDividend` on Arc) | Creates one clone for a dividend-enabled launch, assigns rewards when trading fees accrue and funds holder-authorized payments on demand |
| `TaxDividendClaimHelper` | One immutable helper per suite; atomically claims for its caller across verified clones |
| Launch-buy adapter | Connects this factory and Hook to the configured router for an atomic Dev Buy, with chain-specific funding and route encoding |
| `AnnouncementRegistry` | Resolves current creator authority for registered tokens |

See [Tax contract integration](https://docs.o1.exchange/launchpad/integration/tax-tokens.md) for exact units, functions, events and trust boundaries. The Standard-specific fee-component and B20 descriptions above do not apply to Tax or \$O launches.

## \$O launch architecture

\$O launches on Base and Robinhood use a separate ERC-20/managed-quote suite with immediate quote burns. The suite preserves permanent liquidity, metadata, announcements and creator rights, without FeeEscrow, dividends or Standard/Tax economic allocations.

| Contract | Responsibility |
| - | - |
| `WstOLaunchpadFactory` | Validates creation, snapshots default burn rates, manages quote registration and creator rights |
| `LaunchTokenDeployer` / `LaunchToken` | Deploys the fixed-supply ERC-20 through this suite's own bound deployer |
| `WstOLaunchHook` | Locks liquidity and burns actual quote tokens during each swap |
| `WstOSettlementReserve` | Holds its own PoolManager claims supporting physical settlement inventory; it does not own the launch LP position |
| `WstOUsdcMetadexNativeLaunchBuyAdapter` (Base) / `WstORobinhoodV4LaunchBuyAdapter` (Robinhood) | Executes the chain-specific ETH-funded acquisition/vault/purchase route or a direct held-wstO Dev Buy |
| `AnnouncementRegistry` | Uses the current creator recorded by this Factory |
| External wstO vault and SwapX router | Convert \$O/shares and execute admitted routes; their governance is separate from the launch contracts |

The same address represents the external wstO vault and ERC-20 shares. That vault holds the \$O backing; the settlement reserve accounts for wstO held in PoolManager. Neither is the optional staking reward contract. See [\$O launch integration](https://docs.o1.exchange/launchpad/integration/wsto.md) for exact accounting and interfaces.

## Launchpad of Launchpads architecture

[Launchpad of Launchpads](https://docs.o1.exchange/launchpad/launchpads/overview.md) uses three parts on Base and on Robinhood. These are an \$O launch token, a registry with vaults, and a child Tax suite. The registry creates one vault for each launchpad. The child Tax suite checks launch consent. Each chain has its own set.

| Contract | Launchpad responsibility |
| - | - |
| `PadRegistry` | Registers an \$O launch token as a launchpad, creates its vault, records the owner and payout, relays vault events and holds the pauses |
| `PadVault` (one clone for each launchpad) | Stores the launch rules, accepts or rejects each child launch, splits income into the owner share and the burn fund and runs the burn claim |
| `WstOSuiteReader` | Reads the creator and the pool of a launchpad token from the \$O launch factory. It supports no child launches |
| `TaxSuiteReader` | Reads the child Tax suite: tax policy, supply, escrow, dividends and launch consent |
| Child `TaxRWAERC20LaunchpadFactory` and `TaxLaunchHook` | A Tax suite whose hook asks the named integrator vault for consent before it records a pool |

A child launch names the vault as its integrator. The hook calls `launchConsent` on the vault with a fixed gas budget. The vault answers from the registry pauses and its launch rules. An accept makes the pool a member of the launchpad. A reject reverts the launch. A vault that gives no answer does not stop the launch, and the pool then gets no membership.

Fees reach the vault through the child fee escrow. The vault splits new income with the owner share that registration fixed. The rest goes into the burn fund. The only exit of the burn fund is `take`, which moves the burn amount of launchpad tokens to the dead address. No pause stops `take` or the owner withdrawal.

Vaults are clones of an immutable implementation. A new vault version applies only to launchpads that register after the registry selects it.

## Trust boundaries

* The factory owner can change economic defaults for launches that have not happened yet. Tax additionally permits Dividend exclusion, receiver and asset-recovery administration for existing clones; those powers cannot seize tokens from holders' wallets or unlock launch liquidity.
* The factory owner cannot change an existing token supply or remove liquidity. Creator-rights changes affect only current project authority and future creator-fee routing, without granting token or pool custody.
* The hook can credit fees only according to frozen pool configuration.
* The escrow can pay only swap fees already credited to it.
* The staking contract can move only principal and rewards according to each immutable vault and participant action.
* Transaction signing stays in the user's wallet; o1 services never hold signing keys.

## Monad deployment

Monad uses the ERC-20 minimal suite for crypto launches with MON, USDC and WETH and for stock launches with 10 wrapped xStocks. Stock buys route MON to USDC through Uniswap v3 or PancakeSwap v3, then USDC to the wrapped xStock through hook-free Uniswap v4 USDC/wrapper pools. The adapter uses Monad's no-deadline-argument SwapX overload while still enforcing the launch request deadline. It supports configured Uniswap/Pancake V3 and constrained hook-free external ERC-20 V4 pools; no Aerodrome factories are configured. The app searches bounded direct and USDC-bridge candidates. This is not a guarantee of the best route across all pools.

## Arc deployment

Arc's native USDC pays gas and the launch fee in 18-decimal units. The USDC pool quote uses the six-decimal ERC-20 interface over the same balance. cirBTC is a separate eight-decimal crypto quote in the application catalog. Pool trading fees and escrow claims use the selected quote currency. There is no separate wrapped-native token. This follows [Arc's USDC integration guidance](https://docs.arc.io/arc/tutorials/porting-contracts-to-arc).

`ArcSwapXLaunchBuyAdapter` accepts native or ERC-20 USDC funding. For native funding it converts the buy amount once by dividing by `1e12`, then lets SwapX spend through ERC-20 approval with zero native value forwarded. Native buy amounts must be exactly representable with six decimals; otherwise the transaction reverts. It does not wrap USDC or exchange USDC for itself. With USDC as the registered quote, the route ends directly in the USDC/launch-token pool. For a registered cirBTC quote, the planner first acquires cirBTC through a configured V3 pool, then executes the final cirBTC/launch-token swap. It compares the 0.01%, 0.05%, 0.3% and 1% V3 fee candidates by output. Token-page trading supports direct paired-asset swaps and USDC settlement through the same acquisition planner in either direction. Missing liquidity or an output too small to quote prevents route preparation.

The attached adapter uses the deadline-enabled SwapX overload. It permits configured V3 pools and initialized, liquid, hook-free external V4 pools with static fees up to 5%; PancakeSwap and Aerodrome are not configured. The final launch pool must still use o1's launch hook. Router pause and configuration checks, minimum output, complete input spending, balance preservation and allowance cleanup remain enforced. Accepted routes do not guarantee liquidity or the best quote.

The 5% value is a ceiling per external pool, not a fee automatically charged or a cap on all fees along a route. A permitted 0.3% pool charges 0.3%; quoting must account for each leg's actual fees. The launch pool's own Hook fee is separate. See [Direct integration](https://docs.o1.exchange/launchpad/integration/direct.md#arc-usdc-amounts-and-approvals) for funding amounts and approval targets.

See [Arc configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#arc-mainnet) for current launch settings.

Arc Tax uses `ArcTaxDividend` with the same public claim selectors, authorization and fee-accrual storage as the shared Dividend implementation. Its payment override transfers the fixed ERC-20 reward token for either unwrap preference, counting USDC backing once. See [Arc Tax currency rules](https://docs.o1.exchange/launchpad/integration/tax-tokens.md#arc-currency-and-claims).

## BSC deployment

BSC uses the same immutable ERC-20 launch suite for BNB, USDC and registered bStocks. Native BNB is the zero-address quote and WBNB is a separate wrapper. BSC USDC and all configured bStocks use 18 decimals.

`BscSwapXLaunchBuyAdapter` inherits the standard funding, authorization, exact-final-pool, minimum-output, deadline, residual-balance and allowance-cleanup checks. Clients supply the standard eight-field route; this BSC-only adapter encodes the router's ten-field descriptors, with the reserved `poolManager` and `parameters` fields zero. The route limit remains four hops.

Acquisition searches configured Uniswap V3 and PancakeSwap V3 pools, including USDC/USDT bridge candidates, before the exact launch V4 pool. Pancake V3 candidates use 0.01%, 0.05%, 0.25% and 1% fees. Eligible external V4 descriptors can pass adapter validation, but the current acquisition planner does not discover every external V4 pool. The external-pool fee cap is 5%, not an added fee. Pancake V2, Infinity CL/Bin and Aerodrome are not part of this controlled route integration.

The adapter preserves unexpected balances and rejects incomplete spending or output below the protected minimum. Simulate the selected route before signing, as with other chain integrations.

## X Layer deployment

X Layer uses the same immutable ERC-20 minimal suite, with native OKB, USDC, xETH and 45 wrapped stocks as supported quotes. The launch fee is 0.02 OKB, and pool fees and claims use the selected quote currency. Native OKB has 18 decimals and uses the zero address; WOKB is its separate wrapper.

The generic `SwapXLaunchBuyAdapter` uses the standard eight-field deadline interface and supports native-funded atomic Dev Buy into an OKB-paired launch pool. Atomic Dev Buy for a non-native quote requires an attached adapter that reports `nativeV3InputSupported() == true`, plus an executable acquisition route. Quote registration alone does not enable that route.

Token-page trading uses the X Layer SwapX proxy and its exact launch-pool route; sells approve that proxy. Compatible V3 acquisition is a separate path for registered ERC-20 quotes. The binding permits at most four hops and a 1% external-pool fee cap; external V4, V2, Infinity and custom external hooks are not enabled by this integration.

See [X Layer contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#x-layer-mainnet) and [configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#x-layer-mainnet).

## Elysium deployment

Elysium (`99901`) uses the same immutable ERC-20 minimal suite and its own Tax suite, with native HYPE and USDC as supported quotes and no stock catalog. The launch fee is 0.025 HYPE on both factories, and pool fees and claims use the selected quote currency. Native HYPE has 18 decimals and uses the zero address; WHYPE is its separate wrapper.

Each suite has its own `ElysiumSwapXLaunchBuyAdapter`, bound to the Elysium SwapX router proxy. It uses the standard eight-field deadline interface, allows explicit wrapped-native input, reports `nativeV3InputSupported() == true`, caps external pool fees at 1% and disables external V4; no Aerodrome factories are configured. A HYPE launch takes a HYPE-funded atomic Dev Buy. A USDC launch takes a USDC-funded Dev Buy only, because Elysium has no HYPE/USDC Uniswap v3 pool.

Token-page trading uses the Elysium SwapX proxy and its exact launch-pool route; sells approve that proxy, and native HYPE buys send value with no approval.

See [Elysium contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#elysium-mainnet), [Elysium Tax contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#elysium-tax-contracts) and [configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#elysium-mainnet).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.