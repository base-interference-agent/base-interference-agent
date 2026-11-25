> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Auctions

> The current creator can auction creator rights on Base, Robinhood Chain, Monad, BSC, X Layer, and Arc. The highest bidder receives future creator fees.

The OTC marketplace lets the current creator of an o1 Launchpad token auction those creator rights. In the app this market is **Auctions**.

Open [Auctions](https://launch.o1.exchange/auctions) after you switch your wallet to the token's network.

> [card] Creator rights
>
> The winning bidder receives future creator fees, supported profile editing, announcements, and the right to transfer those rights again.

> [card] The token stays put
>
> A winning bid does not move token balances or the permanently locked Uniswap liquidity.

> [card] The pool keeps trading
>
> Buys and sells continue through the auction. Settlement does not pause the market.

> [card] Paid in the chain's native token
>
> Auctions run on Base, Robinhood Chain, Monad, BSC, X Layer, and Arc. Bids, refunds, and sale proceeds use that chain's native token.

## What the auction sells

The current creator is selling the rights attached to that role:

* Future creator fees from trades after the rights move.
* Editing supported profile information, where the launch allows edits.
* Publishing announcements.
* Transferring the rights again later.

Token balances, supply, trading-fee rates, and the permanent liquidity lock stay as they are. The original creator remains part of the launch history. Fees already credited to a recipient stay with that recipient until they are claimed. See [Fee claims](https://docs.o1.exchange/launchpad/trading/claims.md).

## Auctions and community takeovers

| | Auction | Community takeover |
| - | - | - |
| Who starts | The token's current creator | A community applicant |
| How it completes | Onchain bids, then settlement | Application, review, then an admin transaction |
| What you pay | A bid in that chain's native token | The card application fee shown on the form |

To request a reviewed reassignment, use [Community takeover](https://docs.o1.exchange/launchpad/takeover.md).

## Availability

| Property | Current support |
| - | - |
| Network | Base, Robinhood Chain, Monad, BSC, X Layer, and Arc |
| Bid currency | ETH on Base and Robinhood Chain, MON on Monad, BNB on BSC, OKB on X Layer, and native USDC on Arc |
| Who can list | The current creator of an eligible token |
| Market | [Auctions](https://launch.o1.exchange/auctions) |

> [!NOTE]
>
> **Which tokens can be listed?** Your wallet must be the token's current creator, and the token must come from the current Standard or Tax factory on its chain. On Base, child tokens launched through Launchpad of Launchpads can also be listed. \$O tokens (paired with wstO) and tokens from older launch contracts cannot be auctioned. If a token does not appear when you start an auction, it cannot be auctioned here.

One token can have one auction in progress. When that round ends, the current creator can start another. The list shows the current round.

The page has three views: **Market** for listings, **Selling** for auctions you started, and **Bidding** for auctions you have bid on.

## Start an auction

**Start auction** is on the Auctions page. The current creator can also start from the token page when that token has no auction in progress.

**1. Select a token**

Search by symbol, name, or address. The list includes tokens whose creator rights your wallet holds. A token that already has an auction in progress stays hidden.

**2. Set the reserve and duration**

The first bid must reach the reserve. The form can suggest a reserve from recent creator fees, and it offers duration choices. The clock starts when the auction starts.

**3. Review and start**

Check the amount you receive at the reserve, the expected end time, and the platform fee and minimum raise shown for this listing. Those values lock to this auction when it is created. Starting sends two wallet transactions: lock the creator rights, then deploy this listing's Vault and start the auction. Each transaction also pays network gas in that chain's native token.

> [!WARNING]
>
> If the lock confirms and the start does not, creator fees from before the auction starts go to the protocol. Return to the listing and choose **Resume start**. The reserve and duration are already fixed.

After the auction is live, and before a valid bid, the seller can choose **End auction** and reclaim the rights. After a valid bid, the seller cannot end the auction. The deadline does not extend. Token details and announcements stay frozen until the auction ends.

## Fees during the auction

From the moment the auction starts until it is settled, new creator fees from this token go into that listing's Vault. They go to the winner when the auction ends. They do not keep going to the seller.

On a Tax token, the Vault receives the creator-funds share only. Holder dividends, token burns, and any launchpad share do not enter the auction.

Fees already credited before the auction stay with their existing recipient. If the rights are locked but the auction has not started yet, creator fees from that gap go to the protocol.

## Bid and settle

The first bid pays its full amount and must reach the reserve. Each later bid must reach the minimum next price shown on the listing. The current leader cannot bid again.

An outbid bidder can withdraw the refundable balance, or bid again and apply that balance first. The wallet then sends only the difference.

When the deadline has passed, anyone can choose **Settle now**. Creator fees continue to accrue until that settlement transaction confirms.

| Result | What happens |
| - | - |
| A valid bid | The winner receives the creator rights. The seller can claim the winning price minus this listing's platform fee. |
| No valid bid | The seller reclaims the creator rights. |

## Claims

Proceeds, rights, and refunds are separate claims. You can complete them in any order.

| Who | Action |
| - | - |
| Seller, after a sale | Claim the sale proceeds in that chain's bid currency |
| Winner | Confirm two wallet transactions to transfer the creator rights into your wallet, and claim the creator fees accrued during the auction |
| Seller, when the auction ends with no buyer | Reclaim the creator rights |
| Outbid bidder | Withdraw the refundable bid balance |

After both transfer confirmations, creator actions on the token page belong to the winner's wallet.

**Profile** lists unfinished auction actions under Auctions. Open a row to return to that auction.

Creator fees accrued during the auction are separate from fees already credited in fee escrow. See [Fee claims](https://docs.o1.exchange/launchpad/trading/claims.md).

## Aborted auctions

If creator rights move away from the auction while it is still open, the auction is aborted. Bidders can withdraw the balance that did not win. Creator fees already held in the Vault stay with the original seller. Moving the rights after the sale does not refund the winning bid.

## Tokens with shared creator fees

On Base, a token launched with [Share creator fees](https://docs.o1.exchange/launchpad/trading/share-creator-fees.md) keeps its creator share in a fee vault. Its auction sells that **creator position**: the buyer receives the creator controller and the creator's percentage of future creator fees. The X allocations and their percentages stay unchanged. Creator fees earned during the auction go to the buyer when the sale completes, or back to the seller if it ends without a sale. A 0% creator position cannot be auctioned. These listings are marked **X fee** in the market and use the same reserve, minimum raise, platform fee, and native-token bids. When new creator-position listings are closed, existing auctions can still be settled and withdrawn.

## What auctions do not support

Auctions have no buy-now price, a designated buyer, or private negotiation. A seller cannot cancel after a valid bid, and the end time does not extend. Bids use that chain's native token. On Arc, bids use 18-decimal native USDC. The six-decimal ERC-20 USDC used as an Arc pool quote cannot be used to bid. The auction does not pause the token's pool.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.