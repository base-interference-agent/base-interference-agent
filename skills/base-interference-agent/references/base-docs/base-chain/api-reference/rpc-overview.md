> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Base RPC Overview

> Complete reference for all JSON-RPC methods available on Base nodes.

Base exposes a single, fully EVM-compatible JSON-RPC API. Base produces a canonical block every 200ms, each with its own hash, receipts, and state root.

## Networks

For network details, RPC endpoints, and wallet setup, see [Connecting to Base](https://docs.base.org/base-chain/quickstart/connecting-to-base.md).

> [!NOTE]
>
> The public Base endpoints are **HTTP only**. WebSocket RPC connections (`eth_subscribe`, `newHeads`, `logs`) are not available on public Base endpoints — choose a WebSocket-capable provider from the [Builder Stack](https://docs.base.org/get-started/builder-stack.md).

## API Reference

### Ethereum JSON-RPC API

Core Ethereum protocol methods for account queries, block and transaction data, gas estimation, and log filtering.

| Method | Description |
| :- | :- |
| [eth\_blockNumber](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_blockNumber.md) | Current block number |
| [eth\_getBalance](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getBalance.md) | Account ETH balance |
| [eth\_getTransactionCount](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getTransactionCount.md) | Account nonce / tx count |
| [eth\_getCode](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getCode.md) | Deployed contract bytecode |
| [eth\_getStorageAt](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getStorageAt.md) | Contract storage slot value |
| [eth\_call](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_call.md) | Execute read-only call |
| [eth\_getBlockByNumber](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getBlockByNumber.md) | Block data by number |
| [eth\_getBlockByHash](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getBlockByHash.md) | Block data by hash |
| [eth\_getBlockReceipts](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getBlockReceipts.md) | All receipts for a block |
| [eth\_getBlockTransactionCountByNumber](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getBlockTransactionCountByNumber.md) | Tx count by block number |
| [eth\_getBlockTransactionCountByHash](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getBlockTransactionCountByHash.md) | Tx count by block hash |
| [eth\_getTransactionByHash](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getTransactionByHash.md) | Transaction data by hash |
| [eth\_getTransactionByBlockHashAndIndex](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getTransactionByBlockHashAndIndex.md) | Tx by block hash and index |
| [eth\_getTransactionByBlockNumberAndIndex](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getTransactionByBlockNumberAndIndex.md) | Tx by block number and index |
| [eth\_getTransactionReceipt](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getTransactionReceipt.md) | Receipt for a mined tx |
| [eth\_sendRawTransaction](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_sendRawTransaction.md) | Submit signed transaction |
| [eth\_simulateV1](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_simulateV1.md) | Simulate transaction bundles against canonical state |
| [eth\_gasPrice](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_gasPrice.md) | Current gas price |
| [eth\_maxPriorityFeePerGas](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_maxPriorityFeePerGas.md) | Max priority fee estimate |
| [eth\_feeHistory](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_feeHistory.md) | Historical base fee and rewards |
| [eth\_estimateGas](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_estimateGas.md) | Estimate gas for a tx |
| [eth\_getLogs](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getLogs.md) | Query event logs by filter |
| [eth\_chainId](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_chainId.md) | Network chain ID |
| [eth\_syncing](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_syncing.md) | Node sync status |
| [net\_version](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/net_version.md) | Network version ID |
| [web3\_clientVersion](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/web3_clientVersion.md) | Client version string |
| [eth\_subscribe](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_subscribe.md) | Subscribe to events (WSS) |
| [eth\_unsubscribe](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_unsubscribe.md) | Cancel a subscription (WSS) |

### Base API

Base-specific methods served by Base nodes.

| Method | Description |
| - | - |
| [base\_transactionStatus](https://docs.base.org/base-chain/api-reference/base-api/base_transactionStatus.md) | Check whether a transaction is in the node mempool. Not available on the public endpoints. |

### Debug API

Development and debugging utilities for deep transaction inspection and block replay. The public endpoints (`https://mainnet.base.org` and `https://sepolia.base.org`) do not serve debug methods or the `trace` and `txpool` namespaces. See [Connect to Base](https://docs.base.org/get-started/connect-to-base.md) for public endpoint limits. Debug methods replay transactions and are computationally expensive, so availability and rate limits vary among providers in the [Builder Stack](https://docs.base.org/get-started/builder-stack.md).

| Method | Description |
| - | - |
| [debug\_traceTransaction](https://docs.base.org/base-chain/api-reference/debug-api/debug_traceTransaction.md) | Full EVM execution trace for a transaction |
| [debug\_traceBlockByHash](https://docs.base.org/base-chain/api-reference/debug-api/debug_traceBlockByHash.md) | EVM traces for all transactions in a block by hash |
| [debug\_traceBlockByNumber](https://docs.base.org/base-chain/api-reference/debug-api/debug_traceBlockByNumber.md) | EVM traces for all transactions in a block by number |

## Request & Response Format

All requests are HTTP POST with `Content-Type: application/json`.

| Field | Type | Description |
| :- | :- | :- |
| `jsonrpc` | string | Always `"2.0"` |
| `method` | string | The RPC method name |
| `params` | array | Method parameters in order |
| `id` | number \| string | Identifier echoed back in the response |

**Request:**

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "method": "eth_getBalance",
  "params": ["0x742d35Cc6634C0532925a3b8D4C9dD0b4f3BaEa", "latest"],
  "id": 1
}
```

**Success response:**

```json Success Response theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1a055690d9db80000"
}
```

**Error response:**

```json Error Response lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Invalid params"
  }
}
```

## Error Codes

| Code | Name | Description |
| - | - | - |
| `-32700` | Parse error | Invalid JSON |
| `-32600` | Invalid request | Not a valid JSON-RPC 2.0 object |
| `-32601` | Method not found | Method does not exist or is unavailable |
| `-32602` | Invalid params | Invalid method parameters |
| `-32603` | Internal error | Internal JSON-RPC error |
| `-32000` | Server error | Node-specific error (see message) |

## Block Parameters

| Value | Description |
| - | - |
| `"latest"` | Most recently sealed block |
| `"pending"` | Accepted and resolves to the latest canonical block. Use `"latest"` instead. |
| `"safe"` | Latest safe block |
| `"finalized"` | Latest finalized block |
| `"earliest"` | Genesis block |
| `"0x<n>"` | Specific block by number |
