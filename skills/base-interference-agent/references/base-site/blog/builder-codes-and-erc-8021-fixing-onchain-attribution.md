# blog/builder-codes-and-erc-8021-fixing-onchain-attribution

Source: https://www.base.org/blog/builder-codes-and-erc-8021-fixing-onchain-attribution.md

# Builder Codes & ERC-8021: Fixing Onchain Attribution

> ERC-8021 and Builder Codes provide a system for apps to prove their impact onchain and receive credit for the transactions they generate.

- Date: 2026-02-12
- Author: Conner Swenberg
- URL: https://www.base.org/blog/builder-codes-and-erc-8021-fixing-onchain-attribution

TL;DR: Base is building a global onchain flywheel: builders create apps, apps drive transacting users, and transacting users expand the market to attract more builders. To accelerate this cycle, we need to measure and reward the apps that generate real value. ERC-8021 and Builder Codes provide this missing layer: a system for apps to prove their impact onchain and receive credit for the transactions they generate.

## The Attribution Gap

**While anyone can link a transaction to a specific protocol, determining which app facilitated the transaction is difficult.**

Protocols are onchain smart contracts users interact with directly. For example: decentralized exchanges like Aerodrome or lending protocols like Morpho.

Apps are offchain entities that drive transactions for any use case. For example: web and mobile interfaces, trading bots, and backend automations.

Protocols are straightforward to track because all interaction data exists publicly onchain. Apps however have no native link to the transactions they facilitate.

This gap has real consequences. Without attribution data, chains can't measure which apps bring value to the ecosystem. Allocation of attention, distribution, and capital investments becomes manual guesswork rather than data-driven decision making. Builder Codes and ERC-8021 close this attribution gap and enable builders to compete for resources in a way that’s more open and transparent.

## Industry Inspiration

**Others have independently recognized and addressed this problem in their ecosystems, but not in a way reusable by everyone.**

Hyperliquid pioneered the term "Builder Codes" by allowing apps to annotate transactions to receive a portion of generated swap fees, creating measurable incentive alignment and rewarding the apps that drive real volume.

Polymarket followed with a similar implementation where apps can annotate transactions through their order book API to qualify for rewards.

Both solutions work well within their ecosystems, however they are isolated to specific use cases (Hyperliquid for perpetuals, Polymarket for prediction markets). To make transaction attribution work across Ethereum, we needed a general-purpose standard that any protocol can adopt.

## ERC-8021: Transaction Attribution for Ethereum

