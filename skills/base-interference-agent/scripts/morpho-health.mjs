#!/usr/bin/env node
// Morpho Blue liquidation-risk check for a market. Read-only.
// Needs YOUR Morpho API key in MORPHO_API_KEY (from .env). Request one at https://docs.morpho.org/request-api-key/
// Usage: node scripts/morpho-health.mjs <chain_id:market_id> [wallet] [warnBelowPct]
//   warnBelowPct: warn when a position is within this % of the liquidation LTV (default 10)
import fs from "node:fs";
const selector = process.argv[2];
const wallet = (process.argv[3] || "").toLowerCase();
const margin = Number(process.argv[4] || 10);
if (!/^\d+:0x[a-fA-F0-9]{64}$/.test(selector || "")) { console.error("Usage: node scripts/morpho-health.mjs <chain_id:market_id> [wallet] [warnBelowPct]"); process.exit(1); }
const key = process.env.MORPHO_API_KEY;
if (!key) { console.error("Set MORPHO_API_KEY in your .env (your own key). Request one: https://docs.morpho.org/request-api-key/"); process.exit(1); }
const base = "https://private.api.morpho.org/v0/blue/markets/" + selector;
const headers = { "x-api-key": key, accept: "application/json" };

const market = await (await fetch(base, { headers })).json();
const lltv = BigInt(market?.data?.lltv_wad ?? "0");
if (lltv === 0n) { console.error("Could not read the market's liquidation LTV:", JSON.stringify(market).slice(0, 200)); process.exit(1); }
const lltvPct = Number(lltv) / 1e16; // WAD -> percent
const warnAt = lltvPct - margin;
const flagged = [];
let cursor = null, scanned = 0;
do {
  const url = `${base}/positions/health?ltv_wad_gte=${(BigInt(Math.floor(warnAt * 1e16))).toString()}&limit=1000` + (cursor ? `&cursor=${encodeURIComponent(cursor)}` : "");
  const page = await (await fetch(url, { headers })).json();
  if (!page.data) { console.error("API error:", JSON.stringify(page).slice(0, 200)); process.exit(1); }
  scanned += page.data.length;
  for (const p of page.data) {
    if (wallet && p.user_address.toLowerCase() !== wallet) continue;
    flagged.push(p);
  }
  cursor = page.cursor;
} while (cursor);

console.log(`Market ${selector}\nLiquidation LTV: ${lltvPct.toFixed(2)}%   Warning below: ${warnAt.toFixed(2)}% LTV\n`);
if (flagged.length === 0) console.log(wallet ? `Wallet ${wallet}: no warning (not within ${margin}% of liquidation, or no debt).` : `No positions within ${margin}% of liquidation (scanned ${scanned} with debt).`);
for (const p of flagged) {
  const ltv = Number(BigInt(p.ltv_wad)) / 1e16;
  const level = ltv >= lltvPct ? "LIQUIDATABLE" : "WARNING";
  console.log(`${level}: ${p.user_address}  LTV ${ltv.toFixed(2)}%  (liquidation at ${lltvPct.toFixed(2)}%)`);
}
console.log("\nRead-only. To reduce risk, the user repays or adds collateral through their own wallet after approval.");
