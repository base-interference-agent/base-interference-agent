> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Make a Transaction

> Send your first transaction on Base with viem: connect, sign, and confirm in seconds for a fraction of a cent.

Base uses the same transaction model as Ethereum, so any EVM library works. Here's a minimal send using [viem](https://viem.sh).

## Send a Transaction

```ts send.ts lines wrap expandable theme={null}
import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

const account = privateKeyToAccount('0xYourPrivateKey');

const client = createWalletClient({
  account,
  chain: base,
  transport: http('https://mainnet.base.org'),
});

const hash = await client.sendTransaction({
  to: '0xRecipientAddress',
  value: parseEther('0.001'),
});

console.log(`Sent, view at https://basescan.org/tx/${hash}`);
```

> [!WARNING]
>
> Never hardcode or expose a private key. `'0xYourPrivateKey'` is a placeholder. Load the key from an environment variable or a secrets manager, keep it server-side, and never commit it to source control.

> [!TIP]
>
> Transactions confirm in under a second on Base, which produces a canonical block every [200ms](https://docs.base.org/upgrades/denim/200ms-blocks.md), and typically cost a fraction of a cent in gas.

## Next Steps

> [card] [Issue a Stablecoin](https://docs.base.org/get-started/issue-stablecoins.md)
>
> Launch a fiat-backed token in one call.

> [card] [Facilitate Payments](https://docs.base.org/get-started/accept-payments.md)
>
> Accept USDC with one-tap checkout.
