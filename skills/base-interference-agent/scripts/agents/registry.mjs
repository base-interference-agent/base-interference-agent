// Skill registry: the only skills an agent can use. Each entry says what it needs and what
// permission level it requires. Status is honest: "available" means the code exists here;
// "needs-key" means it works only with the user's own API key; "not-built" means it doesn't exist yet.
export const LEVELS = { READ_ONLY: 1, PREPARE: 2, APPROVED_EXECUTION: 3, RESTRICTED_AUTOMATION: 4 };
export const SKILLS = {
  "token-check":   { level: 1, status: "available", script: "check-token.mjs", needs: "none" },
  "portfolio":     { level: 1, status: "available", script: "portfolio.mjs", needs: "none" },
  "o1-tracker":    { level: 1, status: "available", script: "o1-tracker.mjs", needs: "none" },
  "bounty-board":  { level: 1, status: "available", script: "bounty-board.mjs", needs: "escrow address" },
  "morpho-health": { level: 1, status: "needs-key", script: "morpho-health.mjs", needs: "your Morpho API key" },
  "tx-preview":    { level: 2, status: "available", script: "preview-tx.mjs", needs: "none" },
  "kyberswap-quote": { level: 2, status: "available", script: null, needs: "none (public endpoint, 3 requests/second)" },
  "x402-pay":      { level: 3, status: "available", script: "x402-buyer.mjs", needs: "wallet key in .env, caps, --confirm" },
  "swap-execute":  { level: 3, status: "not-built", script: null, needs: "signing provider" },
  "agent-to-agent": { level: 3, status: "not-built", script: null, needs: "agent directory and messaging service" },
  "marketplace-listing": { level: 3, status: "not-built", script: null, needs: "hosted marketplace backend" },
};
export const AGENT_TYPES = ["trading-research", "defi-monitoring", "portfolio", "developer", "token-analytics", "bounty-hunting", "payment", "custom"];
export const NETWORKS = { "eip155:8453": "Base Mainnet" };
