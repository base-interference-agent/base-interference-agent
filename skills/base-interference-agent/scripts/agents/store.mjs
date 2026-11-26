// Local agent store: one JSON file per agent in ./.agents/ (git-ignored). Holds configuration only.
// Private keys and seed phrases are never stored here. Wallets record an address only.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
export const DIR = () => path.join(process.cwd(), ".agents");
const file = (id) => path.join(DIR(), `${id}.json`);
export function save(agent) {
  fs.mkdirSync(DIR(), { recursive: true });
  agent.updatedAt = new Date().toISOString();
  fs.writeFileSync(file(agent.id), JSON.stringify(agent, null, 2), { mode: 0o600 });
  return agent;
}
export function load(id) {
  if (!/^agt_[a-f0-9]{8}$/.test(id || "")) throw new Error("bad agent id");
  if (!fs.existsSync(file(id))) throw new Error(`no agent ${id}`);
  return JSON.parse(fs.readFileSync(file(id), "utf8"));
}
export function list() {
  if (!fs.existsSync(DIR())) return [];
  return fs.readdirSync(DIR()).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(path.join(DIR(), f), "utf8")));
}
export function remove(id) { load(id); fs.unlinkSync(file(id)); }
export function newId() { return "agt_" + crypto.randomBytes(4).toString("hex"); }
