#!/usr/bin/env node
// o1 Alpha tokens on Base: the ranked token addresses o1 lists, with symbol and name read
// from the chain. No API key needed. Read-only.
// Usage: node scripts/o1-tracker.mjs
const RPC = process.env.BASE_RPC_URL || "https://mainnet.base.org";
const list = await (await fetch("https://api.o1.exchange/api/v1/alpha-tokens?networkId=8453")).json();
if (!Array.isArray(list)) { console.error("Unexpected response from o1:", JSON.stringify(list).slice(0, 200)); process.exit(1); }
const decodeString = (h) => {
  if (!h || h.length < 130) return null;
  const b = Buffer.from(h.slice(2), "hex");
  return b.subarray(64, 64 + Number(BigInt("0x" + b.subarray(32, 64).toString("hex")))).toString("utf8");
};
async function call(to, data) {
  const r = await fetch(RPC, { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to, data }, "latest"] }) });
  return (await r.json()).result ?? null;
}
console.log(`o1 Alpha tokens on Base: ${list.length}\n`);
for (const addr of list) {
  const sym = decodeString(await call(addr, "0x95d89b41"));
  const name = decodeString(await call(addr, "0x06fdde03"));
  console.log(`${(sym || "?").padEnd(10)} ${(name || "").padEnd(28)} ${addr}`);
}
console.log("\nRead-only and key-free. For 24h volume and launch details, use the o1 Launchpad API with your own key.");
console.log("Check any token with scripts/check-token.mjs before trading. Trading is never automatic.");
