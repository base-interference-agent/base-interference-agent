# blog/base-mcp

Source: https://www.base.org/blog/base-mcp.md

# Introducing Base MCP: Your agent’s gateway to Base

> TL;DR Base MCP is live. Connect your Base Account to your agent and use simple prompts to swap, transfer, track your portfolio, and tap into the Base Ecosystem from chat…

- Date: 2026-05-26
- Author: Base
- URL: https://www.base.org/blog/base-mcp

***

\
Base MCP connects your Base Account (the account you use in Base App)  to your favorite AI interface, giving your agent a secure way to help you take action onchain. With Base MCP, you can ask your agent to transfer funds, swap tokens, check balances, review transaction history, and use supported apps and protocols across the ecosystem, all from the same chat interface.

What makes Base MCP special is the ecosystem behind it. The breadth and quality of apps already live on Base means your agent can do more than move funds around, it can plug into the growing economy. From day one,  MCP has skill plugins for Morpho, Bankr, Moonwell, Avantis, Aerodrome, Virtuals, and Uniswap, covering lending, swaps, perps, and the newest token and agent launches on Base. (_More on each below.)_\
\
Across all of it, you stay in control. Your agent proposes the action in chat, and your Base Account opens in a new window where you confirm or cancel the transaction.

![](https://www.base.org/images/blog/base-mcp/01.webp)

**How to Use It**

You can install  the Base MCP to any AI client or agent environment that supports MCP,  including Claude Web/Desktop/Code, ChatGPT, Codex, and Cursor. \
\
Once installed, you will be prompted to authenticate with your Base Account (if you already have a Base App account, you can use the same login credentials). After you sign in and grant permission, your agent can propose actions for you to review and approve.

Once your Base Account is connected, you can ask the agent to:

- Track portfolio balances across Base and any Base Account supported EVM chain
- View transaction history
- Send funds
- Swap tokens
- Use supported apps and protocols on Base through skill plugins
- Pay for x402 enabled services

When your agent wants to make a transaction, it sends you a link. Clicking that link opens your Base Account in a new window, shows any asset changes in the transaction,  and lets you confirm or cancel before any crypto moves.

**Agent, meet Ecosystem Skill Plugins**

Base MCP also lets agents interact with apps and protocols across the Base ecosystem through skill plugins. These skills expand what agents can do beyond basic wallet actions, making it possible to use onchain apps directly from chat.

At launch, Base MCP includes skill plugins for:

- Moonwell: explore lending markets, supply assets, and borrow against collateral.
- Morpho: find lending opportunities, supply assets to vaults, and borrow through curated markets.
- Uniswap: explore liquidity pools, review pool positions, manage liquidity, and execute swaps on Base.
- Avantis: explore onchain perps markets and manage trading positions.
- Bankr: discover recent token launches, and take token actions through chat.
- Aerodrome: explore liquidity pools, review LP opportunities, execute swaps, and manage liquidity positions on Base.
- Virtuals: discover recent agent launches, sort agent tokens by market data, and take token actions through chat.

\

If you want to build your own skill plugin, you can write a short markdown spec that teaches the assistant how to call your protocol's API (or MCP server) to get back the unsigned transaction details, then hand them off to Base MCP  so the user can approve everything in one click.  Find the guide here: [https://docs.base.org/ai-agents/plugins/custom-plugins?utm_source=base_dot_org](https://docs.base.org/ai-agents/plugins/custom-plugins?utm_source=base_dot_org)

**Security and User Control**

Base MCP is designed so that nothing happens onchain without your explicit approval.

The MCP server never holds or accesses your private keys. When the agent requests a transaction, it constructs the call and stores it as a pending request, which is later retrieved by your Base Account for you to review and sign. It basically packages up requests and holds them until you're ready to approve and sign. So nothing moves without you.

Every transaction the agent proposes goes through the same review flow you'd see for any Base Account request. You see the expected asset changes simulated before you confirm. If something looks wrong, simply reject it.

Because your agent builds transactions locally — rather than pulling them from a website that could be faked or taken over —the MCP can help mitigate common attack vectors of web-based crypto apps like domain hijacking and phishing and we are excited to invest more in this domain.

**How it Works Under the Hood**

The Base MCP combines a variety of pre-existing Base Account primitives while introducing some exciting new features.

Authentication into the Base MCP is built on OAuth 2.1 – the same authentication standard that ubiquitous products like Sign in with Google are built on. The Base Account is already accessible on the web so upgrading it to support this standard was a natural extension of its capabilities.\
\
Starting with MCP clients, apps can connect to Base Account using OAuth, receive an access token, authenticate users, access Base Account services and information, and generate transaction or message signature links.

The wallet request link feature is built on a Base Account primitive called stored requests. Until now, stored requests were only used in Shopify Base Pay checkout flows. With Base MCP, when the agent requests a transaction, the wallet JSON RPC request is stored and a request ID is issued. The MCP server then uses that request ID to construct a link for the user to approve the request.

When the user follows the link, the request is fetched by its ID, ingested by the Base Account request queue, and presented to the user just like any other Base Account wallet JSON RPC request. Once the request is approved, its status and associated data is updated so that an agent that is polling for updates can continue executing as soon as the request has been confirmed.

**What’s next**\
\
We will keep improving Base MCP with more skill plugins, better prompt flows, and deeper support for the ways people use Base from their favorite AI interfaces.\
\
To get started, visit [https://docs.base.org/ai-agents/quickstart?utm_source=base_dot_org](https://docs.base.org/ai-agents/quickstart?utm_source=base_dot_org) and explore a few sample prompts.

We are excited to see what this unlocks for the Base community.

![](https://www.base.org/images/blog/base-mcp/02.webp)
