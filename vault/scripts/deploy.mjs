// Deploys OwnerVault to Base Mainnet. Dry run by default. Add --confirm to send.
// Reads OWNER_PRIVATE_KEY from ../.env on YOUR machine. The key is never printed.
import fs from "node:fs";
import path from "node:path";
import { createPublicClient, createWalletClient, http, formatUnits, encodeDeployData } from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { base } from "viem/chains";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const confirm = process.argv.includes("--confirm");
const dryKey = process.argv.includes("--dry-with-throwaway-key"); // test only, no funds

const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base Mainnet USDC
const RPC = process.env.BASE_RPC_URL || "https://mainnet.base.org";

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

const env = loadEnv(path.join(root, "..", ".env"));
let key = env.OWNER_PRIVATE_KEY;
if (!key && dryKey) key = generatePrivateKey(); // throwaway, dry run only
if (!key) { console.error("Set OWNER_PRIVATE_KEY in ../.env (see .env.example)."); process.exit(1); }
if (!key.startsWith("0x")) key = "0x" + key;

const account = privateKeyToAccount(key);
const artifact = JSON.parse(fs.readFileSync(path.join(root, "build/OwnerVault.json"), "utf8"));
const publicClient = createPublicClient({ chain: base, transport: http(RPC) });
const walletClient = createWalletClient({ account, chain: base, transport: http(RPC) });

const name = "Owner Vault USDC";
const symbol = "ovUSDC";
const args = [USDC, name, symbol, account.address];

const balance = await publicClient.getBalance({ address: account.address });
console.log("Chain: Base Mainnet (8453)");
console.log("Owner (your wallet):", account.address);
console.log("Asset: USDC", USDC);
console.log("Vault name:", name, "/", symbol);
console.log("ETH balance for gas:", formatUnits(balance, 18));

const data = encodeDeployData({ abi: artifact.abi, bytecode: artifact.bytecode, args });
const gas = await publicClient.estimateGas({ account: account.address, data }).catch((e) => { console.log("Gas estimate failed:", e.shortMessage || e.message); return null; });
if (gas) console.log("Estimated gas units:", gas.toString());

if (!confirm) {
  console.log("\nDRY RUN. Nothing was sent. Re-run with --confirm to deploy.");
  process.exit(0);
}
if (balance === 0n) { console.error("Wallet has no ETH on Base Mainnet. Fund it first."); process.exit(1); }

const hash = await walletClient.deployContract({ abi: artifact.abi, bytecode: artifact.bytecode, args });
console.log("Deploy tx sent:", hash);
const receipt = await publicClient.waitForTransactionReceipt({ hash });
console.log("Status:", receipt.status);
console.log("Vault address:", receipt.contractAddress);
console.log("Check it on https://basescan.org/address/" + receipt.contractAddress);
