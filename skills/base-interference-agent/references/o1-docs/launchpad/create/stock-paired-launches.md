> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Stock-paired launches

> Launch a Base, Robinhood, BSC, Monad or X Layer token against a supported Stock Token with permanent Uniswap v4 liquidity and stock-denominated trading fees.

Stock-paired launches let a creator open a market between a new o1 launch token and a supported Stock Token on Base, Robinhood, BSC, Monad or X Layer. The Stock Token is the pool's paired asset, so it sets the opening-price reference, is used to buy the launch token, and is received when the launch token is sold.

> [card] Choose your stock pair
>
> Choose from the supported Stock Tokens on Base, Robinhood, BSC, Monad or X Layer.

> [card] Current creation fee
>
> Stock-paired launches use the same creation fee as crypto-paired launches: 0.001 ETH on Base and Robinhood, 0.003 BNB on BSC, 100 MON on Monad, and 0.02 OKB on X Layer. Network gas is additional.

> [card] Fees paid in the stock token
>
> Recipient fees use the selected Stock Token. On Base, Robinhood, BSC, Monad and X Layer Tax, dividends also use it; the burn allocation uses launched tokens.

> [card] Permanent liquidity
>
> The new token's pool supply enters a token-only Uniswap v4 position that cannot be removed.

## How a stock-paired market works

**1. Choose Stocks**

Select Base, Robinhood, BSC, Monad or X Layer, open the Stocks market, and choose one of the supported Stock Tokens for that chain.

**2. Configure the launch**

Add the token identity, public profile, and profile-editing preference.

**3. Review the stock pair**

The launch review shows the selected Stock Token, fixed supply, opening-value estimate, permanent liquidity, and current creation fee.

**4. Create the market**

The launch creates a fixed-supply token and opens its Uniswap v4 pool with permanent liquidity. No Stock Token liquidity deposit is required from the creator.

The resulting launch token address ends in `01`. The address is prepared after the final token metadata is ready and remains part of the same wallet-signed launch flow.

## Trading and fees

For a launch paired with any supported Stock Token:

* buyers pay the paired Stock Token and receive launch tokens;
* sellers return launch tokens and receive the paired Stock Token;
* Standard tokens use their configured ordinary swap fee in that paired Stock Token;
* Standard creator/platform/referrer credits and Tax creator/protocol/integrator credits use that Stock Token;
* Standard anti-sniping follows its pool's frozen schedule; Tax uses the creator's opt-in and selected buy/sell totals.

