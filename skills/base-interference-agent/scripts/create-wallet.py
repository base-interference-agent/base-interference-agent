#!/usr/bin/env python3
"""Create an agent wallet on THIS machine and save its key to .env.

The private key is written to the .env file only. It is never printed.
Only the address is shown. Run it on your own computer.

Setup once:   pip install eth-account
Run:          python3 scripts/create-wallet.py [path/to/.env]
"""
import os
import re
import sys

try:
    from eth_account import Account
except ImportError:
    sys.exit("Missing package. Run: pip install eth-account")

KEY_LINE = "AGENT_WALLET_PRIVATE_KEY"
env_path = sys.argv[1] if len(sys.argv) > 1 else ".env"

lines = []
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        lines = f.read().splitlines()

for line in lines:
    if re.match(rf"^\s*{KEY_LINE}\s*=\s*\S+", line):
        sys.exit(f"{KEY_LINE} is already set in {env_path}. Remove it first if you want a new wallet.")

account = Account.create()
key_hex = account.key.hex()
new_line = f"{KEY_LINE}={key_hex}"

replaced = False
for i, line in enumerate(lines):
    if re.match(rf"^\s*{KEY_LINE}\s*=", line):
        lines[i] = new_line
        replaced = True
if not replaced:
    lines.append(new_line)

fd = os.open(env_path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
with os.fdopen(fd, "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")
os.chmod(env_path, 0o600)

print("Agent wallet created.")
print(f"Address: {account.address}")
print(f"Key saved to {env_path} (not shown here).")
print("Fund this address on Base Mainnet (chain ID 8453) with only what the agent needs.")
