> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Create a launchpad

> Fill in one form, then confirm two wallet transactions: the launchpad token and the launchpad registration.

You create a launchpad and its token in one flow. Your wallet asks for two transactions. The first creates the launchpad token. The second registers the launchpad and pays the registration fee.

## Before you start

* Use a wallet on Base or Robinhood. Select the chain in the chain selector before you open the form.
* Keep ETH for the 0.001 ETH registration fee, network gas for two transactions and any Dev Buy.
* Choose the URL with care. Nobody can change it after creation.

## Fill in the form

Open **Create Launchpad** in the navigation. The page is **Launch a Launchpad**.

**1. Launchpad identity**

Enter the launchpad name and the URL. Add a logo. You can also add a one-line description and links to X, Telegram and a website.

The URL uses 3 to 32 lowercase letters, numbers or single hyphens. The form checks that the URL is available. The registry reserves some words, for example `admin`, `api`, `docs` and `official`. See [Live configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#launchpad-release-overview) for the list.

**2. Launchpad token**

The launchpad token is an [\$O launch](https://docs.o1.exchange/launchpad/wsto/overview.md) token, paired with wstO. Its fields start from the logo, description and links of your launchpad. You can change every token field.

You can add an optional ETH Dev Buy. The Dev Buy buys launchpad tokens for your wallet in the same transaction. On Robinhood, a large Dev Buy can fail when the wstO settlement reserve is low. See [Settlement reserve](https://docs.o1.exchange/launchpad/integration/wsto.md#settlement-reserve).

**3. Tax for tokens launched on this launchpad**

Choose one of two modes. The choice applies to every later token on your launchpad.

| Mode | What creators can do |
| - | - |
| **Let creators choose** | Creators set their own buy tax, sell tax and split. Only the launchpad share is fixed. The presets are 0%, 5%, 10% and 20%. The default is 10% |
| **Set the tax** | You set the buy tax, the sell tax, the complete split and the dividend minimum. Every later token must use these values |

The form shows an example with a 3% buy tax. The protocol takes 0.5% of the trade. A 10% launchpad share gives your launchpad 0.25% of the trade.

**4. Review**

The review shows the URL, your identity, the owner share, the registration fee and the tax for later tokens. Select **Launch a launchpad**.

## Confirm the two transactions

| Transaction | What it does |
| - | - |
| **Create token** | Creates the launchpad token on the \$O launch factory and opens its pool. It includes the Dev Buy, if you added one |
| **Register launchpad** | Registers the token on the launchpad registry, creates your vault, saves your launch rules and pays the registration fee |

After the second confirmation, the app sets up your page. Keep the page open. Your launchpad opens when it is ready.

The owner share comes from the registry when you register. It is 50%. It does not change later.

## If a step fails

The app saves a draft before each wallet request. The draft holds the identity, the tax terms, the wallet and the network that you reviewed.

> [accordion] The token transaction failed
>
> No launchpad token exists. Start again.

> [accordion] The app does not know if the wallet sent a transaction
>
> Check the history of your wallet. Enter the transaction hash in the app, or stop this launchpad. Do not send a second transaction before you check.

> [accordion] The token exists, but the registration did not happen
>
> Select **Retry registration**. If you select **Stop this launchpad**, the app forgets this creation. The token stays a normal \$O launch token, and you can trade it.

> [accordion] Another wallet took the URL
>
> Your token stays yours. Choose a new URL. The launchpad then starts with the name and image of your token. Set its logo and links in the editor.

> [accordion] The launchpad exists, but its page did not publish
>
> The registry holds your launchpad. The app tries again automatically. If the details did not save, open **Manage** and set the name, logo and links.

## When creation is not available

The form shows a notice and blocks the request in these cases:

* The registry paused the creation of new launchpads.
* The registry accepts only allowlisted wallets, and your wallet is not on the list.
* The launchpad contracts changed after you opened the page. Reload the page.
* \$O launch creation is off on the selected chain.

## What you cannot change later

* The URL.
* The launchpad token.
* The owner share.

You can change the name, logo, description, links, page, launch rules and payout address. See [Manage a launchpad](https://docs.o1.exchange/launchpad/launchpads/manage.md).


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.