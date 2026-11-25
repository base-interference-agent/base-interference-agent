> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Bridge to Base

> Move ETH, stablecoins, and tokens to and from Base using the standard bridge, fast bridges, aggregators, or cross-chain messaging protocols.

Move assets to and from Base using the routes below. Pick the one that matches where your assets are today.

## Choose a Route

| Coming from | Recommended route | Typical assets |
| - | - | - |
| A Coinbase account | Withdraw directly to Base (no bridge) | ETH, USDC, cbBTC |
| Ethereum (L1) | [Superbridge](https://superbridge.app/?fromChainId=1\&toChainId=8453) or [Brid.gg](https://www.brid.gg/?fromChainId=1\&toChainId=8453), or a [fast bridge](#fast-bridges) | ETH, ERC-20s |
| Another EVM chain | A [fast bridge](#fast-bridges) or [bridge aggregator](#bridge-aggregators) | ETH, stablecoins, ERC-20s |
| Solana | [Base–Solana bridge](https://docs.base.org/specifications/base-protocol/bridging/base-solana-bridge.md) | SOL, SPL tokens |
| Bitcoin | [Garden](https://app.garden.finance/?output-chain=base\&output-asset=cbBTC) | BTC → cbBTC |
| Native USDC on another chain | Circle [CCTP](#usdc-on-base) | USDC |

Fast bridges and aggregators are third-party services with their own trust model. Compare them with the standard bridge in [Compare Bridge Types](#compare-bridge-types).

> [!NOTE]
>
> If you hold funds in a Coinbase account, you can withdraw many assets straight onto the Base network — select **Base** as the network when withdrawing, no bridge required. This is often the fastest path for USDC and ETH.

## Compare Bridge Types

Bridges to and from Base fall into three types. They differ in speed and in who you trust to deliver your funds.

| Bridge type | Withdrawal to Ethereum | You trust |
| - | - | - |
| [Standard bridge](#from-ethereum) | 5-day [finalization window](https://docs.base.org/specifications/base-protocol/bridging/withdrawals.md), or 1 day when both TEE and ZK proofs back the proposal | Base's proofs on Ethereum |
| [Fast bridge](#fast-bridges) | Typically seconds to minutes | The provider |
| [Messaging protocol](#cross-chain-messaging-protocols) | Varies by protocol and configuration | The protocol and the token's settings |

The finalization window applies only to standard bridge withdrawals from Base to Ethereum; standard bridge deposits from Ethereum to Base do not wait for it. To see why the window exists, read [Withdrawals](https://docs.base.org/specifications/base-protocol/bridging/withdrawals.md).

## From Ethereum

Bridge ETH and supported ERC-20s between Ethereum mainnet (L1) and Base. Both providers support mainnet and Sepolia testnet.

> [card] [Superbridge](https://superbridge.app/?fromChainId=1\&toChainId=8453)
>
> Bridge ETH and supported assets from L1 to Base. [Testnet](https://superbridge.app/?fromChainId=11155111\&toChainId=84532)

> [card] [Brid.gg](https://www.brid.gg/?fromChainId=1\&toChainId=8453)
>
> An alternative L1 ↔ Base bridge. [Testnet](https://testnet.brid.gg/?fromChainId=11155111\&toChainId=84532)

Withdrawals from Base to Ethereum through the standard bridge wait for the finalization window shown in [Compare Bridge Types](#compare-bridge-types). Superbridge can also route through third-party bridges; check which route it selects before you confirm.

### Programmatic Bridging

To bridge ETH and ERC-20s from Ethereum to Base in code, start from the [sample repository](https://github.com/base-org/guides/tree/main/bridge/native).

> [!WARNING]
>
> **Double-check the token address for ERC-20s.** Confirm the token has a `base` entry in the [Superchain token list](https://github.com/ethereum-optimism/ethereum-optimism.github.io/tree/master/data) ([example](https://github.com/ethereum-optimism/ethereum-optimism.github.io/blob/master/data/WETH/data.json#L16-L18)), and always test with small amounts first. This sample bridges assets **to** Base only — do not modify it to withdraw.

### For Token Issuers

To make an ERC-20 on Ethereum bridgeable to Base through the standard bridge, use the sample repository above as a starting point for the standard bridge contracts, then list your token on the Superchain token list.

To issue one token across Base and other chains, use a [cross-chain messaging protocol](#cross-chain-messaging-protocols).

## Fast Bridges

Fast bridges move assets between Base, Ethereum, and other chains in both directions, typically in seconds to minutes. Providers pay you out from liquidity on the destination chain, then settle through their own mechanism.

| Provider | How it works | Links |
| - | - | - |
| Across | Intent-based bridge filled by competing relayers | [App](https://app.across.to/bridge), [Docs](https://docs.across.to) |
| Relay | Bridging and swaps filled by solvers | [App](https://relay.link), [Docs](https://docs.relay.link) |
| Stargate | Liquidity-pool bridge built on LayerZero | [App](https://stargate.finance/bridge), [Docs](https://stargateprotocol.gitbook.io/stargate/v2-user-docs) |

> [!WARNING]
>
> **Fast bridges do not inherit Base's security.** Your funds depend on the provider's contracts, relayers, and liquidity, and fees vary by route and size. Review the provider's security model, supported assets, and fees, and test with a small amount first.

## Bridge Aggregators

Aggregators quote routes across many bridges and pick one for you, which helps when you are coming from a chain without a direct route to Base. The route's security depends on the bridge the aggregator selects, so check which bridge it uses before you confirm.

> [card] [Jumper](https://jumper.exchange)
>
> Bridge and swap aggregator built on LI.FI.

> [card] [Bungee](https://www.bungee.exchange)
>
> Bridge and swap aggregator built on Socket.

## Cross-Chain Messaging Protocols

Cross-chain messaging protocols let a token issuer deploy one token across Base and other chains. Both of these support Base Mainnet:

| Protocol | Token standard | Base reference |
| - | - | - |
| Chainlink CCIP | Cross-Chain Token (CCT) | [Base on CCIP](https://docs.chain.link/ccip/directory/mainnet/chain/ethereum-mainnet-base-1) |
| LayerZero V2 | Omnichain Fungible Token (OFT) | [OFT quickstart](https://docs.layerzero.network/v2/developers/evm/oft/quickstart) |

On LayerZero, Base Mainnet is endpoint ID `30184`; see [deployed contracts](https://docs.layerzero.network/v2/deployments/deployed-contracts).

A token issued this way is secured by the protocol's own network, not by Base's standard bridge. Choose the protocol and its security settings before launch.

## From Solana

The Base–Solana bridge enables bidirectional token transfers and message passing between Base and Solana: move SOL and SPL tokens, send cross-chain messages, deploy wrapped tokens on either chain, and optionally auto-relay for instant execution.

> [card] [Full Documentation](https://docs.base.org/specifications/base-protocol/bridging/base-solana-bridge.md)
>
> Complete guide with code examples and contract addresses

> [card] [Terminally Onchain](https://terminallyonchain.com/)
>
> Production terminal UI for bridging and contract calls

| Network | Contract | Address |
| - | - | - |
| Base Mainnet | Bridge | `0x3eff766C76a1be2Ce1aCF2B69c78bCae257D5188` |
| Base Mainnet | SOL token | `0x311935Cd80B76769bF2ecC9D8Ab7635b2139cf82` |
| Solana Mainnet | Bridge program | `HNCne2FkVaNghhjKXapxJzPaBvAKDG1Ge3gqhZyfVWLM` |

> [!NOTE]
>
> For testnet addresses and full implementation details, see the [Base–Solana bridge documentation](https://docs.base.org/specifications/base-protocol/bridging/base-solana-bridge.md#contract-addresses).

## From Bitcoin

[Garden](https://app.garden.finance/?output-chain=base\&output-asset=cbBTC) is a fast, non-custodial bridge for moving BTC and other supported assets to Base. Available on [mainnet](https://app.garden.finance/?output-chain=base\&output-asset=cbBTC) and [Sepolia testnet](https://testnet.garden.finance/?output-chain=base_sepolia\&output-asset=USDT).

> [!NOTE]
>
> The bridge previously at bridge.base.org has been deprecated. Use the routes above instead.

## USDC on Base

Circle issues USDC natively on Base. Use the native USDC contract for new integrations. Circle lists the canonical address for every network on its [USDC contract addresses](https://developers.circle.com/stablecoins/usdc-contract-addresses) page.

| Token | Network | Address | Issuer |
| - | - | - | - |
| USDC | Base Mainnet | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | Circle (native) |
| USDC | Base Sepolia | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | Circle (native) |
| USDbC (USD Base Coin) | Base Mainnet | `0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA` | Bridged from Ethereum |

Check the contract address, not the ticker, before you accept or send USDC on Base. USDbC is a legacy token bridged from Ethereum USDC through the standard bridge. Circle does not issue it, and it is separate from native USDC. To move from USDbC to native USDC, swap it onchain or withdraw it to Ethereum through the standard bridge. The [Superchain token list](https://github.com/ethereum-optimism/ethereum-optimism.github.io/blob/master/data/BridgedUSDC/data.json) maps Ethereum USDC (`0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`) to USDbC on Base.

To move native USDC between Base and other networks, use Circle's [Cross-Chain Transfer Protocol (CCTP)](https://developers.circle.com/cctp). CCTP burns USDC on the source chain and mints native USDC on the destination chain, so no bridged token is created. Base is CCTP domain `6`; see [CCTP supported chains and domains](https://developers.circle.com/cctp/concepts/supported-chains-and-domains). To integrate it, follow the [CCTP technical guide](https://developers.circle.com/cctp/technical-guide).

### Other Stablecoins

Circle also issues EURC, a euro stablecoin, natively on Base:

| Token | Network | Address | Issuer |
| - | - | - | - |
| EURC | Base Mainnet | `0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42` | Circle (native) |
| EURC | Base Sepolia | `0x808456652fdb597867f38412077A9182bf77359F` | Circle (native) |

Confirm addresses on the issuer's own page ([EURC contract addresses](https://developers.circle.com/stablecoins/eurc-contract-addresses)) before you integrate. Stablecoins created with the [B20 Stablecoin variant](https://docs.base.org/get-started/issue-stablecoins.md) carry a self-declared `currency()` code; B20 checks the format of that code, not the issuer or its reserves.

## Disclaimer

Coinbase Technologies, Inc. provides links to these independent service providers for your convenience but assumes no responsibility for their operations. Any interactions with these providers are solely between you and the provider.
