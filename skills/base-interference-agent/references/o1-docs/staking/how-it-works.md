> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# How wstO works

> How the wstO exchange rate is set, what can change it, and what the vault's controls can and cannot do.

The vault holds O and issues wstO shares. Each wstO is a claim on an equal fraction of the O in the vault, so the value of your wstO follows the vault's O balance rather than a fixed 1:1 peg. wstO is backed by O, not by a USD value: the vault does not guarantee the price of O, and wstO can trade below its redemption value on external markets.

## Exchange rate

```text theme={null}
exchange rate = O held by the vault / total wstO supply
```

| Action | You receive |
| - | - |
| Deposit O | `O deposited / exchange rate` wstO, rounded down |
| Redeem wstO | `wstO redeemed × exchange rate` O, rounded down |

Both actions use the exchange rate from before your transaction. Rounding always favors the vault, and the remainder stays in it for every holder. The loss from rounding is less than the value of one smallest wstO unit per deposit and at most one smallest O unit per redemption.

For example, if the vault holds 1,000 O and 1,000 wstO exist, the rate is 1 O per wstO, and a deposit of 100 O mints 100 wstO.

## What changes the rate

The exchange rate can never decrease. It rises only when:

1. someone sends O directly to the vault without depositing;
2. a holder burns their own wstO, which destroys it for nothing in return;
3. rounding remainders from deposits and redemptions accumulate.

Deposits and redemptions at the current rate do not change it beyond rounding. The vault has no strategy, reward source, or external integration.

> [!WARNING]
>
> Do not send O directly to the vault address. A direct transfer mints no wstO, raises the rate for every holder, and cannot be recovered.

## Permanently locked shares

When each vault was created, part of its first wstO was minted to a Permanent Share Sink. The sink is a contract with no functions, so those shares can never move or be redeemed. They always count toward the total supply, which makes the exchange rate harder to manipulate while supply is small.

## Deposit pause

Each vault reads one switch from its Protocol Config contract: whether new deposits are paused.

* The Guardian can pause new deposits.
* Only governance can resume deposits, through a Timelock contract that enforces a public delay.
* A pause affects deposits only. Redemptions, transfers, burns, and permit signatures keep working.

The vault page shows **Live** while deposits are open and **Deposits paused** otherwise.

## What no one can do

No role can withdraw O from the vault, mint wstO, burn or move another holder's wstO, change balances, block redemptions or transfers, or upgrade the contracts. See [Governance boundary](https://docs.o1.exchange/staking/security.md#governance-boundary) for what each role can do.

The contracts are not upgradeable. If a vault ever had to change, a new vault would be deployed and holders would move by redeeming from the old one, which keeps working.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.