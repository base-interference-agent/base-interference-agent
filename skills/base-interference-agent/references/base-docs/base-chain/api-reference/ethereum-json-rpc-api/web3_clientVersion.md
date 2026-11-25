> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# web3_clientVersion

> Returns the current client version string.

Returns the version string of the node client software.

> [!NOTE]
>
> This method is not available on all public endpoints. It returns `-32601 Method not found` on the Sepolia public node (`sepolia.base.org`) but works on mainnet.

## Parameters

No parameters.

## Returns

**result** `string`

The client version string. Format: `<client>/<version>-<commit>/<platform>/base/<base-version>`. Do not rely on parsing this string as it changes with node software updates.

## Example

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "method": "web3_clientVersion",
  "params": [],
  "id": 1
}
```

```json Response theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "reth/v1.11.3-2ac58a2/x86_64-unknown-linux-gnu/base/v0.9.0"
}
```
