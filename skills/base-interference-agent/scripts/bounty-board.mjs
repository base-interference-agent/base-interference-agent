#!/usr/bin/env node
// Lists open bounties from a deployed BountyEscrow contract on Base Mainnet. Read-only.
// Usage: node scripts/bounty-board.mjs <escrow address> [from-block]  (use the deploy block for full history)
// Needs the skill's packages installed once: npm install (in the skill folder)
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const vaultRequire = createRequire(path.join(here, "../package.json"));
const { createPublicClient, http, parseAbiItem, formatUnits } = vaultRequire("viem");
const { base } = vaultRequire("viem/chains");
const abi = JSON.parse(fs.readFileSync(path.join(here, "../references/vault/BountyEscrow.abi.json"), "utf8"));
const escrow = process.argv[2];
if (!/^0x[a-fA-F0-9]{40}$/.test(escrow || "")) { console.error("Usage: node scripts/bounty-board.mjs <escrow address>"); process.exit(1); }
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
const created = parseAbiItem("event BountyCreated(uint256 indexed id, address indexed poster, uint256 amount)");
// Public RPCs limit log searches, so by default search the recent blocks. Pass the escrow's deploy block for full history.
const latest = await client.getBlockNumber();
const from = process.argv[3] ? BigInt(process.argv[3]) : (latest > 40000n ? latest - 40000n : 0n);
const logs = await client.getLogs({ address: escrow, event: created, fromBlock: from, toBlock: latest });
const open = [];
for (const l of logs) {
  const id = l.args.id;
  const b = await client.readContract({ address: escrow, abi, functionName: "bounties", args: [id] });
  const [poster, claimant, amount, isOpen, details] = b;
  if (isOpen) open.push({ id: id.toString(), amount: formatUnits(amount, 6), poster, claimant: claimant === "0x0000000000000000000000000000000000000000" ? "none yet" : claimant, details });
}
console.log(`Escrow: ${escrow}\nOpen bounties: ${open.length} of ${logs.length} created\n`);
for (const o of open) console.log(`#${o.id}  ${o.amount} USDC  poster ${o.poster}  claimant ${o.claimant}\n    ${o.details}`);
console.log("\nRead-only. Claim or approve only through your own wallet, after checking the task.");
