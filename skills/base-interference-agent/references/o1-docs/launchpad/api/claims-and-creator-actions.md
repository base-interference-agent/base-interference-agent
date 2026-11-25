> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Claims and creator actions

> Prepare fee claims, holder-authorized Dividend withdrawals, announcements and metadata updates.

## Fee claims

Fee claims use their own preparation route and do not need a `kind` field.

`POST /claims/fees/prepare` accepts 1 to 10 fee positions returned by `GET /wallets/{address}/fee-claims`:

```json theme={null}
{
  "chain_id": 8453,
  "caller": "0x1111111111111111111111111111111111111111",
  "claims": [
    {
      "recipient": "0x1111111111111111111111111111111111111111",
      "fee_escrow": "0x2222222222222222222222222222222222222222",
      "currency": "0x0000000000000000000000000000000000000000",
      "mode": "to_recipient"
    }
  ]
}
```

`recipient` is the wallet entitled to the fee balance. Use the position's `fee_escrow_address` as `fee_escrow` and `currency.address` as `currency`.

Fee claim modes:

* `to_recipient` calls `FeeEscrow.claimFor(recipient, currency)` on a current fee contract or the equivalent function on an earlier launch's recorded fee contract, and always pays the recorded recipient
* `redirect` calls `FeeEscrow.claimTo(currency, destination)` and requires the caller to be the recorded recipient

The API verifies that the fee contract belongs to a recognized launch deployment and reads live `owed` state. It never lets one caller redirect another recipient's balance.

Standard creator/platform/referrer balances and Tax creator/protocol/integrator balances use this endpoint. Holder Dividends use their separate endpoint below. For a referral balance, use the referrer's address as `recipient`, then either pay that address directly or let that same wallet authorize a redirect.

The wallet route defaults to claimable positions and supports cursor pagination. Each preparation batch uses one chain and caller, rejects duplicate positions before RPC work, and simulates every returned transaction independently. `review.claims` records the exact live claimable amount and linked step ID. The steps are independent, not atomic, and each receives Base builder attribution when applicable. Claim preparation costs 3 weighted units per position, so a 10-position batch costs 30 units.

On Arc, use each returned claim position's exact currency address and raw amount. ERC-20 USDC claims have six decimals; native USDC amounts have 18. Sharing a wallet balance does not merge separate escrow claim positions. Submit the prepared claim unchanged; claiming does not require an additional USDC payment.

## Dividend actions

Use `GET /wallets/{address}/dividends?chain_id=8453` to discover indexed positions. For supported fee-accrual tokens, `POST /claims/dividends/prepare` accepts 1 to 10 distinct token/holder positions with `operation: "claim"`:

```json theme={null}
{
  "chain_id": 8453,
  "caller": "0x1111111111111111111111111111111111111111",
  "claims": [
    {
      "token_address": "0x2222222222222222222222222222222222222201",
      "holder": "0x1111111111111111111111111111111111111111",
      "operation": "claim",
      "unwrap_native": true
    }
  ]
}
```

Trading already assigns these rewards. The current Tax contracts have no separate distribution transaction. The request schema retains `distribute` and `distribute-and-claim` for compatibility, but the current implementation rejects both with `422 unsupported_operation` before preparing calldata. Use `claim`.

The caller must be the wallet entitled to the rewards, including a smart wallet. It need not still hold the tokens. The recorded receiver remains the payout destination; changing `holder` cannot authorize a claim for someone else.

`unwrap_native` is required. For a wrapped-native reward token, `true` requests native currency and `false` requests the wrapped token. The app defaults to the chain native currency (ETH, BNB, MON or OKB) for native pairs and preserves ERC-20 rewards. Monad WETH is distinct from WMON and remains WETH. On Arc, both unwrap preferences pay the fixed ERC-20 reward token: USDC uses six decimals and cirBTC uses eight. No wrapping or native payout conversion occurs. Other reward currencies are unchanged. Claims require no ERC-20 or Permit2 approval.

Preparation verifies the registered clone, holder, receiver and current earnings, then simulates the exact withdrawal. A backing deficit alone does not prove that a particular claim will fail; available backing alone does not guarantee payment. Read the simulation result and confirm actual payment from the transaction receipt.

