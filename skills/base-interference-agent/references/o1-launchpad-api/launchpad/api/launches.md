> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Prepare a launch

> Prepare a crypto-paired or stock-paired launch with the same validation as the platform.

`POST /launches/prepare` validates and prepares one launch. The caller's wallet remains the creator and signer.

Crypto-paired and stock-paired creation are available on Base, Robinhood, BSC, Monad and X Layer when enabled. Within each product, both markets use the same factory. Arc and Elysium support crypto-paired launches only. Each chain's Tax product has a separate ERC-20 factory and requires explicit product selection. A stock-paired launch requires the selected Stock Token to be present in the platform catalog, registered on the live factory, and enabled for creation. The November 5, 2026 reference lists 299 registered Base Stock Tokens, 194 on Robinhood, 21 bStocks on BSC and 45 wrapped stocks on X Layer, for both current products. Monad supports 10 wrapped xStocks on both products from November 10, 2026. Read `/config` for current availability.

The API rejects a market or paired asset that is not currently available instead of falling back to another factory.

**\$O launches** use `launch_product: "wsto"` on Base or Robinhood with that chain's wstO quote. Standard, Tax and \$O launches support optional atomic Dev Buy through the selected adapter. Read `/config` for admitted funding assets; the API never substitutes another product or route.

