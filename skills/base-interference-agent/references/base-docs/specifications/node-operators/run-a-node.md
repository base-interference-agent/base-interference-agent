> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Run a Node

> A tutorial that teaches how to set up and run a Base Node.

This tutorial will walk you through setting up your own [Base Node](https://github.com/base/base).

## Objectives

By the end of this tutorial you should be able to:

* Deploy and sync a Base node

## Prerequisites

> [!WARNING]
>
> Running a node is time consuming, resource expensive, and potentially costly. If you don't already know why you want to run your own node, you probably don't need to.
>
> If you're just getting started and need an RPC URL, you can use our free endpoints:
>
> * **Mainnet**: `https://mainnet.base.org`
> * **Testnet (Sepolia)**: `https://sepolia.base.org`
>
> **Note:** Our RPCs are rate-limited and not suitable for production apps. They do not serve the `debug`, `trace`, or `txpool` namespaces. See [Connect to Base](https://docs.base.org/get-started/connect-to-base.md) for details.
>
> If you're looking to harden your app and avoid rate-limiting for your users, choose an RPC provider from the [Builder Stack](https://docs.base.org/get-started/builder-stack.md).

### Hardware Requirements

See the [Node Performance guide](https://docs.base.org/specifications/node-operators/performance-tuning.md#hardware) for full hardware specifications, storage requirements, and production hardware examples.

### Networking

Configure your firewall to allow the following ports for peer discovery and sync. Operators with strict egress rules must open the outbound ports to connect to Base bootnodes.

> [tab] Ingress
>
> | Port | Protocol | Purpose |
> | - | - | - |
> | `9222` | TCP/UDP | Reth Discovery v5 (discv5) |
> | `30303` | TCP/UDP | P2P Discovery (discv4) & RLPx |

> [tab] Egress
>
> | Port | Protocol | Purpose |
> | - | - | - |
> | `9200` | UDP | Bootnode connectivity |
> | `9222` | TCP/UDP | Reth Discovery v5 (discv5) |
> | `30301` | TCP/UDP | Bootnode connectivity |
> | `30303` | TCP/UDP | P2P Discovery (discv4) & RLPx |
>
> > [!NOTE]
> >
> > Ports `9200` (UDP) and `30301` (TCP/UDP) are required to reach Base bootnodes. If outbound traffic to these ports is blocked, your node will fail to establish initial peer connections.
>
> > [!WARNING]
> >
> > If you use network ACLs (rather than stateful security groups such as AWS SGs) for egress control, you must also allow outbound traffic on the ephemeral port range **32768–60999** (TCP/UDP). Stateful firewalls track return traffic automatically; ACLs do not, so without this rule, response packets from peers are silently dropped.

### Docker

This tutorial assumes you are familiar with [Docker](https://www.docker.com/) and have it running on your machine.

### L1 RPC URL

You'll need your own L1 RPC URL. You can run the endpoint yourself or choose a third-party provider from the [Builder Stack](https://docs.base.org/get-started/builder-stack.md).

## Running a Node

> [!WARNING]
>
> **The base/node repository is archived.** The operator node is published from [base/base](https://github.com/base/base), and all releases ship from [base/base releases](https://github.com/base/base/releases). For any new setup or upgrade, use base/base.

> [!NOTE]
>
> Base Mainnet nodes require base/base [v1.5.1](https://github.com/base/base/releases/tag/v1.5.1) or later, and Base Sepolia nodes require [v1.5.0](https://github.com/base/base/releases/tag/v1.5.0) or later. Run the [latest release](https://github.com/base/base/releases/latest) from base/base on both networks. If you pin a release with `NODE_TAG`, use the minimum version for your network or later.

> [!WARNING]
>
> **Starting in v1.5.4, the engine persistence defaults are higher.** `--engine.persistence-threshold` changes from 7 to 70, `--engine.memory-block-buffer-target` from 5 to 70, and `--engine.persistence-backpressure-threshold` from 16 to 160. The node keeps more blocks in memory before writing them to disk, so it uses more memory and replays more blocks after an unclean shutdown. Size memory accordingly, or set these flags explicitly to keep your previous values.

> [!WARNING]
>
> **Remove Flashblocks settings.** Base no longer produces Flashblocks, so `RETH_FB_WEBSOCKET_URL`, `--flashblocks-url` (alias `--websocket-url`), `--max-pending-blocks-depth`, and `--flashblocks.ping-interval` have no effect. A future base/base release removes these flags, so a node that still sets them may fail to start after that upgrade. Remove them now. See [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md#update-node-configuration).

The root `docker-compose.yml` pulls `ghcr.io/base/node` by default; pass `--build` to compile the current source tree instead.

1. Clone the [repo](https://github.com/base/base).

2. Ensure you have an Ethereum L1 full node RPC available (not Base), and set `BASE_NODE_L1_ETH_RPC` & `BASE_NODE_L1_BEACON` in the appropriate `.env` file (`.env.mainnet` or `.env.sepolia`). If running your own L1 node, it needs to be synced before Base will be able to fully sync.

   > [!NOTE]
   >
   > Base posts its batches to L1 as [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) blobs, and `base-consensus` reads them from the `BASE_NODE_L1_BEACON` endpoint. Ethereum beacon nodes only have to serve blobs for `MIN_EPOCHS_FOR_BLOB_SIDECARS_REQUESTS` (4,096 epochs, about 18 days), and can prune older ones. `base-consensus` has no separate blob archive setting. If your node has to derive from L1 data older than that window, for example when you start from a snapshot more than about 18 days old, point `BASE_NODE_L1_BEACON` at a beacon node or provider that keeps historical blobs.

3. Start the node:
   * **Mainnet (pull the published image)**: `docker compose up`
   * **Mainnet (compile from source)**: `docker compose up --build`
   * **Testnet**: `NETWORK_ENV=.env.sepolia docker compose up`

4. Confirm you get a response from:

```bash Terminal theme={null}
curl -d '{"id":0,"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",false]}' \
  -H "Content-Type: application/json" http://localhost:8545
```

> [!WARNING]
>
> Syncing your node may take **days** and will consume a vast amount of your requests quota. Be sure to monitor usage and up your plan if needed.

### Pin a released image with `NODE_TAG`

`docker compose up` pulls `ghcr.io/base/node:latest` by default. To run a specific release without recompiling from source, set `NODE_TAG` to a published tag:

```bash Terminal theme={null}
NODE_TAG=vX.Y.Z docker compose up
```

Pinning a `NODE_TAG` skips the source build entirely, so the node boots as soon as the image is pulled. Omit `--build` when using `NODE_TAG`; passing `--build` forces a local compile that overrides the pinned image.

### Compose environment variables

The root `docker-compose.yml` exposes a few knobs so you can override defaults from your shell or a `.env` file without editing the compose file:

| Variable | Default | Purpose |
| - | - | - |
| `NODE_TAG` | `latest` | Image tag pulled from `ghcr.io/base/node`. Set to a release tag (`vX.Y.Z`) to pin. Use v1.5.1 or later on Base Mainnet and v1.5.0 or later on Base Sepolia. |
| `NETWORK_ENV` | `.env.mainnet` | Which network env file the `execution` and `node` services load. Set to `.env.sepolia` for testnet. |
| `HOST_DATA_DIR` | `./reth-data` | Host path mounted into the execution container at `/data`. Change to point at an external volume. |
| `PROFILE` | `maxperf` | Cargo build profile used when `--build` is passed. Matches the profile used for the published image. |

Running `docker compose up --build` compiles the current `base/base` tree using the `base` target of `etc/docker/Dockerfile.rust-services` (the same target that produces the published `ghcr.io/base/node` image), so a source build and a pinned image share the same binary layout.

### Consensus peering

`base-consensus` receives new unsafe blocks from the sequencer over [consensus-layer P2P gossip](https://docs.base.org/specifications/base-protocol/consensus/p2p.md), before those blocks are derived from L1. How closely your node tracks the chain tip depends on staying connected to consensus peers.

Since [Denim](https://docs.base.org/upgrades/denim/overview.md) retired Flashblocks, consensus-layer gossip is the lowest-latency way for a node to receive new blocks. Base publishes no separate block feed for nodes, so a node without consensus peers follows the chain only as blocks are derived from L1, which lags the chain tip.

* **Bootnodes**: `base-consensus` includes the Base Mainnet and Base Sepolia consensus bootnodes and always uses them, so you don't need to set `BASE_NODE_P2P_BOOTNODES`. ENRs you add there are used in addition to the built-in list. Bootnodes only help your node discover peers.
* **Static or trusted peers**: `base-consensus` has no static or trusted peer setting. The `op-node` `OP_NODE_P2P_STATIC` option has no equivalent (see the [environment variable mapping](https://docs.base.org/upgrades/azul/node-upgrade.md#environment-variable-mapping)).
* **Advertised address**: on startup, `consensus-entrypoint` looks up your public IP from an external service and advertises it as `BASE_NODE_P2P_ADVERTISE_IP`. If that lookup is blocked or returns the wrong address (for example, on egress-restricted hosts, behind NAT, or on multi-homed hosts), set `BASE_NODE_P2P_ADVERTISE_IP` in your network env file to the public address peers should dial. If the lookup fails and the variable is unset, the node exits. A configured advertise IP is fixed, so the node stops updating the address in its ENR automatically.
* **NAT**: the P2P listening endpoint must be reachable from the internet, but it can sit behind NAT. To accept inbound peers, forward the consensus P2P listen ports (`BASE_NODE_P2P_LISTEN_TCP_PORT` and `BASE_NODE_P2P_LISTEN_UDP_PORT`) to the host.

### Snapshots

If you’re a Base Node operator and would like to save significant time on the initial sync, you may [restore from a snapshot](https://docs.base.org/specifications/node-operators/snapshots.md#restoring-from-snapshot). Check [chain.base.org/snapshots](https://chain.base.org/snapshots) for the latest available snapshots.

### Syncing

You can monitor the progress of your sync with:

```bash Terminal theme={null}
echo Latest synced block behind by: $((($(date +%s)-$( \
  curl -d '{"id":0,"jsonrpc":"2.0","method":"optimism_syncStatus"}' \
  -H "Content-Type: application/json" http://localhost:7545 | \
  jq -r .result.unsafe_l2.timestamp))/60)) minutes
```

You'll also know that the sync hasn't completed if you get `Error: nonce has already been used` if you try to deploy using your node.

> [!TIP]
>
> For richer node data and diagnostic checks, use [`basectl`](https://github.com/base/base/tree/main/bin/basectl), the Base node operator CLI.

## Enable Historical Proofs RPCs

To serve methods like `eth_getProof`, `debug_executionWitness` and `debug_executePayload` efficiently, you'll need to set up the historical proofs execution extension (ExEx). This ExEx manages a separate database with data required to serve these methods. This database can add hundreds of GB of additional storage and requires a machine with higher I/O throughput. Most people do not need these RPCs to be available.

In order to run the historical proofs ExEx, you simply need to set this environment variable:

```bash Terminal theme={null}
RETH_HISTORICAL_PROOFS=true
```

When the node starts up for the first time, it will backfill existing state to the new proofs database in `<datadir>/proofs`. This process can take a while (24-48 hours for mainnet).

To skip the backfill, snapshots of the proofs database are available. See the [Snapshots](https://docs.base.org/specifications/node-operators/snapshots.md#proofs-snapshots) page for download instructions.

> [!NOTE]
>
> The block at which the ExEx first starts will be the earliest block for which these RPCs are available. The flag `--rpc.eth-proof-window` is ignored when the proofs ExEx is enabled.
>
> The ExEx keeps proofs for the most recent blocks set by the `--proofs-history.window` flag on `base-reth-node`. In base/base v1.5.0 and later, the default is `6480000` blocks (15 days at 200ms blocks: 6,480,000 × 0.2 seconds = 1,296,000 seconds). The default can change between releases, so run `base-reth-node node --help` to check the value for your version. The `execution-entrypoint` script in base/base does not map an environment variable to this flag.
>
> `--proofs-history.window` sets how long the ExEx retains proof history. It is separate from Reth's `--rpc.eth-proof-window` flag, which applies only when the ExEx is disabled.

### Improving Performance

The proofs ExEx performs best when it is within 1024 blocks of the chain tip. This means when syncing up to tip, performance can be degraded. During initial sync on Base Mainnet, the ExEx may fall too far behind to catch up on its own.

To fix this, you can run `base-consensus` in follow mode so it stays within 512 blocks of the proofs ExEx.

```bash Terminal theme={null}
BASE_NODE_SOURCE_L2_RPC=<trusted_rpc>
BASE_NODE_PROOFS=true
```

You can verify that the proofs ExEx is syncing efficiently by checking that the state root and execution durations are 0. The ExEx is not executing blocks in this case; instead it's just writing data from executed blocks to disk.
