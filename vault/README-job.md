# USDC job escrow for building work (Base Mainnet)

For paying for a build in USDC, in milestones.

**Unaudited.** Use small amounts until it has been reviewed.

## Flow
1. **Poster** approves the escrow for the total USDC, then calls `createJob(amounts[], deadline, arbiter, details)`. Each entry in `amounts` is one milestone. The arbiter must be a different address from the poster.
2. **Worker** calls `claimJob(id)` before the deadline. One worker per job.
3. **Worker** calls `submitMilestone(id, m, deliverable)` with a link or file hash.
4. **Poster** calls `approveMilestone(id, m)` to pay, or `disputeMilestone(id, m)` to dispute.
5. **Arbiter** calls `resolveDispute(id, m, payWorker)` to pay the worker or refund the poster.
6. After the deadline, the poster calls `reclaimPending(id, m)` for milestones nobody submitted.
7. The poster can call `cancelUnclaimed(id)` before anyone claims, to get everything back.

## Known limit
If the poster never approves or disputes a submitted milestone, that money stays locked. A review window that releases payment automatically would fix this. Tell me if you want it added.

## Deploy (on your computer)
1. `npm install`, then `node scripts/compile-job.mjs`.
2. Put `OWNER_PRIVATE_KEY=<your key>` in `../.env`. Keep ETH on Base Mainnet for gas.
3. `node scripts/deploy-job.mjs` (dry run), then `node scripts/deploy-job.mjs --confirm`.

## Tests
Run `npm run test`. The job flows (claim, submit, approve, dispute, arbiter resolution, deadline refund, and cancel) are checked on a local chain with 20 total checks shared with the vault and bounty. Passing tests isn't an audit.
