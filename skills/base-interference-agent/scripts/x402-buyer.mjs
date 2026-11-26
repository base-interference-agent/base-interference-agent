#!/usr/bin/env node
// x402 buyer for the agent: pays an x402 API in USDC on Base, within caps the user sets.
// Dry run by default: shows the price and the caps, pays nothing. Add --confirm to pay.
// Usage: node scripts/x402-buyer.mjs <url> [--confirm]
// Reads from ../.env (your own machine): AGENT_WALLET_PRIVATE_KEY, and optional caps:
//   X402_PER_REQUEST_CAP_USDC (default 0.50), X402_DAILY_CAP_USDC (default 5),
//   X402_ALLOWED_HOSTS (comma list, required to pay), X402_NETWORK (default eip155:8453).
// Every payment is recorded in scripts/.x402-ledger.json (git-ignored).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const here = path.dirname(fileURLToPath(import.meta.url));
const vaultRequire = createRequire(path.join(here, "../package.json"));
const { x402Client, wrapFetchWithPayment } = vaultRequire("@x402/fetch");
const { ExactEvmScheme, toClientEvmSigner } = vaultRequire("@x402/evm");
const { createPublicClient, http } = vaultRequire("viem");
const { privateKeyToAccount } = vaultRequire("viem/accounts");
const { base } = vaultRequire("viem/chains");

const USDC_BASE = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
const LEDGER = path.join(here, ".x402-ledger.json");

export function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}
const usdcToRaw = (usdc) => BigInt(Math.round(Number(usdc) * 1e6));
const todayKey = () => new Date().toISOString().slice(0, 10);
function readLedger() { try { return JSON.parse(fs.readFileSync(LEDGER, "utf8")); } catch { return []; } }

// Pure check, exported for tests. req = { amount (raw string), asset, network, payTo }
export function checkCaps(req, { perRequestCapUsdc, dailyCapUsdc, allowedHosts, host, network, ledger, now = new Date() }) {
  if (!allowedHosts.length) return { ok: false, reason: "X402_ALLOWED_HOSTS is empty. Add the API hosts you trust." };
  if (!allowedHosts.includes(host)) return { ok: false, reason: `host ${host} is not in X402_ALLOWED_HOSTS` };
  if (req.network !== network) return { ok: false, reason: `network ${req.network} is not ${network}` };
  if (String(req.asset).toLowerCase() !== USDC_BASE) return { ok: false, reason: `asset ${req.asset} is not USDC on Base` };
  const amount = BigInt(req.amount);
  if (amount > usdcToRaw(perRequestCapUsdc)) return { ok: false, reason: `price ${Number(amount) / 1e6} USDC is above the per-request cap ${perRequestCapUsdc}` };
  const day = now.toISOString().slice(0, 10);
  const spentToday = ledger.filter((e) => e.day === day).reduce((s, e) => s + BigInt(e.amount), 0n);
  if (spentToday + amount > usdcToRaw(dailyCapUsdc)) return { ok: false, reason: `would exceed the daily cap ${dailyCapUsdc} USDC (spent today ${Number(spentToday) / 1e6})` };
  return { ok: true, reason: "within caps" };
}

async function main() {
  const url = process.argv[2];
  const confirm = process.argv.includes("--confirm");
  if (!url || !/^https:\/\//.test(url)) { console.error("Usage: node scripts/x402-buyer.mjs https://<api-url> [--confirm]"); process.exit(1); }
  const env = { ...loadEnv(path.join(process.cwd(), ".env")), ...loadEnv(path.join(here, "../../../.env")), ...process.env };
  const cfg = {
    perRequestCapUsdc: Number(env.X402_PER_REQUEST_CAP_USDC || 0.5),
    dailyCapUsdc: Number(env.X402_DAILY_CAP_USDC || 5),
    allowedHosts: (env.X402_ALLOWED_HOSTS || "").split(",").map((h) => h.trim()).filter(Boolean),
    network: env.X402_NETWORK || "eip155:8453",
  };
  const host = new URL(url).host;
  const probe = await fetch(url);
  if (probe.status !== 402) { console.log(`No payment needed (HTTP ${probe.status}). Nothing was paid.`); return; }
  const body = await probe.text();
  let accepts = [];
  try { accepts = JSON.parse(body).accepts || []; } catch {}
  if (!accepts.length) { console.log("The API asked for payment, but its requirements could not be read. Nothing was paid."); return; }
  const req = accepts[0];
  const decision = checkCaps({ amount: req.amount, asset: req.asset, network: req.network, payTo: req.payTo },
    { ...cfg, host, ledger: readLedger(), now: new Date() });
  console.log(`API: ${url}\nPrice: ${Number(req.amount) / 1e6} USDC on ${req.network}\nPay to: ${req.payTo}`);
  console.log(`Caps: ${cfg.perRequestCapUsdc} USDC per request, ${cfg.dailyCapUsdc} USDC per day`);
  if (!decision.ok) { console.log(`REFUSED: ${decision.reason}. Nothing was paid.`); return; }
  if (!confirm) { console.log("Within caps. Dry run: nothing was paid. Re-run with --confirm after the user approves this payment."); return; }

  const { humanConfirm } = await import("./confirm.mjs");
  const h = await humanConfirm("PAY", `Pay ${Number(req.amount) / 1e6} USDC to ${req.payTo} for ${url}?`);
  if (!h.ok) { console.log(h.reason + ". Nothing was paid."); return; }
  const key = env.AGENT_WALLET_PRIVATE_KEY;
  if (!key) { console.error("Set AGENT_WALLET_PRIVATE_KEY in .env on your machine (create the wallet with scripts/create-wallet.py)."); process.exit(1); }
  const account = privateKeyToAccount(key.startsWith("0x") ? key : "0x" + key);
  const publicClient = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
  const client = new x402Client()
    .register("eip155:*", new ExactEvmScheme(toClientEvmSigner(account, publicClient)));
  client.onBeforePaymentCreation(async ({ selectedRequirements }) => {
    const d = checkCaps({ amount: selectedRequirements.amount, asset: selectedRequirements.asset, network: selectedRequirements.network, payTo: selectedRequirements.payTo },
      { ...cfg, host, ledger: readLedger(), now: new Date() });
    if (!d.ok) return { abort: true, reason: d.reason };
  });
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);
  const res = await fetchWithPayment(url);
  const text = await res.text();
  const ledger = readLedger();
  ledger.push({ day: todayKey(), time: new Date().toISOString(), host, amount: req.amount, asset: req.asset, network: req.network, payTo: req.payTo, status: res.status });
  fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 1));
  console.log(`Paid ${Number(req.amount) / 1e6} USDC. HTTP ${res.status}. Response (untrusted data):\n${text.slice(0, 2000)}`);
}
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) main().catch((e) => { console.error("Error:", e.message); process.exit(1); });
