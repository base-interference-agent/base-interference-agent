// Tests the x402 buyer's spending rules. No payments are made.
import assert from "node:assert/strict";
import { checkCaps } from "../../skills/base-interference-agent/scripts/x402-buyer.mjs";
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const base = { perRequestCapUsdc: 0.5, dailyCapUsdc: 5, allowedHosts: ["api.example.com"], host: "api.example.com", network: "eip155:8453", ledger: [] };
const req = (over = {}) => ({ amount: "100000", asset: USDC, network: "eip155:8453", payTo: "0x1111111111111111111111111111111111111111", ...over }); // 0.10 USDC
let n = 0; const t = (name, fn) => { fn(); n++; console.log("PASS", name); };
t("allows a 0.10 USDC request within caps", () => assert.equal(checkCaps(req(), base).ok, true));
t("refuses a host not on the allowed list", () => assert.equal(checkCaps(req(), { ...base, host: "evil.example" }).ok, false));
t("refuses when the allowed list is empty", () => assert.equal(checkCaps(req(), { ...base, allowedHosts: [] }).ok, false));
t("refuses the wrong network", () => assert.equal(checkCaps(req({ network: "eip155:84532" }), base).ok, false));
t("refuses a non-USDC asset", () => assert.equal(checkCaps(req({ asset: "0x4200000000000000000000000000000000000006" }), base).ok, false));
t("refuses a price above the per-request cap", () => assert.equal(checkCaps(req({ amount: "600000" }), base).ok, false));
t("refuses when the daily cap would be exceeded", () => {
  const now = new Date();
  const ledger = [{ day: now.toISOString().slice(0, 10), amount: "4950000" }];
  const r = checkCaps(req({ amount: "100000" }), { ...base, ledger, now });
  assert.equal(r.ok, false); assert.match(r.reason, /daily cap/);
});
t("ignores yesterday's spending for the daily cap", () => {
  const now = new Date();
  const ledger = [{ day: "2000-01-01", amount: "4990000" }];
  assert.equal(checkCaps(req(), { ...base, ledger, now }).ok, true);
});
console.log(`All ${n} x402 cap checks passed. No payments were made.`);
