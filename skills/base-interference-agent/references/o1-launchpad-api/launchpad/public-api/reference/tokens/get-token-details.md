> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Get token details

> Get one token's launch data and optionally include its pool, market, allocations, vesting, and recent announcements.



## OpenAPI

````yaml /launchpad-api-openapi.yaml get /tokens/{chain_id}/{token_address}
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
  /tokens/{chain_id}/{token_address}:
    get:
      tags:
        - Tokens
      summary: Get token details
      description: >-
        Get one token's launch data and optionally include its pool, market,
        allocations, vesting, and recent announcements.
      operationId: getToken
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
        - name: include
          in: query
          description: >-
            Comma-separated related sections to return: pool, market,
            allocations, vesting, and announcements.
          schema:
            type: string
            default: pool,market
        - name: announcements_limit
          in: query
          description: >-
            Maximum recent announcements. Send only with include=announcements;
            when omitted, the API uses 3.
          schema:
            type: integer
            minimum: 1
            maximum: 10
      responses:
        '200':
          description: Launch and requested token resources.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TokenDetailResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
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
    TokenDetailResponse:
      type: object
      required:
        - data
        - meta
      properties:
        data:
          $ref: '#/components/schemas/TokenDetail'
        meta:
          $ref: '#/components/schemas/ResponseMeta'
    TokenDetail:
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
          $ref: '#/components/schemas/TokenDetailIdentity'
        launch:
          $ref: '#/components/schemas/LaunchDetail'
        pool:
          oneOf:
            - $ref: '#/components/schemas/Pool'
            - type: 'null'
        market_data:
          oneOf:
            - $ref: '#/components/schemas/MarketDataDetail'
            - type: 'null'
        allocations:
          type: array
          items:
            $ref: '#/components/schemas/Allocation'
        vesting:
          type: array
          items:
            $ref: '#/components/schemas/VestingPosition'
        announcements:
          type: array
          items:
            $ref: '#/components/schemas/Announcement'
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
    TokenDetailIdentity:
      type: object
      required:
        - address
        - name
        - symbol
        - decimals
        - total_supply_raw
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
        description:
          type: string
        contract_uri:
          type: string
        website:
          type: string
          format: uri
        x:
          type: string
          format: uri
        telegram:
          type: string
          format: uri
        total_supply_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
    LaunchDetail:
      type: object
      required:
        - creator_address
        - suite
        - pool_id
        - quote
        - features
        - contracts
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
        contracts:
          $ref: '#/components/schemas/LaunchContracts'
        onchain:
          $ref: '#/components/schemas/OnchainReference'
        created_at:
          type: string
          format: date-time
          examples:
            - '2026-07-31T12:00:00.000Z'
        creation_fee:
          $ref: '#/components/schemas/CreationFee'
        tax:
          allOf:
            - $ref: '#/components/schemas/InclusivePoolFees'
            - type: object
              required:
                - dividend_address
                - anti_snipe_enabled
              properties:
                dividend_address:
                  type: string
                  pattern: ^0x[0-9a-fA-F]{40}$
                  examples:
                    - '0x1111111111111111111111111111111111111111'
                  description: >-
                    EVM address. The zero address represents native currency
                    only where documented.
                anti_snipe_enabled:
                  type: boolean
                dividend_accounting:
                  type: string
                  enum:
                    - allocation-time
                    - fee-accrual
                zero_eligible_dividend_policy:
                  type: string
                  enum:
                    - pending-allocation
                    - protocol-recipient
    Pool:
      type: object
      required:
        - pool_id
        - pool_manager_address
        - currency0_address
        - currency1_address
        - token_is_currency0
        - hook_address
        - tick_spacing
        - fees
        - anti_snipe
        - seed
        - onchain
      properties:
        pool_id:
          type: string
          pattern: ^0x[0-9a-fA-F]{64}$
          examples:
            - '0x1111111111111111111111111111111111111111111111111111111111111111'
          description: 32-byte hexadecimal hash.
        pool_manager_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        currency0_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        currency1_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        token_is_currency0:
          type: boolean
        hook_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        creator_buy_router_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            Historical-suite Creator Buy router frozen for this pool. Final
            minimal V4 pools omit this field.
        tick_spacing:
          type: integer
        fees:
          $ref: '#/components/schemas/PoolFees'
        anti_snipe:
          $ref: '#/components/schemas/AntiSnipe'
        seed:
          $ref: '#/components/schemas/PoolSeed'
        onchain:
          $ref: '#/components/schemas/OnchainReference'
    MarketDataDetail:
      type: object
      required:
        - price
        - market_cap
        - liquidity
        - activity
        - last_trade_at
        - unique_traders_24h
        - pool_state
        - fee_revenue
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
            - ath_quote
          properties:
            quote:
              type:
                - number
                - 'null'
            usd:
              type:
                - number
                - 'null'
            ath_quote:
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
        unique_traders_24h:
          type:
            - integer
            - 'null'
        pool_state:
          type: object
          required:
            - tick
            - sqrt_price_x96
            - liquidity_raw
          properties:
            tick:
              type:
                - integer
                - 'null'
            sqrt_price_x96:
              oneOf:
                - type: string
                  pattern: ^(0|[1-9][0-9]*)$
                  examples:
                    - '1000000000000000000'
                  description: >-
                    Unsigned integer encoded as a base-10 string to preserve
                    full precision.
                - type: 'null'
            liquidity_raw:
              oneOf:
                - type: string
                  pattern: ^(0|[1-9][0-9]*)$
                  examples:
                    - '1000000000000000000'
                  description: >-
                    Unsigned integer encoded as a base-10 string to preserve
                    full precision.
                - type: 'null'
        fee_revenue:
          type: array
          items:
            $ref: '#/components/schemas/FeeRevenue'
        quote_burn:
          type: object
          required:
            - coverage
          properties:
            coverage:
              type: string
              enum:
                - complete
                - partial
            trade_count:
              type: integer
              minimum: 0
            amount_raw:
              type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Lifetime quote-token burn in raw quote units, present only when
                canonical burn coverage is complete.
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
    Allocation:
      type: object
      required:
        - recipient
        - amount_raw
        - onchain
      properties:
        recipient:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        amount_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        supply_bps:
          type: integer
          minimum: 0
          maximum: 10000
        onchain:
          $ref: '#/components/schemas/OnchainReference'
    VestingPosition:
      type: object
      required:
        - kind
        - chain_id
        - market
        - suite
        - vault_address
        - token_address
        - token
        - beneficiary
        - total_raw
        - vested_raw
        - claimed_raw
        - claimable_raw
        - state
        - onchain
      properties:
        kind:
          type: string
          const: vesting
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
        vault_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            Registered VestingVault for this position. Copy this value to vault
            in /claims/vesting/prepare.
        token_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: Launch token held by this vesting position.
        token:
          $ref: '#/components/schemas/TokenReference'
        beneficiary:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: Wallet entitled to and receiving the vested tokens.
        total_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        vested_raw:
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
        claimable_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        schedule:
          type: array
          items:
            $ref: '#/components/schemas/VestingPoint'
        next_unlock_at:
          type: string
          format: date-time
          examples:
            - '2026-07-31T12:00:00.000Z'
        completed_at:
          type: string
          format: date-time
          examples:
            - '2026-07-31T12:00:00.000Z'
        state:
          type: string
          enum:
            - locked
            - claimable
            - complete
        price_usd:
          type: number
          minimum: 0
        onchain:
          $ref: '#/components/schemas/VestingOnchainReference'
    Announcement:
      type: object
      required:
        - kind
        - announcement_id
        - token_address
        - creator_address
        - description
        - timestamp
        - onchain
      properties:
        kind:
          type: string
          const: announcement
        announcement_id:
          type: string
          pattern: ^0x[0-9a-fA-F]{64}$
          examples:
            - '0x1111111111111111111111111111111111111111111111111111111111111111'
          description: 32-byte hexadecimal hash.
        token_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        creator_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        description:
          type: string
        uri:
          type: string
        timestamp:
          type: string
          format: date-time
          examples:
            - '2026-07-31T12:00:00.000Z'
        onchain:
          $ref: '#/components/schemas/OnchainReference'
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
    LaunchContracts:
      type: object
      required:
        - factory_address
        - hook_address
        - fee_escrow_address
        - announcement_registry_address
      properties:
        factory_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        hook_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        fee_escrow_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        vesting_vault_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        announcement_registry_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
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
    InclusivePoolFees:
      type: object
      required:
        - format
        - percentage_scale
        - rate_scale
        - config_version
        - configuration
        - protocol
        - admission
        - integrator_fee_recipient
      properties:
        format:
          type: string
          const: inclusive
        percentage_scale:
          type: string
          const: '100000000'
        rate_scale:
          type: string
          const: '1000000000000000000000000'
        config_version:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        configuration:
          type: object
          required:
            - buy_tax_rate
            - sell_tax_rate
            - creator_allocation_share
            - burn_allocation_share
            - dividend_allocation_share
            - integrator_allocation_share
            - minimum_dividend_holding_raw
          properties:
            buy_tax_rate:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            sell_tax_rate:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            creator_allocation_share:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            burn_allocation_share:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            dividend_allocation_share:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            integrator_allocation_share:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            minimum_dividend_holding_raw:
              type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Unsigned integer encoded as a base-10 string to preserve full
                precision.
        protocol:
          type: object
          required:
            - protocol_tax_share
            - minimum_protocol_fee_rate
            - maximum_protocol_fee_rate
            - protocol_fee_recipient
          properties:
            protocol_tax_share:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            minimum_protocol_fee_rate:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            maximum_protocol_fee_rate:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            protocol_fee_recipient:
              type: string
              pattern: ^0x[0-9a-fA-F]{40}$
              examples:
                - '0x1111111111111111111111111111111111111111'
              description: >-
                EVM address. The zero address represents native currency only
                where documented.
        admission:
          type: object
          required:
            - minimum_buy_tax_rate
            - maximum_buy_tax_rate
            - minimum_sell_tax_rate
            - maximum_sell_tax_rate
            - minimum_dividend_holding_requirement
          properties:
            minimum_buy_tax_rate:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            maximum_buy_tax_rate:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            minimum_sell_tax_rate:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            maximum_sell_tax_rate:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            minimum_dividend_holding_requirement:
              type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Unsigned integer encoded as a base-10 string to preserve full
                precision.
        integrator_fee_recipient:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
    PoolFees:
      oneOf:
        - $ref: '#/components/schemas/HistoricalPoolFees'
        - $ref: '#/components/schemas/InclusivePoolFees'
    AntiSnipe:
      oneOf:
        - $ref: '#/components/schemas/HistoricalAntiSnipe'
        - $ref: '#/components/schemas/InclusiveAntiSnipe'
    PoolSeed:
      type: object
      required:
        - positions
      properties:
        token_amount_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        positions:
          type: array
          items:
            $ref: '#/components/schemas/PoolSeedPosition'
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
    FeeRevenue:
      type: object
      required:
        - currency_address
        - creator_raw
        - referrer_raw
        - platform_raw
      properties:
        currency_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        creator_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        referrer_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        platform_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Backward-compatible alias for protocol_raw. Includes platform,
            additional fixed, and unmatched protocol credits.
        protocol_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Combined protocol fee credits, including zero-eligible-holder
            Dividend redirection. Source subtotals are included, not additional
            revenue.
        dividend_redirect_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Dividend fees credited to the frozen protocol recipient because no
            shares were eligible. Included in protocol_raw; this is not a
            separate claim balance.
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
    VestingPoint:
      type: object
      required:
        - unlocks_at
        - cumulative_amount_raw
        - cumulative_bps
      properties:
        unlocks_at:
          type: string
          format: date-time
          examples:
            - '2026-07-31T12:00:00.000Z'
        cumulative_amount_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        cumulative_bps:
          type: integer
          minimum: 0
          maximum: 10000
    VestingOnchainReference:
      type: object
      required:
        - transaction_hash
        - finality
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
    HistoricalPoolFees:
      type: object
      required:
        - base_fee_bps
        - distribution_bps
      properties:
        base_fee_bps:
          type: integer
          minimum: 0
          maximum: 10000
        distribution_bps:
          $ref: '#/components/schemas/FeeDistribution'
        components:
          type: array
          items:
            $ref: '#/components/schemas/FeeComponent'
    HistoricalAntiSnipe:
      type: object
      required:
        - clock
        - start_total_bps
      properties:
        clock:
          type: string
          enum:
            - block
            - timestamp
        start_total_bps:
          type: integer
          minimum: 0
          maximum: 10000
        window_seconds:
          type: integer
          minimum: 0
        launch_time:
          type: string
          format: date-time
          examples:
            - '2026-07-31T12:00:00.000Z'
        window_blocks:
          type: integer
          minimum: 0
        launch_block:
          type: integer
          minimum: 0
    InclusiveAntiSnipe:
      type: object
      required:
        - clock
        - start_total_fee_rate
        - enabled
        - window_seconds
        - launch_time
      properties:
        clock:
          type: string
          const: timestamp
        start_total_fee_rate:
          type: string
          pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
          maxLength: 9
          description: >-
            Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
            0.000001%. Not basis points.
        enabled:
          type: boolean
        window_seconds:
          type: integer
          minimum: 0
        launch_time:
          type: string
          format: date-time
          examples:
            - '2026-07-31T12:00:00.000Z'
    PoolSeedPosition:
      type: object
      required:
        - tick_lower
        - tick_upper
        - liquidity_raw
      properties:
        tick_lower:
          type: integer
        tick_upper:
          type: integer
        liquidity_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
    FeeDistribution:
      type: object
      required:
        - creator
        - platform
        - referrer
      properties:
        creator:
          type: integer
          minimum: 0
          maximum: 10000
        platform:
          type: integer
          minimum: 0
          maximum: 10000
        referrer:
          type: integer
          minimum: 0
          maximum: 10000
    FeeComponent:
      type: object
      required:
        - id
        - kind
        - recipient
        - fee_bps
      properties:
        id:
          type: string
          pattern: ^0x[0-9a-fA-F]{64}$
          examples:
            - '0x1111111111111111111111111111111111111111111111111111111111111111'
          description: 32-byte hexadecimal hash.
        kind:
          type: string
          enum:
            - creator
            - platform
            - referrer
            - fixed
        recipient:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        fee_bps:
          type: integer
          minimum: 0
          maximum: 10000
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