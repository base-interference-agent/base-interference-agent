> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# List Cached Prospectuses

> List cached approved prospectus documents by ticker, with ISINs when known.

## Example

```bash cURL theme={null}
curl https://api.coinbase.com/v1/tokenized-stocks/prospectuses
```

The response contains a `prospectuses` array, sorted alphabetically by uppercase ticker. Each entry includes `ticker`, the underlying equity's `isin` when known, and a `documents` array. A ticker can have several documents, such as a primary prospectus and a later supplement.

Each document has these fields:

| Field | Description |
| - | - |
| `type` | `primary` or `supplementary` |
| `approval_date` | Approval date in `YYYY-MM-DD` format |
| `url` | Direct URL to the approved PDF |

Documents are ordered primary first, then newest approval date, then URL.

To get a single PDF for a ticker, use [Get Token Prospectus](https://docs.base.org/sdks/tokenized-stocks/api-reference/get-token-prospectus.md), which redirects to the first document in this order.

The prospectus cache refreshes in the background. Before a successful refresh, the cache can be empty and the `prospectuses` field can be omitted. This is a prospectus-availability list, not a list of tokens available for trading.


## OpenAPI

````yaml openapi/tokenized-equities.json GET /v1/tokenized-stocks/prospectuses
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
  /v1/tokenized-stocks/prospectuses:
    get:
      tags:
        - Tokenized Stocks
      summary: List cached prospectuses
      description: >-
        Lists cached prospectuses grouped by uppercase ticker. Each entry
        includes the underlying ISIN when known and a documents array with the
        type, approval date, and direct PDF URL of every cached primary and
        supplementary prospectus. The cache refreshes in the background; an
        empty cache can produce a response without a prospectuses field.
      operationId: listCachedProspectusTickers
      parameters: []
      responses:
        '200':
          description: Cached prospectuses.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/v1ListCachedProspectusTickersResponse'
              example:
                prospectuses:
                  - ticker: SKYDC
                    isin: US69932A2042
                    documents:
                      - type: primary
                        approval_date: '2026-10-12'
                        url: >-
                          https://www.adgm.com/globalassets/market-disclosure/content/prospectus/coinbase-onchain-spv-ltd---prospectus-pskyc---12oct2026_10_12_2026_16-24-26.pdf
                      - type: supplementary
                        approval_date: '2026-10-19'
                        url: >-
                          https://www.adgm.com/globalassets/market-disclosure/content/prospectus/coinbase-onchain-spv-ltd---supplementary-prospectus-pskyc---19oct2026_10_19_2026_13-29-29.pdf
components:
  schemas:
    v1ListCachedProspectusTickersResponse:
      type: object
      description: >-
        The currently cached prospectuses, one entry per uppercase ticker,
        sorted alphabetically by ticker. The prospectuses field can be omitted
        when the cache is empty.
      properties:
        prospectuses:
          type: array
          items:
            $ref: '#/components/schemas/v1CachedProspectus'
    v1CachedProspectus:
      type: object
      description: A ticker with cached approved prospectus documents.
      properties:
        ticker:
          type: string
          description: >-
            The uppercase token ticker, including its token suffix, such as
            TSLAC.
        isin:
          type: string
          description: >-
            The underlying equity ISIN. Omitted when not yet known from cached
            metadata.
        documents:
          type: array
          description: >-
            Every cached primary and supplementary document for this ticker,
            ordered primary first, then newest approval date, then URL.
          items:
            $ref: '#/components/schemas/v1ProspectusDocument'
    v1ProspectusDocument:
      type: object
      description: One approved prospectus document from the ADGM FSRA register.
      properties:
        type:
          type: string
          enum:
            - primary
            - supplementary
          description: The document type.
        approval_date:
          type: string
          format: date
          description: The register approval date, in YYYY-MM-DD format.
        url:
          type: string
          format: uri
          description: Direct HTTPS URL of the approved prospectus PDF.

````