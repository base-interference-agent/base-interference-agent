#!/usr/bin/env node
// Prints the wallet address that matches AGENT_WALLET_PRIVATE_KEY in .env. Never prints the key.
// Usage: node scripts/show-address.mjs [path/to/.env]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const req = createRequire(path.join(here, "../package.json"));
const { privateKeyToAccount } = req("viem/accounts");
const envFile = process.argv[2] || path.join(process.cwd(), ".env");
const line = fs.existsSync(envFile) ? fs.readFileSync(envFile, "utf8").split("\n").find((l) => l.startsWith("AGENT_WALLET_PRIVATE_KEY=")) : null;
const key = line ? line.split("=")[1].trim() : "";
if (!key) { console.error("No AGENT_WALLET_PRIVATE_KEY in " + envFile + ". Run scripts/create-wallet.py first."); process.exit(1); }
console.log(privateKeyToAccount(key.startsWith("0x") ? key : "0x" + key).address);
