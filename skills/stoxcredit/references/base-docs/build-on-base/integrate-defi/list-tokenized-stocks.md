> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# List Tokenized Stocks

> Let users trade Coinbase-issued tokenized stocks on your app.

Tokenized Stocks on Base are built on the Base-native token standard, [B20](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md). B20 is an extension of the ERC-20 token standard and is intended to be asset-agnostic, with tokenized stocks being one of several possible use cases.

Product-specific details about Tokenized Stocks on Base can be found within [coinbase.com/tokenize](https://coinbase.com/tokenize).

> [!TIP]
>
> The public [Tokenized Stocks API](https://docs.base.org/sdks/tokenized-stocks/overview.md) returns the tokenized-stock records currently exposed through the API, including contract addresses, normalized token supplies, multipliers, and Chainlink-based NAV/reference values, in a single read-only request with no API key required.

## Token Information and Listings

Tokenized stocks launch similarly to any ERC-20 token: name, symbol, and icon come from the usual sources, along with a few notable B20 specifics. Standard ERC-20 methods and events are supported natively.

* **Onchain:** [`name`](https://docs.base.org/specifications/b20/reference/interfaces/ib20/name), [`symbol`](https://docs.base.org/specifications/b20/reference/interfaces/ib20/symbol), [`decimals`](https://docs.base.org/specifications/b20/reference/interfaces/ib20/decimals), and [`contractURI`](https://docs.base.org/specifications/b20/reference/interfaces/ib20/contract-uri) ([ERC-7572](https://eips.ethereum.org/EIPS/eip-7572) metadata).
* **Offchain:** logos are also available from the canonical token list and market-data aggregators.
* **API:** the [List Tokenized Stocks](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-tokenized-stocks.md) endpoint returns `contract_address`, `symbol`, `name`, `description`, `decimals`, and `multiplier` for each token. Depending on the token, it can also return `icon_url`, `total_supply`, `isin`, `adgm_isin`, `paused_features`, `nav_price`, `nav_price_updated_at`, and `first_mint_date`; default-valued fields, empty arrays, and unset timestamps may be omitted.

B20 specifics:

* Tokens should be identified by address rather than ticker or symbol. Metadata is mutable onchain and should be indexed accordingly.
* Discover new tokens by watching the [`B20Created`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-factory) event.

## B20 Token Features

### Multipliers

An underlying real-world asset may undergo events that change the redemption ratio of a B20 token. For tokenized stocks, these events include dividends or stock splits, which must be passed along to the holder of the B20 tokenized equity onchain. The [multiplier](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/multiplier) variable instantly updates the redemption ratio of a B20 token based on any corporate actions that occur.

> [!WARNING]
>
> One B20 token does not permanently equal one share. Always apply the current multiplier when converting between token units and the number of underlying shares.

Asset-level events are reflected by updating the multiplier. For example, after a dividend on a tokenized equity, the multiplier increases to `1.02`, representing that 1 B20 token is redeemable for 1.02 shares of the equity.

At this time, for tokenized stocks, cash dividends are converted to shares of the underlying equity and reflected via a multiplier update rather than distributed as cash to the B20 holder. This allows B20 holder balances to automatically reflect corporate actions without changing their balance of the B20 token.

Multiplier updates come in two forms:

* **Scheduled (ERC-8056):** set a future-dated change with [`updateUIMultiplier`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/update-ui-multiplier), which gives advance onchain notice. Use this for routine corporate actions.
* **Instant (deprecated):** [`updateMultiplier`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/update-multiplier) applies immediately and clears any pending scheduled change. It is a retained emergency failsafe; prefer the scheduled path.
* **Cancellation:** clear a pending scheduled update with [`cancelUIMultiplierUpdate`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/cancel-ui-multiplier-update).

The B20 contract provides ERC-8056 helper functions for common calculations, where `raw` is the number of B20 units and `ui` is the quantity of stocks redeemable:

| Function | Description |
| - | - |
| [`uiMultiplier()`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/ui-multiplier) | Current effective multiplier (WAD) |
| [`balanceOfUI(account)`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/balance-of-ui) | Raw balance × multiplier |
| [`totalSupplyUI()`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/total-supply-ui) | Raw total supply × multiplier |
| [`toUIAmount(raw)`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/to-ui-amount) | Convert raw amount to UI amount |
| [`fromUIAmount(ui)`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/from-ui-amount) | Convert UI amount to raw |

`multiplier()` and `scaledBalanceOf(account)` remain the canonical B20 names; `uiMultiplier()` and `balanceOfUI(account)` are their ERC-8056 aliases and return the same values. `toScaledBalance` and `toRawBalance` remain callable but are deprecated in favor of `toUIAmount` and `fromUIAmount`. See the [Cobalt multiplier changelog](https://docs.base.org/base-chain/specs/reference/b20/changelog/02-cobalt-b20asset-multiplier.md#functions).

### Policies

To comply with any regulatory requirements that apply to a particular asset, [policies](https://docs.base.org/specifications/b20/reference/interfaces/i-policy-registry) that manage allowlists and blocklists may be implemented. Policies determine whether a transfer is allowed or rejected.

The B20 contract provides the [`isAuthorized(policyID, account)`](https://docs.base.org/specifications/b20/reference/interfaces/i-policy-registry/is-authorized) function, which you can use to determine whether a specific account is allowed to transfer funds. It never reverts, so a policy ID that doesn't exist still returns a result; check `policyExists(policyId)` before you rely on it.

> [!NOTE]
>
> The standard [`approve()`](https://docs.base.org/specifications/b20/reference/interfaces/ib20/approve) function is not policy gated. Checking whether a quantity of funds is approved to be transferred does not guarantee that the funds aren't blocked by a policy.

### Pauses

Onchain [pauses](https://docs.base.org/specifications/b20/reference/interfaces/ib20/pause) are unlikely, but be aware that B20s allow specific functions within a contract to be paused. Monitor these to maintain an accurate understanding of whether funds can be transferred at a given point in time.

### Announcements

Sensitive operations are wrapped in onchain [announcement events](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/announce): [`announce`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/announce) emits [`Announcement (id, description, uri)`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset), then [`EndAnnouncement`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset). Integrators index these to catch corporate actions as they execute.

Two design points:

* Announcements can be atomically bundled with the token change they describe (for example, the multiplier update for a stock split), keeping onchain records clean.
* Descriptions are intentionally human-readable onchain to support public reporting requirements.

**Admin actions:** admin operations and multiplier updates ([`OPERATOR_ROLE`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/operator-role)) execute when the role holder calls (scheduled multiplier updates flip at `effectiveAt`); the B20 standard has no built-in timelock. The `Announcement` and `EndAnnouncement` events are public notice, not an enforced delay. Any timelock or multisig is applied by the issuer at the governance layer.

### Extra Metadata

Issuers can store arbitrary key/value data onchain via [`extraMetadata(key)`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/extra-metadata) (for example, security identifiers such as ISIN and CUSIP).

### Name and Symbol

Name and symbol are updatable onchain ([`updateName`](https://docs.base.org/specifications/b20/reference/interfaces/ib20/update-name), [`updateSymbol`](https://docs.base.org/specifications/b20/reference/interfaces/ib20/update-symbol)), so the token can track offchain changes to the underlying without redeploying.

### Memos

[`transferWithMemo`](https://docs.base.org/specifications/b20/reference/interfaces/ib20/transfer-with-memo) and [`transferFromWithMemo`](https://docs.base.org/specifications/b20/reference/interfaces/ib20/transfer-from-with-memo) attach a `bytes32` reference to an individual transfer (emitted as a `Memo` event), for annotating transfers with offchain data for reconciliation and reporting.

### Supply Cap

An optional supply cap bounds total supply, mitigating over-minting from operational errors or a compromise.

## Compliance

Holding and trading on the secondary market is permissionless. KYC only happens during mint and redeem flows taken by Authorized Participants (APs).

* Onchain policies can block specific addresses, such as sanctioned addresses; a blocked transfer reverts (see [Policies](#policies) above).
* Minting and redeeming the underlying shares is a separate, restricted issuer flow, as it is restricted to APs.

**Security and audits:** tokenized stocks are B20 native precompiles, not separately deployed contracts, so there is no per-asset contract and no per-address verified contract on Basescan (precompiles hold no bytecode). B20 shipped in Base's Beryl upgrade on code audited by Base and Spearbit, with ongoing Cantina (smart contract) and HackerOne (offchain and infrastructure) bug-bounty coverage. Every token shares the same audited implementation.

## Contract Addresses

Each tokenized stock is a B20 token with its own address. B20 tokens are native precompiles, so the address holds no bytecode on Basescan. Use the token address to list, trade, or index a stock; don't use the Chainlink feed addresses under [Price Feeds](#price-feeds), which are price oracles, not tokens.

Search or page through every tokenized stock below, or find them on the [Base assets page](https://www.base.org/assets?utm_source=docs). To fetch token addresses programmatically, call the [List Tokenized Stocks](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-tokenized-stocks.md) endpoint (`GET https://api.coinbase.com/v1/tokenized-stocks`). For protocol contracts, use the [List Protocol Contract Addresses](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-protocol-contract-addresses.md) endpoint. The Onchain Registry that the price feeds read is at `0x3f3E8cf41cdd3b1D118c16471aB0113DfDDd5CaD`.

## Price Feeds

A tokenized stock's price is available from both onchain and offchain sources. In every case, the price is derived from the same relationship: the underlying equity's market price scaled by the token's multiplier.

```text Token price formula theme={null}
Token Price = Underlying Equity Market Price × Multiplier
```

The multiplier is sourced per token and is WAD-scaled (a fixed-point number with 18 decimals). To get the real factor, divide the onchain value by that scale; call [`WAD_PRECISION()`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset/wad-precision) to read the scale (it returns `1e18`).

### Onchain

Chainlink is the onchain price option at launch. Each tokenized equity has a Chainlink feed that runs 24/5, holds the last close on weekends and holidays, and freezes during corporate actions. Feeds implement the standard Chainlink V3 aggregator interface and are read through the proxy, exactly like a crypto price feed; read the latest value with `latestRoundData()`.

The [Tokenized Stocks API](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-tokenized-stocks.md) also returns `nav_price`, the most recently published Chainlink-based NAV/reference value for each token, along with `nav_price_updated_at` and the current `multiplier`. `nav_price` is not a live bid/ask or execution price: read `nav_price_updated_at` and apply the same staleness bounds you would to `updatedAt` before relying on it.

Unlike standard market-rate feeds, Coinbase feeds report **Total Return Values** rather than raw equity prices, so the price reflects the underlying's total return including corporate-action adjustments. Chainlink uses this same approach for other tokenized-equity issuers, including [Ondo and Robinhood](https://docs.chain.link/data-feeds/tokenized-equity-feeds/providers). The underlying price is sourced from Chainlink's equity price feeds (traditional market data), not from onchain or DEX trading of the token; the token's DEX price does not feed the oracle.

The feed reads the multiplier and a pause flag from Coinbase's onchain oracle registry, a single contract (separate from the tokens) that returns both values for a token in one call:

* **Normal (`paused = false`):** the feed publishes underlying price × multiplier.
* **Paused (`paused = true`):** the feed stops publishing and holds the last known good value.

> [!WARNING]
>
> During market hours the feed updates on a 0.5% price deviation or at least every 24 hours (its heartbeat). Off-hours (nights, weekends, holidays, and corporate-action pauses) it stops updating and holds the last value, so `updatedAt` stops advancing while the contract stays callable. Always read `updatedAt` and apply staleness bounds before relying on the price; never settle or liquidate against a frozen feed.

During a corporate action:

* Mint and redeem pause offchain, but the token is not paused onchain, so transfers are not blocked.
* The feed freezes (the registry pause flag is set) and its price goes stale.
* Because the feed is total-return, there is no price discontinuity: the multiplier and underlying price move in opposite directions and cancel (a 10:1 split drops the price \~10x and raises the multiplier \~10x).
* **Fail-safe:** the feed resumes only after Coinbase confirms the underlying price and multiplier both reflect the new values. If one updates before the other, the feed stays frozen at the pre-pause price rather than publishing a half-applied value.

**Chainlink data feeds on Base.** Each listed Coinbase tokenized stock with a configured Chainlink feed appears in the table below, next to the token it prices. Feed addresses are price oracles, not tokens: for every token contract address, see [Contract Addresses](#contract-addresses). To fetch the feeds programmatically, call the [List NAV Feed Addresses](https://docs.base.org/sdks/tokenized-stocks/api-reference/list-nav-feed-addresses.md) endpoint (`GET https://api.coinbase.com/v1/tokenized-stocks/nav-feeds`), which returns each token's feed address. A token with no entry there has no configured NAV feed. You can also look up feeds on Chainlink's [price feed addresses page](https://docs.chain.link/data-feeds/price-feeds/addresses?network=base) by selecting Base Mainnet. Read each feed via `latestRoundData()` on its proxy address. All feeds return 8 decimals, cover US equities (24/5 market hours), and update on a 0.5% price deviation or a 24-hour heartbeat. Values are total-return; apply the pause and staleness handling above.

### Offchain

Offchain price data can be sourced from providers such as CoinGecko, CoinMarketCap, or RWA. These aggregators track the token's live market price from the DEXs where the B20 trades, which runs 24/7 whenever the secondary market is active.

Two common patterns are used to determine value:

* Directly reading the token's market price from a provider that tracks the B20 asset.
* Reading the underlying reference price and applying the multiplier calculation manually.

### Historical Data

For historical OHLC and time-series data, use market-data providers or query Chainlink round history by `roundId`.

Since prices are total-return (multiplier-adjusted), reconstruct the series consistently by applying the multiplier history if starting from raw share prices. Build that history from [`UIMultiplierUpdated`](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset) events, emitted by both scheduled and instant multiplier changes, and date each change by its `effectiveAtTimestamp`, not the block time. Drop any scheduled update later cancelled by a `UIMultiplierUpdateCancelled` event: it emitted `UIMultiplierUpdated` but never took effect.

## Additional Resources

* [Tokenized Stocks API](https://docs.base.org/sdks/tokenized-stocks/overview.md)
* [B20 Standard](https://docs.base.org/specifications/b20.md)
* [Base Standard Library](https://github.com/base/base-std/tree/main)

## Disclaimer

Coinbase tokenized stocks are only available to persons in eligible jurisdictions outside of the U.S.

Inclusion of any third-party protocol or venue is for developer reference only and is not an endorsement, partnership, or warranty. Confirm addresses, feeds, and the token list against official sources before integrating.

Base is open-source, permissionless blockchain infrastructure. Each B20 token is deployed and configured by its issuer, who sets and controls all token parameters and administrative permissions; Base does not configure, administer, or control tokens deployed on the protocol.
