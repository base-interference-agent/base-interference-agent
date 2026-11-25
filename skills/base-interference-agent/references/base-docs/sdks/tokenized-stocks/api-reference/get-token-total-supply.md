> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Get Token Total Supply

> Return a tokenized stock's ERC-20 total supply, normalized by the token's decimals.

## Example

This example uses AMDc. For other tokens, use an address returned by [List Tokenized Stocks](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-tokenized-stocks.md).

```bash cURL theme={null}
curl https://api.coinbase.com/v1/tokenized-stocks/total-supply/0xB2000000000000000000000d8Ce462E99ee7A47B
```

The response is a JSON number, not an object with a `total_supply` property. It is normalized by the token's decimals, so do not divide it again.

A malformed contract address returns HTTP `400` with service code `3`. A correctly formatted address that is not a supported tokenized equity token returns HTTP `404` with service code `5`.


## OpenAPI

````yaml openapi/tokenized-equities.json GET /v1/tokenized-stocks/total-supply/{contract_address}
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
  /v1/tokenized-stocks/total-supply/{contract_address}:
    get:
      tags:
        - Tokenized Stocks
      summary: Get token total supply
      description: >-
        Returns the token's ERC-20 total supply, normalized by the token's
        decimals. This is a token-unit amount, not the number of underlying
        shares.
      operationId: getTokenTotalSupply
      parameters:
        - name: contract_address
          description: >-
            The address of the ERC-20 token contract on Base. Find token
            addresses on the [Base assets
            page](https://www.base.org/assets?utm_source=docs) or from `GET
            /v1/tokenized-stocks`.
          in: path
          required: true
          schema:
            type: string
            pattern: ^0x[a-fA-F0-9]{40}$
      responses:
        '200':
          description: >-
            The token's total supply, normalized by the token's decimals. This
            is a token-unit amount, not the number of underlying shares;
            multiply by `multiplier` to convert to shares.
          content:
            application/json:
              schema:
                type: number
                format: double
        '400':
          description: The contract address is not a 20-byte hexadecimal address.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rpcStatus'
              example:
                code: 3
                message: field 'contract_address' must be a 20-byte hex address
        '404':
          description: The address is not a supported tokenized equity token.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rpcStatus'
              example:
                code: 5
                message: >-
                  contract_address "0x0000000000000000000000000000000000000001"
                  is not a supported tokenized equity token
        default:
          description: An unexpected error response.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rpcStatus'
components:
  schemas:
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