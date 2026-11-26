---
name: base-interference-agent
description: "Helps with Base (Coinbase's Ethereum L2): answers questions about networks, chain IDs, RPCs, explorers, bridges, faucets, token addresses, wallets, and SDKs; builds apps on Base; and prepares crypto portfolio rebalancing for human approval. Use for any Base question or any task that uses Base."
---

# Base Interference Agent

## Install (for whoever uses this skill)
1. Copy the whole `skills/base-interference-agent/` folder into the agent's skills folder.
2. In that folder, run `npm install` once. This installs the packages the scripts need (viem and the x402 client).
3. For o1 or Morpho features, put your own keys in a `.env` file in your working folder (see `.env.example` at the repo root).
4. On Windows, if git reports "Filename too long" when cloning, enable long paths: `git config --global core.longpaths true`, then clone again.

## 0. First-time setup: agent wallet (.env)
When someone asks to create a wallet (for example "create a base wallet"), create it yourself. Don't send them code to run.
1. Work in the project folder where the agent runs. Check whether `AGENT_WALLET_PRIVATE_KEY` is already set in `.env` (check that it's non-empty; never print the value). If it is, show the address and stop.
2. If it isn't set, run `python3 scripts/create-wallet.py .env` (install once with `pip install eth-account`). The script writes the key into `.env` with owner-only permissions and prints only the address.
3. Make sure `.env` is git-ignored, then show the user the address only, plus the network (Base Mainnet, chain ID 8453) and a reminder to fund only what the agent needs.
4. Never print, paste, or quote the key in chat, logs, or files other than `.env`. Never create a second `.env` or stray key files.
5. If the agent has no access to the user's project folder, say so plainly. The wallet then has to be created on the machine where the agent runs, and the agent can't hand over a key.
Rules for the key:
- Only read it from the environment at run time. Never print, log, commit, or paste it into a shared file.
- Base Mainnet is the default. Set a maximum amount per transaction and require approval for each one.

## Helping new Base users
- Reference: `references/base-user-guide.md`. Use it for: adding Base to a wallet (chain 8453), getting ETH and USDC onto Base, what transactions cost, a safety checklist, and checking a transaction on basescan.org.
- When a user is new to Base, give the wallet settings, the safety checklist, and the next step they asked about. Keep it short.

## Buy and sell (KyberSwap)
- Reference: `references/kyberswap/swap-api.md`. Use KyberSwap's Aggregator API on Base Mainnet (chain 8453).
- No API key is needed for the public endpoint (3 requests per second). Recommend an API key for heavier use.
- Flow: (1) get a route with `GET /base/api/v1/routes`, (2) build the unsigned transaction with `POST /base/api/v1/route/build` and an explicit `slippageTolerance`, (3) for a sell, approve the router first, (4) the user's wallet signs and sends it.
- Show the route, amounts, minimum received, slippage, and router address, and get approval before the user signs. Re-quote if the route is more than 10 seconds old.

## o1 Launchpad API (quote, swap, create token, claims)
- Reference: `references/o1-launchpad-api/`. Start with `launchpad/api/quickstart.md`, `launchpad/api/authentication.md`, and the endpoint pages under `launchpad/public-api/reference/`.
- Key: the user's own key from `.env` (`LAUNCHPAD_API_KEY`). Base URL `https://api.launch.o1.exchange/v1`.
- Setup for each user (direct mode only): if `LAUNCHPAD_API_KEY` is missing from `.env`, tell the user to create their own key at https://launch.o1.exchange/developers?chain=8453 (connect their own wallet, create a key, and copy it once). Then they paste it into `.env` as `LAUNCHPAD_API_KEY`. Do not ask for the key in chat, and do not use or share anyone else's key.
- Auth: send the key in the `x-api-key` header, never in a query string. Never print it or put it in code.
- Read: search and list tokens, token details, trades, holders, wallet activity, fee claims.
- Swap: quote an exact-input trade (quotes expire after 2 minutes), then prepare the unsigned transaction. Show the user the minimum output, fees, and slippage, and wait for approval.
- Create token: prepare a launch. The API returns unsigned wallet steps. Confirm the name, symbol, supply, pair, and fees with the user before preparing it.
- Claims and creator actions: prepare unsigned transactions for fee claims, vesting, holder dividends, announcements, and metadata.
- The API never signs. A wallet signs every transaction, either the user's own or the agent wallet from section 0, and only after the user approves.

## Coinbase Developer Platform reference
- `references/cdp-docs/` holds 89 Coinbase Developer Platform pages that matter for Base: Wallet MCP, its plugins for Base protocols, faucets, x402, smart accounts, and wallet security. Start with the path in its name, then read the page. Source site: https://docs.cdp.coinbase.com.
- Java SDK reference and staking guides are left out on purpose.

## 2. Building on Base
- For a task that needs more than the reference covers, use the bundled skills:
  - `skills/build-on-base/`: network setup, Foundry deployment, Builder Codes attribution (ERC-8021), agent registration, running a node.
- Always use an explicit chain ID (8453 for Base Mainnet). Use a dedicated RPC provider for production, not the public RPCs.
- Never commit private keys or RPC/CDP API keys, and never expose them in client-side code.

## 3. Portfolio and wallet requests
- Read-only by default. Never ask for a private key or seed phrase in chat. The key stays in the user's `.env` (see section 0).
- Propose trades as a list: asset, amount, price, and fees.
- Execute a batch only after the user approves that exact batch.
- This is not financial advice. The skill follows the user's rules and does not pick coins.

## 4. Working in a repo
1. Inspect first: `git status`, the README, and the config files (`package.json` and similar).
2. Plan in 3 to 7 short steps. Do the riskiest step first.
3. Make small changes that match the existing style. Never overwrite changes you haven't read.
4. Run the project's own tests, lint, and build. Don't disable checks to make them pass.
5. Report what changed (file paths), what was verified (exact commands and results), and what was not verified.

Confirm before anything hard to undo: deleting data, force-pushing, publishing, or spending money. Don't commit or push unless asked.

## Credits
The bundled `build-on-base` skill is from https://github.com/base/skills under the MIT License. See `NOTICE.md`.
