> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Read endpoints

> Search tokens and read launch, pool, wallet, claim, holder, and transaction state.

All read endpoints except `/health` require an API key. Product queries require an explicit `chain_id`; the API never combines chains implicitly.

## Endpoint summary

| Method and path | Returns |
| - | - |
| `GET /health` | Process health and build version |
| `GET /config` | Production contract configurations, paired assets, and capabilities |
| `GET /tokens` | Browsable and ranked token summaries |
| `GET /tokens/search` | Token search results |
| `GET /creators/{address}/tokens` | Launches created by one wallet |
| `GET /tokens/{chain_id}/{token_address}` | Token, launch, pool, market, and announcement detail |
| `GET /tokens/{chain_id}/{token_address}/trades` | Canonical trades |
| `GET /tokens/{chain_id}/{token_address}/announcements` | Creator announcements |
| `GET /tokens/{chain_id}/{token_address}/holders` | Provider-backed holder snapshot |
| `GET /wallets/{address}` | Compact launchpad wallet overview |
| `GET /wallets/{address}/activity` | Structured wallet activity |
| `GET /wallets/{address}/fee-claims` | Fee positions |
| `GET /wallets/{address}/dividends` | Indexed holder Dividend positions |
| `GET /transactions/{chain_id}/{tx_hash}` | Indexed transaction and launchpad operation state |

`GET /health` is public liveness only: it returns service status, API version, build ID, and time. It requires no API key, consumes no API-key units, and can be called from browser or server integrations. It does not guarantee that every data source or transaction preparation service is available.

Ordinary token, wallet, activity, claim, and transaction-status reads use the existing indexed or materialized launchpad data and do not add a chain RPC per request. Holder snapshots use their documented holder provider. Live contract and paired-asset sections in `/config`, swap operations, claim preparation, creator actions, and launch preparation verify the chain state they need.

## Live configuration

`GET /config` accepts `include=chains,suites,quotes`. The field names `suites` and `quotes` are retained for API compatibility; they represent launch contract configurations and paired assets. The default returns all three sections.

* `include=chains` uses the static production chain registry and does not call an RPC. Its chain capabilities report the launch token mode; Base activation is `not_checked`, while Robinhood, Monad, Arc, BSC, X Layer and Elysium are `not_applicable`.
* Contract or paired-asset sections are read at one chain block and include `as_of_block`. For Base Standard, the same block also verifies B20 activation. Base Tax and \$O launches are ERC-20 and do not require that activation.
* `active_only=true` omits earlier contract configurations and paired assets that cannot create new launches.
* Stock-paired markets follow the shared public chain allowlist, platform catalog, and live factory state. An active response includes stock-paired support only when catalogued assets are registered on the live factory and creation is enabled.
* Each `suites` item exposes supported route codes, integration capabilities, contract addresses, current supply, `config_version`, and creation state. Capabilities identify creator rights, atomic launch-buy support, generic fee components, paired-asset revisions, and the creation switch without requiring clients to infer behavior from an identifier.
* The Standard/Tax configurations on Base, Robinhood, BSC, Monad and X Layer each report both `standard` (crypto-paired) and `rwa` (stock-paired) in `supported_routes` and expose their `launch_buy_adapter_address`.
* `contracts.swapx_router` identifies SwapX where configured. `universal_router` and `permit2` are optional; use the returned transaction steps rather than assuming every chain uses the same router.
* A creation fee appears only when its live amount is nonzero.

Base Standard B20 creation is available only when `chain.capabilities.b20_asset_status` is `active`. If ActivationRegistry cannot be verified, the API returns `503 temporarily_unavailable` instead of reporting a potentially executable route.

