> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Base Earn API Errors

> HTTP status codes, the error envelope, and retry guidance for Base Earn API errors.

The Base Earn error envelope includes `errorType`, `errorMessage`, and `correlationId`. Include the correlation ID when reporting a failure. Do not sign or submit calls after an API error.

## Status Codes

| Status | Meaning |
| - | - |
| `400` | Invalid address, amount, date or missing field; incompatible provider/operation; missing or invalid withdrawal slippage bound. |
| `403` | The request is not permitted. Check access restrictions for the requested operation. |
| `404` | Vault, product or endpoint not found. Check the identifier and URL. |
| `405` | Wrong HTTP method for the route. |
| `422` | A protocol precondition failed, such as insufficient funds, unavailable liquidity, an unready vault or an immature claim. |
| `429` | Rate limited. Reduce request frequency, respect any retry guidance in the response, and use backoff. |
| `500` | The service could not complete the request. Include the correlation ID when contacting support. |
| `503` | Service temporarily unavailable. Retry with backoff. |

Correct validation and protocol errors before retrying. After a failure, inspect the current position and request fresh calls rather than resubmitting an old transaction batch.
