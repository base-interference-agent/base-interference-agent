> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# debug_traceBlockByNumber

> Returns EVM execution traces for all transactions in a block by block number.

Returns the EVM execution traces for all transactions in a block identified by its number.

> [!WARNING]
>
> Debug methods replay all transactions in the block and are computationally expensive. Availability varies among providers in the [Builder Stack](https://docs.base.org/get-started/builder-stack.md).

## Parameters

**block** `string` *required*

Block number in hex, or `"latest"`, `"earliest"`, `"safe"`, `"finalized"`.

**tracerConfig** `object`

Optional tracer configuration. See [`debug_traceTransaction`](https://docs.base.org/base-chain/api-reference/debug-api/debug_traceTransaction) for options.

## Returns

**result** `array`

Array of trace objects, one per transaction in the block.

## Example

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "method": "debug_traceBlockByNumber",
  "params": ["latest", {"tracer": "callTracer"}],
  "id": 1
}
```

```json Response lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "result": {
        "type": "CALL",
        "gasUsed": "0xab3f"
      }
    }
  ]
}
```
