#!/usr/bin/env node
// Verifies every Coinbase tokenized stock in references/stocks/base-stocks.json against the chain:
// its on-chain symbol() and decimals() must match the list. Read-only. Paced to respect public RPC limits.
// Usage: node scripts/verify-stocks.mjs [output.json]   (takes several minutes)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const rows = JSON.parse(fs.readFileSync(path.join(here, "../references/stocks/base-stocks.json"), "utf8"));
const RPC = process.env.BASE_RPC_URL || "https://mainnet.base.org";
const out = process.argv[2] || "verify-stocks-result.json";
let id = 1;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function call(method, params) {
  for (let a = 0; a < 8; a++) {
    try {
      const r = await fetch(RPC, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: id++, method, params }) });
      const j = await r.json();
      if (j.result !== undefined && j.result !== null) return j.result;
    } catch {}
    await sleep(1500 * (a + 1));
  }
  return null;
}
const decodeString = (h) => { try { const b = Buffer.from(h.slice(2), "hex"); return b.subarray(64, 64 + Number(BigInt("0x" + b.subarray(32, 64).toString("hex")))).toString("utf8"); } catch { return null; } };
const ok = [], bad = [];
for (const r of rows) {
  const sym = await call("eth_call", [{ to: r.address, data: "0x95d89b41" }, "latest"]);
  await sleep(400);
  const dc = await call("eth_call", [{ to: r.address, data: "0x313ce567" }, "latest"]);
  await sleep(400);
  if (sym === null || dc === null) { bad.push({ symbol: r.symbol, address: r.address, why: "RPC gave no data; rerun later" }); continue; }
  const chainSym = decodeString(sym), chainDec = dc.length > 2 ? Number(BigInt(dc)) : null;
  if (chainSym === r.symbol && chainDec === Number(r.decimals)) ok.push(r.symbol);
  else bad.push({ symbol: r.symbol, address: r.address, why: `chain ${chainSym}/${chainDec} vs list ${r.symbol}/${r.decimals}` });
  if ((ok.length + bad.length) % 50 === 0) console.log(`checked ${ok.length + bad.length} of ${rows.length}`);
}
fs.writeFileSync(out, JSON.stringify({ verified: ok.length, total: rows.length, problems: bad }, null, 1));
console.log(`Verified ${ok.length} of ${rows.length}. Problems: ${bad.length}. Written to ${out}`);
