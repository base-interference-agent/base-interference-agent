> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Token burns

> Send tokens collected through the creator's burn allocation to the dead address.

When the creator includes a burn allocation, trades in the launch pool collect tokens for burning. The token page shows how many have been collected and are ready to burn.

> [!NOTE]
>
> This page describes **Tax** burns of the launched token. **[\$O launches](https://docs.o1.exchange/launchpad/wsto/overview.md)** instead burn the wstO paired asset automatically during each swap, with an actual `totalSupply` reduction and no manual burn step.

**Burn tokens** sends that balance to the dead address, taking the tokens out of usable circulation. It does not burn tokens from your wallet or pay tokens to you. Anyone can do this and pay the network gas.

## What happens

1. Trades collect tokens according to the creator's burn allocation.
2. The collected balance waits until someone selects **Burn tokens**.
3. The transaction sends that balance to the dead address: `0x000000000000000000000000000000000000dEaD`.

The button is available when there is a balance to burn. If a burn transaction fails, the collected tokens remain available for another attempt.

## What burning changes

Sending tokens to the dead address reduces the amount in usable circulation. It does not change the token's fixed total supply, buy tokens from the market or guarantee a higher price.

See [Tax tokens](https://docs.o1.exchange/launchpad/tax/overview.md#split-the-remainder) for the allocation settings, or [Tax contract integration](https://docs.o1.exchange/launchpad/integration/tax-tokens.md#burn-redemption) for technical details.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.