With Tax on Base, Robinhood, BSC, Monad and X Layer, creators can also allocate rewards to [holder dividends](https://docs.o1.exchange/launchpad/tax/dividends.md) paid in the Stock Token, or to [burns](https://docs.o1.exchange/launchpad/tax/burns.md) of the token they launch. Choose from the supported pairs shown on the create page.

The selected Stock Token is an existing onchain asset supplied by its provider. Creating an o1 launch token does not create, modify, or administer the paired Stock Token.

USD estimates use the available current price for the selected Stock Token. If that price is missing or stale, the interface preserves an unavailable or partial-data state instead of substituting a guessed value.

## Chain availability

| Chain | Supported stock pairs |
| - | - |
| Base mainnet | [Base Stock Tokens](#base-stock-token-catalog), for Standard and Tax launches |
| Robinhood Chain | [Robinhood Stock Tokens](#robinhood-stock-token-catalog), for Standard and Tax launches |
| BSC mainnet | [bStocks](#bsc-bstock-catalog), for Standard and Tax launches |
| X Layer mainnet | [Wrapped stocks](#x-layer-stock-token-catalog), for Standard and Tax launches |
| Monad mainnet | [Wrapped xStocks](#monad-stock-token-catalog), for Standard and Tax launches |

The create page shows which pairs are currently available for your selected chain and token type. Arc and Elysium support crypto pairs only.

## Base Stock Token catalog

**Last updated: November 24, 2026.** The Base catalog contains **418 Stock Tokens** for Standard and Tax launches, listed A-Z below. All use 8 decimals. The Create page checks current availability for the selected product automatically.

Both products have a 0.001 ETH launch fee, plus gas. See [Live configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md) for separately dated settings.

The [machine-readable catalog](https://docs.o1.exchange/launchpad/reference/base-stock-quotes.json) includes the complete list under `catalog`. Its `quotes` array and the [Tax snapshot](https://docs.o1.exchange/launchpad/reference/base-tax-suite.json) retain their separately dated onchain configuration observations. Starting ticks and revisions belong to the selected factory. **VVV here means Valvoline**, not the separate Venice Token crypto quote.

| Symbol | Paired asset | Base token |
| - | - | - |
| AAL | American Airlines Group Inc. | [`0xB2000000000000000000004FeB8D277Dd14b08Bb`](https://basescan.org/address/0xB2000000000000000000004FeB8D277Dd14b08Bb) |
| AAOI | Applied Optoelectronics Inc | [`0xb200000000000000000000cf36D05963A3E2205c`](https://basescan.org/address/0xb200000000000000000000cf36D05963A3E2205c) |
| AAP | Advance Auto Parts, Inc. | [`0xB200000000000000000000B576d2d93De1e93c8e`](https://basescan.org/address/0xB200000000000000000000B576d2d93De1e93c8e) |
| AAPL | Apple Inc. | [`0xb200000000000000000000C2e324d24d7eEcd1fb`](https://basescan.org/address/0xb200000000000000000000C2e324d24d7eEcd1fb) |
| ABNB | Airbnb, Inc. | [`0xb200000000000000000000045beafafBE0Dc7664`](https://basescan.org/address/0xb200000000000000000000045beafafBE0Dc7664) |
| ABSI | Absci Corporation | [`0xb20000000000000000000010718397ACA876A20a`](https://basescan.org/address/0xb20000000000000000000010718397ACA876A20a) |
| ABT | Abbott Laboratories | [`0xb200000000000000000000D6351D2Eb7ED29bf0b`](https://basescan.org/address/0xb200000000000000000000D6351D2Eb7ED29bf0b) |
| ACHR | Archer Aviation Inc. | [`0xb2000000000000000000008a494D531D88cF55d6`](https://basescan.org/address/0xb2000000000000000000008a494D531D88cF55d6) |
| ACI | Albertsons Companies, Inc. | [`0xB200000000000000000000964eeD57D188766e55`](https://basescan.org/address/0xB200000000000000000000964eeD57D188766e55) |
| ACMR | ACM Research, Inc. | [`0xB200000000000000000000Bd0EA991Ec5B5A8A03`](https://basescan.org/address/0xB200000000000000000000Bd0EA991Ec5B5A8A03) |
| ADBE | Adobe Inc. | [`0xB20000000000000000000034533Ed3961f222Cd4`](https://basescan.org/address/0xB20000000000000000000034533Ed3961f222Cd4) |
| ADI | Analog Devices, Inc. | [`0xB200000000000000000000c33e458d1f892A7917`](https://basescan.org/address/0xB200000000000000000000c33e458d1f892A7917) |
| AEHR | Aehr Test Systems | [`0xb2000000000000000000001775Bd17f2289DE527`](https://basescan.org/address/0xb2000000000000000000001775Bd17f2289DE527) |
| AEO | American Eagle Outfitters, Inc. | [`0xB2000000000000000000006064f8EC027f042294`](https://basescan.org/address/0xB2000000000000000000006064f8EC027f042294) |
| AFRM | Affirm Holdings, Inc. | [`0xb200000000000000000000896d4cF2f1866d9bCe`](https://basescan.org/address/0xb200000000000000000000896d4cF2f1866d9bCe) |
| AI | C3.ai, Inc. | [`0xb20000000000000000000072B5C2B2D18Ee8A2a5`](https://basescan.org/address/0xb20000000000000000000072B5C2B2D18Ee8A2a5) |
| ALAB | Astera Labs, Inc. | [`0xb200000000000000000000476C5a355AbE1a2794`](https://basescan.org/address/0xb200000000000000000000476C5a355AbE1a2794) |
| ALL | The Allstate Corporation | [`0xb2000000000000000000009B05748Ece723cc6A6`](https://basescan.org/address/0xb2000000000000000000009B05748Ece723cc6A6) |
| ALNT | Allient Inc. | [`0xB20000000000000000000011EEA811eAEdb29156`](https://basescan.org/address/0xB20000000000000000000011EEA811eAEdb29156) |
| AMAT | Applied Materials, Inc. | [`0xb2000000000000000000009C1A6794874DdAb197`](https://basescan.org/address/0xb2000000000000000000009C1A6794874DdAb197) |
| AMC | AMC Entertainment Holdings, Inc. | [`0xB200000000000000000000CD7e6b8042cb7c2BB5`](https://basescan.org/address/0xB200000000000000000000CD7e6b8042cb7c2BB5) |
| AMD | Advanced Micro Devices, Inc. | [`0xB2000000000000000000000d8Ce462E99ee7A47B`](https://basescan.org/address/0xB2000000000000000000000d8Ce462E99ee7A47B) |
| AMGN | Amgen Inc. | [`0xB20000000000000000000049d38a179C97E33381`](https://basescan.org/address/0xB20000000000000000000049d38a179C97E33381) |
| AMKR | Amkor Technology, Inc. | [`0xb2000000000000000000002C8b0e3d7Ff26f81a0`](https://basescan.org/address/0xb2000000000000000000002C8b0e3d7Ff26f81a0) |
| AMPX | Amprius Technologies, Inc. | [`0xB2000000000000000000007c7088757Cb3703648`](https://basescan.org/address/0xB2000000000000000000007c7088757Cb3703648) |
| AMZN | Amazon.com Inc. | [`0xb200000000000000000000d9192b6B456483C2E8`](https://basescan.org/address/0xb200000000000000000000d9192b6B456483C2E8) |
| ANET | Arista Networks, Inc. | [`0xB200000000000000000000E71D4E45D1421251cb`](https://basescan.org/address/0xB200000000000000000000E71D4E45D1421251cb) |
| ANF | Abercrombie & Fitch Co. | [`0xb20000000000000000000019641B253b3e2c8A24`](https://basescan.org/address/0xb20000000000000000000019641B253b3e2c8A24) |
| ANNX | Annexon, Inc. | [`0xB200000000000000000000473F033036350312Da`](https://basescan.org/address/0xB200000000000000000000473F033036350312Da) |
| ANT | Anthropic, PBC | [`0xb20000000000000000000016e38FD364d271Ba28`](https://basescan.org/address/0xb20000000000000000000016e38FD364d271Ba28) |
| APLD | Applied Digital Corporation | [`0xb2000000000000000000007Cbdf8fa3861E51721`](https://basescan.org/address/0xb2000000000000000000007Cbdf8fa3861E51721) |
| APP | AppLovin Corporation | [`0xb20000000000000000000006f910a0e7BBD3c168`](https://basescan.org/address/0xb20000000000000000000006f910a0e7BBD3c168) |
| ARM | Arm Holdings plc | [`0xB20000000000000000000026215D755356E5043f`](https://basescan.org/address/0xB20000000000000000000026215D755356E5043f) |
| ASST | Strive, Inc. | [`0xb2000000000000000000002Cd78D7C981e97c330`](https://basescan.org/address/0xb2000000000000000000002Cd78D7C981e97c330) |
| ASTS | AST SpaceMobile, Inc. | [`0xB200000000000000000000B1a29cF17A1819288a`](https://basescan.org/address/0xB200000000000000000000B1a29cF17A1819288a) |
| AUR | Aurora Innovation, Inc. | [`0xb200000000000000000000cF62D7125cC77D2F96`](https://basescan.org/address/0xb200000000000000000000cF62D7125cC77D2F96) |
| AVAV | AeroVironment, Inc. | [`0xb200000000000000000000D0d00a5e1f2D2eb61A`](https://basescan.org/address/0xb200000000000000000000D0d00a5e1f2D2eb61A) |
| AVGO | Broadcom Inc. | [`0xB200000000000000000000Fc737aeA6196aB5a4c`](https://basescan.org/address/0xB200000000000000000000Fc737aeA6196aB5a4c) |
| AXON | Axon Enterprise, Inc. | [`0xb2000000000000000000004cc3E96cEb78541d33`](https://basescan.org/address/0xb2000000000000000000004cc3E96cEb78541d33) |
| AXP | American Express Company | [`0xb2000000000000000000009CFe164A21cB5a11C5`](https://basescan.org/address/0xb2000000000000000000009CFe164A21cB5a11C5) |
| AXTI | AXT Inc | [`0xb200000000000000000000A640Ec8C1de0EFb484`](https://basescan.org/address/0xb200000000000000000000A640Ec8C1de0EFb484) |
| BA | The Boeing Company | [`0xB200000000000000000000Fd10D35a781efB5C2F`](https://basescan.org/address/0xB200000000000000000000Fd10D35a781efB5C2F) |
| BAC | Bank of America Corporation | [`0xB200000000000000000000E3e784CDF88Df2959d`](https://basescan.org/address/0xB200000000000000000000E3e784CDF88Df2959d) |
| BALL | Ball Corporation | [`0xb200000000000000000000747BFfA52Fe2C2510B`](https://basescan.org/address/0xb200000000000000000000747BFfA52Fe2C2510B) |
| BBAI | BigBear.ai Holdings, Inc. | [`0xb200000000000000000000898eD394469DB1845C`](https://basescan.org/address/0xb200000000000000000000898eD394469DB1845C) |
| BE | Bloom Energy Corporation | [`0xb20000000000000000000016f9dfe862feBA122b`](https://basescan.org/address/0xb20000000000000000000016f9dfe862feBA122b) |
| BEAM | Beam Therapeutics Inc. | [`0xB200000000000000000000dA21e7163dC02c0616`](https://basescan.org/address/0xB200000000000000000000dA21e7163dC02c0616) |
| BIDU | Baidu, Inc. | [`0xb200000000000000000000d2b7D9aeE52F6C6BEf`](https://basescan.org/address/0xb200000000000000000000d2b7D9aeE52F6C6BEf) |
| BIIB | Biogen Inc. | [`0xB20000000000000000000077bbd6469ecFE8c0b4`](https://basescan.org/address/0xB20000000000000000000077bbd6469ecFE8c0b4) |
| BILI | Bilibili Inc. | [`0xb200000000000000000000ca7C6D1438e7245eb6`](https://basescan.org/address/0xb200000000000000000000ca7C6D1438e7245eb6) |
| BIRD | Smartbird, Inc. | [`0xB200000000000000000000535fE96f18204BFD96`](https://basescan.org/address/0xB200000000000000000000535fE96f18204BFD96) |
| BJ | BJ's Wholesale Club Holdings, Inc. | [`0xB200000000000000000000082f7FEA8F2eE8f438`](https://basescan.org/address/0xB200000000000000000000082f7FEA8F2eE8f438) |
| BKSY | BlackSky Technology Inc. | [`0xB200000000000000000000bC4d895DF1eEeD1d06`](https://basescan.org/address/0xB200000000000000000000bC4d895DF1eEeD1d06) |
| BLNK | Blink Charging Co. | [`0xB2000000000000000000004EC7c19212979672F9`](https://basescan.org/address/0xB2000000000000000000004EC7c19212979672F9) |
| BMNR | BitMine Immersion Technologies, Inc. | [`0xB200000000000000000000eA2df44A307CaB279C`](https://basescan.org/address/0xB200000000000000000000eA2df44A307CaB279C) |
| BNC | BNB Standard Corporation | [`0xb2000000000000000000008c1bAD82Fa061F818a`](https://basescan.org/address/0xb2000000000000000000008c1bAD82Fa061F818a) |
| BOOT | Boot Barn Holdings, Inc. | [`0xB2000000000000000000003E5e2892158e25DD7b`](https://basescan.org/address/0xB2000000000000000000003E5e2892158e25DD7b) |
| BRK.B | Berkshire Hathaway Inc. Class B | [`0xb20000000000000000000024170488e788CBbCb4`](https://basescan.org/address/0xb20000000000000000000024170488e788CBbCb4) |
| BROS | Dutch Bros Inc. | [`0xB2000000000000000000001ECFAcCd9047D3B544`](https://basescan.org/address/0xB2000000000000000000001ECFAcCd9047D3B544) |
| BUD | Anheuser-Busch InBev SA/NV | [`0xB200000000000000000000c36ce081Dd09e86cA2`](https://basescan.org/address/0xB200000000000000000000c36ce081Dd09e86cA2) |
| BW | Babcock & Wilcox Enterprises, Inc. | [`0xb200000000000000000000F9274fE22C626373F2`](https://basescan.org/address/0xb200000000000000000000F9274fE22C626373F2) |
| BX | Blackstone Inc. | [`0xB200000000000000000000645c1Ec509E4261682`](https://basescan.org/address/0xB200000000000000000000645c1Ec509E4261682) |
| BYND | Beyond Meat, Inc. | [`0xB200000000000000000000801830b13b8E493423`](https://basescan.org/address/0xB200000000000000000000801830b13b8E493423) |
| BZFD | BuzzFeed, Inc. | [`0xB20000000000000000000084B031036E4dc7515B`](https://basescan.org/address/0xB20000000000000000000084B031036E4dc7515B) |
| CADL | Candel Therapeutics, Inc. | [`0xb200000000000000000000593460934fEC1b43Dc`](https://basescan.org/address/0xb200000000000000000000593460934fEC1b43Dc) |
| CAKE | Cheesecake Factory Inc | [`0xb200000000000000000000f215E4C890CFb7176B`](https://basescan.org/address/0xb200000000000000000000f215E4C890CFb7176B) |
| CAN | Canaan Inc. | [`0xB200000000000000000000f32d61BA597EDdFbfd`](https://basescan.org/address/0xB200000000000000000000f32d61BA597EDdFbfd) |
| CAT | Caterpillar Inc. | [`0xB2000000000000000000005de7f2E0AcA219c070`](https://basescan.org/address/0xB2000000000000000000005de7f2E0AcA219c070) |
| CAVA | CAVA Group, Inc. | [`0xb2000000000000000000001b6e407239EB31EDCf`](https://basescan.org/address/0xb2000000000000000000001b6e407239EB31EDCf) |
| CBRS | Cerebras Systems Inc. | [`0xb200000000000000000000720133EeDF525f93E2`](https://basescan.org/address/0xb200000000000000000000720133EeDF525f93E2) |
| CC | The Chemours Company | [`0xB200000000000000000000E359b2ca361E1905C9`](https://basescan.org/address/0xB200000000000000000000E359b2ca361E1905C9) |
| CEG | Constellation Energy Corporation | [`0xb200000000000000000000Da9874B62B55e791b5`](https://basescan.org/address/0xb200000000000000000000Da9874B62B55e791b5) |
| CELH | Celsius Holdings, Inc. | [`0xB2000000000000000000004161B4168d03841511`](https://basescan.org/address/0xB2000000000000000000004161B4168d03841511) |
| CGNX | Cognex Corporation | [`0xB2000000000000000000002451aF655AE942308D`](https://basescan.org/address/0xB2000000000000000000002451aF655AE942308D) |
| CHPT | ChargePoint Holdings, Inc. | [`0xB2000000000000000000001cA01a48688eC7D3CC`](https://basescan.org/address/0xB2000000000000000000001cA01a48688eC7D3CC) |
| CHWY | Chewy, Inc. | [`0xb200000000000000000000A5E12a1842DfcDb118`](https://basescan.org/address/0xb200000000000000000000A5E12a1842DfcDb118) |
| CIEN | Ciena Corporation | [`0xB2000000000000000000008258e8647CEa5F4A19`](https://basescan.org/address/0xB2000000000000000000008258e8647CEa5F4A19) |
| CIFR | Cipher Digital Inc. | [`0xB200000000000000000000690275843B6e246286`](https://basescan.org/address/0xB200000000000000000000690275843B6e246286) |
| CLF | Cleveland-Cliffs Inc. | [`0xb200000000000000000000bf75A42183508f2614`](https://basescan.org/address/0xb200000000000000000000bf75A42183508f2614) |
| CLOV | Clover Health Investments, Corp. | [`0xb20000000000000000000055e63C4c1cDC6b7A36`](https://basescan.org/address/0xb20000000000000000000055e63C4c1cDC6b7A36) |
| CLSK | CleanSpark, Inc. | [`0xB200000000000000000000fa63cFFF5c794dbB95`](https://basescan.org/address/0xB200000000000000000000fa63cFFF5c794dbB95) |
| CMCSA | Comcast Corporation | [`0xb2000000000000000000003bd46dbdE905508B16`](https://basescan.org/address/0xb2000000000000000000003bd46dbdE905508B16) |
| CMG | Chipotle Mexican Grill, Inc. | [`0xB200000000000000000000E4A60215E10D6D8c2b`](https://basescan.org/address/0xB200000000000000000000E4A60215E10D6D8c2b) |
| COHR | Coherent Corp. | [`0xB200000000000000000000A8C925F62e6D194715`](https://basescan.org/address/0xB200000000000000000000A8C925F62e6D194715) |
| COHU | Cohu, Inc. | [`0xb20000000000000000000007b4Fcc48E2d70dCc6`](https://basescan.org/address/0xb20000000000000000000007b4Fcc48E2d70dCc6) |
| COIN | Coinbase Global Inc. | [`0xb200000000000000000000c85a31389D71F3ecfb`](https://basescan.org/address/0xb200000000000000000000c85a31389D71F3ecfb) |
| COMP | Compass, Inc. | [`0xB200000000000000000000A1d16a625A68F38811`](https://basescan.org/address/0xB200000000000000000000A1d16a625A68F38811) |
| COP | ConocoPhillips | [`0xB200000000000000000000eC622942B76a2d3b21`](https://basescan.org/address/0xB200000000000000000000eC622942B76a2d3b21) |
| CORZ | Core Scientific, Inc. | [`0xB2000000000000000000001aaa9010Cd65f82c5E`](https://basescan.org/address/0xB2000000000000000000001aaa9010Cd65f82c5E) |
| CPNG | Coupang, Inc. | [`0xB20000000000000000000038e9982fE875b7E066`](https://basescan.org/address/0xB20000000000000000000038e9982fE875b7E066) |
| CRCL | Circle Internet Group Inc. | [`0xB20000000000000000000019f6E7C675b73C2e4D`](https://basescan.org/address/0xB20000000000000000000019f6E7C675b73C2e4D) |
| CRM | Salesforce, Inc. | [`0xB2000000000000000000006432a3a7991e718DBB`](https://basescan.org/address/0xB2000000000000000000006432a3a7991e718DBB) |
| CRMD | CorMedix Inc. | [`0xb200000000000000000000386f243773D48a4Be7`](https://basescan.org/address/0xb200000000000000000000386f243773D48a4Be7) |
| CROX | Crocs, Inc. | [`0xb200000000000000000000431a5C1E48E3b1d130`](https://basescan.org/address/0xb200000000000000000000431a5C1E48E3b1d130) |
| CRVS | Corvus Pharmaceuticals, Inc. | [`0xB200000000000000000000Cf9b4854BEb312e351`](https://basescan.org/address/0xB200000000000000000000Cf9b4854BEb312e351) |
| CRWD | CrowdStrike Holdings, Inc. | [`0xb200000000000000000000A0dE75786C9f8fC58c`](https://basescan.org/address/0xb200000000000000000000A0dE75786C9f8fC58c) |
| CRWV | CoreWeave, Inc. | [`0xB200000000000000000000F111184A74720787E6`](https://basescan.org/address/0xB200000000000000000000F111184A74720787E6) |
| CSCO | Cisco Systems, Inc. | [`0xb20000000000000000000015776Ea82655C4F034`](https://basescan.org/address/0xb20000000000000000000015776Ea82655C4F034) |
| CVNA | Carvana Co. | [`0xb200000000000000000000Ffb10718f880A48274`](https://basescan.org/address/0xb200000000000000000000Ffb10718f880A48274) |
| CVX | Chevron Corporation | [`0xB2000000000000000000003bf350E420c13e431a`](https://basescan.org/address/0xB2000000000000000000003bf350E420c13e431a) |
| DASH | DoorDash, Inc. | [`0xb200000000000000000000bf391678bf2e38CedB`](https://basescan.org/address/0xb200000000000000000000bf391678bf2e38CedB) |
| DAVE | Dave Inc. | [`0xb2000000000000000000009BBA9A926f19cfF8e7`](https://basescan.org/address/0xb2000000000000000000009BBA9A926f19cfF8e7) |
| DDOG | Datadog, Inc. | [`0xb2000000000000000000002C99976e240eD773E6`](https://basescan.org/address/0xb2000000000000000000002C99976e240eD773E6) |
| DECK | Deckers Outdoor Corporation | [`0xb200000000000000000000B85ffF48d4a26C3145`](https://basescan.org/address/0xb200000000000000000000B85ffF48d4a26C3145) |
| DELL | Dell Technologies Inc. | [`0xb20000000000000000000050fE6d1Ef35B02E8fD`](https://basescan.org/address/0xb20000000000000000000050fE6d1Ef35B02E8fD) |
| DHR | Danaher Corporation | [`0xB2000000000000000000001bcF0441201d513Fa5`](https://basescan.org/address/0xB2000000000000000000001bcF0441201d513Fa5) |
| DIS | The Walt Disney Company | [`0xb2000000000000000000000bD75bF439A38bF7DF`](https://basescan.org/address/0xb2000000000000000000000bD75bF439A38bF7DF) |
| DJT | Trump Media & Technology Group Corp. | [`0xb200000000000000000000428E3a3eebBb20692B`](https://basescan.org/address/0xb200000000000000000000428E3a3eebBb20692B) |
| DKNG | DraftKings Inc. | [`0xb2000000000000000000009b870441031D4d8A41`](https://basescan.org/address/0xb2000000000000000000009b870441031D4d8A41) |
| DKS | DICK'S Sporting Goods, Inc. | [`0xB2000000000000000000008463bf2557B483AbF9`](https://basescan.org/address/0xB2000000000000000000008463bf2557B483AbF9) |
| DNA | Ginkgo Bioworks Holdings, Inc. | [`0xB200000000000000000000CC17EEa8c9495E1499`](https://basescan.org/address/0xB200000000000000000000CC17EEa8c9495E1499) |
| DNUT | Krispy Kreme, Inc. | [`0xB2000000000000000000005c41b0018612629072`](https://basescan.org/address/0xB2000000000000000000005c41b0018612629072) |
| DOCN | DigitalOcean Holdings, Inc. | [`0xB20000000000000000000005bEFA57b9B871E737`](https://basescan.org/address/0xB20000000000000000000005bEFA57b9B871E737) |
| DRI | Darden Restaurants, Inc. | [`0xB2000000000000000000008451dB06977dEF7b3A`](https://basescan.org/address/0xB2000000000000000000008451dB06977dEF7b3A) |
| DUOL | Duolingo, Inc. | [`0xb200000000000000000000A613D12dEAfBBb1Db7`](https://basescan.org/address/0xb200000000000000000000A613D12dEAfBBb1Db7) |
| EAT | Brinker International, Inc. | [`0xB200000000000000000000808E9CCA9ED8e4Da61`](https://basescan.org/address/0xB200000000000000000000808E9CCA9ED8e4Da61) |
| EBAY | eBay Inc. | [`0xB2000000000000000000007578836b0Ff7780EB4`](https://basescan.org/address/0xB2000000000000000000007578836b0Ff7780EB4) |
| ELF | e.l.f. Beauty, Inc. | [`0xb2000000000000000000006b7f6966EE0453E251`](https://basescan.org/address/0xb2000000000000000000006b7f6966EE0453E251) |
| EMR | Emerson Electric Co. | [`0xB200000000000000000000FCD9C2A4Ee4A2B5481`](https://basescan.org/address/0xB200000000000000000000FCD9C2A4Ee4A2B5481) |
| ENPH | Enphase Energy, Inc. | [`0xB2000000000000000000007a90b2D9Ed101035A8`](https://basescan.org/address/0xB2000000000000000000007a90b2D9Ed101035A8) |
| ENVX | Enovix Corporation | [`0xB200000000000000000000BBc68170Eb0b049E42`](https://basescan.org/address/0xB200000000000000000000BBc68170Eb0b049E42) |
| ES | Eversource Energy | [`0xb200000000000000000000E90b1aC2DA02106417`](https://basescan.org/address/0xb200000000000000000000E90b1aC2DA02106417) |
| ETSY | Etsy, Inc. | [`0xB200000000000000000000Ba75b2046AAD1C0a13`](https://basescan.org/address/0xB200000000000000000000Ba75b2046AAD1C0a13) |
| EVER | EverQuote, Inc. | [`0xb200000000000000000000ad4Ca95Ce451578243`](https://basescan.org/address/0xb200000000000000000000ad4Ca95Ce451578243) |
| F | Ford Motor Company | [`0xB200000000000000000000CE4f8fC7ba5cA0359b`](https://basescan.org/address/0xB200000000000000000000CE4f8fC7ba5cA0359b) |
| FIG | Figma, Inc. | [`0xb2000000000000000000003Fa80315bFd87eFed8`](https://basescan.org/address/0xb2000000000000000000003Fa80315bFd87eFed8) |
| FIGR | Figure Technology Solutions, Inc. | [`0xb2000000000000000000005A41bef59807119850`](https://basescan.org/address/0xb2000000000000000000005A41bef59807119850) |
| FIGS | FIGS, Inc. | [`0xB2000000000000000000003EbE6a3A1Df07DB619`](https://basescan.org/address/0xB2000000000000000000003EbE6a3A1Df07DB619) |
| FIZZ | National Beverage Corp. | [`0xB200000000000000000000ee6fD7De967ea1A0DC`](https://basescan.org/address/0xB200000000000000000000ee6fD7De967ea1A0DC) |
| FLNC | Fluence Energy, Inc. | [`0xB200000000000000000000695b10DD3E1B0EA070`](https://basescan.org/address/0xB200000000000000000000695b10DD3E1B0EA070) |
| FLY | Firefly Aerospace Inc. | [`0xB2000000000000000000004fc7a0C25178A0D633`](https://basescan.org/address/0xB2000000000000000000004fc7a0C25178A0D633) |
| FMC | FMC Corporation | [`0xB2000000000000000000002756093a39E13E08c6`](https://basescan.org/address/0xB2000000000000000000002756093a39E13E08c6) |
| FOUR | Shift4 Payments, Inc. | [`0xB2000000000000000000008C02BE39ba2CbdA822`](https://basescan.org/address/0xB2000000000000000000008C02BE39ba2CbdA822) |
| FPS | Forgent Power Solutions, Inc. | [`0xb20000000000000000000095528Fb26aC48Bda96`](https://basescan.org/address/0xb20000000000000000000095528Fb26aC48Bda96) |
| FSLR | First Solar, Inc. | [`0xb200000000000000000000b096f2f6021Ac39617`](https://basescan.org/address/0xb200000000000000000000b096f2f6021Ac39617) |
| FUBO | FuboTV Inc. | [`0xB200000000000000000000FfADA41C4ed20B8D0F`](https://basescan.org/address/0xB200000000000000000000FfADA41C4ed20B8D0F) |
| FUN | Six Flags Entertainment Corporation | [`0xb2000000000000000000000199aE48796c61909e`](https://basescan.org/address/0xb2000000000000000000000199aE48796c61909e) |
| FWDI | Forward Industries, Inc. | [`0xB2000000000000000000001e838D4bEb66cf8FB7`](https://basescan.org/address/0xB2000000000000000000001e838D4bEb66cf8FB7) |
| GAME | GameSquare Holdings, Inc. | [`0xb2000000000000000000005550e8506124236271`](https://basescan.org/address/0xb2000000000000000000005550e8506124236271) |
| GAP | The Gap, Inc. | [`0xb200000000000000000000bBA79A25EdfD4B66c0`](https://basescan.org/address/0xb200000000000000000000bBA79A25EdfD4B66c0) |
| GE | General Electric Company | [`0xb200000000000000000000F5049c6a6F3a47348d`](https://basescan.org/address/0xb200000000000000000000F5049c6a6F3a47348d) |
| GEMI | Gemini Space Station, Inc. | [`0xB2000000000000000000009C52748e1D1Cbd5fd6`](https://basescan.org/address/0xB2000000000000000000009C52748e1D1Cbd5fd6) |
| GILD | Gilead Sciences, Inc. | [`0xb200000000000000000000AcccFe56da68b19a0D`](https://basescan.org/address/0xb200000000000000000000AcccFe56da68b19a0D) |
| GLW | Corning Incorporated | [`0xB2000000000000000000008C06c1B3E7590ac982`](https://basescan.org/address/0xB2000000000000000000008C06c1B3E7590ac982) |
| GLXY | Galaxy Digital Inc. | [`0xB2000000000000000000006de7888c3FffD803ac`](https://basescan.org/address/0xB2000000000000000000006de7888c3FffD803ac) |
| GME | GameStop Corp. | [`0xb2000000000000000000007790ed6E48e06eD935`](https://basescan.org/address/0xb2000000000000000000007790ed6E48e06eD935) |
| GOOGL | Alphabet Inc. | [`0xb2000000000000000000002D0BA3164cc74f58B7`](https://basescan.org/address/0xb2000000000000000000002D0BA3164cc74f58B7) |
| GPRO | GoPro, Inc. | [`0xB200000000000000000000F0e13d9C1cdfd211C8`](https://basescan.org/address/0xB200000000000000000000F0e13d9C1cdfd211C8) |
| GRPN | Groupon, Inc. | [`0xB2000000000000000000004637e5A787885C720D`](https://basescan.org/address/0xB2000000000000000000004637e5A787885C720D) |
| GS | The Goldman Sachs Group, Inc. | [`0xB200000000000000000000a82a0C88DD258eD141`](https://basescan.org/address/0xB200000000000000000000a82a0C88DD258eD141) |
| GSAT | Globalstar, Inc. | [`0xb2000000000000000000007E032680bAd472032f`](https://basescan.org/address/0xb2000000000000000000007E032680bAd472032f) |
| GT | The Goodyear Tire & Rubber Company | [`0xb200000000000000000000264d3A9dea68aA6631`](https://basescan.org/address/0xb200000000000000000000264d3A9dea68aA6631) |
| GTLB | GitLab Inc. | [`0xb200000000000000000000df14B76C292A32982d`](https://basescan.org/address/0xb200000000000000000000df14B76C292A32982d) |
| HD | The Home Depot, Inc. | [`0xB200000000000000000000b11c7e7295fE11fBa7`](https://basescan.org/address/0xB200000000000000000000b11c7e7295fE11fBa7) |
| HE | Hawaiian Electric Industries, Inc. | [`0xb200000000000000000000D2a1ee1F57Be718E71`](https://basescan.org/address/0xb200000000000000000000D2a1ee1F57Be718E71) |
| HIMS | Hims & Hers Health, Inc. | [`0xB20000000000000000000043a599976181Bcf336`](https://basescan.org/address/0xB20000000000000000000043a599976181Bcf336) |
| HOG | Harley-Davidson, Inc. | [`0xB2000000000000000000001FaA7Fa5eF4184eDE5`](https://basescan.org/address/0xB2000000000000000000001FaA7Fa5eF4184eDE5) |
| HON | Honeywell International Inc. | [`0xB200000000000000000000aB665a0775E19F0Dc5`](https://basescan.org/address/0xB200000000000000000000aB665a0775E19F0Dc5) |
| HOOD | Robinhood Markets, Inc. | [`0xb2000000000000000000006F944897540579D3f2`](https://basescan.org/address/0xb2000000000000000000006F944897540579D3f2) |
| HPE | Hewlett Packard Enterprise Company | [`0xB200000000000000000000d8aEccF70906AB125d`](https://basescan.org/address/0xB200000000000000000000d8aEccF70906AB125d) |
| HPQ | HP Inc. | [`0xB2000000000000000000009a3602cF5d020afA98`](https://basescan.org/address/0xB2000000000000000000009a3602cF5d020afA98) |
| HRB | H\&R Block, Inc. | [`0xB2000000000000000000003C5564b8161680C86D`](https://basescan.org/address/0xB2000000000000000000003C5564b8161680C86D) |
| HSAI | Hesai Group | [`0xb200000000000000000000f3049F4aa834b23b64`](https://basescan.org/address/0xb200000000000000000000f3049F4aa834b23b64) |
| HSY | The Hershey Company | [`0xb200000000000000000000F327a373aa86Ac86A8`](https://basescan.org/address/0xb200000000000000000000F327a373aa86Ac86A8) |
| HTZ | Hertz Global Holdings, Inc. | [`0xb2000000000000000000002601C5C94F435da168`](https://basescan.org/address/0xb2000000000000000000002601C5C94F435da168) |
| HUT | Hut 8 Corp. | [`0xb2000000000000000000006Ee1C139a723872e09`](https://basescan.org/address/0xb2000000000000000000006Ee1C139a723872e09) |
| HYMC | Hycroft Mining Holding Corporation | [`0xb200000000000000000000fbC17101E786511A5E`](https://basescan.org/address/0xb200000000000000000000fbC17101E786511A5E) |
| IBM | International Business Machines Corporation | [`0xb2000000000000000000009DB9ea88c3583B1EC8`](https://basescan.org/address/0xb2000000000000000000009DB9ea88c3583B1EC8) |
| IBRX | ImmunityBio, Inc. | [`0xB20000000000000000000077D13D6c79B6C11c5A`](https://basescan.org/address/0xB20000000000000000000077D13D6c79B6C11c5A) |
| INFQ | Infleqtion, Inc. | [`0xb200000000000000000000b387255897C96fA9B1`](https://basescan.org/address/0xb200000000000000000000b387255897C96fA9B1) |
| INFY | Infosys Limited | [`0xb200000000000000000000F6b0417af5F52341FC`](https://basescan.org/address/0xb200000000000000000000F6b0417af5F52341FC) |
| INTC | Intel Corporation | [`0xB2000000000000000000004AFF16039bA04bdFBc`](https://basescan.org/address/0xB2000000000000000000004AFF16039bA04bdFBc) |
| INTU | Intuit Inc. | [`0xb200000000000000000000989432cD85947EE845`](https://basescan.org/address/0xb200000000000000000000989432cD85947EE845) |
| IONQ | IonQ, Inc. | [`0xb20000000000000000000058F143099d5F79b0ec`](https://basescan.org/address/0xb20000000000000000000058F143099d5F79b0ec) |
| IONS | Ionis Pharmaceuticals, Inc. | [`0xB2000000000000000000001997390508A5617d47`](https://basescan.org/address/0xB2000000000000000000001997390508A5617d47) |
| IRON | Disc Medicine, Inc. | [`0xb200000000000000000000bfeaBea0524c94AF03`](https://basescan.org/address/0xb200000000000000000000bfeaBea0524c94AF03) |
| ISRG | Intuitive Surgical, Inc. | [`0xB2000000000000000000002F7Bd112b645574214`](https://basescan.org/address/0xB2000000000000000000002F7Bd112b645574214) |
| IT | Gartner, Inc. | [`0xB20000000000000000000042CBbae483635C3774`](https://basescan.org/address/0xB20000000000000000000042CBbae483635C3774) |
| JACK | Jack in the Box Inc. | [`0xb200000000000000000000B44f193b3fFdF17037`](https://basescan.org/address/0xb200000000000000000000B44f193b3fFdF17037) |
| JBLU | JetBlue Airways Corporation | [`0xB20000000000000000000064832d0d2d38E2F4fc`](https://basescan.org/address/0xB20000000000000000000064832d0d2d38E2F4fc) |
| JNJ | Johnson & Johnson | [`0xb20000000000000000000090658e3f9b29E2f5C2`](https://basescan.org/address/0xb20000000000000000000090658e3f9b29E2f5C2) |
| JPM | JPMorgan Chase & Co. | [`0xB200000000000000000000FDe956536A25725156`](https://basescan.org/address/0xB200000000000000000000FDe956536A25725156) |
| KD | Kyndryl Holdings, Inc. | [`0xB200000000000000000000A8fff5B07C6c45a5d2`](https://basescan.org/address/0xB200000000000000000000A8fff5B07C6c45a5d2) |
| KLAC | KLA Corporation | [`0xB200000000000000000000DBa9e310296C1066C0`](https://basescan.org/address/0xB200000000000000000000DBa9e310296C1066C0) |
| KMB | Kimberly-Clark Corporation | [`0xB200000000000000000000A8F1c97d05a15e89e2`](https://basescan.org/address/0xB200000000000000000000A8F1c97d05a15e89e2) |
| KO | The Coca-Cola Company | [`0xb200000000000000000000ffef181DB6dC5ed6A3`](https://basescan.org/address/0xb200000000000000000000ffef181DB6dC5ed6A3) |
| KODK | Eastman Kodak Company | [`0xb200000000000000000000a63E35E673e3776B88`](https://basescan.org/address/0xb200000000000000000000a63E35E673e3776B88) |
| KRMN | Karman Holdings Inc. | [`0xB200000000000000000000A70e43DfF7aCC203B0`](https://basescan.org/address/0xB200000000000000000000A70e43DfF7aCC203B0) |
| KSS | Kohl's Corporation | [`0xB200000000000000000000105A1f43ff3605C5De`](https://basescan.org/address/0xB200000000000000000000105A1f43ff3605C5De) |
| KTOS | Kratos Defense & Security Solutions, Inc. | [`0xB200000000000000000000e47c019ec313AaD347`](https://basescan.org/address/0xB200000000000000000000e47c019ec313AaD347) |
| LCID | Lucid Group, Inc. | [`0xB20000000000000000000081050Ac3d4395Df527`](https://basescan.org/address/0xB20000000000000000000081050Ac3d4395Df527) |
| LEU | Centrus Energy Corp. | [`0xB200000000000000000000fab55ad3773F2c8eF1`](https://basescan.org/address/0xB200000000000000000000fab55ad3773F2c8eF1) |
| LFMD | LifeMD, Inc. | [`0xB200000000000000000000db15c02E133a9dAB99`](https://basescan.org/address/0xB200000000000000000000db15c02E133a9dAB99) |
| LI | Li Auto Inc. | [`0xb200000000000000000000D61eFD9F54A23ef9eB`](https://basescan.org/address/0xb200000000000000000000D61eFD9F54A23ef9eB) |
| LITE | Lumentum Holdings Inc | [`0xB200000000000000000000eDA6C2c6F11E0F838f`](https://basescan.org/address/0xB200000000000000000000eDA6C2c6F11E0F838f) |
| LLY | Eli Lilly & Co | [`0xB200000000000000000000f1a0F91e34892E4718`](https://basescan.org/address/0xB200000000000000000000f1a0F91e34892E4718) |
| LOVE | The Lovesac Company | [`0xb200000000000000000000C3e498043bb44E8CbF`](https://basescan.org/address/0xb200000000000000000000C3e498043bb44E8CbF) |
| LRCX | Lam Research Corporation | [`0xB20000000000000000000034975347FF1848AAb9`](https://basescan.org/address/0xB20000000000000000000034975347FF1848AAb9) |
| LULU | lululemon athletica inc. | [`0xB200000000000000000000989dc22D3656717734`](https://basescan.org/address/0xB200000000000000000000989dc22D3656717734) |
| LUNR | Intuitive Machines, Inc. | [`0xB200000000000000000000674E1325DBdF06B309`](https://basescan.org/address/0xB200000000000000000000674E1325DBdF06B309) |
| LUV | Southwest Airlines Company | [`0xb200000000000000000000d5c0393796E92FCAB0`](https://basescan.org/address/0xb200000000000000000000d5c0393796E92FCAB0) |
| LWLG | Lightwave Logic, Inc. | [`0xb200000000000000000000Ba4309E1E35bc09F54`](https://basescan.org/address/0xb200000000000000000000Ba4309E1E35bc09F54) |
| LYFT | Lyft, Inc. | [`0xB20000000000000000000005717Baa337022c782`](https://basescan.org/address/0xB20000000000000000000005717Baa337022c782) |
| LYV | Live Nation Entertainment, Inc. | [`0xb2000000000000000000001347ccD9e83d5Bf3e0`](https://basescan.org/address/0xb2000000000000000000001347ccD9e83d5Bf3e0) |
| MARA | MARA Holdings, Inc. | [`0xB200000000000000000000a310e034E09186Fb2d`](https://basescan.org/address/0xB200000000000000000000a310e034E09186Fb2d) |
| MCD | McDonald's Corporation | [`0xb200000000000000000000d2f4cf2f7DEBB244BB`](https://basescan.org/address/0xb200000000000000000000d2f4cf2f7DEBB244BB) |
| MDB | MongoDB, Inc. | [`0xB20000000000000000000086ffFb23cBfbb1F1D8`](https://basescan.org/address/0xB20000000000000000000086ffFb23cBfbb1F1D8) |
| MDGL | Madrigal Pharmaceuticals, Inc. | [`0xB2000000000000000000008D426f3543BaBeE7bB`](https://basescan.org/address/0xB2000000000000000000008D426f3543BaBeE7bB) |
| MED | Medifast, Inc. | [`0xb200000000000000000000C7d6120C543159aC73`](https://basescan.org/address/0xb200000000000000000000C7d6120C543159aC73) |
| META | Meta Platforms Inc. | [`0xb2000000000000000000008bC8786B856E61707C`](https://basescan.org/address/0xb2000000000000000000008bC8786B856E61707C) |
| MIR | Mirion Technologies, Inc. | [`0xb20000000000000000000009614107be6f562BA8`](https://basescan.org/address/0xb20000000000000000000009614107be6f562BA8) |
| MNST | Monster Beverage Corporation | [`0xb2000000000000000000005BCdE0a6926919FEF9`](https://basescan.org/address/0xb2000000000000000000005BCdE0a6926919FEF9) |
| MP | MP Materials Corp. | [`0xB2000000000000000000003958003d801724F9d3`](https://basescan.org/address/0xB2000000000000000000003958003d801724F9d3) |
| MRK | Merck & Co., Inc. | [`0xb200000000000000000000241fe94fe97FcBf034`](https://basescan.org/address/0xb200000000000000000000241fe94fe97FcBf034) |
| MRNA | Moderna, Inc. | [`0xB200000000000000000000e215e9B76ecBA02468`](https://basescan.org/address/0xB200000000000000000000e215e9B76ecBA02468) |
| MRVL | Marvell Technology, Inc. | [`0xB200000000000000000000eC3c4c7395Cc609813`](https://basescan.org/address/0xB200000000000000000000eC3c4c7395Cc609813) |
| MSFT | Microsoft Corporation | [`0xB200000000000000000000Ab99cFa739E253872B`](https://basescan.org/address/0xB200000000000000000000Ab99cFa739E253872B) |
| MSTR | Strategy Inc. | [`0xb2000000000000000000004884b426556b92883d`](https://basescan.org/address/0xb2000000000000000000004884b426556b92883d) |
| MTCH | Match Group, Inc. | [`0xB200000000000000000000441EC9266133F611ef`](https://basescan.org/address/0xB200000000000000000000441EC9266133F611ef) |
| MTN | Vail Resorts, Inc. | [`0xb200000000000000000000EE80a37e1f888644b3`](https://basescan.org/address/0xb200000000000000000000EE80a37e1f888644b3) |
| MU | Micron Technology Inc. | [`0xb200000000000000000000Fd2f87532B90095211`](https://basescan.org/address/0xb200000000000000000000Fd2f87532B90095211) |
| MVIS | MicroVision, Inc. | [`0xB2000000000000000000001BCf8E5022d7f61919`](https://basescan.org/address/0xB2000000000000000000001BCf8E5022d7f61919) |
| NDSN | Nordson Corporation | [`0xb2000000000000000000005B1E5aD3c6aeaBedDd`](https://basescan.org/address/0xb2000000000000000000005B1E5aD3c6aeaBedDd) |
| NEM | Newmont Corporation | [`0xb2000000000000000000003AA0410688bAf4Da88`](https://basescan.org/address/0xb2000000000000000000003AA0410688bAf4Da88) |
| NEXT | NextDecade Corporation | [`0xb2000000000000000000007c92881e458338B34d`](https://basescan.org/address/0xb2000000000000000000007c92881e458338B34d) |
| NFLX | Netflix Inc | [`0xb20000000000000000000058B8c947e44011dFE6`](https://basescan.org/address/0xb20000000000000000000058B8c947e44011dFE6) |
| NIO | NIO Inc. | [`0xb2000000000000000000002D2B5dc53c61f1bA06`](https://basescan.org/address/0xb2000000000000000000002D2B5dc53c61f1bA06) |
| NKE | NIKE, Inc. | [`0xB20000000000000000000071F6c75C5892b09Beb`](https://basescan.org/address/0xB20000000000000000000071F6c75C5892b09Beb) |
| NKTR | Nektar Therapeutics | [`0xb2000000000000000000009B6D9e39d1667cabE1`](https://basescan.org/address/0xb2000000000000000000009B6D9e39d1667cabE1) |
| NN | NextNav Inc. | [`0xB2000000000000000000005D6Afb89705Cd203eA`](https://basescan.org/address/0xB2000000000000000000005D6Afb89705Cd203eA) |
| NNE | NANO Nuclear Energy Inc. | [`0xB20000000000000000000069d694d397b9388dAC`](https://basescan.org/address/0xB20000000000000000000069d694d397b9388dAC) |
| NOC | Northrop Grumman Corporation | [`0xb200000000000000000000C5B17C065e5378d2A5`](https://basescan.org/address/0xb200000000000000000000C5B17C065e5378d2A5) |
| NOK | Nokia Corporation | [`0xB2000000000000000000005ac674f707E357409c`](https://basescan.org/address/0xB2000000000000000000005ac674f707E357409c) |
| NOW | ServiceNow, Inc. | [`0xB20000000000000000000082Cd2C7801305808Df`](https://basescan.org/address/0xB20000000000000000000082Cd2C7801305808Df) |
| NRG | NRG Energy, Inc. | [`0xb2000000000000000000008cE554342C043602a4`](https://basescan.org/address/0xb2000000000000000000008cE554342C043602a4) |
| NRGV | Energy Vault Holdings, Inc. | [`0xB2000000000000000000003ac3D02891f0FC785e`](https://basescan.org/address/0xB2000000000000000000003ac3D02891f0FC785e) |
| NTAP | NetApp, Inc. | [`0xb200000000000000000000e6D729A9705303bd2B`](https://basescan.org/address/0xb200000000000000000000e6D729A9705303bd2B) |
| NTLA | Intellia Therapeutics, Inc. | [`0xB20000000000000000000054a4a3659B55272125`](https://basescan.org/address/0xB20000000000000000000054a4a3659B55272125) |
| NUVB | Nuvation Bio Inc. | [`0xB2000000000000000000000dE6A780902Db4eC09`](https://basescan.org/address/0xB2000000000000000000000dE6A780902Db4eC09) |
| NVAX | Novavax Inc | [`0xB200000000000000000000C597c476FCf9Aed3a8`](https://basescan.org/address/0xB200000000000000000000C597c476FCf9Aed3a8) |
| NVDA | NVIDIA Corporation | [`0xb20000000000000000000078ee7ce2fE4908108C`](https://basescan.org/address/0xb20000000000000000000078ee7ce2fE4908108C) |
| NVO | Novo Nordisk A/S | [`0xb2000000000000000000008D5328e9208773dC58`](https://basescan.org/address/0xb2000000000000000000008D5328e9208773dC58) |
| NVTS | Navitas Semiconductor Corporation | [`0xb2000000000000000000002a0EC8F8861cE98983`](https://basescan.org/address/0xb2000000000000000000002a0EC8F8861cE98983) |
| OKLO | Oklo Inc. | [`0xB2000000000000000000009188EDFd2FCc8cc81e`](https://basescan.org/address/0xB2000000000000000000009188EDFd2FCc8cc81e) |
| OKTA | Okta, Inc. | [`0xb2000000000000000000002570652530A5E0F771`](https://basescan.org/address/0xb2000000000000000000002570652530A5E0F771) |
| OLLI | Ollie's Bargain Outlet Holdings, Inc. | [`0xB20000000000000000000097CA7d4003399C67E6`](https://basescan.org/address/0xB20000000000000000000097CA7d4003399C67E6) |
| OMER | Omeros Corporation | [`0xb200000000000000000000178D4c37485ea47eF6`](https://basescan.org/address/0xb200000000000000000000178D4c37485ea47eF6) |
| ON | ON Semiconductor Corporation | [`0xB20000000000000000000085367ee92c15B5F613`](https://basescan.org/address/0xB20000000000000000000085367ee92c15B5F613) |
| ONDS | Ondas Inc. | [`0xB200000000000000000000e7137cA231c5e35f25`](https://basescan.org/address/0xB200000000000000000000e7137cA231c5e35f25) |
| OPAD | Offerpad Solutions Inc. | [`0xB2000000000000000000003086b1355bd43e25Da`](https://basescan.org/address/0xB2000000000000000000003086b1355bd43e25Da) |
| OPEN | Opendoor Technologies Inc. | [`0xb200000000000000000000259694B27Bf052E7d7`](https://basescan.org/address/0xb200000000000000000000259694B27Bf052E7d7) |
| OPNW | OpenWorld, Inc. | [`0xb2000000000000000000002a3E91E59fFc3CeD94`](https://basescan.org/address/0xb2000000000000000000002a3E91E59fFc3CeD94) |
| OPRA | Opera Limited | [`0xB200000000000000000000fE6b283199e6BD432d`](https://basescan.org/address/0xB200000000000000000000fE6b283199e6BD432d) |
| ORCL | Oracle Corporation | [`0xb200000000000000000000347AFbA223D7B6b63C`](https://basescan.org/address/0xb200000000000000000000347AFbA223D7B6b63C) |
| OUST | Ouster, Inc. | [`0xB200000000000000000000314B9f5F580168766a`](https://basescan.org/address/0xB200000000000000000000314B9f5F580168766a) |
| OWL | Blue Owl Capital Inc. | [`0xb200000000000000000000b1E11478cdd89Ef7B2`](https://basescan.org/address/0xb200000000000000000000b1E11478cdd89Ef7B2) |
| PANW | Palo Alto Networks, Inc. | [`0xb2000000000000000000008b934a18e189efe90f`](https://basescan.org/address/0xb2000000000000000000008b934a18e189efe90f) |
| PATH | UiPath, Inc. | [`0xB2000000000000000000006D02167C4864e72bD2`](https://basescan.org/address/0xB2000000000000000000006D02167C4864e72bD2) |
| PCT | PureCycle Technologies, Inc. | [`0xB200000000000000000000796c05DD2536C7f91c`](https://basescan.org/address/0xB200000000000000000000796c05DD2536C7f91c) |
| PDD | PDD Holdings Inc. | [`0xB200000000000000000000c8A7223510467D8563`](https://basescan.org/address/0xB200000000000000000000c8A7223510467D8563) |
| PENG | Penguin Solutions, Inc. | [`0xb200000000000000000000EF65AFE26a07bab24e`](https://basescan.org/address/0xb200000000000000000000EF65AFE26a07bab24e) |
| PEP | PepsiCo, Inc. | [`0xB2000000000000000000006d1bC7Faa266Eb099D`](https://basescan.org/address/0xB2000000000000000000006d1bC7Faa266Eb099D) |
| PFE | Pfizer Inc | [`0xB20000000000000000000018FE7eC7d6DfeeB528`](https://basescan.org/address/0xB20000000000000000000018FE7eC7d6DfeeB528) |
| PG | The Procter & Gamble Company | [`0xb200000000000000000000c25611C4BdA138d298`](https://basescan.org/address/0xb200000000000000000000c25611C4BdA138d298) |
| PINS | Pinterest, Inc. | [`0xB2000000000000000000001dFD8c413Ecd6EC630`](https://basescan.org/address/0xB2000000000000000000001dFD8c413Ecd6EC630) |
| PL | Planet Labs PBC | [`0xB200000000000000000000cB6B2f4e33f0471556`](https://basescan.org/address/0xB200000000000000000000cB6B2f4e33f0471556) |
| PLAY | Dave & Buster’s Entertainment, Inc. | [`0xB20000000000000000000087d144F2C70cd1A5F6`](https://basescan.org/address/0xB20000000000000000000087d144F2C70cd1A5F6) |
| PLNT | Planet Fitness, Inc. | [`0xb20000000000000000000011b20aebe0Bd567F1c`](https://basescan.org/address/0xb20000000000000000000011b20aebe0Bd567F1c) |
| PLTR | Palantir Technologies Inc. | [`0xb2000000000000000000007d16372840dF4dAbbe`](https://basescan.org/address/0xb2000000000000000000007d16372840dF4dAbbe) |
| PLUG | Plug Power Inc. | [`0xB200000000000000000000C6dbAe193C95C4E056`](https://basescan.org/address/0xB200000000000000000000C6dbAe193C95C4E056) |
| PM | Philip Morris International Inc. | [`0xB2000000000000000000008FC2A8C23cf5937b66`](https://basescan.org/address/0xB2000000000000000000008FC2A8C23cf5937b66) |
| PR | Permian Resources Corporation | [`0xB200000000000000000000a0390525880C1ac72B`](https://basescan.org/address/0xB200000000000000000000a0390525880C1ac72B) |
| PRME | Prime Medicine, Inc. | [`0xb200000000000000000000351bd76098B359ADa8`](https://basescan.org/address/0xb200000000000000000000351bd76098B359ADa8) |
| PS | Pershing Square Inc. | [`0xb200000000000000000000A071d80FA5B480c448`](https://basescan.org/address/0xb200000000000000000000A071d80FA5B480c448) |
| PTON | Peloton Interactive, Inc. | [`0xB2000000000000000000009272A491812842Aa84`](https://basescan.org/address/0xB2000000000000000000009272A491812842Aa84) |
| PUMP | ProPetro Holding Corp. | [`0xB200000000000000000000E1b0b17fD671771813`](https://basescan.org/address/0xB200000000000000000000E1b0b17fD671771813) |
| PURR | Hyperliquid Strategies Inc | [`0xB20000000000000000000065ca0F772a5502E976`](https://basescan.org/address/0xB20000000000000000000065ca0F772a5502E976) |
| PYPL | PayPal Holdings, Inc. | [`0xb200000000000000000000450ad3abE5d4846c6E`](https://basescan.org/address/0xb200000000000000000000450ad3abE5d4846c6E) |
| PZZA | Papa John’s International, Inc. | [`0xb20000000000000000000068987dacde1dB79Cd4`](https://basescan.org/address/0xb20000000000000000000068987dacde1dB79Cd4) |
| QBTS | D-Wave Quantum Inc. | [`0xb2000000000000000000000d46361d597f543d06`](https://basescan.org/address/0xb2000000000000000000000d46361d597f543d06) |
| QCOM | Qualcomm Incorporated | [`0xB2000000000000000000005672D78eFF30D24665`](https://basescan.org/address/0xB2000000000000000000005672D78eFF30D24665) |
| QNT | Quantinuum Inc. | [`0xb2000000000000000000003963C3bEAA3eba9bfc`](https://basescan.org/address/0xb2000000000000000000003963C3bEAA3eba9bfc) |
| QS | QuantumScape Corporation | [`0xb200000000000000000000bD938fa95e3E20c5A1`](https://basescan.org/address/0xb200000000000000000000bD938fa95e3E20c5A1) |
| QUBT | Quantum Computing Inc. | [`0xb200000000000000000000CA425ab42e07C35bC3`](https://basescan.org/address/0xb200000000000000000000CA425ab42e07C35bC3) |
| QUIT | Achieve Life Sciences, Inc. | [`0xb200000000000000000000426663e7212288FA97`](https://basescan.org/address/0xb200000000000000000000426663e7212288FA97) |
| QXO | QXO, Inc. | [`0xB2000000000000000000000Cd31253817b36f88a`](https://basescan.org/address/0xB2000000000000000000000Cd31253817b36f88a) |
| RBLX | Roblox Corporation | [`0xB2000000000000000000005bd7AE89b9E6189Bb5`](https://basescan.org/address/0xB2000000000000000000005bd7AE89b9E6189Bb5) |
| RBRK | Rubrik, Inc. | [`0xb200000000000000000000B6354bC256DbCD93a8`](https://basescan.org/address/0xb200000000000000000000B6354bC256DbCD93a8) |
| RCAT | Red Cat Holdings, Inc. | [`0xB200000000000000000000a67C3271F0584F6C1D`](https://basescan.org/address/0xB200000000000000000000a67C3271F0584F6C1D) |
| RDDT | Reddit, Inc. | [`0xb20000000000000000000066242d4067724cB7A1`](https://basescan.org/address/0xb20000000000000000000066242d4067724cB7A1) |
| RDW | Redwire Corporation | [`0xB200000000000000000000cd7dFaef0423F1f103`](https://basescan.org/address/0xB200000000000000000000cd7dFaef0423F1f103) |
| REAL | The RealReal, Inc. | [`0xb200000000000000000000211a2ED33FAD95B0B3`](https://basescan.org/address/0xb200000000000000000000211a2ED33FAD95B0B3) |
| REGN | Regeneron Pharmaceuticals, Inc. | [`0xb2000000000000000000006377b3C06A3e3e9ae5`](https://basescan.org/address/0xb2000000000000000000006377b3C06A3e3e9ae5) |
| RGTI | Rigetti Computing, Inc. | [`0xb200000000000000000000C22fFF2785Bb27b39A`](https://basescan.org/address/0xb200000000000000000000C22fFF2785Bb27b39A) |
| RH | RH | [`0xB20000000000000000000080bAE0f654B5cC762C`](https://basescan.org/address/0xB20000000000000000000080bAE0f654B5cC762C) |
| RIGL | Rigel Pharmaceuticals, Inc. | [`0xB200000000000000000000966Cbe5b99Be9b981a`](https://basescan.org/address/0xB200000000000000000000966Cbe5b99Be9b981a) |
| RIOT | Riot Platforms, Inc. | [`0xb200000000000000000000bd0C7627b663c581A6`](https://basescan.org/address/0xb200000000000000000000bd0C7627b663c581A6) |
| RIVN | Rivian Automotive, Inc. | [`0xB2000000000000000000003e4249C65bd6c037d9`](https://basescan.org/address/0xB2000000000000000000003e4249C65bd6c037d9) |
| RKLB | Rocket Lab Corporation | [`0xb200000000000000000000e8E50CBbb9a3861a3C`](https://basescan.org/address/0xb200000000000000000000e8E50CBbb9a3861a3C) |
| RKT | Rocket Companies, Inc. | [`0xb200000000000000000000000D3176ee4af1102d`](https://basescan.org/address/0xb200000000000000000000000D3176ee4af1102d) |
| ROK | Rockwell Automation, Inc. | [`0xb200000000000000000000252C42b75F49DacF59`](https://basescan.org/address/0xb200000000000000000000252C42b75F49DacF59) |
| ROOT | Root, Inc. | [`0xB2000000000000000000004AA2B559CA0a0bbF5D`](https://basescan.org/address/0xB2000000000000000000004AA2B559CA0a0bbF5D) |
| RR | Richtech Robotics Inc. | [`0xB20000000000000000000020790305A981E88a67`](https://basescan.org/address/0xB20000000000000000000020790305A981E88a67) |
| RTX | RTX Corporation | [`0xB200000000000000000000e6Eb8A05D09d73DAD5`](https://basescan.org/address/0xB200000000000000000000e6Eb8A05D09d73DAD5) |
| RUM | RUM Group Inc. | [`0xb2000000000000000000000F28146Eb28ea2835B`](https://basescan.org/address/0xb2000000000000000000000F28146Eb28ea2835B) |
| RUN | Sunrun Inc. | [`0xb200000000000000000000b1b9200405Fb52A8cF`](https://basescan.org/address/0xb200000000000000000000b1b9200405Fb52A8cF) |
| RXRX | Recursion Pharmaceuticals, Inc. | [`0xb200000000000000000000501Ef81F911eB57656`](https://basescan.org/address/0xb200000000000000000000501Ef81F911eB57656) |
| S | SentinelOne, Inc. | [`0xb2000000000000000000008CaE79B36e9269Eb86`](https://basescan.org/address/0xb2000000000000000000008CaE79B36e9269Eb86) |
| SAM | The Boston Beer Company, Inc. | [`0xb200000000000000000000e410ae30ABDdA3Aee0`](https://basescan.org/address/0xb200000000000000000000e410ae30ABDdA3Aee0) |
| SAN | Banco Santander, S.A. | [`0xB20000000000000000000017BB66E9301E913A99`](https://basescan.org/address/0xB20000000000000000000017BB66E9301E913A99) |
| SANA | Sana Biotechnology, Inc. | [`0xb200000000000000000000Bc043Cf5053540A588`](https://basescan.org/address/0xb200000000000000000000Bc043Cf5053540A588) |
| SAP | SAP SE | [`0xb200000000000000000000da6F64c306234127E0`](https://basescan.org/address/0xb200000000000000000000da6F64c306234127E0) |
| SBET | Sharplink, Inc. | [`0xb200000000000000000000559eC0BEdaacf436eA`](https://basescan.org/address/0xb200000000000000000000559eC0BEdaacf436eA) |
| SBUX | Starbucks Corporation | [`0xb200000000000000000000C3dE197eAC6faA1e64`](https://basescan.org/address/0xb200000000000000000000C3dE197eAC6faA1e64) |
| SE | Sea Limited | [`0xB2000000000000000000003088798F6d0722AaAC`](https://basescan.org/address/0xB2000000000000000000003088798F6d0722AaAC) |
| SERV | Serve Robotics Inc. | [`0xB2000000000000000000001A114de6d32433F3C0`](https://basescan.org/address/0xB2000000000000000000001A114de6d32433F3C0) |
| SEZL | Sezzle Inc. | [`0xb2000000000000000000000C1F8aCD3c4496a762`](https://basescan.org/address/0xb2000000000000000000000C1F8aCD3c4496a762) |
| SG | Sweetgreen, Inc. | [`0xB200000000000000000000b57f99Acec3A7490D0`](https://basescan.org/address/0xB200000000000000000000b57f99Acec3A7490D0) |
| SHAK | Shake Shack Inc. | [`0xb2000000000000000000005C16DD6f675BF8Ceb7`](https://basescan.org/address/0xb2000000000000000000005C16DD6f675BF8Ceb7) |
| SHAZ | SharonAI Holdings Inc. | [`0xB2000000000000000000000D9947c759429e7fE5`](https://basescan.org/address/0xB2000000000000000000000D9947c759429e7fE5) |
| SIDU | Sidus Space, Inc. | [`0xb2000000000000000000002B9AC07a0544688079`](https://basescan.org/address/0xb2000000000000000000002B9AC07a0544688079) |
| SKHY | SK hynix Inc. | [`0xb200000000000000000000187f7071D6E321a7d2`](https://basescan.org/address/0xb200000000000000000000187f7071D6E321a7d2) |
| SKYD | Skydance Corporation | [`0xB200000000000000000000a21B5ae62fEA392B73`](https://basescan.org/address/0xB200000000000000000000a21B5ae62fEA392B73) |
| SLDP | Solid Power, Inc. | [`0xb200000000000000000000dF3EB2AF7316B29122`](https://basescan.org/address/0xb200000000000000000000dF3EB2AF7316B29122) |
| SLS | SELLAS Life Sciences Group, Inc. | [`0xB2000000000000000000000C431e2a7c0CE7Ea31`](https://basescan.org/address/0xB2000000000000000000000C431e2a7c0CE7Ea31) |
| SM | SM Energy Company | [`0xb200000000000000000000DD40740E9c445E211b`](https://basescan.org/address/0xb200000000000000000000DD40740E9c445E211b) |
| SMCI | Super Micro Computer, Inc. | [`0xB20000000000000000000065F11d53A1e442bB84`](https://basescan.org/address/0xB20000000000000000000065F11d53A1e442bB84) |
| SMPL | The Simply Good Foods Company | [`0xB2000000000000000000001409f816682b7772b7`](https://basescan.org/address/0xB2000000000000000000001409f816682b7772b7) |
| SMR | NuScale Power Corporation | [`0xb200000000000000000000978546Fe604b8dcbC6`](https://basescan.org/address/0xb200000000000000000000978546Fe604b8dcbC6) |
| SNAP | Snap Inc. | [`0xb2000000000000000000003F265aB1f74Dd89AC0`](https://basescan.org/address/0xb2000000000000000000003F265aB1f74Dd89AC0) |
| SNDK | Sandisk Corporation | [`0xb200000000000000000000397293Cb8cda9a10c5`](https://basescan.org/address/0xb200000000000000000000397293Cb8cda9a10c5) |
| SNDX | Syndax Pharmaceuticals, Inc. | [`0xB2000000000000000000005B8CEcE4a5F9306bb4`](https://basescan.org/address/0xB2000000000000000000005B8CEcE4a5F9306bb4) |
| SNOW | Snowflake Inc. | [`0xB2000000000000000000004AcDC9A922FCfBCc7f`](https://basescan.org/address/0xB2000000000000000000004AcDC9A922FCfBCc7f) |
| SO | The Southern Company | [`0xB200000000000000000000F814b4666c2d70a670`](https://basescan.org/address/0xB200000000000000000000F814b4666c2d70a670) |
| SOC | Sable Offshore Corp. | [`0xb2000000000000000000001fAb744De0b829EeD1`](https://basescan.org/address/0xb2000000000000000000001fAb744De0b829EeD1) |
| SOFI | SoFi Technologies, Inc. | [`0xB2000000000000000000003eF37a7c863DC1482A`](https://basescan.org/address/0xB2000000000000000000003eF37a7c863DC1482A) |
| SONY | Sony Group Corporation | [`0xb200000000000000000000a26326a922FFA87f6C`](https://basescan.org/address/0xb200000000000000000000a26326a922FFA87f6C) |
| SOUN | SoundHound AI, Inc. | [`0xB2000000000000000000002137743D4a01Fe4e88`](https://basescan.org/address/0xB2000000000000000000002137743D4a01Fe4e88) |
| SPB | Spectrum Brands Holdings, Inc. | [`0xb200000000000000000000Ec3cD781ACaD151fDC`](https://basescan.org/address/0xb200000000000000000000Ec3cD781ACaD151fDC) |
| SPCE | Virgin Galactic Holdings, Inc. | [`0xb200000000000000000000d65c9253b025Af8C56`](https://basescan.org/address/0xb200000000000000000000d65c9253b025Af8C56) |
| SPCX | Space Exploration Technologies Corp. | [`0xb2000000000000000000007b9fcbd005511aCBd5`](https://basescan.org/address/0xb2000000000000000000007b9fcbd005511aCBd5) |
| SPHR | Sphere Entertainment Co. | [`0xb200000000000000000000aBaDF9B1FDb845DB73`](https://basescan.org/address/0xb200000000000000000000aBaDF9B1FDb845DB73) |
| SRPT | Sarepta Therapeutics, Inc. | [`0xB200000000000000000000964b7F3f335d7e70B5`](https://basescan.org/address/0xB200000000000000000000964b7F3f335d7e70B5) |
| STZ | Constellation Brands, Inc. | [`0xB2000000000000000000001AC12227a8aE0Ef3Ac`](https://basescan.org/address/0xB2000000000000000000001AC12227a8aE0Ef3Ac) |
| SWBI | Smith & Wesson Brands, Inc. | [`0xb2000000000000000000003FE90a64263B7F9E74`](https://basescan.org/address/0xb2000000000000000000003FE90a64263B7F9E74) |
| SWKS | Skyworks Solutions, Inc. | [`0xB200000000000000000000d154b5666b2d1e5A02`](https://basescan.org/address/0xB200000000000000000000d154b5666b2d1e5A02) |
| SYM | Symbotic Inc. | [`0xb20000000000000000000047984EcaE84db5fcF9`](https://basescan.org/address/0xb20000000000000000000047984EcaE84db5fcF9) |
| TAP | Molson Coors Beverage Company | [`0xb200000000000000000000e0B9460c97F38f412F`](https://basescan.org/address/0xb200000000000000000000e0B9460c97F38f412F) |
| TDOC | Teladoc Health, Inc. | [`0xB200000000000000000000A49b5EED0c1CF792BA`](https://basescan.org/address/0xB200000000000000000000A49b5EED0c1CF792BA) |
| TEAM | Atlassian Corporation | [`0xB2000000000000000000004217B9b4f6f6aCb7B8`](https://basescan.org/address/0xB2000000000000000000004217B9b4f6f6aCb7B8) |
| TEM | Tempus AI, Inc. | [`0xb200000000000000000000d033253ABB1104107b`](https://basescan.org/address/0xb200000000000000000000d033253ABB1104107b) |
| TER | Teradyne, Inc. | [`0xB2000000000000000000006BC65AF32d24870A2d`](https://basescan.org/address/0xB2000000000000000000006BC65AF32d24870A2d) |
| TGT | Target Corporation | [`0xb200000000000000000000c715439d0CC5A8c67d`](https://basescan.org/address/0xb200000000000000000000c715439d0CC5A8c67d) |
| TGTX | TG Therapeutics, Inc. | [`0xb2000000000000000000003A67b9f116f25513d6`](https://basescan.org/address/0xb2000000000000000000003A67b9f116f25513d6) |
| TKO | TKO Group Holdings, Inc. | [`0xB200000000000000000000b8f841940325DB6B2c`](https://basescan.org/address/0xB200000000000000000000b8f841940325DB6B2c) |
| TKR | The Timken Company | [`0xB20000000000000000000049B9fC3b3c8C9402ff`](https://basescan.org/address/0xB20000000000000000000049B9fC3b3c8C9402ff) |
| TMDX | TransMedics Group, Inc. | [`0xb200000000000000000000AA0aA80F99c33081E1`](https://basescan.org/address/0xb200000000000000000000AA0aA80F99c33081E1) |
| TNDM | Tandem Diabetes Care, Inc. | [`0xB2000000000000000000001F6B9c31e43560a924`](https://basescan.org/address/0xB2000000000000000000001F6B9c31e43560a924) |
| TOST | Toast, Inc. | [`0xB200000000000000000000cF2593D5FFC13Bd817`](https://basescan.org/address/0xB200000000000000000000cF2593D5FFC13Bd817) |
| TRIP | Tripadvisor, Inc. | [`0xb2000000000000000000002f12AfA8f583b6CE85`](https://basescan.org/address/0xb2000000000000000000002f12AfA8f583b6CE85) |
| TRON | Tron Inc. | [`0xb2000000000000000000000A22ac22D031B657DA`](https://basescan.org/address/0xb2000000000000000000000A22ac22D031B657DA) |
| TSLA | Tesla Inc. | [`0xb2000000000000000000001e800a7f5189430cD0`](https://basescan.org/address/0xb2000000000000000000001e800a7f5189430cD0) |
| TTD | The Trade Desk, Inc. | [`0xB2000000000000000000008baF7bb82e4C37743f`](https://basescan.org/address/0xB2000000000000000000008baF7bb82e4C37743f) |
| TTMI | TTM Technologies, Inc. | [`0xB2000000000000000000007292D3D91c6b559058`](https://basescan.org/address/0xB2000000000000000000007292D3D91c6b559058) |
| TTWO | Take-Two Interactive Software, Inc. | [`0xB200000000000000000000f720C26062Bc3067Da`](https://basescan.org/address/0xB200000000000000000000f720C26062Bc3067Da) |
| TWST | Twist Bioscience Corporation | [`0xB200000000000000000000A15628dCEA6934EDE0`](https://basescan.org/address/0xB200000000000000000000A15628dCEA6934EDE0) |
| U | Unity Software Inc. | [`0xB200000000000000000000902F48CBa1f39149F7`](https://basescan.org/address/0xB200000000000000000000902F48CBa1f39149F7) |
| UAA | Under Armour, Inc. | [`0xb200000000000000000000879A74C76C73a27d71`](https://basescan.org/address/0xb200000000000000000000879A74C76C73a27d71) |
| UAL | United Airlines Holdings, Inc. | [`0xb200000000000000000000Cdbf3E786FF34DBE51`](https://basescan.org/address/0xb200000000000000000000Cdbf3E786FF34DBE51) |
| UBER | Uber Technologies, Inc. | [`0xb200000000000000000000cAE20cb1446462e24c`](https://basescan.org/address/0xb200000000000000000000cAE20cb1446462e24c) |
| UI | Ubiquiti Inc. | [`0xb2000000000000000000003fC6f17C8B775bcA78`](https://basescan.org/address/0xb2000000000000000000003fC6f17C8B775bcA78) |
| UL | Unilever Plc | [`0xB200000000000000000000349ef3Aa93a0897476`](https://basescan.org/address/0xB200000000000000000000349ef3Aa93a0897476) |
| ULTA | Ulta Beauty, Inc. | [`0xb20000000000000000000053d000bAC95662D1e4`](https://basescan.org/address/0xb20000000000000000000053d000bAC95662D1e4) |
| UMAC | Unusual Machines, Inc. | [`0xb2000000000000000000003aE0817C304acBB1DE`](https://basescan.org/address/0xb2000000000000000000003aE0817C304acBB1DE) |
| UNH | UnitedHealth Group Incorporated | [`0xb200000000000000000000c367d37d07150182A2`](https://basescan.org/address/0xb200000000000000000000c367d37d07150182A2) |
| UPS | United Parcel Service, Inc. | [`0xb2000000000000000000008D84C0d360848dBbdE`](https://basescan.org/address/0xb2000000000000000000008D84C0d360848dBbdE) |
| UPST | Upstart Holdings, Inc. | [`0xB2000000000000000000007A8a3Ab2d3b319036D`](https://basescan.org/address/0xB2000000000000000000007A8a3Ab2d3b319036D) |
| USAR | USA Rare Earth, Inc. | [`0xB200000000000000000000D80D163781a37A20F6`](https://basescan.org/address/0xB200000000000000000000D80D163781a37A20F6) |
| USDE | StablecoinX Inc. | [`0xB2000000000000000000009426B660396eBCf343`](https://basescan.org/address/0xB2000000000000000000009426B660396eBCf343) |
| V | Visa Inc. | [`0xB20000000000000000000054b11Fd279a4f7D4EF`](https://basescan.org/address/0xB20000000000000000000054b11Fd279a4f7D4EF) |
| VALE | Vale S.A. | [`0xB20000000000000000000063376b142C0764B489`](https://basescan.org/address/0xB20000000000000000000063376b142C0764B489) |
| VC | Visteon Corporation | [`0xb20000000000000000000030945cB9c538D0B326`](https://basescan.org/address/0xb20000000000000000000030945cB9c538D0B326) |
| VERA | Vera Therapeutics, Inc. | [`0xB200000000000000000000Ef7F9A89256Fa06887`](https://basescan.org/address/0xB200000000000000000000Ef7F9A89256Fa06887) |
| VKTX | Viking Therapeutics, Inc. | [`0xb200000000000000000000979eF4Dd6A001b58b1`](https://basescan.org/address/0xb200000000000000000000979eF4Dd6A001b58b1) |
| VOYG | Voyager Technologies, Inc. | [`0xb2000000000000000000004F13a2441D3C82eE54`](https://basescan.org/address/0xb2000000000000000000004F13a2441D3C82eE54) |
| VPG | Vishay Precision Group, Inc. | [`0xb20000000000000000000051B531471096C5CAf6`](https://basescan.org/address/0xb20000000000000000000051B531471096C5CAf6) |
| VRDN | Viridian Therapeutics, Inc. | [`0xb200000000000000000000ef8D64f65302eC1FB2`](https://basescan.org/address/0xb200000000000000000000ef8D64f65302eC1FB2) |
| VRT | Vertiv Holdings Co | [`0xB200000000000000000000b2E8dBA585B1ffB158`](https://basescan.org/address/0xB200000000000000000000b2E8dBA585B1ffB158) |
| VRTX | Vertex Pharmaceuticals Incorporated | [`0xb200000000000000000000B92922f6d0c592a456`](https://basescan.org/address/0xb200000000000000000000B92922f6d0c592a456) |
| VST | Vistra Corp. | [`0xB20000000000000000000079DC24fe2FBD09110f`](https://basescan.org/address/0xB20000000000000000000079DC24fe2FBD09110f) |
| VSXY | Victoria's Secret & Co. | [`0xB200000000000000000000a9dabFD3F0c5f21304`](https://basescan.org/address/0xB200000000000000000000a9dabFD3F0c5f21304) |
| VVV | Valvoline Inc | [`0xb200000000000000000000FEC679b39992F67627`](https://basescan.org/address/0xb200000000000000000000FEC679b39992F67627) |
| W | Wayfair Inc. | [`0xb20000000000000000000089BC72C3E637a02AdB`](https://basescan.org/address/0xb20000000000000000000089BC72C3E637a02AdB) |
| WAY | Waystar Holding Corp. | [`0xB2000000000000000000003496C04Fcfee6997E0`](https://basescan.org/address/0xB2000000000000000000003496C04Fcfee6997E0) |
| WDC | Western Digital Corporation | [`0xb2000000000000000000008fde21a1F5c69FeC0b`](https://basescan.org/address/0xb2000000000000000000008fde21a1F5c69FeC0b) |
| WEN | Wendy's Co | [`0xB20000000000000000000044E3CD7a0E1028E57a`](https://basescan.org/address/0xB20000000000000000000044E3CD7a0E1028E57a) |
| WGS | GeneDx Holdings Corp. | [`0xB200000000000000000000c6F4B26Bd2BE77F18D`](https://basescan.org/address/0xB200000000000000000000c6F4B26Bd2BE77F18D) |
| WHR | Whirlpool Corporation | [`0xb2000000000000000000006448A906E8942850fa`](https://basescan.org/address/0xb2000000000000000000006448A906E8942850fa) |
| WING | Wingstop Inc. | [`0xB200000000000000000000281C973bf2555dD94B`](https://basescan.org/address/0xB200000000000000000000281C973bf2555dD94B) |
| WKHS | Workhorse Group Inc. | [`0xb200000000000000000000DfA6C77AEa5329D187`](https://basescan.org/address/0xb200000000000000000000DfA6C77AEa5329D187) |
| WMT | Walmart Inc. | [`0xb2000000000000000000008a7508619c717A7106`](https://basescan.org/address/0xb2000000000000000000008a7508619c717A7106) |
| WOLF | Wolfspeed, Inc. | [`0xB2000000000000000000008Df9Bc22Db1d7dA2a5`](https://basescan.org/address/0xB2000000000000000000008Df9Bc22Db1d7dA2a5) |
| WOOF | Petco Health and Wellness Company, Inc. | [`0xB200000000000000000000b5e07d13B2D68D60Dd`](https://basescan.org/address/0xB200000000000000000000b5e07d13B2D68D60Dd) |
| WRD | WeRide Inc. | [`0xb200000000000000000000e88EFe88D8aDE3f0dA`](https://basescan.org/address/0xb200000000000000000000e88EFe88D8aDE3f0dA) |
| WTI | W\&T Offshore, Inc. | [`0xb200000000000000000000d2f94f19Aa759f4690`](https://basescan.org/address/0xb200000000000000000000d2f94f19Aa759f4690) |
| WU | The Western Union Company | [`0xb20000000000000000000033be01089Cf02a2025`](https://basescan.org/address/0xb20000000000000000000033be01089Cf02a2025) |
| WULF | TeraWulf Inc. | [`0xb200000000000000000000432a1d2Bd864ACEc82`](https://basescan.org/address/0xb200000000000000000000432a1d2Bd864ACEc82) |
| WW | WW International, Inc. | [`0xb20000000000000000000089221e238277d52515`](https://basescan.org/address/0xb20000000000000000000089221e238277d52515) |
| XOM | ExxonMobil Holdings Corporation | [`0xb20000000000000000000065F7d0D6aac5fD4Bfd`](https://basescan.org/address/0xb20000000000000000000065F7d0D6aac5fD4Bfd) |
| XXI | Twenty One Capital, Inc. | [`0xB200000000000000000000115bf2283265FB04Db`](https://basescan.org/address/0xB200000000000000000000115bf2283265FB04Db) |
| XYZ | Block, Inc. | [`0xB20000000000000000000067C8C151f24E1c9924`](https://basescan.org/address/0xB20000000000000000000067C8C151f24E1c9924) |
| YELP | Yelp Inc. | [`0xB2000000000000000000006454926Ad8576DC50e`](https://basescan.org/address/0xB2000000000000000000006454926Ad8576DC50e) |
| YETI | YETI Holdings, Inc. | [`0xb200000000000000000000613C15F118DF2b189B`](https://basescan.org/address/0xb200000000000000000000613C15F118DF2b189B) |
| YOU | CLEAR Secure, Inc. | [`0xb2000000000000000000003cdB2c0F94e4EBf605`](https://basescan.org/address/0xb2000000000000000000003cdB2c0F94e4EBf605) |
| YUM | YUM! Brands, Inc. | [`0xB2000000000000000000005C8324136dE0f4134a`](https://basescan.org/address/0xB2000000000000000000005C8324136dE0f4134a) |
| ZBRA | Zebra Technologies Corporation | [`0xb200000000000000000000e2C4CB0F18B68Cc776`](https://basescan.org/address/0xb200000000000000000000e2C4CB0F18B68Cc776) |
| ZM | Zoom Communications, Inc. | [`0xB2000000000000000000000E63b7B0b6BC5B9213`](https://basescan.org/address/0xB2000000000000000000000E63b7B0b6BC5B9213) |
| ZS | Zscaler, Inc. | [`0xB20000000000000000000076A288B15B61Ec78F6`](https://basescan.org/address/0xB20000000000000000000076A288B15B61Ec78F6) |

An optional Dev Buy also needs sufficient liquidity along its selected trading route.

## Robinhood Stock Token catalog

Robinhood Stock Tokens use 18 decimals, with a 0.001 ETH launch fee for every paired asset. Registration of the assets below was verified on **November 5, 2026** on both factories at block `106,215,556`.

Developers and data clients can use the [Standard stock snapshot](https://docs.o1.exchange/launchpad/reference/robinhood-stock-quotes.json) and [Tax snapshot](https://docs.o1.exchange/launchpad/reference/robinhood-tax-suite.json). Starting ticks and revisions belong to the selected factory.

| Symbol | Paired asset | Robinhood Chain token |
| - | - | - |
| AAOI | Applied Optoelectronics | [`0x521cf887e6531c6f667b5bc4d896e5d9bfe8eb2e`](https://rh-scan.com/address/0x521cf887e6531c6f667b5bc4d896e5d9bfe8eb2e) |
| AAPL | Apple | [`0xaf3d76f1834a1d425780943c99ea8a608f8a93f9`](https://rh-scan.com/address/0xaf3d76f1834a1d425780943c99ea8a608f8a93f9) |
| ABCL | Abcellera Biologics | [`0x3139d77ace0cbaa5bdfd38bd1f1911a794af0b0e`](https://rh-scan.com/address/0x3139d77ace0cbaa5bdfd38bd1f1911a794af0b0e) |
| ADBE | Adobe | [`0x232b8ed6377be97813853b0ac104c4cda8378d1b`](https://rh-scan.com/address/0x232b8ed6377be97813853b0ac104c4cda8378d1b) |
| AEHR | Aehr | [`0x5f604fba1162193a4388a5dfa56f556f3e133cc2`](https://rh-scan.com/address/0x5f604fba1162193a4388a5dfa56f556f3e133cc2) |
| AEIS | Advanced Energy | [`0xfaf9cb261b5fcc1f404bb10cd39c5c6c1974e612`](https://rh-scan.com/address/0xfaf9cb261b5fcc1f404bb10cd39c5c6c1974e612) |
| ALAB | Astera Labs, Inc. | [`0x748c32c3ca24edf31ea597db1f3d330a7a6da3dc`](https://rh-scan.com/address/0x748c32c3ca24edf31ea597db1f3d330a7a6da3dc) |
| AMAT | Applied Materials | [`0x36046893810a7e7fce501229d57dc3fc8c8716d0`](https://rh-scan.com/address/0x36046893810a7e7fce501229d57dc3fc8c8716d0) |
| AMBA | Ambarella | [`0x99d9d8663545151603863c5acbd6fc3218899009`](https://rh-scan.com/address/0x99d9d8663545151603863c5acbd6fc3218899009) |
| AMC | AMC Entertainment | [`0x05a3d1cd21d0c88145e82600e62e7e496e0f222b`](https://rh-scan.com/address/0x05a3d1cd21d0c88145e82600e62e7e496e0f222b) |
| AMD | AMD | [`0x86923f96303d656e4aa86d9d42d1e57ad2023fdc`](https://rh-scan.com/address/0x86923f96303d656e4aa86d9d42d1e57ad2023fdc) |
| AMKR | Amkor Technology | [`0xdd356aa38f40a7b7076755ac854b6fbb1f0d305b`](https://rh-scan.com/address/0xdd356aa38f40a7b7076755ac854b6fbb1f0d305b) |
| AMZN | Amazon | [`0x12f190a9f9d7d37a250758b26824b97ce941bf54`](https://rh-scan.com/address/0x12f190a9f9d7d37a250758b26824b97ce941bf54) |
| ANET | Arista | [`0x28babd556b60e53663b8615036479a29c2cdd1bf`](https://rh-scan.com/address/0x28babd556b60e53663b8615036479a29c2cdd1bf) |
| APLD | Applied Digital | [`0xb8dbf92f9741c9ac1c32115e78581f23509916fd`](https://rh-scan.com/address/0xb8dbf92f9741c9ac1c32115e78581f23509916fd) |
| APP | AppLovin | [`0xa249baf1063af884807c1e1400aef7784836917e`](https://rh-scan.com/address/0xa249baf1063af884807c1e1400aef7784836917e) |
| ASML | ASML Holding NV | [`0x47f93d52cbec7c6d2cfc080e154002370a60daea`](https://rh-scan.com/address/0x47f93d52cbec7c6d2cfc080e154002370a60daea) |
| ASTS | AST SpaceMobile | [`0x1af6446f07eb1d97c546afc8c9544cbdf3ad5137`](https://rh-scan.com/address/0x1af6446f07eb1d97c546afc8c9544cbdf3ad5137) |
| AUR | Aurora Innovation | [`0x373c06c4f7bde527d7dae4ba169e42b55e393ced`](https://rh-scan.com/address/0x373c06c4f7bde527d7dae4ba169e42b55e393ced) |
| AVAV | AeroVironment | [`0xf6290b5e7c26502e2da514c31509849718ea76a5`](https://rh-scan.com/address/0xf6290b5e7c26502e2da514c31509849718ea76a5) |
| AVGO | Broadcom | [`0x156e175dd063a8ce274c50654ef40e0032b3fbcf`](https://rh-scan.com/address/0x156e175dd063a8ce274c50654ef40e0032b3fbcf) |
| AXON | Axon | [`0xc27dbd474af5181c5a8777903690d8d262d12648`](https://rh-scan.com/address/0xc27dbd474af5181c5a8777903690d8d262d12648) |
| AXTI | AXT | [`0x141eea040c2250eec0314e336975e81f85f6585e`](https://rh-scan.com/address/0x141eea040c2250eec0314e336975e81f85f6585e) |
| BA | Boeing | [`0x4d21483a44bf67a86b77e3da301411880797d452`](https://rh-scan.com/address/0x4d21483a44bf67a86b77e3da301411880797d452) |
| BABA | Alibaba | [`0xad25ac6c84d497db898fa1e8387bf6af3532a1c4`](https://rh-scan.com/address/0xad25ac6c84d497db898fa1e8387bf6af3532a1c4) |
| BB | Blackberry | [`0x48e39e56acdba37b09020c0b734a613c9a2f100a`](https://rh-scan.com/address/0x48e39e56acdba37b09020c0b734a613c9a2f100a) |
| BE | Bloom Energy | [`0x822cc93ffd030293e9842c30bbd678f530701867`](https://rh-scan.com/address/0x822cc93ffd030293e9842c30bbd678f530701867) |
| BND | Vanguard Total Bond Market ETF | [`0x2f62fc9fabb470c690f141c28340ed832bb27020`](https://rh-scan.com/address/0x2f62fc9fabb470c690f141c28340ed832bb27020) |
| BULL | Webull | [`0xcef9027c7d6985b85f0ba431125073529a947a68`](https://rh-scan.com/address/0xcef9027c7d6985b85f0ba431125073529a947a68) |
| CBRS | Cerebras Systems | [`0x5c90450bbb4273d7b2f17cf6917aeb237a569679`](https://rh-scan.com/address/0x5c90450bbb4273d7b2f17cf6917aeb237a569679) |
| CCL | Carnival Corporation | [`0x9651342cea770ae9a2969ba2a52611523146aef9`](https://rh-scan.com/address/0x9651342cea770ae9a2969ba2a52611523146aef9) |
| CEG | Constellation Energy | [`0xae517a2903e68bd929dfd15be875f8369d53e94a`](https://rh-scan.com/address/0xae517a2903e68bd929dfd15be875f8369d53e94a) |
| CELH | Celsius | [`0x8cf07c5a878945185d327aaa6e33faa95f95e7bf`](https://rh-scan.com/address/0x8cf07c5a878945185d327aaa6e33faa95f95e7bf) |
| CIEN | Ciena | [`0x44f6d488021f8233b9416294d1fe9b1fee28382d`](https://rh-scan.com/address/0x44f6d488021f8233b9416294d1fe9b1fee28382d) |
| CLOV | Clover Health Investments | [`0x62200915e7deab1ec7f79fb246dadbb80eacddd0`](https://rh-scan.com/address/0x62200915e7deab1ec7f79fb246dadbb80eacddd0) |
| CLS | Celestica | [`0xbf449977089c718c004a66c554b26b94ef3ad4de`](https://rh-scan.com/address/0xbf449977089c718c004a66c554b26b94ef3ad4de) |
| CLSK | CleanSpark | [`0xcbb95bbf36099d34da091dc6fa6f49efa257cee3`](https://rh-scan.com/address/0xcbb95bbf36099d34da091dc6fa6f49efa257cee3) |
| COHR | Coherent | [`0x92f9f459f1a9a5ad266b182be7bffd1c6c666894`](https://rh-scan.com/address/0x92f9f459f1a9a5ad266b182be7bffd1c6c666894) |
| COIN | Coinbase | [`0x6330d8c3178a418788df01a47479c0ce7ccf450b`](https://rh-scan.com/address/0x6330d8c3178a418788df01a47479c0ce7ccf450b) |
| COST | Costco | [`0x4ea005168d7f09a7a0ba9d1def21a479950e44c2`](https://rh-scan.com/address/0x4ea005168d7f09a7a0ba9d1def21a479950e44c2) |
| CRCL | Circle Internet Group | [`0xdf0992e440dd0be65bd8439b609d6d4366bf1cb5`](https://rh-scan.com/address/0xdf0992e440dd0be65bd8439b609d6d4366bf1cb5) |
| CRDO | Credo Technology Group | [`0x4d67253bc223e6b0e104f1084c1fb2b669ddc41b`](https://rh-scan.com/address/0x4d67253bc223e6b0e104f1084c1fb2b669ddc41b) |
| CRM | Salesforce | [`0xd95b44124e475743a7589e68f3d74008a5536d44`](https://rh-scan.com/address/0xd95b44124e475743a7589e68f3d74008a5536d44) |
| CRWD | CrowdStrike Holdings | [`0xea72ecca2d0f6bfa1394dbbcff85b52cd4233931`](https://rh-scan.com/address/0xea72ecca2d0f6bfa1394dbbcff85b52cd4233931) |
| CRWV | CoreWeave | [`0x5f10a1c971b69e47e059e1dc91901b59b3fb49c3`](https://rh-scan.com/address/0x5f10a1c971b69e47e059e1dc91901b59b3fb49c3) |
| CSCO | Cisco Systems | [`0xf543967eebb6f1917992ef0e68de63ab07a5a0da`](https://rh-scan.com/address/0xf543967eebb6f1917992ef0e68de63ab07a5a0da) |
| CTSH | Cognizant | [`0x63d5a3b6939a33f1e75d8bcd85759858239600db`](https://rh-scan.com/address/0x63d5a3b6939a33f1e75d8bcd85759858239600db) |
| CVNA | Carvana | [`0xa4f319104089fe321dc8093c6e707d4fe190a988`](https://rh-scan.com/address/0xa4f319104089fe321dc8093c6e707d4fe190a988) |
| DDOG | Datadog | [`0x27c99fbde9d0d2aa4f4bfb4943f237843ddf6958`](https://rh-scan.com/address/0x27c99fbde9d0d2aa4f4bfb4943f237843ddf6958) |
| DELL | Dell | [`0x941ae714ec6d8130c7b75d67160ca08f1e7d11dd`](https://rh-scan.com/address/0x941ae714ec6d8130c7b75d67160ca08f1e7d11dd) |
| DJT | Trump Media & Technology Group | [`0x1d11f0496982706c5e14a514d4e79f2e6bde4516`](https://rh-scan.com/address/0x1d11f0496982706c5e14a514d4e79f2e6bde4516) |
| DOCN | DigitalOcean | [`0xc02f12b9fe9e707079ec0d546f3050d3f6c1f8bd`](https://rh-scan.com/address/0xc02f12b9fe9e707079ec0d546f3050d3f6c1f8bd) |
| ELF | e.l.f. Beauty | [`0x39ec44bee4f6a116c6f9b8de566848a985c53c60`](https://rh-scan.com/address/0x39ec44bee4f6a116c6f9b8de566848a985c53c60) |
| EWT | iShares MSCI Taiwan Capped ETF | [`0x1c690498150252222c275a5ced69d3a6b1f52d5e`](https://rh-scan.com/address/0x1c690498150252222c275a5ced69d3a6b1f52d5e) |
| EWY | iShares MSCI South Korea fund | [`0x7f0abef0c07280f82c6a08ead09ded6bae2c13fc`](https://rh-scan.com/address/0x7f0abef0c07280f82c6a08ead09ded6bae2c13fc) |
| F | Ford Motor | [`0x25c288e6d899b9bc30160965ad9644c67e73be0c`](https://rh-scan.com/address/0x25c288e6d899b9bc30160965ad9644c67e73be0c) |
| FICO | Fair Isaac | [`0xa48f22a46c0f1c46ca7d111cb6c137c271987180`](https://rh-scan.com/address/0xa48f22a46c0f1c46ca7d111cb6c137c271987180) |
| FIG | Figma | [`0x41f4267525a8aff329540ef24fd83d9044758b33`](https://rh-scan.com/address/0x41f4267525a8aff329540ef24fd83d9044758b33) |
| FISV | Fiserv | [`0x9ece29a4a2397c0a35fb5fa8ee2b9509130a98cc`](https://rh-scan.com/address/0x9ece29a4a2397c0a35fb5fa8ee2b9509130a98cc) |
| FIX | Comfort Systems | [`0x93dbb1d2dc5d63f4abacff30485273f538df68ac`](https://rh-scan.com/address/0x93dbb1d2dc5d63f4abacff30485273f538df68ac) |
| FLNC | Fluence Energy | [`0x282e87451e10fa6679bc7d76c69be44cd3fc777c`](https://rh-scan.com/address/0x282e87451e10fa6679bc7d76c69be44cd3fc777c) |
| FLY | Firefly Aerospace Inc. | [`0x03bc731ffb162cdd7b98d3c6542bfc291126075d`](https://rh-scan.com/address/0x03bc731ffb162cdd7b98d3c6542bfc291126075d) |
| FTNT | Fortinet | [`0x3fb8976980d486084b2eb4a404bd12e72823958f`](https://rh-scan.com/address/0x3fb8976980d486084b2eb4a404bd12e72823958f) |
| FUTU | Futu Holdings | [`0xeb30663bdff0622ef4e4e5cbb4e975f19f33f51d`](https://rh-scan.com/address/0xeb30663bdff0622ef4e4e5cbb4e975f19f33f51d) |
| GE | General Electric | [`0x63b814ddbd6bf339f25fed8c36158a008d5b373e`](https://rh-scan.com/address/0x63b814ddbd6bf339f25fed8c36158a008d5b373e) |
| GEV | GE Vernova | [`0x94b8aae43a1ccc08aa64b7d1f29b4d920af4a0c9`](https://rh-scan.com/address/0x94b8aae43a1ccc08aa64b7d1f29b4d920af4a0c9) |
| GLD | SPDR Gold Trust | [`0xc9a981fee1f9dec688bb123ccdecc63d0debfc4e`](https://rh-scan.com/address/0xc9a981fee1f9dec688bb123ccdecc63d0debfc4e) |
| GLW | Corning | [`0x7c04e6a3368f2a1de3874f0e80d2e0a1a9915da6`](https://rh-scan.com/address/0x7c04e6a3368f2a1de3874f0e80d2e0a1a9915da6) |
| GLXY | Galaxy Digital Inc. | [`0x2d427692e928fa156ec22acfabafa0447c5805b7`](https://rh-scan.com/address/0x2d427692e928fa156ec22acfabafa0447c5805b7) |
| GME | GameStop | [`0x1b0e319c6a659f002271b69db8a7df2f911c153e`](https://rh-scan.com/address/0x1b0e319c6a659f002271b69db8a7df2f911c153e) |
| GOOGL | Alphabet Class A | [`0x2e0847e8910a9732eb3fb1bb4b70a580adad4fe3`](https://rh-scan.com/address/0x2e0847e8910a9732eb3fb1bb4b70a580adad4fe3) |
| HII | Huntington Ingalls | [`0xeb61c0ed490a367d4e3631ccf8a74b3bfc7e775d`](https://rh-scan.com/address/0xeb61c0ed490a367d4e3631ccf8a74b3bfc7e775d) |
| HIMS | Hims & Hers Health | [`0xccee82fe024c36fa15e1005ede3e9e4787e23d09`](https://rh-scan.com/address/0xccee82fe024c36fa15e1005ede3e9e4787e23d09) |
| HPE | HP Enterprise | [`0x59dd09d4900c2e4b5f75b7c0d4e6796fcc234cb1`](https://rh-scan.com/address/0x59dd09d4900c2e4b5f75b7c0d4e6796fcc234cb1) |
| HWM | Howmet Aerospace | [`0xaea445c5f3db1a462998ccc422a875a361ee5d99`](https://rh-scan.com/address/0xaea445c5f3db1a462998ccc422a875a361ee5d99) |
| IBM | IBM | [`0x980dcf6766fa79f5cf0c4aadb3ab477ff15a9619`](https://rh-scan.com/address/0x980dcf6766fa79f5cf0c4aadb3ab477ff15a9619) |
| IBRX | ImmunityBio | [`0x7c148f74ac7445d1f28366b7fcdc6792a9fcd0cf`](https://rh-scan.com/address/0x7c148f74ac7445d1f28366b7fcdc6792a9fcd0cf) |
| INDA | iShares MSCI India ETF | [`0xacef2e09adb47ad6abebad9ff06689e60615c2b6`](https://rh-scan.com/address/0xacef2e09adb47ad6abebad9ff06689e60615c2b6) |
| INFQ | Infleqtion | [`0xb853bc83a753342a4f8320ea680b4b1e84118d21`](https://rh-scan.com/address/0xb853bc83a753342a4f8320ea680b4b1e84118d21) |
| INOD | Innodata | [`0xf1953dab6fad537488d5a022361ffaa8b4c95ec6`](https://rh-scan.com/address/0xf1953dab6fad537488d5a022361ffaa8b4c95ec6) |
| INTC | Intel | [`0xc72b96e0e48ecd4dc75e1e45396e26300bc39681`](https://rh-scan.com/address/0xc72b96e0e48ecd4dc75e1e45396e26300bc39681) |
| INTU | Intuit | [`0x56d23bee5f41a7120170b0c603dae30128e460e9`](https://rh-scan.com/address/0x56d23bee5f41a7120170b0c603dae30128e460e9) |
| IONQ | IonQ | [`0x558378e000d634a36593e338ebacdd6207640efe`](https://rh-scan.com/address/0x558378e000d634a36593e338ebacdd6207640efe) |
| IREN | IREN Limited | [`0xf0ab0c93be6f41369d302e55db1a96b3c430212d`](https://rh-scan.com/address/0xf0ab0c93be6f41369d302e55db1a96b3c430212d) |
| JBL | Jabil Inc. | [`0xeaf2512dfc1beac608f8794b3793cd4e02894aa6`](https://rh-scan.com/address/0xeaf2512dfc1beac608f8794b3793cd4e02894aa6) |
| JNJ | Johnson & Johnson | [`0x03dfbbe0ac4e7bcdafd08ed41a400326b77d8c80`](https://rh-scan.com/address/0x03dfbbe0ac4e7bcdafd08ed41a400326b77d8c80) |
| JOBY | Joby Aviation | [`0xb334c5ce741b80b5b671f47f5c269cb193fe8e24`](https://rh-scan.com/address/0xb334c5ce741b80b5b671f47f5c269cb193fe8e24) |
| KLAC | KLA | [`0x96b933c74ecb4a0926b9210cef7b743ef46be2e9`](https://rh-scan.com/address/0x96b933c74ecb4a0926b9210cef7b743ef46be2e9) |
| KSS | Kohls Corporation | [`0x12e3c047bf9aecaf9ddc98c05c31bfd1dd043993`](https://rh-scan.com/address/0x12e3c047bf9aecaf9ddc98c05c31bfd1dd043993) |
| KTOS | Kratos Defense & Security Solutions | [`0x7fd06a4d81ccfa3f351394e144d5191874c31313`](https://rh-scan.com/address/0x7fd06a4d81ccfa3f351394e144d5191874c31313) |
| LHX | L3Harris | [`0x48d60243c66437c6ac3c2495be94747aed5dfe25`](https://rh-scan.com/address/0x48d60243c66437c6ac3c2495be94747aed5dfe25) |
| LITE | Lumentum | [`0x8ef20885f94e3d9bc7eb3080279188bd5ed7c08c`](https://rh-scan.com/address/0x8ef20885f94e3d9bc7eb3080279188bd5ed7c08c) |
| LLY | Eli Lilly | [`0x8005d266423c7ea827372c9c864491e5786600ea`](https://rh-scan.com/address/0x8005d266423c7ea827372c9c864491e5786600ea) |
| LMT | Lockheed | [`0x329fcaceb9ad6f9580dd5f643fed0646900d043c`](https://rh-scan.com/address/0x329fcaceb9ad6f9580dd5f643fed0646900d043c) |
| LRCX | Lam Research Corp | [`0x57b0030166db0c31690d1a5aa167e2e26e2c29a4`](https://rh-scan.com/address/0x57b0030166db0c31690d1a5aa167e2e26e2c29a4) |
| LULU | Lululemon | [`0x4e62068525ab11fe768e29dfd00ef909b9803016`](https://rh-scan.com/address/0x4e62068525ab11fe768e29dfd00ef909b9803016) |
| LUNR | Intuitive Machines | [`0xa5d4968421ba94814be3b136b15cf422101ac1a3`](https://rh-scan.com/address/0xa5d4968421ba94814be3b136b15cf422101ac1a3) |
| MDB | MongoDB | [`0xddf2266b79abf0b48898959b0ed6e6adf512be74`](https://rh-scan.com/address/0xddf2266b79abf0b48898959b0ed6e6adf512be74) |
| META | Meta Platforms | [`0xc0d6457c16cc70d6790dd43521c899c87ce02f35`](https://rh-scan.com/address/0xc0d6457c16cc70d6790dd43521c899c87ce02f35) |
| MOD | Modine | [`0xc6cbad1016b38b797610c25e1dc7d95988b1f362`](https://rh-scan.com/address/0xc6cbad1016b38b797610c25e1dc7d95988b1f362) |
| MPWR | Monolithic Power Systems | [`0x52d50d0280ad1054b43f052bd70a49a212a1b128`](https://rh-scan.com/address/0x52d50d0280ad1054b43f052bd70a49a212a1b128) |
| MRNA | Moderna | [`0x43b07d15ce533bec5476d70c22a78a1b2b662155`](https://rh-scan.com/address/0x43b07d15ce533bec5476d70c22a78a1b2b662155) |
| MRVL | Marvell Technology | [`0x62fd0668e10d8b72339be2dcf7643001688ff13b`](https://rh-scan.com/address/0x62fd0668e10d8b72339be2dcf7643001688ff13b) |
| MSFT | Microsoft | [`0xe93237c50d904957cf27e7b1133b510c669c2e74`](https://rh-scan.com/address/0xe93237c50d904957cf27e7b1133b510c669c2e74) |
| MSTR | Strategy Inc. | [`0xec262a75e413fafd0df80480274532c79d42da09`](https://rh-scan.com/address/0xec262a75e413fafd0df80480274532c79d42da09) |
| MTSI | MACOM | [`0xc93f4d80e268ab922e871bd169156c3cc41894e6`](https://rh-scan.com/address/0xc93f4d80e268ab922e871bd169156c3cc41894e6) |
| MU | Micron Technology | [`0xff080c8ce2e5feadaca0da81314ae59d232d4afd`](https://rh-scan.com/address/0xff080c8ce2e5feadaca0da81314ae59d232d4afd) |
| MXL | MaxLinear | [`0x48961813349333209994750ffa89b3c5c22ec969`](https://rh-scan.com/address/0x48961813349333209994750ffa89b3c5c22ec969) |
| NAVN | Navan | [`0xf7181b63fdb858558a74ba96bc42732684cd7965`](https://rh-scan.com/address/0xf7181b63fdb858558a74ba96bc42732684cd7965) |
| NBIS | Nebius Group | [`0x9d9c6684f596f66a64c030b93a886d51fd4d7931`](https://rh-scan.com/address/0x9d9c6684f596f66a64c030b93a886d51fd4d7931) |
| NET | Cloudflare | [`0x116f00968269b7bfbad4109ce591d6e74c0601d4`](https://rh-scan.com/address/0x116f00968269b7bfbad4109ce591d6e74c0601d4) |
| NFLX | Netflix | [`0xe0444ef8bf4ed74f74fd73686e2ddf4c1c5591e8`](https://rh-scan.com/address/0xe0444ef8bf4ed74f74fd73686e2ddf4c1c5591e8) |
| NNE | Nano Nuclear Energy | [`0xbef75684c43c4ea7bd18dd532a2244674ee8b926`](https://rh-scan.com/address/0xbef75684c43c4ea7bd18dd532a2244674ee8b926) |
| NOW | ServiceNow | [`0x0c3260af4b8f13a69c4c2dfb84fd667890cdfa14`](https://rh-scan.com/address/0x0c3260af4b8f13a69c4c2dfb84fd667890cdfa14) |
| NU | Nu | [`0x408c14038a04f7bd235329e26d2bf569ee20e250`](https://rh-scan.com/address/0x408c14038a04f7bd235329e26d2bf569ee20e250) |
| NVDA | NVIDIA | [`0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec`](https://rh-scan.com/address/0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec) |
| NVTS | Navitas Semiconductor | [`0xbe6702d7b70315376dc48a3293f24f0982f86386`](https://rh-scan.com/address/0xbe6702d7b70315376dc48a3293f24f0982f86386) |
| OKLO | Oklo | [`0x8b2f88497f15a18e9d4ffa1a8ffb8538399ae774`](https://rh-scan.com/address/0x8b2f88497f15a18e9d4ffa1a8ffb8538399ae774) |
| ON | ON Semiconductor | [`0xbbd09f72b025360fee5c928053dca6248d35be54`](https://rh-scan.com/address/0xbbd09f72b025360fee5c928053dca6248d35be54) |
| ONTO | Onto Innovation | [`0x8ff63eaeee3fe54ba450c4f5538064ec5a893aef`](https://rh-scan.com/address/0x8ff63eaeee3fe54ba450c4f5538064ec5a893aef) |
| ORCL | Oracle | [`0xb0992820e760d836549ba69bc7598b4af75dee03`](https://rh-scan.com/address/0xb0992820e760d836549ba69bc7598b4af75dee03) |
| OUST | Ouster | [`0x40e7a279850e443f582059ae5dc1c3b6563e6395`](https://rh-scan.com/address/0x40e7a279850e443f582059ae5dc1c3b6563e6395) |
| P | Everpure | [`0x1cdad396db64bda184d5182a97dd9b3c62100b7d`](https://rh-scan.com/address/0x1cdad396db64bda184d5182a97dd9b3c62100b7d) |
| PANW | Palo Alto Networks | [`0xb039597ed45cba7b6e2fb9e8be51802969cee5be`](https://rh-scan.com/address/0xb039597ed45cba7b6e2fb9e8be51802969cee5be) |
| PATH | UiPath | [`0xfb2664f07b6aadd29ea7a59d8859b1aeb8645cda`](https://rh-scan.com/address/0xfb2664f07b6aadd29ea7a59d8859b1aeb8645cda) |
| PENG | Penguin Solutions | [`0x9b23573b156b52565012f5ce02cdf60afbaa70be`](https://rh-scan.com/address/0x9b23573b156b52565012f5ce02cdf60afbaa70be) |
| PFE | Pfizer | [`0x7066a64c24e4206cd62e83bf198c1e7eb361f51e`](https://rh-scan.com/address/0x7066a64c24e4206cd62e83bf198c1e7eb361f51e) |
| PL | Planet Labs | [`0xaa4d64474c172010ab57719cb9951e6142a100d3`](https://rh-scan.com/address/0xaa4d64474c172010ab57719cb9951e6142a100d3) |
| PLTR | Palantir Technologies | [`0x894e1ec2d74ffe5aef8dc8a9e84686accb964f2a`](https://rh-scan.com/address/0x894e1ec2d74ffe5aef8dc8a9e84686accb964f2a) |
| POET | POET Technologies | [`0xcf6b2d875361be807eafa57458c80f28521f9333`](https://rh-scan.com/address/0xcf6b2d875361be807eafa57458c80f28521f9333) |
| POWL | Powell Industries | [`0x237c16d66590f67b886d978acd362eaead8b18c7`](https://rh-scan.com/address/0x237c16d66590f67b886d978acd362eaead8b18c7) |
| PR | Permian Resources | [`0x4189f0c66ebbb0bfef1c31f763131361ef32f77c`](https://rh-scan.com/address/0x4189f0c66ebbb0bfef1c31f763131361ef32f77c) |
| PWR | Quanta | [`0x9ab02ead789b6903c3c44d0ed32f9c707cdf12fd`](https://rh-scan.com/address/0x9ab02ead789b6903c3c44d0ed32f9c707cdf12fd) |
| QBTS | D-Wave Quantum Inc. Common Stock | [`0xc583c60aef9dc401da72cec1b404743a93cea1cc`](https://rh-scan.com/address/0xc583c60aef9dc401da72cec1b404743a93cea1cc) |
| QCOM | Qualcomm | [`0x0f17206447090e464c277571124dd2688e48aea9`](https://rh-scan.com/address/0x0f17206447090e464c277571124dd2688e48aea9) |
| QQQ | Invesco QQQ | [`0xd5f3879160bc7c32ebb4dc785f8a4f505888de68`](https://rh-scan.com/address/0xd5f3879160bc7c32ebb4dc785f8a4f505888de68) |
| QUBT | Quantum Computing | [`0x59818904ab4ce163b3ce4ffb64f2d6ca02c434b4`](https://rh-scan.com/address/0x59818904ab4ce163b3ce4ffb64f2d6ca02c434b4) |
| RBLX | Roblox | [`0xf0c4bf4c582cb3836e98394b1d4e7b7281101be8`](https://rh-scan.com/address/0xf0c4bf4c582cb3836e98394b1d4e7b7281101be8) |
| RCAT | Red Cat | [`0xfde6b5d9bb419b10c23268c74e369abff39c0460`](https://rh-scan.com/address/0xfde6b5d9bb419b10c23268c74e369abff39c0460) |
| RDDT | Reddit | [`0x05b37fb53a299a1b874a619e1c4c404d52c36f4c`](https://rh-scan.com/address/0x05b37fb53a299a1b874a619e1c4c404d52c36f4c) |
| RDW | Redwire | [`0x92ef19e82bd8ff36661de838d5eae7e5cef0effe`](https://rh-scan.com/address/0x92ef19e82bd8ff36661de838d5eae7e5cef0effe) |
| RGTI | Rigetti Computing | [`0x284358abc07f9359f19f4b5b4ac91901be2597ba`](https://rh-scan.com/address/0x284358abc07f9359f19f4b5b4ac91901be2597ba) |
| RIVN | Rivian Automotive | [`0xb1bf26c1d20ff267a4f93550d1e0d06ac40a114b`](https://rh-scan.com/address/0xb1bf26c1d20ff267a4f93550d1e0d06ac40a114b) |
| RKLB | Rocket Lab Corporation | [`0x3b14c39e89d60d627b42a1a4ca45b5bb45fc12e2`](https://rh-scan.com/address/0x3b14c39e89d60d627b42a1a4ca45b5bb45fc12e2) |
| RUN | Sunrun | [`0x756bc80af765c82da966a788858d65adf14f3793`](https://rh-scan.com/address/0x756bc80af765c82da966a788858d65adf14f3793) |
| SATS | EchoStar | [`0x95052ddcd5dc25641657424a8cf04834997e1730`](https://rh-scan.com/address/0x95052ddcd5dc25641657424a8cf04834997e1730) |
| SCHD | Schwab US Dividend Equity ETF | [`0xd63abb2c13d7a8421a8017a712802053568e3c1d`](https://rh-scan.com/address/0xd63abb2c13d7a8421a8017a712802053568e3c1d) |
| SGOV | iShares 0-3 Month Treasury Bond | [`0x92fd66527192e3e61d4ddd13322aa222de86f9b5`](https://rh-scan.com/address/0x92fd66527192e3e61d4ddd13322aa222de86f9b5) |
| SHOP | Shopify | [`0xf53f66751b1eff985311b693531e3290f600c410`](https://rh-scan.com/address/0xf53f66751b1eff985311b693531e3290f600c410) |
| SHY | iShares 1-3 Year Treasury Bond ETF | [`0xbe274710bf3d9567e1b290ef6a5f9f90ca016fd8`](https://rh-scan.com/address/0xbe274710bf3d9567e1b290ef6a5f9f90ca016fd8) |
| SIMO | Silicon Motion | [`0x77e655e37f4d913fb9540e0d541d824171a60e81`](https://rh-scan.com/address/0x77e655e37f4d913fb9540e0d541d824171a60e81) |
| SKHY | SK hynix Inc. American Depositary Shares | [`0x84cab63bc87912e71ad199ff14a0ba45de68fef8`](https://rh-scan.com/address/0x84cab63bc87912e71ad199ff14a0ba45de68fef8) |
| SLS | SELLAS Life Sciences | [`0x285b231728c7e4333799183df1094d775246a535`](https://rh-scan.com/address/0x285b231728c7e4333799183df1094d775246a535) |
| SLV | iShares Silver Trust | [`0x411efb0e7f985935daec3d4c3ebaea0d0ad7d89f`](https://rh-scan.com/address/0x411efb0e7f985935daec3d4c3ebaea0d0ad7d89f) |
| SMCI | Super Micro Computer | [`0xc01aa1fecec0605b13bc84874ff7256c0f5f562a`](https://rh-scan.com/address/0xc01aa1fecec0605b13bc84874ff7256c0f5f562a) |
| SMH | VanEck Semiconductor ETF | [`0x072f979c2cac8e1391b0162a87fee094bf8744a0`](https://rh-scan.com/address/0x072f979c2cac8e1391b0162a87fee094bf8744a0) |
| SMR | NuScale Power | [`0x1eebee7f74517e0279dfb09d25b0407beec3fdd6`](https://rh-scan.com/address/0x1eebee7f74517e0279dfb09d25b0407beec3fdd6) |
| SNAP | Snap | [`0xf6589f11bc40b669e584073f428b05562f568733`](https://rh-scan.com/address/0xf6589f11bc40b669e584073f428b05562f568733) |
| SNDK | Sandisk Corporation | [`0xb90a19ff0af67f7779aff50a882a9cff42446400`](https://rh-scan.com/address/0xb90a19ff0af67f7779aff50a882a9cff42446400) |
| SNOW | Snowflake | [`0xba0cab75495255d0cb58e22b648bfed4ecd1f47e`](https://rh-scan.com/address/0xba0cab75495255d0cb58e22b648bfed4ecd1f47e) |
| SOFI | SoFi Technologies | [`0x98e75885157c80992a8d41b696d8c9c6fb30a926`](https://rh-scan.com/address/0x98e75885157c80992a8d41b696d8c9c6fb30a926) |
| SOUN | SoundHound AI | [`0x6e3dfd9f7e1649baa14d25cac18c94d62db10a54`](https://rh-scan.com/address/0x6e3dfd9f7e1649baa14d25cac18c94d62db10a54) |
| SOXX | iShares Semiconductor ETF | [`0x75742c18bc1f1c5c5f448f4c9d9c6f66dafaaa38`](https://rh-scan.com/address/0x75742c18bc1f1c5c5f448f4c9d9c6f66dafaaa38) |
| SPCX | Space Exploration Technologies Corp. Class A Common Stock | [`0x4a0e65a3eccec6dbe60ae065f2e7bb85fae35eea`](https://rh-scan.com/address/0x4a0e65a3eccec6dbe60ae065f2e7bb85fae35eea) |
| SPMO | Invesco S\&P 500 Momentum ETF | [`0xad622320e520de39e72d41ef07438c3fd3354875`](https://rh-scan.com/address/0xad622320e520de39e72d41ef07438c3fd3354875) |
| SPY | SPDR S\&P 500 ETF Trust | [`0x117cc2133c37b721f49de2a7a74833232b3b4c0c`](https://rh-scan.com/address/0x117cc2133c37b721f49de2a7a74833232b3b4c0c) |
| TE | T1 Energy | [`0xb1969f6604ca1ae7a2cd3f1827876e914594ca2d`](https://rh-scan.com/address/0xb1969f6604ca1ae7a2cd3f1827876e914594ca2d) |
| TEAM | Atlassian Corporation | [`0x5b97476b922f3305131b8f0b9d333172e87f4aae`](https://rh-scan.com/address/0x5b97476b922f3305131b8f0b9d333172e87f4aae) |
| TEM | Tempus AI | [`0xb1cc0ec7db69cf43539119814df40071b9d61793`](https://rh-scan.com/address/0xb1cc0ec7db69cf43539119814df40071b9d61793) |
| TER | Teradyne | [`0x2778c5024d5ca2cdb0f8ead671ffc69963adcd9c`](https://rh-scan.com/address/0x2778c5024d5ca2cdb0f8ead671ffc69963adcd9c) |
| TSEM | Tower Semiconductor | [`0x89776d4cd68193597a2fc132cfac1fde36ccea8a`](https://rh-scan.com/address/0x89776d4cd68193597a2fc132cfac1fde36ccea8a) |
| TSLA | Tesla | [`0x322f0929c4625ed5bad873c95208d54e1c003b2d`](https://rh-scan.com/address/0x322f0929c4625ed5bad873c95208d54e1c003b2d) |
| TSM | Taiwan Semiconductor Manufacturing | [`0x58ffe4a942d3885baa22d7520691f611ef09e7aa`](https://rh-scan.com/address/0x58ffe4a942d3885baa22d7520691f611ef09e7aa) |
| TTD | Trade Desk | [`0x0b5fb4031cae9163db10b169ee72685f0edc8545`](https://rh-scan.com/address/0x0b5fb4031cae9163db10b169ee72685f0edc8545) |
| TTWO | Take-Two Interactive Software | [`0x5e81213613b6b86eab4c6c50d718d34359459786`](https://rh-scan.com/address/0x5e81213613b6b86eab4c6c50d718d34359459786) |
| UMC | United Microelectronics | [`0x0e6e67ba88e7b5d9b67636a215c76779b948de79`](https://rh-scan.com/address/0x0e6e67ba88e7b5d9b67636a215c76779b948de79) |
| UNH | UnitedHealth | [`0xcf364ea52787e289de6f32077834056e3e70d6a8`](https://rh-scan.com/address/0xcf364ea52787e289de6f32077834056e3e70d6a8) |
| UPS | UPS | [`0xf23250dac154d05bb671cb0d0ebef3c635c79ce2`](https://rh-scan.com/address/0xf23250dac154d05bb671cb0d0ebef3c635c79ce2) |
| USAR | USA Rare Earth | [`0xd917b029c761d264c6a312bbbcda868658ef86a6`](https://rh-scan.com/address/0xd917b029c761d264c6a312bbbcda868658ef86a6) |
| USO | United States Oil Fund | [`0xa30fa36db767ad9ed3f7a60fc79526fb4d56d344`](https://rh-scan.com/address/0xa30fa36db767ad9ed3f7a60fc79526fb4d56d344) |
| VICR | Vicor | [`0x6006ed4b2f94110851ff7509d97d034f0eed9226`](https://rh-scan.com/address/0x6006ed4b2f94110851ff7509d97d034f0eed9226) |
| VRT | Vertiv | [`0xfa78c12e6488814a0262e4e802749a4a737d5fb7`](https://rh-scan.com/address/0xfa78c12e6488814a0262e4e802749a4a737d5fb7) |
| VSAT | ViaSat | [`0x26dcbfb34fc83cabd6990f449674efdc6097ff85`](https://rh-scan.com/address/0x26dcbfb34fc83cabd6990f449674efdc6097ff85) |
| VST | Vistra | [`0x561e2a49212b7ccf47f2744ccb83e200722fadbc`](https://rh-scan.com/address/0x561e2a49212b7ccf47f2744ccb83e200722fadbc) |
| VTI | Vanguard Morningstar Total Stock Market ETF | [`0x0594134df3f171a354d9c85ebd65b7a6148f6d09`](https://rh-scan.com/address/0x0594134df3f171a354d9c85ebd65b7a6148f6d09) |
| WDAY | Workday | [`0x82da4646242e1d962e96e932269dc644c94a9caa`](https://rh-scan.com/address/0x82da4646242e1d962e96e932269dc644c94a9caa) |
| WDC | Western Digital | [`0xf52597345a8edf418bc4071b4a35112472277d3e`](https://rh-scan.com/address/0xf52597345a8edf418bc4071b4a35112472277d3e) |
| WULF | TeraWulf | [`0x348be1a8663f15edde5cdf8a96bb69078f7ab6fd`](https://rh-scan.com/address/0x348be1a8663f15edde5cdf8a96bb69078f7ab6fd) |
| WYFI | WhiteFiber, Inc. | [`0x9e7abd3c9139d14e4c86dce0e455aab7a0c2fb3e`](https://rh-scan.com/address/0x9e7abd3c9139d14e4c86dce0e455aab7a0c2fb3e) |
| XLK | State Street Technology Select Sector SPDR ETF | [`0x15cd20759ce7f3285c29a319de2d1a2e098c6f43`](https://rh-scan.com/address/0x15cd20759ce7f3285c29a319de2d1a2e098c6f43) |
| XNDU | Xanadu Quantum | [`0xa8eb3bccbf2017ee7cbfb652eb51cf2e1b153289`](https://rh-scan.com/address/0xa8eb3bccbf2017ee7cbfb652eb51cf2e1b153289) |
| XOM | ExxonMobil Holdings Corporation | [`0xf9b46d3d1b22199d4d1025a9cedb540a33f1a2d5`](https://rh-scan.com/address/0xf9b46d3d1b22199d4d1025a9cedb540a33f1a2d5) |
| ZM | Zoom | [`0x44c4f142009036cf477ed2d09932051843137cf1`](https://rh-scan.com/address/0x44c4f142009036cf477ed2d09932051843137cf1) |
| ZS | Zscaler | [`0x7dc013eb55e436f30d7ed1afe4e36d6e45e3c3f7`](https://rh-scan.com/address/0x7dc013eb55e436f30d7ed1afe4e36d6e45e3c3f7) |

> [!NOTE]
>
> The paired-asset catalog and opening-price settings can change for future launches. Existing pools keep the exact Stock Token, price frame, fee settings, and liquidity position recorded when they opened.

## BSC bStock catalog

The BSC catalog contains 21 registered bStocks. All use 18 decimals and the `uiMultiplier` display conversion; quote balances, approvals, swaps and fee claims use raw token units. The catalog includes ETF and leveraged ETF exposures as well as company-linked assets. A bStock symbol is not an ordinary share balance, and registration does not guarantee liquidity or unrestricted transfers.

BSC's creation fee is 0.003 BNB for either crypto or stock pairs. USD estimates use the underlying stock's reference price and the token's current conversion multiplier. Never apply the multiplier twice or use display-share amounts as raw token amounts. See [BSC configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#bsc-mainnet).

Both factories' registrations and decimals were verified on **November 5, 2026**, at block **131,696,961**. The [Standard stock snapshot](https://docs.o1.exchange/launchpad/reference/bsc-stock-quotes.json) and [Tax snapshot](https://docs.o1.exchange/launchpad/reference/bsc-tax-suite.json) contain their independently read ticks and revisions.

| Symbol | BSC token | Decimals |
| - | - | -: |
| AAPLB | [`0x431a3bee82e2ca41e49895cbece5bb0f76a89b7a`](https://bscscan.com/address/0x431a3bee82e2ca41e49895cbece5bb0f76a89b7a) | 18 |
| BABAB | [`0x4ef9d3062c7f6eba4aae4990c5036598c6eff4ec`](https://bscscan.com/address/0x4ef9d3062c7f6eba4aae4990c5036598c6eff4ec) | 18 |
| BMNRB | [`0x3548da95a9effe481e8604664d75e95821e557f5`](https://bscscan.com/address/0x3548da95a9effe481e8604664d75e95821e557f5) | 18 |
| BNCB | [`0x4902c5ebc598265ed2212b559b042de8a5eeec3f`](https://bscscan.com/address/0x4902c5ebc598265ed2212b559b042de8a5eeec3f) | 18 |
| DJTB | [`0xf2ec508422174ee564de98187db9359d318afb6b`](https://bscscan.com/address/0xf2ec508422174ee564de98187db9359d318afb6b) | 18 |
| FLNCB | [`0x4af1d41cd9dd950dca43984b43aaa2a8702714ac`](https://bscscan.com/address/0x4af1d41cd9dd950dca43984b43aaa2a8702714ac) | 18 |
| GMEB | [`0x46ceefda28dd7207059ed19b0acdc026955bb15c`](https://bscscan.com/address/0x46ceefda28dd7207059ed19b0acdc026955bb15c) | 18 |
| GOOGLB | [`0x3f53de71c126bdabae20f9cd64848d317f6c3238`](https://bscscan.com/address/0x3f53de71c126bdabae20f9cd64848d317f6c3238) | 18 |
| HOODB | [`0xa394dcea3fd3847fd793afbfd163e2e3858b7c65`](https://bscscan.com/address/0xa394dcea3fd3847fd793afbfd163e2e3858b7c65) | 18 |
| MRNAB | [`0x5fd86da9b05abe396fe9d02a4a213a7c00556503`](https://bscscan.com/address/0x5fd86da9b05abe396fe9d02a4a213a7c00556503) | 18 |
| MSFTB | [`0x80106cb3ead06659a5ad19df39d9b4733863b9b0`](https://bscscan.com/address/0x80106cb3ead06659a5ad19df39d9b4733863b9b0) | 18 |
| MSTRB | [`0xe87afb3076aeb0f9b14e368de8145ae6a2826a14`](https://bscscan.com/address/0xe87afb3076aeb0f9b14e368de8145ae6a2826a14) | 18 |
| NFLXB | [`0xd6829ea836b6fa224d099d40e54b31262f874631`](https://bscscan.com/address/0xd6829ea836b6fa224d099d40e54b31262f874631) | 18 |
| NVDAB | [`0x02fca66c1d1afb4e2a7884261eb00f63598a7436`](https://bscscan.com/address/0x02fca66c1d1afb4e2a7884261eb00f63598a7436) | 18 |
| QQQB | [`0x205812cdbed920aff76c6580abd681a46d11efc7`](https://bscscan.com/address/0x205812cdbed920aff76c6580abd681a46d11efc7) | 18 |
| SKHYB | [`0xca750ef65f295bbecd685abf54e82caf297bdb61`](https://bscscan.com/address/0xca750ef65f295bbecd685abf54e82caf297bdb61) | 18 |
| SOXLB | [`0xd97d097a89113fa59b76c572e5b2eb647e8eefaf`](https://bscscan.com/address/0xd97d097a89113fa59b76c572e5b2eb647e8eefaf) | 18 |
| SOXSB | [`0xe28cd11c99af2df76bb8ada4cd0ef3904378280f`](https://bscscan.com/address/0xe28cd11c99af2df76bb8ada4cd0ef3904378280f) | 18 |
| SPCXB | [`0xbe9d156892e55e7154bcd3cb0fea677f9d3103e1`](https://bscscan.com/address/0xbe9d156892e55e7154bcd3cb0fea677f9d3103e1) | 18 |
| SPYB | [`0x7138b48df7d98d7e3cc221bfe7192d0a178182d8`](https://bscscan.com/address/0x7138b48df7d98d7e3cc221bfe7192d0a178182d8) | 18 |
| TSLAB | [`0x5b1910eaad6450e50f816082aa078c41f10c292f`](https://bscscan.com/address/0x5b1910eaad6450e50f816082aa078c41f10c292f) | 18 |

## X Layer Stock Token catalog

The **45 registered wrapped stocks** below use 18 decimals. Registrations and decimals matched both factories at block **75,058,724** on **November 5, 2026**. Stock reference prices must apply the onchain wrapper conversion once to obtain the price of one quote token; amounts for approvals, swaps and claims remain raw quote-token units.

The [Standard stock snapshot](https://docs.o1.exchange/launchpad/reference/xlayer-stock-quotes.json) and [Tax snapshot](https://docs.o1.exchange/launchpad/reference/xlayer-tax-suite.json) contain each factory's own ticks and revisions. Only registered assets appear below; check current availability before preparing a launch.

| Symbol | X Layer quote token | Decimals |
| - | - | -: |
| wAAPLx | [`0x943BF64D566c32A2Bcd41AC92FB63C111cC9De8f`](https://xlayerscan.com/address/0x943BF64D566c32A2Bcd41AC92FB63C111cC9De8f) | 18 |
| wAMDx | [`0xEe7CcB0d37A12862e7f92F6C92a93d9c2d304266`](https://xlayerscan.com/address/0xEe7CcB0d37A12862e7f92F6C92a93d9c2d304266) | 18 |
| wAMZNx | [`0x910cabdE3EBa7Fc1Ce64fD14bD680b9f60fA0F90`](https://xlayerscan.com/address/0x910cabdE3EBa7Fc1Ce64fD14bD680b9f60fA0F90) | 18 |
| wASMLx | [`0x9147b03c16B18FC4F686f610f189f91Ddf4347b4`](https://xlayerscan.com/address/0x9147b03c16B18FC4F686f610f189f91Ddf4347b4) | 18 |
| wAVGOx | [`0xE89572bfe500ac7E8Ecd8dc8119d274214e06F14`](https://xlayerscan.com/address/0xE89572bfe500ac7E8Ecd8dc8119d274214e06F14) | 18 |
| wBMNRx | [`0xdaD5623B32C81AeAa75478fcfe934e9e97018c58`](https://xlayerscan.com/address/0xdaD5623B32C81AeAa75478fcfe934e9e97018c58) | 18 |
| wBRK.Bx | [`0xC3A8D2e18D33e0800F84cb4ca6529D18fAd225df`](https://xlayerscan.com/address/0xC3A8D2e18D33e0800F84cb4ca6529D18fAd225df) | 18 |
| wCOINx | [`0x44C7eD7fFDF8465c9d27F60AEC845EEd3d49d56e`](https://xlayerscan.com/address/0x44C7eD7fFDF8465c9d27F60AEC845EEd3d49d56e) | 18 |
| wCRCLx | [`0xb11134F14d5B94DB60d4599DfdC3bF1bbA2150e8`](https://xlayerscan.com/address/0xb11134F14d5B94DB60d4599DfdC3bF1bbA2150e8) | 18 |
| wCRWVx | [`0xADf63a79C9813a8E0C4D1d334eBdFaEef04BDF98`](https://xlayerscan.com/address/0xADf63a79C9813a8E0C4D1d334eBdFaEef04BDF98) | 18 |
| wDELLx | [`0x04DB4384013664BAa627c1a3fa4Ff0c50F37Cfd3`](https://xlayerscan.com/address/0x04DB4384013664BAa627c1a3fa4Ff0c50F37Cfd3) | 18 |
| wEWYx | [`0x021b40617982074748C81a19d22046CC2548C3bE`](https://xlayerscan.com/address/0x021b40617982074748C81a19d22046CC2548C3bE) | 18 |
| wGMEx | [`0x459D3ae62B86cC6125e06260DddFd3AFED24A877`](https://xlayerscan.com/address/0x459D3ae62B86cC6125e06260DddFd3AFED24A877) | 18 |
| wGOOGLx | [`0xf8c5308F80E459bb53d9EbE689854d9cBb2Caa6f`](https://xlayerscan.com/address/0xf8c5308F80E459bb53d9EbE689854d9cBb2Caa6f) | 18 |
| wHOODx | [`0x59801175a9b2248F9bf4Ba7f82E17045C4672ec8`](https://xlayerscan.com/address/0x59801175a9b2248F9bf4Ba7f82E17045C4672ec8) | 18 |
| wIBMx | [`0xbF69D85055642A9C6450BdFDe3C49Baac50F8286`](https://xlayerscan.com/address/0xbF69D85055642A9C6450BdFDe3C49Baac50F8286) | 18 |
| wICEx | [`0xbDff6dD4CEc5eEaFf1E21D65863431E79755eA13`](https://xlayerscan.com/address/0xbDff6dD4CEc5eEaFf1E21D65863431E79755eA13) | 18 |
| wINTCx | [`0x33AA35B0271FFfE2048Cc093aB7fE60931786719`](https://xlayerscan.com/address/0x33AA35B0271FFfE2048Cc093aB7fE60931786719) | 18 |
| wIRENx | [`0xb3a16DB475A9cb321fc8956aA2cB01385a022E75`](https://xlayerscan.com/address/0xb3a16DB475A9cb321fc8956aA2cB01385a022E75) | 18 |
| wKOx | [`0xE4784B45415AAc58b289f9373314261c788C91e8`](https://xlayerscan.com/address/0xE4784B45415AAc58b289f9373314261c788C91e8) | 18 |
| wMCDx | [`0xc6639026a3a862cd4fcbae3f67cB2D25A2959d37`](https://xlayerscan.com/address/0xc6639026a3a862cd4fcbae3f67cB2D25A2959d37) | 18 |
| wMETAx | [`0xe840946FfEBCd66B7C4E95095effaFaDfa0D0e56`](https://xlayerscan.com/address/0xe840946FfEBCd66B7C4E95095effaFaDfa0D0e56) | 18 |
| wMRKx | [`0x7d218D8a2ab4c1f03fdd7B655b4E724d48200050`](https://xlayerscan.com/address/0x7d218D8a2ab4c1f03fdd7B655b4E724d48200050) | 18 |
| wMRNAx | [`0xCe0FBc16E820AB7fd6d2936F1533c2654AD49aE9`](https://xlayerscan.com/address/0xCe0FBc16E820AB7fd6d2936F1533c2654AD49aE9) | 18 |
| wMRVLx | [`0xB4eE60B6B817ca7386422Ef1A0F45EaddEa13275`](https://xlayerscan.com/address/0xB4eE60B6B817ca7386422Ef1A0F45EaddEa13275) | 18 |
| wMSFTx | [`0x166Fbe68274b6a47e025F4ba17388c539f1fa1d0`](https://xlayerscan.com/address/0x166Fbe68274b6a47e025F4ba17388c539f1fa1d0) | 18 |
| wMSTRx | [`0x30987adF0B11dc698438a99BA04ec3a1AB2c7EaB`](https://xlayerscan.com/address/0x30987adF0B11dc698438a99BA04ec3a1AB2c7EaB) | 18 |
| wMUx | [`0xe2047ee3bdDb5C99ae428AB83df63f8730698e30`](https://xlayerscan.com/address/0xe2047ee3bdDb5C99ae428AB83df63f8730698e30) | 18 |
| wNBISx | [`0x43A7B7acfaE969b0682E56142B52E63E07D59b7d`](https://xlayerscan.com/address/0x43A7B7acfaE969b0682E56142B52E63E07D59b7d) | 18 |
| wNKEx | [`0x8Cdd7983f4b0A0e8694f22479fec092D9244F4bb`](https://xlayerscan.com/address/0x8Cdd7983f4b0A0e8694f22479fec092D9244F4bb) | 18 |
| wNVDAx | [`0xa8ddb5Cd96b5222AFe198316E9A57CAA642850D5`](https://xlayerscan.com/address/0xa8ddb5Cd96b5222AFe198316E9A57CAA642850D5) | 18 |
| wORCLx | [`0x1349456830Ddc3D8599E4d6A63698883Eca67ADa`](https://xlayerscan.com/address/0x1349456830Ddc3D8599E4d6A63698883Eca67ADa) | 18 |
| wPLTRx | [`0x4A2df09536F62341C9f946427D16414C04e21342`](https://xlayerscan.com/address/0x4A2df09536F62341C9f946427D16414C04e21342) | 18 |
| wQQQx | [`0x4C1AE29c159838fC1b224636E28E086EB69101f7`](https://xlayerscan.com/address/0x4C1AE29c159838fC1b224636E28E086EB69101f7) | 18 |
| wRDDTx | [`0x9ED51B856159c7CF26c1ecE673aBD248F21Bcc9E`](https://xlayerscan.com/address/0x9ED51B856159c7CF26c1ecE673aBD248F21Bcc9E) | 18 |
| wRKLBx | [`0x5AA45CF9d8c8555c9a76cf0207519501C227a235`](https://xlayerscan.com/address/0x5AA45CF9d8c8555c9a76cf0207519501C227a235) | 18 |
| wSKHYx | [`0x6215a58ed045d71F2561AaAbe54f4C885C522998`](https://xlayerscan.com/address/0x6215a58ed045d71F2561AaAbe54f4C885C522998) | 18 |
| wSLVx | [`0xB842EacB35Fd9c1bEDA53749072Ef22823f2cA8c`](https://xlayerscan.com/address/0xB842EacB35Fd9c1bEDA53749072Ef22823f2cA8c) | 18 |
| wSMCIx | [`0xd89556E08FDC04E5A2d9344Eb06568a043001166`](https://xlayerscan.com/address/0xd89556E08FDC04E5A2d9344Eb06568a043001166) | 18 |
| wSNDKx | [`0x75e82E2884Ea10f72FCA777449B73377f4646219`](https://xlayerscan.com/address/0x75e82E2884Ea10f72FCA777449B73377f4646219) | 18 |
| wSPCXx | [`0x8e2eeD8b8B5E13Ea7BF38e50d7821d2C57309072`](https://xlayerscan.com/address/0x8e2eeD8b8B5E13Ea7BF38e50d7821d2C57309072) | 18 |
| wSPYx | [`0xE7E553Cd128F0011777323A0b44a7b96EA1CB540`](https://xlayerscan.com/address/0xE7E553Cd128F0011777323A0b44a7b96EA1CB540) | 18 |
| wTSLAx | [`0xc3FdBe3A68EE5dE461D30415a8165cf9Aefe1171`](https://xlayerscan.com/address/0xc3FdBe3A68EE5dE461D30415a8165cf9Aefe1171) | 18 |
| wTSMx | [`0x27D62249488fc66ECBb92C8da3F56f700B8e8501`](https://xlayerscan.com/address/0x27D62249488fc66ECBb92C8da3F56f700B8e8501) | 18 |
| wWMTx | [`0x3b4336e3958913984C2E36b8Ed0E7C87a5bDee33`](https://xlayerscan.com/address/0x3b4336e3958913984C2E36b8Ed0E7C87a5bDee33) | 18 |

## Monad Stock Token catalog

The **10 wrapped xStocks** below are supported for Standard and Tax launches on Monad and use 18 decimals. Each is an ERC-4626 Wrapped xStock that holds the matching xStocks token issued by Backed. xStocks are not available to US persons. Stock reference prices must apply the onchain wrapper conversion once to obtain the price of one quote token: the USD price is the underlying US ticker's reference price multiplied by the wrapper's `convertToAssets` rate for one share. Amounts for approvals, swaps and claims remain raw quote-token units.

Monad's creation fee is 100 MON for crypto or stock pairs. Opening prices target an FDV close to USD 4,000, and the managed updater refreshes the stock starting ticks on US weekdays at 10:00 New York time. Buys can be funded with MON or USDC: the route goes from MON to USDC through Uniswap v3 or PancakeSwap v3, then from USDC to the wrapped xStock through hook-free Uniswap v4 USDC/wrapper pools (0.01% fee, tick spacing 1), and then into the launch pool. Sells reverse the route. Dev Buy can be funded with MON. See [Monad configuration](https://docs.o1.exchange/launchpad/reference/live-configuration.md#monad-snapshot).

The [Standard stock snapshot](https://docs.o1.exchange/launchpad/reference/monad-stock-quotes.json) and [Tax snapshot](https://docs.o1.exchange/launchpad/reference/monad-tax-suite.json) contain each factory's catalog and starting ticks. Check current availability before preparing a launch.

| Symbol | Paired asset | Monad quote token | Underlying xStock | ISIN |
| - | - | - | - | - |
| wEWYx | iShares MSCI South Korea | [`0x021b40617982074748C81a19d22046CC2548C3bE`](https://monadscan.com/address/0x021b40617982074748C81a19d22046CC2548C3bE) | [EWYx](https://monadscan.com/address/0x299c95Eb52BFd5Bc98d924bCE17197b64864589B) | CH1564487333 |
| wMUx | Micron Technology | [`0xe2047ee3bdDb5C99ae428AB83df63f8730698e30`](https://monadscan.com/address/0xe2047ee3bdDb5C99ae428AB83df63f8730698e30) | [MUx](https://monadscan.com/address/0xf6a873BAe4Ba1B304e45dF52A4b7D176E1C6a8c4) | CH1473121320 |
| wNVDAx | NVIDIA | [`0xa8ddb5Cd96b5222AFe198316E9A57CAA642850D5`](https://monadscan.com/address/0xa8ddb5Cd96b5222AFe198316E9A57CAA642850D5) | [NVDAx](https://monadscan.com/address/0xc845b2894dBddd03858fd2D643B4eF725fE0849d) | CH1436219195 |
| wQQQx | Nasdaq 100 ETF | [`0x4C1AE29c159838fC1b224636E28E086EB69101f7`](https://monadscan.com/address/0x4C1AE29c159838fC1b224636E28E086EB69101f7) | [QQQx](https://monadscan.com/address/0xa753A7395cAe905Cd615Da0B82A53E0560f250af) | CH1436219724 |
| wSGOVx | iShares 0-3 Month Treasury Bond ETF | [`0x4Ac39e0881e5967822cCE9d166D1b7Ac12402ba1`](https://monadscan.com/address/0x4Ac39e0881e5967822cCE9d166D1b7Ac12402ba1) | [SGOVx](https://monadscan.com/address/0x2daFA4732c8c1b25701a33B05F10f437F9599326) | CH1500008805 |
| wSKHYx | SK hynix | [`0x6215a58ed045d71F2561AaAbe54f4C885C522998`](https://monadscan.com/address/0x6215a58ed045d71F2561AaAbe54f4C885C522998) | [SKHYx](https://monadscan.com/address/0x58100046a4Afcd4eE4faDbD4244f3f895a341c56) | CH1580497340 |
| wSMHx | VanEck Semiconductor ETF | [`0x23c4BDDea5e7E284fB4027c6050bC5E6f7FaE23f`](https://monadscan.com/address/0x23c4BDDea5e7E284fB4027c6050bC5E6f7FaE23f) | [SMHx](https://monadscan.com/address/0x8D512a03600981B8e86556fd5C0FbDd726Fe1821) | CH1500008789 |
| wSPCXx | SpaceX | [`0x8e2eeD8b8B5E13Ea7BF38e50d7821d2C57309072`](https://monadscan.com/address/0x8e2eeD8b8B5E13Ea7BF38e50d7821d2C57309072) | [SPCXx](https://monadscan.com/address/0x68fa48B1C2FE52b3D776E1953e0E782b5044Ce28) | CH1564487366 |
| wSPYx | S\&P 500 ETF | [`0xE7E553Cd128F0011777323A0b44a7b96EA1CB540`](https://monadscan.com/address/0xE7E553Cd128F0011777323A0b44a7b96EA1CB540) | [SPYx](https://monadscan.com/address/0x90A2a4c76b5D8c0bc892A69EA28Aa775a8f2dD48) | CH1436219716 |
| wTSLAx | Tesla | [`0xc3FdBe3A68EE5dE461D30415a8165cf9Aefe1171`](https://monadscan.com/address/0xc3FdBe3A68EE5dE461D30415a8165cf9Aefe1171) | [TSLAx](https://monadscan.com/address/0x8aD3c73F833d3F9A523aB01476625F269aEB7Cf0) | CH1436219252 |


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.