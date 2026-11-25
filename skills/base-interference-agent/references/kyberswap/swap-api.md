# KyberSwap Aggregator API on Base (buy and sell)

Sources (read on the date of this commit):
- https://docs.kyberswap.com/developer-guide/aggregator-api/aggregator-api-specification/evm-swaps.md
- https://docs.kyberswap.com/developer-guide/aggregator-api/how-to-guides/execute-a-swap-with-the-aggregator-api.md
- https://docs.kyberswap.com/developer-guide/start-here/rate-limits-and-client-id.md
- https://docs.kyberswap.com/developer-guide/aggregator-api/contracts.md

## Auth and limits
- No API key is needed for the public endpoint. Public limit: 3 requests per second.
- For higher limits, request an API key from KyberSwap (business@kyber.network) and send it as `X-Api-Key` to `https://api.kyberswap.com/swap/`.
- Recommended for every request: `x-client-id` header with the app name.

## Base (chain 8453)
- Chain name in URLs: `base`
- Base URL: `https://aggregator-api.kyberswap.com/base/api/v1/`
- Router (MetaAggregationRouterV2): `0x6131B5fae19EA4f9D964eAc0408E4408b66337b5`
- Other Base contracts are listed in the contracts page above.

## Step 1: get a route (read-only, no wallet)
`GET /base/api/v1/routes?tokenIn=<address>&tokenOut=<address>&amountIn=<raw amount>`
- `amountIn` is in the token's smallest unit (for example, 0.01 WETH = 10000000000000000).
- Response includes `routeSummary` (the best route) and `routerAddress`.
- Don't cache the route for more than 5 to 10 seconds. Re-quote before swapping.
- Tested on this date: WETH `0x4200000000000000000000000000000000000006` to USDC `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`, amountIn 0.01 WETH, returned amountOut 16796284 (6 decimals, about 16.80 USDC) and routerAddress `0x6131B5fae19EA4f9D964eAc0408E4408b66337b5`.

## Step 2: build the transaction (unsigned)
`POST /base/api/v1/route/build` with JSON body:
- `routeSummary`: exactly as returned by Step 1
- `sender`: the user's wallet address
- `recipient`: the wallet that receives the tokens (usually the same)
- `slippageTolerance`: in basis points (100 = 1%). Set one. Example: 10 = 0.1%.
- Response `data` is the calldata (hex string) for the router.

## Step 3: approvals and sending (the user's wallet signs)
- For selling an ERC-20, the user must first approve the router (`routerAddress`) to spend that token. Show the approval as a separate step.
- The transaction goes to `routerAddress` with the returned `data`. The wallet signs it.
- The agent never signs. Show the user the route, amounts, slippage, and router before they approve.

## Rules for the skill
- Buy and sell are the same flow with the tokens swapped.
- Always state the minimum received and the slippage before approval.
- Use a short-lived quote. If it's older than 10 seconds, re-quote.
- Base Mainnet only (chain 8453).
