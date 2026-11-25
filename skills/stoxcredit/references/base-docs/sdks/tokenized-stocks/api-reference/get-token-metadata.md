> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Get Token Metadata

> Return a tokenized stock's contractURI-compatible metadata document.

## Example

Use the token symbol, including its token suffix, such as `TSLAc`. Ticker lookup is case-insensitive.

```bash cURL theme={null}
curl https://api.coinbase.com/v1/tokenized-stocks/metadata/TSLAc
```

The response contains `contract_address`, `name`, `symbol`, `description`, `image`, and `prospectus_url`. It also includes `adgm_isin`, the ADGM ISIN of the tokenized security, when available. The image and prospectus URLs are stable API links that redirect to the current assets. A `prospectus_url` does not guarantee that a PDF is currently cached; check [List Cached Prospectuses](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-cached-prospectuses.md) for available tickers.


## OpenAPI

````yaml openapi/tokenized-equities.json GET /v1/tokenized-stocks/metadata/{ticker}
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
  /v1/tokenized-stocks/metadata/{ticker}:
    get:
      tags:
        - Tokenized Stocks
      summary: Get token metadata
      description: >-
        Returns a contractURI-compatible metadata document for a listed token.
        Image and prospectus URLs point to stable redirect endpoints on this
        API. A prospectus URL in metadata does not guarantee that a PDF is
        currently cached.
      operationId: getTokenMetadata
      parameters:
        - name: ticker
          in: path
          required: true
          description: >-
            The token ticker symbol, including its token suffix. Lookup is
            case-insensitive.
          schema:
            type: string
          example: TSLAc
      responses:
        '200':
          description: Token metadata.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/v1GetTokenMetadataResponse'
        '404':
          description: The ticker is not a listed tokenized stock.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rpcStatus'
              example:
                code: 5
                message: ticker "UNKNOWNC" is not a listed tokenized equity token
        '503':
          description: Data is temporarily unavailable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rpcStatus'
              example:
                code: 14
                message: data is temporarily unavailable
components:
  schemas:
    v1GetTokenMetadataResponse:
      type: object
      description: A contractURI-compatible metadata document for a listed tokenized stock.
      properties:
        contract_address:
          type: string
          description: The ERC-20 token contract address on Base.
        name:
          type: string
          description: The name of the underlying equity.
        symbol:
          type: string
          description: The token ticker symbol.
        image:
          type: string
          description: Stable API URL that redirects to the current token icon.
          format: uri
        prospectus_url:
          type: string
          description: >-
            Stable API URL that redirects to the approved prospectus when
            available. Use GET /v1/tokenized-stocks/prospectuses to discover
            cached prospectuses.
          format: uri
        description:
          type: string
          description: >-
            The same human-readable tokenized-stock description returned in the
            token list.
        adgm_isin:
          type: string
          description: >-
            The ADGM ISIN of the tokenized security, taken from its approved
            primary prospectus. Distinct from the underlying stock's ISIN.
            Omitted when unavailable.
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
    protobufAny:
      type: object
      properties:
        '@type':
          type: string
      additionalProperties: {}

````