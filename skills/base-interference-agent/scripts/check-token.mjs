#!/usr/bin/env node
// Checks a token on Base Mainnet before any swap or transfer.
// Usage: node scripts/check-token.mjs <address>
// Reports: is it in Coinbase's tokenized-stock list, does its on-chain symbol/decimals match,
// and is it USDC or a known token. Read-only. Never sends anything.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const stocks = JSON.parse(fs.readFileSync(path.join(here, "../references/stocks/base-stocks.json"), "utf8"));
const RPC = process.env.BASE_RPC_URL || "https://mainnet.base.org";
const KNOWN = {
  "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": { symbol: "USDC", decimals: 6, note: "Native USDC on Base" },
  "0x4200000000000000000000000000000000000006": { symbol: "WETH", decimals: 18, note: "Wrapped ETH on Base" },
};

const addr = process.argv[2];
if (!/^0x[a-fA-F0-9]{40}$/.test(addr || "")) {
  console.error("Give a 0x address (42 characters)."); process.exit(1);
}
const key = addr.toLowerCase();

async function rpc(method, params) {
  const r = await fetch(RPC, { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) });
  return (await r.json()).result ?? null;
}
const decodeString = (h) => {
  if (!h || h.length < 130) return null;
  const b = Buffer.from(h.slice(2), "hex");
  const n = Number(BigInt("0x" + b.subarray(32, 64).toString("hex")));
  return b.subarray(64, 64 + n).toString("utf8");
};

const listed = stocks.find((s) => s.address.toLowerCase() === key);
const known = KNOWN[key];
const code = await rpc("eth_getCode", [addr, "latest"]);
const symHex = await rpc("eth_call", [{ to: addr, data: "0x95d89b41" }, "latest"]);
const decHex = await rpc("eth_call", [{ to: addr, data: "0x313ce567" }, "latest"]);
const chainSymbol = decodeString(symHex);
const chainDecimals = decHex && decHex.length > 2 ? Number(BigInt(decHex)) : null;

const flags = [];
let verdict;
if (listed) {
  if (chainSymbol === listed.symbol && chainDecimals === listed.decimals) {
    verdict = "VERIFIED: Coinbase tokenized stock, on-chain symbol and decimals match.";
  } else {
    verdict = "WARNING: in Coinbase's list, but on-chain symbol/decimals don't match. Don't trade until checked.";
    flags.push(`chain symbol=${chainSymbol} decimals=${chainDecimals}, list symbol=${listed.symbol} decimals=${listed.decimals}`);
  }
} else if (known) {
  verdict = `KNOWN TOKEN: ${known.note}.`;
  if (chainSymbol !== known.symbol) flags.push(`on-chain symbol is "${chainSymbol}", expected ${known.symbol}`);
} else {
  verdict = "NOT ON THE LIST: not a Coinbase tokenized stock and not a known token. Treat as unverified.";
  if (chainSymbol && /[a-z]c$/.test(chainSymbol)) flags.push(`symbol "${chainSymbol}" looks like a stock ticker (ends in "c") but is not in Coinbase's list. Possible look-alike.`);
  if (chainSymbol && ["USDC", "WETH", "ETH"].includes(chainSymbol.toUpperCase())) flags.push(`symbol "${chainSymbol}" copies a known token name. Possible fake.`);
}
if (!code || code === "0x") flags.push("no contract bytecode. Normal for Base's built-in stock tokens, so check the list result above.");

console.log(`Address: ${addr}`);
console.log(`Symbol on chain: ${chainSymbol ?? "none"}   Decimals: ${chainDecimals ?? "none"}`);
console.log(verdict);
for (const f of flags) console.log("FLAG:", f);
console.log("Always confirm on https://basescan.org/token/" + addr + " before trading.");
