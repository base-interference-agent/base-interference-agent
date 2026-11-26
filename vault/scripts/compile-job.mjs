// Compiles contracts/JobEscrow.sol to build/JobEscrow.json.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const solc = require("solc");
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const src = fs.readFileSync(path.join(root, "contracts/JobEscrow.sol"), "utf8");
const input = { language: "Solidity", sources: { "JobEscrow.sol": { content: src } },
  settings: { optimizer: { enabled: true, runs: 200 }, outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } } } };
const findImports = (p) => { const f = path.join(root, "node_modules", p); return fs.existsSync(f) ? { contents: fs.readFileSync(f, "utf8") } : { error: "not found: " + p }; };
const out = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
const errs = (out.errors || []).filter((e) => e.severity === "error");
if (errs.length) { console.error(errs.map((e) => e.formattedMessage).join("\n")); process.exit(1); }
const c = out.contracts["JobEscrow.sol"].JobEscrow;
fs.mkdirSync(path.join(root, "build"), { recursive: true });
fs.writeFileSync(path.join(root, "build/JobEscrow.json"), JSON.stringify({ abi: c.abi, bytecode: "0x" + c.evm.bytecode.object }, null, 2));
console.log("Compiled JobEscrow. Bytecode bytes:", c.evm.bytecode.object.length / 2);
