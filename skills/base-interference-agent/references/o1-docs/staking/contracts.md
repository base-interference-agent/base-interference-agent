> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Contracts

> wstO vault and O bridge contract addresses on Base and Robinhood Chain, vault parameters, and dated onchain readback.

This page lists the wstO vault contracts and the O bridge contracts on Base and Robinhood Chain. Vault state was **verified onchain on October 8, 2026**; see [Onchain readback](#onchain-readback).

A machine-readable copy is available in [`wsto-deployments.json`](https://docs.o1.exchange/staking/reference/wsto-deployments.json).

> [!WARNING]
>
> Always confirm the chain ID before signing. The same address can be a different contract on another network. For example, `0x500A02a20B0B0A3F3efCCFc0559543F5743bd1C4` is O on Robinhood Chain, but on Base it belongs to a different bridge.

## Base mainnet

Chain ID `8453`. View the network on [Basescan](https://basescan.org).

| Contract | Address |
| - | - |
| O token (native) | [`0x182FA643E5f29d5EcA75e7b9CF9336A3fe4620b2`](https://basescan.org/address/0x182FA643E5f29d5EcA75e7b9CF9336A3fe4620b2) |
| wstO vault and token | [`0x80C6BAE89B636c6Ee96FE8F198c0D6926C2C91df`](https://basescan.org/address/0x80C6BAE89B636c6Ee96FE8F198c0D6926C2C91df) |
| Protocol Config | [`0xa8Ebce135e4f7002882762e6f7f4176719c8BE4A`](https://basescan.org/address/0xa8Ebce135e4f7002882762e6f7f4176719c8BE4A) |
| Timelock (governance) | [`0x1f6F11D6edbb99F2fE1e293762e7C8e4D3cCd6fe`](https://basescan.org/address/0x1f6F11D6edbb99F2fE1e293762e7C8e4D3cCd6fe) |
| Permanent Share Sink | [`0x03867B11F186f7d6C48571c8b41D56fD68c958ab`](https://basescan.org/address/0x03867B11F186f7d6C48571c8b41D56fD68c958ab) |
| Vault Bootstrapper (single use) | [`0xC12872f6bEb9F9052b44048D0f9ff8a3563722cA`](https://basescan.org/address/0xC12872f6bEb9F9052b44048D0f9ff8a3563722cA) |
| O bridge adapter (LayerZero EID `30184`) | [`0xa0941841c32F587d376343464099399fbdb2E834`](https://basescan.org/address/0xa0941841c32F587d376343464099399fbdb2E834) |

## Robinhood Chain

Chain ID `4663`. View the network on [Blockscout](https://robinhoodchain.blockscout.com).

| Contract | Address |
| - | - |
| O token and bridge OFT (LayerZero EID `30416`) | [`0x500A02a20B0B0A3F3efCCFc0559543F5743bd1C4`](https://robinhoodchain.blockscout.com/address/0x500A02a20B0B0A3F3efCCFc0559543F5743bd1C4) |
| wstO vault and token | [`0xE92bD1C05E4E308792003C8205127A6FA662b4D4`](https://robinhoodchain.blockscout.com/address/0xE92bD1C05E4E308792003C8205127A6FA662b4D4) |
| Protocol Config | [`0x1AbA6FF1a3644804978CF2E713b1d2490f2C92a3`](https://robinhoodchain.blockscout.com/address/0x1AbA6FF1a3644804978CF2E713b1d2490f2C92a3) |
| Timelock (governance) | [`0x8a0d7a2798C149495228F678Df4e0829D9006672`](https://robinhoodchain.blockscout.com/address/0x8a0d7a2798C149495228F678Df4e0829D9006672) |
| Permanent Share Sink | [`0x2A4C312469ec8f653ad4C352903dB9c249755D56`](https://robinhoodchain.blockscout.com/address/0x2A4C312469ec8f653ad4C352903dB9c249755D56) |
| Vault Bootstrapper (single use) | [`0xDF8f68B38c1F1d43655eab0dFE1841e3d658bC15`](https://robinhoodchain.blockscout.com/address/0xDF8f68B38c1F1d43655eab0dFE1841e3d658bC15) |

On Robinhood Chain, the O token contract is also the bridge contract: it mints O when a transfer arrives from Base and burns it when O leaves.

## Vault parameters

These values are fixed at creation and cannot change.

| Parameter | Base | Robinhood Chain |
| - | - | - |
| Token name and symbol | Wrapped Staked O (`wstO`) | Wrapped Staked O (`wstO`) |
| Decimals | 18 | 18 |
| Deposit and redemption fee | 0% | 0% |
| Initial deposit | 1 O | 2 O |
| Vault creation block | `52,130,412` | `81,595,232` |

wstO uses the same decimals as O. Its EIP-712 permit domain is `Wrapped Staked O`, version `1`, with the chain ID and vault address of each network.

## Onchain readback

Read-only checks on **October 8, 2026**:

| Check | Base | Robinhood Chain |
| - | - | - |
| Verification block | `52,331,969` | `83,224,533` |
| Deposits | Open | Open |
| Protocol Config bound to this vault | Yes | Yes |
| Bootstrap authority | Cleared (zero address) | Cleared (zero address) |
| Protocol Config governance | Timelock listed above | Timelock listed above |
| Bridge transfers out of this network | Enabled | Enabled |
| Bridge peer | Robinhood Chain OFT | Base adapter |

Deposit status, the Guardian, the Timelock's delay and roles, and the bridge switches can change after this date. Read them onchain before relying on them.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.