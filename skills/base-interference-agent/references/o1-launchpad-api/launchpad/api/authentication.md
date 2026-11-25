> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Authentication and API keys

> Create, scope, rotate, and protect o1 Launchpad API keys.

## API key header

```http theme={null}
x-api-key: o1_launch_<8-character-prefix>_<secret>
```

The prefix is eight lowercase hexadecimal characters used for indexed lookup. The secret is 32 cryptographically random bytes encoded as URL-safe base64. Keys are not accepted in query parameters, and the server stores a peppered HMAC digest rather than the plaintext secret.

## Create and manage keys

Use [launch.o1.exchange/developers](https://launch.o1.exchange/developers).

Key management requires a short-lived, domain-bound wallet signature. It supports EOAs and compatible smart-contract wallets. The signed message states that it is off-chain and does not approve tokens or move funds.

Self-service keys:

* use the Developer plan by default
* are owned by the signing wallet
* are limited to two active production keys
* allow up to 10 newly created or rotated keys per wallet in 24 hours
* allow up to 120 signed key-management actions per wallet each hour
* expose the plaintext secret once
* can be rotated with a short overlap window so clients can change secrets without downtime
* can be revoked, with gateway authorization caches expiring within five seconds

Lost keys cannot be recovered. Rotate or revoke and replace them. Rotation copies the existing plan, scopes, origin allowlist, and any operator-assigned policy override. The previous key is marked `rotating` and expires after the configured overlap.

## Scopes

| Scope | Access |
| - | - |
| `config:read` | Production configuration |
| `tokens:read` | Token browsing, search, creator launches, details, trades, announcements, and holders |
| `wallets:read` | Public wallet summaries, activity, fee claims and indexed Dividend positions |
| `transactions:read` | Indexed transaction and launchpad operation state |
| `launches:prepare` | Launch transaction preparation |
| `swaps:quote` | Exact-input quotes |
| `swaps:prepare` | Unsigned swap transaction preparation |
| `claims:prepare` | Fee claims and holder-authorized Dividend claim preparation |
| `creator:prepare` | Announcements and metadata |

Choose only the scopes an integration needs.

No API scope grants direct database or governance access. Read scopes return public data. Prepare scopes validate live state and return unsigned wallet steps. The user's wallet remains the only component that can authorize an on-chain action.

## Browser origins

An allowed origin is the website scheme, host, and port. It covers every page and API call made from that site.

```text theme={null}
https://example.com
https://app.example.com
```

The key form accepts multiple origins separated by commas and normalizes pasted URLs to their origin. Add each subdomain separately; wildcards are not accepted.

For example, allowing `https://test.com` also allows calls made from `https://test.com/test` because URL paths are not part of an origin.

Leave the list empty to allow the key from any website or server integration. Add origins only when a browser key should be limited to specific sites. API-key authentication, scopes, and rate limits still apply either way.

Server integrations normally send no browser `Origin` header and are unaffected by this setting. Browser responses expose request IDs, retry timing, and rate-limit headers so integrations can handle errors and throttling without losing diagnostic details to CORS.

CORS permission does not replace API-key authentication. The public `/health` route is the only exception and can be called from any valid website origin without a key.

## Secret handling

* keep production keys in a secret manager
* do not commit `.env` files
* do not log full keys
* use separate keys for separate integrations
* revoke a key before sharing logs or code that may contain it
* use idempotency keys on all retryable state-building requests


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.