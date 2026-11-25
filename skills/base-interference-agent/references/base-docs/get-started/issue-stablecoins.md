> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Issue a Stablecoin

> Run a fiat-backed stablecoin on Base with minting, compliance, and reconciliation built into the chain.

Issue a fiat-backed stablecoin on Base with [B20](https://docs.base.org/specifications/b20.md), Base's native token standard. Minting, redemption, compliance controls, and reconciliation ship with the chain, so there's no custom contract to build or audit, and it's fully ERC-20 compatible.

To hold or move stablecoins from more than one issuer, see [Stablecoins From Different Issuers](https://docs.base.org/specifications/b20/concepts/token-types.md#51-stablecoins-from-different-issuers).

## Network Status

B20 shipped in the [Beryl upgrade](https://docs.base.org/upgrades/beryl/overview.md). The B20 Stablecoin and Asset variants are active on Base Mainnet. Before you deploy on any network, confirm the variant is active with [`isActivated`](https://docs.base.org/specifications/b20/reference/interfaces/i-activation-registry/is-activated) on the Activation Registry.

[`createB20`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-factory/create-b20) requires no role or allowlist. Any account can create a stablecoin once the variant is active, and the Factory keeps no access to the token after creation.

## Guides

> [card] [Issue Your Stablecoin](https://docs.base.org/build-on-base/issue-stablecoins/issue-your-stablecoin.md)
>
> Create a fiat-backed token in one call.

> [card] [Mint Supply](https://docs.base.org/build-on-base/issue-stablecoins/mint-supply.md)
>
> Issue new tokens as reserves grow.

> [card] [Burn Supply](https://docs.base.org/build-on-base/issue-stablecoins/burn-supply.md)
>
> Retire tokens on redemption.

> [card] [Restrict Who Can Hold It](https://docs.base.org/build-on-base/issue-stablecoins/restrict-who-can-hold.md)
>
> Limit transfers to approved accounts.

> [card] [Block an Account](https://docs.base.org/build-on-base/issue-stablecoins/block-an-account.md)
>
> Stop one address on a compliance hold.

> [card] [Recover Funds](https://docs.base.org/build-on-base/issue-stablecoins/recover-funds.md)
>
> Reclaim and reissue a blocked balance.

> [card] [Pause Activity](https://docs.base.org/build-on-base/issue-stablecoins/pause-activity.md)
>
> Halt transfers, mints, or burns.

> [card] [Reconcile with Memos](https://docs.base.org/build-on-base/issue-stablecoins/reconcile-with-memos.md)
>
> Match onchain activity to your books.