Earlier publicly supported contract configurations remain available with `active_only=false`. This does not expose index-only historical Tax suites or override public admission rules. See the [chain and product matrix](https://docs.o1.exchange/launchpad/api/introduction.md#chain-and-product-support).

## Tax configuration and dividend discovery

Request Tax configuration explicitly:

```http theme={null}
GET /v1/config?chain_id=8453&market=all&launch_product=tax&include=chains,suites,quotes&active_only=false
```

Omitting `launch_product` selects `non-tax`. `market=standard` means a crypto pair; it does not select the Standard token product. `market=rwa` means a stock pair.

For public Tax v2 support, match the chain and suite using the [Tax deployment table](https://docs.o1.exchange/launchpad/integration/tax-tokens.md). `active_only=false` does not opt into index-only historical deployments. Use the explicit `dividend_accounting: "fee-accrual"` capability, rather than inferring behavior from the shared version-family name.

Use each suite row's `token_mode` (`erc20` for Base, Robinhood, BSC, Monad, X Layer, Arc and Elysium Tax), `launch_product`, `tax_format` (`inclusive`), `dividend_claims` capability and helper address. Chain-level token-mode metadata describes the default product and must not override the selected suite. `tax_policy` carries exact string rates, bounds, protocol clamps, anti-sniping settings and the raw holding floor. Its `percentage_scale` is `100000000`; derived `rate_scale` is `1000000000000000000000000`.

`active_for_creation` identifies the platform's selected suite for new launches. `creation_available` also requires live enabled creation and a usable quote. `active_only=false` keeps the suite visible for inspection while creation is disabled. It does not enable launches.

```http theme={null}
GET /v1/wallets/0x1111111111111111111111111111111111111111/dividends?chain_id=8453&limit=25
```

For Robinhood, use `chain_id=4663`; for BSC, use `chain_id=56`; for Monad, use `chain_id=143` in both examples above. Always require the deployed API to expose the requested suite; a contract address in these docs does not enable API support.

Dividend discovery uses indexed positions, with a default page size of 25 and maximum 50, an opaque cursor and optional `status=observed|confirmed`. These rows are candidates for live verification, not proof of a currently payable amount or a complete scan of all ERC-20 holdings. Claim preparation checks the factory-bound clone, current reward state, holder and receiver. Keep positions with previously earned rewards even after the holder sells. See [Dividend actions](https://docs.o1.exchange/launchpad/api/claims-and-creator-actions.md#dividend-actions).

## \$O launch configuration

Use `GET /v1/config?chain_id=8453&launch_product=wsto&market=standard&include=chains,suites,quotes`. The product selects `base-mainnet-wsto-burn-v1` and its wstO quote. Launched tokens use ERC-20. It has no creation fee, FeeEscrow, dividend claims or Tax allocation graph. Review its returned burn rates and percentage scale separately from Standard BPS fees or Tax settings.

## Dev Buy and settlement assets

Configuration distinguishes contract support from API preparation and live adapter bindings:

| Field | Meaning |
| - | - |
| `capabilities.atomic_launch_buy` | The contract supports atomic creation and purchase |
| `capabilities.api_atomic_launch_buy` | The selected suite is supported for API Dev Buy |
| `dev_buy.api_supported` | API preparation support for the selected creation suite |
| `dev_buy.adapter_attached` / `adapter_binding_status` | Attached-adapter presence and binding checks |
| `dev_buy.quote_routes` | Per-quote route configuration, unavailable reason and supported funding assets |
| Each route's `funding_assets` | Asset address, symbol, decimals, raw amount step and approval/repreparation requirements |
| Quote `swap_settlement_tokens` | Admitted payment/receipt assets for exact-input trades |

An attached adapter or configured route is not an executable quote. `adapter_admission` and `requires_amount_simulation` require preparation to verify the exact binding and requested amount. Refresh configuration after adapter, quote or protected-setting changes.

Send funding assets explicitly. Standard/Tax Dev Buy defaults to native currency; \$O Dev Buy defaults to held wstO for compatibility. The website uses native funding. See [Dev Buy](https://docs.o1.exchange/launchpad/api/launches.md#atomic-dev-buy) for approvals and continuations, and [trading](https://docs.o1.exchange/launchpad/api/trading.md) for settlement units.

## Poll the paired-asset catalog

Use `GET /v1/config?chain_id=8453&market=all&include=chains,suites,quotes&active_only=false` with an `x-api-key` that has `config:read`. Change `chain_id` to `4663` for Robinhood, `143` for Monad, `5042` for Arc, `56` for BSC, `196` for X Layer or `99901` for Elysium. Quote rows are in `data.quotes`; factory references and creation fees are in `data.suites`. Use `data.as_of_block` for the live-state observation block.

Add `launch_product=tax` for Tax or `launch_product=wsto` for Base or Robinhood \$O launch quotes; registration on the Standard factory does not register the Tax factory automatically. The API combines the platform catalog with live registration checks. `active_only=false` includes configured entries that are not registered or not currently usable; `active_only=true` filters to creation-available entries. It does not discover arbitrary addresses added by a factory owner outside the platform catalog. Pair registration monitoring with catalog polling and review any unknown address.

The current production schema exposes address, symbol, name, decimals, route, suite, registration status, selectability, and quote revision. `route` is a product classification, not an issuer identity or a complete asset taxonomy. The downloadable JSON snapshots are dated reference data; poll the API for current registration status.

When returned, `asset_type` and `issuer` describe the paired asset separately from its market route. Asset types distinguish native currency, stablecoins, wrapped crypto, direct protocol and ecosystem tokens (`crypto_token`), and tokenized securities, including stocks and ETFs. Issuer metadata includes an ID, name, legal entities and official sources. Clients should tolerate absent metadata fields.

A null issuer means native currency or unverified attribution; an empty legal-entity list means only the brand is confirmed. This metadata is not token security approval. Quote revisions track onchain settings, so compare issuer metadata separately. Catalog decimals apply to unregistered entries; factory decimals apply to registered quotes.

The paired-asset catalog includes these issuer groups:

| Chain | Quote group | Attribution |
| - | - | - |
| Base | Stock Tokens | Coinbase Onchain SPV Ltd, linked through the [official stock prospectuses](https://www.base.org/stocks) |
| Base | 8 wrapped crypto assets | [Coinbase Wrapped Assets](https://help.coinbase.com/en/coinbase/trading-and-funding/sending-or-receiving-cryptocurrency/coinbase-wrapped-btc); legal entity attribution is not asserted |
| Base | USDC | [Circle](https://www.circle.com/legal/mica-usdc-whitepaper) |
| Robinhood | 194 stock and ETF tokens | [Robinhood Assets (Jersey) Limited](https://robinhood.com/rhj/stocktokens/) |
| Robinhood | USDG | [Paxos](https://www.paxos.com/terms-and-conditions/usdg-eu-whitepaper) |
| Base / Robinhood | Native ETH | No issuer |
| Monad | MON | Native currency; no issuer |
| Monad / Arc | USDC | Circle |
| Monad | WETH | Wrapped crypto; issuer attribution unverified |
| Monad | 10 wrapped xStocks | xStocks, issued by Backed; ERC-4626 wrappers of the xStocks tokens, not available to US persons |

The factory owner controls quote registration; creators can use only registered quote tokens. The contracts do not enforce a fixed issuer set, and the catalog is not a promise that issuers will never change. In particular, cbZEC and cbHYPE are wrapped crypto despite sharing an address prefix with Base stock tokens.

Issuer metadata stays offchain, so it adds no contract storage or registration gas. `QuoteRegistered` and `quoteConfig(address)` remain the onchain registration evidence; issuer identity comes from the catalog's explicit source-backed attribution.

## Token browsing

`GET /tokens` browses and ranks tracked launches:

| Parameter | Behavior |
| - | - |
| `chain_id` | `8453`, `4663`, `143`, `5042`, `56`, `196` or `99901`, required |
| `market` | `standard` for crypto-paired, `rwa` for stock-paired, or `all` |
| `quote_address` | Exact quote asset |
| `sort` | `newest`, `oldest`, `trending`, `liquidity`, `market_cap`, or `volume_24h` |
| `cursor` | Opaque continuation cursor |
| `limit` | Default `25`, maximum `100` |

Direction is part of `sort`, so there is no separate `order` parameter and every displayed sort is executable. Each result has stable sections:

* `token`: address, name, symbol, decimals, and effective image
* `launch`: backward-compatible creator, immutable original creator, current and pending creator rights when supported, current creator fee recipient, recorded contract configuration, pool, paired asset, feature flags, transaction provenance, creation time, and a creation fee only when the paid amount was nonzero
* `market_data`: price, market cap, liquidity, 1-hour, 6-hour, 24-hour, and lifetime activity, plus freshness fields

Missing market values are `null`, not zero. Trending returns ordinary market values and order only; ranking scores, scoring explanations, pins, and internal quality fields are private.

Quote decimals come from the indexed launch or the shared quote registry. A truly unknown historical admin-added quote returns `quote.decimals: null`; the API never guesses units.

Ranked lists are live rather than frozen snapshots. A cursor binds the filters and source position, not an immutable ranking snapshot, so tokens can move between pages while ranking updates. Deduplicate by `(chain_id, token.address)` and restart when the API returns `409 cursor_stale`.

## Token search and creator launches

Use the focused routes when the query has different ordering semantics:

```http theme={null}
GET /tokens/search?chain_id=8453&q=alpha
GET /creators/0x1111111111111111111111111111111111111111/tokens?chain_id=8453&sort=newest
```

Search accepts `chain_id`, `market`, `quote_address`, `q`, `cursor`, and `limit`. It matches token address, name, symbol, creator, pool ID, or launch transaction and uses one deterministic liquidity ordering.

Creator launches accept the same chain, market, quote, and pagination fields plus `sort=newest|oldest`. Search and creator cursors are not interchangeable with browsing cursors.

> [!NOTE]
>
> Earlier combined query forms remain available during migration and return deprecation headers. New integrations should use the focused routes described here. See the [migration guide](https://docs.o1.exchange/launchpad/api/migration.md).

## Token detail

```http theme={null}
GET /tokens/8453/0x...01?include=pool,market,announcements
```

The default include set is `pool,market`. `announcements_limit` defaults to 3 and is capped at 10. Supply it only when `include` contains `announcements`.

The detailed token object adds full metadata, links, total supply, historical contract addresses, and these optional sections:

* `pool`: currencies, PoolManager, hook, frozen fee split, anti-snipe clock, locked seed ranges, and initial seeded token amount
* `market_data`: ATH market cap in quote currency, unique traders, pool state, and fee revenue by currency
* `announcements`: recent creator messages and their on-chain provenance

Arbitrary token extra-metadata keys are not returned by default.

## Trades and announcements

Use independent collection routes:

```http theme={null}
GET /tokens/{chain_id}/{token_address}/trades
GET /tokens/{chain_id}/{token_address}/announcements
```

Trades contain structured token and quote amounts, pool state, fee credits, referrer, comment, timestamp, and on-chain provenance. Announcements contain the creator message, URI, timestamp, and provenance.

Trades accept one optional identity filter: `wallet`, `transaction_hash`, or `referrer`. `from` is inclusive and `to` is exclusive; both use Unix seconds. Announcements accept only pagination, so trade-only filters never appear on their reference page.

Token detail, activity, and holder routes first verify that the address is a visible launchpad token on the selected chain. An unknown or arbitrary external token returns `404 not_found` with the checked chain, token address, and a `suggested_endpoint` for token search. Verify the identifier or rediscover it through `GET /tokens` or `GET /tokens/search`; do not poll an unchanged `404`.

## Holder snapshots

A holder response has a normal page plus top-level `summary`:

```json theme={null}
{
  "summary": {
    "status": "ready",
    "total_holders": 128,
    "top_10_percent": 62.4
  }
}
```

Balances remain exact strings, and `supply_percent` is derived from indexed total supply. `meta.generated_at` records when the gateway formed the response; the API does not invent a provider snapshot timestamp. If the provider cannot produce a holder result, it returns `503 temporarily_unavailable` instead of a misleading empty list.

## Wallet activity and fee claims

Wallet activity is structured by `kind`; it does not return UI titles, raw metadata JSON, or internal event keys. Current launch flows use launch, launch fee, trade, fee credit or claim, announcement, and metadata activity kinds.

Fee positions use a separate cursor domain, default to 25 results, and are capped at 50.

* `GET /wallets/{address}/fee-claims` supports `state=claimable|all` and optional `currency_address`.
* A fee balance is scoped to escrow, recipient, and currency. It may represent credits from multiple pools, so it is not assigned to one launch incorrectly.

## Transaction status

`GET /transactions/{chain_id}/{tx_hash}` is the indexed public view, not a live RPC receipt endpoint. When indexed, it separates two states:

* `chain.status`: unknown, pending, succeeded, reverted, or replaced
* `indexing.status`: not seen, processing, or complete

`operations` contains only public launchpad actions with their transaction provenance. Raw worker jobs, provider responses, governance events, queue state, and internal errors are never returned.

Existing chain indexers and webhooks discover wallet-broadcast transactions normally, so the API does not expose a transaction-notification write. Before a hash is observed, `data` is `null`; use your own chain provider to poll the receipt for immediate confirmation and retry this endpoint for launchpad indexing state.

## Pagination and freshness

```json theme={null}
{
  "pagination": {
    "next_cursor": "opaque-signed-cursor",
    "has_more": true,
    "limit": 25
  },
  "meta": {
    "request_id": "req_...",
    "generated_at": "2026-07-31T12:00:00.000Z",
    "warnings": []
  }
}
```

Do not parse or edit cursors. They are bound to the route, filters, ordering, API version, and expiry.

`meta.generated_at` is when the gateway formed the response. Resource-level `updated_at`, observed or confirmed block, and finality fields describe source freshness. The gateway does not add another product-response cache.

## Monad configuration

Use `GET /v1/config?chain_id=143&market=standard&include=chains,suites,quotes&active_only=false`. The default Standard suite supports `standard` and `rwa`. Add `launch_product=tax` to request `monad-mainnet-tax-token-v2`, which supports the same routes. MON is native, USDC is a Circle stablecoin, WETH is wrapped crypto with unverified issuer attribution, and the 10 wrapped xStocks are tokenized securities issued through xStocks. Use `market=rwa` or `market=all` to include the stock quotes. Both deployments list 13 quotes in their reference snapshots. Read the selected factory's current creation status from `/config`. `active_only=true` filters to creation-available catalog entries; `false` also retains entries if creation is later disabled. Read the current configuration before preparing a transaction.

## Arc configuration

Use `GET /v1/config?chain_id=5042&market=standard&include=chains,suites,quotes&active_only=false`. Arc Standard and Tax use the crypto route with ERC-20 USDC at `0x3600000000000000000000000000000000000000` as its six-decimal pool quote. The native currency is USDC with 18 decimals. These are two interfaces to one balance, not two assets to add together.

Read the live launch fee from the suite configuration and the quote decimals from the paired-asset row. `active_only=true` filters by creation availability; it does not remove issuer metadata. Launches, trades and fee positions retain their currency-specific raw amounts. USD enrichment is separate from those amounts and may be absent without invalidating an indexed transaction.

For Arc Tax, add `launch_product=tax` and require `arc-mainnet-tax-token-v2` from `/config`. Both USDC and cirBTC are crypto pairs; cirBTC uses eight decimals. The 2-USDC native launch fee uses 18 decimals, while USDC rewards use six-decimal ERC-20 units. No wrapped-native conversion is applied to Arc claims. See the [Arc snapshot](https://docs.o1.exchange/launchpad/reference/arc-tax-suite.json).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.