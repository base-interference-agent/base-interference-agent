#!/usr/bin/env node
// Signs and sends ONE transaction the user has approved, from the wallet in .env on the user's machine.
// Dry run by default: simulates and shows what will happen. Add --confirm to send.
// Usage: node scripts/send-approved-tx.mjs tx.json [--confirm]
// tx.json: { "to": "0x..", "data": "0x..", "value": "0" }   (the agent prepares it; you review it)
// Refuses any chain other than Base Mainnet, and any transaction that fails simulation.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const here = path.dirname(fileURLToPath(import.meta.url));
const req = createRequire(path.join(here, "../package.json"));
const { createPublicClient, createWalletClient, http, formatEther } = req("viem");
const { privateKeyToAccount } = req("viem/accounts");
const { base } = req("viem/chains");
const file = process.argv[2];
const confirm = process.argv.includes("--confirm");
if (!file || !fs.existsSync(file)) { console.error("Usage: node scripts/send-approved-tx.mjs tx.json [--confirm]"); process.exit(1); }
const tx = JSON.parse(fs.readFileSync(file, "utf8"));
if (!/^0x[a-fA-F0-9]{40}$/.test(tx.to || "")) { console.error("tx.to must be a 0x address"); process.exit(1); }
const envArg = process.argv.indexOf("--env");
const envFile = envArg >= 0 ? path.resolve(process.argv[envArg + 1]) : path.join(process.cwd(), ".env");
console.log("Reading " + envFile);
const line = fs.existsSync(envFile) ? fs.readFileSync(envFile, "utf8").split("\n").find((l) => l.startsWith("AGENT_WALLET_PRIVATE_KEY=")) : null;
const key = line ? line.split("=")[1].trim() : "";
if (!key) { console.error("No AGENT_WALLET_PRIVATE_KEY in " + envFile + ". Run create-wallet.py in this folder first, or pass --env <path>."); process.exit(1); }
const account = privateKeyToAccount(key.startsWith("0x") ? key : "0x" + key);
const transport = http(process.env.BASE_RPC_URL || "https://mainnet.base.org");
const pub = createPublicClient({ chain: base, transport });
if ((await pub.getChainId()) !== 8453) { console.error("RPC is not Base Mainnet (8453). Refusing."); process.exit(1); }
const request = { account, to: tx.to, data: tx.data || "0x", value: BigInt(tx.value || "0") };
const bal = await pub.getBalance({ address: account.address });
console.log(`From: ${account.address}\nTo: ${tx.to}\nValue: ${formatEther(request.value)} ETH\nETH balance: ${formatEther(bal)}`);
try { await pub.call({ account: account.address, to: tx.to, data: request.data, value: request.value }); }
catch (e) { console.error("Simulation FAILS. Not sending.\n" + (e.shortMessage || e.message)); process.exit(1); }
const gas = await pub.estimateGas(request).catch(() => null);
if (gas === null) { console.error("Gas estimate failed. Not sending."); process.exit(1); }
const gasPrice = await pub.getGasPrice();
const cost = gas * gasPrice;
if (bal < request.value + cost) { console.error(`Not enough ETH: need about ${formatEther(request.value + cost)} ETH (value + gas), have ${formatEther(bal)}. Not sending.`); process.exit(1); }
console.log(`Simulation: succeeds now. Estimated gas: ${gas}. Estimated gas cost: ${formatEther(cost)} ETH.`);
if (!confirm) { console.log("\nDRY RUN. Nothing was sent. Add --confirm to sign and send."); process.exit(0); }
const { humanConfirm } = await import("./confirm.mjs");
const h = await humanConfirm("SEND", `Send ${formatEther(request.value)} ETH from ${account.address} to ${tx.to}?`);
if (!h.ok) { console.error(h.reason); process.exit(1); }
const wallet = createWalletClient({ account, chain: base, transport });
const hash = await wallet.sendTransaction(request);
const rcpt = await pub.waitForTransactionReceipt({ hash });
console.log(`Sent. Hash: ${hash}\nStatus: ${rcpt.status}\nhttps://basescan.org/tx/${hash}`);
