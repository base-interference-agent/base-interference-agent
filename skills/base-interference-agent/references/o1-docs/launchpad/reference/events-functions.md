> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Functions and events

> Public functions, important reads, and events for the current o1 Launchpad contracts.

This developer reference summarizes the public contract surface. Use the verified explorer ABI for exact transaction encoding.

## Standard launch factories

For Standard tokens, Base, Robinhood, BSC, Monad and X Layer each use one current launch factory for both crypto-paired and stock-paired creation. The current and historical addresses are linked from [Production contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md), and the complete topology is available in [`launch-contract-suites.json`](https://docs.o1.exchange/launchpad/reference/launch-contract-suites.json). Event consumers must retain historical factories and use the ABI matching each suite's `contractVersion`.

### Active production factories

| Surface | Important members |
| - | - |
| Create | `createLaunch(LaunchParams)` creates and seeds a launch; `createLaunchAndBuy(LaunchParams, LaunchBuyParams)` also executes one protected buy through the configured adapter |
| Core configuration | `configVersion`, `launchSupply`, `tickSpacing`, `bandTemplate`, `nativeLaunchFee`, `announcementRegistry`, and `launchBuyAdapter` |
| Fee configuration | `baseFeeBps`, `antiSnipeStartTotalBps`, `antiSnipeWindowSeconds`, `feeComponentCount`, indexed `feeComponents(index)`, and `platformFeeRecipient` |
| Quote state | `quoteConfig(quote)` and `quoteRevision(quote)` |
| Creation state | `launchCreationEnabled`, `priceUpdater`, and `TOKEN_ADDRESS_SUFFIX` |
| Transaction safety | `isLaunchSaltUsed(scopedSalt)` plus the fresh `configVersion` supplied in `LaunchParams` |
| Quote management | `registerQuote`, `setQuoteStartTick`, and `unregisterQuote`, plus their bounded batch forms with at most 64 entries |
| Creator-rights reads | `creatorRights(token)` and `currentCreatorOf(token)` |
| Creator self-service | `proposeCreatorRightsTransfer`, `acceptCreatorRightsTransfer`, `cancelCreatorRightsTransfer`, `safeTransferCreatorRights`, and `setCreatorFeeRecipient` |
| Creator-rights administration | `creatorAdmin`, `pendingCreatorAdmin`, `adminReassignCreatorRights`, `transferCreatorAdmin`, `acceptCreatorAdmin`, `cancelCreatorAdminTransfer`, and `revokeCreatorAdmin` |
| Token metadata | `updateTokenName`, `updateTokenSymbol`, `updateTokenContractURI`, and `updateTokenExtraMetadata` for launches that enabled editing |

The current Base, Robinhood, Monad, Arc, BSC, X Layer and Elysium factories do not expose the older `feeDefaults()` aggregate read. Read the named fee getters and enumerate `feeComponents(0..feeComponentCount-1)`. They also replace the older `quotes()` tuple with `quoteConfig()`, use one global `nativeLaunchFee()` for every quote, and use `bandTemplate()` instead of `bands()`.

The current fee component rows on all six chains are `CREATOR` at 50 bps, `PLATFORM` at 30 bps, and `REFERRER` at 20 bps. Their sum is the 100 bps base fee. Component bps are direct shares of the trade amount, not percentages that need to be applied to `baseFeeBps` again.

### Chain-specific token deployment

Base creates and validates native B20 tokens. Robinhood, Monad, Arc, BSC, X Layer and Elysium call their dedicated `LaunchTokenDeployer` to create immutable ERC-20 tokens. Robinhood, Monad, Arc, BSC, X Layer and Elysium integrations can read `launchTokenBytecodeHash(LaunchParams)` and `TOKEN_ADDRESS_SUFFIX` to prepare a deterministic token address ending in `01` before signing.

### Launch events

| Event | Meaning |
| - | - |
| `Launched` | Token, pool ID, creator, quote, supply, and liquidity spacing |
| `NativeLaunchFeePaid` | Creation-fee payer, configured recipient, and native amount |
| `LaunchBuyExecuted` | Token, pool, creator, funding token, input amount, output amount, and adapter for an atomic launch-buy |
| `QuoteRegistered` / `QuoteUnregistered` | Supported quote changes |
| `QuoteStartTickUpdated` | Revision-aware future opening-frame update |
| `BandTemplateUpdated` | Future liquidity-range change |
| `FeeConfigurationUpdated` / `FeeComponentConfigured` | Future base fee, anti-snipe, and component configuration |
| `LaunchSupplyUpdated` / `TickSpacingUpdated` | Future supply or range-alignment change |
| `NativeLaunchFeeUpdated` / `LaunchBuyAdapterUpdated` | Future global launch-fee or atomic adapter change |
| `ConfigVersionUpdated` / `AnnouncementRegistrySet` | Future launch configuration version or announcement-registry change |
| `CreatorRightsTransferProposed` / `CreatorRightsTransferCancelled` / `CreatorRightsTransferred` | Two-step creator-rights transfer history |
| `CreatorRightsReassigned` / creator-admin transfer events | Administrative creator-rights reassignment or creator-admin authority changes |
| `CreatorFeeRecipientUpdated` | Future creator-fee routing |
| `OwnershipTransferStarted` / `OwnershipTransferred` | Governance ownership change |

All current minimal factories additionally emit `PriceUpdaterUpdated` and `LaunchCreationEnabledUpdated`. Historical factories retain their original event names; use the ABI for the exact contract that produced the event.

## LaunchHook

The hook exposes `poolConfig(poolId)` and `poolFeeComponents(poolId)` for each launch pool. These reads return the pool's frozen fee and anti-snipe configuration plus its current creator and creator fee recipient. The factory registers and seeds a pool; ordinary trading then occurs through Uniswap v4.

| Event | Meaning |
| - | - |
| `PoolRegistered` | The pool's immutable original creator, initial creator fee recipient, and base fee |
| `CreatorRightsUpdated` | Current creator and creator fee-recipient changes |
| `FeeComponentCredited` | Per-component fee credit, recipient, currency, and amount |
| `Seeded` | Token amount placed into the permanent position |
| `Trade` | Executor, referrer, fee currency, fee amount, and optional comment; swap direction comes from the matching Uniswap event |

`Trade.executor` is the router or callback sender and is not guaranteed to be the trader's wallet. Indexers should derive direction and trader attribution from the complete transaction receipt, including the matching Uniswap swap and router execution context.

## FeeEscrow

| Function | Who can call | Result |
| - | - | - |
| `owed(recipient, currency)` | Anyone | Returns the raw claimable fee balance |
| `claimFor(recipient, currency)` | Anyone | Pays the full balance to the recorded recipient on the current fee contract |
| `claimTo(currency, destination)` | Balance owner | Pays the caller's balance to a chosen address |

Events: `Credited` and `Claimed`.

Earlier launch contracts use their original claim function names. Resolve the fee contract recorded for the launch before encoding a claim.

## AnnouncementRegistry

| Function | Who can call | Result |
| - | - | - |
| `isTokenRegistered(token)` | Anyone | Checks whether the active registry knows the launch token |
| `isAnnouncementIdUsed(token, id)` | Anyone | Checks whether an announcement ID was used |
| `postAnnouncement(token, id, description, uri)` | Current recorded creator | Publishes a unique announcement |

Events: `TokenRegistered` and `AnnouncementPosted`.

Earlier launch contracts retain their original `creatorOf`, `usedId`, `post`, `CreatorRegistered`, and `Announcement` surface.

## Robinhood, Monad, Arc, BSC and X Layer launch tokens

Standard launch tokens on Robinhood, Monad, Arc, BSC, X Layer and Elysium expose ERC-20 reads and transfers. When profile editing was enabled at launch, the metadata authority can call `updateName`, `updateSymbol`, `updateContractURI`, and `updateExtraMetadata`. No mint, burn, pause, owner, upgrade, or recovery function exists.

Standard ERC-20 launches on Robinhood, Monad, Arc, BSC, X Layer and Elysium use `LaunchToken`; Tax launches use `TaxLaunchToken`. Each is created through its own bound factory and must end in `01`.

## Tax surface

The Base, Robinhood, BSC, Monad, X Layer, Arc and Elysium Tax suites use `TaxRWAERC20LaunchpadFactory`, `TaxLaunchHook`, optional `TaxDividend` clones (`ArcTaxDividend` on Arc) and one fixed `TaxDividendClaimHelper` per suite. Each keeps FeeEscrow and creator-rights concepts but has different launch tuples, inclusive units and fee events.

Arc reward/payment event amounts use the fixed ERC-20 quote units: six decimals for USDC and eight for cirBTC. Native launch fees and native recovery use 18-decimal USDC units. The payment preference does not convert Arc rewards to a wrapped or separate native asset.

| Surface | Important members |
| - | - |
| Policy and preview | `taxPolicy`, `previewTaxConfiguration`, `configVersion` |
| Owner policy updates | `setTaxPolicy`, `setTaxFeeBounds`, `setProtocolFeeConfiguration`, `setAntiSnipeConfiguration`, `setMinimumDividendHoldingRequirement` |
| Launch | Tax `createLaunch` / `createLaunchAndBuy` tuples; `launchTokenInitCodeHash`; `dividendOf` |
| Pool rates | `poolConfig`, `effectiveFeeRates` |
| Dividend earnings | Hook-only `notifyDividendFee`; `withdrawableDividendOf`, `accumulativeDividendOf`, `withdrawnDividends` |
| Dividend backing | `pendingDividendFunding`, `availableRewardBacking`, `requiredRewardBacking`, `rewardBackingDeficit` |
| Dividend withdrawals | Holder-authorized `withdrawDividends` and `withdrawDividendsFor` |
| Voluntary contributions | `depositDividends` assigns new rewards; `replenishBacking` restores backing without new entitlements |
| Cross-token claims | Fixed helper `claimDividends`; caller is the holder, no arbitrary beneficiary parameter |
| Burn delivery | Unchanged `FeeEscrow.claimFor(deadAddress, token)` |

Tax events include `LaunchTaxConfigured`, `TaxPolicyUpdated`, category-specific quote/burn credit events, `DividendTaxRedirected`, Dividend share/accrual/allocation/payment events and the helper's `DividendsClaimed`. Do not decode them with Standard fee-component tuples. [Tax contract integration](https://docs.o1.exchange/launchpad/integration/tax-tokens.md) gives the complete mapping, precision, authorization and accounting distinctions.

## \$O launch contracts

Use the `wsto-burn-v1` ABI for [\$O launches on Base and Robinhood](https://docs.o1.exchange/launchpad/integration/wsto.md), not Standard fee components or Tax allocation tuples.

| Surface | Members and meaning |
| - | - |
| Creation | `createLaunch`, `createLaunchAndBuy`, `launchTokenBytecodeHash`, `configVersion`, `launchCreationEnabled` |
| Burn defaults | `defaultBurnRates`, `setDefaultBurnRates`, `DefaultBurnRatesUpdated`; only new pools use updated rates |
| Pool read | Hook `poolConfig(poolId)` returns initialization, token ordering and frozen buy/sell burn rates |
| Quote lifecycle | `quoteConfig`, `quoteRevision`, registration/removal and revision-checked tick updates |
| Bindings | `settlementReserve`, `launchBuyAdapter`, `tokenDeployer`, `hook`, `poolManager`, `announcementRegistry` |
| Launch events | `PoolRegistered`, `Seeded`, `Launched`, optional `LaunchBuyExecuted` |
| Swap events | `Trade` for every successful swap; `QuoteBurned` only for a positive actual burn |
| Reserve reads / events | `quoteReserveBalance`, `QuoteReserveDeposited`, `QuoteReserveWithdrawn`, `ReserveAssetRecovered` |
| Creator rights | Current/original/pending creator, transfer and reassignment; no `creatorFeeRecipient` or fee-recipient update |

`Trade` includes explicit `isBuy`, `grossQuoteAmount`, `launchTokenAmount` and `burnAmount`. Its executor is not necessarily the wallet. Do not count the matching `QuoteBurned` twice or treat a reserve deposit as a trade. Read [receipt attribution](https://docs.o1.exchange/launchpad/integration/wsto.md#events-and-attribution) before decoding atomic launches.

There is no read of accumulated per-pool burns in the Hook. Aggregate confirmed burn events with deduplication and reorg handling. `totalSupply()` on wstO includes deposit, redemption and other burn effects, so it cannot replace that event history.

## Launchpad of Launchpads registry and vault

### Registry functions

| Function | Who can call | Result |
| - | - | - |
| `registerExisting(slug, padToken, key, payout, ownerShare, expectedVaultVersion, initData)` | Current creator of an \$O launch token | Creates the vault, applies the launch policy and pays the registration fee. `msg.value` must equal `registrationFee()` |
| `predictVault(slug, owner)` | Anyone | Returns the vault address before registration |
| `pads(slugHash)` / `padByVault(vault)` / `padOwner(slugHash)` | Anyone | Returns the launchpad record, for example the owner, token and vault |
| `childLaunchesOpen(slugHash)` | Anyone | Checks only the global pause and the launchpad pause. It does not check that the launchpad exists, its launch rules or the factory. Use `acceptsLaunch` and a simulation for a real check |
| `isMember(suiteId, poolId)` | Anyone | True only when the hook recorded that the vault of this registry accepted the launch |
| `proposePadOwner(slugHash, newOwner)` / `cancelPadOwnerProposal(slugHash)` | Launchpad owner | Starts or cancels an ownership transfer |
| `acceptPadOwner(slugHash, payout, expectedCreator)` | Proposed owner | Completes the transfer. A nonzero `expectedCreator` must be the current creator of the launchpad token |
| `setPadChildSuite(slugHash, suiteId, accepted)` | Launchpad owner | Accepts or refuses tokens of an additional enabled suite |
| `setPadTakeThreshold(slugHash, threshold)` | Threshold setter | Changes the burn amount of one launchpad, inside the supply bounds |
| `setRegistrationPaused`, `setChildLaunchesPaused`, `setPadChildLaunchesPaused` | Owner or guardian | Pauses or resumes new launchpads, all token launches or the token launches of one launchpad |
| `setRegistrationFee`, `setTakeThreshold`, `setOwnerBpsBounds`, `setDefaultOwnerBps`, `reserveSlug` | Registry owner | Changes settings for new launchpads |
| `addSuite`, `setActiveChildSuite`, `setChildSuiteEnabled`, `addVaultVersion`, `setDefaultVaultVersion` | Registry owner | Admits suites and vault versions. Existing pools and vaults do not change |

The app sends the registry default owner share. A direct call can send another value inside the registry bounds. The pool key must be the recorded wstO pool of the token, paired with the fixed wstO quote.

### Vault functions

| Function | Who can call | Result |
| - | - | - |
| `claim(escrow, currency)` | Anyone | Collects the vault credit from an admitted fee escrow, then splits it |
| `sync(currency)` | Anyone | Splits unrecorded income between the owner share and the burn fund |
| `donate(currency, amount)` | Anyone | Adds the complete amount to the burn fund. It gives no owner share |
| `claimDividends(suiteId, token)` | Anyone | Collects dividends for the vault from an admitted Tax token |
| `withdrawOwner(currency)` | Anyone | Pays the owner share of one currency to the payout address |
| `take(nonce, expectedThreshold, currencies, minAmounts, deadline, recipient)` | Any holder of the burn amount | Burns the launchpad tokens and sends the burn fund of up to 20 currencies to the recipient |
| `takeable(currencies)` | Anyone | Returns the burn fund of each currency after a virtual split |
| `setLaunchPolicy(policy, changes)` | Launchpad owner | Replaces the launch rules and changes both lists in one transaction |
| `closeLaunches()` | Launchpad owner | Stops new token launches without a tax check |
| `setPayout(recipient)` | Launchpad owner or registry | Changes the payout address. The registry calls it when the proposed owner accepts |
| `launchPolicy()` / `acceptsLaunch(context, hook)` | Anyone | Returns the launch rules, or checks one launch against them |

### Events

| Event | Meaning |
| - | - |
| `PadRegistered` / `PadOrigin` | A new launchpad, its token, vault, owner and suite |
| `PadOwnerProposed` / `PadOwnerTransferred` | An ownership proposal and its completion |
| `PadTakeThresholdUpdated` / `TakeThresholdUpdated` | A burn amount change for one launchpad or for new launchpads |
| `RegistrationPausedUpdated` / `ChildLaunchesPausedUpdated` / `PadChildLaunchesPausedUpdated` | A pause change |
| `VaultEvent(vault, kind, data)` | A vault event that the registry relays |

`VaultEvent` kinds are `Synced`, `Donated`, `OwnerWithdrawn`, `Taken`, `PayoutUpdated`, `OwnerBpsUpdated`, `LaunchPolicySet`, `LaunchAllowlistUpdated` and `LaunchQuotesUpdated`. Each `kind` is the `keccak256` hash of its name. Index the registry address only, because every vault event goes through it.

## X-linked fee vaults

These methods belong to the [Base fee-sharing companions](https://docs.o1.exchange/launchpad/reference/production-contracts.md#base-x-linked-fee-vaults). They do not replace the ordinary Factory or FeeEscrow APIs above. Use each contract's verified ABI for the complete tuple types, return values and errors.

### Registry

| Function | Who can call | Result |
| - | - | - |
| `payoutAccountOf(xId)` | Anyone | Reads the permanent receiving account; zero means not yet registered |
| `nonces(account)` / `verifier()` / `verifierEpoch()` / `registrationEnabled()` | Anyone | Reads proof replay protection and current registration controls |
| `bindingDigest(binding)` | Anyone | Computes the Registry's EIP-712 binding digest |
| `register(binding, signature)` | The signed receiving account | Registers one X ID using a valid, unexpired verifier proof |
| `setVerifier(address)` | Registry owner | Rotates the verifier and increments its epoch, invalidating outstanding old-epoch proofs |
| `setRegistrationEnabled(bool)` | Registry owner | Enables or disables new bindings; established links and claims remain available |

`Binding` contains `xId`, `payoutAccount`, `nonce`, `issuedAt`, `expiresAt` and `verifierEpoch`. The EIP-712 domain also binds the chain and Registry address. The app prepares these fields; users do not invent proof values. Usernames are not signed ownership identifiers. Events: `AccountBound`, `VerifierUpdated`, `RegistrationEnabledUpdated`.

### Vault Factory / coordinator

| Function | Who can call | Result |
| - | - | - |
| `recipientRegistry()` / `vaultImplementation()` / `deploymentChainId()` | Anyone | Reads fixed deployment identities |
| `suite(factory)` / `creationEnabled(factory)` | Anyone | Reads admission configuration and the stored new-creation switch; this is not a complete launch simulation |
| `predictVault(initiator, factory, userSalt)` | Anyone | Predicts the clone for this caller/suite/salt combination |
| `vaultOf(factory, token)` / `isVault(address)` | Anyone | Resolves or recognizes vaults created by this coordinator |
| `createV4(...)` / `createTax(...)` | Launching account | Atomically creates a token and vault with a creator-plus-X split |
| `createV4AndBuy(...)` / `createTaxAndBuy(...)` | Launching account | Adds the supported typed Dev Buy route, exact funding and minimum-output protection |
| `admitSuite(configuration)` / `setCreationEnabled(factory, bool)` | Coordinator owner | Admits a fixed suite configuration, then controls future vault creation for it |
| `admitMarketplace(address, runtimeHash)` / `setMarketplaceEnabled(address, bool)` | Coordinator owner | Admits a reviewed creator-position marketplace, then controls new participation |
| `marketplaceEnabled(address)` / `marketplaceAllowed(address)` | Anyone | Distinguishes the stored switch from effective runtime/interface permission |

Admission starts disabled and is separate from activation. The initiator is the transaction caller; the split's creator controller can differ. All four creation methods are payable for the underlying suite's exact native launch fee and, where applicable, native buy funding. ERC-20 funding follows its explicit asset, amount and approval path.

Events: `SuiteAdmitted`, `CreationEnabledUpdated`, `MarketplaceAdmitted`, `MarketplaceEnabledUpdated`, `VaultLaunched`. Registry and coordinator ownership use `owner`, `pendingOwner`, `transferOwnership`, `acceptOwnership` and inherited `renounceOwnership`; renouncing does not itself turn off enabled configurations.

### Individual token vault

| Function | Who can call | Result |
| - | - | - |
| `launchInitiator()` / `token()` / `poolId()` / `quote()` / `suite()` | Anyone | Reads fixed launch attribution and fee dependencies |
| `creatorController()` / `creatorBps()` / `xIds()` / `xShareBps(xId)` | Anyone | Reads the current creator position and immutable allocation percentages |
| `grossReceived()` / `totalPaid()` / `xPaid(xId)` | Anyone | Reads cumulative income and actual payout accounting in raw quote units |
| `claimableX(xId)` | Anyone | Reads that X allocation's unpaid cumulative entitlement |
| `claimX(xId)` | That X ID's registered receiving account | Pays the entitlement to that account |
| `claimableCreator(account)` / `creatorCredit(account)` / `creatorPaid(account)` | Anyone | Reads creator-position earnings, including unpaid credit retained after a handover |
| `claimCreator()` | The account with creator credit | Collects its own credit, including historical earnings after losing the position |
| `feeRoutingIntact()` | Anyone | Checks whether underlying Factory creator rights and fee routing still point to this vault |
| `proposeCreatorPositionTransfer(recipient, expiresAt, expectedRevision)` | Current creator controller | Proposes a handover; income still belongs to the current controller until acceptance |
| `cancelCreatorPositionTransfer(expectedRevision)` | Current creator controller | Cancels a pending proposal |
| `acceptCreatorPositionTransfer(expectedRevision)` | Proposed recipient | Checkpoints prior earnings, then changes the creator controller |
| `adminReassignCreatorPosition(expectedController, recipient, expectedRevision)` | Live V4 creator admin; Tax owner or creator admin | Performs scoped Takeover without changing X allocations or historical creator credit |
| `updateTokenName`, `updateTokenSymbol`, `updateTokenContractURI`, `updateTokenExtraMetadata`, `postAnnouncement` | Current creator controller | Forwards this token's permitted metadata/announcement actions, subject to routing, auction and editability checks |

Initialization and the four vault `launch...` methods are coordinator-only lifecycle operations. Integrators call the coordinator's `create...` methods; they do not initialize or launch an arbitrary clone directly. The implementation is locked against initialization. `BPS` and `MAX_RECIPIENTS` are constant getters, not settings.

Events include `SplitConfigured`, `Activated`, `Claimed`, `CreatorPositionProposed`, `CreatorPositionProposalCancelled`, `CreatorPositionTransferred`, `CreatorCreditCheckpoint` and `CreatorClaimed`. `LaunchDividendsForwarded` records the initiating buyer's transient Tax holder dividends, separately from split creator-fee payouts.

### Creator-position marketplace interface

`approveCreatorPositionAuction` and `cancelCreatorPositionAuctionApproval` are creator-authorized. `hashAuctionTerms` binds the exact listing terms, revision, nonce, expiry, vault and marketplace. Only the approved market can lock the position with `lockCreatorPositionAuction`; the locked market calls `finalizeCreatorPositionAuction` for its terminal outcome. `creatorAuctionApproval`, `creatorAuction` and `creatorAuctionReserve` expose the current state.

Events: `CreatorAuctionApproved`, `CreatorAuctionApprovalCancelled`, `CreatorAuctionLocked`, `CreatorAuctionResolved`. Version `2` of the creator-position interface is distinct from coordinator version `3` and split schema `3`. A compatible marketplace must be admitted by the coordinator, sell only the creator position, preserve fixed X shares, honor the seller's exact terms and handle payments/refunds. See [Takeover and OTC scope](https://docs.o1.exchange/launchpad/trading/share-creator-fees.md#handover-takeover-and-otc).

## Staking contract

One staking contract serves every vault on its chain. The vault creator and complete immutable configuration determine the `vaultId`.

| Function | Who can call | Result |
| - | - | - |
| `createVault(params, expectedFeeConfigVersion)` | Anyone | Creates and completely funds an immutable vault plus its one-time protocol fee |
| `deposit(vaultId, amount)` | Token holder | Transfers staking tokens into a new deposit lot |
| `withdraw(vaultId, lotId, amount, to)` | Lot owner | Withdraws one lot amount under the vault's early-exit and forfeiture rules |
| `withdrawLots(vaultId, lotIds, amounts, to)` | Lot owner | Atomically withdraws ordered amounts from several lots |
| `claim(vaultId, epochs, to)` | Participant | Claims the caller's rewards from ordered completed epochs |
| `previewWithdraw` / `previewClaim` | Anyone | Previews one withdrawal or an ordered claim batch |
| `deriveVaultId` | Anyone | Derives the vault ID from its creator and complete configuration |
| `getVault` | Anyone | Returns immutable configuration, creator, end time, total staked, reward remaining, and deposit-opening time |
| `getUserState` / `getLot` / `getUserLots` | Anyone | Returns aggregate principal and paginated deposit-lot state |
| `isClaimed` / `epochBounds` | Anyone | Returns claim status and epoch timing |
| `feeConfig` | Anyone | Returns the current creation-fee rate, recipient, and change counter |
| `setFeeConfig` | Contract owner | Updates only the fee used by future vault creation |

| Event | Meaning |
| - | - |
| `VaultCreated` | Vault ID, creator, assets, schedule, reward budget, exit policy, and fee snapshot |
| `Deposited` | Participant, deposit lot, amount, deposit time, and unlock time |
| `Withdrawn` | Lot amount, recipient, remaining principal, penalty result, and current-epoch forfeited weight |
| `EpochRewardClaimed` | Participant reward paid for one completed epoch |
| `FeeConfigUpdated` | New fee rate, recipient, and change counter for later vault creation |

Use the verified explorer ABI for exact types and encoding. See the [staking guide](https://docs.o1.exchange/launchpad/staking/overview.md) for the reward, withdrawal, and claim rules.

## Common launch errors

| Error | Meaning |
| - | - |
| `StaleConfig` | Refresh the current factory settings and rebuild the transaction |
| `LaunchExpired` | Use a fresh deadline |
| `QuoteNotRegistered` | The selected quote is unavailable |
| `LaunchCreationDisabled` | New launches through the selected factory are currently switched off |
| `StaleQuoteRevision` | A paired-asset opening-price update used an outdated quote revision |
| `InvalidTokenAddressSuffix` | The prepared token address does not meet that factory's `01` suffix rule |
| `LaunchSaltUsed` | Use a new launch identifier |
| `InvalidNativeLaunchFeePayment` / `InvalidLaunchBuyPayment` | The native creation fee or combined launch-buy payment was not exact |
| `OutOfBounds` / `InvalidConfig` | A hard limit or related-field rule failed |
| `NotImmutable` | The created token failed its fixed-authority checks |
| `NotSingleSided` | Opening liquidity would require the paired asset |
| `LiquidityLocked` | The requested liquidity change is not allowed |
| `ExactOutputDisabledDuringAntiSnipe` | Use an input-amount trade or wait until the normal fee begins |
| `PartialFillUnsupported` | The requested quote-specified amount could not be filled completely |


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.