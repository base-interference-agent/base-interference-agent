# blog/base-account-sdk

Source: https://www.base.org/blog/base-account-sdk.md

# Introducing the Base Account SDK

> TL;DR The Base Account SDK is the next evolution of the Coinbase Wallet SDK. It delivers Sign in with Base and Base Pay, universal sign on and payments for the open internet.

- Date: 2025-07-16
- Author: Wilson Cusack
- URL: https://www.base.org/blog/base-account-sdk

TL;DR The [Base Account SDK](https://github.com/base/account-sdk) is the next evolution of the Coinbase Wallet SDK. It delivers Sign in with Base and Base Pay, universal sign on and payments for the open internet.

## What is Base Account?

Base Account is the onchain account and identity layer powering the new Base app. Onchain, it’s built on our Smart Wallet platform and Basenames. Offchain, Base Account provides a private and secure place to store personal information like name, email, phone number, and shipping address for easy sharing with apps.

Every existing Coinbase Wallet user with a Smart Wallet has a Base Account on day one – over 185k accounts. Every new user of the Base app will be using Base Account by default. We will be sharing migration paths to Base Account for EOA users over the coming months: see our [migration guide](http://docs.base.org/base-account/guides/migration-guide?utm_source=base_dot_org) to ensure all users can continue to use your app.

Users can manage their Base Account within the Base app or at [account.base.app](http://account.base.app).

## What’s New in the SDK?

The Base Account SDK is streamlined and has new tools that make it easier than ever for builders to make amazing apps. All of our documentation can be found [here](http://docs.base.org/base-account/?utm_source=base_dot_org).

### Pay

There is a new `pay` module in the SDK, with simple functions for onchain USDC payments.

```
import { pay } from '@base-org/account/pay';

const payment = await pay({ amount: "25.00", "0xYourWalletAddressHere" });

const response = await getPaymentStatus({ transactionId: payment.transactionId });
```

### UI Components

The SDK now comes with UI Components for standardized buttons:

- “Sign in with Base” or “Base” for authentication contexts
- “Base Pay” for payments contexts

```
// Also available in Vue/Preact/Svelte
import { BasePayButton, SignInWithBaseButton } from '@base-org/account-ui/react';

function SignIn() {
 return (

 );
}

function PayComponent() {
 return (

 );
}
```

![](https://www.base.org/images/blog/base-account-sdk/01.webp)

See our UI Component [documentation](https://docs.base.org/base-account/reference/ui-elements/sign-in-with-base-button?utm_source=base_dot_org) for more info.

### Sub Accounts

Sub accounts are live on mainnets in the new SDK. Sub Accounts have been live on testnet since February. They unlock seamless in-app transactions and allow users to aggregate and manage all of their app accounts on [account.base.app](http://account.base.app). See our Sub Account [documentation](https://docs.base.org/base-account/improve-ux/sub-accounts?utm_source=base_dot_org) for more info.

## Our Vision

Our mission is to build a universal and self-sovereign account for the open internet. We want to provide users with an account _they_ control and that works with them across all apps and chains.

\
We want the Base Account SDK to be the easiest way for developers to build onchain: connecting them to thousands of funded accounts, with quick and easy ways to request sharing of things like email and shipping address.

We’re just getting started, and there’s so much more to do: still day 1. We’re excited to build with you.
