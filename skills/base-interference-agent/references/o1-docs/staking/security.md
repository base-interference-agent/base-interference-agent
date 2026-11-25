> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Security and audit

> The wstO vault audit, core safety properties, governance boundary, and verification guidance.

The wstO vault is designed around fully backed shares, instant redemption, and a single administrative switch that can only pause new deposits.

## Vault audit

> [card] XORS wstO vault audit
>
> Review of the wstO vault, governance, and deployment contracts dated October 2, 2026.

## Audit results

The report covers commit `5d14be4` and includes its findings. The contracts were not changed after the review, so the vaults deployed on Base and Robinhood Chain use the reviewed code. See [Contracts](https://docs.o1.exchange/staking/contracts.md) for deployed addresses. The web app was not part of the review, and no formal verification has been performed.

## Core safety properties

* the vault has no upgrade, rescue, administrative mint, or balance-seizure path, and no role can withdraw deposited O;
* every wstO is backed by the O the vault holds, and redemptions pay out from that balance at the current exchange rate;
* deposits and redemptions charge no fee, and rounding always favors the vault;
* the exchange rate can never decrease;
* redemptions, transfers, burns, and permit signatures cannot be paused;
* deposits and redemptions check the O actually transferred, so a transfer fee or rebase reverts the transaction;
* shares minted to the Permanent Share Sink at creation can never move;
* private keys and transaction signing remain in the user's wallet.

## Governance boundary

Each vault's Protocol Config has a Guardian and a governance address set to a Timelock contract. The Guardian can only pause new deposits. After the Timelock delay, governance can pause or resume deposits, replace the Guardian, and change the Timelock's own delay and roles. Governance actions are scheduled publicly on the Timelock before they can execute.

Neither the Guardian nor governance can move O, mint or burn wstO, change balances, or upgrade the contracts. The bootstrap authority that bound each vault to its Protocol Config was cleared permanently when the vault was created.

Timelock and Protocol Config addresses are listed in [Contracts](https://docs.o1.exchange/staking/contracts.md).

## What users and integrators should verify

* use the vault address for the selected network from [Contracts](https://docs.o1.exchange/staking/contracts.md);
* confirm the wallet is connected to the intended network;
* check that deposits are open, and review the exchange rate and minimum received before depositing;
* deposit only through the vault's deposit function, never by sending O directly to the vault;
* for integrations, quote again right before submitting and follow the [receiver rules](https://docs.o1.exchange/staking/integration.md#receivers-to-reject);
* review the network, contract, amounts, and wallet transaction details before signing.

To report a potential issue, follow the [o1 Exchange bug bounty guidance](https://docs.o1.exchange/community/bug-bounty.md).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.