# Contract audit guide

**The agent can't audit a contract.** A security audit needs professional reviewers. This skill can help prepare for one and catch common problems early. It doesn't replace an audit.

## What the agent can do
1. **Run the tests:** `scripts/test-contracts.sh` runs the repo's contract suites on a local Base-compatible chain.
2. **Review against a checklist** (below), and report what it finds with the exact lines.
3. **Explain findings** in plain language for the user and the auditor.
4. **Prepare audit materials:** a scope list, the contract addresses, the compiler version, the test results, and a list of known risks.

## Checklist
- **Access control:** who can call each admin or owner function? Is there a path where anyone can move funds?
- **Money movement:** check every `transfer`, `transferFrom`, and `call`. Look for reentrancy and state changes after external calls.
- **Approvals:** unlimited ERC-20 approvals, and approvals granted to the wrong spender.
- **Rounding and math:** share and asset conversions, and integer division that loses value.
- **Oracles and prices:** stale or manipulable price sources.
- **Upgradeability:** who can upgrade the contract, and can that be changed?
- **Denial of service:** loops over unbounded arrays, and calls that can block a withdrawal.
- **Signatures:** replay protection, chain ID, and nonce handling.
- **Dependencies:** pinned library versions, and known advisories for them.

## Automated tools (run on the user's machine)
Automated tools find some common bugs. They miss many others, and they can report false alarms.
- **Slither:** `pip install slither-analyzer`, then `solc-select install 0.8.24 && solc-select use 0.8.24`, then `slither vault/contracts`. Needs Python 3.9 or newer.
- In this environment, Slither could be installed but didn't finish, since the Solidity compiler binary couldn't be downloaded. Run it on your own machine.

## Before real money
1. Get a professional audit from a reputable firm, and fix the findings.
2. Re-run the tests after every fix, and tag the audited version.
3. Keep caps low, and add a way to pause or withdraw if the contract has an owner.
4. Tell users the audit date, the auditor, and any open findings.

## Precedent
Base funded a third-party audit of the Solady library (by Spearbit). It found 2 critical, 3 high, 7 medium, and 8 low severity issues, plus informational and gas notes, and v0.1.1 fixed them. That's the standard to aim for.
