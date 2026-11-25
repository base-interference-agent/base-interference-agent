---
name: base-interference-agent
description: "Helps with Base (Coinbase's Ethereum L2): answers questions about networks, chain IDs, RPCs, explorers, bridges, faucets, token addresses, wallets, and SDKs; builds apps on Base; and prepares crypto portfolio rebalancing for human approval. Use for any Base question or any task that uses Base."
---

# Base Interference Agent

## 0. First-time setup: agent wallet (.env)
Use this when the user wants the agent to act on Base (send transactions, swap, borrow, or trade), or when they ask to set up a wallet. Otherwise skip it.
1. Check whether `.env` exists and whether `AGENT_WALLET_PRIVATE_KEY` is set (non-empty). Never print or quote the value.
2. If it isn't set, tell the user to create the wallet on their own computer by running the script below. Don't create the key here and don't ask them to paste it in chat.
   ```
   pip install eth-account
   python3 skills/base-interference-agent/scripts/create-wallet.py .env
   ```
   The script writes the key to `.env` (owner-only permissions), doesn't print it, and shows only the address.
   - Alternative: install Foundry and run `cast wallet new`, then paste the key into `.env` by hand.
3. Tell the user to fund the address on Base Mainnet (chain ID 8453) with only what the agent needs.
4. Check that `.env` is git-ignored before anything is committed.
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
- Proxy mode (optional): only if `LAUNCHPAD_PROXY_URL` is set in `.env`, send requests to `<LAUNCHPAD_PROXY_URL>/v1/...` with no key. The proxy adds the key on the server (see `proxy/README.md`). Don't ask for or look for a key in this mode.
- Direct mode (default): base URL `https://api.launch.o1.exchange/v1` with the user's own key from `.env`.
- Setup for each user (direct mode only): if `LAUNCHPAD_API_KEY` is missing from `.env`, tell the user to create their own key at https://launch.o1.exchange/developers?chain=8453 (connect their own wallet, create a key, and copy it once). Then they paste it into `.env` as `LAUNCHPAD_API_KEY`. Do not ask for the key in chat, and do not use or share anyone else's key.
- Auth: send the key in the `x-api-key` header, never in a query string. Never print it or put it in code.
- Read: search and list tokens, token details, trades, holders, wallet activity, fee claims.
- Swap: quote an exact-input trade (quotes expire after 2 minutes), then prepare the unsigned transaction. Show the user the minimum output, fees, and slippage, and wait for approval.
- Create token: prepare a launch. The API returns unsigned wallet steps. Confirm the name, symbol, supply, pair, and fees with the user before preparing it.
- Claims and creator actions: prepare unsigned transactions for fee claims, vesting, holder dividends, announcements, and metadata.
- The API never signs. A wallet signs every transaction, either the user's own or the agent wallet from section 0, and only after the user approves.

## CDP docs
- `references/cdp-docs/` holds 89 Coinbase Developer Platform pages that matter for Base: Wallet MCP, its plugins for Base protocols, faucets, x402, smart accounts, and wallet security. Start with the path in its name, then read the page. Source site: https://docs.cdp.coinbase.com.
- Java SDK reference and staking guides are left out on purpose.

## 2. Building on Base
- For a task that needs more than the reference covers, use the bundled skills:
  - `skills/build-on-base/`: network setup, Foundry deployment, Builder Codes attribution (ERC-8021), agent registration, running a node.
  - `skills/vibenet/`: the Base devnet for EIP-8130 account abstraction, gas sponsorship, and 200ms blocks. It is experimental and needs a viem fork (see that skill).
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
The bundled `build-on-base` and `vibenet` skills are from https://github.com/base/skills under the MIT License. See `NOTICE.md`.
