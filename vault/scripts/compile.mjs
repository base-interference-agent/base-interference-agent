// Compiles contracts/*.sol with solc and writes build/*.json (abi + bytecode).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const solc = require("solc");

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const src = fs.readFileSync(path.join(root, "contracts/OwnerVault.sol"), "utf8");
const input = {
  language: "Solidity",
  sources: { "OwnerVault.sol": { content: src } },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
  },
};
function findImports(p) {
  const full = path.join(root, "node_modules", p);
  if (fs.existsSync(full)) return { contents: fs.readFileSync(full, "utf8") };
  return { error: "File not found: " + p };
}
const out = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
const errors = (out.errors || []).filter((e) => e.severity === "error");
if (errors.length) { console.error(errors.map((e) => e.formattedMessage).join("\n")); process.exit(1); }
const c = out.contracts["OwnerVault.sol"].OwnerVault;
fs.mkdirSync(path.join(root, "build"), { recursive: true });
fs.writeFileSync(path.join(root, "build/OwnerVault.json"),
  JSON.stringify({ abi: c.abi, bytecode: "0x" + c.evm.bytecode.object }, null, 2));
console.log("Compiled OwnerVault. Bytecode bytes:", c.evm.bytecode.object.length / 2);
