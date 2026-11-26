// Agent configuration: schema, validation, and the permission manifest. Pure functions, no I/O.
import { LEVELS, SKILLS, AGENT_TYPES, NETWORKS } from "./registry.mjs";

const ADDR = /^0x[a-fA-F0-9]{40}$/;
const isNum = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0;

export function validateConfig(c) {
  const errors = [];
  if (!c || typeof c !== "object") return ["config must be an object"];
  if (typeof c.name !== "string" || c.name.trim().length < 2 || c.name.length > 60) errors.push("name must be 2-60 characters");
  if (typeof c.purpose !== "string" || c.purpose.trim().length < 10) errors.push("purpose must be at least 10 characters");
  if (!AGENT_TYPES.includes(c.type)) errors.push(`type must be one of: ${AGENT_TYPES.join(", ")}`);
  if (!Array.isArray(c.tasks) || c.tasks.length === 0 || c.tasks.length > 20) errors.push("tasks: 1 to 20 task descriptions");
  if (!Array.isArray(c.skills)) errors.push("skills must be a list");
  else for (const s of c.skills) if (!SKILLS[s]) errors.push(`unknown skill: ${s}`);
  if (!Array.isArray(c.networks) || c.networks.length === 0) errors.push("networks: at least one");
  else for (const n of c.networks) if (!NETWORKS[n]) errors.push(`unsupported network: ${n} (only Base Mainnet, eip155:8453)`);
  if (!Object.values(LEVELS).includes(c.permissionLevel)) errors.push("permissionLevel must be 1, 2, 3, or 4");
  if (c.wallet && c.wallet.address != null && !ADDR.test(c.wallet.address)) errors.push("wallet.address must be a 0x address");
  const lim = c.limits || {};
  if (!isNum(lim.perTxUsdc)) errors.push("limits.perTxUsdc must be a number of 0 or more");
  if (!isNum(lim.dailyUsdc)) errors.push("limits.dailyUsdc must be a number of 0 or more");
  if (isNum(lim.perTxUsdc) && isNum(lim.dailyUsdc) && lim.perTxUsdc > lim.dailyUsdc) errors.push("perTxUsdc cannot exceed dailyUsdc");
  if (c.permissionLevel === LEVELS.RESTRICTED_AUTOMATION) {
    if (!Array.isArray(c.allowedTokens) || c.allowedTokens.length === 0) errors.push("level 4 needs allowedTokens (addresses)");
    if (!Array.isArray(c.allowedContracts) || c.allowedContracts.length === 0) errors.push("level 4 needs allowedContracts (addresses)");
    if (!c.schedule) errors.push("level 4 needs a schedule (cron expression)");
  }
  for (const a of c.allowedTokens || []) if (!ADDR.test(a)) errors.push(`allowedTokens: bad address ${a}`);
  for (const a of c.allowedContracts || []) if (!ADDR.test(a)) errors.push(`allowedContracts: bad address ${a}`);
  return errors;
}

// Skills must fit the permission level. A level-1 agent can't hold a level-3 skill.
export function skillErrors(c) {
  const errs = [];
  for (const s of c.skills || []) {
    const need = SKILLS[s]?.level;
    if (need && need > c.permissionLevel) errs.push(`skill ${s} needs permission level ${need}, agent is level ${c.permissionLevel}`);
  }
  return errs;
}

// The manifest is what the user sees before saving: exactly what the agent may do.
export function permissionManifest(c) {
  const level = c.permissionLevel;
  const can = [];
  if (level >= 1) can.push("read blockchain data, token data, balances, and public APIs");
  if (level >= 2) can.push("prepare transactions and quotes (never signs or sends)");
  if (level >= 3) can.push("execute only after the user approves the exact transaction");
  if (level >= 4) can.push(`run scheduled automation within: ${c.schedule}, per-transaction ${c.limits.perTxUsdc} USDC, daily ${c.limits.dailyUsdc} USDC, listed tokens and contracts only`);
  return {
    level,
    can,
    cannot: ["sign or send without approval", "change its own permissions", "access any key or seed phrase", "move funds to anyone not on its approved list"],
    skills: (c.skills || []).map((s) => ({ skill: s, ...SKILLS[s] })),
  };
}
