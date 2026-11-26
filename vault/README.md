# Owner vault (Base Mainnet)

An ERC-4626 vault for USDC on Base. Only the owner wallet can deposit and withdraw. Shares are minted to and burned from that wallet.

**Unaudited.** This contract hasn't been audited. Use small amounts, and get a review before you hold more.

## What's here
- `contracts/OwnerVault.sol`: the vault (OpenZeppelin 5.1.0 ERC-4626 and Ownable).
- `scripts/compile.mjs`: compiles to `build/OwnerVault.json`.
- `scripts/deploy.mjs`: dry run by default. Add `--confirm` to deploy.

## Deploy with your own wallet (on your computer)
1. Install Node 20 or newer.
2. In this folder: `npm install` then `npm run compile`.
3. Put your wallet key in `../.env` (copy `vault/.env.example` to `../.env` if you don't have one):
   ```
   OWNER_PRIVATE_KEY=<your wallet's private key>
   ```
   Use a wallet you control, with a little ETH on Base Mainnet for gas.
4. Dry run (sends nothing): `npm run deploy`
5. Deploy: `node scripts/deploy.mjs --confirm`
6. Check the vault address it prints on https://basescan.org.

## Using it
- Deposit USDC: approve the vault for USDC, then call `deposit(assets, owner)`.
- Withdraw: call `withdraw(assets, owner, owner)` or `redeem(shares, owner, owner)`.
- Only the owner can call these. Other addresses are rejected.

## Notes
- The key is read from `.env` on your computer and never printed or sent to the chat.
- Don't commit `.env`.
- Keep the owner key safe. Anyone who has it controls the vault.

## Tests
`npm run test` deploys the vault, bounty, and job contracts to a local Base-compatible chain (chain ID 8453, Shanghai) and runs 20 checks. They cover the allowed flows and the rejected ones: a stranger can't withdraw, only the worker can submit, only the arbiter resolves disputes, no claim after the deadline, and refunds after the deadline.

**Not audited.** Passing tests isn't a security review. A professional audit is still needed before large amounts.
