#!/usr/bin/env node
// Previews a transaction before the user signs. Read-only: simulates with eth_call and
// estimates gas. Never signs or sends.
// Usage: node scripts/preview-tx.mjs tx.json
// tx.json: { "from": "0x..", "to": "0x..", "data": "0x..", "value": "0" }
import fs from "node:fs";
const RPC = process.env.BASE_RPC_URL || "https://mainnet.base.org";
const tx = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const hexVal = (v) => "0x" + BigInt(v ?? "0").toString(16);
async function rpc(method, params) {
  const r = await fetch(RPC, { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) });
  const j = await r.json();
  return j.error ? { error: j.error.message } : { result: j.result };
}
const pad = (h) => h.replace(/^0x/, "").padStart(64, "0");
const addr = (h) => "0x" + h.slice(-40);
const big = (h) => BigInt("0x" + h.slice(0, 64)).toString();

const call = { from: tx.from, to: tx.to, data: tx.data, value: hexVal(tx.value) };
const sim = await rpc("eth_call", [call, "latest"]);
const gas = await rpc("eth_estimateGas", [call]);
const sel = (tx.data || "0x").slice(0, 10);
const body = (tx.data || "0x").slice(10);

console.log(`Chain: Base Mainnet (8453)`);
console.log(`From: ${tx.from}`);
console.log(`To: ${tx.to}`);
console.log(`ETH sent: ${Number(BigInt(hexVal(tx.value)))/1e18}`);
if (sel === "0x095ea7b3") {
  console.log(`ACTION: approve ${addr(body.slice(0,64))} (spender) to spend ${big(body.slice(64))} raw units of ${tx.to}`);
  if (big(body.slice(64)) === (2n**256n-1n).toString()) console.log("WARNING: unlimited approval. Prefer an exact amount.");
} else if (sel === "0xa9059cbb") {
  console.log(`ACTION: transfer ${big(body.slice(64))} raw units of ${tx.to} to ${addr(body.slice(0,64))}`);
} else if (sel === "0x23b872dd") {
  console.log(`ACTION: transferFrom ${addr(body.slice(0,64))} to ${addr(body.slice(64,128))}, ${big(body.slice(128))} raw units of ${tx.to}`);
} else {
  console.log(`ACTION: contract call, selector ${sel} (not a decoded type). Check the contract on basescan.org.`);
}
console.log(gas.error ? `GAS: estimate failed: ${gas.error}` : `GAS: about ${BigInt(gas.result).toString()} units`);
console.log(sim.error ? `SIMULATION: FAILS (${sim.error}). Don't send this.` : "SIMULATION: succeeds at the current block. Real results can still change before inclusion.");
console.log("Nothing was signed or sent.");
