# blog/subaccounts

Source: https://www.base.org/blog/subaccounts.md

# From Session Keys to Sub Accounts: Through the Idea Maze

> How Smart Wallet Sub Accounts can deliver improved better onchain experiences with strong security guarantees

- Date: 2025-02-27
- Author: Wilson Cusack
- URL: https://www.base.org/blog/subaccounts

Sub Accounts is a new Smart Wallet feature that enables seamless in-app experiences. It combines Spend Permissions, hierarchical account ownership, and a new [wallet_addSubAccount RPC](https://github.com/ethereum/ERCs/pull/932). Smart Wallet Sub Accounts are [ready for builders to integrate](http://docs.base.org/identity/smart-wallet/guides/sub-accounts/overview?utm_source=base_dot_org) on Base testnet today — and will be live on mainnet in Q2.

Six months ago, we set out to improve in-app transactions with Session Keys, and after a lot of work arrived at Sub Accounts. The goal of this blog is to show our work, in hopes of fostering productive discussions and collectively arriving at the best solutions.

---

A Session Key is a signer on a smart account with limited permissions. For example, a Session Key could be configured such that it is only a valid signer on an account for one hour or such that it can only call a single function on a particular contract.

From the earliest days of our work on Smart Wallet, Session Keys interested us. They came up frequently: How might we enable subscription payments? Session keys. How might we allow apps to skip our transaction pop up for certain low value transactions? Session keys.

But we did not include Session Keys in our v1 because we still had a lot of questions on how to use them safely. When writing smart contracts, every operation needs to be carefully considered to economize gas. The idea of inspecting call data efficiently and safely to enforce per signer configurations was daunting.

A few months after our v1 launch, we began earnest work on Session Keys, and got as far as an external audit before deciding to change our approach.

## **Our Journey with Session Keys**

**Requirements**

Our requirements for Session Keys were the following

1. A Session Key should be configurable such that it can possibly be used for any onchain call. In order for Session Keys to allow users to skip our transaction popup under certain conditions, they should be flexible enough to service whatever kind of onchain call developers want to make.
2. The top level caller of a Session Key transaction should be the user’s account: Session Keys transactions should appear onchain like any other call from the user’s account.
3. We must be able to clearly express to a user what a Session Key will be allowed to do, so that they can make an informed decision as to whether or not to approve a given Session Key.
4. We must be sure we can guarantee the Session Key can only do what we’ve told the user it will be able to do.

**State**

The first issue that comes to mind with Session Keys security is existing onchain state a Session Key may be able to abuse. Onchain validation could possibly screen for restricted function names (e.g. transferFrom, approve) or restricted addresses (e.g. the USDC address). But onchain validation practically cannot guard against the possibility that, for example, a user’s smart account may have an existing USDC approval for a contract that has a stealMyUSDC function, which a Session Key could possibly call.

As a more practical example, users may have existing approvals for, say, a Uniswap contract, which any Session Key could possibly abuse.

The real issue here is state _combined_ with logic that depends on authenticating on the calling address, as any contract worth its salt will only use its allowances when a certain caller says to do so. E.g. Uniswap will only let wilson.base.eth call to use wilson.base.eth’s allowance.

We solved for this by requiring all Session Key calls to go through new app-specific contracts. If an app wants the user to call to some contract X, the call from the account must first go through some app-specific contract Y. In this way, any state contingent on msg.sender cannot be abused.

Further, we required calls to these app-specific contracts be made to a new function selector we made up, to mitigate the risk that the Session Key could directly call an existing function of consequence.

![](https://www.base.org/images/blog/subaccounts/01.webp)

This simplified things: each Session Key can only be used to call to a single specific contract and can only call a single function selector on that contract. If the developer wants to make arbitrary calls, they need to be made from this contract.

This approach also allowed us to avoid trying to show contract addresses or function names to users for approval, which should be considered a non-starter from requirement (3.). Users cannot be expected to reason about things like function names or hexadecimal strings. \

**Who can call what?**

The above solution introduces a new problem. Say App A requests a Session Key, and tells us the contract it will route calls through is contract Y. Later, app B requests a Session Key as well, also routing calls via contract Y.

A user may have accrued state or even assets on contract Y, which they trust App A to call to, and the user might be surprised if app B could use these same state and assets.

![](https://www.base.org/images/blog/subaccounts/02.webp)

So now we need to introduce a requirement around proof of control. App A needs to prove it is the authority for contract X before it can have a Session Key that can make calls to contract X.

The developer experience is becoming significantly degraded. Now, in order to use Session Keys, developers need to (1) deploy a new contract, which their Session Key calls will be proxied through, and (2) manage a key that is the authority for this contract. \

**More problems**

In the context of ERC-4337, there are still more problems. Existing state can be abused in the validation phase. For example, if a user has approved an ERC-20 paymaster to spend its USDC, any Session Key could potentially abuse this: creating spam calls from the users account until the entire USDC approval is depleted. If the attacker can also act as a bundler in this scenario, they can possibly profit from this.

So, now we need paymaster restrictions. Can Session Keys not use any paymaster? This would again downgrade developer experience. Can they only use certain paymasters? How is this decided and changed, and how is all of this communicated to the user? \

**Co-signers and Offchain Simulation**

Note, many of these issues can be sidestepped if you are comfortable introducing off chain co-signer that must also sign all Session Key requests. The idea being that the co-signer service runs some offchain simulation of the request, compares the state diff to what the Session Key is supposed to be allowed to do, and approves or rejects.

There are probably several great services to be built in this direction, however it is quite high stakes: one mistake and a user could lose all their funds. It is also opaque to the user and could allow denial of service censorship. Finally, it is not onchain and so is not easily composable with other systems.

## **Arriving at Sub Accounts**

**Learning to love App Accounts**

With the solution I described, we had created a sort of quasi app-account: there’s a contract that Session Key calls from a user's account must be proxied through. This contract is app-specific and the app has to prove control of it. But, as noted above, we still had issues. And these issues mostly stemmed from requirement (2.): that the top level caller _must_ be the user’s account.

We took a step back and asked ourselves, “What if we relaxed this constraint and embraced app accounts?” App accounts are developer controlled and can be used for arbitrary calls, and they already have great tooling provided by a number of teams. To empower them, we needed a way for app accounts (A) to use funds from the user’s universal account and (B) to _feel_ to a user like they are part of their universal account.

**Spend Permissions**

To accomplish (A), we created [Spend Permissions](https://github.com/coinbase/spend-permissions), which launched in December. Spend Permissions allow a “spender” to pull funds from a user Smart Wallet according to some rules, e.g. a Spend Permission could codify “0x1 can spend 10 USDC per week for a year.” Spend Permissions can be cancelled by the user at any time.

Spend Permissions do not have the same security issues as Session Keys because they are not as open ended. Calls are validated by a Spend Permission Manager contract, which can only make very specifically formatted requests to the users account.

Spend Permissions are also easily adoptable by other teams, as the manager contract only requires the account implement ERC-1271 (which all smart accounts should), and Spend Permissions can be signed by users using the existing ERC-712 format, which all wallets support already.

![](https://www.base.org/images/blog/subaccounts/03.webp)

### **Sub Accounts**

Making app accounts feel like a part of a user's universal account is what we are taking on now. This is made possible by:

1. Hierarchical smart account ownership: a user’s universal wallet can own their app account, unlocking unified management, where the universal account can move assets on the app account. Vitalik mentioned this idea in his [recent blogpost](https://vitalik.eth.limo/general/2024/12/03/wallets.html): “However, a user of many application wallets should be able to link all of their wallets together, so that they only have one ‘access control thing’ to worry about. The simplest way to do this is a hierarchical scheme, where there is a fast "linking" process that allows a user to set their primary wallet to be the guardian of all of their in-app wallets.”
2. A way for universal accounts to become aware of app accounts. This is made possible by the new wallet_addSubAccount RPC. It allows apps to request a wallet to track a new address as part of a user’s universal account, and assumes the account passed is owned by the universal wallet, i.e. is a “sub account.”

With all this combined, we end up with something that looks like our Session Key approach, but we believe it is more flexible and more secure.

![](https://www.base.org/images/blog/subaccounts/04.webp)

When Sub Accounts are combined with Spend Permissions, we believe we can give us all the UX gains of Session Keys with better developer experience and user security guarantees.

![Visualization of relationships](https://www.base.org/images/blog/subaccounts/05.webp 'Visualization of relationships')

We also think embracing multi-address accounts and address hierarchy (which can now be codified onchain, with smart accounts owning other smart accounts) can significantly improve user experience in crypto today, where many users have funds spread across many addresses and no easy way to track or control them all.

**Start Building**

With these tools, developers can provision AI assistants for users, with their own siloed smart accounts, able to spend with fine grained permissions and able to be monitored and controlled from the user's universal wallet. Developers can build onchain gaming experiences, where users can get started with a one time Spend Permissions, and thereafter transact without popups, accruing in-game assets to an address users can control from their universal account. These are just a couple examples. We can’t wait to see what developers come up with. Checkout our [documentation](http://docs.base.org/identity/smart-wallet/guides/sub-accounts/overview?utm_source=base_dot_org) to get started. \

We’re eager to hear your feedback on all of this and excited to build with you!

\
