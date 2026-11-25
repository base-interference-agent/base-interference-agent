> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Prepare holder Dividend claims

> Resolve each publicly supported token's factory-bound Dividend clone, read live assigned rewards and recorded receiver, simulate the holder's exact claim, and return 1 to 10 independent unsigned transactions (atomic: false). Uses claims:prepare. The holder must initiate each claim, including smart wallets; no token approvals are required. Fee-accrual rewards are already assigned. Claim automatically retrieves the clone's full escrow entry when local backing is insufficient and pays only the claimant's earned amount. Historical distribution operation values return 422 unsupported_operation; index-only old suites are not publicly preparable. Claims can remain available after selling. Deficit or backing totals alone do not guarantee or preclude payment; exact simulation checks receiver and full-entry redemption behavior. simulated_holder_paid is a simulation result, not an executed payment. This API does not use the browser's atomic Claim all helper, and independently submitted transactions can succeed or fail separately.



## OpenAPI

````yaml /launchpad-api-openapi.yaml post /claims/dividends/prepare
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
  /claims/dividends/prepare:
    post:
      tags:
        - Claims
      summary: Prepare holder Dividend claims
      description: >-
        Resolve each publicly supported token's factory-bound Dividend clone,
        read live assigned rewards and recorded receiver, simulate the holder's
        exact claim, and return 1 to 10 independent unsigned transactions
        (atomic: false). Uses claims:prepare. The holder must initiate each
        claim, including smart wallets; no token approvals are required.
        Fee-accrual rewards are already assigned. Claim automatically retrieves
        the clone's full escrow entry when local backing is insufficient and
        pays only the claimant's earned amount. Historical distribution
        operation values return 422 unsupported_operation; index-only old suites
        are not publicly preparable. Claims can remain available after selling.
        Deficit or backing totals alone do not guarantee or preclude payment;
        exact simulation checks receiver and full-entry redemption behavior.
        simulated_holder_paid is a simulation result, not an executed payment.
        This API does not use the browser's atomic Claim all helper, and
        independently submitted transactions can succeed or fail separately.
      operationId: prepareDividendClaims
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DividendClaimsPrepareRequest'
      responses:
        '200':
          description: Unsigned holder-dividend transactions.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DividendClaimsPrepareResponse'
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
    DividendClaimsPrepareRequest:
      type: object
      required:
        - chain_id
        - caller
        - claims
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
        caller:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: >-
            Holder wallet sending its own unsigned claim transactions, including
            a smart wallet. Payment goes to the recorded receiver; claims need
            no token approval.
          not:
            const: '0x0000000000000000000000000000000000000000'
        claims:
          type: array
          minItems: 1
          maxItems: 10
          items:
            type: object
            required:
              - token_address
              - holder
              - operation
              - unwrap_native
            properties:
              token_address:
                type: string
                pattern: ^0x[0-9a-fA-F]{40}$
                examples:
                  - '0x1111111111111111111111111111111111111111'
                description: Non-zero EVM address.
                not:
                  const: '0x0000000000000000000000000000000000000000'
              holder:
                type: string
                pattern: ^0x[0-9a-fA-F]{40}$
                examples:
                  - '0x1111111111111111111111111111111111111111'
                description: Non-zero EVM address.
                not:
                  const: '0x0000000000000000000000000000000000000000'
              operation:
                type: string
                enum:
                  - claim
                  - distribute-and-claim
                  - distribute
                description: >-
                  Use claim to withdraw assigned rewards. The two historical
                  distribution values remain accepted request shapes but return
                  422 unsupported_operation before calldata or simulation.
                  Index-only deployments are unavailable through public
                  preparation.
              unwrap_native:
                type: boolean
                description: >-
                  If rewards use the wrapped-native token, request payment in
                  native currency. This flag has no effect for other reward
                  currencies.
          description: >-
            Distinct token and holder pairs. Clone and payout destination are
            resolved from verified contracts, never caller-supplied.
    DividendClaimsPrepareResponse:
      type: object
      required:
        - data
        - meta
      properties:
        data:
          $ref: '#/components/schemas/DividendClaimsPrepareResult'
        meta:
          $ref: '#/components/schemas/ResponseMeta'
    DividendClaimsPrepareResult:
      allOf:
        - $ref: '#/components/schemas/TransactionPlan'
        - type: object
          required:
            - review
          properties:
            review:
              $ref: '#/components/schemas/DividendClaimsReview'
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
    DividendClaimsReview:
      type: object
      required:
        - claims
        - atomic
      properties:
        claims:
          type: array
          items:
            type: object
            required:
              - kind
              - suite_id
              - token_address
              - dividend_address
              - holder
              - destination
              - operation
              - unwrap_native
              - reward_token
              - payout_currency
              - withdrawable_before_raw
              - dividend_accounting
              - pending_funding_raw
              - available_reward_backing_raw
              - required_reward_backing_raw
              - simulated_holder_paid
              - backing_deficit_raw
              - observed_block
              - step_id
            properties:
              kind:
                type: string
                const: dividend
              suite_id:
                type: string
              token_address:
                type: string
                pattern: ^0x[0-9a-fA-F]{40}$
                examples:
                  - '0x1111111111111111111111111111111111111111'
                description: >-
                  EVM address. The zero address represents native currency only
                  where documented.
              dividend_address:
                type: string
                pattern: ^0x[0-9a-fA-F]{40}$
                examples:
                  - '0x1111111111111111111111111111111111111111'
                description: >-
                  EVM address. The zero address represents native currency only
                  where documented.
              holder:
                type: string
                pattern: ^0x[0-9a-fA-F]{40}$
                examples:
                  - '0x1111111111111111111111111111111111111111'
                description: >-
                  EVM address. The zero address represents native currency only
                  where documented.
              destination:
                type: string
                pattern: ^0x[0-9a-fA-F]{40}$
                examples:
                  - '0x1111111111111111111111111111111111111111'
                description: The holder's recorded payout receiver.
              operation:
                type: string
                const: claim
              unwrap_native:
                type: boolean
              reward_token:
                type: string
                pattern: ^0x[0-9a-fA-F]{40}$
                examples:
                  - '0x1111111111111111111111111111111111111111'
                description: >-
                  EVM address. The zero address represents native currency only
                  where documented.
              payout_currency:
                type: string
                pattern: ^0x[0-9a-fA-F]{40}$
                examples:
                  - '0x1111111111111111111111111111111111111111'
                description: Requested currency for the holder withdrawal.
              dividend_accounting:
                type: string
                const: fee-accrual
              zero_eligible_dividend_policy:
                type: string
                const: protocol-recipient
              withdrawable_before_raw:
                type: string
                pattern: ^(0|[1-9][0-9]*)$
                examples:
                  - '1000000000000000000'
                description: >-
                  Live entitlement before the simulated operation. Additional
                  rewards and the eventual payout depend on execution state.
              pending_funding_raw:
                type: string
                pattern: ^(0|[1-9][0-9]*)$
                examples:
                  - '1000000000000000000'
                description: >-
                  The clone's outstanding quote-currency escrow backing for
                  assigned rewards, not rewards awaiting distribution.
              available_reward_backing_raw:
                type: string
                pattern: ^(0|[1-9][0-9]*)$
                examples:
                  - '1000000000000000000'
                description: >-
                  Available reward backing in reward-token raw units. A positive
                  total is not a guarantee that a receiver payment or full
                  escrow redemption succeeds.
              required_reward_backing_raw:
                type: string
                pattern: ^(0|[1-9][0-9]*)$
                examples:
                  - '1000000000000000000'
                description: >-
                  Backing required for assigned unpaid rewards, in reward-token
                  raw units.
              pending_allocation_raw:
                type: string
                pattern: ^(0|[1-9][0-9]*)$
                examples:
                  - '1000000000000000000'
                description: >-
                  Historical allocation-time responses only; never populated
                  with pending funding.
                deprecated: true
              simulated_allocation_raw:
                type: string
                pattern: ^(0|[1-9][0-9]*)$
                examples:
                  - '1000000000000000000'
                description: >-
                  Historical distribution responses only. Claim does not assign
                  rewards.
                deprecated: true
              simulated_holder_paid:
                type: boolean
                description: >-
                  Whether the exact simulated claim paid the holder. This does
                  not report a completed onchain payment.
              backing_deficit_raw:
                type: string
                pattern: ^(0|[1-9][0-9]*)$
                examples:
                  - '1000000000000000000'
                description: >-
                  Aggregate backing deficit, in reward-token raw units.
                  Exact-call simulation determines whether this particular claim
                  can pay.
              observed_block:
                type: string
                pattern: ^(0|[1-9][0-9]*)$
                examples:
                  - '1000000000000000000'
                description: >-
                  Unsigned integer encoded as a base-10 string to preserve full
                  precision.
              step_id:
                type: string
        atomic:
          type: boolean
          const: false
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