> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# o1 Alpha Token API

> Fetch the ranked o1 Alpha token contract-address list for a network without authentication.

Use this public read endpoint to retrieve the token contract addresses currently included in o1 Alpha for one network.

## Endpoint

```http theme={null}
GET https://api.o1.exchange/api/v1/alpha-tokens?networkId={networkId}
```

No API key or bearer token is required.

## Query parameter

| Parameter | Type | Required | Description |
| - | - | - | - |
| `networkId` | Positive integer | Yes | Registered network ID used by o1 Terminal, such as `8453` for Base |

The endpoint rejects a missing, duplicated, non-integer, or non-positive `networkId` with `400 Bad Request`.

## Request example

```bash theme={null}
curl "https://api.o1.exchange/api/v1/alpha-tokens?networkId=8453"
```

## Response

A successful response is an unwrapped JSON array containing only contract addresses:

```json theme={null}
[
  "0x1111111111111111111111111111111111111111",
  "0x2222222222222222222222222222222222222222"
]
```

Addresses are ordered by their current o1 Alpha rank. Duplicate addresses are omitted while preserving the first ranked occurrence. The endpoint returns up to 1,000 addresses.

If the network currently has no o1 Alpha tokens, the response is:

```json theme={null}
[]
```

> [!NOTE]
>
> The response intentionally contains no token metadata, rank values, pagination fields, or network wrapper. Use the requested `networkId` as the chain context for every returned address.

## JavaScript example

```javascript theme={null}
const response = await fetch(
  "https://api.o1.exchange/api/v1/alpha-tokens?networkId=8453",
);

if (response.status === 429) {
  throw new Error("Rate limit exceeded. Wait before retrying.");
}

if (!response.ok) {
  throw new Error(`o1 API request failed with ${response.status}`);
}

const contractAddresses = await response.json();
```

## Errors

Invalid request parameters return a JSON error:

```json theme={null}
{
  "success": false,
  "code": 400,
  "message": "networkId must be a positive integer"
}
```

| Status | Meaning | Client action |
| - | - | - |
| `200` | Address list returned successfully | Consume the JSON array |
| `400` | `networkId` is missing or invalid | Correct the request before retrying |
| `429` | The source exceeded the edge rate limit | Wait before retrying and honor `Retry-After` when present |
| `500` | Unexpected service error | Retry with capped exponential backoff and jitter |

## Rate limits and caching

Cloudflare enforces source-based rate limits at the public API edge. Limits may change as traffic patterns and service capacity evolve, so clients must handle `429` responses instead of assuming a fixed quota.

Successful responses include:

```http theme={null}
Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=60
Access-Control-Allow-Origin: *
```

Browsers may call the endpoint across origins. Shared caches can reuse a successful response for up to five minutes, while browser caches can reuse it for up to one minute.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.