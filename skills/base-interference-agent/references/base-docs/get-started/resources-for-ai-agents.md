> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Resources for AI Agents

> Base-first resources for AI agents, including docs indexes, MCP access, skills, and recommended starting points

> [!NOTE]
>
> Fetch the complete documentation index at [https://docs.base.org/llms.txt](https://docs.base.org/llms.txt).
> Use this file to discover all available pages before exploring further.

Use this page as the starting point when you want an AI assistant to build on Base. It covers three ways to give an assistant Base context: static docs files, a live MCP connection, and installable skills. You'll also find recommended entry points for common workflows.

## Quick Setup

Get your agent connected to Base docs in one command. Pick the method that fits your tool.

### MCP Server

A live connection lets your assistant search and read Base docs on demand, so it always has current information.

```sh Claude Code theme={null}
claude mcp add --transport http base-docs https://docs.base.org/mcp
```

```sh Codex CLI theme={null}
codex mcp add base-docs --url https://docs.base.org/mcp
```

```json Cursor / manual config theme={null}
{
  "mcpServers": {
    "base-docs": {
      "url": "https://docs.base.org/mcp"
    }
  }
}
```

See the [full MCP setup guide](https://docs.base.org/get-started/docs-mcp.md) for Cursor, Windsurf, and other editors.

### Static Docs Files

Use these when you want to load context in a single fetch rather than maintaining a live connection.

| File | What it contains | When to use it |
| - | - | - |
| [`llms.txt`](https://docs.base.org/llms.txt) | Page index with titles and descriptions | Discovering which docs exist before going deeper |
| [`llms-full.txt`](https://docs.base.org/llms-full.txt) | Complete documentation in one file | Giving an assistant broad context in one shot |

Every docs page is also available as plain Markdown. Append `.md` to any URL:

```txt Markdown URL theme={null}
https://docs.base.org/get-started/resources-for-ai-agents.md
```

### Skills

Skills are installable agent workflows for common Base tasks, including connecting to Base, deploying contracts, running a node, and more. They give your assistant step-by-step procedural guidance instead of requiring it to piece together docs on its own.

```sh Terminal theme={null}
npx skills add base/skills
```

To install a single skill, add `--skill <id>`, for example `npx skills add base/skills --skill build-on-base`.

Browse available skills in the [Base skills repository](https://github.com/base/skills).

## Recommended Starting Points

Once your agent has docs context, point it at the section that matches what you're building:

| What you're doing | Start here |
| - | - |
| Connecting an assistant to live docs | [MCP server](https://docs.base.org/get-started/docs-mcp.md) |
| Loading docs as static files | [Static docs files](https://docs.base.org/get-started/docs-llms.md) |
| Adding payments or onchain transactions | [Make x402 payments](https://docs.base.org/build-on-base/accept-payments/call-a-paid-service.md) |
| Deploying contracts | [Deploy on Base](https://docs.base.org/get-started/make-a-transaction.md) |
| Building an app on Base | [Build a Base app](https://docs.base.org/build-on-base/overview.md) |

## Example Prompts

Copy these into your assistant to test that everything is working:

* "Deploy my ERC-20 contract to Base Sepolia and verify it on Basescan."
* "Add Sign in with Base to my Next.js app using wagmi."
* "Set up a wallet for my AI agent that can hold USDC and sign transactions autonomously."
* "Create an app with a USDC payment flow."
* "Build an agent that pays for API requests using the x402 protocol."
