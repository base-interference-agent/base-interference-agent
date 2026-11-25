> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Check API health

> Check service availability and the running API build without querying launchpad data.



## OpenAPI

````yaml /launchpad-api-openapi.yaml get /health
openapi: 3.1.0
info:
  title: o1 Launchpad Public API
  version: 1.0.0
  description: >-
    Non-custodial API for launchpad data and unsigned transaction preparation on
    Base, Robinhood, Monad, Arc and BSC.
servers:
  - url: https://api.launch.o1.exchange/v1
    description: Production
security:
  - ApiKeyAuth: []
tags:
  - name: Meta
    description: Service health and live integration configuration.
  - name: Tokens
    description: Token discovery, detail, activity, and holder data.
  - name: Wallets
    description: Public wallet activity and claim positions.
  - name: Transactions
    description: Indexed launchpad transaction state.
  - name: Launches
    description: Unsigned launch transaction preparation.
  - name: Swaps
    description: Exact-input swap quotes and unsigned router transactions.
  - name: Claims
    description: Unsigned fee and vesting claim transactions.
  - name: Creators
    description: Unsigned creator announcement and metadata transactions.
externalDocs:
  description: Error codes, rate limits, and safe retry guidance
  url: https://docs.o1.exchange/launchpad/api/errors-and-limits
paths:
  /health:
    get:
      tags:
        - Meta
      summary: Check API health
      description: >-
        Check service availability and the running API build without querying
        launchpad data.
      operationId: getHealth
      responses:
        '200':
          description: The API process is available.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Health'
      security: []
components:
  schemas:
    Health:
      type: object
      required:
        - status
        - api_version
        - build_id
        - time
      properties:
        status:
          type: string
          const: ok
        api_version:
          type: string
          const: v1
        build_id:
          type: string
        time:
          type: string
          format: date-time
          examples:
            - '2026-07-31T12:00:00.000Z'
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: x-api-key
      description: Production API key beginning with o1_launch_.

````

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.