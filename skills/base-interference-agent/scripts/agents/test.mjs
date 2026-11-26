// Tests for the agent module. Runs the CLI in a temp folder. No network, no funds.
// Run: node --test scripts/agents/test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const CLI = path.join(here, "cli.mjs");
const cfgDir = fs.mkdtempSync(path.join(os.tmpdir(), "agt-"));
const work = fs.mkdtempSync(path.join(os.tmpdir(), "agtwork-"));
const cli = (...a) => spawnSync(process.execPath, [CLI, ...a], { cwd: work, encoding: "utf8", timeout: 120000 });
const cfg = (name, over = {}) => {
  const c = { name, type: "developer", purpose: "Watch new Base launches and report them.", tasks: ["report new launches"],
    skills: ["o1-tracker"], networks: ["eip155:8453"], permissionLevel: 1, limits: { perTxUsdc: 0, dailyUsdc: 0 }, ...over };
  const f = path.join(cfgDir, name.replace(/\W+/g, "_") + ".json"); fs.writeFileSync(f, JSON.stringify(c)); return f;
};
const idFrom = (r) => (r.stdout.match(/agt_[a-f0-9]{8}/) || [])[0];

test("create without --confirm shows the config and saves nothing", () => {
  const r = cli("create", cfg("Preview only"));
  assert.equal(r.status, 0); assert.match(r.stdout, /Not saved/); assert.match(r.stdout, /Permission level: 1/);
  assert.equal(cli("list").stdout.trim(), "[]");
});
test("create refuses a level-1 agent with a level-3 skill", () => {
  const r = cli("create", cfg("Too strong", { skills: ["x402-pay"] }));
  assert.notEqual(r.status, 0); assert.match(r.stderr, /needs permission level 3/);
});
test("create refuses bad limits, unknown skills, bad wallet, and level 4 without a schedule", () => {
  assert.notEqual(cli("create", cfg("Bad limits", { limits: { perTxUsdc: 10, dailyUsdc: 1 } })).status, 0);
  assert.notEqual(cli("create", cfg("Unknown skill", { skills: ["nope"] })).status, 0);
  assert.notEqual(cli("create", cfg("Bad wallet", { wallet: { address: "not-an-address" } })).status, 0);
  const r4 = cli("create", cfg("Auto no schedule", { permissionLevel: 4, limits: { perTxUsdc: 1, dailyUsdc: 5 }, allowedTokens: ["0xb200000000000000000000231734d0c898f56201"], allowedContracts: ["0x6131B5fae19EA4f9D964eAc0408E4408b66337b5"] }));
  assert.notEqual(r4.status, 0); assert.match(r4.stderr, /schedule/);
});
let id;
test("create with --confirm saves; list and permissions show it", () => {
  const r = cli("create", cfg("Base launch watcher"), "--confirm");
  assert.equal(r.status, 0, r.stderr); id = idFrom(r); assert.ok(id);
  assert.match(cli("list").stdout, /Base launch watcher/);
  const p = JSON.parse(cli("permissions", id).stdout);
  assert.equal(p.level, 1); assert.ok(p.cannot.some((x) => /sign or send/.test(x)));
});
test("run refuses a skill the agent does not hold", () => {
  const r = cli("run", id, "token-check", "0xb2000000000000000000001e800a7f5189430cD0");
  assert.notEqual(r.status, 0); assert.match(r.stderr, /not enabled/);
});
test("run refuses a level-2 skill (only read-only runs here)", () => {
  const f = cfg("Preparer", { permissionLevel: 2, skills: ["tx-preview"] });
  const pid = idFrom(cli("create", f, "--confirm"));
  const r = cli("run", pid, "tx-preview", "/dev/null");
  assert.notEqual(r.status, 0);
});
test("a not-built skill can't be enabled by an agent that holds it", () => {
  const f = cfg("Swapper", { permissionLevel: 3, skills: ["swap-execute"] });
  const r = cli("create", f, "--confirm");
  assert.equal(r.status, 0, r.stderr);
  const sid = idFrom(r);
  const run = cli("run", sid, "swap-execute");
  assert.notEqual(run.status, 0); assert.match(run.stderr, /not built yet|only executes read-only/);
});
test("pause blocks runs; resume allows them again", () => {
  cli("pause", id);
  assert.match(cli("run", id, "o1-tracker").stderr, /paused/);
  cli("resume", id);
  assert.doesNotMatch(cli("run", id, "o1-tracker").stderr, /paused/);
});
test("wallet accepts only a public address, never a private key", () => {
  const key = "0x" + "ab".repeat(32);
  const r = cli("wallet", id, "--address", key);
  assert.notEqual(r.status, 0);
  const ok = cli("wallet", id, "--address", "0x817502E6eeda06eAe1203EcC616F73eF9593C1Ce");
  assert.equal(ok.status, 0);
  assert.doesNotMatch(fs.readFileSync(path.join(work, ".agents", `${id}.json`), "utf8"), /ab{8}/);
});
test("revoke turns off every permission, and a revoked agent can't run or resume", () => {
  assert.equal(cli("revoke", id).status, 0);
  assert.match(cli("run", id, "o1-tracker").stderr, /revoked/);
  assert.notEqual(cli("resume", id).status, 0);
  const shown = JSON.parse(cli("show", id).stdout);
  assert.equal(shown.permissionLevel, 0); assert.deepEqual(shown.skills, []);
});
test("the audit log records creation, refusals, and revocation", () => {
  const events = JSON.parse(cli("history", id).stdout).map((e) => e.event);
  assert.ok(events.includes("created")); assert.ok(events.includes("revoked"));
  assert.ok(events.includes("run-refused"));
});
test("remove deletes the local record but keeps the audit trail", () => {
  assert.equal(cli("remove", id).status, 0);
  assert.doesNotMatch(cli("list").stdout, new RegExp(id));
  assert.ok(JSON.parse(cli("history", id).stdout).some((e) => e.event === "removed"));
});
