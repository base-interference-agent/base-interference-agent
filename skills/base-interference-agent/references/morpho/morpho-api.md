# Morpho API (lending, borrowing, vaults)

Source: https://docs.morpho.org/api/ (read on the date of this commit).

## Two APIs
- **Read API (public, no key):** `https://api.morpho.org`. Markets, vaults, user positions, tokens, oracles, chains. Use GET requests. Rate limit: 750 requests per minute per IP.
- **Actions API (API key required):** returns the transaction calls for the user's wallet to sign and send. It doesn't submit transactions. Use `https://private.api.morpho.org` for requests. Request a key at https://docs.morpho.org/request-api-key/.

## Base
- Base (chain ID 8453) is supported by the Read API. Check the chain table on the API page for the exact filters.
- The docs say no Read API route returns an instantaneous APY, so don't present APY as live. Use the averages the docs provide.

## Rules for the skill
- Amounts are integer strings in the token's smallest unit. Use the decimals from the token data.
- Cursors come only from the previous response.
- Cache read results for a short time instead of querying every time.
- Verify each Actions API response before signing typed data or sending calls (see https://docs.morpho.org/api/actions/verify-responses/).
- Show the user the market or vault, the amount, the collateral and liquidation risk for borrowing, and the calls, then get approval before the wallet signs.
- Borrowing carries liquidation risk. Yields and deposits carry protocol risk.
