# Base Interference Agent

An agent skill for building on [Base](https://base.org) (Coinbase's Ethereum L2). It works with Claude Code, OpenAI Codex CLI, and other agents that support skills or `AGENTS.md`.

## What it does
- **Answers Base questions** from a reference: networks and chain IDs, RPC and explorer URLs, bridges, faucets, token addresses, wallets, SDKs, and grant programs (`skills/base-interference-agent/references/`).
- **Finds the right docs page** for SDK, Earn, Verify, Tokenized Stocks, gas fee, MCP, and agent questions (`references/sdks-index.md`).
- **Builds on Base** using two bundled skills from [base/skills](https://github.com/base/skills) (MIT): `build-on-base` (deployment, Builder Codes, nodes) and `vibenet` (account abstraction, 200ms blocks).
- **Portfolio requests are read-only.** It can propose a rebalancing plan, but it never handles private keys and never executes trades without your approval. It is not financial advice.

## Layout
```
skills/base-interference-agent/   the skill (SKILL.md + references/)
skills/build-on-base/             bundled from base/skills, MIT
skills/vibenet/                   bundled from base/skills, MIT
vendor/base-skills/               full copy of base/skills, MIT
AGENTS.md                         instructions for agents that read AGENTS.md
NOTICE.md                         third-party copyright and license
```

## Install
- **Claude Code:** copy `skills/base-interference-agent/` and the two bundled skill folders into `~/.claude/skills/`.
- **Codex CLI:** copy the same folders into `~/.codex/skills/`.
- **Other agents:** copy `AGENTS.md` into your project root.

## Set up your o1 API key (for o1 features)
1. Create your own key at https://launch.o1.exchange/developers?chain=8453 (connect your wallet, create a key, and copy it once).
2. Copy `.env.example` to `.env` and paste the key as `LAUNCHPAD_API_KEY=`.
3. Never share the key or commit `.env`.

## Limits
- The reference is a snapshot of the Base docs. Check time-sensitive items such as RPC rate limits and deprecations.
- The `vibenet` skill is experimental and needs a viem fork (see that skill).
- Grant and program details can change. Confirm them on the linked forms before applying.

## License
MIT for the bundled and vendored Base skills. See [NOTICE.md](NOTICE.md).
