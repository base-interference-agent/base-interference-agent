> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# List fee claims

> Page through fee positions for one wallet.



## OpenAPI

````yaml /launchpad-api-openapi.yaml get /wallets/{address}/fee-claims
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
  /wallets/{address}/fee-claims:
    get:
      tags:
        - Wallets
      summary: List fee claims
      description: Page through fee positions for one wallet.
      operationId: listWalletFeeClaims
      parameters:
        - name: address
          in: path
          required: true
          description: Wallet address.
          schema:
            $ref: '#/components/schemas/Address'
        - name: chain_id
          in: query
          required: true
          description: >-
            Production chain to query: 8453 for Base, 4663 for Robinhood Chain,
            143 for Monad, 5042 for Arc, 56 for BSC, 196 for X Layer, or 99901
            for Elysium.
          example: 8453
          schema:
            $ref: '#/components/schemas/ChainId'
        - name: market
          in: query
          description: >-
            Launch market to include: standard for crypto-paired tokens, rwa for
            stock-paired tokens, or all markets.
          schema:
            type: string
            enum:
              - standard
              - rwa
              - all
            default: all
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
          description: Maximum number of claim positions to return.
          schema:
            type: integer
            minimum: 1
            maximum: 50
            default: 25
        - name: state
          in: query
          description: >-
            claimable returns positions with a confirmed positive balance; all
            also includes empty positions.
          schema:
            type: string
            enum:
              - claimable
              - all
            default: claimable
        - name: currency_address
          in: query
          description: Filter fee positions by payout currency.
          schema:
            $ref: '#/components/schemas/Address'
      responses:
        '200':
          description: A page of fee positions.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WalletFeeClaimsResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
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
    Address:
      type: string
      pattern: ^0x[0-9a-fA-F]{40}$
      examples:
        - '0x1111111111111111111111111111111111111111'
      description: >-
        EVM address. The zero address represents native currency only where
        documented.
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
    WalletFeeClaimsResponse:
      type: object
      required:
        - data
        - pagination
        - meta
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/FeeClaimPosition'
        pagination:
          $ref: '#/components/schemas/Pagination'
        meta:
          $ref: '#/components/schemas/ResponseMeta'
    FeeClaimPosition:
      type: object
      required:
        - kind
        - chain_id
        - market
        - suite
        - fee_escrow_address
        - recipient
        - currency
        - claimable_raw
        - credited_raw
        - claimed_raw
        - reconciliation
      properties:
        kind:
          type: string
          const: fee
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
        market:
          type: string
          enum:
            - standard
            - rwa
          description: >-
            Launch market: standard for crypto-paired tokens or rwa for
            stock-paired tokens.
        suite:
          $ref: '#/components/schemas/SuiteReference'
        fee_escrow_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            Registered FeeEscrow for this position. Copy this value to
            fee_escrow in /claims/fees/prepare.
        recipient:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: Wallet entitled to and receiving this trading-fee balance.
        currency:
          $ref: '#/components/schemas/FeeClaimCurrency'
        claimable_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        credited_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        claimed_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        reconciliation:
          type: string
          enum:
            - confirmed
            - pending
            - unavailable
        last_activity_at:
          type: string
          format: date-time
          examples:
            - '2026-07-31T12:00:00.000Z'
        price_usd:
          type: number
          minimum: 0
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
    SuiteReference:
      type: object
      required:
        - id
      properties:
        id:
          type: string
        version:
          type: string
        dividend_accounting:
          type: string
          enum:
            - allocation-time
            - fee-accrual
        zero_eligible_dividend_policy:
          type: string
          enum:
            - protocol-recipient
    FeeClaimCurrency:
      type: object
      required:
        - address
        - kind
      properties:
        address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            Payout currency. Copy this value to currency in
            /claims/fees/prepare.
        kind:
          type: string
        quote:
          $ref: '#/components/schemas/QuoteAsset'
        token:
          $ref: '#/components/schemas/TokenReference'
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
    QuoteAsset:
      type: object
      required:
        - address
        - symbol
        - decimals
      properties:
        address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        symbol:
          type: string
        decimals:
          type: integer
          minimum: 0
          maximum: 255
        name:
          type: string
        image_url:
          type: string
          format: uri
    TokenReference:
      type: object
      required:
        - chain_id
        - market
        - address
        - name
        - symbol
        - decimals
      properties:
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
        market:
          type: string
          enum:
            - standard
            - rwa
          description: >-
            Launch market: standard for crypto-paired tokens or rwa for
            stock-paired tokens.
        address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        name:
          type: string
        symbol:
          type: string
        decimals:
          type: integer
          minimum: 0
          maximum: 255
        image_url:
          type: string
          format: uri
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