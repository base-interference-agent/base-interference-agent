> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Builder Codes for Agent Developers

> Attribute your AI agent's onchain transactions to your identity on Base and make them measurable onchain.

AI agents operate autonomously and send transactions without a user manually triggering each one. Builder Codes give you a way to attribute all of that activity back to your agent's identity on Base.

## Why agents need Builder Codes

* **Attribution** — Append your Builder Code to each transaction your agent sends so Base can attribute that activity to you. Without it, your agent's onchain activity isn't attributed to you.
* **Analytics** — Every attributed transaction carries your code onchain, so you can measure your agent's transaction volume and reach from chain data. See [Track User Analytics](https://docs.base.org/specifications/builder-codes/for-app-developers.md#track-user-analytics) for where each signal lives.
* **Visibility** — Agents with Builder Codes can appear in discovery surfaces like Base's App Leaderboard and ecosystem spotlights.

## How it works

A Builder Code is a unique identifier (e.g. `bc_a1b2c3d4`) that gets appended to your agent's transaction calldata as an [ERC-8021](https://eip.tools/eip/8021) suffix. Smart contracts ignore the suffix; it is extracted by offchain indexers after the fact. The gas overhead is minimal (16 gas per non-zero byte).

## API reference

### Register your agent

```http Register an agent Builder Code theme={null}
POST /v1/agents/builder-codes
```

No authentication required.

| Field | Type | Required | Description |
| - | - | - | - |
| `walletAddress` | string | Yes | Your agent's EVM wallet address (`0x...`) |

Returns the builder code for the given wallet. The same wallet address always returns the same code.

```bash Terminal theme={null}
curl -X POST https://api.base.dev/v1/agents/builder-codes \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "<your-wallet-address>"
  }'
```

```json Response theme={null}
{
  "builderCode": "bc_a1b2c3d4",
  "walletAddress": "0x..."
}
```

> [!NOTE]
>
> Already registered? Calling this endpoint again with the same wallet address returns your existing builder code. Safe to call on every deploy.

## Using the Base skill

If you're using an AI coding tool (Claude Code, Cursor, Codex), install the [Base skills package](https://github.com/base/skills) and let the skill handle registration end-to-end:

```bash Terminal theme={null}
npx skills add base/skills
```

Then ask your agent: **"Register my agent for a builder code on Base.dev."**

The skill handles wallet validation, calls the registration API, writes the returned code to `src/constants/builderCode.ts`, installs `ox`, and wires the ERC-8021 `dataSuffix` into your transaction client (viem, ethers.js, or managed service).

## Verify attribution

To confirm your Builder Code is being appended correctly:

**1. Use a block explorer (Basescan, Etherscan, etc.)**

* Find your transaction hash
* View the input data field
* Verify the last 16 bytes are the `8021` repeating
* Decode the suffix to confirm your Builder Code is present

**2. Open source tools**

* Use the [Builder Code Validation](https://builder-code-checker.vercel.app/) tool
* Select transaction type
* Enter the transaction or UserOperation hash
* Click the **Check Attribution** button

## Next steps

> [card] [Builder Codes overview](https://docs.base.org/specifications/builder-codes/overview.md)
>
> Learn how Builder Codes work across apps, wallets, and agents.
