> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# How it works

> Create or join a staking vault, understand its schedule and rewards, and know what happens when you withdraw or claim.

Staking lets anyone create a fixed-schedule reward vault for a compatible token. This includes B20 and compatible ERC-20 tokens on supported networks. Staking is separate from token creation and Uniswap liquidity: launching a token does not create a staking vault, and creating a vault does not change the token, its supply, or its market.

The **[wstO backing vault](https://docs.o1.exchange/launchpad/wsto/overview.md#what-is-wsto)** is a different contract and product. It holds \$O against wstO shares; it is not one of the fixed-epoch reward vaults described here. An \$O launch does not create a new backing vault or reward program. To deposit \$O for wstO, use [O Staking](https://docs.o1.exchange/staking/introduction.md).

Tokens created through o1 Launchpad can be staked after users buy or otherwise receive them in a wallet. Vault creation is permissionless, so the vault creator does not have to be the token creator.

> [card] Fully funded rewards
>
> The creator funds the complete reward budget when the vault is created.

> [card] Time-weighted rewards
>
> Each completed epoch is shared according to how many tokens each participant staked and for how long.

> [card] Separate deposit lots
>
> Every deposit has its own earning start, unlock time, and remaining principal.

> [card] Fixed vault rules
>
> The assets, schedule, rewards, and withdrawal policy cannot be changed or cancelled after creation.

Tax-token [holder dividends](https://docs.o1.exchange/launchpad/tax/dividends.md) are separate from staking rewards. They use eligible wallet balances without a staking deposit. Tokens deposited in a staking contract no longer count toward your wallet's dividend eligibility.

## Supported networks and assets

| Property | Support |
| - | - |
| Networks | Base mainnet (`8453`) and Robinhood Chain (`4663`) |
| Staking token | Base: B20 or standard ERC-20; Robinhood: standard ERC-20 |
| Reward currency | Native ETH or a compatible token on the selected network; it may be the same token being staked |
| Vault creator | Any wallet; launch ownership is not required |

The staking contract uses the same address on both networks, but vaults and balances remain independent on each network. See [Production contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#staking) for the address and current fee configuration.

> [!NOTE]
>
> Vaults are permissionless. Before staking, verify the network, creator, staking token, reward currency, schedule, and withdrawal policy shown on the vault page.

## Relationship to a token launch

Staking is an optional use for wallet-held tokens and does not replace the launch pool:

* permanent Uniswap liquidity stays in the launch pool;
* tokens bought or otherwise received in a wallet can be staked;
* creating a vault does not change the token supply, permissions, or launch configuration.

## Create a vault

**1. Choose the assets**

Select the compatible B20 or ERC-20 token participants will stake and the asset they will earn. Rewards may use native ETH, another compatible token, or the staking token itself.

**2. Set the schedule**

Choose a future start time in UTC, an epoch duration from 1 to 365 days, 1 to 50,000 epochs, and a fixed reward amount for each epoch.

**3. Choose the withdrawal policy**

Early withdrawals can be forbidden or allowed with a fixed penalty from 0% to 99.99%.

**4. Review the funding**

The interface shows when deposits open, the program start and end, the complete reward budget, the current one-time protocol fee, and the total amount due.

**5. Approve and create**

A native-reward vault is funded in the creation transaction. When rewards use a token, an approval is needed first if the existing allowance is too low, followed by the creation transaction.

### Funding and fixed terms

```text theme={null}
reward budget = reward per epoch × number of epochs
total due = reward budget + one-time protocol fee
```

The fee is charged in the selected reward currency. The interface refreshes it before submission, and creation stops for another review if the fee configuration changed.

> [!WARNING]
>
> Creating a vault permanently commits its configuration and funding. The creator cannot cancel it or recover rewards left by empty epochs, rounding, or unclaimed entitlements.

## Stake tokens

**1. Find a vault**

Open **Staking** from the Launchpad navigation or product switcher. You can browse the selected network or search by an exact staking-token address or vault ID. Wallet also provides a **Stake** shortcut for known Launchpad token holdings.

**2. Review the vault**

Check the creator, staking token, reward currency, schedule, rewards, total staked, and withdrawal policy.

**3. Approve and deposit**

If the staking contract does not already have enough allowance, approve the deposit amount first. The deposit transaction then creates a new lot and shows its expected unlock time.

### Deposit timing

Deposits open one epoch before the program starts and remain open until the program ends.

| Deposit time | Earning begins | Unlock time |
| - | - | - |
| Before the program starts | At the program start | One epoch after the start, unless the program ends sooner |
| During an active epoch | At the deposit time | One epoch after the deposit, unless the program ends sooner |
| During the final epoch | At the deposit time | At the program end |

Every deposit remains a separate lot. You can make multiple deposits, partially withdraw a lot, or withdraw from several lots together. Principal that remains deposited continues into later epochs.

## How rewards are calculated

Rewards are based on both amount and time. For each completed epoch:

```text theme={null}
your reward = epoch reward × your weight ÷ total weight
```

Depositing earlier gives that amount more weight than depositing later, and a larger deposit has more weight when held for the same time. The vault does not quote a guaranteed APR or APY because each participant's share depends on the total stake during the epoch.

Principal continues into later epochs while it remains deposited. Rewards are claimed separately and are not automatically added to principal.

## Withdraw principal

The vault page lets you select one or more deposit lots, choose full or partial amounts, and preview the penalty and net amount before signing.

| Situation | Result |
| - | - |
| Before unlock, early withdrawal forbidden | The lot cannot be withdrawn |
| Before unlock, early withdrawal allowed | The configured penalty is deducted from principal |
| At or after unlock | No early-withdrawal penalty |
| After the program ends | Principal is unlocked |

> [!WARNING]
>
> Withdrawing during an active epoch forfeits the current epoch's reward for the amount withdrawn, even when that lot is already unlocked. Rewards from earlier completed epochs remain claimable.

## Claim rewards

Rewards become claimable after each epoch ends. The interface shows completed, unclaimed epochs, previews the combined reward, and can claim multiple epochs in one transaction.

* epochs do not have to be claimed in order;
* each epoch can be claimed once per wallet;
* claims do not expire;
* withdrawing principal does not remove rewards earned in earlier completed epochs.

## Vault status and activity

| Status | Meaning |
| - | - |
| Scheduled | The vault exists, but deposits are not open yet |
| Pre-deposit | Deposits are open; rewards begin at the program start |
| Live | The reward program is active and deposits remain open |
| Ended | Deposits are closed; principal and completed rewards remain available |

After confirmation, vault creation, deposits, withdrawals, and claims appear in the staking pages and Wallet Activity. A short indexing delay may occur while the interface catches up with the confirmed transaction.

## Important considerations

Staking supports B20 tokens on Base and standard ERC-20 tokens on both networks when they use normal balance, transfer, and approval behavior. Fee-on-transfer, rebasing, reflection, and similar non-standard tokens are not supported. Tokens with their own pause, blocklist, or upgrade controls can also affect whether users are able to deposit or withdraw.

The staking contract owner can update the protocol fee and fee recipient for future vault creation. The owner cannot change or cancel an existing vault or withdraw its accounted principal and rewards.

> [card] [Production contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#staking)
>
> Verify the staking address and current fee configuration on each production network.

> [card] [Functions and events](https://docs.o1.exchange/launchpad/reference/events-functions.md#staking-contract)
>
> Review the direct contract surface for vault creation, deposits, withdrawals, and claims.

> [card] [Limits and validation](https://docs.o1.exchange/launchpad/reference/limits.md#staking-vault-limits)
>
> See the contract and interface limits applied to staking vaults.

> [card] [Security and audit](https://docs.o1.exchange/launchpad/security.md)
>
> Read the independent staking audit and the platform's verification guidance.

## Monad

The Monad launch integration does not include a staking deployment. Staking remains limited to the configured Base and Robinhood deployments; do not reuse those addresses on Monad.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.