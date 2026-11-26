# blog/the-agentic-economy-is-here

Source: https://www.base.org/blog/the-agentic-economy-is-here.md

# The Agentic Economy Is Here

> TL;DR Agents are becoming the internet’s newest paying customers, and the economy serving them is moving fast. On Base, agents already use wallets and stablecoins to pay for…

- Date: 2026-05-29
- Author: Base
- URL: https://www.base.org/blog/the-agentic-economy-is-here

## Agents Are Paying Customers Now

AI agents are already useful. They can search, write, code, analyze, plan, and take action across apps. But they have been missing something every internet customer needs; a way to pay.

In early 2025, the first onchain wave of agent adoption was primarily for social actions. They posted, replied, created media, traded attention, built communities, launched projects, and tested financial rails for the first time. And this wasn’t just a few rogue agents. Between October 2024 and February 2025, nearly 16K agents launched on Base through [Virtuals](https://www.virtuals.io/), an AI agent platform that lets anyone spin up an agent and its own token. ([Coinbase](https://www.coinbase.com/institutional/research-insights/research/market-intelligence/advancing-agentic-ai))

Since then, agents have evolved to include more complex workflows. Models got better at using tools, planning, and maintaining context. And the ecosystem of agent financial infrastructure improved in parallel. Wallets got easier to embed. Stablecoin adoption surged and transaction fees dropped to sub-cent, enabling microtransactions critical to emerging agent economies. In May 2025, [x402](https://www.x402.org/) launched enabling payments to become part of a normal internet request. And critically, builders shipped agent-accessible services worth paying for.

That meant agents could start doing more complete work for people and businesses, without a human needing to subscribe to every tool, approve every checkout, or manually connect every service.

Most of this early activity is already running on Base. Over the last 30 days (as of May 29th, 2026) on x402, there have been [3.1M](https://classic.artemis.ai/asset/x402) transactions and [$1.2M](https://classic.artemis.ai/asset/x402) in value transferred on Base. The number of sellers grew [23%](https://classic.artemis.ai/asset/x402?utm_source=chatgpt.com), and the number of buyers grew [37%](https://classic.artemis.ai/asset/x402?utm_source=chatgpt.com).

Agents are no longer simply using the internet, they are becoming paying customers.

This means businesses need to evolve to capture this new customer segment and users can start using agents for more sophisticated flows. And this evolution is already happening on Base: we’re seeing both sellers and buyers experiment with a host of emerging use cases within the agentic economy.

## The Services Agents Pay For

Agents pay because useful work depends on outside services to finish complex tasks.

A research agent needs sources. A travel agent needs prices, availability, reviews, flight status, and booking paths. A finance agent needs market data, risk signals, and execution tools. A hiring agent needs job listings, compensation data, company context, and public market inputs.\
\
Agents buy these inputs for the same reason teams buy software. They pay for accuracy, speed, context, and execution. But unlike enterprise teams, agents have the luxury of paying in microtransactions for single pieces of data or single search queries, instead of expensive bulk subscriptions. They pay for specialization.

Across Base we’re seeing this specialization rapidly expand the ecosystem and grow the stack for agentic commerce.

**Intelligence** is becoming a top service agents pay for during work. [Venice](https://docs.venice.ai/guides/integrations/x402-venice-api) lets wallets authenticate and pay for inference on Base across chat, image, audio, video, embeddings, and other routes. [BlockRun](https://blockrun.ai/) ([Base Batches](https://x.com/base/status/2059697397345702113?s=20)) routes agents across 50+ AI models with pay per-call USDC settlement on Base via x402. [Dolphin AI](https://x.com/dphnai) is working on model development and distributed inference. [Bankr’s x402 Cloud](https://docs.bankr.bot/x402-cloud/overview/) helps builders turn endpoints into paid services, with USDC settlement on Base and payments sent to the builder’s wallet.

**Execution** is becoming purchasable too. [Browserbase](https://docs.browserbase.com/integrations/x402/introduction) lets agents pay with USDC on Base for cloud browser sessions. Those sessions give an agent a browser to navigate websites, gather context, run workflows, and return results.

**Research** is a breakout use case for agents. [Exa](https://exa.ai/) provides web search and content data. [Wolfram Alpha](https://www.wolframalpha.com/) provides computation. Some services are bundling this too; [agentic.market](http://agentic.market)’s [talent market workflow](https://agentic.market/bundles/talent-market-scanner) combines job search, Exa neural search, Parallel search, content extraction, and stock quote data to study hiring trends, salary ranges, hot skills, and company context for a few cents per run.

**Travel** is a familiar but challenging example. [Tripadvisor](https://agentic.market/services/tripadvisor-content-api-readme-io) now provides reviews, photos and localized search for agents helping travelers on the go, [FlightAware](https://agentic.market/services/www-flightaware-com) provides real-time flight information, and [Amadeus](https://agentic.market/services/developers-amadeus-com) provides booking for hotels and flights.

And lastly, **agent enablement** is reaching major developer platforms. [Cloudflare](https://developers.cloudflare.com/agents/agentic-payments/x402/) supports x402 and is a member of the x402 foundation. [Amazon Bedrock AgentCore Payments](https://www.coinbase.com/blog/introducing-amazon-bedrock-agentcore-payments-powered-by-x402-and-coinbase) brings x402 and Coinbase wallet infrastructure into enterprise agent workflows, with micropayment flows for web content, APIs, MCP servers, and other agents. This is strong signal from leaders in tech that the agentic future is here and worth paying attention to.

## What Comes Next: Earning Agents

Today, the most visible agent activity is spending. The next evolution is agents earning.

A wallet lets an agent receive funds as easily as it spends them. An earning agent could sell research, run a paid service, accept payments, hire other agents, and pay operating costs. Some agents will also interact with market and lending protocols through defined permissions. The agents become the specialization which other agents pay for.

Early examples already exist. [Felix](https://trustmrr.com/founder/felixcraftai), an agent running its own businesses, has reported more than $261,395 in revenue from agent-run products. [Kelly Claude](https://x.com/KellyClaudeAI), another agent running its own businesses, has product revenue across a paid app-building service, books, and app sales. [Factory Floor](https://factoryfloor.dev/) tracks agents with live products, in-review apps, and revenue sources across Stripe, Gumroad, and App Store.

This is exciting yet unsurprising. If agents can spend to complete work, they can also earn by selling work. The same wallets and payment rails that make agents internet customers can make them internet businesses. Base is giving builders the sandbox to make this happen fast.

## Making Base Accessible to Agents

Strong economies have low friction, and the agent economy still has friction. Agents need low-cost transactions and need native access to the full economy of products & services.

They need wallets for sending and receiving funds. They need stablecoins for quick settlement. They need services with machine-readable prices. They need x402-enabled APIs, spend limits, receipts, permissions, audit trails, identity, and reputation. They need protocols they interact with directly.

Our work is to make the existing Base economy more accessible to agents. To that end, we [released Base MCP](https://x.com/base/status/2059305572793508045) which lets agents engage with the Base ecosystem and help you trade, swap, lend and more onchain seamlessly.

We’re also working with leading providers to get wallets natively embedded in agent infrastructure to make building and configuring agents with financial access easier than ever. And we’re working with ecosystem teams to make their apps, APIs, and protocols easier for agents to find, evaluate, pay for, and use.

The agentic economy is already running on Base. To get started, visit [base.org/agents](http://base.org/agents) or view our [developer docs](https://docs.base.org/get-started/resources-for-ai-agents?utm_source=base_dot_org).

![](https://www.base.org/images/blog/the-agentic-economy-is-here/01.webp)
