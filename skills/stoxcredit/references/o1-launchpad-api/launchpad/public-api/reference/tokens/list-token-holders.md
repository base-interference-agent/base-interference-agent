> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# List token holders

> Get a provider-backed holder snapshot for one tracked launch token.



## OpenAPI

````yaml /launchpad-api-openapi.yaml get /tokens/{chain_id}/{token_address}/holders
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
  /tokens/{chain_id}/{token_address}/holders:
    get:
      tags:
        - Tokens
      summary: List token holders
      description: Get a provider-backed holder snapshot for one tracked launch token.
      operationId: getTokenHolders
      parameters:
        - name: chain_id
          in: path
          required: true
          description: >-
            Production chain containing the resource: 8453 for Base, 4663 for
            Robinhood Chain, 143 for Monad, 5042 for Arc, 56 for BSC, 196 for X
            Layer, or 99901 for Elysium.
          schema:
            $ref: '#/components/schemas/ChainId'
        - name: token_address
          in: path
          required: true
          description: Launch token contract address.
          schema:
            $ref: '#/components/schemas/Address'
        - name: cursor
          in: query
          description: >-
            Opaque continuation cursor returned by the previous page. Do not
            parse or modify it.
          schema:
            type: string
            maxLength: 4096
        - name: limit
          in: query
          description: Maximum number of holders to return.
          schema:
            type: integer
            minimum: 1
            maximum: 200
            default: 50
      responses:
        '200':
          description: A holder page and snapshot summary.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HolderListResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
        '409':
          $ref: '#/components/responses/Conflict'
        '422':
          $ref: '#/components/responses/Unprocessable'
        '429':
          $ref: '#/components/responses/RateLimited'
        '500':
          $ref: '#/components/responses/InternalError'
        '502':
          $ref: '#/components/responses/UpstreamError'
        '503':
          $ref: '#/components/responses/Unavailable'
        '504':
          $ref: '#/components/responses/UpstreamTimeout'
