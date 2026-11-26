// End-to-end tests on a local Base-compatible chain (chain ID 8453) using Ganache.
// Run: npm run test   (after npm install and node scripts/compile-all.mjs)
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import ganache from "ganache";
import { createPublicClient, createWalletClient, http, parseUnits, defineChain } from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const art = (n) => JSON.parse(fs.readFileSync(path.join(root, "build", n + ".json"), "utf8"));
const PORT = 8555;
const RPC = `http://127.0.0.1:${PORT}`;
const chain = defineChain({ id: 8453, name: "local-base", nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }, rpcUrls: { default: { http: [RPC] } } });

const names = ["deployer", "poster", "worker", "arbiter", "stranger", "worker2"];
const keys = Object.fromEntries(names.map((n) => [n, generatePrivateKey()]));
const acct = Object.fromEntries(names.map((n) => [n, privateKeyToAccount(keys[n])]));

const server = ganache.server({
  chain: { chainId: 8453, hardfork: "shanghai" },
  wallet: { accounts: names.map((n) => ({ secretKey: keys[n], balance: 10n ** 19n })) },
  logging: { quiet: true },
});
await server.listen(PORT);

const pub = createPublicClient({ chain, transport: http(RPC) });
const wallet = (n) => createWalletClient({ account: acct[n], chain, transport: http(RPC) });
const rpc = (method, params = []) => fetch(RPC, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) }).then((r) => r.json());

async function deploy(artifact, args, from = "deployer") {
  const hash = await wallet(from).deployContract({ abi: artifact.abi, bytecode: artifact.bytecode, args });
  const r = await pub.waitForTransactionReceipt({ hash });
  assert.equal(r.status, "success", "deploy failed");
  return r.contractAddress;
}
async function write(n, address, abi, fn, args = []) {
  const hash = await wallet(n).writeContract({ address, abi, functionName: fn, args });
  const r = await pub.waitForTransactionReceipt({ hash });
  assert.equal(r.status, "success", `${fn} failed`);
  return r;
}
async function expectRevert(n, address, abi, fn, args = []) {
  let failed = false;
  try { await write(n, address, abi, fn, args); } catch (e) { failed = true; }
  assert.ok(failed, `${fn} by ${n} should have reverted`);
}
const read = (address, abi, fn, args = []) => pub.readContract({ address, abi, functionName: fn, args });
const now = async () => Number((await pub.getBlock()).timestamp);
const bal = (addr) => read(usdc, usdcAbi, "balanceOf", [addr]);

let passed = 0;
const ok = (name) => { passed++; console.log("PASS", name); };

// Deploy
const usdcArt = art("MockUSDC"), vaultArt = art("OwnerVault"), bountyArt = art("BountyEscrow"), jobArt = art("JobEscrow");
const usdcAbi = usdcArt.abi;
const usdc = await deploy(usdcArt, []);
const U = (n) => parseUnits(String(n), 6);
const mint = async (to, amt) => write("deployer", usdc, usdcAbi, "mint", [acct[to].address, U(amt)]);
const approve = async (from, spender, amt) => write(from, usdc, usdcAbi, "approve", [spender, U(amt)]);

// ---------- OwnerVault ----------
const vault = await deploy(vaultArt, [usdc, "Owner Vault USDC", "ovUSDC", acct.poster.address]);
const vaultAbi = vaultArt.abi;
await mint("poster", 100); await approve("poster", vault, 100);
await write("poster", vault, vaultAbi, "deposit", [U(100), acct.poster.address]);
assert.equal(await bal(vault), U(100)); ok("vault: owner deposits 100 USDC");
await expectRevert("stranger", vault, vaultAbi, "deposit", [U(1), acct.stranger.address]);
ok("vault: stranger cannot deposit");
await expectRevert("stranger", vault, vaultAbi, "withdraw", [U(1), acct.stranger.address, acct.stranger.address]);
ok("vault: stranger cannot withdraw");
await write("poster", vault, vaultAbi, "withdraw", [U(40), acct.poster.address, acct.poster.address]);
assert.equal(await bal(vault), U(60)); ok("vault: owner withdraws 40, 60 left");

// ---------- BountyEscrow ----------
const bounty = await deploy(bountyArt, [usdc]);
const bountyAbi = bountyArt.abi;
await mint("poster", 50); await approve("poster", bounty, 50);
await write("poster", bounty, bountyAbi, "createBounty", [U(50), "fix the bug"]);
assert.equal(await bal(bounty), U(50)); ok("bounty: poster locks 50 USDC");
await write("worker", bounty, bountyAbi, "submitClaim", [0n]);
await expectRevert("worker2", bounty, bountyAbi, "submitClaim", [0n]);
ok("bounty: second claimant rejected while one is active");
await expectRevert("stranger", bounty, bountyAbi, "approvePayout", [0n]);
ok("bounty: non-poster cannot approve payout");
await write("poster", bounty, bountyAbi, "approvePayout", [0n]);
assert.equal(await bal("0x0000000000000000000000000000000000000000"), 0n);
assert.equal(await bal(acct.worker.address), U(50)); ok("bounty: poster approves, worker paid 50");
await expectRevert("poster", bounty, bountyAbi, "cancel", [0n]);
ok("bounty: cannot cancel after payout");

