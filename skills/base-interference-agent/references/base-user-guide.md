# Base user guide (for people new to Base)

Sources: docs.base.org pages in `base-docs/` (network fees, connect to Base, get funds, bridging). Check the links for current values.

## 1. Add Base Mainnet to your wallet
- Network name: Base
- Chain ID: 8453
- RPC: https://mainnet.base.org (for development only; use a dedicated provider for production)
- Currency: ETH
- Explorer: https://basescan.org
- Always check the chain ID before you sign anything.

## 2. Get ETH and USDC on Base
- From Coinbase: withdraw ETH or USDC and choose **Base** as the network. No bridge needed.
- From Ethereum: bridge with Superbridge (https://superbridge.app/?fromChainId=1&toChainId=8453) or Brid.gg (https://www.brid.gg/?fromChainId=1&toChainId=8453). Fast third-party bridges (Across, Relay, Stargate) don't inherit Base's security.
- USDC on Base Mainnet: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- WETH on Base: `0x4200000000000000000000000000000000000006`

## 3. What a transaction costs
- Every Base transaction has two parts: an L2 execution fee and an L1 security fee. The L1 fee is usually the bigger one.
- The L1 fee changes with Ethereum's gas price. If timing is flexible, send transactions when Ethereum gas is low (for example, over the weekend).
- Base has a minimum base fee of 0.005 gwei on Mainnet, so the L2 fee is roughly $0.002 at the floor.
- Some apps can pay gas in a token instead of ETH. See https://docs.base.org/specifications/base-transactions.md#paying-gas-in-tokens.
- Transactions confirm in about a second, with a new block every 200ms (per the docs).

## 4. Stay safe (checklist)
- Never share a seed phrase or private key. No real support team asks for one.
- Check the exact contract address and chain ID before you approve or sign.
- Approvals grant a spender the right to move your tokens. Approve only the amount you need, and revoke old approvals you don't use.
- Don't sign messages or transactions you don't understand. Simulate or read them first.
- Be wary of links from DMs, replies, or "airdrop" messages. Type known URLs yourself.
- Start with a small amount when you try a new app or contract.

## 5. Check a transaction
- Paste the transaction hash into https://basescan.org.
- Status "Success" means it executed. "Failed" means it reverted, and you still pay the fee.
- A transaction stuck in "Pending" for a long time may need a higher fee or a replacement with the same nonce. Check your wallet's activity first.

## 6. Where to go next
- Build on Base: `references/base-docs/build-on-base/`
- Lend and borrow: `references/base-docs/sdks/base-earn/` (Morpho is listed as coming soon in the docs)
- Swap tokens: `references/kyberswap/swap-api.md`
- Launch or trade o1 tokens: `references/o1-docs/`
- Grants: `references/sdks-index.md`