components:
  schemas:
    ChainId:
      type: integer
      enum:
        - 8453
        - 4663
        - 143
        - 5042
        - 56
        - 196
        - 99901
      examples:
        - 8453
      description: >-
        Production chain ID: 8453 for Base, 4663 for Robinhood Chain, 143 for
        Monad, 5042 for Arc, 56 for BSC, 196 for X Layer, or 99901 for Elysium.
    Address:
      type: string
      pattern: ^0x[0-9a-fA-F]{40}$
      examples:
        - '0x1111111111111111111111111111111111111111'
      description: >-
        EVM address. The zero address represents native currency only where
        documented.
    HolderListResponse:
      type: object
      required:
        - data
        - pagination
        - meta
        - summary
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Holder'
        pagination:
          $ref: '#/components/schemas/Pagination'
        meta:
          $ref: '#/components/schemas/ResponseMeta'
        summary:
          $ref: '#/components/schemas/HolderSummary'
    Holder:
      type: object
      required:
        - address
        - balance_raw
        - balance
      properties:
        address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        balance_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        balance:
          type: string
        value_usd:
          type: number
          minimum: 0
        supply_percent:
          type: number
          minimum: 0
          maximum: 100
    Pagination:
      type: object
      required:
        - next_cursor
        - has_more
        - limit
      properties:
        next_cursor:
          type:
            - string
            - 'null'
        has_more:
          type: boolean
        limit:
          type: integer
          minimum: 1
    ResponseMeta:
      type: object
      required:
        - request_id
        - generated_at
        - warnings
      properties:
        request_id:
          type: string
          examples:
            - req_01JZZZZZZZZZZZZZZZZZZZZZZZ
        generated_at:
          type: string
          format: date-time
          examples:
            - '2026-07-31T12:00:00.000Z'
        warnings:
          type: array
          items:
            type: string
    HolderSummary:
      type: object
      required:
        - status
        - total_holders
        - top_10_percent
      properties:
        status:
          type: string
          const: ready
        total_holders:
          type: integer
          minimum: 0
        top_10_percent:
          type:
            - number
            - 'null'
          minimum: 0
          maximum: 100
    Problem:
      type: object
      required:
        - type
        - title
        - status
        - code
        - detail
        - action
        - instance
        - request_id
      properties:
        type:
          type: string
          format: uri
          description: >-
            Canonical section of the public error guide for this stable problem
            code.
          examples:
            - https://docs.o1.exchange/launchpad/api/errors-and-limits#not-found
        title:
          type: string
        status:
          type: integer
          minimum: 400
          maximum: 599
        code:
          type: string
          enum:
            - invalid_request
            - unknown_parameter
            - duplicate_parameter
            - incompatible_parameters
            - invalid_parameter
            - missing_idempotency_key
            - invalid_idempotency_key
            - missing_api_key
            - invalid_api_key
            - origin_not_allowed
            - insufficient_scope
            - wallet_not_authorized
            - not_found
            - stale_plan
            - stale_quote
            - salt_unavailable
            - invalid_permit
            - approval_not_confirmed
            - announcement_id_conflict
            - cursor_filter_mismatch
            - cursor_stale
            - idempotency_in_progress
            - nothing_to_claim
            - unsupported_operation
            - unsupported_chain
            - idempotency_key_reused
            - invalid_amount
            - invalid_referrer
            - insufficient_balance
            - quote_unavailable
            - simulation_failed
            - rate_limit_exceeded
            - quota_exceeded
            - internal_error
            - upstream_error
            - temporarily_unavailable
            - upstream_timeout
          description: >-
            Stable machine-readable error code. Branch on this value instead of
            detail.
        detail:
          type: string
        action:
          type: string
          description: Safe next step for the caller.
        instance:
          type: string
        request_id:
          type: string
        invalid_parameters:
          type: array
          items:
            $ref: '#/components/schemas/InvalidParameter'
        suggested_endpoint:
          type: string
        resource:
          type: string
        chain_id:
          type: integer
          enum:
            - 8453
            - 4663
            - 143
            - 5042
            - 56
            - 196
            - 99901
          examples:
            - 8453
          description: >-
            Production chain ID: 8453 for Base, 4663 for Robinhood Chain, 143
            for Monad, 5042 for Arc, 56 for BSC, 196 for X Layer, or 99901 for
            Elysium.
        token_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        asset:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        actual_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        required_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
    InvalidParameter:
      type: object
      required:
        - name
        - reason
        - detail
      properties:
        name:
          type: string
        reason:
          type: string
        detail:
          type: string
        allowed:
          type: array
          items:
            type: string
  responses:
    BadRequest:
      description: The request syntax, parameter combination, cursor, or body is invalid.
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
    Unauthorized:
      description: >-
        The API key is missing, malformed, expired, revoked, or otherwise
        invalid.
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
    Forbidden:
      description: >-
        The API key scope, browser origin, or connected wallet is not
        authorized.
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
    NotFound:
      description: The requested tracked launchpad resource does not exist.
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
    Conflict:
      description: >-
        The request conflicts with current cursor, quote, claim, chain, or
        idempotency state.
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
    Unprocessable:
      description: >-
        The request is valid JSON but is unsupported, invalid on-chain, or not
        executable.
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
    RateLimited:
      description: >-
        The key, wallet, token, creator, or expensive operation exceeded a rate
        or concurrency limit.
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
      headers:
        Retry-After:
          description: Seconds until the limited operation may be retried.
          schema:
            type: integer
            minimum: 1
    InternalError:
      description: >-
        An unexpected server fault occurred. Retry once, then contact support
        with the request_id if it persists.
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
    UpstreamError:
      description: >-
        A required chain, metadata, indexer, or holder provider returned an
        invalid response.
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
    Unavailable:
      description: >-
        A required service, chain dependency, cursor signer, or holder snapshot
        is unavailable.
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
    UpstreamTimeout:
      description: A required upstream service timed out.
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: x-api-key
      description: Production API key beginning with o1_launch_.

````

This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.