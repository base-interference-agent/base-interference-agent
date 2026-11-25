> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# API quickstart

> Authenticate, list launches, quote a swap, and submit wallet calldata.

## 1. Create a key

Open [Developers](https://launch.o1.exchange/developers), connect the wallet that will own the key, choose scopes, and sign the off-chain management message.

The plaintext key is displayed once:

```text theme={null}
o1_launch_a1b2c3d4_<secret>
```

Store backend keys in a secret manager. For a browser integration, use a dedicated key with only the scopes it needs and add a website restriction when appropriate.

For **\$O launches on Base or Robinhood**, request configuration with `launch_product=wsto`. Use the [launch example](https://docs.o1.exchange/launchpad/api/launches.md#o-launches) for ETH or held-wstO Dev Buy and [trading assets](https://docs.o1.exchange/launchpad/api/trading.md#o-launch-trades) for ETH, USDC on Base or USDG on Robinhood, \$O and wstO settlement. Omitted product selection still means Standard.

## 2. List Base launches

```bash theme={null}
curl "https://api.launch.o1.exchange/v1/tokens?chain_id=8453&market=all&sort=trending&limit=25" \
  -H "x-api-key: $O1_API_KEY"
```

Use `pagination.next_cursor` as the next request's `cursor`. Cursors are opaque, short-lived, and bound to the original filters. Ranked results remain live, so a token can move between pages; de-duplicate by `(chain_id, token.address)` and restart if the API returns `409 cursor_stale`.

Use `4663` for Robinhood, `143` for Monad, `5042` for Arc, `56` for BSC, `196` for X Layer or `99901` for Elysium in requests for those chains.

For Tax creation or policy reads, first request `/config?chain_id=8453&launch_product=tax&market=all&active_only=false`. Token trading resolves the recorded product automatically. See [Tax launches](https://docs.o1.exchange/launchpad/api/launches.md#tax-token-launches) and [Dividend actions](https://docs.o1.exchange/launchpad/api/claims-and-creator-actions.md#dividend-actions) for the Tax-specific request formats.

## 3. Quote an exact-input buy

```bash theme={null}
curl "https://api.launch.o1.exchange/v1/swaps/quote" \
  -X POST \
  -H "content-type: application/json" \
  -H "x-api-key: $O1_API_KEY" \
  -d '{
    "chain_id": 8453,
    "wallet": "0x1111111111111111111111111111111111111111",
    "token_address": "0x2222222222222222222222222222222222222201",
    "side": "buy",
    "amount_in_raw": "10000000000000000",
    "slippage_bps": 50
  }'
```

`slippage_bps` is the maximum output tolerance in basis points. `50` means 0.5%, and `100` means 1%.

The response contains:

* `quote_id`, signed and short-lived
* expected and minimum output in base units
* an `issues` array for balance or approval prerequisites
* ERC-20 approval transaction steps when required
* Permit2 typed data when an off-chain Permit2 signature is required

## 4. Prepare the swap

After completing any ERC-20 approval and signing any returned Permit2 typed data:

```bash theme={null}
curl "https://api.launch.o1.exchange/v1/swaps/prepare" \
  -X POST \
  -H "content-type: application/json" \
  -H "x-api-key: $O1_API_KEY" \
  -d '{
    "quote_id": "<quote_id>",
    "wallet": "0x1111111111111111111111111111111111111111"
  }'
```

Include `permit2_signature` only when the quote returned a Permit2 typed-data step. The API requotes, preserves the reviewed slippage floor, builds calldata for the configured router, and simulates it. Submit the returned transaction unchanged from the specified wallet.

For an Arc USDC-paired token, a buy spends six-decimal ERC-20 USDC: `amount_in_raw: "1000000"` means 1 USDC. Complete the returned SwapX approval steps, omit `permit2_signature`, and submit the prepared swap with its returned `value` of `0`. Keep native USDC available for gas; both USDC interfaces share the same balance.

## 5. Check indexing status

After confirmation:

```bash theme={null}
curl "https://api.launch.o1.exchange/v1/transactions/8453/0x<transaction-hash>" \
  -H "x-api-key: $O1_API_KEY"
```

This is the indexed public view, not a live RPC receipt endpoint. Normal chain workers discover wallet-broadcast transactions without a notification call. Use your chain provider for immediate receipt status; this endpoint may return `data: null` until the transaction is observed, then reports indexed chain and launchpad operation state.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.