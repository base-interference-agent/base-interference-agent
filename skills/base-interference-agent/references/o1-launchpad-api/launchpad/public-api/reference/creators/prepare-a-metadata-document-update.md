> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Prepare a metadata document update

> Merge and pin token description, image, website, X, or Telegram updates, then return one unsigned contract-URI transaction.



## OpenAPI

````yaml /launchpad-api-openapi.yaml post /tokens/{chain_id}/{token_address}/metadata/document/prepare
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
  /tokens/{chain_id}/{token_address}/metadata/document/prepare:
    post:
      tags:
        - Creators
      summary: Prepare a metadata document update
      description: >-
        Merge and pin token description, image, website, X, or Telegram updates,
        then return one unsigned contract-URI transaction.
      operationId: prepareMetadataDocument
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
              $ref: '#/components/schemas/MetadataDocumentPrepareRequest'
      responses:
        '200':
          description: An unsigned token metadata-document transaction plan.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MetadataPrepareResponse'
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
    MetadataDocumentPrepareRequest:
      type: object
      required:
        - actor
        - document
      properties:
        actor:
          type: string
          pattern: ^0x[0-9a-fA-F]{40}$
          examples:
            - '0x1111111111111111111111111111111111111111'
          description: Wallet holding metadata-update authority.
          not:
            const: '0x0000000000000000000000000000000000000000'
        document:
          type: object
          properties:
            description:
              type: string
              maxLength: 2000
              description: >-
                Omit to preserve the current description; send an empty string
                to clear it.
            website:
              anyOf:
                - type: string
                  format: uri
                  maxLength: 2048
                  pattern: ^https?://[^/]*\.[^/]+(?:/.*)?$
                - type: string
                  const: ''
                - type: 'null'
              description: >-
                Omit to preserve the current website; send an empty string or
                null to clear it.
            x:
              anyOf:
                - type: string
                  format: uri
                  maxLength: 2048
                  pattern: ^https?://(?:www\.)?x\.com/.+
                - type: string
                  const: ''
                - type: 'null'
              description: >-
                Omit to preserve the current Twitter/X link; send an empty
                string or null to clear it.
            telegram:
              anyOf:
                - type: string
                  format: uri
                  maxLength: 2048
                  pattern: ^https?://(?:www\.)?(?:t\.me|telegram\.me)/.+
                - type: string
                  const: ''
                - type: 'null'
              description: >-
                Omit to preserve the current Telegram link; send an empty string
                or null to clear it.
            image_uri:
              type: string
              pattern: ^ipfs://[^/?#\s]+(?:/[^\s]*)?$
              maxLength: 512
              description: >-
                Existing ipfs:// image URI. Use this instead of image_base64
                when the image is already pinned.
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
              description: Required with image_base64 and must match the decoded image.
          minProperties: 1
          allOf:
            - not:
                required:
                  - image_uri
                  - image_base64
            - if:
                required:
                  - image_base64
              then:
                required:
                  - image_type
            - if:
                required:
                  - image_type
              then:
                required:
                  - image_base64
          description: >-
            Description, image, and links to merge into the token metadata
            document. Omitted fields stay unchanged.
    MetadataPrepareResponse:
      type: object
      required:
        - data
        - meta
      properties:
        data:
          $ref: '#/components/schemas/MetadataPrepareResult'
        meta:
          $ref: '#/components/schemas/ResponseMeta'
    MetadataPrepareResult:
      allOf:
        - $ref: '#/components/schemas/TransactionPlan'
        - type: object
          required:
            - review
          properties:
            metadata_uri:
              type: string
            image_url:
              type:
                - string
                - 'null'
              format: uri
            review:
              $ref: '#/components/schemas/MetadataReview'
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
    MetadataReview:
      oneOf:
        - type: object
          required:
            - operation
            - token_address
            - name
          properties:
            operation:
              type: string
              const: update_name
            token_address:
              type: string
              pattern: ^0x[0-9a-fA-F]{40}$
              examples:
                - '0x1111111111111111111111111111111111111111'
              description: >-
                EVM address. The zero address represents native currency only
                where documented.
            name:
              type: string
        - type: object
          required:
            - operation
            - token_address
            - symbol
          properties:
            operation:
              type: string
              const: update_symbol
            token_address:
              type: string
              pattern: ^0x[0-9a-fA-F]{40}$
              examples:
                - '0x1111111111111111111111111111111111111111'
              description: >-
                EVM address. The zero address represents native currency only
                where documented.
            symbol:
              type: string
        - type: object
          required:
            - operation
            - token_address
            - description
            - website
            - x
            - telegram
            - metadata_uri
            - image_url
          properties:
            operation:
              type: string
              const: update_metadata_document
            token_address:
              type: string
              pattern: ^0x[0-9a-fA-F]{40}$
              examples:
                - '0x1111111111111111111111111111111111111111'
              description: >-
                EVM address. The zero address represents native currency only
                where documented.
            description:
              type: string
            website:
              type:
                - string
                - 'null'
              format: uri
            x:
              type:
                - string
                - 'null'
              format: uri
            telegram:
              type:
                - string
                - 'null'
              format: uri
            metadata_uri:
              type: string
            image_url:
              type:
                - string
                - 'null'
              format: uri
        - type: object
          required:
            - operation
            - token_address
            - key
            - value
          properties:
            operation:
              type: string
              const: update_extra_metadata
            token_address:
              type: string
              pattern: ^0x[0-9a-fA-F]{40}$
              examples:
                - '0x1111111111111111111111111111111111111111'
              description: >-
                EVM address. The zero address represents native currency only
                where documented.
            key:
              type: string
            value:
              type: string
      discriminator:
        propertyName: operation
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