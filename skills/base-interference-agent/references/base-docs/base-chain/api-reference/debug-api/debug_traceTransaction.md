> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# debug_traceTransaction

> Returns the full EVM execution trace for a transaction. Requires a node with debug APIs enabled.

Replays a transaction and returns its complete EVM execution trace, including every opcode executed, gas consumed at each step, stack contents, and storage changes.

> [!WARNING]
>
> Debug methods replay transactions and are computationally expensive. Availability and rate limits vary among providers in the [Builder Stack](https://docs.base.org/get-started/builder-stack.md). Avoid calling these in hot paths.

## Parameters

**transactionHash** `string` *required*

The 32-byte transaction hash to trace.

**traceOptions** `object`

Optional tracing configuration.

**Trace Options**

**tracer** `string`

Built-in tracer name. `"callTracer"` returns a call tree. `"prestateTracer"` returns the pre-execution account state. Omit to use the default struct log tracer.

**tracerConfig** `object`

Options for the selected tracer. For `"callTracer"`: `{ "onlyTopCall": true }` skips internal calls.

**disableStorage** `boolean`

If `true`, omits storage capture from struct logs. Reduces response size. Defaults to `false`.

**disableMemory** `boolean`

If `true`, omits memory capture from struct logs. Reduces response size. Defaults to `false`.

**disableStack** `boolean`

If `true`, omits stack capture from struct logs. Defaults to `false`.

**timeout** `string`

Execution timeout as a Go duration string (e.g., `"10s"`, `"30s"`). Defaults to `"5s"`.

## Returns

**result** `object`

The execution trace. Format depends on the `tracer` option.

**Default Struct Log Trace**

**gas** `number`

Total gas provided for the transaction.

**failed** `boolean`

Whether the transaction failed (reverted).

**returnValue** `string`

Hex-encoded return value from the execution.

**structLogs** `array`

Array of struct log entries, one per EVM opcode executed.

**Struct Log Fields**

**pc** `number`

Program counter position.

**op** `string`

EVM opcode name (e.g., `"PUSH1"`, `"SLOAD"`).

**gas** `number`

Remaining gas at this step.

**gasCost** `number`

Gas cost of this opcode.

**depth** `number`

Call depth (1 = top-level call).

**stack** `array`

EVM stack values at this step.

**memory** `array`

EVM memory contents as 32-byte chunks.

**storage** `object`

Contract storage changes at this step (slot → value).

**callTracer Result**

**type** `string`

Call type: `"CALL"`, `"STATICCALL"`, `"DELEGATECALL"`, or `"CREATE"`.

**from** `string`

Sender address.

**to** `string`

Recipient address.

**value** `string`

ETH value sent with the call.

**gas** `string`

Gas provided for the call.

**gasUsed** `string`

Gas actually consumed.

**input** `string`

Call data sent.

**output** `string`

Return data from the call.

**error** `string`

Error message if the call reverted. Optional.

**calls** `array`

Array of nested call objects for internal calls.

## Example

```json Request (default struct log) lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "method": "debug_traceTransaction",
  "params": [
    "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
    {}
  ],
  "id": 1
}
```

```json Request (callTracer) lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "method": "debug_traceTransaction",
  "params": [
    "0xb903239f8543d04b5dc1ba6579132b143087c68db1b2168786408fcbce568238",
    { "tracer": "callTracer" }
  ],
  "id": 1
}
```

```json Response (default) lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "gas": 21000,
    "failed": false,
    "returnValue": "",
    "structLogs": [
      {
        "pc": 0,
        "op": "PUSH1",
        "gas": 21000,
        "gasCost": 3,
        "depth": 1,
        "stack": [],
        "memory": [],
        "storage": {}
      }
    ]
  }
}
```

```json Response (callTracer) lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "type": "CALL",
    "from": "0xd3cda913deb6f4967b2ef66ae97de114a83bcc01",
    "to": "0x4200000000000000000000000000000000000006",
    "value": "0x2c68af0bb14000",
    "gas": "0x5208",
    "gasUsed": "0x5208",
    "input": "0x",
    "output": "0x",
    "calls": []
  }
}
```
