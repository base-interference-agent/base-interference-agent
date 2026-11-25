> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Fees and gas

> How to read the platform fee, routing costs, and network fees on an o1 Mobile quote.

These figures are current as of October 2026. The amount shown in the app at confirmation is authoritative.

## Platform fee

The Fee line on a swap quote currently includes a 1% platform fee. It is one part of the quote, together with Price impact, Estimated output, and Route.

Other costs can also apply:

* the network fee, when that route is not sponsored
* liquidity provider fees
* routing or bridge costs for a cross-chain swap

Those costs follow the route. They are not a second copy of the 1% platform fee. If the quote changes, review it again before you confirm.

## Sponsored network fees

Some routes sponsor the network fee, so you may not need that chain's native token for that swap. Sponsorship is not offered on every network, token, or amount. When it is absent, the wallet may need enough of the native token to cover the network fee.

## Other amounts you may see

| Action | What the app currently shows |
| - | - |
| Buy | At least \$2 in production. A smaller amount can also be rejected when it cannot cover fees. |
| Send | Amounts under \$0.10 are blocked. |
| Withdraw | The review screen currently shows a fee of \$0.06. |

Send and withdraw details are on [Send and withdraw](https://docs.o1.exchange/mobile/send-and-withdraw.md). The buy flow is on [Trading](https://docs.o1.exchange/mobile/decentralized-swaps.md).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.