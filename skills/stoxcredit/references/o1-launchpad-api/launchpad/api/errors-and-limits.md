> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Errors, rate limits, and retries

> Handle problem responses, weighted quotas, cursors, idempotency, and safe retries.

## Problem responses

Errors use `application/problem+json`:

```json theme={null}
{
  "type": "https://docs.o1.exchange/launchpad/api/errors-and-limits#stale-plan",
  "title": "Transaction plan is stale",
  "status": 409,
  "code": "stale_plan",
  "detail": "The transaction plan expired. Prepare it again.",
  "action": "Prepare a new transaction plan before signing or broadcasting.",
  "instance": "urn:o1:request:req_...",
  "request_id": "req_..."
}
```

`type` links to the exact code section on this page. `code` is the stable value for program logic, `detail` explains this occurrence, `action` gives the safe next step, and `request_id` identifies the request for support. Validation problems can also include `invalid_parameters`. Resource errors can include `resource`, `chain_id`, `token_address`, and `suggested_endpoint`. Balance errors can include `asset`, `actual_raw`, and `required_raw`.

Raw RPC errors, stack traces, internal IDs, provider bodies, and secrets are never returned. Treat `detail` and `action` as human-readable text that may improve over time. Branch only on `status` and `code`.

## Problem code reference

### Request validation

* `invalid_request` (`400` or `413`): the request, JSON transport, or body size is invalid. Correct the request using `detail`, then send it again.

- `unknown_parameter` (`400`): one or more fields are not supported. Remove the fields listed in `invalid_parameters`.

* `duplicate_parameter` (`400`): a query parameter was supplied more than once. Supply it once.

- `incompatible_parameters` (`400`): individually valid parameters cannot be used together. Follow `invalid_parameters` and `suggested_endpoint` when present.

* `invalid_parameter` (`400`): one or more fields have invalid values or formats. Correct the fields listed in `invalid_parameters`.

- `missing_idempotency_key` (`400`): an operation that can create off-chain work needs `Idempotency-Key`. Send a new random UUID.

* `invalid_idempotency_key` (`400`): the retry ID is empty or too long. Send 1 to 255 characters.

### Authentication and authorization

* `missing_api_key` (`401`): `x-api-key` is absent. Send an active API key in that header.

- `invalid_api_key` (`401`): the key is malformed, inactive, revoked, expired, or does not verify. Use an active key or create a replacement.

* `origin_not_allowed` (`403`): the browser origin is not allowed by the key. Use an allowed origin or update the key's origin restrictions.

- `insufficient_scope` (`403`): the key lacks the scope named in `detail`. Use a key with that scope.

* `wallet_not_authorized` (`403`): the wallet does not own the required role, quote, claim, or resource. Use the authorized wallet.

### Resources and current state

* `not_found` (`404`): the tracked resource or API operation does not exist. Verify the chain and identifier, use `suggested_endpoint` when present, and do not continuously retry an unchanged `404`.

- `stale_plan` (`409`): a transaction plan expired or its chain configuration changed. Prepare a new plan before signing or broadcasting.

* `stale_quote` (`409`): the quote expired or current execution state moved outside its reviewed limits. Request and review a fresh quote.

- `salt_unavailable` (`409`): the prepared launch salt is already used. Prepare the launch again for a new salt and token address.

* `invalid_permit` (`409`): Permit2 state changed or the signature no longer matches. Request a fresh quote, sign its current data, and prepare again.

- `approval_not_confirmed` (`409`): the required token approval is not confirmed on-chain. Confirm it, then prepare again.

* `announcement_id_conflict` (`409`): the generated announcement identifier is already used. Prepare again for a new identifier.

- `cursor_filter_mismatch` (`409`): the cursor belongs to another route or filter set. Restart without a cursor and keep the same route and filters on later pages.

* `cursor_stale` (`409`): the resource ordering changed after the cursor was issued. Restart from the first page.

- `idempotency_in_progress` (`409`): an identical request is still running. Wait briefly, then retry the exact request with the same key.

* `nothing_to_claim` (`409`): the requested position currently has no claimable value. Refresh the wallet's claim positions after state changes.

### Unsupported or non-executable requests

* `unsupported_operation` (`422`): the resource, contract configuration, paired asset, or operation is not supported. Read `/config` and use a supported combination.

- `unsupported_chain` (`422`): the chain is not supported. Use Base `8453`, Robinhood `4663`, Monad `143`, Arc `5042`, BSC `56`, X Layer `196` or Elysium `99901`.

* `idempotency_key_reused` (`422`): the retry ID was already used with different input. Generate a new UUID.