We wrote [ERC-8021](https://eip.tools/eip/8021) to enable attributing _any_ transaction on Ethereum _today_. To do this, we had to work under a couple constraints:

1. **It needs to work with Ethereum’s existing transaction format.** This enables shipping quickly for both nodes and apps by staying interoperable with existing code and tools.
2. **It needs to work regardless of what transactions are trying to do.** This enables us to serve all protocols with no integration effort and build developer network effects.

### Data Suffixes

To meet these constraints, we leverage an underutilized EVM property: smart contracts ignore extra data appended beyond expected function arguments. If you call a smart contract function with any additional data after function arguments, by default they are safely discarded without errors or reverts. Because this “data suffix” passes through without impacting execution, we can attribute safely and for any transaction type.

Here's what this looks like in practice:

![](https://www.base.org/images/blog/builder-codes-and-erc-8021-fixing-onchain-attribution/01.webp)

A smart contract only reads up through abi-encoded data (`0xabcd...1234`) to execute the interaction. The attribution data suffix (`0xaaaaaaaaaaaa`) passes through without affecting execution, but remains available in transaction data for analytics.

This pattern isn't new. Many teams already use it in production at scale including Aerodrome, Morpho and the Base App.

What's been missing is standardization. Each team implements their own format, making it difficult to parse attribution across different apps. **ERC-8021 solves this by defining one canonical data suffix. The standard supports both regular transactions and ERC-4337 user operations, ensuring compatibility with all wallet types.**

## Standardizing the Data Suffix Schema

ERC-8021 builds up its schema by solving three core problems: interoperability, extensibility, and identity. Let's derive the format from first principles.

**Problem 1: Interoperability**

Existing attribution methods struggled with interoperable detection. While a specific app can append a custom data suffix they know to look for, how does a separate party discern if transaction data ends with attribution or not? Without a standard marker, every parser needs custom logic for every attribution format.

ERC-8021 solves this with a constant marker at the end of every data suffix: `0x80218021802180218021802180218021` (16 bytes of "8021" repeated). This enables parsers to reliably detect attribution is present by checking if the last 16 bytes match the standard marker. The probability of accidental collision with this specific 16-byte sequence is negligibly low (1 in 2^128), making it a reliable detection mechanism.

```
ercMarker = 0x80218021802180218021802180218021
attributionData = 0xaaaaaaaaaaaa
dataSuffix = attributionData + ercMarker
 = 0xaaaaaaaaaaaa80218021802180218021802180218021
```

**Problem 2: Extensibility**

Attribution needs will evolve. Today's format might not serve tomorrow's use cases for new attribution types, more efficient encoding, additional metadata fields, and more. We needed a versioning mechanism to iterate without breaking existing implementations.

ERC-8021 adds a one byte schemaId immediately before the ercMarker to identify how to parse additional preceding schemaData. This single byte provides 256 possible schema versions, each defining how to parse the actual attribution data.

```
ercMarker = 0x80218021802180218021802180218021
schemaId = 0x00
schemaData = 0xaaaaaaaaaaaa
dataSuffix = schemaData + schemaId + ercMarker
           = 0xaaaaaaaaaaaa0080218021802180218021802180218021
```

The suffix is designed to be parsed backwards from the end of calldata:

1. Extract last 16 bytes → verify ercMarker matches standard
2. Extract previous byte → switch on schemaId to determine parsing rules
3. Parse remaining bytes according to schema specification

**Problem 3: Identity**

For attribution to be useful, it needed to help identify who gets credit for a transaction. Existing candidates to identify this were Ethereum addresses, app names, and website domains, but each of them compromises on an important property. The ideal identifier is small and can link to additional information as needed.

ERC-8021 chooses "codes" as string-based identifiers (e.g. "abc123"). Codes are familiar to developers, mapping to concepts like referral codes in traditional apps, and are human-readable for debugging.

ERC-8021 also defines a Code Registry smart contract where codes can be registered and their additional related information read from, generally splitting into either onchain or offchain metadata.

**Onchain metadata** enables protocol rewards. Protocols can query where rewards credited to a code should be sent to. For example, a DEX could reward the frontends generating the most trades.

**Offchain metadata** enables app discovery. By associating codes with app names and domains, we create a transparent view of the ecosystem. Public dashboards can surface top apps by transaction volume, turning onchain usage data into a distribution channel for users to find new apps.

Anyone can deploy their own Code Registry so long as it adheres to the standardized interface. Different ecosystems can run their own registries with custom rules while still enabling others to parse attribution and query related information.

```
interface ICodeRegistry {
    /// @notice Returns the address where protocols should send rewards
    /// @dev This enables anyone to distribute rewards to an app that drove volume
     function payoutAddress(string memory code) external view returns (address);

    /// @notice Returns a URI to fetch offchain metadata (app name, website, logo)
 /// @dev This enables building discovery interfaces and leaderboards
    function codeURI(string memory code) external view returns (string memory);

    /// @notice Checks if a code follows format rules (character set, length constraints)
    /// @dev Parsers use this to filter malformed data
    function isValidCode(string memory code) external view returns (bool);

    /// @notice Verifies a code has been registered
    function isRegistered(string memory code) external view returns (bool);
}
```

### End-to-End Flow

Let's walk through how ERC-8021 works in practice, from registration through transaction submission and parsing.

**Step 1: Register a Code**

An app registers a code (e.g., "baseapp") with a unique Code Registry. The registry stores onchain metadata and a pointer to offchain metadata for the code.

**Step 2: Encode the Data Suffix**

When preparing a transaction, the first app injects their code into an ERC-8021 data suffix (real example below):

```
ercMarker = 0x80218021802180218021802180218021
schemaId = 0x00
codesLength = 7
codes = ["baseapp"]
schemaData = codes.join(",") + codesLength
           = 0x6261736561707007
dataSuffix = schemaData + schemaId + ercMarker
           = 0x62617365617070070080218021802180218021802180218021
```

**Step 3: Append Data Suffix to Transaction Data**

The app then appends this data suffix to the transaction data:

```
transaction.data = abiEncodedData + dataSuffix
                 = 0xabcd...1234 + 0x62617365617070070080218021802180218021802180218021
                 = 0xabcd...123462617365617070070080218021802180218021802180218021
```

**Step 4: Submit Transaction as Normally**

After the transaction is prepared, it can be signed and submitted by the app directly or through prompting the user to do so with their wallet.

**Step 5: Parse and Attribute**

After the transaction is confirmed onchain, analytics tools parse its data for attribution:

1. Check last 16 bytes for `ercMarker` → confirms ERC-8021 format
2. Read `schemaId` byte → determines parsing rules
3. (Given schema 0 in this example) Extract codes length and codes array → `"baseapp"`
4. Query registry for payout address and metadata matching `”baseapp”` code

The result: universal, interoperable transaction attribution across Ethereum. Learn more by reading the [official specification](https://eip.tools/eip/8021).

## Base Builder Codes

**Base aims for every transaction to be attributed with ERC-8021** to inform how we prioritize our attention, distribution, investment capital, and rewards for the teams that grow Base's global economy.

To make this happen, we’re launching Base Builder Codes: the first ERC-8021 Code Registry. Apps that opt-in and append Base Builder Codes to their transactions can make it on our [public leaderboard](https://base.dev/leaderboard). Anyone can claim a Base Builder Code through base.dev for free today.

Several key partners in the Base ecosystem have already agreed to implement ERC-8021 builder codes on Base to help close the attribution gap: Aerodrome, Avantis, Bitget, Clanker, Definitive, Flaunch, Hydrex, Jumper, Kyber, Limitless, Maestro, Mamo, Moonwell, o1, PancakeSwap, Privy, Rips, Sigma, Slab, Sport.Fun, Swissborg, Treble, Turnkey, Virtuals, and more.

![](https://www.base.org/images/blog/builder-codes-and-erc-8021-fixing-onchain-attribution/02.webp)

For additional details on our smart contract implementation, read more at github.com/base/builder-codes.

## Integrating Base Builder Codes

Integrating Base Builder Codes impacts how you prepare transactions and potentially how you submit them, depending on the wallet stack your app uses.

There are typically three wallet types that apps can submit transactions from:

1. **Universal wallets**: Third party experiences brought by users (e.g. Base App, MetaMask)
2. **Embedded wallets**: Provisioned by apps for each user (e.g. Privy, CDP Embedded Wallet)
3. **Server wallets**: Managed by apps server-side independently (e.g. Turnkey, CDP Server Wallet)

**If you're a wallet provider**: You need to expose a way for apps to customize transaction data. For universal wallets, this likely means implementing ERC-5792's `wallet_sendCalls` with the `dataSuffix` capability. For embedded and server wallets, this likely means ensuring apps have a means to append manually to transactions via your APIs and SDKs. ERC-4337 accounts may require additional work to support data suffix appending for user operations. Read more [here](https://docs.base.org/base-chain/builder-codes/wallet-developers?utm_source=base_dot_org).

**If you're an app**: The integration path depends on your wallet model. Apps with direct control over signing (embedded or server wallets) can manually append data suffixes. Apps using universal wallets rely on the `dataSuffix` capability in `wallet_sendCalls`. Read more [here](https://docs.base.org/base-chain/builder-codes/app-developers?utm_source=base_dot_org).

### Frontend Integration with Universal Wallets

These apps enable users to bring their own wallet to authenticate and use onchain funds. Users connect via web popups, browser extensions, mobile wallets, and more.

Apps submit transactions with Universal Wallets through standardized wallet APIs. Wallets can customize how they render these requests to users, facilitate signing, and transaction submission. We recommend using the `wallet_sendCalls` method with a `dataSuffix` capability:

```
// Sample ERC-8021 attribution for "baseapp" from earlier
const response = await provider.request({
 method: 'wallet_sendCalls',
 params: [{
 calls: [{
 to: protocolAddress,
 data: encodedCalldata,
 value: '0x0'
 }],
 capabilities: {
 dataSuffix: {
 value: '0x62617365617070070080218021802180218021802180218021'
 optional: true
 }
 }
 }]
});
```

We also recommend using the [Wagmi](https://wagmi.sh/) library for convenience where you can specify a default `dataSuffix` to auto-apply to your transaction requests.

### Frontend Integration with Embedded Wallets

These apps enable users to receive and use wallets in an invisible manner while preserving degrees of non-custodial ownership. Users login with traditional offchain methods (e.g. phone number, email) and typically treat their account as bounded to the app.

Apps submit transactions with Embedded Wallets through their provider’s SDKs and/or APIs. Since the app has control over transaction signing, you can manually append data suffixes to transaction data and directly sign. Most embedded wallet SDKs now support `dataSuffix` parameters directly in their interfaces.

For example, you can reference these guides from [Coinbase](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-hooks/Functions/useSendUserOperation) and [Privy](https://docs.privy.io/recipes/evm/base-builder-codes#integrating-base-builder-codes).

### Backend Integration with Server Wallets

These apps transact directly from their own servers, often with keys managed by third party providers.

Apps submit transactions with Server Wallets through their provider’s SDKs and/or APIs. This works nearly identically to embedded wallets: append your ERC-8021 formatted suffix to transaction data before signing and sending.

## Start Attributing Today

The foundation for a globally attributable and rewarded onchain economy is here. ERC-8021 and Base Builder Codes are the missing layer to identify the apps that generate real value.

Close the attribution gap for your app, plug into the Base flywheel, and show off your contributions to the onchain economy.

Claim your Base Builder Code and start attributing today at [base.dev](https://base.dev). We look forward to seeing what you build!

**More resources:**

- ERC-8021 Standard: [eip.tools/eip/8021](https://eip.tools/eip/8021)
- Base Builder Codes: [github.com/base/builder-codes](https://github.com/base/builder-codes)
- Integration Guide: [docs.base.org/base-chain/quickstart/builder-codes](https://docs.base.org/base-chain/quickstart/builder-codes?utm_source=base_dot_org)
