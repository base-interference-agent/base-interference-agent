> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Data and AI access

> Public documentation, machine-readable launchpad configuration, onchain data, and safe wallet-based agent workflows.

o1 Launchpad documentation and production configuration are available in formats that work for people, search tools, coding agents, and other AI clients.

## Documentation resources

| Resource | Access | Use |
| - | - | - |
| Documentation index | [Open `llms.txt`](https://docs.o1.exchange/llms.txt) | Discover available documentation pages |
| Full documentation | [Open full text](https://docs.o1.exchange/llms-full.txt) | Retrieve the public documentation as one text corpus |
| Page Markdown | Add `.md` to a documentation page URL | Retrieve clean context for one page |
| Skill description | [Open `skill.md`](https://docs.o1.exchange/skill.md) | Read the documentation's agent-facing capability summary |
| Documentation MCP | `https://docs.o1.exchange/mcp` | Connect an MCP client to search and retrieve public documentation |

> [!NOTE]
>
> The MCP URL is a client endpoint, not a web page. Opening it directly in a browser may return a method-not-allowed response.

## Machine-readable production configuration

The [`production-deployments.json`](https://docs.o1.exchange/launchpad/reference/production-deployments.json) file provides contract addresses, dated configuration, paired assets, fees, governance addresses and contract limits for the supported chains. The [`launch-contract-suites.json`](https://docs.o1.exchange/launchpad/reference/launch-contract-suites.json) registry identifies current and historical deployments.

See [Stock-paired launches](https://docs.o1.exchange/launchpad/create/stock-paired-launches.md) for supported assets, or use the machine-readable [Base](https://docs.o1.exchange/launchpad/reference/base-stock-quotes.json), [Robinhood](https://docs.o1.exchange/launchpad/reference/robinhood-stock-quotes.json), [BSC](https://docs.o1.exchange/launchpad/reference/bsc-stock-quotes.json), [Monad](https://docs.o1.exchange/launchpad/reference/monad-stock-quotes.json) and [X Layer](https://docs.o1.exchange/launchpad/reference/xlayer-stock-quotes.json) stock lists. Standard and Tax use separate factories and paired-asset registrations.

The [Base Tax configuration](https://docs.o1.exchange/launchpad/reference/base-tax-suite.json), [Robinhood Tax configuration](https://docs.o1.exchange/launchpad/reference/robinhood-tax-suite.json), [BSC Tax configuration](https://docs.o1.exchange/launchpad/reference/bsc-tax-suite.json), [Monad Tax configuration](https://docs.o1.exchange/launchpad/reference/monad-tax-suite.json), [X Layer Tax configuration](https://docs.o1.exchange/launchpad/reference/xlayer-tax-suite.json), [Arc Tax configuration](https://docs.o1.exchange/launchpad/reference/arc-tax-suite.json) and [Elysium Tax configuration](https://docs.o1.exchange/launchpad/reference/elysium-tax-suite.json) list each deployment's contracts, percentage units, claim helper, quote registrations and Dividend exclusions. Use the hosted configuration to resolve a creation-available product route; `currentSuiteIdsByProduct`, where present, identifies the documented product selection. Resolve each Tax deployment by chain and suite, and use the originating factory to identify existing tokens. The JSON separates dated `configuration` observations from the documented `releaseConfiguration`; refresh mutable values from the selected Factory before building transactions. Arc native USDC uses 18 decimals while its shared ERC-20 view uses six; cirBTC uses eight. Resolve the originating suite and reward currency before interpreting event amounts.

These snapshots do not gate the application or Public API. Current creation availability comes from the shared platform catalog together with live quote registration and the active factory's launch-enabled state. Historical entries preserve attribution and original contract bindings. Index-only Tax entries support indexing and direct recovery, not public preparation. Other historical suites retain their documented capabilities; none should be treated as the current creation target.

These JSON files are dated public snapshots that clients can fetch and parse directly. Resolve an existing token using its chain ID and originating factory rather than substituting the current factory. Applications that prepare new creation transactions should also read the current active factory configuration before asking a wallet to sign.

The [Base](https://docs.o1.exchange/launchpad/reference/base-wsto-suite.json) and [Robinhood](https://docs.o1.exchange/launchpad/reference/robinhood-wsto-suite.json) \$O launch snapshots identify each chain's burn-only Factory, Hook, settlement reserve, adapter and wstO vault. Their percentage units and immediate quote burns are separate from Standard BPS fees and Tax reward allocations. Use `launch_product=wsto` for [API configuration and preparation](https://docs.o1.exchange/launchpad/integration/wsto.md#public-api).

## Public market and launch data

The o1 interface presents:

* launch discovery across All, Crypto, and Stocks views, global search, newest tokens, liquidity, trending, and 24-hour volume;
* token profiles, creators, socials, and explorer links;
* pool price, FDV, liquidity, charts, recent trades, and holders;
* creator announcements and token profile updates;
* Standard creator/referral/platform and Tax creator/protocol/integrator fee-claim information;
* Tax dividend positions, trade-time reward assignment, holder-authorized claims, and burn collection versus delivery.
* per-launch-pool wstO fee-burn totals, separate from global share supply, vault redemptions, reserve funds and recipient revenue.

Contract state and chain events are the authoritative sources for tokens, pools, trades, fees, and claims. The interface adds searchable and historical views around that public data.

## Safe agent workflow

**1. Read current information**

Retrieve the relevant documentation, production addresses, and live contract configuration.

**2. Prepare an unsigned action**

Build the launch, trade, or claim request with the selected chain, creation route, paired asset, current fees, recipients, slippage, and deadline.

**3. Show the complete result**

Present the contract, assets, amounts, recipients, and expected outcome before requesting approval.

**4. Sign with the user's wallet**

The user reviews and signs in their wallet. Documentation and data tools never need the private key.

Agents and integrations should never store a private key, auto-sign transactions, reuse a stale factory configuration, or infer a creation route from a token symbol alone.

The [BSC stock catalog](https://docs.o1.exchange/launchpad/reference/bsc-stock-quotes.json) lists all 21 registered bStocks. Its native BNB, USDC and stock quotes use 18 decimals. Stock USD references use TickDB market data with the token's onchain conversion applied once; crypto pricing uses Codex. Canonical launch/trade/fee events remain the source for indexed activity. A deployed catalog does not establish executable routes or complete historical coverage.

Monad entries include chain 143, native MON, USDC, WETH and 10 wrapped xStocks. Stock USD references use TickDB market data with the wrapper's `convertToAssets` rate applied once. Read the factory for current settings before preparing transactions.

X Layer entries include chain 196, native OKB, USDC, xETH and supported wrapped stocks, plus the SwapX router, adapter and release governance addresses. Read the factory for current settings before preparing transactions. Native OKB uses 18 decimals. The pool currency is native OKB; WOKB is its separate wrapper. The Public API's supported chain list remains defined by its live `/v1/config` response.

Elysium entries cover chain 99901 with native HYPE and USDC crypto quotes only; there is no Elysium stock catalog. Native HYPE uses 18 decimals and USDC uses 6. WHYPE is a separate wrapped routing token. Read the factory for current settings before preparing transactions.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.