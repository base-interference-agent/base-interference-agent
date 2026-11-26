#!/usr/bin/env bash
# Compiles and tests every contract in the repo's vault/ project on a local Base-compatible chain.
# Needs Node 20+ and a one-time install: (cd ../../vault && npm install)
# Nothing is sent to Base Mainnet.
set -euo pipefail
VAULT="$(cd "$(dirname "$0")/../../.." && pwd)/vault"
cd "$VAULT"
[ -d node_modules ] || { echo "Run once: (cd vault && npm install)"; exit 1; }
node scripts/compile-all.mjs
npm run test
node test/page-check.mjs
echo "All contract tests finished. Passing tests are not an audit."
