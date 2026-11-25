> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Get Corporate Action

> Return a tokenized stock's announced or applied corporate action.

## Find the Action ID

Use the UUID at the end of the `uri` emitted in the token contract's onchain `Announcement` event. Do not use the event's `id` argument: it can be numeric or include a suffix such as `:pre` or `-1`. Announcements without an addressable URI cannot be looked up through this endpoint.

## Example

This example retrieves a GOOGLc cash dividend.

```bash cURL theme={null}
curl https://api.coinbase.com/v1/tokenized-stocks/corporate-actions/e82812a6-0b24-41c4-8ed1-322d1b466d33
```

The response is the corporate action object itself, without a `corporate_action` wrapper. It includes the token, description, status, first announcement time, and onchain announcement history in chronological order.

* `CORPORATE_ACTION_STATUS_ANNOUNCED`: the action has been announced but its multiplier change has not taken effect. For a scheduled ERC-8056 update, it stays announced until its effective timestamp; it then becomes applied even though no event is emitted at that time.
* `CORPORATE_ACTION_STATUS_APPLIED`: the multiplier change has taken effect. For an instant update, `applied_at` is the announcement block time; for a scheduled update, it is the scheduled effective timestamp. Only then are `applied_at`, `multiplier_before`, and `multiplier_after` populated.

Multiplier values are already normalized from their 18-decimal fixed-point scale. Announcement `block_number` values are decimal strings in JSON.

A malformed UUID returns HTTP `400`; an unknown action or an action on a test/non-live token returns HTTP `404`. Temporarily unavailable or stale action data returns HTTP `503`. These errors use the JSON error format described in the [API overview](https://docs.base.org/sdks/tokenized-stocks/overview.md#errors).


## OpenAPI

````yaml openapi/tokenized-equities.json GET /v1/tokenized-stocks/corporate-actions/{id}
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
  /v1/tokenized-stocks/corporate-actions/{id}:
    get:
      tags:
        - Tokenized Stocks
      summary: Get corporate action
      description: >-
        Returns a corporate action for a live tokenized stock. Use the UUID at
        the end of the URI emitted in an onchain Announcement event, not the
        event id (which can carry a suffix). Applied-only fields are omitted
        until the multiplier update is applied.
      operationId: getCorporateAction
      parameters:
        - name: id
          in: path
          required: true
          description: The corporate action UUID from the onchain announcement URI.
          schema:
            type: string
            format: uuid
          example: e82812a6-0b24-41c4-8ed1-322d1b466d33
      responses:
        '200':
          description: The corporate action object, not a corporate_action wrapper.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/v1CorporateAction'
        '400':
          description: The id is not a corporate action UUID.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rpcStatus'
              example:
                code: 3
                message: field 'id' must be a corporate action UUID
        '404':
          description: The action is unknown or does not belong to a live token.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rpcStatus'
              example:
                code: 5
                message: >-
                  corporate action "00000000-0000-4000-8000-000000000001" was
                  not found
        '503':
          description: Data is temporarily unavailable.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/rpcStatus'
              example:
                code: 14
                message: data is temporarily unavailable
components:
  schemas:
    v1CorporateAction:
      type: object
      description: >-
        A corporate action announced on a live tokenized equity token.
        Applied-only fields are omitted until the multiplier change takes
        effect. Scheduled ERC-8056 changes become applied at their effective
        timestamp.
      properties:
        id:
          type: string
          description: The UUID in the final segment of the onchain announcement URI.
          format: uuid
        uri:
          type: string
          description: The canonical public URI of this corporate action.
          format: uri
        contract_address:
          type: string
          description: The token contract address on Base.
        symbol:
          type: string
          description: The token ticker symbol.
        description:
          type: string
          description: The action description, such as Cash Dividend or Stock Split.
        status:
          type: string
          description: >-
            ANNOUNCED until an instant multiplier update applies or a scheduled
            update reaches its effective timestamp; APPLIED afterward.
          enum:
            - CORPORATE_ACTION_STATUS_UNSPECIFIED
            - CORPORATE_ACTION_STATUS_ANNOUNCED
            - CORPORATE_ACTION_STATUS_APPLIED
        announced_at:
          type: string
          description: The time of the first onchain announcement.
          format: date-time
        applied_at:
          type: string
          description: >-
            The time the multiplier change took effect. For scheduled ERC-8056
            updates, this is the scheduled effective timestamp; omitted until
            applied.
          format: date-time
        multiplier_before:
          type: number
          format: double
          description: >-
            The multiplier before application, normalized from its 18-decimal
            fixed-point value. Omitted until applied.
        multiplier_after:
          type: number
          format: double
          description: >-
            The multiplier after application, normalized from its 18-decimal
            fixed-point value. Omitted until applied.
        announcements:
          type: array
          description: Onchain announcements, oldest first.
          items:
            $ref: '#/components/schemas/v1CorporateActionAnnouncement'
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
    v1CorporateActionAnnouncement:
      type: object
      description: One onchain announcement belonging to a corporate action.
      properties:
        announcement_id:
          type: string
          description: >-
            The onchain Announcement event id. It may differ from the corporate
            action UUID, for example by a :pre or -1 suffix.
        description:
          type: string
          description: The announcement description.
        tx_hash:
          type: string
          description: The transaction hash of the announcement.
        block_number:
          type: string
          description: The block number, serialized as a decimal string.
          format: uint64
        block_time:
          type: string
          description: The UTC block timestamp of the announcement.
          format: date-time
    protobufAny:
      type: object
      properties:
        '@type':
          type: string
      additionalProperties: {}

````