> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# List Protocol Contract Addresses

> Return the tokenized-stocks protocol contracts deployed on each supported chain.

## Example

```bash cURL theme={null}
curl https://api.coinbase.com/v1/tokenized-stocks/chains
```


## OpenAPI

````yaml openapi/tokenized-equities.json GET /v1/tokenized-stocks/chains
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
  /v1/tokenized-stocks/chains:
    get:
      tags:
        - Tokenized Stocks
      summary: List protocol contract addresses
      description: >-
        Returns the tokenized-stocks protocol contracts deployed on each
        supported chain.
      operationId: listChainContractAddresses
      responses:
        '200':
          description: A successful response.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/v1ListChainContractAddressesResponse'
        default:
          description: An unexpected error response.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rpcStatus'
components:
  schemas:
    v1ListChainContractAddressesResponse:
      type: object
      properties:
        chains:
          type: array
          items:
            $ref: '#/components/schemas/v1ChainContractAddresses'
          description: >-
            The tokenized-equities protocol contract addresses for each
            supported chain.
      description: >-
        Response message for
        `TokenizedEquitiesPublicApiService.ListChainContractAddresses`.
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
    v1ChainContractAddresses:
      type: object
      properties:
        chain_id:
          type: string
          format: uint64
          description: The chain's numeric EVM chain ID.
        chain:
          type: string
          description: The chain's human-readable name.
        policy_registry_address:
          type: string
          description: The address of the PolicyRegistry contract or precompile.
        token_supply_manager_address:
          type: string
          description: The address of the TokenSupplyManager contract.
        token_factory_address:
          type: string
          description: The address of the TokenFactory contract.
      description: A supported chain and its tokenized-equities protocol contracts.
    protobufAny:
      type: object
      properties:
        '@type':
          type: string
      additionalProperties: {}

````