> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Node Snapshots

> Download and restore Base node snapshots to significantly reduce initial sync time for nodes.

Using a snapshot significantly reduces the initial time required to sync a Base node. Snapshots are updated regularly. See [chain.base.org/snapshots](https://chain.base.org/snapshots) for the latest available snapshot for each network, including its block height and date.

If you're a prospective or current Base node operator, you can restore from a snapshot to speed up your initial sync. Follow the steps below carefully.

> [!WARNING]
>
> **V1 snapshots are no longer published.** Base stopped publishing V1 node database snapshots for Base Mainnet and Base Sepolia on October 5, 2026 ([status notice](https://status.base.org/incidents/jx4p15jppftm)). Only reth V2 storage snapshots are available, from [chain.base.org/snapshots](https://chain.base.org/snapshots).
>
> If your node still uses V1 storage, upgrade to `base-reth-node` [v1.2.0](https://github.com/base/base/releases/tag/v1.2.0) or later and migrate to V2 storage using one of two paths:
>
> * **Download a fresh V2 snapshot** (recommended, faster) — use `base-reth-node download` as described in [Restoring from Snapshot](#restoring-from-snapshot) below.
> * **Migrate existing V1 data in place** — run `base-reth-node db migrate-v2`. This is expected to take **much** longer than downloading, and non-archival nodes are not supported.

## Restoring from Snapshot

These steps assume you are in the cloned [base/base](https://github.com/base/base) directory (the one containing `docker-compose.yml`).

> [!NOTE]
>
> These steps use the `base-reth-node` CLI to download snapshots. If you don't already have it, follow the [installation instructions](https://github.com/base/base#install-binaries) to install it first.

1. **Prepare Data Directory**:
   * **Before running Docker for the first time**, create the data directory on your host machine that will be mapped into the Docker container. This directory must match the `volumes` mapping in the `docker-compose.yml` file.
     ```bash theme={null}
     mkdir ./reth-data
     ```
   * If you have previously run the node and have an existing data directory, **stop the node** (`docker compose down`), remove the *contents* of the existing directory (e.g. `rm -rf ./reth-data/*`), and proceed.

2. **Choosing the chain**: Use the `--chain` flag to select the network

   | Network | `--chain` value |
   | - | - |
   | Base Mainnet | `base` |
   | Base Sepolia | `base-sepolia` |

3. **Download Snapshot**: V2 snapshots are split into many small, segmented files rather than a single archive. The CLI lists one `archive` snapshot because it contains all available files. The `full` and `minimal` options select progressively smaller subsets of that archive:

   | Config | Flag | Mainnet size |
   | - | - | - |
   | **Minimal** | `--minimal` | \~782.5 GB |
   | **Full** | `--full` | \~792.7 GB |
   | **Archive** | `--archive` | \~4.3 TB |
   | **Archive + Proofs** | `--archive --proofs` | \~4.9 TB |

   * **Minimal**: the smallest set needed to boot (latest state and headers, plus the minimum required history). Use it for the fastest, smallest download when you don't need historical data.
   * **Full**: full-node data matching the default full-node prune settings (state, headers, and a bounded window of transactions, receipts, and history). Use it for a standard full node without keeping the entire archive.
   * **Archive**: everything available, with all transactions, receipts, and account/storage history and no pruning. Use it when you need complete historical data (e.g. archive queries, indexing).
   * **Archive + Proofs**: everything in Archive, plus the proofs database for the [historical proofs ExEx](https://docs.base.org/specifications/node-operators/run-a-node.md#enable-historical-proofs-rpcs). Use it if you run the ExEx and want to skip the 24-48 hour backfill.

   Sizes are approximate Base Mainnet figures and grow over time. Check [chain.base.org/snapshots](https://chain.base.org/snapshots) for current sizes.

   > [!NOTE]
   >
   > Ensure you have enough free disk space to download the snapshot *and* extract its contents. The extracted data will be significantly larger than the archive.

   The above presets are convenient defaults that are available at [chain.base.org/snapshots](https://chain.base.org/snapshots). You may still configure custom pruning flags with the [`RETH_PRUNING_ARGS` variable](https://github.com/base/base/blob/main/.env.mainnet#L34) in `.env.mainnet` (or `.env.sepolia`). It is required to download the archival snapshot and then configure your custom pruning args.

   ```bash theme={null}
   # Minimal node on Base Mainnet
   base-reth-node download --minimal --datadir ./reth-data --chain base --resumable

   # Full node on Base Sepolia
   base-reth-node download --full --datadir ./reth-data --chain base-sepolia --resumable

   # Archive node with proofs on Base Mainnet
   base-reth-node download --archive --proofs --datadir ./reth-data --chain base --resumable
   ```

   Alternatively, for archival nodes only, you may run `base-reth-node db migrate-v2`. However, this is expected to take **much** longer than downloading. `--resumable` is also not supported in `migrate-v2`.

4. **(Optional) - tuning download concurrency:**

   The `--download-concurrency` flag controls how many simultaneous HTTP downloads run across the whole
   snapshot job. It defaults to `8`, which is a good baseline for most machines.

   If you have high-end hardware, you can safely increase it to speed up the download. A good rule of
   thumb is **2× the number of physical CPU cores**:

   ```bash theme={null}
   # Example: a 16 physical-core machine
   base-reth-node download --full --datadir ./reth-data --chain base --download-concurrency 32
   ```

5. **Start the Node**: Now that the snapshot data is in place, return the root of your Base node folder and start the node:

   ```bash theme={null}
   cd ..

   # Pull the published image
   docker compose up

   # Or compile the base/base tree locally
   docker compose up --build
   ```

   Your node should begin syncing from the last block in the snapshot.

6. **Verify**: Monitor the node logs (`docker compose logs -f <service_name>`) or use the [sync monitoring](https://docs.base.org/specifications/node-operators/run-a-node.md#syncing) command to ensure the node starts syncing from the snapshot's block height.

## Proofs Snapshots

If you are running the [historical proofs ExEx](https://docs.base.org/specifications/node-operators/run-a-node.md#enable-historical-proofs-rpcs), download the **Archive + Proofs** preset to skip the 24-48 hour backfill. It includes the proofs database alongside all Archive data:

```bash Download Archive + Proofs Snapshot theme={null}
base-reth-node download --archive --proofs --datadir ./reth-data --chain base --resumable
```

The proofs database is restored into the same data directory as the rest of the snapshot, so no separate extraction step is needed. Then continue from [**Start the Node**](#start-the-node) above.

## FAQ

> [accordion] What's the Difference Between a Full and Minimal Node?
>
> In Reth, a "full" node is just a pruned node with a specific preset rather than a distinct node type. Reth's `--full` preset retains the last **10,064 blocks** (about 1.4 days on Ethereum at 12-second blocks; about 34 minutes on Base at 200ms blocks, since 10,064 × 0.2 seconds ≈ 2,013 seconds).
>
> To read more about the difference between a Full and Minimal node, see the [Reth docs](https://reth.rs/run/storage/minimal).

> [accordion] How Do I Run My Previous Pruned Node Setup with v2 Storage?
>
> If your v1-storage pruned node had a pruning distance of more than 10064 blocks, it is required to pull an Archival snapshot and then add the prune args.
>
> Full will not work because it'll only have the last 10064 blocks.

> [accordion] I'm Seeing: Archive Extracted, but Output Verification Failed.
>
> This is caused due to a newer snapshot being uploaded during the time your download is happening. Please interrupt the download command and re-run it.
>
> Note: The download is idempotent, so it will not re-download files that have already been downloaded; it will only fetch the diff.