Fee-accrual responses distinguish earned rewards from escrow funding. `pending_funding_raw` backs already-assigned rewards; it is not a pending distribution or the holder's payment. `available_reward_backing_raw`, `required_reward_backing_raw` and `backing_deficit_raw` describe contract backing. `withdrawable_before_raw` and `simulated_holder_paid` describe this claim before submission. Historical allocation fields must not be reinterpreted as funding.

The API returns **independent transaction steps** (`review.atomic: false`). Each may succeed or fail separately. The app's dedicated cross-token helper is a different [atomic Claim all flow](https://docs.o1.exchange/launchpad/integration/tax-tokens.md#dividends-and-batching). Never submit holder withdrawals through generic Multicall3.

Use the chain's exact Tax deployment from the [support matrix](https://docs.o1.exchange/launchpad/api/introduction.md#chain-and-product-support), and verify it appears in the deployed API configuration. Resolve each token by its originating suite and chain for discovery and preparation. Index-only historical Tax deployments are not public preparation targets; Arc Tax uses its own registered clone and fixed helper.

For burn redemption, the ordinary fee endpoint can prepare `to_recipient` using the suite escrow, the dead address as recipient and the launched token as currency. It pays no caller reward and cannot redirect that entry. See [Token burns](https://docs.o1.exchange/launchpad/tax/burns.md).

## Creator announcements

```http theme={null}
POST /tokens/{chain_id}/{token_address}/announcements/prepare
```

The API resolves the exact contracts recorded for the token. For launches from any current factory it verifies `currentCreatorOf(token)` through the factory plus `isTokenRegistered(token)` through the registry, then builds `postAnnouncement`. Earlier launch contracts use their original `creatorOf` and `post` surface.

Descriptions must be non-empty and are limited to 1000 UTF-8 bytes. The URI is optional; non-empty values use `https://`, `ipfs://`, or `ar://`.

## Token metadata

On-chain name, symbol, and extra-metadata updates use:

```http theme={null}
POST /tokens/{chain_id}/{token_address}/metadata/onchain/prepare
```

Supported operations:

* `update_name`
* `update_symbol`
* `update_extra_metadata`

These operations perform live authority checks and simulation but do not upload content to IPFS. They cost 3 units.

Description, image, and public-link updates use the dedicated idempotent metadata-document route:

```http theme={null}
POST /tokens/{chain_id}/{token_address}/metadata/document/prepare
Idempotency-Key: unique-request-key
```

Its body contains `actor` and `document` directly; there is no `operation` field:

```json theme={null}
{
  "actor": "0x1111111111111111111111111111111111111111",
  "document": {
    "description": "Updated token description",
    "website": "https://example.com",
    "x": "https://x.com/example",
    "telegram": "https://t.me/example",
    "image_uri": "ipfs://bafy..."
  }
}
```

Document preparation is a partial update. Omitted description and link fields preserve their current values; an explicit empty string or `null` clears a link. Omitting both image fields preserves the current effective image. `image_uri` must be a non-empty `ipfs://` URI; use it to select an existing IPFS image, or supply `image_base64` and `image_type` together to upload a replacement.

Each document update creates one metadata JSON object, plus one image object only when new image bytes are supplied.

Descriptions are limited to 2000 UTF-8 bytes. A replacement image follows the same MIME validation and 2 MB decoded-size limit as launch creation. Extra-metadata keys are 1 to 64 characters and values are at most 512 characters.

For launches from any current factory, the API verifies the caller's creator rights through the factory and prepares its typed metadata-forwarding function. Earlier Base B20 and Robinhood ERC-20 contracts use their original metadata-authority model. The API does not expose token minting, supply-burning, pause, operator, rebase, ownership or governance operations. Redeeming existing burn escrow credits is a separate fixed-recipient claim.

The API selects the correct B20 or ERC-20 token interface for the launch's originating suite and simulates the requested operation. Unsupported earlier contracts fail with `unsupported_operation` instead of guessing. A Base B20 name update returns an `eip712_domain_changes` warning because the token's EIP-712 domain follows its name.

Every creator-action response includes RFC3339 preparation and expiry times, the observed chain block, a normalized operation review, and simulation state. Metadata-document preparation requires `Idempotency-Key`; an expired replay returns `409 stale_plan` and must be prepared with a new key. It also returns `409 stale_plan` when the live contract URI is newer than the indexed document, so the API never builds an update from stale metadata. Wait for indexing, then prepare again.

The earlier `/metadata/prepare` and `/metadata/profile/prepare` forms remain available during migration and return deprecation headers. New integrations should use the focused on-chain or document route.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.