await mint("poster", 10); await approve("poster", bounty, 10);
await write("poster", bounty, bountyAbi, "createBounty", [U(10), "second task"]);
await write("worker", bounty, bountyAbi, "submitClaim", [1n]);
await expectRevert("poster", bounty, bountyAbi, "cancel", [1n]);
ok("bounty: cannot cancel while a claim is active");
await write("poster", bounty, bountyAbi, "rejectClaim", [1n]);
await write("arbiter", bounty, bountyAbi, "submitClaim", [1n]);
await write("poster", bounty, bountyAbi, "rejectClaim", [1n]);
await write("poster", bounty, bountyAbi, "cancel", [1n]);
assert.equal(await bal(acct.poster.address), U(50)); // 40 left after vault withdraw, +50 +10 minted, 50 locked then refunded
ok("bounty: reject then re-claim then cancel refunds poster");

// ---------- JobEscrow ----------
const job = await deploy(jobArt, [usdc]);
const jobAbi = jobArt.abi;
await mint("poster", 100); await approve("poster", job, 100);
let t = await now();
await write("poster", job, jobAbi, "createJob", [[U(60), U(40)], BigInt(t + 86400), acct.arbiter.address, "build the app", 86400n]);
assert.equal(await bal(job), U(100)); ok("job: poster locks 100 in 2 milestones");
const workerBefore = await bal(acct.worker.address);
await write("worker", job, jobAbi, "claimJob", [0n]);
await write("worker", job, jobAbi, "submitMilestone", [0n, 0n, "https://example.com/m1"]);
await expectRevert("stranger", job, jobAbi, "submitMilestone", [0n, 1n, "https://evil"]);
ok("job: only the worker can submit");
await write("poster", job, jobAbi, "approveMilestone", [0n, 0n]);
assert.equal(await bal(acct.worker.address), workerBefore + U(60)); ok("job: milestone 1 approved, worker paid 60");
await expectRevert("poster", job, jobAbi, "approveMilestone", [0n, 1n]);
ok("job: cannot approve a milestone that was not submitted");
await write("worker", job, jobAbi, "submitMilestone", [0n, 1n, "https://example.com/m2"]);
await write("worker", job, jobAbi, "disputeMilestone", [0n, 1n]);
await expectRevert("poster", job, jobAbi, "resolveDispute", [0n, 1n, true]);
ok("job: only the arbiter can resolve a dispute");
const posterBefore = await bal(acct.poster.address);
await write("arbiter", job, jobAbi, "resolveDispute", [0n, 1n, false]);
assert.equal(await bal(acct.poster.address), posterBefore + U(40)); ok("job: arbiter refunds disputed milestone 2 to poster");
const info = await read(job, jobAbi, "jobInfo", [0n]);
assert.equal(info[4], false); ok("job: closed after all milestones settled");

// Deadline refund
t = await now();
await mint("poster", 50); await approve("poster", job, 50);
await write("poster", job, jobAbi, "createJob", [[U(30), U(20)], BigInt(t + 86400), acct.arbiter.address, "unclaimed build", 86400n]);
await rpc("evm_increaseTime", [2 * 86400]); await rpc("evm_mine");
await expectRevert("worker", job, jobAbi, "claimJob", [1n]);
ok("job: no claim after the deadline");
const p2 = await bal(acct.poster.address);
await write("poster", job, jobAbi, "reclaimPending", [1n, 0n]);
await write("poster", job, jobAbi, "reclaimPending", [1n, 1n]);
assert.equal(await bal(acct.poster.address), p2 + U(50)); ok("job: poster reclaims 50 after deadline");

// Cancel before claim
t = await now();
await mint("poster", 5); await approve("poster", job, 5);
await write("poster", job, jobAbi, "createJob", [[U(5)], BigInt(t + 86400), acct.arbiter.address, "cancel me", 86400n]);
const p3 = await bal(acct.poster.address);
await write("poster", job, jobAbi, "cancelUnclaimed", [2n]);
assert.equal(await bal(acct.poster.address), p3 + U(5)); ok("job: cancel unclaimed job refunds poster");

// Review window: worker can release a submitted milestone only after the window passes
t = await now();
await mint("poster", 10); await approve("poster", job, 10);
await write("poster", job, jobAbi, "createJob", [[U(10)], BigInt(t + 86400), acct.arbiter.address, "review test", 86400n]);
const jid = (await read(job, jobAbi, "nextId", [])) - 1n;
await write("worker", job, jobAbi, "claimJob", [jid]);
await write("worker", job, jobAbi, "submitMilestone", [jid, 0n, "https://example.com/review"]);
await expectRevert("worker", job, jobAbi, "releaseAfterReview", [jid, 0n]);
ok("job: worker cannot release before the review window ends");
await rpc("evm_increaseTime", [86400 + 10]); await rpc("evm_mine");
const w0 = await bal(acct.worker.address);
await write("worker", job, jobAbi, "releaseAfterReview", [jid, 0n]);
assert.equal(await bal(acct.worker.address), w0 + U(10)); ok("job: worker releases after the review window, paid 10");
let badWindow = false;
try { await write("poster", job, jobAbi, "createJob", [[U(1)], BigInt(t + 86400), acct.arbiter.address, "bad", 3600n]); } catch { badWindow = true; }
assert.ok(badWindow); ok("job: review window below 1 day is refused");

console.log(`\nAll ${passed} checks passed.`);
await server.close();
