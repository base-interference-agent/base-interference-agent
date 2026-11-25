> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# Onramp mobile and web demo apps

[Mobile Repo](https://github.com/coinbase/onramp-v2-mobile-demo)

## Overview

Enable users to easily fund their crypto wallet. These demo apps will get you up and running with a basic Onramp API integration for mobile or web.

<video autoPlay loop muted playsInline src="https://github.com/user-attachments/assets/e57f32fc-fb19-4761-ac6e-a42701973e58" />

## Mobile demo app (v2)

A React Native + Expo mobile app demonstrating Coinbase's Onramp v2 API with CDP Wallets, Apple Pay integration, and real-time push notifications.

The app uses Smart Accounts (ERC-4337) for all EVM transactions and supports [gasless transfers](https://docs.cdp.coinbase.com/paymaster/introduction/welcome.md) for USDC, EURC, and cbBTC on Base. API keys are never exposed to the client (a secure backend proxy handles all CDP API calls).

### Try it now

> [card] [View source code](https://github.com/coinbase/onramp-v2-mobile-demo)
>
> Clone the repo and run it locally

### Features

| Feature | Description |
| - | - |
| **Embedded Wallet** | Automatic wallet creation via CDP with EOA and Smart Account support |
| **Apple Pay** | Native iOS payment experience for seamless purchases |
| **Coinbase Widget** | Opens in the default browser for additional payment options |
| **Multi-Network** | EVM (Base, Ethereum) and Solana networks supported |
| **Push Notifications** | Real-time transaction status updates via webhooks |
| **Gasless Transfers** | Free USDC, EURC, and cbBTC transfers on Base via Paymaster |
| **Transaction History** | Complete purchase tracking |
| **Sandbox Mode** | Test purchases without real money |

## Web demo app

A Next.js application demonstrating both Onramp and Offramp integration with multiple UI options: pre-built Fund Card component, custom integration with full control, or native Apple Pay with iframe embedding. All API calls use secure session tokens—credentials are never exposed to the client.

### Try it now

> [card] [View source code](https://github.com/coinbase/onramp-demo-application)
>
> Clone the repo and run it locally

### Features

| Feature | Description |
| - | - |
| **Onramp** | Purchase crypto with fiat via card, bank, Apple Pay, and more |
| **Offramp** | Cash out crypto to fiat (requires Coinbase account with linked bank) |
| **Apple Pay** | Native Apple Pay experience with embedded iframe |
| **Multiple Integrations** | Fund Card component, custom UI, or Apple Pay flow |
| **Session Tokens** | Secure server-side initialization for production apps |
| **Global Coverage** | Multiple countries, currencies, and payment methods |
