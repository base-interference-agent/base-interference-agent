> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Get Funds

> Fund an address on Base: withdraw from a Coinbase account, bridge from another chain, or use a testnet faucet.

You need a small amount of ETH on Base to pay for gas, plus whatever assets your app uses (USDC is the most common). How you fund depends on where your assets are.

## Mainnet

* **From a Coinbase account:** withdraw ETH or USDC and select **Base** as the network. Often the fastest path, no bridge required.
* **From another chain:** see [Bridge to Base](https://docs.base.org/base-chain/network-information/ecosystem-bridges.md) for routes from Ethereum, Solana, and Bitcoin.

## Testnet (Base Sepolia)

Get free test ETH from one of these faucets. Each one rate-limits claims, usually to one per 24 hours.

* [Coinbase Developer Platform faucet](https://portal.cdp.coinbase.com/onchain-tools/faucet): up to 0.1 ETH per 24 hours, plus USDC, EURC, and cbBTC. Also available [programmatically](https://docs.cdp.coinbase.com/faucets/introduction/quickstart) through the CDP SDK.
* [thirdweb faucet](https://thirdweb.com/base-sepolia-testnet)
* [Alchemy faucet](https://www.alchemy.com/faucets/base-sepolia): requires a free Alchemy account.
* [QuickNode faucet](https://faucet.quicknode.com/base/sepolia)
* [Chainstack faucet](https://faucet.chainstack.com/): requires a Chainstack API key.
* [ethfaucet.com](https://ethfaucet.com/networks/base)

Test USDC is also available from the [Circle faucet](https://faucet.circle.com). Select **Base Sepolia**.

## Preview Network (Vibenet)

Vibenet is Base's experimental preview network, where new chain-level features go live before they roll out to Base Sepolia or Base Mainnet. Use it to build against the newest Base features early.

Get free test ETH from the [Vibenet faucet](https://chain.base.org/vibenet/faucet) at chain.base.org, which also tracks what's live on Vibenet and hosts its block explorer.

> [!WARNING]
>
> Vibenet is for experiments only. Its state can be reset without notice, so don't rely on contracts, balances, or history persisting there.

For the RPC endpoint, chain ID, and a programmatic faucet, see [Test on Vibenet](https://docs.base.org/build-on-base/test-on-vibenet.md).

## Next Steps

> [card] [Make a Transaction](https://docs.base.org/get-started/make-a-transaction.md)
>
> Send your first transaction on Base.

> [card] [Facilitate Payments](https://docs.base.org/get-started/accept-payments.md)
>
> Accept USDC from your users.
