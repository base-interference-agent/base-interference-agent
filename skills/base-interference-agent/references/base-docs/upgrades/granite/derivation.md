> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Granite L2 Chain Derivation Changes

> Derivation changes in the Granite upgrade, updating the CHANNEL_TIMEOUT protocol parameter.

## Protocol Parameter Changes

The following table gives an overview of the changes in parameters.

| Parameter | Pre-Granite (default) value | Granite value | Notes |
| - | - | - | - |
| `CHANNEL_TIMEOUT` | 300 | 50 | Protocol Constant is reduced. |

## Reduce Channel Timeout

With Granite, the `CHANNEL_TIMEOUT` is reduced from 300 to 50 L1 Blocks.
The new rule activation timestamp is based on the blocktime of the L1 block that the channel frame is included.
