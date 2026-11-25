> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Security and audit

> Launchpad audit reports, production safety properties, stock-paired route boundaries, governance controls, and verification guidance.

o1 Launchpad is designed around fixed token supply, token-only opening liquidity, permanent Uniswap v4 liquidity, and transparent fee accounting.

## Standard launch audits

> [card] [XORS Base Launchpad v4 audit](https://drive.google.com/file/d/1NzrSsWtO1K2ZnRrNUiblRw3_52NWXmLr/view?usp=sharing)
>
> Review of the Base Standard launch contracts dated August 28, 2026.

> [card] [XORS Monad Launchpad v4 audit](https://drive.google.com/file/d/1_iyThz46jzhE4fxIOIHLjQri69Dwm-kE/view?usp=sharing)
>
> Review of the Monad launch contracts dated September 8, 2026.

> [card] [XORS Arc Launchpad v4 audit](https://drive.google.com/file/d/1Z-M171X5GqACiPoXkh7fSdbkNu0Bf_AJ/view?usp=sharing)
>
> Review of the Arc launch contracts dated September 12, 2026.

> [card] [XORS BSC Launchpad v4 audit](https://drive.google.com/file/d/1NLcIa26pwnxQRwzn0xt4wZu1EKHHXEu2/view?usp=sharing)
>
> Review of the BSC launch contracts dated September 16, 2026.

> [card] [XORS X Layer Launchpad v4 audit](https://drive.google.com/file/d/1vPERW4zLunzJUKKmPA7ZYQtyb50WX1I2/view?usp=sharing)
>
> Review of the X Layer launch contracts dated September 17, 2026.

The Elysium Standard suite uses the same contract code as the BSC and X Layer Standard suites, and the Elysium Tax suite uses the same code as the X Layer Tax suite. Its Dev Buy adapters use the X Layer SwapX adapter logic. See [Elysium contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#elysium-mainnet).

## Tax token audits

> [card] [ExVul Base Tax audit](https://drive.google.com/file/d/1edYOKCaIlGpwiU5kDaUEOCYZbe1Wie7K/view?usp=sharing)
>
> Review of the Base Tax contracts, including trading rewards and dividend claims, dated September 25, 2026.

> [card] [XORS Base Tax audit](https://drive.google.com/file/d/1o06_W0OT_5U_3V96P3bidH68BNK9HgLB/view?usp=sharing)
>
> Review of the earlier Base Tax and dividend claim contracts dated September 22, 2026.

## \$O launch audit

> [card] [XORS wstO burn-suite audit](https://drive.google.com/file/d/12jd22TgBGsjThOxC_No3mFyfSa0y0EeY/view?usp=sharing)
>
> Review of the Base \$O launch contracts, immediate quote burns and settlement reserve dated October 5, 2026.

The report covers the reviewed suite version and its original direct-wstO adapter specialization. The Base and Robinhood ETH-funded Dev Buy adapters, including Robinhood's mixed-v3/v4 acquisition adapter, shared SwapX routers and application are outside that scope. The report refers to a separate vault review; it is not a combined audit of every dependency. See the report for its findings and [\$O launch security boundaries](#wsto-suite-boundaries) for the integration risks.

## Launchpad of Launchpads audits

> [card] [XORS Launchpad of Launchpads audit](https://drive.google.com/file/d/131xb9rVhV3ZOGvcL3FCG2wyuj0sr3miq/view?usp=sharing)
>
> Review of the launchpad registry, vault and launch policy dated October 7, 2026.

> [card] [XORS Launchpad of Launchpads delta audit](https://drive.google.com/file/d/1jEYyfkt0dWO90O2o_vb7M_eE_3ZiERsT/view?usp=sharing)
>
> Review of the current registry revision and its Base deployment dated October 8, 2026.

The Robinhood launchpad registry uses the same pad and Tax contract source as the reviewed commit `a276a30`. The Robinhood deployment itself is outside these reviews.

## X-linked fee-vault audit

> [card] [XORS X-linked fee-vault audit](https://drive.google.com/file/d/1YPIpYxfwj23YhFUhOePf2PTcfYt_MLhP/view?usp=sharing)
>
> Review of the X recipient Registry, Vault Factory and fee-vault contracts, including their V4 and Tax integration boundaries, dated October 16, 2026.

The report covers the three Base fee-sharing contracts and their integration with Standard and Tax launches. It records **two open informational findings and no findings of higher severity**, concerning test reproducibility and administrative/verifier key management.

This is a contract audit, not a review of the entire website, X-verification service or OTC marketplace. Read the report for the exact scope, findings and recommendations.

## Staking and vesting audits

> [card] [XORS staking audit](https://drive.google.com/file/d/1pdDRX7li25hLv4BBZ9_EIL_3gDEGF1Mg/view?usp=sharing)
>
> Review of the Base and Robinhood staking contracts dated September 8, 2026.

> [card] [XORS vesting audit](https://drive.google.com/file/d/196zZf6ieXra7x8wVQjD90qGI6lahf42a/view?usp=sharing)
>
> Review of the vesting contract dated September 8, 2026.

## Audit results

Each report covers the contract version reviewed at the time and includes its findings and resolution status. See [Production contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md) for deployed addresses. Chain-specific additions, including `ArcTaxDividend` and adapter specializations, are not automatically covered by an earlier Base report. Published source and local route tests do not constitute an independent audit of those additions.

## Historical reports

These reports cover earlier contract versions and remain available for reference.

> [card] [XORS Launchpad audit](https://drive.google.com/file/d/104NoIbswNWIcOe_HDhJqlB39LB5ZKqvZ/view?usp=sharing)
>
> Independent review of the earlier Launchpad contracts dated June 29, 2026.

> [card] [XORS staking audit](https://drive.google.com/file/d/1ZYWZzXEkT-CC-THYEf_7UCgnmp9pbzYS/view?usp=sharing)
>
> Independent review of the earlier staking contracts dated August 10, 2026.

## Core safety properties

* launch tokens have fixed supply and no mint, pause, upgrade, or balance-seizure authority;
* opening liquidity uses launch tokens only, requires no creator paired-asset deposit, and stays in a hook-owned position that cannot be removed;
* Standard and Tax recipient fee balances are backed by Uniswap v4 claims until withdrawn; \$O launch quote fees instead undergo an actual supply burn during the swap;
* creator rights are project-side authority only: they cover rights transfers, announcements and optional profile editing, plus future creator-fee routing on Standard/Tax, but never minting, balance control, upgrades or liquidity custody;
* the configured creator admin can immediately reassign creator rights and, on Standard/Tax, future creator-fee routing, but cannot seize launch-token wallet balances or remove launch liquidity; Tax Dividend administration has the separate recovery powers described below;
* a pending launch stops if a protected global setting changes before it confirms; paired-asset opening-price refreshes intentionally use the latest registered frame;
* private keys and transaction signing remain in the user's wallet.

## X-linked fee-vault boundaries

[Share creator fees](https://docs.o1.exchange/launchpad/trading/share-creator-fees.md) is an optional new-launch feature. It splits only the creator's fee income; ordinary trading, permanent liquidity, Tax dividends and the other fee recipients retain their own rules.

* **Fixed allocations:** one creator position and X IDs share 100% across at most eight positive allocations. X IDs and percentages cannot be edited. A creator handover preserves earlier unpaid credit and leaves X shares unchanged.
* **Permanent identity binding:** the Registry accepts a short-lived, domain-bound verifier proof submitted by the named payout account. Nonces, expiry and verifier epochs prevent reuse. A username or public profile lookup is not ownership proof. The backend verifies X login and account authorization; the contract cannot verify X OAuth itself.
* **Key trust:** a compromised verifier can permanently misbind an unregistered X ID. The Registry owner can rotate that verifier. Neither role can overwrite an existing binding. Securing those keys and the verification service is essential; an audit does not remove that trust.
* **Separate controls:** administrators can stop new X registrations, fee-sharing launches or marketplace participation independently. These controls do not pause existing fee claims.
* **Accounting:** held quote, outstanding escrow credit and prior payouts form one cumulative income ledger. Escrow redemption is not new income. Launch funding and transient Tax holder dividends are kept separate. Failed payouts revert their accounting updates.
* **Asset limits:** exact transfers and stable token balances are assumed. Rebasing, transfer-tax behavior, issuer freezes, unavailable settlement or insufficient backing can prevent payment. Unsupported assets have no rescue function, and rounding dust has no privileged withdrawal.
* **Administration:** Registry/coordinator owners cannot edit allocations or sweep vault funds. Existing Factory administrators can still override creator rights or divert future fee routing. Historical balances remain governed by the vault's claim accounting; future accrual cannot be guaranteed against those existing powers.
* **Marketplace scope:** a compatible auction moves only the internal creator position. Runtime hashes do not prove honest bidding, refund solvency or immutable behavior behind a proxy. Marketplace admission and exact seller approval are separate security requirements.
* **Account control:** revoking Bot permission or disconnecting X does not remove a confirmed binding. Losing all control of the receiving account can strand fees. A Smart Account's recovery and permissions remain separate from the Registry's permanent address link.

See [contract addresses](https://docs.o1.exchange/launchpad/reference/production-contracts.md#base-x-linked-fee-vaults) and [governance roles](https://docs.o1.exchange/launchpad/architecture/deployment-governance.md#x-linked-fee-vault-controls). A published audit is scoped evidence, not a guarantee of safety or availability on every chain.

## Managed paired-asset safety boundaries

The Standard/Tax managed factories used by crypto-paired and stock-paired creation preserve their immutable token, single-sided seed, permanent lock, fee escrow and announcement boundaries. Their managed controls include:

* a paired-asset registry; within each supported product, one factory and hook can serve both crypto-paired and stock-paired creation while each launch freezes its exact asset and market configuration;
* per-quote revisions so an older paired-asset opening-price update cannot overwrite a newer one;
* a restricted updater that can change only future opening-price frames;
* a 64-item batch limit for quote-management operations;
* an `01` address-suffix requirement for every launch through a current launch factory;
* a creation switch that affects all new launches through that factory, across its supported creation routes, and does not pause existing markets.

The paired Stock Tokens are external onchain assets. Their issuer, transfer behavior, availability, and market value are separate from the launch token and the o1 liquidity lock.

The optional atomic Dev Buy has an additional adapter boundary. Only the configured launch hook may call it. The adapter validates the funding asset, connected route, permitted external venues, exact final launch pool and hook, four-hop maximum, protected minimum output, and unchanged unexpected route-asset and native-currency balances in the adapter and SwapX router. Base, Robinhood and Monad use chain-specific venue configuration, so a route supported on one chain is not automatically valid on another. A failed adapter check reverts the launch and buy together.

## Governance boundary

Economic defaults apply to future launches. Existing Tax Dividend clones additionally retain their explicit exclusion, receiver and asset-recovery administration. A completed launch keeps its token supply, pool, trading rates, fixed fee recipients and permanent liquidity. The current creator-fee recipient is the documented exception for future creator credits. See [Configuration and governance](https://docs.o1.exchange/launchpad/architecture/deployment-governance.md) for the complete boundary.

Governance role assignments and the platform fee receiver are listed in [Production contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#governance-and-fee-recipient).

## Tax-suite boundaries

* **Pool-scoped taxes:** only swaps through the Tax Hook collect these fees. Ordinary transfers and unrelated pools are outside that collection mechanism.
* **Reward timing:** trading rewards are assigned at the Hook's fee-accounting checkpoint, so later buyers cannot claim an earlier trading backlog. Eligibility still follows actual transfer ordering; there is no holding-duration requirement. Voluntary `depositDividends` contributions reward balances eligible at execution and retain their timing exposure.
* **No eligible holders:** that trade's dividend portion goes to the frozen protocol recipient. A high or unreachable minimum, burns or excluded custody balances can keep eligibility at zero. There is no later-holder allocation or automatic reduction of the threshold.
* **Pool-held tokens:** the launch PoolManager, mandatory system addresses and configured custody addresses are excluded from dividends. Other pools may still qualify until explicitly excluded. Holding tokens through a pool or custodian is different from holding them in your own wallet.
* **Claim authority:** dividend claims require the entitled wallet. Direct FeeEscrow claims and burns can be started by another person, but still pay their recorded destination. X-fee vault claims require the recorded beneficiary account.
* **Administrative trust:** the factory owner/creator admin can alter Dividend exclusions and receivers and recover assets, including unpaid reward backing. Entitlements remain recorded, but exclusion or insufficient backing can block payment. Falling below the minimum holding alone does not prevent claiming previously earned rewards.
* **Claim limits:** fee claims withdraw a recipient's complete balance for that asset. Exceptionally large balances can exceed the underlying settlement limit; partial claims are not supported.
* **External dependencies:** quote-token behavior, router permissions and upgrades, stock-token runtime support, live liquidity and custody systems remain deployment-specific. A quoted or tested route does not prove universal compatibility.

See [Holder dividends](https://docs.o1.exchange/launchpad/tax/dividends.md) and [Tax contract integration](https://docs.o1.exchange/launchpad/integration/tax-tokens.md) before building reward or custody integrations.

## \$O launch security boundaries

* **Actual quote burn:** the Hook burns only quote tokens it holds and verifies the exact supply reduction. It has no authority to burn arbitrary holders' balances. The launched token's fixed supply is unchanged.
* **Pool scope:** ordinary transfers and unrelated pools do not pay the burn. There are no fee claims, dividends, referral allocations or deferred burn balances.
* **Settlement inventory:** an immediate burn needs physical quote tokens in PoolManager before router settlement. An insufficient balance reverts the trade; reserve claims alone do not prove available inventory or route capacity.
* **Reserve authority:** the current Factory owner can withdraw the reserve's entire own claim balance. There is no minimum buffer enforced by contract. This cannot remove the locked launch position, but it can affect swap availability.
* **External trust:** the quote vault's backing, deposit controls and governance, plus the shared upgradeable router's implementation and permissions, require separate review. Registration is not proof that an arbitrary token has a safe burn implementation.
* **Execution and rounding:** full fills, positive output, signed amount bounds, route-specific minimums and deadlines remain required. High rates and dust can make a validly configured trade unexecutable. Extra reserve funding does not solve external AMM liquidity shortages.
* **Economic limits:** burning wstO leaves \$O backing in the vault and can increase backing per share. It does not destroy \$O or guarantee a higher USD price. Immediate deposits and redemptions also mean holding duration is not a protection against traders entering around a large burn.
* **Independent scopes:** the [wstO burn-suite report](#wsto-burn-suite-audit) covers its reviewed suite version, not the Base or Robinhood ETH-funded Dev Buy adapters, shared routers, bridge or application. The vault has a separate review scope. Standard, Tax and staking reports do not extend to this suite; verified source or successful simulation is not an audit certification.

See [\$O launch integration](https://docs.o1.exchange/launchpad/integration/wsto.md) for custody, event attribution and exact funding rules.

## Launchpad of Launchpads boundaries

* **Vault funds:** no role can move funds out of a vault. The owner share leaves only to the payout address. The burn fund leaves only through a burn of launchpad tokens.
* **Pauses:** registry pauses have no expiry. They stop new launchpads and new token launches only. They never stop trades, owner withdrawals or burn claims.
* **Membership:** a token is a member only when the hook recorded the acceptance of a vault of the same registry. A vault that gives no answer lets the launch complete without membership. The named integrator alone gives no membership.
* **Sales:** the launchpad and the creator rights of its token move separately. The contracts hold no payment. The buyer must pay after both acceptances.
* **Owner credits at a handover:** after the acceptance, the payout address of the new owner receives the unclaimed owner share.
* **Uniqueness:** URLs and launchpad tokens are unique inside one registry only.
* **Currency behavior:** a vault balance below its records, for example after an issuer seizure, blocks a split or a burn claim in that currency. An owner withdrawal can still succeed when the balance covers the recorded owner share. A failed call also reverts a batch that contains it.
* **Roles:** the shared governance owner `0x7bfb...BC41` holds the registry and child factory owner roles (read November 5, 2026). The snapshots give no evidence that any role address is a multisig or a timelock. See [Configuration and governance](https://docs.o1.exchange/launchpad/architecture/deployment-governance.md#launchpad-roles).

## What users and integrators should verify

* use the current factory and contract addresses for the selected chain;
* confirm the wallet is connected to the intended chain;
* review current supply, paired asset, market type, opening value, creation fee, swap fee currency, and fee split;
* inspect holders, pool liquidity, and a current sell quote before trading;
* review the chain, contract, amounts, and wallet transaction details before signing.

To report a potential issue, follow the [o1 Exchange bug bounty guidance](https://docs.o1.exchange/community/bug-bounty.md).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.