> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# List Tokenized Stocks

> Return the Coinbase-issued tokenized-stock records currently exposed through the API.

## Example

```bash cURL theme={null}
curl https://api.coinbase.com/v1/tokenized-stocks
```

## Pagination

The default page size is `100` when `page_size` is omitted or `0`. Values above `500` are capped at `500`. Negative page sizes, malformed page sizes or cursors, and invalid `include_zero_supply` values return HTTP `400`.

Pass the response's `next_page_token` as `page_token` to retrieve the next page, keeping `page_size` and `include_zero_supply` unchanged. Continue until `next_page_token` is omitted. Live tokens with zero supply (never minted or fully burned) are included by default over HTTP; set `include_zero_supply=false` to exclude them. Test and not-live tokens are never returned. Positive-supply tokens are ordered by contract address first, followed by zero-supply tokens ordered by contract address.

## Response Fields

The token schema includes `description` and `first_mint_date`. The first-mint date is the UTC block timestamp of the token's first positive mint, not its deployment time. It can be absent if never minted or not yet resolved.

Default-valued scalar fields, empty arrays, and unset timestamps can be omitted. For example, a zero `total_supply` field can be omitted even when its token remains in the list by default. Check the [response field guidance](https://docs.base.org/sdks/tokenized-stocks/overview.md#interpreting-response-fields) before interpreting missing supply or NAV data.


## OpenAPI

````yaml openapi/tokenized-equities.json GET /v1/tokenized-stocks
openapi: 3.0.0
info:
  title: Tokenized Stocks API
  description: >-
    Read the Coinbase-issued tokenized-stock records currently exposed through
    the API, protocol contract addresses, and normalized token supplies on Base.
    No API key is required.
  version: 1.0.0
servers:
  - url: https://api.coinbase.com
security: []
tags:
  - name: Tokenized Stocks
    description: Public, read-only data for Coinbase-issued tokenized stocks on Base.
externalDocs:
  description: Tokenized Stocks on Base
  url: https://docs.base.org/build-on-base/integrate-defi/list-tokenized-stocks
paths:
  /v1/tokenized-stocks:
    get:
      tags:
        - Tokenized Stocks
      summary: List tokenized stocks
      description: >-
        Returns the Coinbase-issued tokenized-stock records currently exposed
        through the API. Results are paginated: when the response includes
        `next_page_token`, pass it as `page_token` to fetch the next page, and
        repeat until `next_page_token` is omitted. Live tokens with zero supply
        are included by default over HTTP; set `include_zero_supply=false` to
        exclude them. Positive-supply tokens are ordered by contract address
        first, followed by zero-supply tokens ordered by contract address.
        Presence in this list does not imply trading availability or
        eligibility.
      operationId: listTokenizedStocks
      parameters:
        - name: page_size
          in: query
          required: false
          description: >-
            The maximum number of records to return in one page. Defaults to 100
            when omitted or zero. Values above 500 are capped at 500; negative
            values return HTTP 400.
          schema:
            type: integer
            format: int32
            minimum: 0
            default: 100
        - name: page_token
          in: query
          required: false
          description: >-
            The `next_page_token` value from a previous response. Pass it to
            fetch the next page of records. Keep other request parameters
            unchanged between pages. A malformed cursor returns HTTP 400.
          schema:
            type: string
        - name: include_zero_supply
          in: query
          required: false
          description: >-
            Whether to include live tokens whose total supply is zero (never
            minted or fully burned). Defaults to true for public HTTP requests.
            Test and not-live tokens are never returned.
          schema:
            type: boolean
            default: true
      responses:
        '200':
          description: A successful response.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/v1ListTokenizedEquityTokensResponse'
        '400':
          description: >-
            Invalid page_size, page_token, or include_zero_supply. Negative page
            sizes and malformed values are rejected.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rpcStatus'
              example:
                code: 3
                message: page_size must not be negative
        '503':
          description: Data is temporarily unavailable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rpcStatus'
              example:
                code: 14
                message: data is temporarily unavailable
        default:
          description: An unexpected error response.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rpcStatus'
components:
  schemas:
    v1ListTokenizedEquityTokensResponse:
      type: object
      properties:
        tokens:
          type: array
          items:
            $ref: '#/components/schemas/v1TokenizedEquityToken'
          description: The tokenized-stock records in this page.
        next_page_token:
          type: string
          description: >-
            A token for fetching the next page. Pass it as `page_token` in the
            next request. Omitted on the last page.
      description: >-
        Response message for
        `TokenizedEquitiesPublicApiService.ListTokenizedEquityTokens`.
    rpcStatus:
      type: object
      properties:
        code:
          type: integer
          format: int32
        message:
          type: string
        details:
          type: array
          items:
            $ref: '#/components/schemas/protobufAny'
    v1TokenizedEquityToken:
      type: object
      properties:
        contract_address:
          type: string
          description: The address of the ERC-20 token contract on Base.
        symbol:
          type: string
          description: The token's ticker symbol.
        name:
          type: string
          description: The name of the underlying equity.
        decimals:
          type: integer
          format: int64
          description: The number of decimals used by the token.
        icon_url:
          type: string
          description: URL of an icon representing the underlying equity.
        total_supply:
          type: number
          format: double
          description: >-
            The token's total supply, normalized by the token's decimals. This
            is a token-unit amount, not the number of underlying shares;
            multiply by `multiplier` to convert to shares.
        isin:
          type: string
          description: The ISIN of the underlying equity.
        adgm_isin:
          type: string
          description: >-
            The ADGM ISIN of the tokenized security, taken from its approved
            primary prospectus. Distinct from the underlying stock's ISIN.
            Omitted when unavailable.
        multiplier:
          type: number
          format: double
          description: >-
            The token's current scaling factor between token units and
            underlying shares, adjusted for its 18-decimal fixed-point scale
            (1.0 means no adjustment). It can change for corporate actions such
            as dividends or stock splits.
        paused_features:
          type: array
          items:
            type: integer
            format: int64
          description: Feature flags currently paused on the token contract.
        nav_price:
          type: number
          format: double
          description: >-
            The most recently published Chainlink-based NAV/reference value for
            the token, read from its Chainlink price feed on Base and adjusted
            for the feed's decimals. This is a total-return reference value, not
            a live bid/ask or execution price. Check `nav_price_updated_at` and
            apply staleness bounds before relying on it.
        nav_price_updated_at:
          type: string
          format: date-time
          description: >-
            The time at which `nav_price` was last updated onchain, per the
            Chainlink feed's `latestRoundData()` `updatedAt`. Chainlink only
            publishes a new round when the price moves past a deviation
            threshold or the heartbeat elapses, and feeds stop updating outside
            market hours, so this can lag wall-clock time by minutes to many
            hours. Apply staleness bounds before relying on `nav_price`.
        description:
          type: string
          description: >-
            A human-readable description of the tokenized stock, based on its
            name and symbol.
        first_mint_date:
          type: string
          description: >-
            The UTC block timestamp of the first positive ERC-20 mint (Transfer
            from the zero address), not the contract deployment time. Omitted if
            never minted or not yet resolved. Later mints or burns do not change
            this date.
          format: date-time
      description: >-
        A tokenized equity token available on Base. JSON responses omit
        default-valued scalar fields, empty arrays, and unset timestamps. For
        example, zero total_supply and an empty paused_features array can be
        absent. An absent NAV timestamp does not establish a fresh price;
        first_mint_date can also be unavailable while its background lookup is
        pending.
    protobufAny:
      type: object
      properties:
        '@type':
          type: string
      additionalProperties: {}

````