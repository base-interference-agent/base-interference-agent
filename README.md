# Base Interference Agent

An AI agent skill for building on and using [Base](https://base.org), Coinbase's Ethereum L2. It answers Base questions, checks tokens and stocks, quotes swaps, reads Morpho and o1 data, runs contract tests, and prepares every money action for your approval.

**Powered by Base Interference.**

## Install
1. Copy `skills/base-interference-agent/` into your agent's skills folder (for Claude Code: `~/.claude/skills/`).
2. In that folder, run `npm install` once.
3. For a wallet, run `python3 scripts/create-wallet.py .env` in your project folder, or ask the agent to create one. Only the address is shown.
4. For o1 or Morpho features, add your own keys to `.env` (see `.env.example`).

On Windows, if cloning fails with "Filename too long," run `git config --global core.longpaths true` and clone again.

## Safety
- Every money action needs your approval. Sends and payments need you to type `SEND` or `PAY` in a terminal.
- Keys stay in your `.env`, which git ignores. The agent never prints them.
- Base Mainnet uses real funds. Keep only what you need in an agent wallet.
- The contracts in `vault/` are unaudited. Use small amounts until a professional audit is done.
- This is not financial advice.

## Layout
```
skills/base-interference-agent/   the skill: SKILL.md, references/, scripts/
skills/build-on-base/             bundled from base/skills (MIT)
vault/                            owner vault, bounty escrow, job escrow, tests
NOTICE.md                         third-party credits and license
```

## Base Interference token
**Base Interference ($BINT)** is a token launched on o1, on Base: https://launch.o1.exchange/token/0xb200000000000000000000231734d0c898f56201?chain=8453

**Verified on-chain:** the launch transaction succeeded on Base Mainnet, sent from creator wallet `0x5b1265a2c04956e1c9c581988f967824f1aede96`, which is also the token's creator fee recipient.

## License
MIT for the bundled Base skill. See [NOTICE.md](NOTICE.md).
