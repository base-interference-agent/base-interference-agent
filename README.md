# Base Interference Agent

**Powered by Base Interference.**

This skill is for everyone building or using Base. It works as an AI agent for almost any Base task: asking questions, swapping, lending and borrowing, launching and trading tokens, building contracts, and checking stocks and portfolios. Every money action waits for your approval first.

**Base Interference ($BINT)** is a token launched on o1, on Base: https://launch.o1.exchange/token/0xb200000000000000000000231734d0c898f56201?chain=8453. The project says it's the first token launched by an AI agent. That's their claim, and it isn't independently verified.

Works with Claude Code, OpenAI Codex CLI, and other agents that support skill folders.

## What you can do
- **Ask about Base:** networks and chain IDs (Base Mainnet by default), RPC and explorer URLs, bridges, token addresses, wallets, SDKs, and grant programs. Answers come from the Base docs copied into the skill, with source links.
- **Set up a wallet on Base:** add the network to your wallet, get ETH and USDC onto Base, and check fees. Includes a safety checklist.
- **Swap tokens (buy and sell):** get a KyberSwap quote on Base, then build the transaction for your wallet to sign. You approve every step.
- **Lend and borrow (Morpho):** read Morpho markets, vaults, and positions through the Morpho API. Preparing lending or borrowing transactions needs a Morpho API key.
- **Launch and trade o1 tokens:** quote trades, prepare token launches and claims, and read token data through the o1 Launchpad API. Each user adds their own o1 API key.
- **Build on Base:** deploy contracts, add Builder Codes, run a node, and use the vibenet devnet, with the bundled Base skills.
- **Find the right docs:** search the full Base docs, the o1 docs, and the Coinbase Developer Platform pages for Base.

## Tools (read-only, scripts in `skills/base-interference-agent/scripts/`)
- Token checker, transaction preview, portfolio view, Morpho health alerts (needs your key), o1 tracker, bounty board page.

## Planned, not built yet
- **Rebalancing:** plan the trades that move a portfolio to a target split. Every trade needs your approval, and the agent never signs or sends anything on its own.
- **Price-gap alerts, stock news, x402 paywall and client, token-gated tier, agent reputation, stock-lending.**

## Safety
- The agent never asks for, prints, or commits your private key or seed phrase.
- Keys live in your own `.env` file, which is git-ignored.
- Every transaction shows the route, amounts, slippage, and minimum received before you approve it.
- Base Mainnet uses real funds. Keep only what you need in an agent wallet.
- This is not financial advice.

## Install
1. Copy the skill folder into your agent's skills directory:
   - Claude Code: `skills/base-interference-agent/` and the two bundled folders to `~/.claude/skills/`
   - Codex CLI: the same folders to `~/.codex/skills/`
   - Other agents that support skill folders: copy `skills/base-interference-agent/` the same way.
2. For o1 features, create your own key at https://launch.o1.exchange/developers?chain=8453, copy `.env.example` to `.env`, and paste the key as `LAUNCHPAD_API_KEY=`.

## Layout
```
skills/base-interference-agent/   the skill (SKILL.md, references/, scripts/)
skills/build-on-base/             bundled from base/skills (MIT)
skills/vibenet/                   bundled from base/skills (MIT)
vault/                            owner vault, bounty escrow, job escrow (unaudited) with tests
NOTICE.md                         third-party copyright and license
```

## Limits
- Reference docs are snapshots. Check time-sensitive items such as RPC limits, Morpho status, and fees.
- The vibenet skill is experimental and needs a viem fork.
- Grant and program details can change. Confirm them on the linked forms before applying.

## License
MIT for the bundled Base skills. See [NOTICE.md](NOTICE.md).
