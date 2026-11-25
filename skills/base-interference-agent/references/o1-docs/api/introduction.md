> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# API overview

> Choose the o1 Terminal API surface that matches your integration.

o1 Terminal provides separate API surfaces for public market data, authenticated trading, and o1 Launchpad integrations.

## Choose an API

| API | Base URL | Authentication | Use it for |
| - | - | - | - |
| o1 Alpha Token API | `https://api.o1.exchange` | None | Read the ranked o1 Alpha token contract-address list for a network |
| Trading API | `https://api.o1.exchange` | Bearer token | Prepare and submit programmatic trades |
| o1 Launchpad Public API | `https://api.launch.o1.exchange/v1` | `x-api-key`, except health checks | Browse launches and prepare launchpad transactions |

> [card] [o1 Alpha Token API](https://docs.o1.exchange/api/alpha-tokens.md)
>
> Fetch an unpaginated list containing only token contract addresses. No API key is required.

> [card] [Trading API](https://docs.o1.exchange/api/trading.md)
>
> Build and submit trades with MEV protection, Permit2 support, and configurable slippage.

> [card] [o1 Launchpad Public API](https://docs.o1.exchange/launchpad/api/introduction.md)
>
> Integrate with o1 Launchpad through its separately versioned API and scoped API keys.

## Versioned routes

The route path identifies the API version. Use the complete endpoint shown on each API page rather than adding a version to the base URL yourself.

For example:

```text theme={null}
GET  https://api.o1.exchange/api/v1/alpha-tokens
POST https://api.o1.exchange/api/v2/order
```

The o1 Launchpad Public API uses a different host and places `/v1` in its base URL.

## Common client behavior

* Send and accept JSON unless an endpoint says otherwise.
* Treat `429 Too Many Requests` as retryable after waiting. Honor `Retry-After` when the response includes it.
* Use exponential backoff with jitter for transient `500` class errors.
* Do not retry invalid `400` class requests without correcting them.
* Keep private keys and API tokens out of client-side code and source control.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.