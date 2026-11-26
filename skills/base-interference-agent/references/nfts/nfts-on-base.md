# NFTs on Base

Sources (read on the date of this commit):
- https://docs.cdp.coinbase.com/ai-agents/coinbase-for-agents/wallet-mcp/plugins/opensea (copied in `references/cdp-docs/`)
- https://www.base.org/blog/base-sponsored-solady-audit (copied in `references/base-site/`)

## What the agent can help with
- **Find and check NFT collections on Base:** look up a collection's contract on https://basescan.org, and check that the address is the one the project published. Use `scripts/check-token.mjs` for tokens, and read the contract before any mint.
- **Buy, sell, or list NFTs on OpenSea (Base supported):** OpenSea's plugin covers marketplace trades, drops, and minting. Writes need approval mode: the user approves each listing, buy, or mint before anything is signed.
- **Preview each action:** run `scripts/preview-tx.mjs` on the transaction. For NFT approvals, check whether it's a single-token approval or `setApprovalForAll`, which grants control of every NFT in that collection.

## Rules
- **Approvals:** never approve `setApprovalForAll` for a marketplace unless the user understands it. Revoke old approvals they no longer use.
- **Mint links and airdrops:** treat them as unverified. Check the contract on BaseScan first. Don't connect a wallet to a link someone sent.
- **API keys:** the OpenSea docs show an instant key creation call. The user creates their own key. The agent doesn't create keys for the user or put them in a shared file.
- **Prices and floors:** they change quickly. Show a fresh quote before approval.
- **Creating NFT contracts:** this skill doesn't include an NFT contract generator. Use a reviewed, audited library such as Solady or OpenZeppelin, test it with `scripts/test-contracts.sh` in the repo, and get an audit before minting real value. Solady had a sponsored audit on Base in 2025 that found 58 issues, which were fixed in v0.1.1. Use the latest release.
