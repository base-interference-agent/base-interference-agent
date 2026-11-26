# Building on Base: how the agent helps

Use this when someone says they want to build something on Base. Ask what they're building first, then follow the steps that apply.

## 1. Pick the path
| They want to build | Start here |
|---|---|
| A dApp that reads or sends transactions | Network setup (`base-facts.md`), then `base-docs/build-on-base/` |
| A token | `base-docs/build-on-base/` (Builder Codes), `o1-docs/launchpad/` for o1 launches |
| Lending or borrowing features | `morpho/llms.txt` and `morpho/usdc-borrow-flow.md`. Morpho Actions need a key. |
| A swap feature | `kyberswap/swap-api.md` |
| Stock tokens | `stocks/base-stocks.md`, and `scripts/check-token.mjs` before any trade |
| Paid APIs (agent payments) | `x402/x402-agent.md` |
| A vault, bounty, or job marketplace | `vault/` contracts, tests, and `vault/README*.md` |
| A node or devnet | `build-on-base/` (run-node) and `vibenet/` |

## 2. Set up safely
1. Add Base Mainnet (chain ID 8453) to the wallet. Confirm the chain ID before signing anything.
2. Use the test setup first: `scripts/test-contracts.sh` runs the contract suites on a local chain.
3. Keep keys in `.env`, which is git-ignored. Never paste keys in chat or commit them.
4. Use a dedicated RPC provider for production. Public RPCs are rate-limited.

## 3. Build in small steps
1. Read the matching reference before writing code.
2. Write the smallest working version. Add tests for each money path (deposit, withdraw, payout, refund, and the rejected cases).
3. Run the tests. Passing tests is not an audit.
4. Before deploying: dry-run with the deploy script, check the gas estimate, and confirm the address.
5. Deploy from the user's own machine with their own key. The agent doesn't deploy for them.
6. Verify the deployed contract on https://basescan.org and check it with `scripts/preview-tx.mjs` for any transaction.

## 4. Before real users
- Get a professional security audit. Keep amounts small until it's done.
- Add Builder Codes so the app's activity is attributed (`build-on-base/` references).
- Document the risks for users: unaudited code, liquidation risk for borrowing, and stock tokens' own terms.

## 5. What the agent won't do
- Deploy or trade with someone else's wallet.
- Give anyone a key, or put one in a repo or shared file.
- Add automatic trading or unapproved money movement to an app without the user's explicit design and approval.
