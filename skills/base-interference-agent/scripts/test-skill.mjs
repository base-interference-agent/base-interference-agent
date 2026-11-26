// Checks that SKILL.md doesn't point to missing files or scripts, and that required sections exist.
// Run: node scripts/test-skill.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const md = fs.readFileSync(path.join(root, "SKILL.md"), "utf8");
const required = ["How to think (decision guide)", "0. First-time setup", "Approval workflow", "Contract testing", "Agents (create, configure, run, revoke)"];
for (const h of required) assert.ok(md.includes(h), `missing section: ${h}`);
const refs = new Set([...md.matchAll(/`((?:references|scripts)\/[^`\s]+)`/g)].map((m) => m[1]));
const missing = [];
for (const r of refs) {
  const clean = r.replace(/\/$/, "");
  if (!fs.existsSync(path.join(root, clean))) missing.push(clean);
}
assert.deepEqual(missing, [], "SKILL.md names files that don't exist");
console.log(`PASS: ${required.length} required sections, ${refs.size} referenced paths all exist`);
