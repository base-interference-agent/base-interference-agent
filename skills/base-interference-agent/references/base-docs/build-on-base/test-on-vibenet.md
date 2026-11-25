> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Test on Vibenet

> Build and test against Base's newest chain-level features on Vibenet, Base's experimental preview network, and track what's live at chain.base.org/vibenet.

Vibenet is Base's experimental preview network, a devnet where new chain-level features go live before they roll out to Sepolia or Mainnet. Use it to build against cutting-edge Base capabilities.

> [!WARNING]
>
> Vibenet is for experimentation only. It is not intended for production or user-facing applications, and its state may be reset without notice.

## See What's Live on Vibenet

[chain.base.org/vibenet](https://chain.base.org/vibenet) is the hub for Vibenet: track the latest features as they ship, browse the block explorer, and request testnet ETH from the faucet.

[Base Vibenet, chain.base.org](https://chain.base.org/vibenet)

> [!NOTE]
>
> If the embed doesn't load, open [chain.base.org/vibenet](https://chain.base.org/vibenet) directly in a new tab.

## Network Details

| | |
| :- | :- |
| **Network name** | Base Vibenet |
| **RPC endpoint** | [rpc.vibes.base.org](https://rpc.vibes.base.org) |
| **WebSocket endpoint** | `wss://rpc.vibes.base.org/ws` |
| **Chain ID** | 84538453 |
| **Currency symbol** | ETH |
| **Faucet** | [chain.base.org/vibenet/faucet](https://chain.base.org/vibenet/faucet) |
| **Block explorer** | [chain.base.org/vibenet/explorer](https://chain.base.org/vibenet/explorer) |

To add Vibenet to your wallet, see [Connecting to Base](https://docs.base.org/base-chain/quickstart/connecting-to-base.md).

## Get Testnet ETH

Vibenet transactions need gas. Request testnet ETH from the [Vibenet faucet](https://chain.base.org/vibenet/faucet), or drip programmatically:

```bash Terminal theme={null}
curl -X POST https://api.vibes.base.org/api/vibenet/faucet/drip \
  -H "content-type: application/json" \
  -d '{"address":"0xYourAddress"}'
```

## Stream With WebSockets

Vibenet exposes a public WebSocket endpoint at `wss://rpc.vibes.base.org/ws`. Subscribe with `eth_subscribe` for push updates instead of polling:

* **`newHeads`** — a new event on every block, for tracking chain and block state.
* **`logs`** — contract events filtered by address and indexed topics, for tracking application state.

```javascript newHeads subscription lines wrap expandable theme={null}
import WebSocket from "ws";

const ws = new WebSocket("wss://rpc.vibes.base.org/ws");

ws.on("open", () => {
  ws.send(JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "eth_subscribe",
    params: ["newHeads"],
  }));
});

ws.on("message", (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.method === "eth_subscription") {
    console.log("new head:", msg.params.result.number);
  }
});
```

With 200ms blocks, a 250–1000ms poll can miss multiple blocks, so treat WebSocket push as the primary source. Keep a small number of long-lived connections, multiplex subscriptions and ordinary JSON-RPC calls over one connection, and reserve polling for reconciliation (balances, fees, and health checks). Keep an HTTPS RPC call path as a fallback if the socket drops.

> [!NOTE]
>
> This public WebSocket is Vibenet only. Base does not provide a free public WebSocket RPC endpoint for Base Mainnet or Base Sepolia; the public endpoints there are HTTP only. For WebSocket access on Sepolia or Mainnet, run your own node or use a WebSocket-capable provider from the [Builder Stack](https://docs.base.org/get-started/builder-stack.md).

## What's Available Now

> [card] [B20 Token Standard](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md)
>
> Base's native token standard: roles, supply caps, policy gating, and memos built into the chain.

> [card] [200ms Native Blocks](https://docs.base.org/upgrades/denim/200ms-blocks.md)
>
> Test canonical 200ms blocks and migrate Flashblocks integrations.

> [card] [Base Transactions](https://docs.base.org/specifications/base-transactions.md)
>
> Base Transactions are available on Vibenet.

## Next Steps

> [card] [Connect to Base](https://docs.base.org/base-chain/quickstart/connecting-to-base.md)
>
> Add Vibenet to your wallet and development environment.

> [card] [Launch a B20 Token](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md)
>
> Deploy a token on Vibenet with one factory call.
