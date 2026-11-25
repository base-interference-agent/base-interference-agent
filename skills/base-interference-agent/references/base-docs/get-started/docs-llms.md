> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Static Docs Files

> Use llms.txt and llms-full.txt to give AI assistants access to Base documentation.

## Documentation Index

Fetch the complete documentation index at: [https://docs.base.org/llms.txt](https://docs.base.org/llms.txt)

Use this file to discover all available pages before exploring further.

## Full Documentation File

If your AI tool doesn't support MCP yet, you can use a static documentation file instead. This gives your AI assistant the entire Base documentation as one text file.

> [!WARNING]
>
> The static `llms-full.txt` file is a snapshot and may not include the latest updates. Use [MCP](https://docs.base.org/get-started/docs-mcp.md) when possible for always-current docs.

### Setup with Cursor

[Cursor](https://cursor.com/) is an AI-powered code editor built as a fork of VS Code with features like AI code completion and natural language editing.

**1. Open Docs Settings**

Go to **Settings** > **Features** > **Docs**.

**2. Add Base Docs**

Click **Add new doc** and paste: `https://docs.base.org/llms-full.txt`

**3. Reference in Chat**

Use `@docs -> Base` in your AI chat to reference the documentation.

### Setup with Claude Code

[Claude Code](https://docs.claude.com/en/docs/claude-code/overview) is an agentic coding tool that lives in your terminal and understands your codebase.

**1. Download the Docs File**

Download the static documentation file from: [https://docs.base.org/llms-full.txt](https://docs.base.org/llms-full.txt)

**2. Add to Your Project**

Save the file in your project directory or a known location on your system.

**3. Reference in Chat**

Use the `/read` command or drag and drop the file path to include the documentation in your conversation. Claude Code will then have access to the full Base documentation for that session.
