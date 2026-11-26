// Append-only audit log for sensitive agent actions: ./.agents/audit.jsonl (git-ignored).
import fs from "node:fs";
import path from "node:path";
import { DIR } from "./store.mjs";
export function logEvent(agentId, event, detail = {}) {
  fs.mkdirSync(DIR(), { recursive: true });
  const line = JSON.stringify({ time: new Date().toISOString(), agentId, event, detail }) + "\n";
  fs.appendFileSync(path.join(DIR(), "audit.jsonl"), line);
}
export function readEvents(agentId = null) {
  const f = path.join(DIR(), "audit.jsonl");
  if (!fs.existsSync(f)) return [];
  return fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)).filter((e) => !agentId || e.agentId === agentId);
}
