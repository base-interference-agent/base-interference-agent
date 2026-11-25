> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Launch from X

> Connect your X account, prepare a Base smart account, and launch a token with o1 Bot V1.

Mention **@o1\_bot** in an X Post to create a token and open its market. For the standard setup flow, your Base smart account is the creator and pays for the launch. Your connected Owner wallet controls that account.

> [!NOTE]
>
> Bot V1 supports **Standard crypto-paired launches on Base only**. The wider chain, Stock Token and Tax options in the web create form are not Bot commands.

## Your first launch

**1. Connect X and your Owner wallet**

Open the [o1 Bot portal](https://launch.o1.exchange/o1-bot), select Base using the global chain selector, and connect the X account you will post from. Connect the Web3 wallet that will own your smart account.

**2. Activate your Base smart account**

Review the restricted launch permission and approve setup with your Owner wallet. Wait until activation and the permission have been verified onchain.

Setup does not launch a token. Read [Permissions and safety](https://docs.o1.exchange/launchpad/bot/permissions.md) before approving access.

**3. Fund the smart account**

Use **Deposit** in the portal. Keep enough ETH in the smart account for the launch fee, network gas, and any optional Dev Buy. Your Owner wallet needs its own ETH for the deposit transaction's gas.

See [Wallet and fees](https://docs.o1.exchange/launchpad/bot/wallet-and-fees.md) for who pays each cost.

**4. Post your launch request**

Copy the example below, replace the name and symbol, and **attach exactly one PNG, JPG or WEBP image**. Send it from your connected X account.

```text theme={null}
@o1_bot Launch on Base
Name: My Token
Symbol: MYTOKEN
Quote: ETH
Description: A community token.
```

A valid request can execute without a second wallet confirmation. Review all fields before posting. Images and token details become public.

**5. Check the result**

The Bot replies with the launch result or a correction request. After success, open the token link and inspect the transaction and token contract address. The portal also shows recent launch activity.

If submission is pending or its outcome is unknown, do not send a duplicate request. Follow [Troubleshooting](https://docs.o1.exchange/launchpad/bot/troubleshooting.md).

## What happens to the tokens?

A launch creates the fixed supply and places it into permanently locked pool liquidity. Being the creator does **not** automatically put that supply in your wallet. To buy tokens during creation, explicitly include an [optional Dev Buy](https://docs.o1.exchange/launchpad/bot/dev-buy.md); bought tokens go to your smart account.

## Posting in an existing conversation

You can start another launch in the same conversation. Include a complete new launch instruction, all required fields and a new attached image. A fresh launch does not inherit the previous request's image, chain or Dev Buy.

To correct a request that is waiting for details, reply directly to that request or the Bot's correction prompt. See [Replies and corrections](https://docs.o1.exchange/launchpad/bot/commands.md#replies-and-corrections).

> [accordion] Invited creators launching without setup
>
> Some approved creators can use a platform-funded launch path before setting up a smart account. This requires explicit eligibility; mentioning the Bot does not grant access.
>
> This path does not support Dev Buy. If you already have a smart account, an insufficient balance or invalid permission does not automatically switch your launch to platform funding.
>
> To request Creator Rights for an eligible pre-setup launch, complete setup and use the portal's claim flow. There is no application fee, but review and the onchain transfer process are still required. Creator Rights do not grant minting or transfer controls, and previously credited fees do not move to the new recipient.

> [card] [X commands](https://docs.o1.exchange/launchpad/bot/commands.md)
>
> Required fields, optional metadata, help, and stopping future requests.

> [card] [Add a Dev Buy](https://docs.o1.exchange/launchpad/bot/dev-buy.md)
>
> Buy tokens atomically with an ETH-paired launch.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.