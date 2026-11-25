> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Bridge O

> Move O between Base and Robinhood Chain with the O bridge in the O Staking app, and understand what backs O on Robinhood Chain.

O is native to Base. On Robinhood Chain, O is a LayerZero OFT backed by O locked on Base. The O Staking app includes a bridge at [staking.o1.exchange/bridge](https://staking.o1.exchange/bridge) for moving O in either direction.

| Direction | What happens |
| - | - |
| Base to Robinhood Chain | The bridge adapter on Base locks your O, and the OFT on Robinhood Chain mints the same amount to the recipient |
| Robinhood Chain to Base | The OFT on Robinhood Chain burns your O, and the adapter on Base releases the same amount to the recipient |

The bridge moves O only. wstO cannot be bridged. Redeem it for O first.

## Bridge O

**1. Choose the direction**

Open **Bridge** in the app header and check the **From** and **To** networks. Use **Swap direction** to reverse them. Your wallet must be on the **From** network.

**2. Enter the amount and recipient**

Amounts can have up to 6 decimal places. Any smaller remainder stays in your wallet. The recipient defaults to your wallet. If you use a contract wallet such as a Safe, enter an address you control on the destination network, because the same contract wallet may not exist there.

**3. Approve O on Base**

Transfers from Base need an approval that lets the adapter transfer the exact amount. Transfers from Robinhood Chain need no approval.

**4. Confirm and pay the bridge fee**

The app fetches the fee again and simulates the transfer before your wallet opens. You pay the fee in ETH on the **From** network.

**5. Track the transfer**

O usually arrives within a few minutes, and the page updates when it lands. If a transfer takes longer than usual, the page links to LayerZero Scan so you can check the message.

## Fees and limits

| Item | Value |
| - | - |
| Token fee | None. The recipient receives exactly the amount sent after removing decimals beyond the sixth |
| Bridge fee | LayerZero messaging fee, paid in ETH on the sending network and shown before you confirm. It does not depend on the amount |
| Precision | Up to 6 decimal places |
| Arrival | Usually within a few minutes |

You need enough ETH on the sending network for both gas and the bridge fee. If you do not have it, the app shows a message such as **Not enough ETH on Base for the fee**.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.