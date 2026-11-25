> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Base Verify API

> Use Base Verify APIs and contracts to prove verified account ownership, prevent duplicate participation, and enforce eligibility policies.

Base Verify lets users prove that they control verified accounts without exposing their credentials to your application. Use it to add Sybil resistance, prevent duplicate participation across wallets, and gate actions on verified traits.

## Choose an Integration

> [card] [Verify Social Accounts](https://docs.base.org/sdks/base-verify/verify-social-accounts.md)
>
> Check verified account ownership and traits in your application backend.

> [card] [Verify Users Onchain](https://docs.base.org/sdks/base-verify/verify-users-onchain.md)
>
> Enforce identity deduplication and eligibility policies directly in a smart contract.

## How the Integrations Differ

| | Verify Social Accounts | Verify Users Onchain |
| - | - | - |
| Enforcement | Your application backend | Your smart contract |
| Base surface | Base Verify REST API | Base Verify REST API and onchain contracts |
| Result | Verification token and traits | Signed `identityHash`, expiration, and signature |
| Best for | Gated application experiences, rewards, and backend-controlled claims | Contract-level claims, deposits, mints, votes, and other onchain actions |
| Application backend | Required | Not required at claim time |

Both integrations use a wallet-signed SIWE message as proof that the requester controls the wallet. Base Verify evaluates the requested provider or policy and returns only the verification data needed for the selected flow.

## Identity Attestation on Base Mainnet

Base Verify and Coinbase Verifications are separate products. Use this table to check which identity methods you can use on Base Mainnet today.

| Method | What your app receives | Base Mainnet status |
| - | - | - |
| [Verify Social Accounts](https://docs.base.org/sdks/base-verify/verify-social-accounts.md) | A verification token and traits returned to your backend. Nothing is written onchain. | Available through the Base Verify API. Requires an [API key](https://docs.base.org/sdks/base-verify/verify-social-accounts.md#prerequisites). |
| [Verify Users Onchain](https://docs.base.org/sdks/base-verify/verify-users-onchain.md) | A short-lived signed verification that your contract checks. | Not deployed on Base Mainnet. Runs on Base Sepolia only. |
| [Coinbase Verifications](https://github.com/coinbase/verifications) | [Ethereum Attestation Service (EAS)](https://docs.base.org/specifications/base-protocol/execution/predeploys.md) attestations that Coinbase issues to a wallet address: Verified Account, Verified Country, and Verified Coinbase One. | Live on Base Mainnet. Contract addresses and schema IDs are listed in the [Coinbase Verifications repository](https://github.com/coinbase/verifications#contracts). |

Coinbase Verifications attestations are public onchain records tied to the recipient address. Base Verify Onchain returns an `identityHash` instead, which is scoped per contract, so the same person produces unrelated hashes in different contracts.

> [!NOTE]
>
> Coinbase states that Coinbase Verifications attestations are for informational purposes only and should not be relied on for any legal, compliance, or contractual purpose. See the [Coinbase Verifications repository](https://github.com/coinbase/verifications) for the full terms.

## Related Resources

> [card] [Authenticate Users](https://docs.cdp.coinbase.com/coinbase-wallet/guides/authenticate-users)
>
> Connect Coinbase Wallet and authenticate users.

> [card] [Sign and Verify Typed Data](https://docs.cdp.coinbase.com/coinbase-wallet/guides/sign-and-verify-typed-data)
>
> Collect and validate wallet signatures in your application.
