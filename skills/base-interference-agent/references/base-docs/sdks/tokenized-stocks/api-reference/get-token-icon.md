> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Get Token Icon

> Redirect to a tokenized stock's icon using its ticker symbol.

## Example

Use the token symbol, including its token suffix. Symbols are case-insensitive; the `.png` suffix is optional.

```bash cURL theme={null}
curl -L https://api.coinbase.com/v1/tokenized-stocks/images/TSLAc.png --output TSLAc.png
```

The endpoint returns HTTP `302` with the image URL in the `Location` header. The `-L` flag follows the redirect to download the image. This endpoint does not return a JSON metadata document.

An unknown symbol returns HTTP `404`. Token data that is temporarily unavailable returns HTTP `503`. These errors have plain-text bodies.


## OpenAPI

````yaml openapi/tokenized-equities.json GET /v1/tokenized-stocks/images/{symbol}
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
  /v1/tokenized-stocks/images/{symbol}:
    get:
      tags:
        - Tokenized Stocks
      summary: Get token icon
      description: >-
        Redirects to the token icon. Symbols are case-insensitive and may end in
        .png. Use curl -L to download the image.
      operationId: getTokenIcon
      parameters:
        - name: symbol
          in: path
          required: true
          description: The token ticker symbol, optionally followed by .png.
          schema:
            type: string
          example: TSLAc.png
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
        '404':
          description: The symbol or ticker is not found.
          content:
            text/plain:
              schema:
                type: string
              example: |
                404 page not found
        '503':
          description: Token data is temporarily unavailable.
          content:
            text/plain:
              schema:
                type: string

````