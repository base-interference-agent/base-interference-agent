> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Assign User Attributes

> Choose Builder Codes for transaction attribution or Base Verify for verified user traits, identity deduplication, and eligibility policies.

Use attribution when you need to identify which builder generated onchain activity or determine whether a user satisfies a verified eligibility requirement. Builder Codes and Base Verify solve different parts of that problem.

## Attribute Onchain Activity

Builder Codes append an ERC-8021 attribution suffix to transaction calldata. Offchain indexers use the suffix to associate activity with the app, wallet, or agent that generated it.

> [card] [Builder Codes Overview](https://docs.base.org/specifications/builder-codes/overview.md)
>
> Understand Builder Codes, attribution benefits, supported account types, and verification options.

> [card] [For App Developers](https://docs.base.org/specifications/builder-codes/for-app-developers.md)
>
> Add automatic transaction attribution with Wagmi, Viem, CDP Wallets, or Privy.

> [card] [For Wallet Developers](https://docs.base.org/specifications/builder-codes/for-wallet-developers.md)
>
> Implement the `dataSuffix` capability for EOAs and ERC-4337 user operations.

> [card] [For Agent Developers](https://docs.base.org/specifications/builder-codes/for-agent-developers.md)
>
> Register an agent and attribute its autonomous onchain transactions.

## Verify User Attributes

Base Verify lets a user prove control of a supported account and lets your application evaluate approved traits. Choose the backend flow for application-controlled experiences or the onchain flow when a smart contract must enforce the policy.

> [card] [Base Verify API](https://docs.base.org/sdks/base-verify/overview.md)
>
> Compare the backend and onchain verification flows.

> [card] [Verify Social Accounts](https://docs.base.org/sdks/base-verify/verify-social-accounts.md)
>
> Check verified account ownership and traits from your application backend.

> [card] [Verify Users Onchain](https://docs.base.org/sdks/base-verify/verify-users-onchain.md)
>
> Enforce policy gating and one-person-once participation in a smart contract.

> [!NOTE]
>
> Builder Codes attribute transaction origin; they do not verify a user's identity or eligibility. Base Verify evaluates verified user attributes; it does not attribute transactions to the builder that generated them.
