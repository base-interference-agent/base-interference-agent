> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Get API configuration

> Get production suites, contract addresses, quote assets, capabilities, and live creation state for one chain.



## OpenAPI

````yaml /launchpad-api-openapi.yaml get /config
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
  /config:
    get:
      tags:
        - Meta
      summary: Get API configuration
      description: >-
        Get production suites, contract addresses, quote assets, capabilities,
        and live creation state for one chain.
      operationId: getConfig
      parameters:
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
        - name: launch_product
          in: query
          description: >-
            Select a launch product. Omitted means non-tax. wsto uses its
            registered Base or Robinhood suite; creation and Dev Buy require
            live suite and adapter admission.
          schema:
            type: string
            enum:
              - non-tax
              - tax
              - wsto
            default: non-tax
        - name: include
          in: query
          description: 'Comma-separated sections to return: chains, suites, and quotes.'
          schema:
            type: string
            default: chains,suites,quotes
        - name: active_only
          in: query
          description: >-
            When true, omit historical suites and quote assets that cannot
            create new launches.
          schema:
            type: boolean
            default: true
      responses:
        '200':
          description: Current launchpad integration configuration.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ConfigurationResponse'
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
    ConfigurationResponse:
      type: object
      required:
        - data
        - meta
      properties:
        data:
          $ref: '#/components/schemas/Configuration'
        meta:
          $ref: '#/components/schemas/ResponseMeta'
    Configuration:
      type: object
      properties:
        chain:
          $ref: '#/components/schemas/ChainConfiguration'
        supported_chain_ids:
          type: array
          items:
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
        suites:
          type: array
          items:
            $ref: '#/components/schemas/ContractSuite'
        quotes:
          type: array
          items:
            $ref: '#/components/schemas/QuoteConfiguration'
        as_of_block:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
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
    ChainConfiguration:
      type: object
      required:
        - chain_id
        - name
        - native_currency
        - capabilities
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
        name:
          type: string
        native_currency:
          type: object
          required:
            - symbol
            - decimals
          properties:
            symbol:
              type: string
            decimals:
              type: integer
              minimum: 0
              maximum: 255
        capabilities:
          $ref: '#/components/schemas/ChainCapabilities'
    ContractSuite:
      type: object
      required:
        - id
        - version
        - chain_id
        - route
        - supported_routes
        - active_for_creation
        - creation_available
        - first_block
        - token_mode
        - contracts
        - capabilities
      properties:
        id:
          type: string
        version:
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
        route:
          type: string
          enum:
            - standard
            - rwa
          description: >-
            Launch market: standard for crypto-paired tokens or rwa for
            stock-paired tokens.
        supported_routes:
          type: array
          items:
            type: string
            enum:
              - standard
              - rwa
            description: >-
              Launch market: standard for crypto-paired tokens or rwa for
              stock-paired tokens.
          minItems: 1
          uniqueItems: true
        active_for_creation:
          type: boolean
        creation_available:
          type: boolean
        first_block:
          type: integer
          minimum: 0
        token_mode:
          type: string
          enum:
            - b20
            - erc20
        launch_product:
          type: string
          enum:
            - non-tax
            - tax
            - wsto
        tax_format:
          type: string
          enum:
            - pre-inclusive
            - inclusive
          description: >-
            Verified deployment ABI and economics. Never infer it from a version
            label or reuse raw inputs across formats.
        dividend_claims:
          oneOf:
            - type: object
              required:
                - kind
              properties:
                kind:
                  const: permissionless
            - type: object
              required:
                - kind
                - helper
              properties:
                kind:
                  const: holder-authorized
                helper:
                  type: string
                  pattern: ^0x[0-9a-fA-F]{40}$
                  examples:
                    - '0x1111111111111111111111111111111111111111'
                  description: >-
                    EVM address. The zero address represents native currency
                    only where documented.
        dividend_accounting:
          type: string
          enum:
            - allocation-time
            - fee-accrual
          description: >-
            Reward assignment timing, independent of the capability-family
            version and immutable deployment ID.
        zero_eligible_dividend_policy:
          type: string
          enum:
            - protocol-recipient
          description: >-
            Fee-accrual launches credit their frozen protocol recipient when no
            recorded shares are eligible.
        tax_policy:
          oneOf:
            - $ref: '#/components/schemas/PreInclusiveTaxPolicy'
            - $ref: '#/components/schemas/InclusiveTaxPolicy'
        config_version:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        launch_supply_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        launch_creation_enabled:
          type: boolean
        launch_buy_adapter_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            Current Factory atomic launch-buy adapter. The zero address disables
            only createLaunchAndBuy.
        creation_fee:
          oneOf:
            - $ref: '#/components/schemas/ConfigurationCreationFee'
            - type: object
              required:
                - amount_raw
                - currency
              properties:
                amount_raw:
                  const: '0'
                currency:
                  const: none
        burn_rates:
          type: object
          required:
            - buy_burn_rate
            - sell_burn_rate
            - rate_scale
          properties:
            buy_burn_rate:
              type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Unsigned integer encoded as a base-10 string to preserve full
                precision.
            sell_burn_rate:
              type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Unsigned integer encoded as a base-10 string to preserve full
                precision.
            rate_scale:
              const: '100000000'
        dev_buy:
          type: object
          required:
            - input_currency
            - approval_spender
            - requires_reprepare_after_approval
          properties:
            input_currency:
              type: string
              enum:
                - paired_quote
                - native
              description: >-
                Default funding when funding_token is omitted: paired wstO for
                wstO; native transaction units for other products.
            approval_spender:
              const: launch_buy_adapter
            requires_reprepare_after_approval:
              const: true
            funding_tokens:
              type: array
              items:
                type: string
                pattern: ^0x[0-9a-fA-F]{40}$
                examples:
                  - '0x1111111111111111111111111111111111111111'
                description: >-
                  EVM address. The zero address represents native currency only
                  where documented.
              description: >-
                Configured route candidates. Existing wstO paired-quote
                advertisement is retained; inspect quote_routes for
                binding/availability. Preparation must verify the complete
                transaction.
            api_supported:
              type: boolean
            adapter_attached:
              type: boolean
            adapter_binding_status:
              type: string
              enum:
                - matches
                - mismatch
                - unavailable
                - not_checked
              description: >-
                Factory/Hook attachment and router-address agreement only, not
                runtime admission.
            adapter_admission:
              const: required_during_preparation
            router_address:
              anyOf:
                - type: string
                  pattern: ^0x[0-9a-fA-F]{40}$
                  examples:
                    - '0x1111111111111111111111111111111111111111'
                  description: >-
                    EVM address. The zero address represents native currency
                    only where documented.
                - type: 'null'
            requires_amount_simulation:
              const: true
            quote_routes:
              type: array
              items:
                type: object
                required:
                  - quote_address
                  - funding_assets
                  - route_configured
                  - unavailable_reason
                properties:
                  quote_address:
                    type: string
                    pattern: ^0x[0-9a-fA-F]{40}$
                    examples:
                      - '0x1111111111111111111111111111111111111111'
                    description: >-
                      EVM address. The zero address represents native currency
                      only where documented.
                  route_configured:
                    type: boolean
                    description: >-
                      Source route, basic live binding and creation admission.
                      Never executable-liquidity proof.
                  unavailable_reason:
                    type:
                      - string
                      - 'null'
                  funding_assets:
                    type: array
                    items:
                      type: object
                      required:
                        - address
                        - symbol
                        - decimals
                        - amount_step_raw
                        - requires_approval
                        - requires_reprepare_after_approval
                      properties:
                        address:
                          type: string
                          pattern: ^0x[0-9a-fA-F]{40}$
                          examples:
                            - '0x1111111111111111111111111111111111111111'
                          description: >-
                            EVM address. The zero address represents native
                            currency only where documented.
                        symbol:
                          type: string
                        decimals:
                          type: integer
                          minimum: 0
                          maximum: 255
                        amount_step_raw:
                          type: string
                          pattern: ^(0|[1-9][0-9]*)$
                          examples:
                            - '1000000000000000000'
                          description: >-
                            Unsigned integer encoded as a base-10 string to
                            preserve full precision.
                        requires_approval:
                          type: boolean
                        requires_reprepare_after_approval:
                          type: boolean
        contracts:
          $ref: '#/components/schemas/SuiteContracts'
        capabilities:
          $ref: '#/components/schemas/SuiteCapabilities'
    QuoteConfiguration:
      type: object
      required:
        - address
        - symbol
        - decimals
        - route
        - suite_id
        - registered
        - selectable
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
        name:
          type: string
        decimals:
          type: integer
          minimum: 0
          maximum: 255
        asset_type:
          type:
            - string
            - 'null'
          enum:
            - native
            - stablecoin
            - wrapped_crypto
            - crypto_token
            - tokenized_security
            - null
          description: >-
            Explicit catalog classification; crypto_token covers direct protocol
            and ecosystem tokens, while tokenized_security includes stock and
            ETF tokens. Null when unclassified. Independent of launch route and
            contract family.
        issuer:
          oneOf:
            - $ref: '#/components/schemas/QuoteIssuer'
            - type: 'null'
          description: >-
            Offchain catalog attribution. Null for native assets or an
            unverified issuer; null does not mean trustless. Not inferred from
            ticker, address prefix, or pricing provider.
        route:
          type: string
          enum:
            - standard
            - rwa
          description: >-
            Launch market: standard for crypto-paired tokens or rwa for
            stock-paired tokens.
        suite_id:
          type: string
        registered:
          type: boolean
        selectable:
          type: boolean
        swap_settlement_tokens:
          type: array
          items:
            type: string
            pattern: ^0x[0-9a-fA-F]{40}$
            examples:
              - '0x1111111111111111111111111111111111111111'
            description: >-
              EVM address. The zero address represents native currency only
              where documented.
          description: >-
            Reviewed exact-input buy/sell settlement route candidates for a
            launch paired with this quote, not a claim of current liquidity or
            runtime readiness.
        swap_execution_check:
          const: required_for_requested_amount
        quote_revision:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        creation_fee:
          $ref: '#/components/schemas/ConfigurationCreationFee'
        market_data:
          oneOf:
            - $ref: '#/components/schemas/QuoteMarketData'
            - type: 'null'
          description: >-
            Optional shared cached projection keyed by exact quote identity.
            Uses camelCase fields shared with the app. Does not authorize a
            launch or trade; live configuration and transaction preflight remain
            authoritative.
        market_data_status:
          type: string
          enum:
            - available
            - unavailable
          description: >-
            Availability of the optional shared projection read, independent of
            each observation status and quote selectability.
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
    ChainCapabilities:
      type: object
      required:
        - launch_token_mode
        - b20_asset_status
      properties:
        launch_token_mode:
          type: string
          enum:
            - b20
            - erc20
        b20_asset_status:
          type: string
          enum:
            - active
            - inactive
            - not_checked
            - not_applicable
          description: >-
            Live B20 feature status. Static chain-only requests return
            not_checked; non-B20 chains return not_applicable.
    PreInclusiveTaxPolicy:
      type: object
      required:
        - buy_min_bps
        - buy_max_bps
        - sell_min_bps
        - sell_max_bps
        - base_fee_bps
        - anti_snipe_window_seconds
        - anti_snipe_start_total_bps
      properties:
        buy_min_bps:
          type: integer
          minimum: 0
          maximum: 9900
        buy_max_bps:
          type: integer
          minimum: 0
          maximum: 9900
        sell_min_bps:
          type: integer
          minimum: 0
          maximum: 9900
        sell_max_bps:
          type: integer
          minimum: 0
          maximum: 9900
        base_fee_bps:
          type: integer
          minimum: 0
          maximum: 9900
        anti_snipe_window_seconds:
          type: integer
          minimum: 0
        anti_snipe_start_total_bps:
          type: integer
          minimum: 0
          maximum: 9900
    InclusiveTaxPolicy:
      type: object
      required:
        - format
        - percentage_scale
        - rate_scale
        - tax_fee_bounds
        - protocol_fee_configuration
        - anti_snipe_configuration
        - minimum_dividend_holding_requirement_raw
      properties:
        format:
          const: inclusive
        percentage_scale:
          type: string
          const: '100000000'
        rate_scale:
          type: string
          const: '1000000000000000000000000'
        tax_fee_bounds:
          type: object
          required:
            - minimum_buy_tax_rate
            - maximum_buy_tax_rate
            - minimum_sell_tax_rate
            - maximum_sell_tax_rate
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
        protocol_fee_configuration:
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
        anti_snipe_configuration:
          type: object
          required:
            - start_total_fee_rate
            - window_seconds
          properties:
            start_total_fee_rate:
              type: string
              pattern: ^(?:0|[1-9][0-9]{0,7}|100000000)$
              maxLength: 9
              description: >-
                Exact percentage units: 100000000 = 100%, 1000000 = 1%, 1 =
                0.000001%. Not basis points.
            window_seconds:
              type: integer
              minimum: 0
        minimum_dividend_holding_requirement_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
    ConfigurationCreationFee:
      type: object
      required:
        - amount_raw
        - currency
        - symbol
        - decimals
      properties:
        amount_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        currency:
          type: string
        symbol:
          type: string
        decimals:
          type: integer
          minimum: 0
          maximum: 255
    SuiteContracts:
      type: object
      required:
        - factory
        - hook
        - announcement_registry
        - pool_manager
        - state_view
        - quoter
      properties:
        factory:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        hook:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        fee_escrow:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        vesting_vault:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        announcement_registry:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        pool_manager:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        state_view:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        quoter:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        universal_router:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        swapx_router:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        permit2:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
    SuiteCapabilities:
      type: object
      required:
        - launch_creation_fee
        - announcements
        - editable_metadata
        - vesting
        - creator_rights
        - atomic_launch_buy
        - generic_fee_components
        - quote_revisions
        - launch_creation_switch
      properties:
        launch_creation_fee:
          type: boolean
        announcements:
          type: boolean
        editable_metadata:
          type: boolean
        vesting:
          type: boolean
        creator_rights:
          type: boolean
        atomic_launch_buy:
          type: boolean
          description: >-
            Immutable contract capability; does not establish API admission or
            current route liquidity.
        api_atomic_launch_buy:
          type: boolean
          description: >-
            Endpoint support for this active creation suite. See
            dev_buy.quote_routes and complete preparation for runtime, funding
            and amount checks.
        generic_fee_components:
          type: boolean
        quote_revisions:
          type: boolean
        launch_creation_switch:
          type: boolean
    QuoteIssuer:
      type: object
      required:
        - id
        - name
        - legal_entities
        - sources
      properties:
        id:
          type: string
          description: >-
            Stable catalog issuer identifier. Not an onchain issuer allowlist or
            security approval.
        name:
          type: string
          description: Issuer or issuing product family name.
        legal_entities:
          type: array
          items:
            type: string
          description: >-
            Legal issuer entities supported by the linked sources. Empty when
            only the issuing brand is verified.
        sources:
          type: array
          items:
            type: string
            format: uri
          description: >-
            Official issuer or product evidence. Recheck when onboarding a new
            address.
    QuoteMarketData:
      type: object
      required:
        - chainId
        - quoteAddress
        - decimals
        - lastAttemptAt
        - marketStatus
        - liquidityStatus
        - supplyStatus
        - reference
        - suites
      properties:
        chainId:
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
        quoteAddress:
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
        lastAttemptAt:
          type: integer
          minimum: 0
          examples:
            - 1785499200000
        market:
          $ref: '#/components/schemas/QuoteMarketObservation'
        supply:
          $ref: '#/components/schemas/QuoteSupplyObservation'
        poolDiscovery:
          $ref: '#/components/schemas/QuotePoolDiscovery'
        marketStatus:
          $ref: '#/components/schemas/QuoteObservationStatus'
        liquidityStatus:
          $ref: '#/components/schemas/QuoteObservationStatus'
        supplyStatus:
          $ref: '#/components/schemas/QuoteObservationStatus'
        reference:
          $ref: '#/components/schemas/QuoteReferenceObservation'
        suites:
          type: array
          items:
            $ref: '#/components/schemas/QuoteSuiteObservation'
    QuoteMarketObservation:
      type: object
      required:
        - sourceAddress
        - sourceNetworkId
        - observedAt
      properties:
        sourceAddress:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        sourceNetworkId:
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
        observedAt:
          type: integer
          minimum: 0
          examples:
            - 1785499200000
        sourceTimestamp:
          type: integer
          description: >-
            Provider price source time in Unix seconds, absent when unknown. Not
            the fetch time.
        blockNumber:
          type: integer
          minimum: 0
        priceUsd:
          type: number
          description: USD market price per whole physical quote token.
        liquidityUsd:
          type: string
          description: >-
            Codex aggregate market liquidity in USD. Not executable depth,
            direct settlement liquidity, or launch-pool liquidity.
        priceChange24:
          type: number
          description: 'Fractional 24-hour price change: 0.1 means 10%.'
        error:
          type: string
    QuoteSupplyObservation:
      type: object
      required:
        - observedAt
      properties:
        observedAt:
          type: integer
          minimum: 0
          examples:
            - 1785499200000
        blockNumber:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        blockHash:
          type: string
          pattern: ^0x[0-9a-fA-F]{64}$
          examples:
            - '0x1111111111111111111111111111111111111111111111111111111111111111'
          description: 32-byte hexadecimal hash.
        totalSupplyRaw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        unitsPerWholeToken:
          type: string
          description: >-
            Underlying units represented by one whole quote token at the
            recorded block.
        underlyingEquivalent:
          type: string
          description: >-
            Total token supply converted once to underlying units. Does not
            prove custody or redeemability.
        error:
          type: string
    QuotePoolDiscovery:
      type: object
      required:
        - observedAt
        - scope
        - pools
      properties:
        observedAt:
          type: integer
          minimum: 0
          examples:
            - 1785499200000
        scope:
          type: string
          const: codex-top-pools
        error:
          type: string
        pools:
          type: array
          items:
            $ref: '#/components/schemas/QuoteMarketPool'
          maxItems: 3
          description: >-
            Bounded named quote-token markets. An empty successful result
            applies only to this source and scope.
    QuoteObservationStatus:
      type: string
      enum:
        - available
        - stale
        - unavailable
        - unknown
      description: >-
        Independent observation status. Unknown means not checked; unavailable
        is not proof of no market. An available value with no source timestamp
        does not establish source freshness.
    QuoteReferenceObservation:
      type: object
      required:
        - priceUsd
        - status
      properties:
        priceUsd:
          type:
            - number
            - 'null'
        status:
          type: string
          enum:
            - fresh
            - unavailable
          description: >-
            Legacy display-reference availability. Inspect sourceAgeUnknown and
            observationBasis before interpreting freshness.
        provider:
          type: string
        sourceTimestamp:
          type: integer
          description: Source time in Unix seconds, absent when unknown.
        sourceAgeUnknown:
          type: boolean
        observationBasis:
          type: string
          enum:
            - reference
            - market
            - indicative
        receivedAtMs:
          type: integer
          minimum: 0
          examples:
            - 1785499200000
          description: Fetch receipt time, never a substitute for source time.
    QuoteSuiteObservation:
      type: object
      required:
        - suiteId
        - factory
      properties:
        suiteId:
          type: string
        factory:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        observedAt:
          type: integer
          minimum: 0
          examples:
            - 1785499200000
        registered:
          type: boolean
        creationEnabled:
          type: boolean
        error:
          type: string
    QuoteMarketPool:
      type: object
      required:
        - poolId
        - protocol
        - exchange
        - token0
        - token1
        - liquidityUsd
      properties:
        poolId:
          type: string
          description: Pool address or pool ID from the source; may be a 32-byte pool ID.
        protocol:
          type: string
        exchange:
          type: string
        token0:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        token1:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        liquidityUsd:
          type: string
          description: >-
            Provider estimate of pool TVL in USD. Not reserves or an
            amount-specific execution quote.
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