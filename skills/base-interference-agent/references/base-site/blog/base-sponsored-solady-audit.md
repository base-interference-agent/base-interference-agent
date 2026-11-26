# blog/base-sponsored-solady-audit

Source: https://www.base.org/blog/base-sponsored-solady-audit.md

# Solady Audit to Enhance Onchain Security Across the Ecosystem

> TL;DR: ​​Base funded a comprehensive third-party security audit of the Solady library to proactively identify and resolve multiple security issues. As a result, Solady v0.1.1 has…

- Date: 2025-03-27
- Author: Darian Chan
- URL: https://www.base.org/blog/base-sponsored-solady-audit

**Security is fundamental to building onchain.** At Base, we’re committed to making the broader Ethereum ecosystem more secure for everyone. Strong security standards for our own smart contracts aren’t enough — the entire ecosystem needs to be secure. One of the most effective ways to improve the onchain security posture is to help ensure that widely used smart contract libraries are as robust as possible. These libraries serve as the foundation for thousands of projects (including some operated by Coinbase) and any vulnerabilities could have widespread implications.

That is why Base funded a comprehensive third-party security audit of [Solady](https://github.com/Vectorized/solady), a widely used Solidity smart contract library known for its gas-optimized utilities and broad adoption within the smart contract developer community.

Today, we are proud to share that the audit of Solady has been completed, multiple security issues have been proactively resolved, and a new, more secure release - **Solady v0.1.1** - is now live. Developers should upgrade to this version immediately to ensure they are using the safest, most **robust implementation of Solady’s utilities to date.**

## Why Solady?

Solady has quickly become one of the most popular Solidity libraries, offering optimized implementations of ERC20, ERC721, ERC1155 tokens, as well as utilities like efficient string manipulation, low-gas token transfers, and math functions. It is widely used across the DeFi ecosystem, NFT platforms, and other blockchain applications that prioritize both efficiency and security.

While Base itself only leverages a few select Solady contracts in production, we recognize that its security has far-reaching implications. Thousands of developers and projects - including those handling significant user funds - depend on Solady’s correctness and robustness. Given its rapid adoption and deep integration into various protocols, it became clear that a full-scale security audit would be a valuable public good for the entire ecosystem.

By proactively auditing Solady, Base aimed to achieve the following:

- Identify and fix vulnerabilities before they can be exploited.
- Increase trust in the security of Solady’s codebase.
- Establish best practices for safe and efficient Solidity libraries.

## The Audit

The Solady audit was conducted by [Spearbit](https://spearbit.com/), a well-reputed security firm specializing in smart contract auditing. The audit took place over a period of five weeks, during which 58 issues were identified and addressed. These issues ranged from minor gas optimizations to critical vulnerabilities that could have significant security implications if left unaddressed. Some of the key findings included:

- **Cancelling bytes32(0) allows Timelock takeover:** This issue could enable an attacker to take over the Timelock contract by exploiting the cancellation mechanism. This would allow reinitialization of the contract, leading to unauthorized control over time-locked functions.
- **Unsound assumption about structure of calldata arrays:** Incorrect assumptions about the structure of calldata arrays could lead to unexpected behavior and potential vulnerabilities. This is particularly problematic when accessing calldata arrays in inline assembly, as it could result in truncation or extension of the array with other bytes, causing downstream code to receive incorrect and potentially tampered data.
- **Changing _initializableSlot()_ can cause _disableInitializers()_ to actually enable initializers:** This issue could lead to unintended enabling of initializers, compromising the contract's initialization logic.

All in all, the audit found 2 critical, 3 high, 7 medium, and 8 low severity vulnerabilities, as well as 23 informational findings and 11 gas optimization recommendations. As a result of this work, we have successfully identified and taken steps to address all 58 vulnerabilities. The [full audit report](https://github.com/Vectorized/solady/blob/main/audits/cantina-spearbit-coinbase-solady-report.pdf) provides a detailed breakdown of each issue, the severity, and the steps taken to resolve them.

### Deep Dive on a Critical Vulnerability

In addition to the high-severity findings above, we’ll dive into a critical vulnerability involving the use of [Solady’s ERC-6492 implementation](https://github.com/Vectorized/solady/blob/4c895b961d45c53a49ed500cfc76868b7ee1328b/src/utils/SignatureCheckerLib.sol#L306) found by Spearbit’s audit. [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492) is intended to build on top of ERC-1271, which is a way for smart contracts to validate signatures. Unlike traditional EOAs with private keys, smart contracts can’t sign transactions. Instead, smart contract wallets expose an [isValidSignature](https://eips.ethereum.org/EIPS/eip-1271) function that does the signature verification, where a valid signer (i.e an EOA or passkey) that owns the smart contract wallet is able to sign the transaction.

ERC-6492 takes this functionality one step further and allows users to wrap a ERC-1271 signature with factory calldata, along with a factory address, that will be used to deploy a new smart contract (smart contract wallets are deployed via a [factory pattern](https://eips.ethereum.org/EIPS/eip-4337#:~:text=the%20excess%20afterwards.-,First%2Dtime%20account%20creation,-It%20is%20an) hence the need for a factory address). In doing so, the main benefit is that it allows any off-chain user to verify a signature on behalf of a contract that is not yet deployed (through simulations).

There are 3 scenarios that can happen with ERC-6492 signature validation:

1. If the contract is deployed, produce a normal ERC-1271 signature
2. If the contract is not deployed yet, wrap the signature as follows: `concat(abi.encode((create2Factory, factoryCalldata, originalERC1271Signature), (address, bytes, bytes)), magicBytes)`
3. If the contract is deployed but not ready to verify using ERC-1271, wrap the signature as follows: `concat(abi.encode((prepareTo, prepareData, originalERC1271Signature), (address, bytes, bytes)), magicBytes)`; prepareTo and prepareData must contain the necessary transaction that will make the contract ready to verify using ERC-1271 (e.g. a call to migrate or update)

The key here is that in Solady’s implementation, if we see that magic bytes (0x6492…) are appended to the signature, then step 1 will be skipped and execution will proceed with steps 2 and 3. The different execution scenarios can be seen in the following code:

![](https://www.base.org/images/blog/base-sponsored-solady-audit/01.webp)

Specifically, a vulnerability in this function’s implementation that can be exploited is where the signature initially fails, leading the contract to perform an arbitrary call to an arbitrary address in its second attempt to validate the signature (shown in the green box above). From Spearbit’s audit, we can show the following POC and vulnerable vault example that is using Solady’s SignatureChecker library:

![](https://www.base.org/images/blog/base-sponsored-solady-audit/02.webp)

Our exploit scenario is the following:

1. Encode a malicious signature payload:

 - prepareTo = the ERC20 token we want to steal
 - prepareData = abi.encode(“transfer(address,uint256)”)
 - Insert magic bytes

2. Call the vulnerable `transferWithSig` function on the vault contract, using our malicious DrainerHelper contract as the signer
3. Have the vault send all the ERC20 tokens to the DrainerHelper exploit contract and profit

In practice, this is what the exploit contract looks like with the malicious payload and function calls. The following POC shows a test case that calls the `transferWithSig` function on the vault contract, using our DrainerHelper contract as the signer:

![](https://www.base.org/images/blog/base-sponsored-solady-audit/03.webp)

_\*\* Credit to Spearbit researcher Philogy for this Proof of Concept_

Now lets walk through each execution step as to how Solady’s `isValidERC6492SingatureNowAllowSideEffects` function behaves when it is called inside the vault’s `transferWithSig` function:

![](https://www.base.org/images/blog/base-sponsored-solady-audit/04.webp)

At the end of the POC, we can see that the vault has been successfully drained and the attacker contract now holds all of the vault’s ERC20 tokens. The fix in this vulnerability lies in having the library function itself not make the direct arbitrary call, but rather have an [intermediary contract](https://gist.github.com/Vectorized/011d6becff6e0a73e42fe100f8d7ef04) that performs the direct calls. This separates the privileged caller (in this example it is our vault contract) and the verification call of the signature. Because the recommended call flow now has the vault contract call another intermediary contract that does not have any privileges, which then makes the arbitrary call to verify signatures, this takes away the ability to directly transfer funds out of the vault.

## The Result: Solady v0.1.1 Release

As a direct outcome of this audit, the maintainers of Solady released [**Solady v0.1.1**](https://github.com/Vectorized/solady/releases/tag/v0.1.1), which includes patches for all identified security vulnerabilities. This version represents the most secure release of Solady to date, and we **strongly encourage all developers to begin leveraging v0.1.1.**

For full transparency, the [complete audit report](https://github.com/Vectorized/solady/blob/main/audits/cantina-spearbit-coinbase-solady-report.pdf) is publicly available, so developers can review the findings, understand the improvements, and assess the security of their own implementations.

By funding this Solady audit, we hope to improve the security posture of Solidity smart contract development and encourage developers to prioritize security as a fundamental part of development.

## Looking Ahead: Base's Role in Onchain Security

At Base, security is our #1 priority, and we believe that security should be a shared responsibility. While we maintain strict security standards internally, we also recognize the importance of security to the broader ecosystem. That is why we invest in security research, fund audits of critical open-source infrastructure, and contribute to best practices that benefit the entire Base and onchain developer ecosystem.

The security of open-source smart contract libraries is critical for the health and sustainability of the onchain ecosystem. With thousands of projects relying on Solady, Base took the initiative to fund Spearbit’s audit as a public good, ensuring that developers and users alike can benefit from a more secure foundation.

If you’re interested in working on advanced onchain security challenges, explore our open roles [here](https://www.base.org/jobs). You can also follow us [X](https://x.com/base) ([Base team](https://x.com/i/lists/1876354838289932418) and [based community builders](https://x.com/i/lists/1869425408573075694)), [Farcaster](https://warpcast.com/base/), and [Discord](https://discord.com/invite/buildonbase?utm_source=dotorg&utm_medium=nav) to stay up-to-date with the latest on Base.
