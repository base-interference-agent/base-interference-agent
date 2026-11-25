> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Network Fees

> How network fees on Base work, including L2 execution and L1 security fees, how the L1 fee is passed through, where fees go, how to estimate a transaction's total cost, and how to pay gas without ETH.

## How Do Network Fees on Base Work?

Every Base transaction consists of two costs: an L2 (execution) fee and an L1
(security) fee. The L2 fee is the cost to execute your transaction on the L2,
and the L1 fee is the estimated cost to publish the transaction on the L1.
Typically the L1 security fee is higher than the L2 execution fee.

The L1 fee will vary depending on the amount of transactions on the L1. If the
timing of your transaction is flexible, you can save costs by submitting
transactions during periods of lower gas on the L1 (for example, over the
weekend)

Similarly, the L2 fee can increase and decrease depending on how many
transactions are being submitted to the L2. This adjustment mechanism has the
same implementation as the L1; you can read more in
[Coinbase's guide to EIP-1559](https://help.coinbase.com/en/coinbase/getting-started/crypto-education/eip-1559).

For additional details about fee calculation on Base, please refer to the
[network fees specification](https://docs.base.org/specifications/base-protocol/execution/predeploys.md#gaspriceoracle).

To pay gas in a token instead of ETH, see [Paying Gas in Tokens](https://docs.base.org/specifications/base-transactions.md#paying-gas-in-tokens). To diagnose CDP Paymaster errors, see [CDP Paymaster Rejections](https://docs.base.org/specifications/transactions/troubleshooting-transactions.md#cdp-paymaster-rejections).

## Minimum Base Fee

As part of the [Jovian upgrade], Base introduced a minimum base fee. This feature sets a floor for the L2 base fee, preventing it from dropping to extremely low levels during periods of low network activity.

The minimum base fee for Base Mainnet is 5,000,000 wei (0.005 gwei). This value may be periodically adjusted as we gather data on how it affects the chain. For reference, a minimum base fee of 0.005 gwei results in an L2 execution fee of approximately \$0.002 for a 200,000 gas transaction at an ETH price of \$2000. This figure includes no priority fee and excludes the L1 security fee. To estimate the full cost of a specific transaction, see [Estimating the Total Cost of a Transaction](#estimating-the-total-cost-of-a-transaction).

### Benefits

* **Faster Transaction Inclusion**: Previously, when low activity caused the base fee to drop very low, spikes in demand could lead to extended periods of congestion before fees rose enough to clear the backlog. With a minimum base fee, transactions are typically included more quickly without users needing to manually adjust priority fees.
* **More Predictable Fees**: During normal operation, the base fee will remain at or near the minimum. During congestion, the base fee rises above the minimum. This creates a more predictable fee structure similar to surge pricing.
* **Spam Prevention**: Extremely low fees can incentivize spam transactions that don't provide value to the network. The minimum base fee helps price out such activity while keeping fees affordable for legitimate use.

### Current Configuration

| Network | Minimum Base Fee |
| - | - |
| Base Mainnet | 5,000,000 wei (0.005 gwei) |
| Base Sepolia | 5,000,000 wei (0.005 gwei) |

See the [Configuration Changelog](https://docs.base.org/base-chain/network-information/configuration-changelog.md) for a history of changes to the minimum base fee and other network parameters.

## EIP-1559 Fee Parameters

Base uses its own implementation of EIP-1559, which controls how the L2 base fee adjusts in response to network demand. Two key parameters govern this behavior:

### Elasticity Multiplier

The **Elasticity Multiplier** determines the maximum gas capacity of a block relative to the target gas usage. The gas target is the block gas limit divided by the elasticity. On Base Mainnet, with an elasticity of 5 and a 40,000,000 gas limit, the target is 8,000,000 gas per block, and a block can contain up to 5× the target to absorb sudden demand spikes.

### Base Fee Change Denominator

The **Base Fee Change Denominator** controls how quickly the base fee adjusts. A larger denominator means slower, more gradual fee changes. Base uses a denominator of 1000, so the base fee changes in small steps from one 200ms block to the next.

### Maximum Rate of Change

The maximum rate of base fee change per block is calculated as:

**Max increase per block = (Elasticity - 1) / Denominator**

**Max decrease per block = 1 / Denominator**

With the current Base Mainnet parameters (Elasticity = 5, Denominator = 1000):

* Maximum increase per block: (5 - 1) / 1000 = **0.4%**
* Maximum decrease per block: 1 / 1000 = **0.1%**
* Minimum number of blocks to double the base fee: **174 blocks** (about 35 seconds at 200ms blocks)

This gradual adjustment helps prevent extreme fee volatility during traffic spikes while still allowing the network to respond to sustained demand.

### Current Configuration

| Network | Elasticity | Denominator | Gas Target per Block | Max Increase/Block |
| - | - | - | - | - |
| Base Mainnet | 5 | 1000 | 8,000,000 gas | 0.4% |
| Base Sepolia | 15 | 1000 | 8,000,000 gas | 1.4% |

These values come from the onchain `SystemConfig` and can change without a protocol upgrade. Each block header's `extraData` field carries the values in effect for that block: a 1-byte version, the 4-byte denominator, the 4-byte elasticity, and the 8-byte minimum base fee. For example, Base Mainnet's `extraData` of `0x01000003e80000000500000000004c4b40` encodes a denominator of 1000 (`0x3e8`), an elasticity of 5, and a minimum base fee of 5,000,000 wei (`0x4c4b40`).

## Querying the L1 Fee

The **GasPriceOracle** predeployment at `0x420000000000000000000000000000000000000F` (listed in [Contract Addresses](https://docs.base.org/specifications/reference/base-contracts.md)) lets you programmatically estimate the L1 fee component before signing and submitting a transaction.

| Method | Returns |
| - | - |
| `getL1Fee(bytes)` | Exact L1 fee for a fully serialized (RLP-encoded) transaction |
| `getL1FeeUpperBound(uint256 txSize)` | Upper-bound L1 fee estimate from approximate transaction byte length |
| `l1BaseFee()` | Current Ethereum L1 base fee as seen by Base |
| `blobBaseFee()` | Current EIP-4844 blob base fee |
| `baseFeeScalar()` | Scalar applied to the L1 base fee component |
| `blobBaseFeeScalar()` | Scalar applied to the blob base fee component |

Use `getL1FeeUpperBound` when you need a quick estimate before the transaction is fully constructed. Use `getL1Fee` with the complete serialized transaction for an exact value before signing.

## How the L1 Fee Is Passed Through

The L1 security fee covers the cost of posting your transaction's data to Ethereum. Base charges it per transaction at inclusion time, from the sender's ETH balance, on top of the L2 execution fee. It is not a separate transaction or a later settlement.

The L1 fee is an estimate, not the actual cost of the batch your transaction lands in. It is computed from:

* The FastLZ-compressed size of your signed transaction
* The Ethereum base fee and blob base fee, as reported to Base by the `L1Block` predeploy
* The `baseFeeScalar` and `blobBaseFeeScalar` values set by the chain operator

See the [Fjord L1 fee formula](https://docs.base.org/upgrades/fjord/exec-engine.md#fees) for the exact calculation. Because the inputs are Ethereum's fees and your transaction's size, the L1 fee follows Ethereum fee levels rather than activity on Base. Each transaction receipt reports the charged amount in its `l1Fee` field, alongside `l1GasPrice`, `l1GasUsed`, `l1BaseFeeScalar`, and `l1BlobBaseFeeScalar`.

## Where Fees Go

Base does not burn any part of the transaction fee. Unlike Ethereum, where EIP-1559 burns the base fee, each fee component on Base accrues in its own fee vault predeploy:

| Fee component | Recipient | Address |
| - | - | - |
| L2 base fee | [`BaseFeeVault`](https://docs.base.org/specifications/base-protocol/execution/predeploys#basefeevault) | `0x4200000000000000000000000000000000000019` |
| L2 priority fee | [`SequencerFeeVault`](https://docs.base.org/specifications/base-protocol/execution/predeploys#sequencerfeevault) (the block's `coinbase`) | `0x4200000000000000000000000000000000000011` |
| L1 security fee | [`L1FeeVault`](https://docs.base.org/specifications/base-protocol/execution/predeploys#l1feevault) | `0x420000000000000000000000000000000000001a` |
| Operator fee | [`OperatorFeeVault`](https://docs.base.org/upgrades/isthmus/predeploys#operatorfeevault) | `0x420000000000000000000000000000000000001b` |

No operator fee is charged when the [operator fee](https://docs.base.org/upgrades/jovian/exec-engine.md#operator-fee) parameters are zero. `getOperatorFee(gasUsed)` on the `GasPriceOracle` returns the current amount.

Once a vault holds enough ETH, its balance can be withdrawn to a fixed recipient address configured in the vault. See [Fees](https://docs.base.org/specifications/base-protocol/execution/l2-execution-engine.md#fees) in the execution engine specification for details.

## Estimating the Total Cost of a Transaction

The total cost of a USDC or B20 transfer depends on the gas the transfer uses, the size of the signed transaction, and current fee levels on Base and Ethereum. Estimate the cost for your own transaction using the steps below.

The total fee for a transaction is:

```text Total Fee theme={null}
totalFee = gasUsed * (baseFee + priorityFee) + l1Fee + operatorFee
```

To estimate it before you send a transfer:

1. Call [`eth_estimateGas`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_estimateGas) for the transfer to get `gasUsed`.
2. Read the base fee from the latest block, and get a priority fee from [`eth_maxPriorityFeePerGas`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_maxPriorityFeePerGas).
3. Call `getL1Fee` on the `GasPriceOracle` with the serialized transaction to get `l1Fee`.
4. Call `getOperatorFee(gasUsed)` on the `GasPriceOracle` to get `operatorFee`. It returns zero when the [operator fee](https://docs.base.org/upgrades/jovian/exec-engine.md#operator-fee) parameters are zero.

To convert the result to a fiat amount, multiply by an ETH price and record the price and time you used, since both the fees and the price change.

To see what a transaction actually paid, read its receipt with [`eth_getTransactionReceipt`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_getTransactionReceipt). `gasUsed * effectiveGasPrice` is the L2 execution fee, and the `l1Fee` field is the L1 security fee.

### How Cost Changes With Volume

Costs change with demand in three independent ways:

* **Activity on Base**: When blocks use more gas than the target, the L2 base fee rises above the [minimum base fee](#minimum-base-fee) by up to 0.4% per block on Base Mainnet. It falls back as demand eases.
* **Data availability throttling**: During [DA throttling](https://docs.base.org/specifications/transactions/throughput-and-limits.md#data-availability-throughput), transactions can be delayed regardless of priority fee.
* **Activity on Ethereum**: The L1 fee follows the Ethereum base fee and blob base fee, as reported to Base by the `L1Block` predeploy.

The protocol does not apply volume discounts: each transaction pays its own fees at the rates in effect when it is included. To review recent fee levels, call [`eth_feeHistory`](https://docs.base.org/base-chain/api-reference/ethereum-json-rpc-api/eth_feeHistory), which returns per-block base fees and priority fee percentiles.

## Validity Transactions

[Validity Transactions](https://docs.base.org/specifications/build-transaction/validity-transactions.md) use the normal fee rules for their transaction type. For EIP-1559 transactions, set `maxFeePerGas` and `maxPriorityFeePerGas` on the signed transaction. A validity transaction that is not included does not pay onchain execution fees. An included validity transaction pays normal execution fees, even if it reverts.

## Paying Gas Without ETH

The protocol charges every fee in ETH, from the sender's ETH balance. B20 tokens do not change this: there is no protocol-level fee token. To let users pay without holding ETH, use one of the following:

* **Paymaster sponsorship**: With [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) smart accounts, a paymaster pays the gas in ETH on the user's behalf. [CDP Paymaster](https://docs.cdp.coinbase.com/paymaster/introduction/welcome) sponsors userOperations that match the gas policy you configure, including contract and method allowlists, and bills you for the sponsored gas.
* **ERC-20 gas payment**: A paymaster can instead collect an ERC-20 token from the user and pay the gas in ETH. CDP Paymaster accepts only the tokens listed in its [ERC-20 gas payments guide](https://docs.cdp.coinbase.com/paymaster/guides/erc20-gas-payments), and `pm_getAcceptedPaymentTokens` returns the tokens a paymaster accepts. To accept a token that CDP Paymaster does not list, use an [ERC-7677](https://www.erc7677.xyz/) paymaster that supports it.
* **Relayed payments**: With x402, the [facilitator](https://docs.base.org/build-on-base/accept-payments/charge-for-an-api.md) submits the settlement transaction and pays its gas. The payer only signs an authorization. The settlement is a regular transaction from the facilitator, not a userOperation sent to your paymaster, so it does not draw on your paymaster's sponsorship.
* **Base Transactions (planned)**: A [Base Transaction](https://docs.base.org/specifications/base-transactions.md#token-gas-payments) can name a sponsor as `payer` and reimburse it in a token within the same transaction, with no paymaster contract. Base Transactions activate with the [Everest network upgrade](https://docs.base.org/upgrades/everest/overview.md), and activation dates are TBD.

If CDP Paymaster rejects a request, see [CDP Paymaster Rejections](https://docs.base.org/specifications/transactions/troubleshooting-transactions.md#cdp-paymaster-rejections) and CDP's [error reference](https://docs.cdp.coinbase.com/paymaster/reference-troubleshooting/errors).

[Jovian upgrade]: https://docs.base.org/upgrades/jovian/overview.md
