> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# X commands

> Copyable o1 Bot V1 launch instructions, supported fields, corrections, and stop behavior.

o1 Bot interprets launch instructions in Posts that mention **@o1\_bot**. Use the labeled format below to make your intent clear. It is not a general-purpose trading assistant or a slash-command interface.

## Command overview

| Intent | Example | Result |
| - | - | - |
| Launch | `@o1_bot Launch on Base` plus the required fields and image | Prepare and submit a supported token launch |
| Launch with a purchase | Add `Dev Buy: 0.001 ETH` to a complete launch request | Create and buy atomically, if eligible and funded |
| Ask for guidance | `@o1_bot help` or `@o1_bot template` | Launch guidance or setup instructions, depending on eligibility |
| Correct an awaiting request | Reply to its prompt with `@o1_bot Symbol: FIX` | Update that request, rather than start another launch |
| Opt out | `@o1_bot stop` | Stop accepting future launch requests from that X identity |

## Buy, sell and withdraw guidance

These messages ask for directions only. **They do not authorize or execute a trade or withdrawal.**

| Message | Reply behavior |
| - | - |
| `@o1_bot buy more` | Explains that X buys are unsupported and Dev Buy is launch-only; links to the token page when the reply context can be verified |
| `@o1_bot sell it` | Explains that X selling is unsupported; points to the portal and, when verified, the token page for manual trading |
| `@o1_bot withdraw` | Links to the portal to withdraw to the bound Owner wallet, which signs and pays gas |

For a token-specific link, reply directly to **your own launch's Bot success message** or its original launch Post. The launch must be confirmed. The Bot does not select the latest token in the conversation or guess a token from an unrelated reply, another creator's launch, or an explicit different target. Without verified context, it gives general instructions instead.

These standalone guidance requests do not consume an active launch's correction attempts or cancel it. Reply rate limits and opt-out still apply. “Nothing submitted for this request” refers only to the guidance message, not to any earlier pending launch.

## Launch template

Attach exactly one supported image to this Post:

```text theme={null}
@o1_bot Launch on Base
Name: My Token
Symbol: MYTOKEN
Quote: ETH
Description: A community token.
```

Explicitly include **Base**, even if Base is selected in the portal. A portal chain selection is not part of your X instruction.

### Fields

| Field | V1 behavior |
| - | - |
| Chain | Required. Use `Launch on Base` or `Chain: Base` |
| Name | Required, up to 50 characters |
| Symbol | Required, up to 11 characters, no spaces; casing is preserved |
| Image | Exactly one attached PNG, JPG or WEBP photo, up to 2 MB and 4,096 pixels per dimension |
| Quote | Optional; defaults to ETH. Include it explicitly in your Post |
| Description | Optional, up to 2,000 UTF-8 bytes |
| Website, X, Telegram | Optional explicit links; not inferred from your author profile |
| Metadata | Optional `editable` or `immutable`; Bot requests default to **editable** |
| Dev Buy | Optional exact positive ETH amount, such as `Dev Buy: 0.001 ETH`. See [Dev Buy](https://docs.o1.exchange/launchpad/bot/dev-buy.md) |

An image URL, video, GIF or multiple-image Post is not a substitute for the single attached photo. The Bot validates the image it receives from X.

The V1 crypto quote allowlist includes **ETH, USDC, cbBTC, cbDOGE, cbXRP, cbLTC, cbADA, cbMEGA, cbZEC, cbHYPE, VVV, AERO and MORPHO**. A quote must also be registered and available when the request executes. This list does not guarantee live availability.

> [!WARNING]
>
> The Bot's default metadata mode is editable, unlike the web create form's immutable default. To prevent later profile edits, explicitly include `Metadata: immutable`. Profile editing does not grant minting, balance control or liquidity removal.

### Optional public profile

Add only the fields you want published:

```text theme={null}
Website: https://example.com
X: https://x.com/your_project
Telegram: https://t.me/your_project
Metadata: immutable
```

Extra public metadata can contain up to 16 key/value pairs. Keys must be unique and use 1–64 UTF-8 bytes; each value can use up to 512 bytes, with a 4,096-byte combined budget. Never put passwords, private keys or other secrets in public metadata.

## Replies and corrections

* A standalone Post or a reply can request a launch. Explicitly mention **@o1\_bot**. Do not rely on a repost or quote Post to trigger processing.
* Multiple independent launches can share a conversation. Start each with a complete new launch instruction and its own fields and image.
* A new launch does not reuse an earlier launch's details, including its Dev Buy amount.
* If the Bot asks for missing information in a launch you already requested, reply directly to that prompt or the awaiting request from the same X account. For example: `@o1_bot Symbol: FIX` supplies a missing symbol; it is not a complete launch request.
* A `help` or `template` reply contains example values, not your saved launch parameters. Copy the template into a complete launch Post, replace the fields and attach your image. Sending only `Symbol: FIX` does not adopt the Bot's example name, chain or image.
* Each request allows up to three classified user Posts and at most two guidance or correction replies. If it is closed without submission, start a complete new request.
* Processing and uncertain submissions are not invitations to retry. Check the existing request's result first.

> [!NOTE]
>
> Known V1 limitation: `help` and `template` can share the same request and consume this reply budget. If the third classified Post still does not form a valid launch, the request closes without another reply. For example, `help` → `template` → `Symbol: FIX` can end silently. This differs from the standalone buy, sell and withdraw guidance above. Silence alone is not proof that a transaction failed; check request status before retrying.

## Stop future requests

Send a standalone command:

```text theme={null}
@o1_bot stop
```

`unsubscribe`, `opt out` and `opt-out` are also recognized standalone opt-out commands.

> [!WARNING]
>
> Stop is a persistent opt-out tied to your X identity, not a way to correct or cancel one launch. It does not undo a submitted transaction or revoke onchain permissions. V1 does not document a self-service X resume command. To revoke signing access, use the portal's [permission controls](https://docs.o1.exchange/launchpad/bot/permissions.md).

## Outside V1

X commands do not support ordinary swaps, standalone buys or sells, deposits, withdrawals, fee claims, permission changes, custom supply, allocations, vesting, Tax settings, stock pairs or non-Base launches. Gas settings, signer selection, contract addresses and Dev Buy slippage are not user-configurable commands.

Smart-account launch requests are limited to **5 per hour and 10 per day**. Recorded requests that fail can still count toward those limits. Additional service and abuse-prevention limits may apply.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.