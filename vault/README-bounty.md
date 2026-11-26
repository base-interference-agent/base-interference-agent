# USDC bounty escrow (Base Mainnet)

A poster locks USDC for a task. Someone claims it. The poster approves the payout, rejects the claim, or cancels for a refund. Only the poster can move money out.

**Unaudited.** Use small amounts only until it has been reviewed.

## Flow
1. Poster approves the escrow to spend USDC, then calls `createBounty(amount, details)`.
2. Anyone calls `submitClaim(id)` to ask to do the task. One claimant at a time.
3. Poster calls `approvePayout(id)` to pay the claimant, `rejectClaim(id)` to free the slot, or `cancel(id)` to refund an unpaid bounty.

## Deploy (on your computer)
1. `npm install` in this folder, then `node scripts/compile-bounty.mjs`.
2. Put `OWNER_PRIVATE_KEY=<your key>` in `../.env`. Keep some ETH on Base Mainnet for gas.
3. `node scripts/deploy-bounty.mjs` (dry run), then `node scripts/deploy-bounty.mjs --confirm`.

The key is read from `.env` and never printed or sent to the chat.
