> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Manage a launchpad

> Change the earnings payout, launch rules, details, tokens, ownership and page of your launchpad.

Connect the wallet that owns the launchpad. Open the launchpad page, then use **Manage** or **Edit page**. The **My launchpads** tab of your profile lists the launchpads that your wallet owns.

**Manage** has five tabs: **Earnings**, **Launch rules**, **Details**, **Tokens** and **Ownership**. Some changes are onchain transactions. Other changes need only a wallet signature and cost no gas.

| Change | Tab | How you confirm |
| - | - | - |
| Owner fee claims and payout address | Earnings | Onchain transaction |
| Launch rules, allowlist, paired assets | Launch rules | Onchain transaction |
| Identity and launch guidelines | Details | Wallet signature |
| Hidden and pinned tokens | Tokens | Wallet signature |
| Ownership transfer | Ownership | Onchain transactions. See [Transfer a launchpad](https://docs.o1.exchange/launchpad/launchpads/transfer.md) |
| Page | Edit page | Wallet signature |

A signature starts an owner session of 30 minutes.

## Earnings

The **Earnings** tab shows the launchpad totals and your owner fees. You claim the owner share here. See [Earnings and burns](https://docs.o1.exchange/launchpad/launchpads/earnings.md).

Owner fees go to the payout address. Select **Change** to set a new address. At creation, it is the wallet that created the launchpad. The vault rejects the vault itself, the registry and the fee escrow as a payout address.

The tab also shows your owner share. Registration fixes it.

## Launch rules

The **Launch rules** tab sets the rules for new tokens. A change never changes an existing token.

| Rule | Options |
| - | - |
| Who can launch | **Anyone**, **Allowlist** or **Closed** |
| Allowlist | Paste wallet addresses. A smart wallet must use the address of its own account |
| Paired assets | **Any asset**, or **Only selected** with the assets that you select. At most 64 assets |
| Tax ranges | A range for the buy tax, the sell tax, creator funds, burn allocation, holder dividends and launchpad funds |
| Dividend threshold | A range for the dividend minimum, in tokens |

Drag the ends of a slider, or type a value. An empty box means no limit. **Use exact values** sets each range to one valid example tax.

The form checks that at least one valid Tax token can launch with your rules. When no token can launch, the form tells you which rule to change. The vault does the same check onchain.

Select **Save launch rules**. One transaction can add and remove up to 200 addresses in each list. A larger change needs more transactions, and the form shows the number. **Reset** discards changes that you did not save.

> [!NOTE]
>
> An empty allowlist with **Allowlist** admits nobody. **Only selected** with no selected asset admits no asset. Neither empty list turns its rule off.

To stop new launches at once, set **Who can launch** to **Closed**. The vault saves **Closed** without the tax check, so it always works.

## Details

The **Details** tab changes the name, logo, description and links. The URL never changes.

The name uses the token name length limit. The one-line description uses up to 160 characters. Links can use `http://` or `https://`. An X link must use `x.com`, and a Telegram link must use `t.me` or `telegram.me`. Both social links must include a path after the host.

**Launch guidelines** holds up to 2,000 characters. Creators see it when they launch a token on your launchpad. Select **Save guidelines**.

## Tokens

The **Tokens** tab hides, restores or pins the tokens on your launchpad.

* A hidden token does not show on your launchpad page. It still trades on o1.
* You can pin up to 10 tokens. The tab shows the number of pinned tokens. The **Pinned tokens** section shows them in pin order.
* The launchpad token always stays visible.

## Ownership

The **Ownership** tab proposes a new owner. After the new owner accepts, you can no longer manage this launchpad. See [Transfer a launchpad](https://docs.o1.exchange/launchpad/launchpads/transfer.md).

## Page editor

**Edit page** opens the editor. It saves drafts in your browser. **Publish** needs a wallet signature.

| Area | Options |
| - | - |
| Sections | **Hero**, **Token feed**, **Pinned tokens** and **Questions**. Up to 20 sections |
| Design | Presets, colors from your logo, fonts, corners, patterns and a background image |
| Layout | Layout templates. Your content stays when you change the layout |
| Preview | Desktop and 390 px phone width |

The text color must reach a 4.5:1 contrast ratio against the background. The editor shows **Auto-adjust** when it does not. A page holds up to 64 KB of content.

When another session publishes a newer version, the editor asks which version stays.

## When o1 pauses your launchpad

The registry owner or guardian can pause new token launches on one launchpad. **Manage** then shows a **Paused** badge and the notice **o1 paused this launchpad.** Existing tokens keep their trades. Your owner claims and the burn fund claims stay available.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.