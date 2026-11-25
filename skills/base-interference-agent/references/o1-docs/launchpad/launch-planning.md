> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Plan your launch

> Prepare the token identity, market pair, public profile, launch review, and post-launch communication.

o1 Launchpad creates a fixed-supply token and opens its permanent onchain market in one transaction. Before launching, prepare the token identity, select the market pair, decide whether its public profile can be updated, and review the market settings shown by the app.

## Built-in launch options

| Option | How it works | Best for |
| - | - | - |
| Token product | Standard fee sharing, or Tax on Base, Robinhood, BSC, Monad, X Layer, Arc and Elysium with configurable trading taxes, dividends and burns | Choosing the token's trading and reward model |
| \$O launches on Base and Robinhood | wstO-paired ERC-20 with immediate quote burns and no recipient allocations | A burn-only launch connected to \$O through its backing vault |
| Paired asset | Choose a supported crypto asset or Stock Token for the selected chain and product | Defining the market pair and the asset used for trading fees and claims |
| Profile editing | Optionally let the creator wallet update the token name, symbol, profile link, and extra information | Projects that expect their public profile to evolve |
| Fixed profile | Launch without profile editing permission | Projects that want token information fixed from launch |
| Social links | Publish website, X, Telegram, description, image, and extra metadata | Token discovery and profile context |
| Creator announcements | Post updates through the separate announcement contract | Public milestones and launch communications |
| Referral attribution | Attach a valid referrer to a Standard-token trade | Community and partner growth programs |
| Staking | Create a separate, fully funded reward vault after launch | Optional token reward programs |

## A practical launch flow

**1. Choose the market**

Select the chain, token product and paired asset. Crypto markets use a supported native currency, stablecoin or other crypto token; stock markets use a supported Stock Token. The paired asset determines the market and the currency used for recipient fees and dividends. Tax burns use the launched token; \$O launches burn the wstO paired asset instead.

**2. Prepare the token profile**

Choose the name, symbol, image, description, website, and social links that users will see. The image and public profile are stored on IPFS as part of the launch flow.

**3. Choose profile control**

Keep profile information fixed or allow the creator wallet to edit it. This choice never allows new tokens to be created, transfers to be paused, the token to be upgraded, or liquidity to be removed.

**4. Review the economics**

Confirm the selected pair, fixed supply, opening-price assumption, approximate FDV, permanent liquidity, current creation fee, trading taxes or fees, payout currency, and anti-sniping schedule shown by the application. New Arc Standard launches have no anti-snipe surcharge and pay the normal 1% fee from launch. The documented Standard settings on Base, Robinhood, Monad, BSC, X Layer and Elysium use a 20-second schedule. For Tax, review the creator-selected ordinary totals, post-protocol split, dividend minimum and optional protection described in [Tax tokens](https://docs.o1.exchange/launchpad/tax/overview.md). Earlier pools keep their frozen settings.

**5. Launch and communicate**

Sign from the creator wallet, wait for confirmation, then use the token page and announcement registry to share updates with the community.

## Supply and liquidity

Current launches create **1 billion tokens** and place the complete supply into one permanent Uniswap v4 liquidity position. The creator does not deposit the paired asset, cannot remove the position, and cannot mint more tokens later.

Tokens enter user wallets through trading. Staking is a separate optional product for tokens already held in a wallet and does not change the launch supply or liquidity position.

## After launch

* share the confirmed token address and market link;
* use creator announcements for public updates;
* monitor trading, holders, liquidity, and claimable fee balances;
* use referrals for eligible Standard-token trades;
* for Tax tokens, claim earned dividends or send collected burn-tax tokens to the dead address;
* for \$O launches, follow the token page's confirmed wstO burn total; there is nothing to claim or burn manually;
* optionally create a separate staking vault with its complete reward budget funded in advance.

## Before you launch

* verify the selected network and paired asset;
* review the token name, symbol, image, description, and public links;
* enable profile editing only when ongoing updates are needed;
* check the opening-price assumption, approximate FDV, permanent liquidity, current creation fee, fee currency, and fee split;
* confirm any creator payout recipient and product-specific attribution; \$O launches have neither fee allocations nor a payout recipient;
* open the final transaction details in the wallet before signing;
* publish the confirmed token address and pool after confirmation.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.