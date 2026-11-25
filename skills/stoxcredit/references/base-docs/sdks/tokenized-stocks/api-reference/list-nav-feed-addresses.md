> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# List NAV Feed Addresses

> List configured Chainlink NAV price feeds for tokenized stocks on Base.

## Example

```bash cURL theme={null}
curl https://api.coinbase.com/v1/tokenized-stocks/nav-feeds
```

## Response Fields

The response contains a `nav_feeds` array, ordered by token contract address. Each entry contains `contract_address` (the token contract address) and `nav_feed_address` (its Chainlink NAV price feed address); both are EIP-55 checksummed. The endpoint returns one entry per token with a configured NAV feed. Tokens without a configured feed can have `nav_price` set to zero and `nav_price_updated_at` omitted in [List Tokenized Stocks](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-tokenized-stocks.md).


## OpenAPI

````yaml openapi/tokenized-equities.json GET /v1/tokenized-stocks/nav-feeds
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
  /v1/tokenized-stocks/nav-feeds:
    get:
      tags:
        - Tokenized Stocks
      summary: List NAV feed addresses
      description: >-
        Returns configured token-to-feed address pairs, ordered by token
        contract address. Both addresses are EIP-55 checksummed.
      operationId: listNavFeedAddresses
      responses:
        '200':
          description: One entry for each token with a configured Chainlink NAV price feed.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/v1ListNavFeedAddressesResponse'
        default:
          description: An unexpected error response.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rpcStatus'
components:
  schemas:
    v1ListNavFeedAddressesResponse:
      type: object
      properties:
        nav_feeds:
          type: array
          items:
            $ref: '#/components/schemas/v1NavFeedAddress'
          description: >-
            One entry per token with a configured Chainlink NAV feed, ordered by
            token contract address.
      description: >-
        Response message for
        `TokenizedEquitiesPublicApiService.ListNavFeedAddresses`.
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
    v1NavFeedAddress:
      type: object
      properties:
        contract_address:
          type: string
          description: >-
            The EIP-55 checksummed address of the token contract the feed
            prices.
        nav_feed_address:
          type: string
          description: >-
            The EIP-55 checksummed address of the token's Chainlink NAV price
            feed.
      description: A tokenized equity token and its configured Chainlink NAV price feed.
    protobufAny:
      type: object
      properties:
        '@type':
          type: string
      additionalProperties: {}

````