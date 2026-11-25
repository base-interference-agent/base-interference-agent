> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# MCP Server

> Connect your AI coding assistant to Base documentation using Model Context Protocol for real-time access.

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open standard that lets AI assistants securely access external data sources. The Base MCP server connects your AI coding assistant directly to our documentation, giving it live access to search and retrieve the exact information you need in real time.

## Setup with Cursor

[Cursor](https://cursor.com/) is an AI-powered code editor built as a fork of VS Code with features like AI code completion and natural language editing.

**1. Open MCP Settings**

In Cursor, open **Settings** and navigate to **Tools & MCP**, then click **Add MCP Server**.

**2. Add Base Docs Server**

In the `mcp.json` configuration file, add:

```json mcp.json theme={null}
{
  "mcpServers": {
    "base-docs": {
      "url": "https://docs.base.org/mcp"
    }
  }
}
```

**3. Save and Restart**

Save the file and restart Cursor to apply the changes.

**4. Start Building**

Your AI assistant can now access Base docs in real time. Try asking: "How do I deploy a smart contract on Base?"

## Setup with Claude Code

[Claude Code](https://docs.claude.com/en/docs/claude-code/overview) is an agentic coding tool that lives in your terminal and understands your codebase.

**1. Add the Base Docs MCP Server**

Run the following command in your terminal:

```bash Terminal theme={null}
claude mcp add --transport http base-docs https://docs.base.org/mcp
```

**2. Verify Installation**

Check that the server was added successfully:

```bash Terminal theme={null}
claude mcp list
```

**3. Start Building**

Launch Claude Code and start asking questions. Try: "How do I deploy a smart contract on Base?"
