> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# How launchpads work

> Run your own launchpad on o1 with Launchpad of Launchpads. Creators launch Tax tokens on it, and your launchpad earns a share of their tax.

Launchpad of Launchpads lets you run your own launchpad inside o1 Launchpad. A launchpad is your own token launch platform. It has a permanent URL, a public page, its own token and a vault. Creators launch Tax tokens on your launchpad. Each of these tokens pays a share of its tax to your vault.

> [!NOTE]
>
> Launchpad of Launchpads runs on Base (`8453`) and Robinhood (`4663`). Each chain has its own registry. Both chains use the same values. See [Live configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#launchpad-release-overview) for the settings of each chain.

## Parts of a launchpad

| Part | What it is |
| - | - |
| URL | A permanent name, for example `launch.o1.exchange/pads/example-launchpad`. Nobody can change it after creation. The same URL can exist on Base and on Robinhood. A link without a chain opens the launchpad with that URL. When both chains have the URL, the link opens the Base launchpad. A Robinhood link adds `?chain=4663` |
| Launchpad token | An [\$O launch](https://docs.o1.exchange/launchpad/wsto/overview.md) token, paired with wstO, that you create in the same flow. Its holders can burn it to claim the burn fund |
| Vault | A contract that the registry creates for your launchpad. It receives the launchpad share of each token on your launchpad |
| Launch rules | Who can launch, which paired assets they can use, and which tax ranges they must use |
| Page | A public page with your name, logo, links, statistics, token feed and your own sections |

The **Launchpads** directory lists every published launchpad. You can filter it by chain. The o1 home page can also show the tokens of one launchpad.

## How the money moves

**1. A creator launches a token on your launchpad**

The token is a Tax token. It names your vault as its launchpad. Your vault checks the launch against your launch rules before the pool opens.

**2. Each trade pays the token tax**

The protocol takes its part of the tax first. The launchpad share is a percent of the tax that remains after the protocol fee.

**3. Your vault receives the launchpad share**

The vault receives the share in the paired asset of the token, for example ETH or USDC.

**4. The vault splits each income**

50% becomes the owner share. The other 50% goes into the burn fund.

**5. Owner and holders claim**

The owner claims the owner share. Any wallet that burns 100,000 launchpad tokens receives the burn fund in the currencies that it selects.

For example, a token on your launchpad has a 3% buy tax and your launchpad share is 10%. The protocol takes 0.5% of the trade. 2.5% of the trade remains, and your vault gets 10% of it: 0.25% of the trade. The owner share is 0.125% of the trade, and the burn fund receives 0.125%.

## Current values

| Item | Value |
| - | - |
| Launchpad registration fee | 0.001 ETH, plus network gas. The launchpad token itself has no creation fee |
| Token launch fee on a launchpad | 0.001 ETH for each token, plus network gas |
| Default launchpad share | 10% of the tax that remains after the protocol fee. You can choose from 0% to 100% |
| Owner share | 50% of each vault income. Registration fixes the owner share |
| Burn fund | The other 50% of each vault income |
| Burn amount to claim the burn fund | 100,000 launchpad tokens, which is 0.01% of the supply |
| Paired assets for tokens on a launchpad | Base: the 15 Base crypto assets, for example ETH, USDC and cbBTC. Robinhood: ETH and USDG. See [Live configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#launchpad-release-overview) |
| Tax rules for tokens on a launchpad | The Tax rules of each chain: 1% to 10% buy and sell tax, protocol fee included. See [How taxes work](https://docs.o1.exchange/launchpad/tax/overview.md) |

## What o1 controls

The registry owner sets the registration fee, the burn amount and the owner share for new launchpads. A change does not change the owner share of an existing launchpad.

The registry owner or the registry guardian can pause three things:

* The creation of new launchpads.
* New token launches on all launchpads.
* New token launches on one launchpad.

A pause never stops trades of existing tokens, owner claims or burn fund claims. See [Configuration and governance](https://docs.o1.exchange/launchpad/architecture/deployment-governance.md#launchpad-roles).

## Choose a path

> [card] [Create a launchpad](https://docs.o1.exchange/launchpad/launchpads/create.md)
>
> One form and two wallet transactions: the launchpad token, then the registration.

> [card] [Launch a token on a launchpad](https://docs.o1.exchange/launchpad/launchpads/launch-tokens.md)
>
> What changes for a creator: launch rules, the launchpad share and membership.

> [card] [Earnings and burns](https://docs.o1.exchange/launchpad/launchpads/earnings.md)
>
> Claim the owner share, or burn launchpad tokens to claim the burn fund.

> [card] [Manage a launchpad](https://docs.o1.exchange/launchpad/launchpads/manage.md)
>
> Identity, page, launch rules, tokens and the payout address.

> [card] [Transfer a launchpad](https://docs.o1.exchange/launchpad/launchpads/transfer.md)
>
> Move the launchpad and the creator rights of its token to a new owner.

> [card] [Launchpad contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md#base-launchpad-contracts)
>
> Registry, vault, readers and the child token suite on Base and Robinhood.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.