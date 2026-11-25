> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_getTransactionByHash

> Returns a transaction by its hash.

Returns information about a transaction given its hash. Returns `null` for unknown transactions.

## Parameters

**transactionHash** `string` *required*

The 32-byte transaction hash.

## Returns

**result** `object | null`

A transaction object, or `null` if the transaction was not found.

**Transaction Fields**

**hash** `string`

32-byte transaction hash.

**nonce** `string`

Number of transactions sent by the sender prior to this one (hex).

**blockHash** `string`

32-byte hash of the block containing this transaction. `null` if pending.

**blockNumber** `string`

Block number (hex). `null` if pending.

**transactionIndex** `string`

Index position in the block (hex). `null` if pending.

**from** `string`

20-byte sender address.

**to** `string`

20-byte recipient address. `null` for contract deployments.

**value** `string`

ETH value transferred in wei (hex).

**gas** `string`

Gas provided by the sender (hex).

**gasPrice** `string`

Gas price in wei. For EIP-1559 transactions, this is the effective gas price paid (hex).

**maxFeePerGas** `string`

EIP-1559 maximum total fee per gas (hex). Present for type `0x2` transactions only. Not present on type `0x7e`.

**maxPriorityFeePerGas** `string`

EIP-1559 maximum priority fee per gas (hex). Present for type `0x2` transactions only. Not present on type `0x7e`.

**input** `string`

ABI-encoded call data. `"0x"` for plain ETH transfers.

**type** `string`

Transaction type: `"0x0"` Legacy, `"0x1"` Access List, `"0x2"` EIP-1559, `"0x7e"` Deposit (L1→L2).

**chainId** `string`

Chain ID the transaction is valid for. `"0x2105"` for Base Mainnet, `"0x14a34"` for Base Sepolia. Not present on type `0x7e`.

**accessList** `array`

List of addresses and storage keys pre-declared by the transaction (EIP-2930). Present for type `0x1` and `0x2` transactions. Not present on type `0x7e`.

**v** `string`

ECDSA recovery ID (hex).

**r** `string`

32-byte ECDSA signature component r (hex). Always `"0x0"` for type `0x7e`.

**s** `string`

32-byte ECDSA signature component s (hex). Always `"0x0"` for type `0x7e`.

**sourceHash** `string`

Identifies the deposit source (bytes32 hex). Present on type `0x7e` only.

**mint** `string`

ETH minted on L2 as part of this deposit (hex). Usually `"0x0"`. Present on type `0x7e` only.

**depositReceiptVersion** `string`

Version of the deposit receipt format (hex). Present on type `0x7e` only.

**yParity** `string`

Signature parity (hex). Always `"0x0"` for type `0x7e` deposits.

> [!NOTE]
>
> **Transaction types on Base:** Base supports Ethereum-standard types (`0x0` legacy, `0x1` EIP-2930, `0x2` EIP-1559) as well as Base deposit transactions (`0x7e`). Deposit transactions are injected by the sequencer at the start of each block. Fields like `maxFeePerGas`, `accessList`, and `chainId` are not present on `0x7e` transactions; instead they carry `sourceHash`, `mint`, `depositReceiptVersion`, and `yParity`.

## Example

```json Request theme={null}
{
  "jsonrpc": "2.0",
  "method": "eth_getTransactionByHash",
  "params": ["0x03c8f106f18ad94190e763e21b584c5825b2f4c61f1274c0e8abe65b4476cd51"],
  "id": 1
}
```

```json Response (type 0x7e deposit) lines wrap expandable theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "blockHash": "0x491bca01d4bc076d60833dbd973fe031a74e7ae31866bf70d077619e09edb6ff",
    "blockNumber": "0x2c31b0b",
    "depositReceiptVersion": "0x1",
    "from": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0001",
    "gas": "0xf4240",
    "gasPrice": "0x0",
    "hash": "0x03c8f106f18ad94190e763e21b584c5825b2f4c61f1274c0e8abe65b4476cd51",
    "input": "0x3db6be2b...",
    "mint": "0x0",
    "nonce": "0x2c31b0e",
    "r": "0x0",
    "s": "0x0",
    "sourceHash": "0xe40ffb1b9f98a24b21e90e3a3cfe49de1eed195618e943da4d029881d3b3e055",
    "to": "0x4200000000000000000000000000000000000015",
    "transactionIndex": "0x0",
    "type": "0x7e",
    "v": "0x0",
    "value": "0x0",
    "yParity": "0x0"
  }
}
```

```json Not Found theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": null
}
```
