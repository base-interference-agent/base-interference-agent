> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Fee claims

> Claim creator fees and X fee shares, understand receiving accounts, and keep holder dividends separate.

Swap fees remain available until they are claimed. One inactive recipient cannot block swaps, launches, or anyone else's claim.

Tax creator and partner earnings are also claimed from **Profile > Fees**. **Holder dividends are separate**: use [Dividends](https://docs.o1.exchange/launchpad/tax/dividends.md) to claim your earned rewards. [Token burns](https://docs.o1.exchange/launchpad/tax/burns.md) send collected tokens to the dead address.

**[\$O launches](https://docs.o1.exchange/launchpad/wsto/overview.md)** have no fee claims or dividends. Their wstO fees are destroyed in each successful swap, so there is no collected balance or manual burn action. A profile can still show claims earned from that wallet's other Standard or Tax launches.

## Creator fees and X fee shares

On Base, **Profile > Fees** separates:

* **Creator fees:** fees earned by your wallet or its supported o1 Bot account as creator, including unpaid credit from a creator position you previously held.
* **X fee shares:** fees allocated to your permanent X ID by token creators. These are independent of who launched the token and do not require Bot launch permission.

Connect X to find your fees or register your receiving account. Already-linked accounts can appear automatically. You must control the receiving account to claim; knowing its address or an X ID is not permission to collect fees.

X-fee vault claims use `claimX(xId)` from the bound account or `claimCreator()` from the entitled creator account. They pay the vault's fixed quote asset. If payment reaches a Smart Account, moving that balance to its owner wallet is a separate owner-authorized transfer. Registration disablement does not stop existing claims.

See [Share creator fees](https://docs.o1.exchange/launchpad/trading/share-creator-fees.md) for first-time registration, permanent-link consent, historical creator earnings and recovery. The direct FeeEscrow methods below describe ordinary recipient balances; redeeming a vault's escrow credit only funds the vault and does not distribute its split by itself.

## Fee claims

The connected wallet's Profile page groups available balances by paired asset, including ETH, MON, BNB, OKB, USDC, USDG, supported Coinbase crypto majors, and supported Stock Tokens. Its **Claim** action always pays the recorded recipient.

| Contract option | Who may start it | Destination |
| - | - | - |
| `claimFor` on a current fee contract, or the equivalent function on the fee contract recorded for an earlier launch | Anyone | Always the recorded recipient |
| `claimTo` | The balance owner through a direct contract interaction | An address chosen by that owner |

Claims pay the same paired asset used by the launch market. A USDC market pays USDC fees, a USDG market pays USDG fees, an ETH market pays ETH fees, an OKB market pays native OKB fees, a HYPE market pays native HYPE fees, a crypto-major market pays its selected asset, such as a Coinbase wrapped token or Arc cirBTC, and a stock-paired market pays its selected Stock Token.

## Profile overview

The connected Profile page groups:

* claimable hook-fee balances by asset;
* referral activity and attributed trades;
* the wallet's launches and supported management tools.

Standard creator/referral earnings and Tax creator/protocol/integrator earnings are claimed from **Profile > Fees**. **Profile > Referrals** shows attributed trade counts, hook-fee volume, and recent referral activity; it is not the claimable-balance view.

Wallet Activity shows indexed claim transactions. Profile views may briefly sync after confirmation; the contracts remain authoritative.

## Currency handling

> [tab] Native currency
>
> The app claims native ETH (Base/Robinhood), BNB (BSC), MON (Monad), or OKB (X Layer) directly to the destination.

> [tab] Token pair
>
> The app claims the exact ERC-20 used by that launch pool. This can be USDC, USDG, cirBTC, another supported crypto quote, or a supported Stock Token. Developers should use the pool's recorded quote address and can verify current assets in [Production contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md) and [Stock-paired launches](https://docs.o1.exchange/launchpad/create/stock-paired-launches.md).

On X Layer, fees and claims use the pool's paired currency: native OKB, USDC, xETH or a wrapped stock token. USDC uses 6 decimals; the other catalog quotes use 18. Native OKB pays transaction gas. Claims from an existing pool always retain that pool's recorded currency, even if its quote is later removed from new creation.

On Elysium, fees and claims use the pool's paired currency: native HYPE or USDC. USDC uses 6 decimals and HYPE uses 18. Native HYPE pays transaction gas.

Developers can find the exact read and claim functions in [Functions and events](https://docs.o1.exchange/launchpad/reference/events-functions.md).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.