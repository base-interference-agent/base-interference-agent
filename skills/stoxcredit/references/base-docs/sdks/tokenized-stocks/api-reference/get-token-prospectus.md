> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Get Token Prospectus

> Redirect to a tokenized stock's approved prospectus PDF.

## Example

Use the token ticker, including its token suffix. Tickers are case-insensitive; the `.pdf` suffix is optional. Dotted share-class tickers such as `BRK.Bc` are supported.

```bash cURL theme={null}
curl -L https://api.coinbase.com/v1/tokenized-stocks/prospectus/TSLAc.pdf --output TSLAc.pdf
```

The endpoint returns HTTP `302` with the approved prospectus PDF URL in the `Location` header. When a ticker has several documents, it redirects to the first one in the order that [List Cached Prospectuses](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-cached-prospectuses.md) returns: primary first, then newest approval date, then URL. The `-L` flag follows the redirect to download the PDF. This endpoint does not return JSON.

A malformed ticker returns HTTP `400`. A ticker with no available prospectus returns HTTP `404`. These errors have plain-text bodies. Use [List Cached Prospectuses](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-cached-prospectuses.md) to discover available tickers.


## OpenAPI

````yaml openapi/tokenized-equities.json GET /v1/tokenized-stocks/prospectus/{ticker}
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
  /v1/tokenized-stocks/prospectus/{ticker}:
    get:
      tags:
        - Tokenized Stocks
      summary: Get token prospectus
      description: >-
        Redirects to the approved prospectus PDF when it is available in the
        prospectus cache. Tickers are case-insensitive and may end in .pdf.
        Dotted share-class symbols such as BRK.Bc are supported. Use curl -L to
        download the PDF.
      operationId: getTokenProspectus
      parameters:
        - name: ticker
          in: path
          required: true
          description: The token ticker symbol, optionally followed by .pdf.
          schema:
            type: string
          example: TSLAc.pdf
      responses:
        '302':
          description: >-
            Redirect to the current asset URL. Follow the Location header; the
            response is not a JSON document.
          headers:
            Location:
              description: The HTTPS URL of the asset.
              schema:
                type: string
                format: uri
        '400':
          description: The ticker is malformed.
          content:
            text/plain:
              schema:
                type: string
              example: |
                invalid ticker
        '404':
          description: The symbol or ticker is not found.
          content:
            text/plain:
              schema:
                type: string
              example: |
                404 page not found

````