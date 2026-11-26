// Permission checks. Every action an agent takes goes through canDo() first.
import { LEVELS, SKILLS } from "./registry.mjs";
export const ACTION_LEVEL = {
  "read": LEVELS.READ_ONLY, "analyze": LEVELS.READ_ONLY, "report": LEVELS.READ_ONLY,
  "prepare": LEVELS.PREPARE, "simulate": LEVELS.PREPARE,
  "execute-approved": LEVELS.APPROVED_EXECUTION,
  "scheduled-automation": LEVELS.RESTRICTED_AUTOMATION,
};
// Returns { ok, reason }. Refuses revoked, paused, or underpowered agents, and skills the agent doesn't hold.
export function canDo(agent, action, skill = null) {
  if (agent.status === "revoked") return { ok: false, reason: "agent permissions were revoked" };
  if (agent.status === "paused") return { ok: false, reason: "agent is paused" };
  const need = ACTION_LEVEL[action];
  if (!need) return { ok: false, reason: `unknown action ${action}` };
  if (agent.permissionLevel < need) return { ok: false, reason: `action ${action} needs level ${need}, agent is level ${agent.permissionLevel}` };
  if (skill) {
    if (!(agent.skills || []).includes(skill)) return { ok: false, reason: `skill ${skill} is not enabled for this agent` };
    if (SKILLS[skill]?.status === "not-built") return { ok: false, reason: `skill ${skill} is not built yet` };
    if (SKILLS[skill]?.status === "needs-key" && !agent.hasKey) return { ok: false, reason: `skill ${skill} needs the user's own API key` };
  }
  return { ok: true, reason: "allowed" };
}
