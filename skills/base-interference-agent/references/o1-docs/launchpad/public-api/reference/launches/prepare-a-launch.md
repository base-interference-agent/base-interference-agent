> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Prepare a launch

> Validate inputs and any current creation-fee requirement, pin metadata, mine an 01 address, simulate against the verified chain snapshot, and return unsigned wallet steps.



## OpenAPI

````yaml /launchpad-api-openapi.yaml post /launches/prepare
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
  /launches/prepare:
    post:
      tags:
        - Launches
      summary: Prepare a launch
      description: >-
        Validate inputs and any current creation-fee requirement, pin metadata,
        mine an 01 address, simulate against the verified chain snapshot, and
        return unsigned wallet steps.
      operationId: prepareLaunch
      parameters:
        - name: Idempotency-Key
          in: header
          required: true
          description: >-
            Generate a random UUID for each new request and reuse it only when
            retrying that exact request. A different payload is rejected.
          schema:
            type: string
            minLength: 1
            maxLength: 255
            x-mint:
              pre:
                - Unique retry ID
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LaunchPrepareRequest'
      responses:
        '200':
          description: An unsigned launch transaction plan.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LaunchPrepareResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '409':
          $ref: '#/components/responses/Conflict'
        '413':
          $ref: '#/components/responses/TooLarge'
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
    LaunchPrepareRequest:
      type: object
      required:
        - chain_id
        - creator
        - market
        - quote_address
        - token
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
        creator:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: Wallet that will sign and send the prepared launch transaction.
          not:
            const: '0x0000000000000000000000000000000000000000'
        market:
          type: string
          enum:
            - standard
            - rwa
          description: >-
            Launch route to use. The selected quote must be active for this
            market.
        launch_product:
          type: string
          enum:
            - non-tax
            - tax
            - wsto
          default: non-tax
          description: >-
            Tax selects the additional ERC20 suite, including when both tax
            rates are zero.
        tax:
          $ref: '#/components/schemas/TaxLaunchSettings'
          description: >-
            Required for tax launches; forbidden otherwise. Use the format
            returned for the active deployment. Mixed forms and mismatched
            deployment formats reject before metadata pinning. Live policy
            determines permitted rates, protocol clamps and dividend floor.
        dev_buy:
          type: object
          required:
            - amount_in_raw
            - slippage_bps
          properties:
            amount_in_raw:
              type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Positive raw funding amount below 2^127. Omitted funding_token
                means native 18-decimal transaction units for non-tax/Tax; for
                wstO it preserves raw wstO units. An explicit quote token uses
                its own decimals from GET /config. Arc native USDC must be
                divisible by 10^12; explicit ERC20 USDC uses six decimals.
                Funding is separate from quote volume, creation fees and gas.
              maxLength: 39
            slippage_bps:
              type: integer
              minimum: 1
              maximum: 4999
            funding_token:
              type: string
              pattern: ^0x[0-9a-fA-F]{40}$
              examples:
                - '0x1111111111111111111111111111111111111111'
              description: >-
                Zero address selects native currency. The only ERC20 candidate
                is the selected quote_address, subject to deployed adapter
                admission in GET /config. Omission defaults to native for
                non-tax/Tax and preserves held wstO for wstO. Arc supports
                direct ERC20 USDC, not direct cirBTC. Unsupported wrapped-native
                quotes, other tokens and caller route data are rejected.
          description: >-
            Optional atomic Dev Buy for active creation suites with an admitted
            adapter and reviewed funding route. Native funding requires no ERC20
            approval; transaction value adds the live native creation fee when
            applicable. Quote funding requires exact adapter approval and a
            signed continuation; approval-only responses require repreparation
            before launch calldata is returned. Gas remains additional.
        continuation_id:
          type: string
          minLength: 16
          maxLength: 32768
          description: >-
            Signed approval continuation from the preceding response. Resend the
            unchanged request through the same API key with a new
            Idempotency-Key after the exact approval is confirmed.
        risk_acknowledged:
          type: boolean
          description: >-
            Explicitly accept the warnings in the signed continuation's reviewed
            Dev Buy quote. Requires continuation_id. Cannot override a blocked
            conversion.
        quote_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            Active quote address returned by GET /config for the selected chain
            and market. The zero address represents an active native-currency
            quote.
        token:
          type: object
          required:
            - name
            - symbol
            - image_base64
            - image_type
          properties:
            name:
              type: string
              minLength: 1
              maxLength: 50
              description: Token name.
            symbol:
              type: string
              minLength: 1
              maxLength: 11
              pattern: ^\S+$
              description: Token symbol with no whitespace.
            description:
              type: string
              maxLength: 2000
              default: ''
              description: Optional token description limited to 2000 UTF-8 bytes.
            image_base64:
              type: string
              minLength: 1
              maxLength: 3000000
              contentEncoding: base64
              description: >-
                Valid base64 image data whose decoded bytes are at most 2 MB and
                match image_type.
            image_type:
              type: string
              enum:
                - image/png
                - image/jpeg
                - image/webp
                - image/gif
              description: Image media type. Must match the decoded image_base64 data.
            website:
              anyOf:
                - type: string
                  format: uri
                  maxLength: 2048
                  pattern: ^https?://[^/]*\.[^/]+(?:/.*)?$
                - type: string
                  const: ''
              default: ''
              description: Optional website URL. Leave empty to omit it.
            x:
              anyOf:
                - type: string
                  format: uri
                  maxLength: 2048
                  pattern: ^https?://(?:www\.)?x\.com/.+
                - type: string
                  const: ''
              default: ''
              description: >-
                Optional Twitter/X profile URL. Use an x.com link or leave empty
                to omit it.
            telegram:
              anyOf:
                - type: string
                  format: uri
                  maxLength: 2048
                  pattern: ^https?://(?:www\.)?(?:t\.me|telegram\.me)/.+
                - type: string
                  const: ''
              default: ''
              description: Optional Telegram profile URL. Leave empty to omit it.
            editable_metadata:
              type: boolean
              default: false
              description: >-
                Grant the creator metadata-update authority. This does not grant
                mint, burn, pause, operator, or ownership powers.
            extra_metadata:
              type: array
              maxItems: 16
              default: []
              description: Unique key-value entries with a combined 4096 UTF-8-byte limit.
              items:
                $ref: '#/components/schemas/MetadataPair'
          description: >-
            Token identity, public profile, image, and optional metadata
            settings.
      allOf:
        - if:
            properties:
              launch_product:
                const: tax
            required:
              - launch_product
          then:
            required:
              - tax
          else:
            not:
              required:
                - tax
        - if:
            required:
              - continuation_id
          then:
            required:
              - dev_buy
    LaunchPrepareResponse:
      type: object
      required:
        - data
        - meta
      properties:
        data:
          $ref: '#/components/schemas/LaunchPrepareResult'
        meta:
          $ref: '#/components/schemas/ResponseMeta'
    TaxLaunchSettings:
      oneOf:
        - $ref: '#/components/schemas/PreInclusiveTaxLaunchSettings'
        - $ref: '#/components/schemas/InclusiveTaxLaunchSettings'
    MetadataPair:
      type: object
      required:
        - key
        - value
      properties:
        key:
          type: string
          minLength: 1
          maxLength: 64
          description: Unique metadata key within this request.
        value:
          type: string
          maxLength: 512
          description: Value stored under this metadata key.
    LaunchPrepareResult:
      allOf:
        - $ref: '#/components/schemas/TransactionPlan'
        - type: object
          required:
            - predicted_token_address
            - suite_id
            - metadata_uri
            - image_url
            - review
          properties:
            predicted_token_address:
              type: string
              pattern: ^0x[0-9a-fA-F]{40}$
              examples:
                - '0x1111111111111111111111111111111111111111'
              description: >-
                EVM address. The zero address represents native currency only
                where documented.
            suite_id:
              type: string
            metadata_uri:
              type: string
            image_url:
              type:
                - string
                - 'null'
              format: uri
            creation_fee:
              $ref: '#/components/schemas/CreationFee'
            requires_reprepare:
              type: boolean
              description: >-
                True means no launch step is returned. Complete required
                approvals or explicitly acknowledge the signed quote risk, then
                obtain a fresh final preparation before signing the launch.
            continuation_id:
              type: string
              description: >-
                Opaque signed continuation preserving pinned metadata, salt,
                expected token and reviewed inputs.
            review:
              $ref: '#/components/schemas/LaunchReview'
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
    PreInclusiveTaxLaunchSettings:
      type: object
      required:
        - buy_tax_bps
        - sell_tax_bps
        - creator_allocation_bps
        - dividend_allocation_bps
        - burn_allocation_bps
        - minimum_dividend_holding_raw
        - creator_fee_recipient
        - anti_snipe_enabled
      properties:
        buy_tax_bps:
          type: integer
          minimum: 0
          maximum: 9900
        sell_tax_bps:
          type: integer
          minimum: 0
          maximum: 9900
        creator_allocation_bps:
          type: integer
          minimum: 0
          maximum: 10000
        dividend_allocation_bps:
          type: integer
          minimum: 0
          maximum: 10000
        burn_allocation_bps:
          type: integer
          minimum: 0
          maximum: 10000
        minimum_dividend_holding_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Fixed eligibility minimum in launched-token raw units (18 decimals),
            at most the launch supply. Zero when dividends are disabled.
          maxLength: 78
        creator_fee_recipient:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: Non-zero EVM address.
          not:
            const: '0x0000000000000000000000000000000000000000'
        integrator:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            Optional permanent integrator attribution. Creator or payout
            recipient may be the integrator; unsuitable destinations are
            rejected onchain.
        anti_snipe_enabled:
          type: boolean
          description: Creator opt-in; true requires a positive factory window.
      additionalProperties: false
      description: >-
        Historical pre-inclusive deployments only. Rates and allocations retain
        their original basis-point meaning.
    InclusiveTaxLaunchSettings:
      type: object
      required:
        - format
        - buy_tax_rate
        - sell_tax_rate
        - creator_allocation_share
        - burn_allocation_share
        - dividend_allocation_share
        - integrator_allocation_share
        - minimum_dividend_holding_raw
        - creator_fee_recipient
        - anti_snipe_enabled
      properties:
        format:
          type: string
          const: inclusive
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
            Immutable eligibility threshold in raw launched-token units (18
            decimals), between the admitted factory floor and supply when
            dividends are enabled; zero otherwise.
          maxLength: 78
        creator_fee_recipient:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: Non-zero EVM address.
          not:
            const: '0x0000000000000000000000000000000000000000'
        integrator_fee_recipient:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            Permanent permissionless recipient. Required and nonzero for a
            positive integrator share. Creator/payout overlap is allowed. A
            valid recipient may be recorded with zero share.
        anti_snipe_enabled:
          type: boolean
          description: >-
            Creator opt-in; true requires a positive configured duration.
            Surcharge is additional only during its configured window.
      additionalProperties: false
      description: >-
        Buy/sell totals include protocol. Four allocation shares divide the
        post-protocol remainder and must sum to 100000000 if either side has a
        remainder; otherwise every share and the minimum holding must be zero.
        Exact zero total is allowed only when live bounds permit it.
    TransactionPlan:
      type: object
      required:
        - chain_id
        - actor
        - prepared_at
        - expires_at
        - observed_block
        - issues
        - steps
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
        actor:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: Wallet expected to send the returned transaction steps.
        prepared_at:
          type: string
          format: date-time
          examples:
            - '2026-07-31T12:00:00.000Z'
          description: Time the plan was prepared.
        expires_at:
          type: string
          format: date-time
          examples:
            - '2026-07-31T12:00:00.000Z'
          description: >-
            Complete the plan before this time; expired plans must be prepared
            again.
        observed_block:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: Chain block used for validation and simulation.
        issues:
          type: array
          items:
            $ref: '#/components/schemas/PlanIssue'
          description: Warnings or actions required before execution.
        steps:
          type: array
          items:
            $ref: '#/components/schemas/TransactionStep'
          description: >-
            Unsigned steps in execution order. Follow each step's depends_on
            values.
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
    LaunchReview:
      type: object
      required:
        - market
        - token
        - quote_address
        - total_supply_raw
        - pool_supply_raw
      properties:
        quote_quality:
          $ref: '#/components/schemas/TradeQuoteQuality'
        opening_price_difference_bps:
          type: integer
          minimum: 0
          maximum: 10000
          description: >-
            Gross output value shortfall versus the opening pool price. Includes
            launch fees and price movement; excludes external acquisition loss.
            This is a review signal, not the external conversion hard-block
            metric.
        market:
          type: string
          enum:
            - standard
            - rwa
          description: >-
            Launch market: standard for crypto-paired tokens or rwa for
            stock-paired tokens.
        launch_product:
          type: string
          enum:
            - non-tax
            - tax
            - wsto
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
        quote_revision:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        expected_out_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        minimum_out_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        pool_id:
          type: string
          pattern: ^0x[0-9a-fA-F]{64}$
          examples:
            - '0x1111111111111111111111111111111111111111111111111111111111111111'
          description: 32-byte hexadecimal hash.
        dev_buy:
          type: object
          required:
            - amount_in_raw
            - slippage_bps
            - funding_token
            - spender
          properties:
            amount_in_raw:
              type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Unsigned integer encoded as a base-10 string to preserve full
                precision.
            slippage_bps:
              type: integer
              minimum: 1
              maximum: 4999
            funding_token:
              type: string
              pattern: ^0x[0-9a-fA-F]{40}$
              examples:
                - '0x1111111111111111111111111111111111111111'
              description: >-
                EVM address. The zero address represents native currency only
                where documented.
            funding_decimals:
              type: integer
              minimum: 0
              maximum: 255
              description: >-
                Decimals of the selected funding asset. Native transaction units
                use 18, including Arc native USDC; quote ERC20s use their own
                decimals.
            funding_symbol:
              type: string
            spender:
              type: string
              pattern: ^0x[0-9a-fA-F]{40}$
              examples:
                - '0x1111111111111111111111111111111111111111'
              description: >-
                Bound launch-buy adapter. Only ERC20 funding needs approval;
                native funding plus any native creation fee is sent to the
                Factory through transaction.value.
        native_gas_estimate:
          type: object
          required:
            - gas_units
            - gas_price_wei
            - execution_fee_raw
            - gas_reserve_raw
            - required_balance_raw
            - includes_l1_data_fee
          properties:
            gas_units:
              type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Unsigned integer encoded as a base-10 string to preserve full
                precision.
            gas_price_wei:
              type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Unsigned integer encoded as a base-10 string to preserve full
                precision.
            execution_fee_raw:
              type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Unsigned integer encoded as a base-10 string to preserve full
                precision.
            gas_reserve_raw:
              type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Execution gas estimate with the shared chain-specific launch
                reserve, rounded upward. This native balance requirement is
                additional to ERC20 funding.
            required_balance_raw:
              type: string
              pattern: ^(0|[1-9][0-9]*)$
              examples:
                - '1000000000000000000'
              description: >-
                Unsigned integer encoded as a base-10 string to preserve full
                precision.
            includes_l1_data_fee:
              const: false
        tax:
          $ref: '#/components/schemas/TaxLaunchSettings'
        config_version:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        ordinary_tax_preview:
          type: object
          required:
            - rate_scale
            - buy
            - sell
            - dividends_enabled
          properties:
            rate_scale:
              type: string
              const: '1000000000000000000000000'
            buy:
              $ref: '#/components/schemas/InclusiveOrdinaryTaxRates'
            sell:
              $ref: '#/components/schemas/InclusiveOrdinaryTaxRates'
            dividends_enabled:
              type: boolean
        token:
          type: object
          required:
            - name
            - symbol
            - editable_metadata
            - extra_metadata
          properties:
            name:
              type: string
            symbol:
              type: string
            editable_metadata:
              type: boolean
            extra_metadata:
              type: array
              items:
                $ref: '#/components/schemas/MetadataPair'
        quote_address:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        total_supply_raw:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        pool_supply_raw:
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
    PlanIssue:
      type: object
      required:
        - code
        - severity
      properties:
        code:
          type: string
        severity:
          type: string
          enum:
            - blocking
            - action_required
            - warning
        detail:
          type: string
        asset:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        spender:
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
        remediation_step_id:
          type: string
    TransactionStep:
      oneOf:
        - type: object
          required:
            - id
            - kind
            - label
            - depends_on
            - transaction
          properties:
            id:
              type: string
            kind:
              type: string
              const: transaction
            label:
              type: string
            depends_on:
              type: array
              items:
                type: string
              description: Step IDs that must be completed before this step.
            transaction:
              $ref: '#/components/schemas/TransactionRequest'
            simulation:
              $ref: '#/components/schemas/Simulation'
        - type: object
          required:
            - id
            - kind
            - label
            - depends_on
            - typed_data
          properties:
            id:
              type: string
            kind:
              type: string
              const: typed_data
            label:
              type: string
            depends_on:
              type: array
              items:
                type: string
              description: Step IDs that must be completed before this step.
            typed_data:
              $ref: '#/components/schemas/TypedDataRequest'
            simulation:
              $ref: '#/components/schemas/Simulation'
    TradeQuoteQuality:
      type: object
      required:
        - state
        - reasons
      properties:
        state:
          type: string
          enum:
            - acceptable
            - warning
            - acknowledgement_required
            - blocked
        reasons:
          type: array
          items:
            type: string
        conversionLossBps:
          type: integer
          minimum: 0
          maximum: 10000
          description: >-
            Fee-adjusted external conversion value loss, rounded down for
            display only. Policy thresholds use exact arithmetic.
        conversionLossBelowOneBps:
          type: boolean
          description: >-
            When true, the positive conversion loss is below one basis point
            despite conversionLossBps rounding to zero.
    InclusiveOrdinaryTaxRates:
      type: object
      required:
        - total_tax_rate
        - protocol_rate
        - remaining_tax_rate
        - creator_rate
        - burn_rate
        - dividend_rate
        - integrator_rate
      properties:
        total_tax_rate:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        protocol_rate:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        remaining_tax_rate:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        creator_rate:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        burn_rate:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        dividend_rate:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        integrator_rate:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
    TransactionRequest:
      type: object
      required:
        - chain_id
        - from
        - to
        - data
        - value
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
        from:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: Wallet expected to send this transaction.
        to:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: Verified contract or approval target.
        data:
          type: string
          pattern: ^0x(?:[0-9a-fA-F]{2})*$
          description: Complete transaction calldata. Do not modify it.
        value:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Native-currency value in base units. Use 0 when no native value is
            required.
    Simulation:
      type: object
      required:
        - status
      properties:
        status:
          type: string
          enum:
            - succeeded
            - not_run
          description: >-
            succeeded means the step simulated; not_run means a prerequisite
            must be completed first.
        block_number:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: Block used for simulation when status is succeeded.
    TypedDataRequest:
      type: object
      required:
        - domain
        - types
        - primaryType
        - message
      properties:
        domain:
          $ref: '#/components/schemas/Permit2TypedDataDomain'
        types:
          $ref: '#/components/schemas/Permit2TypedDataTypes'
        primaryType:
          type: string
          const: PermitSingle
        message:
          $ref: '#/components/schemas/Permit2Message'
    Permit2TypedDataDomain:
      type: object
      required:
        - name
        - chainId
        - verifyingContract
      properties:
        name:
          type: string
          const: Permit2
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
        verifyingContract:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
    Permit2TypedDataTypes:
      type: object
      required:
        - PermitSingle
        - PermitDetails
      properties:
        PermitSingle:
          type: array
          items:
            $ref: '#/components/schemas/TypedDataField'
        PermitDetails:
          type: array
          items:
            $ref: '#/components/schemas/TypedDataField'
    Permit2Message:
      type: object
      required:
        - details
        - spender
        - sigDeadline
      properties:
        details:
          $ref: '#/components/schemas/Permit2DetailsMessage'
        spender:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        sigDeadline:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
    TypedDataField:
      type: object
      required:
        - name
        - type
      properties:
        name:
          type: string
        type:
          type: string
    Permit2DetailsMessage:
      type: object
      required:
        - token
        - amount
        - expiration
        - nonce
      properties:
        token:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            EVM address. The zero address represents native currency only where
            documented.
        amount:
          type: string
          pattern: ^(0|[1-9][0-9]*)$
          examples:
            - '1000000000000000000'
          description: >-
            Unsigned integer encoded as a base-10 string to preserve full
            precision.
        expiration:
          type: integer
          minimum: 1
        nonce:
          type: integer
          minimum: 0
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
    TooLarge:
      description: The request body exceeds the operation's supported size.
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