> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# API migration

> Move from combined query modes to focused collection routes.

The focused routes make every displayed parameter valid for its endpoint. Earlier combined read and token-metadata forms remain available during migration and return `Deprecation` and `Link` response headers. The earlier combined claim-write route is retired; use the fee-claim route below.

## Product and funding compatibility

Existing requests keep the non-tax default. For Base, Robinhood, BSC, Monad, X Layer, Arc or Elysium Tax configuration or creation, explicitly send `launch_product=tax` (query) or `launch_product: "tax"` (JSON). `market=standard` still means crypto-paired, not non-tax. Use the returned suite's token mode and `tax_format`; all six Tax deployments are ERC-20 and use `inclusive`, while Base Standard remains B20.

Do not reinterpret old BPS fields as the new six-decimal percentage units. Use [the current Tax launch object](https://docs.o1.exchange/launchpad/api/launches.md#tax-token-launches), keep historical ABI decoding, and resolve existing tokens by their recorded factory. Select the matching chain and suite from the [Tax deployment table](https://docs.o1.exchange/launchpad/integration/tax-tokens.md), as exposed by the deployed API, with `dividend_accounting: "fee-accrual"`. Use Claim for already-assigned rewards. Earlier Tax identities remain for indexing and direct recovery, not public transaction preparation. Fee-claim requests retain their original meaning.

\$O launches use `launch_product: "wsto"` on Base or Robinhood. This does not change omitted product selection, which remains Standard. Optional `dev_buy` supports native or admitted paired-token funding. For compatibility, omitted `dev_buy.funding_token` means native currency on Standard/Tax and held wstO on \$O launches. Specify the address explicitly for new clients and use its decimals for `amount_in_raw`.

Optional `settlement_token` on swap quotes selects the payment/receipt asset. Omitting it still means the launch pool's paired asset. Read the per-quote configuration for supported alternatives; do not reinterpret old input amounts in a newly selected currency. Approval continuations and final simulation are described in [launch preparation](https://docs.o1.exchange/launchpad/api/launches.md#atomic-dev-buy).

## Route replacements

| Existing request | Focused route |
| - | - |
| `GET /tokens?q=...` | `GET /tokens/search?q=...` |
| `GET /tokens?creator=...` | `GET /creators/{address}/tokens` |
| `GET /tokens/{chain}/{token}/activity?kind=trades` | `GET /tokens/{chain}/{token}/trades` |
| `GET /tokens/{chain}/{token}/activity?kind=announcements` | `GET /tokens/{chain}/{token}/announcements` |
| `GET /wallets/{address}/claims?kind=fee` | `GET /wallets/{address}/fee-claims` |
| Retired `POST /claims/prepare` with `kind=fee` | `POST /claims/fees/prepare` |
| `POST /tokens/{chain}/{token}/metadata/prepare` with `update_name`, `update_symbol`, or `update_extra_metadata` | `POST /tokens/{chain}/{token}/metadata/onchain/prepare` |
| `POST /tokens/{chain}/{token}/metadata/prepare` with `update_profile` | `POST /tokens/{chain}/{token}/metadata/document/prepare` |
| `POST /tokens/{chain}/{token}/metadata/profile/prepare` | `POST /tokens/{chain}/{token}/metadata/document/prepare` |

Token browsing now uses self-contained sort values: `newest`, `oldest`, `trending`, `liquidity`, `market_cap`, or `volume_24h`. Do not send a separate `order` parameter.

Metadata-document preparation removes the `operation` field. Send `actor` and `document` directly and continue supplying `Idempotency-Key`.

No sunset date is currently announced. Integrations should migrate to the focused routes so unsupported parameter combinations cannot be constructed.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.