# blog/native-account-abstraction

Source: https://www.base.org/blog/native-account-abstraction.md

# Native Account Abstraction

> Since day one, our mission at Base has been to bring the world onchain. It guides everything we do, from scaling the chain to improving UX. For the last several years, smart…

- Date: 2026-07-17
- Author: Chris Hunter
- URL: https://www.base.org/blog/native-account-abstraction

Since day one, our mission at Base has been to bring the world onchain. It guides everything we do, from scaling the chain to improving UX. For the last several years, smart accounts provided a solution to some of crypto’s most painful UX challenges and enabled gas abstraction, batched operations, and flexible key management. However, the underlying technology ([ERC-4337](https://eip.tools/eip/4337)) came with higher costs, increased latency and additional complexity.

We are excited to announce that Base is partnering with Optimism, Coinbase, and WalletConnect to bring Native Account Abstraction ([EIP-8130](https://eip.tools/eip/8130)) to every wallet on all EVM chains. It’ll launch on Base, as part of the Cobalt upgrade coming this September, and on all OP Stack chains later this year.

To get it into your hands early, we're introducing [Base Vibenet](https://vibes.base.org/), a new ephemeral devnet for testing features before activation. If you're a developer we'd love to help get EIP-8130 integrated into your chain, wallet or application.

## Why native account abstraction?

Native AA makes the following features native to the chain:

- **Batch calls:** Group multiple actions into a single transaction
- **Sponsorship:** Applications can pay for their users’ gas fees or allow them to pay in any token.
- **Portability**: Use the same account on any chain, even those that don’t support Native AA.
- **Quantum Ready**: Key rotation and multiple authentication schemes allow users to upgrade to post quantum authentication.
- **High-throughput:** Parallel nonces and large sender limits unlock high levels of concurrency.
- **Session keys:** Applications can act on your behalf with bounded and revocable permissions or create
- **Sub-accounts**: Fully isolated account owned by you and controllable by an application.
- **Metadata:** Add memos and attributions to your transactions.

By building this functionality native to the chain, we’ve been able to codesign EIP-8130 with the rest of the protocol. This allowed us to keep the transaction opinionated and optimizable. Compared to the previous generation of Smart Accounts, we’ve been able to dramatically reduce the per transaction cost to end users by over 2x, while not compromising on our scaling goals.\

| **Transaction Type** | **ERC-4337** | **Native AA** |
| ---------------------------------- | ----------------------- | -------------------------------------- |
| USDC Transfer | 125,000 gas 1,090 bytes | 46,000 gas (-63.2%) 180 bytes (-83.4%) |
| | | |
| USDC Transfer (Passkey, Sponsored) | 173,000 gas 1,940 bytes | 68,700 gas (-60.3%) 890 bytes (-56.1%) |
| | | |

## How does this impact you?

### Users

If you’re using a standard (EOA) account, your account can automatically leverage new features such as gas sponsorship and batching. If you are using a smart (ERC-4337) account, there’s a [one-time upgrade](https://www.eip8130.com/protocol/onboarding) step that’ll allow you to benefit from lower gas costs and faster transaction inclusion.

Native Account Abstraction doesn’t lock you into Base. You can take your accounts to any other chain, even those that don’t currently support Native AA.

### Application Developers

Applications will continue to work the same without any changes (e.g. [wallet_sendCalls](https://eips.ethereum.org/EIPS/eip-5792) will work for Native AA). You’ll also be able to leverage new features such as memos (to provide attribution) and better account management (via session keys and sub-accounts).

### Wallets

Wallets will continue to work the same way they do today without any changes. By adding support for Native AA, you can unlock new revenue opportunities via subscriptions and ERC-8168 payer services.

### Node Operators

The only action required is to update your nodes to support Base Cobalt and allow access to several new RPC methods.

## Building Together

Native Account Abstraction is designed to work on any EVM chain. We’re excited to partner with all chains and wallets to continue to push the frontier of onchain UX.

Visit the [docs](https://www.eip8130.com/) to learn more about Native AA.

If you have any feedback, or are interested in contributing to Native AA, please reach out to us on [Telegram](https://t.me/+4lcd0FSdI6k1MWIx).
