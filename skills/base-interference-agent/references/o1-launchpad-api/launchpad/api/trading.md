> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Quote and prepare trades

> Quote exact-input trades and prepare wallet transactions with the configured router.

The trading API supports exact-input buys and sells against the token's own Uniswap v4 launch pool.

Buys and sells can use the pool quote or a supported alternative payment/receipt asset. Read `swap_settlement_tokens` for the quote in `/config`, then send `settlement_token` to select one. **\$O launches support ETH, \$O and wstO on both chains, plus USDC on Base or USDG on Robinhood.** The API builds and validates the complete route; caller-supplied targets and arbitrary route data are not accepted.

## Quote

`POST /swaps/quote`

```json theme={null}
{
  "chain_id": 4663,
  "wallet": "0x1111111111111111111111111111111111111111",
  "token_address": "0x2222222222222222222222222222222222222201",
  "side": "sell",
  "amount_in_raw": "1000000000000000000",
  "slippage_bps": 50,
  "referrer": "0x3333333333333333333333333333333333333333",
  "comment": "API trade"
}
```

`amount_in_raw` uses the input currency's base units: the selected payment asset for a buy and launch-token units for a sell. `settlement_token` selects the buy's payment currency or the sell's receipt currency; omission preserves settlement in the pool's paired asset. Native currency uses the zero address. Slippage uses basis points, where 1 bps is 0.01%; `50` means 0.5%, `100` means 1%, and the maximum is `4999`.

The API resolves the contracts recorded for the token, including its pool key, hook, paired asset, tick spacing, router and its quoting and approval requirements. It does not guess from `tx.to` or use only the latest factory.

For Standard tokens, the optional referrer is preserved through quote and preparation and encoded in the same hook data used by the Launchpad app. It must be a separate eligible wallet, not zero, the trader, creator, platform treasury, or router. Invalid choices return `422 invalid_referrer`; valid referrals accrue their fee share in FeeEscrow and claim it through `POST /claims/fees/prepare`.

The response contains:

* signed `quote_id` and expiry
* `prepared_at` and the chain block used for all quote, balance, and allowance reads
* input and output currencies
* expected and minimum output
* estimated quote gas when returned; a missing estimate is not a zero gas cost
* a normalized `review` of the exact route, amounts, slippage, referrer, and comment
* balance and allowance issues
* ERC-20 approval transactions for the spender required by the selected router
* Permit2 typed data when the selected route requires it

## Tax-token trades

The token's recorded suite selects inclusive Tax decoding automatically; do not replace its Hook or charge protocol again on top of the selected total. Quotes include current ordinary taxes, burn settlement and any active anti-sniping surcharge. Supported alternative settlement routes wrap the same launch-pool trade without changing its frozen tax policy. Dev Buy is prepared through the separate [launch endpoint](https://docs.o1.exchange/launchpad/api/launches.md#atomic-dev-buy).

A swap-level `referrer` does not earn financial referral fees for inclusive Tax tokens. Integrator attribution is fixed at launch; ordinary comments remain supported. Quote and launched-token burn amounts have different currencies and must not be summed as raw fee units. Approvals follow the returned route and are unrelated to approval-free Dividend claims.

## \$O launch trades

Use the launched token's address on the requested chain, not the wstO vault as `token_address`. Select `settlement_token` from that chain's assets.

### Base (`8453`)

| Asset | Address | Decimals |
| - | - | -: |
| Native ETH | `0x0000000000000000000000000000000000000000` | 18 |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | 6 |
| \$O | `0x182FA643E5f29d5EcA75e7b9CF9336A3fe4620b2` | 18 |
| wstO | `0x80C6BAE89B636c6Ee96FE8F198c0D6926C2C91df` | 18 |

### Robinhood (`4663`)

| Asset | Address | Decimals |
| - | - | -: |
| Native ETH | `0x0000000000000000000000000000000000000000` | 18 |
| USDG | `0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168` | 6 |
| \$O | `0x500A02a20B0B0A3F3efCCFc0559543F5743bd1C4` | 18 |
| wstO | `0xE92bD1C05E4E308792003C8205127A6FA662b4D4` | 18 |

Robinhood ETH routes pass through WETH/USDG v3 and \$O/USDG v4; USDG routes start at the latter pool. Both then use the local vault and launch pool. Sells reverse the selected route. These are exact-input routes, with a whole-route minimum in the final asset.

For example, an ETH buy uses `side: "buy"`, the zero-address `settlement_token` and an ETH amount in wei. A USDC sell on Base or USDG sell on Robinhood uses `side: "sell"`, that stablecoin's `settlement_token` and an input amount in launched-token units. Minimum output is always in the final receipt asset.

The pool stays paired with wstO. The full quote includes acquisition-pool costs, the actual vault conversion and the pool's wstO burn. Sells redeem net wstO after its fee burn. Do not send `referrer` for this product; it has no financial referral allocation. Comments remain supported. Fund the quoting wallet for the selected route and follow the returned spender and approval steps.

## Actionable issues

A valid request can return HTTP 200 with:

```json theme={null}
{
  "code": "erc20_allowance_required",
  "severity": "action_required",
  "asset": "0x...",
  "spender": "0x...",
  "actual_raw": "0",
  "required_raw": "1000000",
  "remediation_step_id": "approve-input-token"
}
```

