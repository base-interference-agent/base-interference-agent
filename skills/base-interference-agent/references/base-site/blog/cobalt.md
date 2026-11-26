# blog/cobalt

Source: https://www.base.org/blog/cobalt.md

# Introducing Base Cobalt

> tl;dr Base’s third upgrade, Cobalt, is now live on mainnet. Cobalt gives users greater control over their transactions with Validity Transactions and continues to establish Base…

- Date: 2026-09-30
- Author: Base Engineering Team
- URL: https://www.base.org/blog/cobalt

Base’s north star is to bring the world onchain, starting with trading, financing, and payments. Cobalt improves and simplifies asset issuance and gives advanced traders greater control over the conditions and timing for eligible transaction inclusion on Base.

## What's in Cobalt?

Cobalt delivers two primary changes:

1. **Validity Transactions:** provides users with more control over their transactions
2. **B20 enhancements:** builds on our native token standard

---

## Validity Transactions

![](https://www.base.org/images/blog/cobalt/01.webp)

Validity Transactions on Base give users the ability to submit time-bound transactions that remain dormant until user-specified criteria are met.

Users submit one signed transaction via `base_sendRawTransactionValidity` with a set of validity criteria, which ensures that the transaction is excluded until all criteria are met. The API is neutral infrastructure that provides advanced traders with the added benefit of keeping their submissions private until they land.

![](https://www.base.org/images/blog/cobalt/02.webp)

**Example breakdown**

1. The trader signs the swap and sends it to Base right away through `base_sendRawTransactionValidity`, attaching two conditions: a condition on the pool’s onchain state (price ≥ 4,000 USDC) and a block number bound (\< 1,157,000). Both must hold.
2. Base holds the transaction and evaluates the conditions against chain state as each new block is built. While the price sits at 3,950 USDC, the transaction is simply not eligible. The trader does not need to poll or resend.
3. When the price reaches 4,011 USDC, the price condition is met.
4. The transaction is included in block 1,156,990 at a pool price of 4,012 USDC. Both conditions are satisfied at inclusion.
5. If block 1,157,000 had arrived first, the transaction would never have been included.

**Note:** The trader chooses and signs the transaction and specifies both conditions; Base does not choose the swap or set those conditions on the trader’s behalf.

**Code example**

**Use case:** Submit a transaction that will only execute in the first flashblock of a specific block:

```
{
 "method": "base_sendRawTransactionValidity",
 "params": [
 "0x123..." // Signed transaction
 {
 "validity": [
 {
 "type": "block_number",
 "params": {
 "op": "=",
 "value": "0x12345"
 },
 "type": "flashblock_index",
 "params": {
 "op": "=",
 "value": "1"
 }
 }
 ],
 }
 ]
}
```

You can learn more about validity transactions, including construction, fees, ordering and lifecycle in our [docs](https://docs.base.org/specifications/build-transaction/validity-transactions?utm_source=base_dot_org). For an interactive experience, we have two demos live on [Vibenet](https://chain.base.org/vibenet/demos/validity).

---

## B20 enhancements

![](https://www.base.org/images/blog/cobalt/03.webp)

Cobalt both simplifies and improves the B20 token standard as we continue to establish Base as first-class issuance infrastructure. All existing integrations keep working, and three additions are now live.

### Composite Policies

Issuers can now combine existing allowlists and blocklists with OR or AND logic using [Composite Policies](https://docs.base.org/base-chain/specs/reference/b20/changelog/02-cobalt-policyregistry-composite-policy?utm_source=base_dot_org). This makes it possible to reuse live policies, such as KYC allowlists and sanctions blocklists, without copying member lists or maintaining offchain synchronization.

![](https://www.base.org/images/blog/cobalt/04.webp)

**Example breakdown**

1. A KYC provider keeps a KYC policy, and the fund keeps its own accreditation policy. Alex is listed on both.
2. The fund’s token uses a composite transfer policy: KYC AND accreditation. Each check is read from its source policy at transfer time.
3. A transfer of 500 fund shares to Alex passes both checks and settles. If either provider removes Alex, the next transfer to him fails, with no merged list to update.

**Note:** The fund chooses the token’s transfer policy, and each policy provider manages its own list; Base does not decide who qualifies or approve individual transfers

### Schedule Multiplier Updates

[Schedule Multiplier Updates](https://docs.base.org/base-chain/specs/reference/b20/changelog/02-cobalt-b20asset-multiplier?utm_source=base_dot_org) aligns the B20 Asset multiplier with the ERC-8056 standard and adds support for scheduling multiplier changes for corporate actions, such as splits. Existing Beryl integrations will continue to work, while new integrations can adopt the updated standard over time. Multiplier changes affect the displayed or UI-denominated view of an asset; raw balances and transfer behavior are unchanged.

![](https://www.base.org/images/blog/cobalt/05.webp)

**Example breakdown**

1. The issuer schedules a new multiplier of 2× to go live on Oct 1 at 00:00 UTC. It is set ahead of time and can be canceled until it goes live.
2. At the scheduled time the update applies and the token’s multiplier becomes 2×. Nothing is minted and nothing is burned.
3. Alex’s raw balance is still 100. Wallets and apps that read the multiplier now show 200 shares, and transfers work the same as before.

### seizeWithMemo

Cobalt adds a new [seizeWithMemo](https://docs.base.org/base-chain/specs/reference/b20/changelog/02-cobalt-b20-seize?utm_source=base_dot_org) function to the shared B20 Asset and Stablecoin surface. This lets authorized administrators reassign a holder’s balance as a transfer with an onchain memo. Please note that seize must be enabled on a token for this feature to work.

![](https://www.base.org/images/blog/cobalt/06.webp)

**Example breakdown**

1. Sam’s account is frozen, and the token has seize enabled.
2. An administer authorized by the token issuer calls `seizeWithMemo` with the source (Sam), destination (a recovery wallet), amount (500 shares) and a memo such as “Recovery · ticket #1142”. The issuer controls whether seizure is enabled and who is authorized to use it; Base does not initiate or direct this transfer.
3. The balance moves in one transfer. The onchain record shows who it moved from, where it went, how much and the memo.

---

## How Cobalt impacts you

### Advanced Traders

Validity transactions provide a [set of configurable conditions](https://docs.base.org/specifications/build-transaction/predicates-and-safety?utm_source=base_dot_org) to allow for more control over the criteria and timing for eligible transaction inclusion on Base.

### Indexers

Indexers will need to update to the new [ABI](https://docs.base.org/specifications/b20/reference/interfaces?utm_source=base_dot_org#available-interfaces) for the hardfork.

### Issuers

Asset Issuers should refer to the new [best practices section of the B20 standard](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token?utm_source=base_dot_org) for guides on common flows.

## What's next

Over the coming months, Base plans to launch:

- **200ms blocks:** Reduces block times from 2s to 200ms, while maintaining the same reorg [guarantees](https://docs.base.org/base-chain/network-information/transaction-finality?utm_source=base_dot_org#what-is-transaction-finality) as today’s 2s blocks
- **Base Transactions**: Makes smart accounts first-class at the protocol level, bringing gas sponsorship and transaction batching without extra contracts
- **DevX improvements**: Updates Base to support a subset of EVM improvements in Glamsterdam

If there's something we can do better, we want to hear it. Reach us on [X](https://x.com/buildonbase), [Discord](https://discord.com/invite/buildonbase), or [GitHub](https://github.com/base/base/issues).

---

_Disclaimer: Base is open-source, permissionless blockchain infrastructure. Base provides neutral protocol infrastructure only and does not control the persons, applications, or assets that use it. B20 tokens are deployed, configured, and administered solely by their respective issuers; issuer-controlled features such as minting, burning, freezing, and seizure are exercised at the issuer's sole discretion. References to third-party issuers or assets are informational and not an endorsement. Except with respect to assets that Coinbase or its affiliates expressly issue (which are offered only in eligible jurisdictions and governed by their own terms and disclosures), Coinbase, including Base, is not the issuer, investment adviser, broker, dealer, underwriter, promoter, distributor, or transfer agent for any B20 token or transaction, and nothing here is investment advice or a recommendation to buy or sell any digital asset. Forward-looking statements about future upgrades, features, or performance are subject to change and are not commitments to deliver._

_Illustrative examples are hypothetical and are provided solely to demonstrate potential use cases for new functionality. They are not exhaustive and do not constitute a recommendation, solicitation, or representation that any particular use case, strategy, application, asset or outcome will be available, suitable, profitable or successful._
