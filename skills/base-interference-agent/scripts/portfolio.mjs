#!/usr/bin/env node
// Read-only portfolio for a wallet on Base Mainnet: ETH, USDC, and minted Coinbase stock tokens.
// Values use KyberSwap quotes to USDC. P&L needs your cost basis in an optional JSON file.
// Usage: node scripts/portfolio.mjs <wallet> [cost-basis.json]
// cost-basis.json: { "NVDAc": 80.5, "USDC": 100 }  (total USDC you paid for each holding)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const stocks = JSON.parse(fs.readFileSync(path.join(here, "../references/stocks/base-stocks.json"), "utf8"));
const RPC = process.env.BASE_RPC_URL || "https://mainnet.base.org";
const USDC = { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", symbol: "USDC", decimals: 6 };
const WETH = { address: "0x4200000000000000000000000000000000000006", symbol: "WETH", decimals: 18 };
const wallet = process.argv[2];
if (!/^0x[a-fA-F0-9]{40}$/.test(wallet || "")) { console.error("Usage: node scripts/portfolio.mjs <0x wallet> [cost-basis.json]"); process.exit(1); }
const basis = process.argv[3] ? JSON.parse(fs.readFileSync(process.argv[3], "utf8")) : {};
const pad = (a) => a.slice(2).toLowerCase().padStart(64, "0");
async function rpc(method, params) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch(RPC, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) });
    const j = await r.json(); if (j.result !== undefined) return j.result;
    await new Promise((res) => setTimeout(res, 800 * (i + 1)));
  }
  return null;
}
async function balanceOf(token) {
  const h = await rpc("eth_call", [{ to: token, data: "0x70a08231" + pad(wallet) }, "latest"]);
  return h && h !== "0x" ? BigInt(h) : 0n;
}
async function usdcPrice(token, decimals) {
  // Price of one whole token in USDC, from a KyberSwap quote (public endpoint, read-only).
  const one = (10n ** BigInt(decimals)).toString();
  const url = `https://aggregator-api.kyberswap.com/base/api/v1/routes?tokenIn=${token}&tokenOut=${USDC.address}&amountIn=${one}`;
  try {
    const r = await fetch(url, { headers: { "x-client-id": "base-interference-agent" } });
    const j = await r.json();
    const out = j?.data?.routeSummary?.amountOut;
    return out ? Number(out) / 1e6 : null;
  } catch { return null; }
}
const fmt = (raw, d) => Number(raw) / 10 ** d;
const rows = [];
const ethRaw = BigInt((await rpc("eth_getBalance", [wallet, "latest"])) || "0x0");
const ethPrice = await usdcPrice(WETH.address, 18);
rows.push({ symbol: "ETH", amount: fmt(ethRaw, 18), price: ethPrice, basis: basis.ETH });
const usdcRaw = await balanceOf(USDC.address);
rows.push({ symbol: "USDC", amount: fmt(usdcRaw, 6), price: 1, basis: basis.USDC });
const minted = stocks.filter((s) => s.total_supply && Number(s.total_supply) > 0);
for (const s of minted) {
  const raw = await balanceOf(s.address);
  if (raw === 0n) continue;
  const price = await usdcPrice(s.address, s.decimals);
  rows.push({ symbol: s.symbol, amount: fmt(raw, s.decimals), price, basis: basis[s.symbol] });
}
let total = 0, pnlTotal = 0, pnlKnown = true;
console.log(`Wallet: ${wallet}\n`);
console.log("Asset     Amount          Price (USDC)   Value (USDC)   P&L (USDC)");
for (const r of rows) {
  const value = r.price == null ? null : r.amount * r.price;
  if (value != null) total += value;
  let pnl = "n/a";
  if (value != null && r.basis != null) { pnl = (value - r.basis).toFixed(2); pnlTotal += value - r.basis; } else pnlKnown = false;
  console.log(`${r.symbol.padEnd(9)} ${String(r.amount.toFixed(6)).padEnd(15)} ${String(r.price == null ? "no quote" : r.price.toFixed(4)).padEnd(14)} ${String(value == null ? "n/a" : value.toFixed(2)).padEnd(14)} ${pnl}`);
}
console.log(`\nTotal value (USDC): ${total.toFixed(2)}`);
console.log(pnlKnown ? `Total P&L (USDC): ${pnlTotal.toFixed(2)}` : "Total P&L: add a cost-basis file for every holding to see it.");
console.log("\nPrices are from KyberSwap quotes and can move. Read-only: nothing was sent.");
