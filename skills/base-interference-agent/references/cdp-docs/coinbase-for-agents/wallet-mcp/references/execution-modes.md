> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Wallet Execution Modes

> Mode-aware wallet execution, spending controls, and safe retries.

# Wallet Execution Modes

## Before a write

Use current tool descriptions and session authorization as the source of truth. Approval-based calldata support does not prove autonomous compatibility. Use the executing wallet's address for preparation; in autonomous sessions, that is the bound agent wallet. Do not read other wallets through an autonomous session.

* **Approval mode:** Follow [approval-mode.md](./approval-mode.md) when the tool returns an approval URL. Wait for the user, then check status; signed or accepted is not confirmed.
* **Eligible autonomous mode:** Only use enabled tools, supported networks, and transaction shapes the saved spending policy can bound. Ordinary autonomous EVM writes support Base, plus Base Sepolia only if explicitly enabled in the active registry (swaps remain mainnet-only); Polygon and Arbitrum x402 support is not arbitrary write support. Never silently change wallet or turn a refused action into an approval request.

## Solana

For Solana wallet identity, approval-mode status checks, eligible autonomous sends/swaps, and headless-only x402 requirements, follow the [Solana guide](https://docs.cdp.coinbase.com/ai-agents/coinbase-for-agents/wallet-mcp.md#networks--use-solana-where-enabled). Do not apply EVM batching or signing flows to Solana.

## Budget and gas

Check the wallet's spending policy and current tool restrictions before executing. Do not infer spending authority from token balance. Keep native gas in the executing wallet for unsponsored transactions.

## Retry without duplicating an action

Autonomous `send`, `send_calls`, `swap`, and supported venue deposits require one `idempotencyKey` per intended operation. Keep the same key and exact parameters on retry. A changed payload is rejected.

Approval-based x402 completion uses the original `requestId` for recovery. Autonomous x402 initiation, generic signing, and most signed perps actions do not share the operation deduplication guarantee. A fresh call can create another effect. A timeout does not prove failure; inspect original status and transaction evidence. Never promise automatic budget release after a revert or refund.

## Protocol recipes

Native-plugin sign-in, wallet-specific preparation, and write/payment workflows require approval mode. Autonomous sessions must stop before those steps; do not substitute wallet identities or reinterpret approval/completion sequences.

Explicitly documented public, read-only discovery may run in either mode when it requires no wallet identity, authentication, signature, preparation, payment, or other side effect. Bankr's public token-launch feed is one example. Respect the plugin's client and HTTP routing requirements; read access does not verify autonomous trading compatibility.
