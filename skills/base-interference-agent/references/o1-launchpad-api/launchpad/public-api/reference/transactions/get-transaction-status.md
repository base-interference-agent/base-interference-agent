> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Get transaction status

> Read indexed status for a wallet-broadcast transaction. Data is null until the transaction is observed.



## OpenAPI

````yaml /launchpad-api-openapi.yaml get /transactions/{chain_id}/{tx_hash}
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
  /transactions/{chain_id}/{tx_hash}:
    get:
      tags:
        - Transactions
      summary: Get transaction status
      description: >-
        Read indexed status for a wallet-broadcast transaction. Data is null
        until the transaction is observed.
      operationId: getTransactionStatus
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
        - name: tx_hash
          in: path
          required: true
          description: Transaction hash.
          schema:
            $ref: '#/components/schemas/TransactionHash'
      responses:
        '200':
          description: Indexed launchpad transaction state, or null before it is observed.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TransactionStatusResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
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
    TransactionHash:
      type: string
      pattern: ^0x[0-9a-fA-F]{64}$
      examples:
        - '0x1111111111111111111111111111111111111111111111111111111111111111'
      description: 32-byte hexadecimal hash.
    TransactionStatusResponse:
      type: object
      required:
        - data
        - meta
      properties:
        data:
          oneOf:
            - $ref: '#/components/schemas/TransactionStatus'
            - type: 'null'
        meta:
          $ref: '#/components/schemas/ResponseMeta'
    TransactionStatus:
      type: object
      required:
        - chain_id
        - transaction_hash
        - chain
        - indexing
        - operations
        - launches
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
        transaction_hash:
          type: string
          pattern: ^0x[0-9a-fA-F]{64}$
          examples:
            - '0x1111111111111111111111111111111111111111111111111111111111111111'
          description: 32-byte hexadecimal hash.
        chain:
          type: object
          required:
            - status
            - finality
          properties:
            status:
              type: string
              enum:
                - unknown
                - pending
                - succeeded
                - reverted
                - replaced
            block_number:
              type: integer
              minimum: 0
            replacement_transaction_hash:
              type: string
              pattern: ^0x[0-9a-fA-F]{64}$
              examples:
                - >-
                  0x1111111111111111111111111111111111111111111111111111111111111111
              description: 32-byte hexadecimal hash.
            finality:
              type:
                - string
                - 'null'
              enum:
                - observed
                - confirmed
                - null
        indexing:
          type: object
          required:
            - status
          properties:
            status:
              type: string
              enum:
                - not_seen
                - processing
                - complete
            updated_at:
              type: string
              format: date-time
              examples:
                - '2026-07-31T12:00:00.000Z'
        operations:
          type: array
          items:
            $ref: '#/components/schemas/TransactionOperation'
        launches:
          type: array
          items:
            $ref: '#/components/schemas/TokenListItem'
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
    TransactionOperation:
      type: object
      required:
        - kind
        - onchain
      properties:
        kind:
          type: string
          enum:
            - launch
            - launch_fee
            - trade
            - allocation
            - vesting_registered
            - vesting_claimed
            - fee_claimed
            - claim
            - announcement
            - metadata
        onchain:
          $ref: '#/components/schemas/OnchainReference'
    TokenListItem:
      type: object
      required:
        - chain_id
        - market
        - token
        - launch
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
        token:
          $ref: '#/components/schemas/TokenSummaryIdentity'
        launch:
          $ref: '#/components/schemas/LaunchSummary'
        market_data:
          oneOf:
            - $ref: '#/components/schemas/MarketDataSummary'
            - type: 'null'
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
    OnchainReference:
      type: object
      properties:
        transaction_hash:
          type: string
          pattern: ^0x[0-9a-fA-F]{64}$
          examples:
            - '0x1111111111111111111111111111111111111111111111111111111111111111'
          description: 32-byte hexadecimal hash.
        block_number:
          type: integer
          minimum: 0
        block_hash:
          type: string
          pattern: ^0x[0-9a-fA-F]{64}$
          examples:
            - '0x1111111111111111111111111111111111111111111111111111111111111111'
          description: 32-byte hexadecimal hash.
        log_index:
          type: integer
          minimum: 0
        finality:
          type: string
          enum:
            - observed
            - confirmed
    TokenSummaryIdentity:
      type: object
      required:
        - address
        - name
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
    LaunchSummary:
      type: object
      required:
        - creator_address
        - suite
        - pool_id
        - quote
        - features
        - onchain
        - created_at
      properties:
        creator_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        original_creator_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        current_creator_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        pending_creator_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        creator_fee_recipient:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        suite:
          $ref: '#/components/schemas/SuiteReference'
        pool_id:
          type: string
          pattern: ^0x[0-9a-fA-F]{64}$
          examples:
            - '0x1111111111111111111111111111111111111111111111111111111111111111'
          description: 32-byte hexadecimal hash.
        quote:
          $ref: '#/components/schemas/QuoteIdentity'
        features:
          $ref: '#/components/schemas/LaunchFeatures'
        onchain:
          $ref: '#/components/schemas/OnchainReference'
        created_at:
          type: string
          format: date-time
          examples:
            - '2026-07-31T12:00:00.000Z'
        creation_fee:
          $ref: '#/components/schemas/CreationFee'
    MarketDataSummary:
      type: object
      required:
        - price
        - market_cap
        - liquidity
        - activity
        - last_trade_at
        - quote_price
        - data_status
        - observed_block
        - confirmed_block
        - updated_at
      properties:
        price:
          type: object
          required:
            - quote
            - usd
          properties:
            quote:
              type:
                - number
                - 'null'
            usd:
              type:
                - number
                - 'null'
        market_cap:
          type: object
          required:
            - quote
            - usd
          properties:
            quote:
              type:
                - number
                - 'null'
            usd:
              type:
                - number
                - 'null'
        liquidity:
          type: object
          required:
            - quote
            - usd
          properties:
            quote:
              type:
                - number
                - 'null'
            usd:
              type:
                - number
                - 'null'
        activity:
          type: object
          required:
            - 1h
            - 6h
            - 24h
            - lifetime
          properties:
            1h:
              $ref: '#/components/schemas/MarketWindow'
            6h:
              $ref: '#/components/schemas/MarketWindow'
            24h:
              $ref: '#/components/schemas/MarketWindow'
            lifetime:
              $ref: '#/components/schemas/MarketLifetime'
        last_trade_at:
          oneOf:
            - type: string
              format: date-time
              examples:
                - '2026-07-31T12:00:00.000Z'
            - type: 'null'
        quote_price:
          type: object
          required:
            - usd
            - updated_at
          properties:
            usd:
              type:
                - number
                - 'null'
            updated_at:
              oneOf:
                - type: string
                  format: date-time
                  examples:
                    - '2026-07-31T12:00:00.000Z'
                - type: 'null'
        data_status:
          type: string
          enum:
            - fresh
            - syncing
            - partial
            - stale
        observed_block:
          type:
            - integer
            - 'null'
        confirmed_block:
          type:
            - integer
            - 'null'
        updated_at:
          oneOf:
            - type: string
              format: date-time
              examples:
                - '2026-07-31T12:00:00.000Z'
            - type: 'null'
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
    QuoteIdentity:
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
          type:
            - integer
            - 'null'
          minimum: 0
          maximum: 255
    LaunchFeatures:
      type: object
      required:
        - allocations
        - vesting
        - editable_metadata
      properties:
        allocations:
          type: boolean
        vesting:
          type: boolean
        editable_metadata:
          type: boolean
    CreationFee:
      type: object
      required:
        - amount_raw
        - currency_address
      properties:
        amount_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        currency_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        decimals:
          type: integer
          minimum: 0
          maximum: 255
        symbol:
          type: string
    MarketWindow:
      type: object
      required:
        - trades
        - volume_quote_raw
      properties:
        trades:
          type:
            - integer
            - 'null'
        volume_quote_raw:
          oneOf:
            - type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Unsigned integer encoded as a base-10 string to preserve full
                precision.
            - type: 'null'
        volume_usd:
          type:
            - number
            - 'null'
    MarketLifetime:
      type: object
      required:
        - trades
        - volume_quote_raw
      properties:
        trades:
          type:
            - integer
            - 'null'
        volume_quote_raw:
          oneOf:
            - type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Unsigned integer encoded as a base-10 string to preserve full
                precision.
            - type: 'null'
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