Use the [Create page](https://docs.o1.exchange/launchpad/trading/share-creator-fees.md) for **Share creator fees**. The public API rejects allocation and X-fee split inputs. A Tax `creator_fee_recipient` selects one ordinary fee recipient; it does not configure a shared split.

## Request

```json theme={null}
{
  "chain_id": 8453,
  "creator": "0x1111111111111111111111111111111111111111",
  "market": "standard",
  "quote_address": "0x0000000000000000000000000000000000000000",
  "token": {
    "name": "Example 01",
    "symbol": "EX01",
    "description": "Example launch",
    "website": "https://example.com",
    "x": "https://x.com/example",
    "telegram": "https://t.me/example",
    "editable_metadata": false,
    "extra_metadata": [],
    "image_base64": "<base64>",
    "image_type": "image/png"
  }
}
```

## Tax-token launches

Request `/config?chain_id=8453&launch_product=tax&market=all&active_only=false`, then choose a quote and suite with `creation_available: true`. Use the [Tax deployment table](https://docs.o1.exchange/launchpad/integration/tax-tokens.md) for the other chain IDs and suite names. Keep the chain ID consistent between configuration queries and launch requests; never reuse another chain's quote address. Binance-Peg USDC on BSC uses 18 decimals, while Arc ERC-20 USDC uses six.

Use the same request above, adding these top-level fields. This example selects 3% buy and sell tax, with the post-protocol remainder split 60% creator and 40% dividends:

```json theme={null}
{
  "launch_product": "tax",
  "tax": {
    "format": "inclusive",
    "buy_tax_rate": "3000000",
    "sell_tax_rate": "3000000",
    "creator_allocation_share": "60000000",
    "burn_allocation_share": "0",
    "dividend_allocation_share": "40000000",
    "integrator_allocation_share": "0",
    "minimum_dividend_holding_raw": "10000000000000000000000",
    "creator_fee_recipient": "0x1111111111111111111111111111111111111111",
    "integrator_fee_recipient": "0x0000000000000000000000000000000000000000",
    "anti_snipe_enabled": true
  }
}
```

These percentage fields are integer strings: `1000000` means 1%, and `1` means 0.000001%. The minimum holding uses 18-decimal token units, so the example means 10,000 tokens. Do not use BPS, floating-point numbers or percent signs in this object. `market` still selects crypto (`standard`) or stocks (`rwa`).

The API checks current bounds, protocol clamps, allocation conservation, minimum holding, recipients and anti-sniping availability, then uses the Tax launch tuple and ERC-20 prediction. Ordinary totals already include protocol. No Standard base/referral fee is added. Positive integrator allocation requires its valid recipient; zero allocation pays nothing.

Omitting `launch_product` preserves Standard behavior. A Tax object on a non-tax request, missing Tax settings or an incompatible tax format rejects. Historical BPS-shaped tax inputs are not the current inclusive format. The current Tax suite does not support vesting inputs. Optional Dev Buy uses the funding rules below and retains the selected Tax economics.

For Monad Tax, use `chain_id: 143`, `launch_product: "tax"` and `market: "standard"` for MON, USDC or WETH, or `market: "rwa"` for a wrapped xStock, and require `monad-mainnet-tax-token-v2` in the deployed configuration. Select the paired asset from that response. The native launch fee is 100 MON at the documented snapshot and remains payable in MON for every quote.

For X Layer Tax, use `chain_id: 196`, `launch_product: "tax"` and a quote returned by `/config` for `xlayer-mainnet-tax-token-v2`. The dated snapshot records 48 registered quotes. Read `/config` for current availability. The launch fee is 0.02 OKB for every pair. The SwapX router admits Tax and minimal-v4 Hooks; see [SwapX routers](https://docs.o1.exchange/launchpad/reference/production-contracts.md#swapx-router-upgrade-review).

For Elysium, use `chain_id: 99901` with `launch_product: "tax"` for `elysium-mainnet-tax-token-v2`, or omit it for `elysium-mainnet-launchpad-v4-minimal`. Select HYPE (the zero address, 18 decimals) or USDC (six decimals) from `/config`; no stock route is available. The launch fee is 0.025 HYPE for every pair. Dev Buy accepts native HYPE into a HYPE pool and held USDC into a USDC pool; native HYPE into a USDC pool returns `unsupported_operation`.

### Arc Tax launches

Use `chain_id: 5042`, `market: "standard"` and `launch_product: "tax"`. Require `arc-mainnet-tax-token-v2` and an available USDC or cirBTC quote from `/config`. The launch fee is **2 native USDC**, `2000000000000000000` transaction-value units; pool USDC amounts use six decimals and cirBTC uses eight. Do not register or select the zero address as an Arc Tax quote. Arc supports native-USDC Dev Buy for both pairs and held ERC-20 USDC for a USDC pair. Held cirBTC Dev Buy is not admitted by the adapter.

## \$O launches

Request `/config?chain_id=8453&launch_product=wsto&market=standard`. Use the same token fields as the request above, with these top-level values:

```json theme={null}
{
  "chain_id": 8453,
  "launch_product": "wsto",
  "market": "standard",
  "quote_address": "0x80C6BAE89B636c6Ee96FE8F198c0D6926C2C91df",
  "dev_buy": {
    "funding_token": "0x0000000000000000000000000000000000000000",
    "amount_in_raw": "10000000000000",
    "slippage_bps": 100
  }
}
```

This example adds a **0.00001 ETH Dev Buy**. The route acquires \$O through USDC, deposits into the wstO vault, then buys the newly created token. The purchase burns the pool's configured percentage of its wstO amount. There is no creation fee or `tax` object. Plain creation omits `dev_buy` and sends zero value; gas is additional in both cases. See [\$O launches](https://docs.o1.exchange/launchpad/wsto/overview.md).

For Robinhood, request `/config?chain_id=4663&launch_product=wsto&market=standard` and use the same request fields with `chain_id: 4663` and `quote_address: "0xE92bD1C05E4E308792003C8205127A6FA662b4D4"`. The zero-address funding token still means native ETH. The route is ETH → USDG → \$O → vault deposit → wstO → newly launched token. A held-wstO request instead uses that Robinhood vault address as `funding_token`, with 18-decimal share units. Never reuse Base's vault or stablecoin address on Robinhood.

## Atomic Dev Buy

Add `dev_buy` to an eligible Standard, Tax or \$O launch request. It contains `funding_token`, positive integer-string `amount_in_raw`, and `slippage_bps` from `1` to `4999`. Funding must be the chain's native currency or the selected paired token, as advertised in the quote's configuration. Do not send arbitrary route data.

| Funding choice | Address | Input units | Approval and transaction value |
| - | - | - | - |
| Native currency | Zero address | 18 decimals, including native USDC on Arc | No input-token approval; buy amount plus any native creation fee |
| Held paired token | Selected `quote_address` | That token's decimals | Approve the attached launch-buy adapter; native value covers only any native creation fee |

**Defaults are backward-compatible:** omitted `funding_token` means native funding for Standard/Tax, but **held wstO** for \$O launches. Send it explicitly to avoid ambiguity. \$O Dev Buy admits ETH or held wstO; its USDC, USDG and \$O trading routes are not Dev Buy funding options. Arc admits native USDC for USDC/cirBTC pairs and held ERC-20 USDC for USDC pairs, but not held cirBTC.

If `requires_reprepare` is `true`, submit the returned approval steps in order and wait for confirmation. Then repeat the original request with its `continuation_id` and a **new `Idempotency-Key`**, using the same API key and launch intent. The continuation retains the prepared metadata, salt and deadline; it does not bypass configuration, adapter, quote or allowance checks. An expired or stale continuation requires a fresh preparation.

When prerequisites pass, the response includes the final launch transaction, expected/minimum launched-token output and `review.dev_buy` funding identity, units and spender. The API does not return a provisional minimum-one purchase for signing. Creation, acquisition, any vault conversion and the initial purchase succeed together or revert together. An approval is a separate transaction and can remain even if the launch is cancelled.

Gas is additional to the entered purchase. Native funding is not launch-pool quote volume: for an ETH-funded \$O launch, the funding amount is ETH while the pool trade and burn amounts are wstO. Runtime quote failures can reflect external liquidity, vault conversion, settlement inventory, slippage or a changed binding. Follow the returned issue rather than modifying calldata.

## What preparation verifies

The API:

1. resolves exactly one active factory for the requested chain, product and market
2. confirms the paired asset is supported by that factory and registered onchain
3. reads the current supply, configuration version, quote terms, fee terms, and block time at one chain block
4. validates token identity, URLs, image limits, profile settings, and complete pool supply
5. checks any current creation-fee requirement before uploading anything
6. uploads the image and ERC-7572 metadata to IPFS
7. mines a token salt whose resulting address ends in `01`
8. confirms that the mined salt is still unused and builds a short-deadline `createLaunch` or `createLaunchAndBuy` call committed to the current configuration
9. adds required ERC-20 creation-fee or Dev Buy funding approvals to the exact spender
10. combines native Dev Buy input and any native creation fee in transaction value
11. simulates the final launch against the same observed chain block when all prerequisites are already satisfied
12. appends the same ERC-8021 builder attribution used by the Launchpad UI on Base

The API does not assume a fixed launch fee. Fee fields and approval steps come from the selected live contract and appear only when its current fee is nonzero.

Omit `dev_buy` for plain creation. Include it for atomic creation and purchase. The API simulates the complete create-and-buy call, derives the minimum output and rechecks the final signable transaction. If approvals are still needed, it returns those steps and a continuation instead of provisional launch calldata.

The returned transaction `value` covers the exact native creation fee and any native Dev Buy input. The wallet must still retain native currency for gas, and performs the final gas estimate before signing.

A normal launch creates two IPFS objects: the image and one ERC-7572 metadata JSON document that references that image. The individual metadata fields do not create separate uploads. `extra_metadata` is encoded in the launch transaction and normally remains empty unless the integration needs token-specific key-value data.

Images must be valid PNG, JPEG, WebP, or GIF data, match the declared MIME type, and decode to no more than 2 MB. Token descriptions are limited to 2000 UTF-8 bytes. Extra metadata accepts at most 16 unique keys and 4096 UTF-8 bytes in total.

## Supply and liquidity

The complete fixed supply is placed into permanent Uniswap v4 liquidity.

## Response and execution

The response contains:

* `prepared_at`, `expires_at`, and the chain block used for validation
* a normalized `review` of token settings, total supply, and pool supply
* the predicted `01` address, resolved contract configuration, metadata URI, and image URL
* a creation-fee object only when the live fee is nonzero
* ordered transaction `steps`, dependencies, and simulation state
* structured `issues`

An insufficient creation-fee balance returns `422 insufficient_balance` with `asset`, `actual_raw`, and `required_raw` before any image or metadata is pinned. When an ERC-20 fee approval is required, the launch step depends on that approval and is marked `simulation.status=not_run`. Submit the approval, wait for confirmation, then prepare again so the API can verify and simulate current state.

Use a unique `Idempotency-Key` for each logical launch preparation. Reusing it with a different body is rejected. An exact retry may replay the completed result while it remains executable; after its plan expires, it returns `409 stale_plan` and requires a new key.

Launch preparation is limited to 3 requests per API key each minute and 100 per day. Within each key, one creator can prepare once per minute and 25 times per day. Another API key cannot consume that creator counter. Completed idempotent retries return the saved response without repeating uploads or simulation.

## Arc launch amounts

Use `chain_id: 5042`, the `standard` market and an available ERC-20 USDC or cirBTC quote from `/config`. The USDC pool quote has six decimals, cirBTC has eight, and the native launch fee uses 18 decimals. For example, a 2-USDC launch fee is `2000000000000000000` in transaction `value`. The fee comes from the live factory configuration; do not hardcode it or pay it again through an ERC-20 transfer.

Ordinary creation seeds the pool with the launch token's supply and does not require a USDC liquidity deposit. Native and ERC-20 USDC share one balance, so leave enough for the launch fee and gas. For native-USDC Dev Buy, use 18-decimal funding amounts in multiples of `1000000000000`; held ERC-20 USDC uses six decimals. Leave enough of the shared balance for funding, creation fees and gas.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.