#!/usr/bin/env node
// o1 Launchpad tracker for Base: lists recent launches and flags volume spikes. Read-only.
// Needs YOUR o1 key in O1_API_KEY (from .env). Create one at https://launch.o1.exchange/developers?chain=8453
// Usage: node scripts/o1-tracker.mjs [limit]
const key = process.env.O1_API_KEY;
if (!key) { console.error("Set O1_API_KEY in your .env (your own key). Create one: https://launch.o1.exchange/developers?chain=8453"); process.exit(1); }
const limit = Math.min(Number(process.argv[2] || 25), 100);
const API = process.env.O1_API_BASE || "https://api.launch.o1.exchange/v1";
const r = await fetch(`${API}/tokens?chain_id=8453&market=all&sort=trending&limit=${limit}`, { headers: { "x-api-key": key } });
const j = await r.json();
if (!j.data) { console.error("o1 API error:", JSON.stringify(j).slice(0, 300)); process.exit(1); }
console.log(`Base launches (trending, top ${j.data.length}):\n`);
for (const t of j.data) {
  const tok = t.token || {};
  const vol = t.stats?.volume_24h_usd ?? t.volume_24h_usd ?? null;
  const prev = t.stats?.volume_prev_24h_usd ?? null;
  let flag = "";
  if (vol != null && prev != null && prev > 0 && vol / prev >= 3) flag = "  << VOLUME SPIKE (3x or more)";
  console.log(`${(tok.symbol || "?").padEnd(10)} ${tok.address}  24h volume: ${vol ?? "n/a"}${flag}`);
}
console.log("\nRead-only. Trading is never automatic. Check each token with scripts/check-token.mjs first.");
