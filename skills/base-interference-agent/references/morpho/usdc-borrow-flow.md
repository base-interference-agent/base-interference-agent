# Borrow USDC on Base with Morpho (approval flow)

Sources (read on the date of this commit):
- `references/morpho/actions/blue-borrow.md` (POST /v0/actions/blue/markets/{market-selector}/borrow)
- `references/morpho/actions/blue-supply-collateral-asset.md`
- `references/morpho/actions/verify-responses.md` (proof checks)
- `references/morpho/llms.txt` (full Morpho docs index)

## Keys and endpoints
- Read data (markets, rates, positions): Read API `https://api.morpho.org`, no key.
- Build borrow calls: Actions API `https://private.api.morpho.org`, **requires a Morpho API key** (https://docs.morpho.org/request-api-key/). Send the key as `x-api-key`. Keep it in `.env` (`MORPHO_API_KEY`), never in code or chat.
- Market selector format: `8453:<market_id>`.

## Steps
1. **Find the market.** Read the Blue market for USDC on Base from the Read API. Note the collateral token, the loan token (USDC), the LLTV (liquidation threshold), and the current borrow rate. Use the docs' market state endpoint, not cached values.
2. **Check the user's position.** Read the user's market position: collateral supplied, borrow shares. If they already have collateral, show it.
3. **Plan.** Show the user:
   - Collateral to supply (token and amount), if any.
   - USDC to borrow (amount in base units, with 6 decimals for USDC).
   - Borrow rate, and the loan-to-value after the borrow.
   - Liquidation price: the collateral price at which the position can be liquidated.
   - Referral fee, if any (default: none).
   Get approval of this exact plan before building calls.
4. **Build the calls.** POST the borrow request with `account` (the user's wallet), `amount` (`unit: "assets"`, `value` in base units), optional `collateral_amount`, and `signature_mode`:
   - `"none"`: returns approval and authorization calls without signature requests. Use this if the user's wallet can't sign typed data.
   - `"auto"`: reuses existing allowances and only asks for typed data when needed. Show the user any typed data before they sign.
5. **Check the response.**
   - `data.status` must be `prepared` (wallet calls) or `signature_required` (typed data to show the user).
   - `data.simulation.status` must be `success`. If it's `failed`, stop and show `simulation.failure`.
   - Compare `wallet_changes` and `position_changes` with the plan. Stop if the USDC received or the debt doesn't match.
   - Check `data.expires_at`. Don't send expired calls.
6. **Verify the proof.** Read `Morpho-Action-Proof`, verify the ES256 JWT against Morpho's public keys (`https://private.api.morpho.org/.well-known/morpho-actions-jwks.json`), and check its binding to this request. If the proof doesn't verify, stop. Morpho's docs include sample code (`verify-responses.md`).
7. **Send.** The user's wallet sends each call in order, unchanged: `to`, `data`, `value`, from the `account`, on chain 8453. Don't set gas yourself.
8. **Verify on-chain.** Check the transactions on basescan.org, then read the new position from the Read API.

## Rules
- Never send calls that didn't pass steps 5 and 6.
- Never skip the liquidation warning. Borrowing can lose the collateral.
- If prices move or the response expires before sending, rebuild and show the new plan for approval.
- The agent never holds the wallet key for this flow. The user's wallet signs.