- `invalid_amount` (`422`): the amount is invalid for the requested operation or current wallet state. Correct it using `detail`.

* `invalid_referrer` (`422`): the referrer is reserved, duplicated, or otherwise ineligible. Remove it or use a separate eligible wallet.

- `insufficient_balance` (`422`): the wallet cannot fund the requested operation. Fund at least `required_raw` of `asset`, then prepare again.

* `quote_unavailable` (`422`): no safe executable quote exists for the token, side, amount, or current pool state. Correct the input or retry after market state changes.

- `simulation_failed` (`422`): the unsigned transaction did not simulate successfully. Resolve the condition in `detail`, then prepare again.

### Limits and service failures

* `rate_limit_exceeded` (`429`): the API key exceeded a weighted burst, minute, day, or month limit. Wait for `Retry-After`.

- `quota_exceeded` (`429`): a key, wallet, token, creator, source, service, or concurrency safety ceiling was reached. Wait for `Retry-After` and reduce frequency or concurrency.

* `internal_error` (`500`): an unexpected server fault occurred. Retry once; if it persists, contact support with `request_id`.

- `upstream_error` (`502`): a required chain, metadata, indexer, holder, or internal origin dependency returned an invalid response. Retry with capped exponential backoff and jitter.

* `temporarily_unavailable` (`503`): a required service or verified live state is unavailable. Retry with capped exponential backoff and jitter.

- `upstream_timeout` (`504`): a required dependency timed out. Retry with capped exponential backoff and jitter.

## Weighted rate limits

`GET /health` and browser preflight requests do not consume API-key units. Every other operation is authenticated and metered against the calling key. A successful preflight only confirms browser transport; the following API request must still pass API-key, scope, origin, validation, and rate-limit checks.

Requests consume units:

| Operation | Units |
| - | -: |
| configuration: `include=chains` only, or transaction status | 1 |
| configuration: live crypto-paired contracts or paired assets | 5 |
| configuration: live stock-paired or `market=all` contracts or paired assets | 20 |
| token list, search, creator list, detail, or wallet summary | 2 |
| token trades, wallet activity, fee claims, Dividend positions, announcement prepare, or on-chain metadata prepare | 3 |
| fee or Dividend action preparation | 3 per position |
| token announcements | 2 |
| swap quote or prepare | 5 |
| holder snapshot | 10 |
| IPFS metadata-document prepare | 10 |
| launch prepare | 20 |

Configuration costs reflect whether a request needs live chain reads. Paginated reads scale with the requested page size: token lists, search, creator lists, and announcements use 2 units per 25 rows; trades, wallet activity, and fee claims use 3 units per 25 rows; holders use 10 units per 50 rows. Claim batches scale by position, so 10 prepared claims cost 30 units. For example, `GET /tokens?limit=100` costs 8 units and a 200-holder page costs 40 units.

Initial plans:

| Plan | Units/min | Burst/sec | Daily | Monthly | Max page |
| - | -: | -: | -: | -: | -: |
| Playground | 60 | 20 | 2,500 | 50,000 | 50 |
| Developer | 300 | 20 | 25,000 | 500,000 | 100 |
| Builder | 1,200 | 100 | 250,000 | 5,000,000 | 200 |
| Partner | Custom | Custom | Custom | Custom | Custom |

Additional safety ceilings apply before expensive work begins:

* **Launch preparation:** protects the complete launch workflow, including live configuration reads, metadata uploads, `01` address mining, calldata construction, and simulation. One key can prepare up to 3 launches per minute and 100 per day. Within that key, the same creator is limited to 1 per minute and 25 per day; a different key cannot consume the counter.
* **Metadata documents:** the IPFS document route allows up to 10 preparations per key each minute and 100 per day. Within that key, the same token is limited to 2 per minute and 25 per day. Name, symbol, and extra-metadata preparation does not use these pinning caps.
* **Trading:** the same wallet can request up to 60 swap quotes and 30 swap preparations per minute across all keys.
* **Claims:** one key can prepare up to 20 fee-claim batches per minute. The same chain and caller are limited to 10 batches per minute across all keys; each batch contains 1 to 10 independent positions.
* **Creator actions:** within each key, the same creator or metadata actor is limited to 20 announcement or metadata preparations per minute.
* **Holder protection:** holder snapshots allow 2 concurrent requests per key.

Shared safeguards stop fresh-key cycling without changing ordinary use:

* **Authentication:** uncached key-prefix lookups allow 60 requests per source each minute. Authorization results may be cached for up to 5 seconds for valid keys and 2 seconds for unknown keys.
* **Live configuration:** 15 requests per source and 120 across the service each minute, with 10 in flight.
* **Holder snapshots:** 60 requests per source and 300 across the service each minute, with 20 in flight.
* **Launch workflow:** 6 requests per source each minute and 200 per day; 60 across the service each minute and 2,000 per day.
* **Metadata-document pinning:** 20 requests per source each minute and 500 per day; 120 across the service each minute and 5,000 per day. These limits apply only to the document preparation route, which can upload content.
* **All live transaction preparation:** 120 requests per source and 1,000 across the service each minute, with 50 preparations in flight.

New keys use the Developer limits. Higher limits are reviewed per key, and Partner access uses a custom per-key policy.

Responses include `RateLimit`, `RateLimit-Policy`, `X-RateLimit-*`, and `X-Request-Id`. A 429 includes `Retry-After`.

Compatibility routes also expose `Deprecation` and `Link` headers. These headers do not change route behavior; follow the linked migration guide for the focused replacement.

Limits apply across simultaneous requests. Higher limits, including Partner policies, are assigned per key.

## Tax-specific validation

Invalid inclusive units, allocation totals, policy bounds, minimum holdings or incompatible tax formats reject before a launch is prepared. Read the returned policy instead of treating 1% to 10% as permanent. A disabled factory is unavailable for new creation; it does not turn an existing token into a different suite.

Fee-accrual Tax tokens support claims of assigned rewards, not separate distribution operations. Index-only historical suites are not public transaction-preparation targets. A recorded entitlement may still be non-payable because of exclusion, missing backing or receiver failure. Withdrawals require the wallet entitled to the rewards; changing `holder` cannot grant authority. Use the problem detail to correct the request, and distinguish a simulated payment from final receipt evidence.

## Dev Buy and \$O launch errors

Unsupported products, funding assets or settlement routes are rejected before signable calldata is returned. For \$O launches, omit Tax settings and trading referrals. A failed complete-transaction simulation can mean insufficient acquisition liquidity, a vault conversion failure, insufficient physical settlement inventory or output below the minimum. More wallet funds do not fix a route that cannot spend the full input.

When Dev Buy preparation returns `requires_reprepare: true`, confirm its approval steps, then send the original request with `continuation_id` and a new `Idempotency-Key`. Keep the same API key and intent. A stale continuation or changed adapter/configuration needs fresh preparation; do not edit an old transaction to bypass the check. The API does not return provisional purchase calldata while approvals are outstanding.

## Safe request retries

Mintlify labels this as **Unique retry ID**. Send it in the standard `Idempotency-Key` header. Generate a random UUID for each new launch or metadata-document update, then reuse it only when retrying that exact request.

* it can contain 1 to 255 characters and is kept for 24 hours
* the same API key, retry ID, and body replay the completed response
* using the same retry ID for different input returns `idempotency_key_reused`; the second request is not prepared
* different API keys may safely use the same retry ID

## Retry policy

* retry 429 after `Retry-After`
* retry 500 once; if it persists, contact support with the `request_id`
* retry 502, 503, and 504 with capped exponential backoff and jitter
* do not blindly retry 400, 401, 403, or 422
* prepare again after `stale_plan`
* restart pagination after a stale or filter-mismatched cursor
* never broadcast a transaction after its expiry

## Caching and data freshness

Each response includes `meta.generated_at`, which records when the gateway formed the response. Source freshness comes from resource-level `updated_at`, observed or confirmed block, and finality fields. Configuration exposes `as_of_block` whenever contract or paired-asset data requires a live one-block chain read.

Every request admitted by the weighted limiter consumes its documented route weight, including a repeated request using the same retry ID or a cached data response. Units measure access to the operation, not the gateway's internal compute cost. With a valid key, insufficient-scope and oversized-page rejections consume the route's base weight. Missing or invalid authentication, body-size enforcement, and requests rejected by an already-exhausted quota record zero units. A request that passes the limiter and later fails endpoint validation, simulation, or an upstream dependency consumes the route weight because execution capacity was reserved.

Use each resource's freshness fields to judge how current it is. Ranked and trending values update periodically; their `updated_at` field records the latest refresh.

Live configuration, swap quotes, wallet balances, allowances, claims, transaction plans, and simulations are never response-cached. External holder pages are requested from their provider without a stale fallback. If a required dependency is unavailable, the API returns a mapped error instead of silently returning an older snapshot.

Repeating a launch or metadata-document request with the same retry ID may return its original response, avoiding duplicate uploads and transaction preparation. This applies only to the same API key, retry ID, route and request body. Use a new retry ID after a returned plan expires.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.