`blocking` means funds or state must change. `action_required` points to a provided step. `warning` is reviewable but does not stop preparation.

## Prepare

`POST /swaps/prepare` accepts the reviewed `quote_id`, wallet, and optional Permit2 signature.

The API:

1. verifies the quote signature, wallet binding, and expiry
2. verifies current input balance and the selected router's approval requirements
3. requotes the exact route
4. rejects a price move beyond the reviewed minimum
5. uses the stricter valid minimum
6. validates the deadline and any required Permit2 nonce and signature
7. builds calldata for the exact chain, suite and route, including SwapX conversion/vault routes or Universal Router direct routes as appropriate
8. appends ERC-8021 builder attribution on Base
9. simulates the exact transaction from the expected wallet

The prepare response shows reviewed, refreshed, and execution-minimum amounts together. An expired or moved quote returns `409 stale_quote`, an unconfirmed ERC-20 approval returns `409 approval_not_confirmed`, and changed Permit2 state returns `409 invalid_permit`. A missing required Permit2 signature returns `400 invalid_request`. Arc does not use Permit2; supplying a Permit2 signature to Arc preparation returns `409 stale_quote`. An unavailable route or failed simulation returns a specific `422` problem.

The wallet must submit the returned `to`, `data`, and `value` unchanged before expiry. `value` is the exact swap value, not a gas budget; the wallet must retain additional native currency for gas.

> [!WARNING]
>
> Exact-output swaps are not exposed. Standard/Tax hooks reject exact-output execution while a pool's surcharge window is active. New Arc Standard pools have no active surcharge window, but this API still exposes exact-input swaps only.

## Monad settlement scope

Use `chain_id: 143`. Direct trades settle in the paired MON, USDC, WETH or wrapped xStock. Supported conversion routes also allow native MON settlement for configured ERC-20 pairs, and MON or USDC settlement for wrapped xStock pairs through the hook-free Uniswap v4 USDC/wrapper pools; use the quote's `swap_settlement_tokens`. Native MON needs transaction value, while ERC-20 inputs use the returned approval requirements. WMON is routing infrastructure, not a registered quote.

## Arc settlement and approvals

Use `chain_id: 5042`. Direct USDC-paired buys spend six-decimal ERC-20 USDC and receive the launched token; sells receive ERC-20 USDC. For a cirBTC pair, direct API trades use eight-decimal cirBTC instead. Resolve Standard or Tax from the token's originating suite. For a USDC-paired buy, `amount_in_raw: "1000000"` means 1 USDC. The API trades through the exact launch pool using SwapX, with `value: "0"` and no Permit2 signature, wrapper or USDC-to-itself swap.

Quotes simulate execution against the funded wallet and measure the recipient's output balance change. Insufficient input funds or a failed route simulation returns `422 quote_unavailable`. A quote cannot substitute for funding the wallet first.

If approval is needed, the response approves the exact input amount to the configured SwapX router. A nonzero insufficient allowance includes a zero-reset step first; follow `depends_on` and wait for confirmations before preparation. Preparation refreshes the quote, verifies the confirmed allowance and preserves at least the reviewed minimum output. Approval can remain if the wallet approves but does not execute the swap.

Native USDC pays gas with 18-decimal units and ERC-20 USDC uses six decimals, but both access the same balance. Leave enough USDC for gas rather than treating the two balances as separate funds. For alternative settlement, use only the assets advertised for that quote. Do not substitute native-USDC raw amounts for ERC-20 USDC amounts. Atomic Dev Buy uses the separate [launch endpoint](https://docs.o1.exchange/launchpad/api/launches.md#atomic-dev-buy).

## BSC trading

Use `chain_id: 56`. BSC supports Standard and Tax pools through the configured SwapX router. Use the returned transaction steps: BSC's ten-field route tuple differs from Arc and Base/Robinhood routes. Native BNB uses transaction value; Binance-Peg USDC and bStocks use their ERC-20 units and approvals. Binance-Peg USDC has **18 decimals**, not six.

API swaps can settle in the paired asset or an admitted acquisition-route asset from `/config`. The preparation checks the complete route, including external pool fees, input funding and final output. Native BNB Dev Buy is prepared through the launch endpoint.

## X Layer trading

Use `chain_id: 196` and the token's originating suite. The updated SwapX binding admits both minimal-v4 and Tax through an explicit Hook allowlist; unknown Hooks reject before executable calldata is prepared. Use the originating suite's pool and retain route validation, spender checks and final simulation. The [router review](https://docs.o1.exchange/launchpad/reference/production-contracts.md#swapx-router-upgrade-review) records scoped fork evidence; each requested amount still requires a successful route simulation. Native OKB Dev Buy uses the launch endpoint.

## Elysium trading

Use `chain_id: 99901` and the token's originating suite. Elysium Standard and Tax pools trade through the SwapX router `0x37DfD6117fcf065eda0B55D8547A78F8B2221987`, which admits both Hooks through an explicit allowlist and uses the standard eight-field deadline interface. Native HYPE uses transaction value; USDC (six decimals) and token sells use ERC-20 units and approvals of the listed router. There is no Universal Router or Permit2 binding, so alternative settlement returns `unsupported_operation`. Each requested amount still requires a successful route simulation. Dev Buy uses the launch endpoint.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.