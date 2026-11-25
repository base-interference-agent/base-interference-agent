> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Configuration and governance

> What o1 governance can change for future launches and which properties remain permanent after a token launches.

The Standard suites on Base, Robinhood, BSC, Monad and X Layer each use one `launchpad-v4-minimal` factory for both crypto-paired and stock-paired creation. Base Standard creates native B20 tokens, while Robinhood, Monad, Arc, BSC, X Layer and Elysium create fixed-supply ERC-20 tokens. A catalogued paired asset becomes available when it is registered on the active factory and creation is enabled. Available market types share the same launch model, fee system, creator rights, announcements, and permanent Uniswap v4 liquidity.

Base, Robinhood, BSC, Monad, X Layer, Arc and Elysium Tax have separate launch contracts and configurable trading taxes. Their governance roles follow the same structure as Standard. See the [Tax configuration overview](https://docs.o1.exchange/launchpad/reference/live-configuration.md#tax-release-overview) for all seven configurations and [Production contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md) for their independently bound addresses.

## Who controls what

| Area | Current authority | Boundary |
| - | - | - |
| Future launch settings | Launchpad governance owner | Changes apply only to launches created afterward |
| Standard platform fees / Tax protocol share | The suite's configured recipient | Receives its share but cannot control tokens or pools |
| Paired-asset opening-price updates | Restricted price updater | Can update future opening frames only; cannot register assets, change fees, or modify pools |
| Creator rights | Current creator | Can transfer project rights; Standard/Tax also allow future creator-fee routing changes; no token or liquidity control |
| Creator-rights administration | Creator admin | Can immediately reassign project rights and, on Standard/Tax, future creator-fee routing; no token or liquidity control |
| Token profile editing | Current creator, only when enabled at launch | Limited to supported profile information |
| Tax Dividend administration | Factory owner or delegated creator admin | Can change per-launch exclusions and receivers, refresh shares and recover Dividend assets; cannot change frozen tax rates or unlock liquidity |
| Announcements | Current creator | Can publish updates but receives no token or liquidity control |
| Permanent liquidity | Launch hook | Cannot be removed, transferred, or redirected |

Dated governance-owner and platform-fee-receiver observations are listed in [Production contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#governance-and-fee-recipient). Read current roles before an administrative transaction.

## X-linked fee-vault controls

The [fee-sharing companions](https://docs.o1.exchange/launchpad/architecture/contracts.md#x-linked-creator-fee-vaults) have separate owners and availability controls. They do not inherit the underlying Factory owner automatically.

| Role or control | Can change | Cannot change |
| - | - | - |
| Registry owner | Verifier and availability of new X registrations | Existing X-to-account bindings or vault shares |
| Backend verifier | Signs checked identity/account proofs for unregistered X IDs | Submit the user's account transaction or replace confirmed bindings |
| Vault Factory owner | Admit reviewed suites/marketplaces; enable new vault creation or marketplace activity | Upgrade existing vaults, edit their allocations or withdraw their fees |
| Underlying V4 creator admin; Tax owner/creator admin | Scoped creator-position reassignment | Fixed X IDs/percentages or earlier creator credit through that scoped method |
| Current creator fee wallet | Propose a position handover and use permitted metadata/announcement methods | Change its percentage, X allocations, token supply or liquidity |

Registry and Vault Factory ownership use `transferOwnership(newOwner)` followed by `acceptOwnership()` from the nominee. Nominating a wallet is not a completed handover. The verifier does not change with ownership. The vault implementation and token-specific clones have no platform ownership handover; creator-position transfers are separate.

Disabling new registration or new creation does not pause existing claims. Disabling a marketplace prevents new participation without automatically preventing an active auction's valid terminal settlement.

Existing Factory administrators retain their full creator-rights and fee-routing overrides. Those can redirect future income away from a vault; previous vault balances and earned shares remain subject to normal claim requirements. See the [Base contract and governance reference](https://docs.o1.exchange/launchpad/reference/production-contracts.md#base-x-linked-fee-vaults).

## Settings for future launches

Governance can update these defaults:

* supported paired assets and any future creation fees;
* the opening price used for each paired asset;
* fixed token supply within the contract caps;
* liquidity range settings;
* Standard base fees, anti-sniping, recipient splits and the platform receiver, or the Tax policy described below.

The announcement registry is bound once and cannot be replaced.

The current Standard and Tax factories include a creation switch, bounded paired-asset updates, and per-asset revisions. The owner can register or remove paired assets. The restricted updater can change only the opening-price frame of an already registered asset, using its latest revision. Each factory's creation switch and global native launch fee apply to all its supported quotes. Monad, Arc and Elysium support crypto-paired markets only.

The interface refreshes the current settings before a creator signs. If protected global settings change while a prepared transaction is pending, the transaction stops instead of silently using different economics. A paired asset's opening-price refresh intentionally applies the latest registered frame when the launch executes.

## Tax policy and Dividend administration

For future Tax launches, the owner can change buy/sell bounds, protocol share and clamps, the protocol recipient, anti-sniping opening and duration, and the dividend holding floor. The complete policy can be updated atomically. A zero protection duration allows launches with creator opt-out; it does not by itself disable creation.

Existing tokens retain selected taxes, allocation shares, integrator attribution, reward currency, dividend threshold and protection settings. The current creator can change future creator-fund routing through its existing right. Earlier credits do not move.

Additional default Dividend exclusions apply only to future clones. Authorized per-launch exclusion/unexclusion and receiver changes affect existing clones. Mandatory system exclusions cannot be removed. Exclusion keeps earned rewards recorded but blocks payment while excluded. Asset recovery can remove backing for unpaid rewards; replenishment restores backing without reallocating those rewards. These powers are part of the trust model, not ordinary creator or holder self-service.

See [Tax contract integration](https://docs.o1.exchange/launchpad/integration/tax-tokens.md#exclusions-and-administrative-controls) for the exact functions.

## \$O launch governance

Each chain's separate \$O Factory owner sets buy/sell burn defaults from 0% through 99%, only for future launches. Existing pools keep their rates. There is no creation-fee, payout, allocation or anti-sniping policy to configure. The managed quote registry accepts reviewed burn-compatible ERC-20s; current public support is wstO, not the Standard or Tax quote catalog.

Creator rights retain profile and announcement authority without fee-recipient routing. Creator-admin reassignment does not control balances or locked liquidity. The owner, creator admin and price updater use the [shared governance addresses](https://docs.o1.exchange/launchpad/reference/production-contracts.md#governance-and-fee-recipient). Read the selected Factory to verify current authority before an administrative transaction.

The reserve has no independent owner: its authority follows `Factory.owner()`. That owner can deposit reserve funds, redeem the reserve's own claims to a specified recipient, or recover direct donations. They cannot withdraw the launch LP position or other accounts' claims. Full reserve withdrawal is permitted and may make positive-burn swaps fail for insufficient physical inventory. See [reserve boundaries](https://docs.o1.exchange/launchpad/integration/wsto.md#settlement-reserve).

Adapter replacement changes future atomic-buy execution and requires fresh approvals/configuration. It does not rewrite existing pools. Quote removal or disabling creation stops new launches, not ordinary swaps in existing pools. The vault's deposit controls and the shared router's upgrades are separate governance dependencies.

## What becomes permanent

When a launch succeeds, the following properties are fixed for that launch:

* token address and total supply;
* original creator and selected paired asset;
* market type and launch contracts;
* opening pool and liquidity range;
* trading rates, including the buy/sell burn rates for \$O launches;
* Standard/Tax allocations and fixed recipients, except that the current creator-fee recipient can change for future credits;
* Standard/Tax anti-snipe start time and duration;
* permanent liquidity position.

Future governance changes cannot mint more launched tokens or remove liquidity. A valid creator-rights transfer updates the current creator; Standard and Tax also support future creator-fee routing changes. Already credited balances do not move. \$O launches have no recipient-fee credits.

## Token authority

Tokens launch without an owner who can mint, pause, upgrade, or take balances. Creator rights cover project-side authority, announcements and optional profile editing, plus future creator-fee routing on Standard and Tax. They do not grant control over token transfers or liquidity.

## Launchpad of Launchpads roles

Each Launchpad of Launchpads registry, on Base and on Robinhood, has its own roles. The shared [governance owner and treasury](https://docs.o1.exchange/launchpad/reference/production-contracts.md#governance-and-fee-recipient) hold these roles. They stay separate contract roles from the Standard and Tax roles.

| Area | Current authority | Boundary |
| - | - | - |
| Registration fee, default burn amount, owner share bounds and default, reserved URLs, suites and vault versions | Registry owner | Defaults and vault versions affect new launchpads. Child suite changes affect future token launches on existing launchpads. It cannot withdraw from a vault or change an existing owner share |
| Guardian, threshold setter and allowlist manager appointments | Registry owner | Each appointment changes only that role |
| Pauses of new launchpads, all child launches or the child launches of one launchpad | Registry owner or guardian | The guardian role controls only these pauses. No pause stops trades, owner withdrawals or burn claims |
| Burn amount of one launchpad | Threshold setter | Must stay from 0.0001% to 1% of the launchpad token supply |
| Owner allowlist | Allowlist manager | Has an effect only while the registry owner turns the allowlist on |
| Registration fees | Registration fee treasury. This is the platform treasury `0x1cAa...1C90` | Receives no vault funds |
| Launch rules, payout address, identity and owner proposals | Launchpad owner | Cannot change the owner share, the URL or the tax of an existing token |

The registry owner also controls pauses. The registry rejects a renounce of ownership. Ownership moves in two steps: a proposal, then an acceptance.

Two more roles affect launchpads:

* The child Tax factory owner and creator admin keep the Tax suite powers over dividend receivers, holder exclusions and tracker asset recovery. These powers can affect future vault receipts from Tax tokens that a vault holds. They cannot move funds that are already inside a vault.
* The \$O launch factory creator admin can reassign the creator rights of a launchpad token. This role belongs to the \$O launch product. At the October 9, 2026 reads, `0x5519...044D` held it on both chains; the November 5 read shows `0x7bfb...BC41`.

See [Launchpad configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#launchpad-release-overview) for the current addresses and values.

## Current configuration

The human-readable values are listed in [Live configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md). Developers can use the [machine-readable production snapshot](https://docs.o1.exchange/launchpad/reference/production-deployments.json), review the chain-specific catalogs in [Stock-paired launches](https://docs.o1.exchange/launchpad/create/stock-paired-launches.md), and refresh changeable values from the route-selected active factory before preparing a transaction.

## Monad scope

Monad uses the same managed configuration and creator-rights model. Its Standard and Tax factories each share one factory across crypto and stock routes, and the restricted updater refreshes the wrapped xStock starting ticks. Its owner, creator admin and treasury use the [shared governance addresses](https://docs.o1.exchange/launchpad/reference/production-contracts.md#governance-and-fee-recipient). Read the factory's current configuration before preparing a launch.

## Arc scope

Arc uses the same governance methods and shared owner, creator-admin, treasury and updater configuration as the Standard suites on Base and Robinhood. Treasury changes apply to subsequent launch-fee payments and new pools; existing pool recipients and accrued claims remain unchanged. See [Arc configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#arc-mainnet) for current launch settings.

## BSC scope

BSC shares one managed factory across crypto and stock routes. Its owner and creator admin use the shared governance address; treasury and updater use the shared addresses as well. Read `owner()` and `creatorAdmin()` to determine current authority. Quote registration, suite selection and launch creation are separate controls. See [BSC configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#bsc-mainnet).

## X Layer scope

X Layer enables creation and uses the same [governance, creator-admin, treasury and updater addresses](https://docs.o1.exchange/launchpad/reference/production-contracts.md#governance-and-fee-recipient) as the other chains. Read the factory for current administrative authority. Supply, permanent liquidity, quote revisions and creator-rights behavior follow the same minimal suite. See [X Layer configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#x-layer-mainnet).

## Elysium scope

Elysium enables creation and uses the same [governance, creator-admin, treasury and updater addresses](https://docs.o1.exchange/launchpad/reference/production-contracts.md#governance-and-fee-recipient) as the other chains, with crypto-paired markets only. Read the factory for current administrative authority. Supply, permanent liquidity, quote revisions and creator-rights behavior follow the same minimal suite. See [Elysium configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#elysium-mainnet).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.