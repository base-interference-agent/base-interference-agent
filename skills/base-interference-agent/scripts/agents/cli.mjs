#!/usr/bin/env node
// Agent CLI. Commands follow the skill's conventions: node scripts/agents/cli.mjs <command> [args]
// create <config.json> [--confirm]   validate, show the full configuration and permission manifest, save with --confirm
// list | show <id> | permissions <id> | history [id]
// wallet <id> --address 0x...        record a public address only (never a key)
// pause|resume|revoke|remove <id>    revoke turns off every permission; remove deletes the local record
// run <id> <skill> [args...]         run a read-only skill the agent holds, after the permission check
import fs from "node:fs";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateConfig, skillErrors, permissionManifest } from "./config.mjs";
import { canDo, ACTION_LEVEL } from "./permissions.mjs";
import { SKILLS, LEVELS } from "./registry.mjs";
import * as store from "./store.mjs";
import { logEvent, readEvents } from "./audit.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const SCRIPTS = path.join(here, "..");
const [cmd, ...args] = process.argv.slice(2);
const out = (x) => console.log(typeof x === "string" ? x : JSON.stringify(x, null, 2));
const fail = (m) => { console.error("Error:", m); process.exit(1); };

function render(c) {
  const m = permissionManifest(c);
  return [`Name: ${c.name}`, `Type: ${c.type}`, `Purpose: ${c.purpose}`, `Tasks:`, ...c.tasks.map((t) => `  - ${t}`),
    `Skills: ${c.skills.join(", ") || "none"}`, `Networks: ${c.networks.join(", ")}`, `Permission level: ${c.permissionLevel}`,
    `Wallet: ${c.wallet?.address || "none (no wallet attached)"}`,
    `Limits: ${c.limits.perTxUsdc} USDC per transaction, ${c.limits.dailyUsdc} USDC per day`,
    `Schedule: ${c.schedule || "none"}`,
    `Can: ${m.can.join("; ")}`, `Cannot: ${m.cannot.join("; ")}`].join("\n");
}

switch (cmd) {
  case "create": {
    const file = args[0];
    if (!file) fail("usage: create <config.json> [--confirm]");
    const c = JSON.parse(fs.readFileSync(file, "utf8"));
    const errs = [...validateConfig(c), ...skillErrors(c)];
    if (errs.length) fail("invalid configuration:\n- " + errs.join("\n- "));
    const agent = { id: store.newId(), status: "active", hasKey: false, skills: c.skills, permissionLevel: c.permissionLevel,
      name: c.name, type: c.type, purpose: c.purpose, tasks: c.tasks, networks: c.networks, wallet: { address: c.wallet?.address || null },
      limits: c.limits, allowedTokens: c.allowedTokens || [], allowedContracts: c.allowedContracts || [], schedule: c.schedule || null,
      createdAt: new Date().toISOString() };
    console.log(render(agent));
    if (!args.includes("--confirm")) { console.log("\nNot saved. Review the configuration above, then re-run with --confirm to save."); break; }
    store.save(agent); logEvent(agent.id, "created", { level: agent.permissionLevel, skills: agent.skills });
    out(`Saved ${agent.id}`); break;
  }
  case "list": out(store.list().map((a) => ({ id: a.id, name: a.name, type: a.type, level: a.permissionLevel, status: a.status }))); break;
  case "show": out(store.load(args[0])); break;
  case "permissions": { const a = store.load(args[0]); out(permissionManifest(a)); break; }
  case "history": out(readEvents(args[0] || null)); break;
  case "wallet": {
    const a = store.load(args[0]); const i = args.indexOf("--address");
    if (i < 0 || !/^0x[a-fA-F0-9]{40}$/.test(args[i + 1] || "")) fail("usage: wallet <id> --address 0x...  (public address only)");
    a.wallet = { address: args[i + 1] }; store.save(a); logEvent(a.id, "wallet-address-set", { address: a.wallet.address });
    out(`Wallet address recorded for ${a.id}. No key is stored by the agent.`); break;
  }
  case "pause": case "resume": {
    const a = store.load(args[0]);
    if (cmd === "pause") a.status = "paused";
    else { if (a.status === "revoked") fail("a revoked agent can't be resumed. Create a new agent."); a.status = "active"; }
    store.save(a); logEvent(a.id, cmd, {}); out(`${a.id} is now ${a.status}`); break;
  }
  case "revoke": {
    const a = store.load(args[0]);
    a.status = "revoked"; a.permissionLevel = 0; a.skills = []; a.schedule = null;
    store.save(a); logEvent(a.id, "revoked", { note: "all permissions off; skills removed; schedule cleared" });
    out(`${a.id} revoked. It has no permissions. Remove any cron entry that runs it.`); break;
  }
  case "remove": { const id = args[0]; store.remove(id); logEvent(id, "removed", {}); out(`Removed local record ${id}. Audit log kept.`); break; }
  case "run": {
    const [id, skill, ...rest] = args;
    const a = store.load(id);
    const s = SKILLS[skill];
    if (!s) fail(`unknown skill ${skill}`);
    const check = canDo(a, "read", skill);
    if (!check.ok) { logEvent(id, "run-refused", { skill, reason: check.reason }); fail(check.reason); }
    if (s.level > LEVELS.READ_ONLY) fail(`this runner only executes read-only skills. ${skill} needs approval flow`);
    if (!s.script) fail(`skill ${skill} has no script yet`);
    const r = spawnSync(process.execPath, [path.join(SCRIPTS, s.script), ...rest], { encoding: "utf8", timeout: 300000 });
    const ok = r.status === 0;
    logEvent(id, ok ? "run-ok" : "run-failed", { skill, status: r.status, error: r.error?.message || null });
    const note = { time: new Date().toISOString(), agentId: id, skill, ok, summary: (r.stdout || r.stderr || "").slice(0, 300) };
    fs.appendFileSync(path.join(store.DIR(), "notifications.jsonl"), JSON.stringify(note) + "\n");
    console.log((r.stdout || "").slice(0, 4000)); if (!ok) console.error(`Run failed: ${r.error?.message || r.stderr?.slice(0, 300)}`);
    process.exit(ok ? 0 : 1);
  }
  default:
    console.log("Commands: create, list, show, permissions, history, wallet, pause, resume, revoke, remove, run");
}
