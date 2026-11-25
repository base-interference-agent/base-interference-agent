> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Skill

> Connect to Coinbase to trade crypto, US derivatives (futures), and US equities, pay for
premium data via x402, manage portfolios, check prices, and convert currencies.
Use when the user wants to place or preview orders, manage portfolios, transfer funds
between portfolios, pay for market data or research services, or set up Coinbase access
for an AI agent, even if they don't explicitly say "Coinbase" or "CLI."


# Coinbase for Agents

Connect to your Coinbase account to trade crypto, US equities, and derivatives, manage portfolios, and pay for trading data and research via x402 from your existing Coinbase USDC balance.

## Setup

First identify which harness the user wants to connect. Use reliable environment context or ask if it is unknown; distinguish **Claude** from **Claude Code** and **Grok** from **Grok Bot**. Remote MCP with Coinbase OAuth is currently supported for these allowlisted harnesses: **ChatGPT, Grok Bot, Grok, Muse, Hermes, Supertake, Perplexity Computer, Claude, Claude Code, and Codex CLI**. No CDP API key is needed for these.

Reuse an existing authenticated Coinbase connection. Otherwise, follow [Harness setup](#harness-setup) and present only the matching harness's steps, connector link, and prerequisites. Use the documented connector when available; don't build a custom connection or install the CLI. Reading this guide does not install or authorize a connector. If setup requires user interaction, provide the steps and wait for authentication before verifying access.

For any other harness, or when the user explicitly requests it, use the [local CLI](#local-cli-cursor-windsurf-codex-and-other-coding-agents) with a CDP API key if the harness can run shell commands. If an unsupported harness cannot run the CLI, tell the user it is not yet supported and point them to [CDP Discord](https://discord.com/invite/cdp) to request support. Do not improvise another connection path or replace a working remote connection with a CLI installation.

### Remote MCP

Server: `https://agents.coinbase.com/mcp`. Coinbase allowlists clients. Remote MCP supports Dynamic Client Registration (DCR) and Client ID Metadata Documents (CIMD); successful registration alone does not make a client supported or grant account access. Let the harness manage registration, Coinbase OAuth, and credential storage. If a supported harness fails to connect, report the error and request help through [CDP Discord](https://discord.com/invite/cdp). For other harnesses, follow the CLI-or-unsupported guidance under [Setup](#setup). Do not build a replacement OAuth flow, impersonate another client, or bypass access restrictions.

### Dedicated agent portfolio

Only if the user asks how to limit the agent's access, where to see their portfolios, or how to create one, explain that they can create a dedicated portfolio, fund it with only what they're willing to risk, and select only that portfolio on the approval screen or in the API key's **Accounts** scope. To create or view portfolios, go to **Portfolio** > **Spot** at [https://www.coinbase.com/advanced-portfolio/spot](https://www.coinbase.com/advanced-portfolio/spot) and open the **All portfolios** dropdown above the balance, which lists every portfolio and includes **New portfolio**. Don't bring this up otherwise.

### Harness setup

Follow the matching instructions below. The [supported-harnesses documentation](https://docs.cdp.coinbase.com/ai-agents/coinbase-for-agents/coinbase-mcp.md#supported-harnesses) also includes setup videos. These inline steps are sufficient to guide setup without fetching another page.

**ChatGPT:**

Find the official Coinbase plugin on ChatGPT web, mobile, or desktop. Set up Custom MCP on ChatGPT web first; that connection is then also available in ChatGPT desktop and mobile.

Offer two options and ask which the user wants before creating a new connection. Reuse an existing connection unless the user asks to change it:

* **Official Coinbase plugin:** For order workflows with Coinbase confirmation cards. Currently available to U.S. Coinbase users, subject to ChatGPT account and workspace availability. Open [the official plugin](https://chatgpt.com/plugins/plugin_asdk_app_6ae8a667e79c8191917411e3f4b9747e), or search for **Coinbase** in ChatGPT on web, mobile, or desktop. Follow installation, sign in to Coinbase, and select portfolio access. Order placement, edits, cancellations, and USD–USDC conversions use confirmation cards. Read-only requests do not use those cards. ChatGPT's own tool permissions are separate.
* **Custom MCP:** Connect to the standard server using the steps below. No Coinbase confirmation card is added before execution. Coinbase sign-in, access consent, ChatGPT permissions, and explicit authorization for financial actions still apply. Do not describe this as bypassing approvals or recommend disabling the client's safety controls.

For Custom MCP:

1. Open **Plugins** in the side navigation.
2. Select **Add** (top right) > **Add Custom MCP Server**.
3. Name it "Coinbase" and enter `https://agents.coinbase.com/mcp` as the **Server URL**.
4. Leave **Authentication** set to **OAuth**, check **I understand and want to continue**, then click **Create as a plugin**.
5. Sign in with your Coinbase account when prompted.
6. On the approval screen, select which portfolios to give the agent access to.

If **Add Custom MCP Server** isn't available, turn on Developer mode in Settings. Availability depends on the account plan and workspace policy; see OpenAI's [developer mode requirements](https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta) or ask a workspace admin.

**Grok:** Open **Plugins** in the bottom-left corner, search for **Coinbase**, choose **Add** > **Connect**, then sign in to Coinbase.

**Grok Bot:** If the user already connected Coinbase in Grok, the connector should also appear in their Grok Bot account; check for it first. Otherwise, open **Marketplace**, search for **Coinbase**, choose **Add**, then sign in to Coinbase if prompted. Connectors are account-wide and available to all of the user's Bots. Select a dedicated portfolio on the approval screen to limit Coinbase access.

**Muse:** Reuse an existing connection to `https://agents.coinbase.com/mcp` if available. Otherwise, start Muse's remote-MCP connection flow. Muse handles registration automatically and redirects the user to Coinbase login; the user does not need to obtain or enter a client ID or create a CDP API key. Have the user sign in on Coinbase and approve only the access needed for their request. If setup asks for a manually supplied client ID, stop and report that automatic registration was not reached rather than registering a client yourself.

**Perplexity Computer:** Open [Add Coinbase to Perplexity Computer](https://www.perplexity.ai/computer/connectors?query=coinbase\&connector=coinbase), add the connector, then sign in to Coinbase. If the link does not work:

1. Click **Customize** in the left navigation.
2. Under **Connectors**, search for **Coinbase**.
3. Click **Add Connector**.
4. Sign in with your Coinbase account.

**Hermes:** In the Hermes Agent app, open **Capabilities** in the left navigation, switch to the **Connectors** tab, search for **Coinbase**, and click **Connect** on **Coinbase Agents**. Click **Continue to Coinbase Agents MCP**, sign in to Coinbase, select which portfolios to give the agent access to, then return to Hermes.

**Supertake:** On [supertake.com](https://supertake.com), sign in and complete the initial setup. Click **Settings** in the left navigation, scroll down to **Trading**, click **Connect on Coinbase**, and follow the tooltip to turn on equities. Sign in to Coinbase and select which portfolios to give the agent access to.

**Claude (web, desktop, mobile):** Open [Add Coinbase to Claude](https://claude.ai/new?modal=add-custom-connector\&connectorName=Coinbase\&connectorUrl=https%3A%2F%2Fagents.coinbase.com%2Fmcp#settings/customize-connectors), then sign in with Coinbase and select which portfolios to give the agent access to. If the link does not work:

1. Click the **Customize** toolbox icon in the left sidebar.
2. Go to **Connectors** > click **+** > **Add custom connector**.
3. Name it "Coinbase" and enter `https://agents.coinbase.com/mcp`.
4. Leave all other fields blank, then click **Create**.
5. Sign in with your Coinbase account when prompted.
6. On the approval screen, select which portfolios to give the agent access to.

**Claude Code:**

1. Run `claude mcp add coinbase --transport http https://agents.coinbase.com/mcp`.
2. Start Claude Code, run `/mcp`, and choose **coinbase** > **Authenticate**.
3. Complete the Coinbase sign-in and approval flow.

**Codex CLI:**

1. Run `codex mcp add coinbase --url https://agents.coinbase.com/mcp`.
2. Complete the Coinbase sign-in and approval flow. If the browser doesn't open, run `codex mcp login coinbase`.
3. Restart Codex if the Coinbase tools don't appear.

After the matching setup flow, use the checklist below to verify access.

### First connection checklist

This guide is self-contained; you do not need a prompt from the docs page or a previous chat.

1. Reuse an authenticated connection or complete the matching [harness setup](#harness-setup) above. Let the harness manage MCP initialization, OAuth, and credential storage; do not replace working credential helpers with custom token handling.
2. Let the harness discover supported OAuth scopes from the [protected-resource metadata](https://agents.coinbase.com/.well-known/oauth-protected-resource) and request all scopes needed for the intended Coinbase capabilities. Do not limit scopes to read-only just because verification uses a portfolio-list call; honor an explicit read-only request. If authentication is needed, have the user sign in on Coinbase and approve the permissions and portfolios. Wait for them to finish. Never ask for passwords, one-time codes, authorization codes, or tokens in chat.
3. Discover available Coinbase tools through the connected harness. Call the exposed `coinbase_portfolios_list` tool with an empty arguments object, using the exact tool name and schema the connection exposes. Check for tool and authorization errors; an empty portfolio list is a valid result. If no Coinbase tools are available after the matching setup flow, report that verification is blocked rather than claiming success or bypassing the connection with raw HTTP requests.
4. Report that the connection was verified only after the read-only portfolio call succeeds. Granted OAuth permissions enable actions; execute trades, transfers, or paid requests only when the user requests or approves them.
5. Offer the user the Coinbase MCP default starter prompt, `allocation_automation` in `prompts/list`; `prompts/get` renders it with the user's check schedule. If the user accepts and the harness does not surface MCP prompts, ask how often the check should run, then follow the text below as your task, with the line `Check schedule: <their answer>` appended:

   ```text theme={null}
   Review my Coinbase portfolio and ask me a series of questions to help me create a target portfolio allocation based on my goals/needs. This portfolio should consider every asset class and trading type (stocks and ETFs, crypto, commodities, options, futures, perpetuals, etc) available on Coinbase, not just crypto. Once we agree, set up an automation on the schedule below which checks if a price move or a change in my holdings makes a particular trade or rebalance worth considering. Try to take advantage of market dislocations to move toward my target portfolio allocation over a time period the user chooses (default being about a year), and consider tax optimization as well in your suggested trades. Whenever you have a proposed trade, bring it to me for approval via that automation. Wait for my approval before placing any trade. If you don't have any proposed trades, then stay quiet, and don't notify me that run. Separately, create a weekly automation that gives me a market briefing every Monday morning at 8AM with a summary of my portfolio, an update on how I'm tracking toward my target allocation, and a review of any trades in the prior week. If you can't schedule automations, say so, and give me the exact steps I can use to set these up myself.
   ```

Tool availability depends on the client and account eligibility; do not promise every tool in every harness. The dedicated ChatGPT trading integration excludes x402 payments.

### Adopt this guide as a skill

Reading this URL supplies instructions for the current task; it does not install a skill or guarantee discovery in future chats. If the user asks to make it reusable, use the harness's documented skill installation mechanism and confirm that the installed skill can be discovered. Do not assume a universal skills directory or auto-install on first contact.

If the harness already generated a Coinbase connector skill, preserve its credential binding, runtime helpers, and tool-calling code. Add or link this guide as a reference using the harness's supported mechanism; ask before replacing existing files. In particular, do not replace a harness credential broker with code that exposes real tokens to the model.

For a harness that accepts standalone SKILL.md files, save the guide body with YAML frontmatter. The documentation site's Markdown export can omit the source frontmatter. If it is missing, prepend the following header before the guide's title and body; do not save only the header:

```yaml theme={null}
---
name: coinbase-for-agents
description: >-
  Connect Coinbase, check a crypto portfolio or balances, trade crypto,
  eligible US stocks or futures, and pay for research with x402.
  Use for Coinbase setup, connection verification, trading, or disconnecting.
metadata:
  author: developer-platform@coinbase.com
  version: "0.2.3"
---
```

Record the actual source URL and retrieval date with the local copy. Use the same documentation origin as the page being tested; a preview page and the production guide can have different revisions. Recheck the source before refreshing a saved copy, preserve local integration code, and inspect current tools/list schemas. Do not treat an installed skill as a frozen API contract or permission to bypass the harness's security rules.

### Disconnect or remove local instructions

To revoke Coinbase access, the user can open [Coinbase Account > Security > Connections](https://accounts.coinbase.com/security/connections) and revoke the connection. The harness may also offer its own connector-disconnect action. If the agent is denied permission to disconnect, direct the user to the UI; do not bypass that boundary or claim revocation succeeded.

Removing a local skill, deleting local credentials, and clearing chat memory are different from revoking Coinbase access. Ask for explicit authorization before deleting local files or memory, and do not promise to erase logs or backups. Reconnection needs fresh consent after access is revoked.

### Local CLI (Cursor, Windsurf, Codex, and other coding agents)

Use this path for unsupported coding agents or an explicit request for the local CLI, not as a substitute for a supported remote connector. Install the Coinbase CLI; its `x402` commands use the configured CDP API key to discover and pay for curated x402 resources:

```bash theme={null}
node --version   # must be >= 22
npm i -g @coinbase/coinbase-cli
coinbase --version   # verify
```

**Linux only:** install keyring support to avoid plaintext secrets:

```bash theme={null}
which secret-tool || sudo apt install -y libsecret-tools
```

**nvm/fnm users:** Upgrading Node versions requires reinstalling global packages. After upgrading, open a new terminal and run `npm i -g @coinbase/coinbase-cli` again.

## Authentication (CLI only)

Create a CDP API key and configure the CLI:

1. Sign in to [https://portal.cdp.coinbase.com/api-keys/secret](https://portal.cdp.coinbase.com/api-keys/secret) (a project is auto-created on first sign-in)
2. Click **Create API Key**
3. Give it a name (e.g., `my-trading-agent`)
4. Under **Advanced Settings** > **Coinbase App & Advanced Trade**:
   * Under **Accounts**, select the portfolio for the agent to trade from. To use a new portfolio, create it first from the **All portfolios** dropdown at [https://www.coinbase.com/advanced-portfolio/spot](https://www.coinbase.com/advanced-portfolio/spot). US Derivatives (Futures) only work in your **default** portfolio — include it in the key scope if the agent will trade US Derivatives (Futures).
   * Enable **Trade** and **Transfer** (View is enabled by default)
   * Check **Allow requests from any IP address** if you haven't configured specific IP addresses, or set your IP range to allowlist them
5. Click **Create & Download** and save the JSON key file

```bash theme={null}
coinbase env live --key-file <path-to-key.json>
coinbase env          # verify: "live" appears with key ID
coinbase balance      # verify: returns JSON with account balances
```

## x402 Payments

Your agent can pay for premium services directly from your Coinbase USDC balance. The remote MCP uses OAuth; the local CLI uses a configured CDP API key. Services include onchain analytics, market intelligence, web research, and more.

### x402 Tools

| CLI command | Remote MCP tool | What it does |
| - | - | - |
| `coinbase x402 resources q==<keyword>` | `coinbase_x402_resources` | Discover available curated x402 services. Discovery is free. |
| `coinbase x402 fetch resource=<url> input:=<json> max_amount=<atomic-units>` | `coinbase_x402_fetch` | Pay for and retrieve data from a catalog x402 endpoint in one call. |
| `coinbase x402 pay ...` | `coinbase_x402_pay` | Authorize payment and return a header; does not fetch data. |

### How x402 works

1. **Discover**: Run `coinbase x402 resources q==<keyword>` or call `coinbase_x402_resources`. Read the resource URL, advisory price, and input schema; do not invent endpoints or parameters.
2. **Authorize**: Establish a user-approved research budget before spending. A request to connect Coinbase or research a topic is not unlimited payment or trading authority.
3. **Fetch**: Supply the catalog `resource` URL and flat resource parameters inside `input` (not a hand-built HTTP request). Set `max_amount` within the remaining budget, generate an `idempotency_key` UUID, and retain it before the call. Fetch handles a v2 challenge, payment, and the provider request.
4. **Report**: Inspect `paid`, payment metadata, and `data`. Report provider, amount, and any data-delivery failure separately; cite only values returned by the source. Track total spend across calls. A trade requires its own authorization.

**Key details:**

* Payments use **USDC on Base only**, with a **5 USDC per-payment cap**. Other account and spending controls may apply.
* For fetch, `max_amount` is optional and expressed in atomic USDC units (`1000000` = 1 USDC). It tightens the catalog ceiling; it cannot raise that ceiling. A prompt budget is not a server-enforced session or daily limit.
* Catalog prices are advisory. The live challenge supplies the exact price, bounded by the request ceiling and server limits. Stop and ask if the authorized budget is insufficient.
* Fetch supports curated catalog URLs and x402 v2 only. Prefer it over manually constructing a payment.
* For low-level pay, copy the actual challenge fields and use `coinbase x402 pay --template` or the MCP schema. Send the returned header as `X-PAYMENT` for v1 or `PAYMENT-SIGNATURE` for v2. Pay authorizes funds but does not retrieve the resource.
* A timeout or unknown payment outcome is not proof of failure. Reuse the original `idempotency_key` for the same logical payment; omitting or changing it can create another hold. For terminal rejection, follow the error's instructions before starting a new authorized attempt.
* Do not claim native Sign-In-With-X (SIWX) support. If an endpoint requires a separate signing or asynchronous retrieval flow, verify that it is supported before paying; don't repeatedly pay to work around missing authentication.
* Settled payments are irreversible.

### Available providers

Discover current resources and prices at runtime; do not hardcode prices from this skill.

* **Nansen**: smart money flows and wallet intelligence
* **Arkham** (Arkham x402): entity intelligence and wallet data
* **Glassnode**: onchain metrics
* **Dripstack** (Drip): market analysis
* **Exa**: web search and content retrieval
* **You.com**: web search
* **Massive**: stock market data

### x402 Workflows

Use these after establishing a research budget. Discover the matching resources first, stay within the remaining budget, and do not trade unless separately authorized.

**Smart money research:**

```
Use coinbase_x402_resources to search for "smart money"
Use coinbase_x402_fetch to get Nansen smart money flows for ETH
Summarize which wallets are accumulating and what the net flow looks like
```

**Morning data brief:**

```
Use coinbase_x402_fetch to pull Glassnode's MVRV and funding rate for BTC
Use coinbase_x402_fetch to search recent crypto news via You.com
Summarize: is the market overheated or calm based on these indicators?
```

**On-chain analysis:**

```
Use coinbase_x402_fetch to get exchange net flow data for BTC from Glassnode
Summarize whether institutions appear to be accumulating or distributing
```

## Core Commands

### Market Data

| Command | What it does |
| - | - |
| `coinbase products get <product_id>` | Price, 24h volume/change, size limits |
| `coinbase products list` | All tradeable products (900+ results — use `symbol` or `--jq` to filter) |
| `coinbase products list symbol==USD` | Products with USD as base or quote currency |
| `coinbase products ticker <product_id>` | Recent trades with best bid/ask (default: 100 trades) |
| `coinbase products book <product_id>` | Full order book: bids + asks |
| `coinbase products candles <product_id> granularity==1h` | OHLCV price history (default: 60 candles at 1h granularity) |
| `coinbase products best-bid-ask product_ids=BTC-USD` | Current best bid/ask |
| `coinbase products list product_type=FUTURE` | CFM dated futures contracts (e.g. `BIT-28AUG26-CDE`) — codes roll on a schedule, so discover the live one instead of hardcoding it |
| `coinbase products list product_type==EQUITY` | Eligible US stocks; product ID is `TICKER-QUOTE`, e.g. `AAPL-USD` or `AAPL-USDC` |

**Equity price lookup:** Use `products get` or `products list` and read `price` when present. This is a reference price, not a guaranteed fresh or executable bid/ask quote. Do not infer equity market-data support from a successful product lookup; see the matrix below.

### Product-type support and limitations

Use this routing matrix before planning a workflow. Tool names below omit the core MCP's `coinbase_` prefix; use the exact names and schemas returned by `tools/list`. `FUTURE` here means CFM dated futures, which require account approval. Discovery of a product does not establish that every endpoint supports it.

| Tool | SPOT | EQUITY | FUTURE |
| - | - | - | - |
| `products_list`, `products_get` | Use for discovery and reference prices | Use exact `TICKER-QUOTE` IDs; read `price` when present | Discover the current contract, not a hardcoded expired code |
| `products_ticker`, `products_best_bid_ask`, `products_book` | Standard market-data path | Do not rely on these for equity quotes; equity IDs can be rejected | Check data availability for the selected contract |
| `products_candles` | Historical candles | MCP has an equity-ID path, but data availability is not guaranteed; do not assume CLI parity | Check history availability for the selected contract |
| `orders_preview` | Estimate before an authorized trade | Not a reliable dependency; the API can reject equity previews | Estimate fees and margin/liquidation impact for an eligible account |
| `orders_create` | Subject to product/order limits | Subject to equity eligibility, session, sizing, and order-type rules below | Use contract `base_size`, not `quote_size`; default portfolio only |
| `orders_list`, `orders_get`, `orders_fills` | Read order state and fills | Check actual returned order state and backend availability | Check actual returned order state and backend availability |
| `orders_edit`, `orders_cancel` | Depends on current order state | Do not infer edit/cancel eligibility from create support; inspect each result | Depends on current order state and backend acceptance |

These are routing rules, not a promise that every listed product/account supports every operation. Do not repeatedly call a rejected equity data endpoint, substitute crypto data, or change product identifiers to bypass a restriction. If `price` is missing or insufficiently current, report that a usable equity quote is unavailable. Paid research is a separate, user-authorized option—not an automatic fallback.

### Equity sessions and order lifecycle

Use these rules for order planning, not as permission to trade:

* `NORMAL` is regular market hours and the only session supporting market orders. The core MCP defaults resolved equity orders to `NORMAL` when no session is supplied.
* `PRE_MARKET`, `AFTER_HOURS`, and `OVERNIGHT` target their named sessions; `MULTI_SESSION` spans multiple eligible sessions. These sessions accept whole-share limit orders, not market orders, fractional `base_size`, or `quote_size`. Verify the applicable session, trading calendar, and product eligibility rather than assuming weekdays or a fixed UTC window.
* `equity_order_date` is the trade date (`YYYY-MM-DD`), **not** the order's expiry or an agent scheduling instruction. `end_time` is an RFC 3339 timestamp with timezone for a `GTD` order.
* For extended-session planning, specify the intended session, trade date, whole-share `base_size`, limit price, `time_in_force=GTD`, and `end_time`. The ChatGPT trading flow validates this set. Check the selected surface's schema before submission: the core MCP's current `orders_preview` does not expose `time_in_force` or `end_time`, and equity session/date fields can be disabled for an account. Do not assume a preview validated an expiry it could not accept.
* Market or quote-sized equity orders can be rejected outside normal hours. **Do not assume they queue for the next open.** Report the rejection; ask before changing the session, order type, sizing, or execution time.
* An equity preview may fail with `API order preview is not available for equities products`. Report the missing estimate rather than retrying it or calling `orders_create` as a test. If the user required a preview before execution, stop. An explicitly authorized order without a preview still needs the applicable equity checks.
* A returned order ID is not a fill. Read `orders_get`/`orders_list` and fills to distinguish accepted/open, filled, canceled, or rejected states. Inspect per-order cancellation results; don't treat an HTTP success as proof of cancellation.

A weekly rebalance needs a separately authorized schedule and trading policy. Connection setup and a refresh token do not authorize recurring trades. Decide with the user what to do on a holiday, halt, closed session, missing quote, unavailable preview, or expired consent; don't silently submit a different order.

### Orders

| Command | What it does |
| - | - |
| `coinbase orders preview product_id=BTC-USD side=BUY type=market quote_size=100` | Dry-run: returns fill estimate, fees, slippage |
| `coinbase orders create product_id=BTC-USD side=BUY type=market quote_size=100` | Execute a market buy for \$100 of BTC |
| `coinbase orders create product_id=BTC-USD side=BUY type=limit base_size=0.001 limit_price=50000` | Limit buy 0.001 BTC at \$50,000 |
| `coinbase orders create ... client_order_id=<unique-id>` | Idempotent order. Retries with same ID return existing order instead of creating duplicate. **Always use for retry safety.** |
| `coinbase orders list` | All orders with status, fill %, fees |
| `coinbase orders get <order_id>` | Single order detail: fill status, average price, fees |
| `coinbase orders fills` | List all trade fills with price, size, commission, liquidity indicator |
| `coinbase orders edit <order_id>` | Modify an existing order |
| `coinbase orders cancel order_ids:='["<id1>","<id2>"]'` | Batch cancel orders |
| `coinbase orders close-position product_id=<id> size=<size>` | Close an open position |

### Portfolios & Balances

| Command | What it does |
| - | - |
| `coinbase balance` | All account balances (crypto + fiat) |
| `coinbase portfolios list` | All portfolios with UUID, name, type |
| `coinbase portfolios get <portfolio_id>` | Portfolio breakdown: balances, positions, allocation %, unrealized PnL |
| `coinbase portfolios create name=<name>` | Create a new portfolio |
| `coinbase portfolios edit <portfolio_id> name=<new-name>` | Rename a portfolio |
| `coinbase portfolios delete <portfolio_id>` | Delete a portfolio (must be empty) |
| `coinbase transfer amount=100 currency=USD from=<src_uuid> to=<dst_uuid>` | Move funds between portfolios |

### Conversions

| Command | What it does |
| - | - |
| `coinbase convert quote from=USDC to=USD amount=100` | Get conversion quote (rate + fee) |
| `coinbase convert execute <quote_id> from=USDC to=USD` | Execute a quoted conversion |
| `coinbase convert get <quote_id>` | Check conversion status |

### Info & Session

| Command | What it does |
| - | - |
| `coinbase fees` | Fee tier (maker/taker rates), 30-day volume |
| `coinbase env` | View/manage credentials across environments |

## Agent-Critical Flags

Use these flags on **any** command. They are the most important features for safe, efficient agent operation.

| Flag | What it does | When to use |
| - | - | - |
| `--template` | Print the expected JSON request body, don't send | **Before every first call to a command.** Discover exact field names instead of guessing. |
| `--dry-run` | Assemble the full request and print it, don't send | Before executing any write operation (orders, transfers) to verify what will be sent |
| `--jq <expr>` | Filter JSON response with a jq expression | Extract specific fields to save context: `--jq '.price'`, `--jq '.accounts[].currency'` |
| `-e <env>` | Override the active environment | Switch between `live`, `development`, `staging`, `production` |

### Field syntax

| Syntax | Meaning | Example |
| - | - | - |
| `key=value` | String body field | `product_id=BTC-USD` |
| `key:=value` | Raw JSON body field (arrays, numbers, booleans) | `order_ids:='["abc","def"]'` |
| `key==value` | Query parameter | `product_type==SPOT` |
| `@file.json` | Load body from JSON file | `@order.json` |

## Workflows

### 1. Check price and preview a trade

```bash theme={null}
# Get current BTC price
coinbase products get BTC-USD --jq '.price'

# Preview a $100 market buy (shows fees + estimated fill price)
coinbase orders preview product_id=BTC-USD side=BUY type=market quote_size=100

# If preview looks good, execute
coinbase orders create product_id=BTC-USD side=BUY type=market quote_size=100 client_order_id=$(uuidgen)

# Check order status
coinbase orders get <order_id>
```

### 2. Sell an asset

```bash theme={null}
# Check how much you hold
coinbase balance --jq '.accounts[] | select(.currency=="DOGE")'

# Preview the sell
coinbase orders preview product_id=DOGE-USD side=SELL type=market base_size=10

# Execute
coinbase orders create product_id=DOGE-USD side=SELL type=market base_size=10 client_order_id=$(uuidgen)
```

### 3. Transfer funds between portfolios

```bash theme={null}
# List portfolios to get UUIDs
coinbase portfolios list --jq '.portfolios[] | {name, uuid}'

# Transfer $100 USD from Default to agent portfolio
coinbase transfer amount=100 currency=USD from=<default_uuid> to=<agent_uuid>
```

### 4. Convert USDC to USD (or vice versa)

```bash theme={null}
# Get a quote
coinbase convert quote from=USD to=USDC amount=50

# Execute the conversion using the quote ID from the response
coinbase convert execute <quote_id> from=USD to=USDC
```

### 5. Discover field names for any command

```bash theme={null}
# Don't know what fields an order takes? Print the template:
coinbase orders create --template

# Then assemble and verify without sending:
coinbase orders create product_id=BTC-USD side=BUY type=market quote_size=10 --dry-run
```

### 6. Filter large result sets

```bash theme={null}
# Find all USD trading pairs
coinbase products list symbol==USD

# Top 10 USD products by 24h volume
coinbase products list symbol==USD --jq '[.products | sort_by(.volume_24h | tonumber) | reverse | .[:10] | .[].product_id]'
```

## Local MCP Server Setup

The CLI includes an MCP server that exposes every command as a typed tool. If using MCP, the tool schemas are your primary reference (they include full field descriptions and enums).

**Claude Code:**

```bash theme={null}
claude mcp add --scope user --transport stdio coinbase -- coinbase mcp
```

**Other agents:** add to your MCP config:

```json theme={null}
{ "command": "coinbase", "args": ["mcp"], "transport": "stdio" }
```

**Codex users:** Default sandbox can't access OS keychain. Either prompt Codex for "elevated access" or use the MCP server instead of direct CLI commands.

## Install agent skills

Install skills so the agent has step-by-step guidance for common Coinbase workflows (trading, market data, watch, convert, portfolios):

```bash theme={null}
coinbase skills add
```

If non-interactive, pass the skills directory explicitly:

```bash theme={null}
coinbase skills add --dir <skills-directory>
```

Skills auto-update on future `npm install -g @coinbase/coinbase-cli` upgrades.

## Gotchas

* **Products list returns hundreds of items.** Use `symbol==USD` to filter by currency, or `--jq` for custom filters.
* **`client_order_id` prevents duplicate orders.** If your connection drops mid-request, retrying with the same `client_order_id` returns the existing order instead of creating a new one. Always generate one per order attempt.
* **Futures orders need `base_size`, not `quote_size`.** CFM dated-futures market orders reject `quote_size` — use `base_size` (number of contracts). They're available only in your default portfolio, so configure the API key to include that portfolio; a key scoped only to an isolated agent portfolio cannot place futures orders. Preview the order first and read back `predicted_liquidation_price`.
* **Equities use `TICKER-QUOTE` product IDs**, such as `AAPL-USD` or `AAPL-USDC`. Discover eligible tickers rather than assuming a fixed index list. Read [product-type limitations](#product-type-support-and-limitations) and [equity session rules](#equity-sessions-and-order-lifecycle) before planning an equity order.
* **nvm/fnm users:** Upgrading Node versions requires reinstalling global packages. After upgrading, open a new terminal and run `npm i -g @coinbase/coinbase-cli` again.
* **USDC pairs:** When buying crypto with a USDC balance, use USDC pairs (e.g., `BTC-USDC` not `BTC-USD`). The agent may default to USD pairs otherwise.
* **x402 routing:** Explicitly tell the agent "use x402 fetch to..." or "you have authorization to pay for this data" so it routes to the correct tool.

## Feedback

Send Coinbase a short note when something in this integration gets in the way: a tool error you could not resolve, a missing capability, a confusing schema or error message, or a workflow the user wanted that is not supported. On remote MCP, call `coinbase_feedback_submit` with the schema from `tools/list`. On the local CLI, run `coinbase feedback note="..." tool_name=<tool>`, for example `coinbase feedback note="..." tool_name=coinbase_orders_preview`. Submit feedback when the user asks to, and tell the user when you submit it on your own.

* Keep each note to 2,000 characters or less. Describe what you were trying to do, which tool you called, what happened, and what would have helped.
* Do not include credentials, tokens, API keys, account or portfolio IDs, order IDs, wallet addresses, names, emails, or other personal data. Submissions are screened.
* Submissions are limited to 6 per user per day. If you hit the limit, stop; do not rephrase and resend.
* Feedback is one-way. It does not open a support case or return a reply. For account or funds problems, see [Support](#support); for integration help, use [CDP Discord](https://discord.com/invite/cdp).

## Support

For a problem with the user's Coinbase account that [Troubleshooting](#troubleshooting) does not resolve, such as a locked or restricted account, missing funds, or a trade or payment question, fetch the [support guide](https://docs.cdp.coinbase.com/ai-agents/overview/support) and follow it. It covers what you can answer yourself, how to contact Coinbase Support as an agent, and when the account holder must act.

## Troubleshooting

| Error | Cause | Fix |
| - | - | - |
| `HTTP 401` | Expired or invalid credentials | Remote MCP: reconnect through Coinbase OAuth. CLI: check the configured CDP API key. |
| `HTTP 403 Missing required scopes` | OAuth grant or API key lacks permission | Remote MCP: reconnect and approve the required scopes. CLI: check permissions in the CDP portal. |
| `insufficient fund` (on preview or order) | Account balance too low | Run `coinbase balance` to check available funds |
| `PERMISSION_DENIED` on portfolio ops | OAuth grant or API key does not cover that portfolio | Remote MCP: reconnect and select the intended portfolio. CLI: use a key scoped to that portfolio. |
| `PERMISSION_DENIED` on an order | Order omitted the portfolio and fell back to your **default** portfolio, which isn't in the key/grant scope | Specify the intended portfolio on the order (or tell the agent which portfolio to trade from) instead of relying on the default |
| `coinbase: command not found` | CLI not in PATH | Ensure npm global bin is in PATH; reinstall if upgraded Node |
| `MISSING_FIELDS` | Required fields not provided | Run `coinbase <command> --template` to see expected fields |
| `INVALID_VALUE` | Enum field has wrong value | Check the error message for accepted values |
| `INVALID_FORMAT` | Date/time format wrong | Orders use RFC 3339 with timezone (e.g. 2024-01-01T00:00:00Z) |
| Windows: `coinbase` not found | npm global bin not in PATH | Add `%APPDATA%\npm` to PATH |
| x402: `payment attempt failed` | Payment failed or its outcome is unknown | Read the error; check balance and preserve the original `idempotency_key` before any retry. Do not assume a timeout means no hold was placed. |
| x402: `resource rejected the paid request` | Payment authorization succeeded but the provider did not return the resource | Report both outcomes. Follow recovery instructions using the original key; do not create another payment to retry blindly. |
| x402: payment exceeds limit | Request exceeds the caller, catalog, account, or server limit | Stop and report the limit. Do not split requests to bypass a spending control. |
| Persistent or unexplained tool error | Integration bug, missing capability, or unclear schema | Report the error to the user, then send a short note with `coinbase_feedback_submit` (see [Feedback](#feedback)). Do not keep retrying. |

## Remote MCP integration reference

This section describes the OAuth and MCP protocol handled by the harness. It is a reference, not another setup path: connect through a supported harness's remote MCP flow or use the local CLI. Let the harness perform registration, authorization, token management, and transport; do not implement a replacement client during onboarding.

### OAuth endpoints and discovery

Let the harness discover the OAuth endpoints and manage registration, sign-in, and credentials. The endpoints below are for reference; do not manually register clients, construct authorization URLs, or exchange tokens during setup.

| Purpose | URL |
| - | - |
| MCP server and OAuth resource identifier | `https://agents.coinbase.com/mcp` |
| Protected-resource metadata | `https://agents.coinbase.com/.well-known/oauth-protected-resource` |
| Authorization-server metadata | `https://login.coinbase.com/.well-known/oauth-authorization-server` |
| Authorization | `https://login.coinbase.com/oauth2/auth` |
| Token exchange and refresh | `https://login.coinbase.com/oauth2/token` |
| Dynamic client registration | `https://login.coinbase.com/oauth2/register` |
| Token revocation | `https://login.coinbase.com/oauth2/revoke` |

The issuer is `https://login.coinbase.com/`. Public clients using `token_endpoint_auth_method: "none"` and PKCE are supported. Use the authorization-code flow with `code_challenge_method=S256`, not an implicit flow or an embedded client secret. Coinbase-side DCR allowlisting still applies.

### Register and authorize

The harness performs these steps internally; they are not manual onboarding steps for the agent or user.

1. **Reuse the approved client registration.** If the harness needs DCR, POST its real client metadata as JSON to the registration endpoint. Include its `client_name`, exact `redirect_uris`, `response_types: ["code"]`, `grant_types: ["authorization_code", "refresh_token"]`, and `token_endpoint_auth_method: "none"` for a public client. Use only a callback the harness controls. Save the returned `client_id` securely rather than registering again each run. Do not put `resource` in the DCR JSON; it belongs on authorization and token requests.
2. **Request consent.** Generate a fresh cryptographically random `state` and PKCE verifier; derive the S256 challenge. Open the authorization endpoint in the user's browser with the fields below. The user signs in on Coinbase and chooses the permissions/portfolios to approve.
3. **Exchange the code.** At the registered callback, verify `state` before accepting the code. POST a form-encoded token request using `grant_type=authorization_code`, `client_id`, the same `redirect_uri`, `code`, `code_verifier`, and `resource=https://agents.coinbase.com/mcp`. Public clients registered with `none` do not send a client secret.
4. **Store and refresh securely.** Keep tokens in the harness's credential store, never in model-visible logs, prompts, source files, or chat. Use the returned `expires_in`; request `offline_access` if continued access needs a refresh token. Refresh at the token endpoint with `grant_type=refresh_token`, `client_id`, `refresh_token`, and the same resource identifier. Atomically save replacement tokens and serialize refresh attempts; do not keep reusing a rotated refresh token. Reconnect if consent is revoked or refresh fails permanently.

Authorization request fields (URL-encode each value):

```text theme={null}
response_type=code
client_id=<registered client ID>
redirect_uri=<exact registered callback>
state=<fresh random state>
code_challenge=<base64url SHA-256 of PKCE verifier>
code_challenge_method=S256
resource=https://agents.coinbase.com/mcp
```

**Always send `resource` on authorization and token requests.** The [MCP authorization specification](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization#resource-parameter-implementation) requires it. A flow that happens to succeed without it is not a supported compatibility guarantee; do not implement omission as the default.

### Scope reference

The protected-resource metadata advertises these scopes.

| Capability | Scopes |
| - | - |
| Read portfolios and account balances | `mcp:portfolios:read`, `mcp:accounts:read` |
| Read products, orders, and trades | `mcp:products:read`, `mcp:orders:read`, `mcp:trades:read` |
| Change portfolios | `mcp:portfolios:update` |
| Create or cancel orders | `mcp:orders:create`, `mcp:orders:delete` |
| Create trades or transfers | `mcp:trades:create`, `mcp:transfers:create` |

Add `offline_access` to request a refresh token; it is advertised by the authorization server, not the MCP resource's `mcp:*` list. Do not use the literal wildcard `mcp:*`.

### Verify the connection

The harness uses Streamable HTTP transport. The following messages illustrate the protocol it handles, not requests for the agent to send manually. Each message is sent in order as its own POST to `https://agents.coinbase.com/mcp`, using:

```http theme={null}
Authorization: Bearer <access_token>
Content-Type: application/json
Accept: application/json, text/event-stream
```

First initialize with a protocol version the client supports (this example uses `2025-06-18`):

```json theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {},
    "clientInfo": { "name": "your-harness", "version": "1.0.0" }
  }
}
```

Validate the negotiated `protocolVersion` from the result. Include it as the `MCP-Protocol-Version` header on subsequent requests. If a server returns `Mcp-Session-Id`, retain and send it too; don't require or invent a session ID when none is returned. Then send the initialized notification (no JSON-RPC `id`):

```json theme={null}
{ "jsonrpc": "2.0", "method": "notifications/initialized" }
```

List tools and follow any `nextCursor` with `params.cursor`:

```json theme={null}
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {} }
```

Use the exact tool name and input schema returned by `tools/list`. The core MCP portfolio-list tool is `coinbase_portfolios_list`; after confirming it is exposed, make this call:

```json theme={null}
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": { "name": "coinbase_portfolios_list", "arguments": {} }
}
```

Success means initialization and tool discovery succeeded **and** the portfolio call returned a valid result with no JSON-RPC error or tool `isError`. An empty portfolio list can still be a successful connection. HTTP 200 alone is not enough. Tell the user which connection was verified without dumping account details.

### Rate limits and connection failures

This guide does not specify a numeric remote-MCP request quota. Do not assume an Advanced Trade REST or WebSocket limit is the MCP limit. Cache product metadata, avoid tight polling, bound retries, and stagger recurring reads. `--watch` belongs to the local CLI's WebSocket path; it is not a remote-MCP subscription.

* **HTTP 429 or a rate-limit tool error:** honor `Retry-After` when present; otherwise use bounded exponential backoff with jitter. Reduce concurrency instead of retrying continuously.
* **HTTP 401:** let the harness refresh the connection or ask the user to reconnect through its Coinbase OAuth flow. Do not handle tokens or register a new OAuth client yourself.
* **Missing scopes:** ask the user to reconnect and approve the required permissions. A working `tools/list` does not prove every tool call is authorized.
* **Registration or authorization denied:** if the harness is not listed under [Setup](#setup), follow the CLI-or-unsupported guidance there. For a supported harness, report the error and request help through [CDP Discord](https://discord.com/invite/cdp). Do not switch to manual registration or bypass access restrictions.
* **Unsupported product/session or unavailable tool:** use the product guidance and current schema; don't change the product, session, or order type without authorization.
* **Unknown write outcome:** inspect order/payment state and preserve the original idempotency key before considering a retry. Connection setup never requires a write.
