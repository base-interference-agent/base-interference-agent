> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Tokenized Stocks API

> Read tokenized-stock records, supplies, metadata, prospectuses, and corporate actions on Base.

Use the public Tokenized Stocks API to retrieve reference data for [Coinbase-issued tokenized stocks on Base](https://docs.base.org/build-on-base/integrate-defi/list-tokenized-stocks.md). The API is read-only and does not require an API key.

> [!NOTE]
>
> Coinbase tokenized stocks are available only to persons in eligible jurisdictions outside of the United States. This API provides read-only reference data only; it does not provide trading, execution, issuance, minting, redemption, or custody functionality. The availability of any token or related product may be subject to jurisdictional, eligibility, and compliance requirements. Integrators are responsible for applying applicable restrictions.

```text Base URL theme={null}
https://api.coinbase.com/v1/tokenized-stocks
```

[Browse the API reference](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-tokenized-stocks.md) for complete request and response schemas and an interactive request builder.

## Endpoints

| Method | Path | Description |
| - | - | - |
| `GET` | `/` | [List tokenized-stock records](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-tokenized-stocks.md). |
| `GET` | `/chains` | [List protocol contract addresses](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-protocol-contract-addresses.md). |
| `GET` | `/nav-feeds` | [List token-to-Chainlink NAV feed addresses](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-nav-feed-addresses.md). |
| `GET` | `/total-supply/{contract_address}` | [Get normalized token supply](https://docs.base.org/sdks/tokenized-stocks/api-reference/get-token-total-supply.md). |
| `GET` | `/metadata/{ticker}` | [Get token metadata](https://docs.base.org/sdks/tokenized-stocks/api-reference/get-token-metadata.md). |
| `GET` | `/images/{symbol}` | [Redirect to a token icon](https://docs.base.org/sdks/tokenized-stocks/api-reference/get-token-icon.md). |
| `GET` | `/prospectus/{ticker}` | [Redirect to a prospectus PDF](https://docs.base.org/sdks/tokenized-stocks/api-reference/get-token-prospectus.md). |
| `GET` | `/prospectuses` | [List cached prospectuses](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-cached-prospectuses.md). |
| `GET` | `/corporate-actions/{id}` | [Get a corporate action](https://docs.base.org/sdks/tokenized-stocks/api-reference/get-corporate-action.md). |

## Wallet Positions and Profit and Loss

The API provides reference data, not wallet-specific data. No endpoint accepts a wallet address, and the API does not return a wallet's positions, cost basis, trade history, or profit and loss.

To show a holder's current position in share-equivalent units, read the balance onchain with [`balanceOfUI`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/balance-of-ui), which applies the current `multiplier` (see [Multipliers](https://docs.base.org/build-on-base/integrate-defi/list-tokenized-stocks.md#multipliers)). A balance does not give you cost basis or profit and loss. To calculate those, you need trade history from every route you want to include. Your app's own records cover only the trades made through your app.

## List Tokenized Stocks

```bash cURL theme={null}
curl https://api.coinbase.com/v1/tokenized-stocks
```

The response includes token contract addresses, symbols, names, descriptions, decimals, ISINs, and multipliers. Depending on the token, it can also include an ADGM ISIN, an icon URL, total supply, first-mint date, paused features, and NAV/reference value data. Presence in the response does not imply trading availability or eligibility.

Results are paginated, so a single request may not return every record. When the response includes `next_page_token`, pass it as the `page_token` query parameter to fetch the next page, and repeat until `next_page_token` is omitted. Keep other request parameters unchanged between pages.

Use `page_size` to set the page size. The default is `100` when omitted or set to `0`. Values above `500` are capped at `500`; negative values return HTTP `400`. Positive-supply tokens come first, ordered by contract address, followed by zero-supply tokens, also ordered by contract address. The public HTTP API includes zero-supply live tokens by default; pass `include_zero_supply=false` to exclude them. Test and not-live tokens are never returned.

```bash cURL theme={null}
curl "https://api.coinbase.com/v1/tokenized-stocks?page_token=<next_page_token>"
```

## Interpreting Response Fields

JSON responses omit default-valued scalar fields, empty arrays, and unset timestamps. For example, a zero `total_supply` or empty `paused_features` array can be omitted. Do not assume every field is present, and do not treat missing NAV data as a usable price.

* **`total_supply`** is the token supply normalized by the token's decimals. It is a token-unit amount, not the number of underlying shares.
* **`multiplier`** is the current scaling factor between token units and underlying shares. It can change for corporate actions such as dividends or stock splits, so always apply the current value when converting token units to shares.
* **`nav_price`** is the most recently published Chainlink-based NAV/reference value for the token. It is not a live bid/ask or execution price.
* **`nav_price_updated_at`** is when `nav_price` was last updated onchain. Feeds update only on price deviation or heartbeat and hold their last value outside market hours, so check this timestamp and apply staleness bounds before relying on `nav_price`.
* **`isin`** is the underlying stock's ISIN.
* **`adgm_isin`** is the ADGM ISIN of the tokenized security, taken from its approved prospectus. It is distinct from the stock ISIN and can be absent when unavailable.
* **`description`** is a human-readable description of the tokenized stock.
* **`first_mint_date`** is the UTC block timestamp of the first positive ERC-20 mint, not the contract deployment time. It can be absent if the token has never been minted or its first mint has not yet been resolved. Later mints and burns do not change it.

## Errors

JSON endpoints return an error object with `code` and `message`. The code is a service error code, not the HTTP status. For example:

```json Invalid Page Token theme={null}
{"code": 3, "message": "page_token is invalid"}
```

| HTTP Status | Code | Meaning |
| - | - | - |
| `400` | `3` | Invalid input, such as a malformed page token, negative page size, invalid contract address, or malformed corporate action UUID. |
| `404` | `5` | The requested token, ticker, or corporate action is not supported or not found. |
| `503` | `14` | Required data is temporarily unavailable. |

The icon and prospectus redirect endpoints return HTTP `302` with a `Location` header on success, not JSON. Their lookup and validation errors use plain-text bodies. See each endpoint's reference for its specific responses.

For integration guidance, price-feed details, and current token contract addresses, see [List Tokenized Stocks](https://docs.base.org/build-on-base/integrate-defi/list-tokenized-stocks.md).
