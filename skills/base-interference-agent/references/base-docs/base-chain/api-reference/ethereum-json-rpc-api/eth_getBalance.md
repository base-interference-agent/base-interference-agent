> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# eth_getBalance

> Returns the ETH balance of an account at a given block.

Returns the ETH balance of an address at a given block.

> [!NOTE]
>
> Since [Denim](https://docs.base.org/upgrades/denim/overview.md), Base produces a canonical block every 200ms and Flashblocks are retired. The `"pending"` tag is still accepted, but it no longer returns Flashblocks preconfirmation state. Use `"latest"` for the newest canonical state. See [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md).

## Parameters

**address** `string` *required*

The 20-byte address to query.

**block** `string` *required*

Block number in hex, or `"latest"`, `"pending"`, `"safe"`, `"finalized"`, `"earliest"`.

## Returns

**result** `string`

The balance in wei as a hexadecimal string.

## Example

```bash Standard (latest) lines wrap expandable theme={null}
curl https://mainnet.base.org \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": ["0x742d35Cc6634C0532925a3b8D4C9dD0b4f3BaEa", "latest"],
    "id": 1
  }'
```

```json Response theme={null}
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1a055690d9db80000"
}
```

## Read Balances for Many Addresses

`eth_getBalance` returns the balance of one address per call. To produce a balance snapshot across a set of addresses, such as every wallet your platform operates:

1. **Keep your own address list.** Base has no registry that maps addresses to the organization that controls them, so the list comes from your own records, for example the accounts your wallet or custody provider created for you.
2. **Pin one block number.** Read every balance at the same block so the snapshot reflects a single chain state. For reports, look up the `finalized` block with [`eth_getBlockByNumber`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getBlockByNumber) and pass its number to every read.
3. **Batch the reads.** Call `aggregate3` on the [`Multicall3`](https://docs.base.org/specifications/base-protocol/execution/preinstalls#multicall3) preinstall at `0xcA11bde05977b3631167028862bE2a173976CA11` with [`eth_call`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_call) at the pinned block. In the batch, use Multicall3's own `getEthBalance(address)` for ETH and each token contract's `balanceOf(address)` for ERC-20 balances.

To report balances over time, for example a time-weighted average, repeat the snapshot at fixed time intervals. Choose each snapshot block by its timestamp, not by a block count. Since [Denim](https://docs.base.org/upgrades/denim/200ms-blocks.md), Base produces a block every 200ms instead of every 2 seconds, so a fixed block count no longer maps to a fixed duration.

Reading state at older blocks requires a node that retains historical state. A Reth full node keeps only the last 10,064 blocks, about 34 minutes on Base. An archive node keeps all history. See [Snapshots](https://docs.base.org/specifications/node-operators/snapshots.md) for the difference.

> [!NOTE]
>
> A balance snapshot is a set of RPC reads, not an attestation. Base does not provide a service that attests, audits, or certifies balances across an organization's wallets.
