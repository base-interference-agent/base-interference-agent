> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Direct contract integration

> Read current launch configuration, build safe launch transactions, trade through Uniswap v4, and consume canonical launch events.

This page intentionally uses exact contract fields for developers. For a plain-language product flow, start with [How it works](https://docs.o1.exchange/launchpad/how-it-works.md).

Direct integrations should discover the active chain and creation route, read current factory state, build an unsigned transaction, and let the user's wallet sign it. Never hardcode a mutable configuration version, opening frame, or creation fee.

Existing-token discovery has a different boundary from new creation. Index every factory in the [`launch-contract-suites.json`](https://docs.o1.exchange/launchpad/reference/launch-contract-suites.json) registry from its recorded `firstBlock`, retain the originating `(chainId, factory)` with each launch, and select the matching contract-version ABI. A historical factory is no longer selected by the current interface, but its tokens, pools, fee escrow, vesting vault, and announcement registry remain part of the protocol history.

> [!NOTE]
>
> The fee-component reads and launch tuple examples on this page describe Standard suites. Use [Tax contract integration](https://docs.o1.exchange/launchpad/integration/tax-tokens.md) for inclusive-tax ERC-20 suites and [\$O launch integration](https://docs.o1.exchange/launchpad/integration/wsto.md) for \$O launches on Base and Robinhood. \$O launches have no fee escrow, launch fee or Tax allocation tuple. Resolve token mode by suite, not by Base chain ID alone.

## Integration sequence

**1. Select the active route**

Resolve the current factory by chain, product and market. Within Standard, Base, Robinhood, BSC, Monad and X Layer each use one active factory for crypto-paired and stock-paired launches. The selected quote still determines the market type; do not infer it from a symbol.

**2. Read launch configuration**

For the active factory, read `configVersion`, `launchSupply`, `tickSpacing`, `bandTemplate`, the named fee getters, every indexed fee component, `quoteConfig(selectedQuote)`, `quoteRevision(selectedQuote)`, `launchCreationEnabled`, and `nativeLaunchFee` at one recent block. Use the exact ABI for the contracts recorded for earlier launches because their aggregate getter names differ.

**3. Validate parameters**

Apply the hard limits in [Limits and validation](https://docs.o1.exchange/launchpad/reference/limits.md), confirm the quote remains registered, and use the complete fixed supply for the pool.

**4. Build payment**

Each active factory uses one global native fee for every paired asset. Set ordinary `createLaunch` value to exactly `nativeLaunchFee`; it is currently 0.001 ETH on Base/Robinhood, 100 MON on Monad, 2 native USDC on Arc, 0.003 BNB on BSC, 0.02 OKB on X Layer, and 0.025 HYPE on Elysium.

**5. Commit to the configuration**

Set `expectedConfigVersion` to the fresh read and choose a short chain-time deadline. The o1 Launchpad interface uses the latest block timestamp plus 30 minutes. Paired-asset tick-only updates advance the selected quote revision without changing the global version, so execution intentionally uses the latest registered opening frame.

**6. Simulate, sign, and confirm**

Simulate `createLaunch`, present the complete launch economics to the user, then request a wallet signature and wait for a successful receipt.

**7. Parse canonical events**

Read `Launched` for token and pool ID, then index the other factory, hook, PoolManager, escrow, and announcement events from the same transaction. For trades, derive direction and wallet attribution from the complete receipt rather than treating `Trade.executor` as the user's address.

## Read the current snapshot with viem

The example below reads the Base Standard factory. The current Robinhood, Monad, Arc, BSC, X Layer and Elysium factories expose the same configuration surface. Use the current factory and paired-asset addresses for the selected chain from [Production contracts](https://docs.o1.exchange/launchpad/reference/production-contracts.md).

```ts theme={null} theme={null}
import { createPublicClient, http, parseAbi, zeroAddress } from "viem";
import { base } from "viem/chains";

const FACTORY = "0x1176122eb77AD6a2339322Cda7C4D7ea9BfA63dC";
const factoryReads = parseAbi([
  "function configVersion() view returns (uint64)",
  "function launchSupply() view returns (uint256)",
  "function tickSpacing() view returns (int24)",
  "function bandTemplate() view returns ((int24 lowerOffset,int24 upperOffset,uint16 supplyShareBps)[] bands)",
  "function quoteConfig(address) view returns (bool registered,uint8 quoteDecimals,int24 startTickToken0Frame)",
  "function quoteRevision(address) view returns (uint64)",
  "function nativeLaunchFee() view returns (uint256)",
  "function launchCreationEnabled() view returns (bool)",
  "function baseFeeBps() view returns (uint16)",
  "function antiSnipeStartTotalBps() view returns (uint16)",
  "function antiSnipeWindowSeconds() view returns (uint32)",
  "function feeComponentCount() view returns (uint256)",
  "function feeComponents(uint256) view returns (bytes32 componentId,uint8 recipientKind,address configuredRecipient,uint16 feeBps)",
  "function platformFeeRecipient() view returns (address)",
]);

const client = createPublicClient({ chain: base, transport: http() });
const blockNumber = await client.getBlockNumber();
const [version, supply, spacing, bands, nativeQuote, quoteRevision, launchFee, enabled, baseFee, antiSnipeStart, antiSnipeWindow, componentCount, platformRecipient] = await Promise.all([
  client.readContract({ blockNumber, address: FACTORY, abi: factoryReads, functionName: "configVersion" }),
  client.readContract({ blockNumber, address: FACTORY, abi: factoryReads, functionName: "launchSupply" }),
  client.readContract({ blockNumber, address: FACTORY, abi: factoryReads, functionName: "tickSpacing" }),
  client.readContract({ blockNumber, address: FACTORY, abi: factoryReads, functionName: "bandTemplate" }),
  client.readContract({ blockNumber, address: FACTORY, abi: factoryReads, functionName: "quoteConfig", args: [zeroAddress] }),
  client.readContract({ blockNumber, address: FACTORY, abi: factoryReads, functionName: "quoteRevision", args: [zeroAddress] }),
  client.readContract({ blockNumber, address: FACTORY, abi: factoryReads, functionName: "nativeLaunchFee" }),
  client.readContract({ blockNumber, address: FACTORY, abi: factoryReads, functionName: "launchCreationEnabled" }),
  client.readContract({ blockNumber, address: FACTORY, abi: factoryReads, functionName: "baseFeeBps" }),
  client.readContract({ blockNumber, address: FACTORY, abi: factoryReads, functionName: "antiSnipeStartTotalBps" }),
  client.readContract({ blockNumber, address: FACTORY, abi: factoryReads, functionName: "antiSnipeWindowSeconds" }),
  client.readContract({ blockNumber, address: FACTORY, abi: factoryReads, functionName: "feeComponentCount" }),
  client.readContract({ blockNumber, address: FACTORY, abi: factoryReads, functionName: "platformFeeRecipient" }),
]);

const feeComponents = await Promise.all(
  Array.from({ length: Number(componentCount) }, (_, componentIndex) =>
    client.readContract({
      blockNumber,
      address: FACTORY,
      abi: factoryReads,
      functionName: "feeComponents",
      args: [BigInt(componentIndex)],
    }),
  ),
);
```

Factory fee getters describe the configuration that a new pool would freeze. To read one existing pool, use its exact `poolId` with the hook recorded for that launch:

```ts theme={null} theme={null}
const hookReads = parseAbi([
  "function poolConfig(bytes32) view returns (bool initialized,bool tokenIsCurrency0,address currentCreator,address creatorFeeRecipient,uint16 baseFeeBps,uint16 antiSnipeStartTotalBps,uint32 antiSnipeWindowSeconds,uint48 launchTime)",
  "function poolFeeComponents(bytes32) view returns ((bytes32 componentId,uint8 recipientKind,address configuredRecipient,uint16 feeBps)[] components)",
]);
```

`recipientKind` is `0` for the current creator fee recipient, `1` for the configured platform recipient, `2` for a valid transaction referrer, and `3` for another fixed recipient. Component bps are direct shares of the traded paired-asset amount. The current rows on all six chains are creator `50`, platform `30`, and referrer `20`, which sum to the `100` bps base fee. An absent or invalid referrer component rolls into the platform remainder.

For a transaction integration, obtain the complete verified factory ABI from the chain explorer and encode the exact struct it defines. A partial handwritten write ABI is easy to get wrong.

`startTickToken0Frame` is the onchain opening-price value for a registered paired asset. The factory handles token ordering and tick spacing when it creates the pool; a launch transaction selects the asset and does not submit a starting tick.

## Atomic launch-buy

`createLaunchAndBuy` accepts the ordinary `LaunchParams` plus `LaunchBuyParams(fundingToken, amountIn, minAmountOut, routeData)`. The current browser flow uses native funding, so `fundingToken` is the zero address and the exact transaction value is:

```text theme={null}
msg.value = nativeLaunchFee + amountIn
```

The adapter route data and protected minimum output must be prepared from a fresh executable route. The atomic buy pays the normal base fee, waives only the anti-snipe surcharge for that one original-creator purchase, and reverts the complete launch if execution fails. The ordinary `createLaunch` path sends only `nativeLaunchFee`.

### Arc USDC amounts and approvals

Arc exposes the same configuration reads. For a USDC pair, `quoteToken` is ERC-20 USDC at `0x3600000000000000000000000000000000000000`. For a cirBTC pair, use `0x171a4217b86a807a64eb94757db6849fb4bdbaa0` and eight-decimal quote units. Read `quoteConfig` for the selected asset before preparing creation; neither ERC-20 quote uses the zero address. See [Arc configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#arc-mainnet) for current launch settings.

For a 5-USDC Dev Buy with the recorded 2-USDC launch fee, the two funding modes are below. Amounts are integer base units; `5e18` means `5000000000000000000`.

| Field | Native USDC funding | ERC-20 USDC funding |
| - | - | - |
| `fundingToken` | Zero address | USDC address above |
| `amountIn` | `5e18` | `5000000` |
| Factory transaction value | `7e18` | `2e18` |
| Creator approval | None for the buy input | Approve the attached adapter for `5000000` USDC units |

These are two interfaces to one balance; either example requires 7 USDC plus gas. Read `launchBuyAdapter()` before approving. The adapter pulls ERC-20 input from the original creator and grants the router its own temporary allowance. Native funding is converted once to six-decimal router units with no native value forwarded. Nonmultiples of `1e12` native units are rejected rather than rounded. See the [Arc adapter flow](https://docs.o1.exchange/launchpad/architecture/contracts.md#arc-deployment).

Keep event units tied to their fields: `LaunchBuyExecuted.amountIn` uses the original funding mode's decimals; `NativeLaunchFeePaid` uses 18; pool USDC amounts and USDC escrow claims use six, while cirBTC pool amounts and claims use eight. Claim using the recorded paired-asset address. Native and ERC-20 views of one transfer or balance must not be counted twice.

## Creator-rights integration

For a launch from a current Standard factory, `creatorRights(token)` returns the immutable original creator, current creator, pending creator, current creator fee recipient, pool ID, and whether metadata editing was enabled at launch. `currentCreatorOf(token)` is the compact authorization read used by the active announcement registry. Tax and \$O launches use their own creator-rights interfaces described in the [Tax integration guide](https://docs.o1.exchange/launchpad/integration/tax-tokens.md) and [\$O integration guide](https://docs.o1.exchange/launchpad/integration/wsto.md).

Use `proposeCreatorRightsTransfer` and `acceptCreatorRightsTransfer` for an ordinary two-step wallet transfer. The current creator can cancel a pending transfer or update only the destination for future creator-fee credits with `setCreatorFeeRecipient`. `safeTransferCreatorRights` is for a contract that implements the required receiver callback; do not use it as an ordinary EOA transfer.

Creator-rights changes update future announcement authority, optional metadata authority, and future creator-fee credits. They do not move already credited escrow balances, transfer token balances, change supply, grant minting or pause power, or unlock liquidity. Use the factory recorded for each launch because earlier factories do not expose this surface.

## ERC-20 token prediction

The current Base, Robinhood, Monad, Arc, BSC, X Layer and Elysium ABIs include the configuration and quote reads above. Add the following ERC-20 factory reads when preparing its fixed-supply ERC-20 deployment:

```ts theme={null} theme={null}
const erc20FactoryReads = parseAbi([
  "function TOKEN_ADDRESS_SUFFIX() view returns (uint8)",
  "function launchTokenBytecodeHash((string tokenName,string tokenSymbol,string tokenContractURI,bytes32 creatorSalt,address quoteToken,uint64 expectedConfigVersion,uint64 deadline,bool metadataEditable,string[] metadataKeys,string[] metadataValues) launchParams) view returns (bytes32 bytecodeHash)",
]);
```

Fail closed unless creation is enabled, the selected quote is registered on the selected factory, and the address-suffix constant is `1`. Every current Robinhood, Monad, Arc, BSC, X Layer or Elysium launch must prepare the finalized token metadata first, read `launchTokenBytecodeHash`, and mine a salt whose predicted ERC-20 address ends in `01`. Base B20 addresses can be predicted before signing through the B20 creation formula. Obtain the complete verified active-factory ABI before encoding a write.

Arc uses the same ERC-20 prediction and `01` suffix requirement. Connect to Arc and recompute the prediction using its factory, finalized metadata and selected registered quote before preparing a launch.

## Supported launch inputs

The current product inputs are:

| Field | Meaning |
| - | - |
| `tokenName`, `tokenSymbol` | Token identity |
| `tokenContractURI` | Pinned token metadata URI |
| `creatorSalt` | User salt, scoped by factory to the caller |
| `quoteToken` | Registered paired-asset address; zero address means native ETH on Base/Robinhood, MON on Monad, BNB on BSC, OKB on X Layer, or HYPE on Elysium |
| `expectedConfigVersion` | Exact fresh factory version |
| `deadline` | Latest allowed chain timestamp |
| `metadataEditable` | Whether the creator keeps the limited token-profile editing right |
| `metadataKeys`, `metadataValues` | Parallel on-chain metadata arrays |

Use the complete verified ABI when encoding `LaunchParams`; this table explains the supported product inputs and is not a replacement for the contract type definition.

## Trading integration

Launch pools are ordinary Uniswap v4 pools with a required hook. Use the selected chain's listed v4 Quoter to simulate a specified pool path and a compatible configured router for execution. Use Permit2 only when that router requires it; Arc's listed SwapX router uses ERC-20 USDC funding. A Quoter does not discover every possible route. Preserve the exact pool key: sorted currencies, LP fee `0`, launch tick spacing, and the hook address recorded for that launch.

`tickSpacing` is part of the exact Uniswap pool identifier and controls valid liquidity range boundaries. The current value `200` represents about 2.02% between allowed boundaries; it does not make swap prices move in fixed 2.02% increments.

Use exact-input while a pool's surcharge window is active. New Arc Standard pools have equal opening and base fees, so their stored 1-second window is inactive and adds no surcharge. Read the pool's frozen configuration for earlier launches; this does not imply exact-output support in a particular router or API. Encode optional hook data as the referrer address followed by a `bytes32` comment. Simulate at current timestamp and include slippage and deadline protection. Standard pools charge Hook fees in the paired asset, including the selected Stock Token for stock-paired markets. Tax quote credits use that asset too, while burn credits use launched tokens.

## Failure handling

For user launches, treat `StaleConfig` and `LaunchExpired` as refresh-and-rebuild errors. `StaleQuoteRevision` applies to restricted opening-price updates, not to launch submission. Treat quote removal, disabled creation, fee mismatch, invalid `01` suffix, salt reuse, immutability, and single-sided failures as blocking errors that require changed inputs or configuration. Do not silently fall back to another factory, route, or quote.

## BSC amounts and routing

Use chain ID `56` and the [BSC suite](https://docs.o1.exchange/launchpad/reference/production-contracts.md#bsc-mainnet). Native BNB uses the zero address. BSC USDC and the 21 registered bStocks use 18 decimals; do not copy six-decimal USDC amounts from another chain. Query quote registration, current fee, configuration version and creation switch before preparing the same ERC-20 `01`-suffix launch flow.

For native-funded Dev Buy, send the launch fee plus the buy amount. For ERC-20 funding, approve the current launch-buy adapter for the buy input and send only the native launch fee. Route descriptors supplied to the adapter retain eight fields; direct calls to the BSC SwapX router use its ten-field ABI. Reuse the exact chain-specific ABI rather than substituting another chain's router selector.

Token trading can use the paired asset or a supported BNB acquisition route. Registration does not ensure usable liquidity at every amount. BSC Public API exposure is separate from the deployed contracts; check the API's `/v1/config` before requesting chain 56.

## X Layer amounts and routing

Use chain ID `196` and the [X Layer suite](https://docs.o1.exchange/launchpad/reference/production-contracts.md#x-layer-mainnet). Native OKB uses the zero address with 18 decimals. USDC uses 6 decimals; xETH and the 45 wrapped stock quotes use 18 decimals. WOKB is a separate ERC-20; do not count it as spendable native OKB or substitute its address into a native launch pool. One OKB is `1000000000000000000` raw units. Stock pricing applies the wrapper-to-underlying conversion once. Arc-style shared native/ERC-20 balance accounting does not apply.

Ordinary creation sends exactly `nativeLaunchFee`, currently `20000000000000000` raw units (0.02 OKB). For a native-funded atomic Dev Buy, `fundingToken` is zero and transaction value is the fee plus `amountIn`, both in 18-decimal units. Reserve additional OKB for gas. Read the current configuration version, quote and adapter, prepare the immutable ERC-20 `01` address, and simulate before signing.

The generic adapter and X Layer SwapX router use the eight-field deadline ABI. Direct OKB buys send native value without an approval. Token sells through the native settlement route approve that proxy for launch tokens and receive native OKB. Atomic Dev Buy for a non-native quote requires an attached adapter that reports `nativeV3InputSupported() == true`. The generic adapter does not provide that capability. Check it before preparing quote acquisition, then simulate the complete route.

Collect canonical events from the originating deployment: X Layer Standard starts at block `70827259`, and Tax v2 at `71792691`. Preserve `(chainId, transactionHash, logIndex)` identity and historical factory attribution. Receipt and webhook hints are not additional trades. X Layer is supported by the current API implementation; verify the deployed release and suite availability through `/v1/config` before preparing transactions.

## Elysium amounts and routing

Use chain ID `99901` and the [Elysium suite](https://docs.o1.exchange/launchpad/reference/production-contracts.md#elysium-mainnet). Native HYPE uses the zero address with 18 decimals. USDC (`0xb47c4C8F73F009CC0C0d3f92B388d13E293F0B65`) uses 6 decimals. WHYPE (`0xbA876237B0F021A6c6D852d6c26E107997cC5E81`) is a separate ERC-20; do not count it as spendable native HYPE or substitute its address into a native launch pool. One HYPE is `1000000000000000000` raw units. Arc-style shared native/ERC-20 balance accounting does not apply.

Ordinary creation sends exactly `nativeLaunchFee`, currently `25000000000000000` raw units (0.025 HYPE), for either quote. For a HYPE-funded atomic Dev Buy, `fundingToken` is zero and transaction value is the fee plus `amountIn`, both in 18-decimal units. A USDC-paired launch takes a USDC-funded Dev Buy only, because Elysium has no HYPE/USDC Uniswap v3 pool: approve the suite's launch-buy adapter for the USDC input and send only the native launch fee. Reserve additional HYPE for gas. Read the current configuration version, quote and adapter, prepare the immutable ERC-20 `01` address, and simulate before signing.

Each suite binds its own `ElysiumSwapXLaunchBuyAdapter` to the Elysium SwapX router proxy `0x37DfD6117fcf065eda0B55D8547A78F8B2221987`. The adapter uses the eight-field deadline ABI, allows explicit wrapped-native input, reports `nativeV3InputSupported() == true`, caps external pool fees at 10,000 (1%) and disables external V4. Direct HYPE buys send native value without an approval. Token sells approve that proxy for launch tokens.

Collect canonical events from the originating deployment: Elysium Standard starts at block `307804`, and Tax v2 at `330297`. Preserve `(chainId, transactionHash, logIndex)` identity and historical factory attribution. Receipt and webhook hints are not additional trades.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.