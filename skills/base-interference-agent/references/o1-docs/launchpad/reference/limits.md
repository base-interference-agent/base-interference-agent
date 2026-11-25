> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Limits and validation

> Current launch defaults, contract hard caps, form limits, fee limits, quote requirements, and staking limits.

The interface checks launch inputs before the wallet asks for a signature. The contracts enforce the hard caps again onchain.

Tax uses different fee units and validation. Read [Tax limits](#tax-suite-limits) below; the Standard BPS/component limits must not be applied to inclusive Tax inputs.

## Standard defaults

| Setting | Current value |
| - | -: |
| Supply | 1 billion (1,000,000,000) tokens |
| Liquidity ranges | 1 |
| Base swap fee | 1% |
| Starting total fee | Arc: 1%; Base/Robinhood/Monad/BSC/X Layer/Elysium: 99% |
| Anti-snipe period | Arc: none (0% surcharge); Base/Robinhood/Monad/BSC/X Layer/Elysium: 20 seconds |
| Base-fee split | 50% creator / 30% platform / 20% referrer |
| Creation fee | Base/Robinhood: 0.001 ETH; Monad: 100 MON; Arc: 2 native USDC; BSC: 0.003 BNB; X Layer: 0.02 OKB; Elysium: 0.025 HYPE |
| Launch supply placed in the pool | 100% |

## Standard contract hard caps

| Constraint | Hard limit |
| - | -: |
| Token supply | 1 million to 1 trillion tokens |
| Liquidity ranges | 1 to 10 |
| Base swap fee | At most 10% |
| Starting total fee | At most 99% |
| Fee components | At most 20, including exactly one creator, platform, and referrer component |
| Profile authority choice | Fixed profile or editable profile |
| Managed quote batch | At most 64 entries |
| Atomic launch-buy route data | At most 4,096 bytes |

The supply caps assume the launch token's standard 18 decimals.

## Standard fee and referral rules

* every configured fee component must be valid and all component bps must add up exactly to the base fee; the current configuration uses creator, platform, and referrer components;
* the starting total fee cannot be lower than the normal base fee;
* the anti-snipe period must be longer than zero;
* the platform fee receiver must be a valid address;
* the o1 interface and Public API reject the trader, original or current creator, current creator fee recipient, platform fee receiver, empty address, and protocol or execution dependencies as referrers;
* the hook independently rejects the empty address, the v4 executor, current creator, current creator fee recipient, hook, factory, fee escrow, and PoolManager; direct integrations must apply the broader product restrictions themselves;
* the unused referral share goes to the platform.

## Tax-suite limits

| Constraint | Rule |
| - | - |
| Percentage precision | Six decimal places: 1% is `1000000`; smallest step is 0.000001% |
| Derived rate denominator | `10^24`; distinct from percentage inputs and token units |
| Ordinary buy / sell totals | Owner-configured per-side bounds, currently 1% to 10% |
| Combined ordinary tax plus surcharge | At most 99% |
| Protocol | Percentage of selected tax with configurable absolute minimum/maximum; included in total |
| Remainder allocations | Creator + burn + dividend + integrator must equal 100% when either side has a remainder |
| No remainder on both sides | All allocations and selected dividend minimum must be zero; no Dividend clone |
| Dividend minimum holding | At least the factory floor and no more than supply; currently a 10,000-token floor |
| No eligible dividend shares | That trade's dividend portion is credited to the frozen protocol recipient |
| Small dividend amounts | Integer rounding may leave residue; it is not a future-holder allocation |
| Anti-sniping duration zero | Valid factory setting; creator opt-out launches remain valid, opt-in rejects |
| Dedicated Claim all helper | 1 to 64 distinct launched tokens; current profile page uses at most 20 positions |
| Dividend API preparation | 1 to 10 distinct token/holder positions, returned as independent steps |

If bounds permit exactly zero, that side has no ordinary fees even with a positive protocol floor. Positive totals below the floor reject. A zero allocation earns no rounding residue. Each configured minimum must be compatible with its maximum and protocol floor. Existing launches keep their frozen values after policy changes.

Tax retains the 18-decimal supply bounds, locked liquidity, 64-entry quote batches and 4,096-byte atomic route-data cap. It has no Standard fee-component list or financial referral fallback. See [exact Tax rules](https://docs.o1.exchange/launchpad/integration/tax-tokens.md#zero-and-boundary-rules) and the [dated policy](https://docs.o1.exchange/launchpad/reference/live-configuration.md#base-tax-suite).

## \$O launch limits

| Constraint | Rule |
| - | - |
| Chain / token | Base and Robinhood; fixed-supply 18-decimal ERC-20 launched tokens |
| Burn rates | Independently 0% through 99%; 1% is `1000000` with denominator `100000000` |
| Rate changes | New launches only; every pool retains its frozen rates |
| Creation fee / anti-sniping / allocations | None |
| Quote | Reviewed burn-compatible ERC-20; zero-address native quote is not accepted |
| Token supply / bands | 1 million to 1 trillion tokens; 1 to 10 liquidity bands |
| Quote-management batch | 1 to 64 sorted, distinct entries |
| Atomic route data | At most 4,096 bytes |
| Current ETH Dev Buy | Exact four-operation approved acquisition, vault and launch-pool path |
| Direct held-quote Dev Buy | One final launch-pool operation |
| Hook comment | Empty or exactly 32 bytes; no referral prefix |
| Swap amounts | Positive meaningful execution within signed `int128` bounds, including gross-up |
| Fills | Full requested execution required; no accepted partial Dev Buy or partial launch-pool swap |

Zero and rounded-zero burns still produce trades. A positive exact-output fee rounds up and can consume one raw unit on a dust-sized request. The valid percentage range does not guarantee sufficient inventory or output. See [burn mathematics](https://docs.o1.exchange/launchpad/integration/wsto.md#rate-units-and-swap-accounting).

## Creator-fee sharing limits

These limits apply to the optional [X-linked fee vault](https://docs.o1.exchange/launchpad/trading/share-creator-fees.md), not the Standard pool fee-component list or Tax's tax-allocation precision.

| Constraint | Rule |
| - | - |
| Paid recipients | 1 to 8 in total: one optional positive creator share plus X allocations |
| Total shares | Exactly 10,000 basis points (100%); 1 basis point is 0.01% |
| Creator wallet | Valid controller required, even at 0%; no additional fixed wallets |
| X allocations | Positive shares and unique, nonzero permanent X IDs; no post-launch edits |
| Zero creator share | Leaves up to 8 paid X slots; handover/scoped reassignment allowed, auction disallowed |
| Registry proof | At most 600 seconds under the contract; the service currently issues 300-second proofs |
| Identity representation | X IDs are unsigned integers; integrations must preserve them as strings or bigint, not JavaScript numbers |
| Account binding | One permanent payout account per X ID in that Registry; multiple X IDs may use one account |

Creator history is stored per account and does not consume new recipient slots. Fees use raw quote units and cumulative floor rounding. Full FeeEscrow redemption also remains subject to the underlying PoolManager's signed 128-bit settlement limit and available backing; large held-balance arithmetic does not remove that dependency limit.

## Token fields

| Field | Interface limit |
| - | - |
| Name | 50 characters |
| Symbol | 11 characters with no spaces; casing is preserved |
| Image | 2 MB; PNG, JPG, WEBP, or GIF |
| Website | Valid website URL |
| X | Valid X profile URL |
| Telegram | Valid Telegram link |
| Extra information | Non-empty keys with public values |
| Trade comment | 32 UTF-8 bytes |

## Creator profile fields

| Field | Interface limit |
| - | - |
| Display name | 40 characters |
| Bio | 180 characters |
| Avatar | 2 MB; PNG, JPG, WEBP, or GIF |
| Website | Valid website URL |
| X | Valid X profile URL |
| Telegram | Valid Telegram link |

Creator-profile changes use a wallet signature and affect the public o1 profile only. They do not change token permissions, balances, or liquidity.

## Quote requirements

Only quote currencies registered by o1 governance can be selected. Quote tokens must behave like standard ERC-20 tokens. Transfer-tax, rebasing, and other non-standard balance behavior is not supported because it can break pool and fee accounting.

The latest [quote verification](https://docs.o1.exchange/launchpad/reference/live-configuration.md#verification-history) covers both current Standard and Tax factories. Base lists 18 crypto quotes and [418 Stock Tokens](https://docs.o1.exchange/launchpad/create/stock-paired-launches.md#base-stock-token-catalog), with the stock catalog updated November 24, 2026; Robinhood has ETH, USDG and 194 Stock Tokens; BSC has BNB, USDC and 21 bStocks; X Layer has OKB, USDC, xETH and 45 wrapped stocks. Monad supports MON, USDC, WETH and 10 wrapped xStocks. Arc registers six-decimal ERC-20 USDC and eight-decimal cirBTC, with launch fees paid in 18-decimal native USDC. Elysium registers native HYPE and six-decimal USDC on both factories. Registration is separate from route liquidity and current availability. For X Layer atomic Dev Buy into a non-native quote, the attached adapter must advertise native-V3 support and an executable acquisition route must exist. See [route prerequisites](https://docs.o1.exchange/launchpad/integration/direct.md#x-layer-amounts-and-routing).

Every token from a current factory must have an address ending in `01`. A managed quote's opening frame must remain aligned with the active tick spacing. Price updates use per-quote revisions so stale writes fail.

## Staking vault limits

| Constraint | Staking limit |
| - | -: |
| Epoch duration | 1 to 365 days |
| Epoch count | 1 to 50,000 |
| Reward per epoch | Greater than zero and no more than the contract's `uint192` amount limit |
| Early-withdrawal penalty | 0% to 99.99% |
| Pre-deposit window | One epoch before the program starts |
| Protocol fee hard cap | 100% of the complete reward budget |

When early withdrawal is forbidden, the configured penalty must be zero. When it is allowed, a zero penalty provides a penalty-free early exit.

Each deposit creates a separate lot. The interface supports partial withdrawals, withdrawing from several lots together, and claiming multiple completed epochs together.

Staking accepts B20 and ERC-20 assets only when their balances change by the exact transferred amount. Fee-on-transfer, rebasing, reflection, and other non-standard balance behavior is unsupported. See the [staking guide](https://docs.o1.exchange/launchpad/staking/overview.md) for the complete lifecycle.

## Launchpad of Launchpads limits

| Constraint | Launchpad limit |
| - | - |
| Launchpad URL | 3 to 32 lowercase letters, numbers or single hyphens. Permanent. The registry refuses its 13 reserved words |
| Launchpad name | Same limit as the token name |
| One-line description | 160 characters |
| Launch guidelines for creators | 2,000 characters |
| Pinned tokens | 10 |
| Page sections | 20 |
| Questions in one section | 12. A question holds 160 characters, an answer 2,000 characters |
| Page content | 64 KB |
| Page text contrast | At least 4.5:1 against the background |
| Allowed paired assets for one launchpad | 64 |
| Allowlist or paired asset changes | Up to 200 addresses in each add or remove list of one transaction |
| Owner claim | Up to 100 currencies in one claim |
| Burn fund claim | 1 to 20 currencies in one burn |
| Burn amount for one launchpad | From 0.0001% to 1% of the launchpad token supply |
| Owner share | Inside the registry bounds, currently 0% to 100%. Fixed at registration |
| Launch rule tax ranges | Each value from 0% to 100%. At least one valid Tax token must fit the rules |

The Tax hook gives the vault launch check a fixed gas budget of 50,000. The vault check never reverts. If the check fails, the launch can complete without membership. See [How the launchpad accepts a token](https://docs.o1.exchange/launchpad/launchpads/launch-tokens.md#how-the-launchpad-accepts-a-token).

## Transaction checks

A launch stops when the selected paired asset or creation route is unavailable, the payment is wrong, creation is disabled, the address suffix is invalid, the transaction has expired, protected settings differ from the values the creator reviewed, or the pool cannot open with token-only liquidity.

Developers who need the exact encoded caps and field names can use [Functions and events](https://docs.o1.exchange/launchpad/reference/events-functions.md) and the [machine-readable production snapshot](https://docs.o1.exchange/launchpad/reference/production-deployments.json).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.