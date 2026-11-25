> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Migrated and Deprecated Products

> Find where retired, moved, and renamed Base products went, including OnchainKit, MiniKit and mini apps, the Base Account SDK, Base MCP, Basenames, and Base App.

Several products and guides that Base docs used to cover are now retired, documented elsewhere, or renamed. Find the product below to see its status and where to go now. Older links to these products redirect to the matching section on this page.

| Product | Status | Where to go now |
| - | - | - |
| [OnchainKit](#onchainkit) | Retired | [wagmi](https://wagmi.sh), [viem](https://viem.sh), and [Coinbase Developer Platform](https://docs.cdp.coinbase.com) |
| [MiniKit and mini apps](#minikit-and-mini-apps) | Retired | A standard web app, registered on the [Base Dashboard](https://dashboard.base.org) |
| [Base Account SDK and Smart Wallet](#base-account-sdk) | Moved | [Coinbase Wallet SDK](https://docs.cdp.coinbase.com/coinbase-wallet/overview) on Coinbase Developer Platform |
| [Base MCP](#base-mcp) | Moved | [Wallet MCP](https://docs.cdp.coinbase.com/ai-agents/coinbase-for-agents/wallet-mcp) on Coinbase Developer Platform |
| [Basenames](#basenames) | Docs moved | [Basenames FAQ](https://docs.cdp.coinbase.com/coinbase-wallet/basenames/basenames-faq) on Coinbase Developer Platform |
| [Base App](#base-app) | Renamed | [Coinbase Wallet](https://wallet.coinbase.com) |

## Retired

### OnchainKit

OnchainKit (`@coinbase/onchainkit`) was a React component library for onchain apps, with wallet, transaction, swap, fund, checkout, and identity components and the MiniKit hooks for mini apps.

**Status:** Deprecated and no longer maintained. The [GitHub repository](https://github.com/coinbase/onchainkit) is archived, and there is no replacement library.

**Where to go now:**

* Build wallet connection, reads, and transactions directly with [wagmi](https://wagmi.sh) and [viem](https://viem.sh).
* Use [Coinbase Developer Platform](https://docs.cdp.coinbase.com) for services that OnchainKit components wrapped, such as [Paymaster](https://docs.cdp.coinbase.com/paymaster/introduction/welcome) gas sponsorship.

### MiniKit and Mini Apps

Mini apps were Farcaster-style apps that ran inside Base App, built with MiniKit, a manifest, and the mini app SDK.

**Status:** Sunset. Base App, now [Coinbase Wallet](#base-app), supports standard web apps in its in-app browser, so your app or site does not need a manifest, MiniKit, or any other special integration to work there.

**Where to go now:**

* Build a standard web app with [wagmi](https://wagmi.sh) and [viem](https://viem.sh).
* To have your app listed in the app, register it on the [Base Dashboard](https://dashboard.base.org).
* The Farcaster mini app specification is maintained at [miniapps.farcaster.xyz](https://miniapps.farcaster.xyz).

## Moved

### Base Account SDK

The Base Account SDK connected apps to smart-contract wallet accounts for sign-in, payments, gas sponsorship, and spend permissions. Older Smart Wallet guides also point to this section.

**Status:** The documentation moved to Coinbase Developer Platform as the Coinbase Wallet SDK. The package is still `@base-org/account`, and Coinbase Developer Platform recommends it until the next-generation Coinbase Wallet SDK is ready.

**Where to go now:** Use the [Coinbase Wallet SDK documentation](https://docs.cdp.coinbase.com/coinbase-wallet/overview).

### Base MCP

Base MCP was an MCP server that connected an AI assistant to a user's wallet to check balances, send funds, swap tokens, and sign messages.

**Status:** The documentation moved to Coinbase Developer Platform, where the product is now called Wallet MCP.

**Where to go now:** Use the [Wallet MCP documentation](https://docs.cdp.coinbase.com/ai-agents/coinbase-for-agents/wallet-mcp).

> [!NOTE]
>
> Wallet MCP is a different product from the Base docs MCP server at `https://docs.base.org/mcp`, which gives AI assistants search access to these docs. See [Base docs MCP](https://docs.base.org/get-started/docs-mcp.md).

### Basenames

Basenames are onchain names on Base, such as `yourname.base.eth`.

**Status:** The product is live. Its documentation moved to Coinbase Developer Platform.

**Where to go now:**

* Register or manage a name at [base.org/names](https://www.base.org/names).
* Read the [Basenames FAQ](https://docs.cdp.coinbase.com/coinbase-wallet/basenames/basenames-faq) on Coinbase Developer Platform.

## Renamed

### Base App

Base App is the consumer app for Base.

**Status:** Renamed to Coinbase Wallet. The app is not retired.

**Where to go now:** Get the app at [wallet.coinbase.com](https://wallet.coinbase.com) and find support in the [Coinbase Wallet help center](https://help.coinbase.com/en/wallet). Its mini app guides are covered in [MiniKit and mini apps](#minikit-and-mini-apps).

## Retired Protocol Features

Flashblocks were retired when the Denim upgrade activated. To move an integration to 200ms native blocks, see [Migrate From Flashblocks](https://docs.base.org/upgrades/denim/migrate-from-flashblocks.md).
