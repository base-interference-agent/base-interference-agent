# blog/securing-eip-7702-upgrades

Source: https://www.base.org/blog/securing-eip-7702-upgrades.md

# Securing EIP-7702 Upgrades: A Proxy Pattern for Safe EOA-to-Smart Wallet Transitions

> A secure architecture for upgrading EOAs to smart contract wallets via EIP-7702.

- Date: 2025-06-10
- Author: Amie Corso
- URL: https://www.base.org/blog/securing-eip-7702-upgrades

## Resources

[EIP-7702](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-7702.md)

[EIP7702Proxy Github Repository](https://github.com/base/eip-7702-proxy)

[EIP7702Proxy deployment addresses](https://github.com/base/eip-7702-proxy/releases/tag/v1.0.0)

## Introduction

EIP-7702 enables simple Ethereum wallets (EOAs) to upgrade into smart contract wallets, which offer improved security, advanced functionality, the opportunity for gas sponsorship and other benefits. Historically, smart wallets have had to be created from scratch, but with the introduction of EIP-7702, traditional wallets, with all of their assets and onchain history, can upgrade and keep the same wallet address. It’s like switching from a landline to a smart phone without having to get a new number.

EOAs upgrade by setting a “delegation designation”, a pointer to a delegate smart contract, whose logic then governs the EOA. Upgraded EOAs can therefore have functions, set storage, emit events, and do everything else a smart contract can do. EOAs can change or remove this delegation at any time with a new, signed EIP-7702 authorization. While this unlocks many new possibilities, this powerful feature also introduces novel security challenges that require careful consideration and innovative solutions.

To enable EOAs to act as smart contract wallets, we developed the `EIP7702Proxy`, a lightweight [ERC-1967 proxy](https://docs.openzeppelin.com/contracts/4.x/api/proxy#ERC1967Proxy) contract designed to serve as the EIP-7702 delegate for an EOA. In addition to the basic logical forwarding performed by a proxy, the `EIP7702Proxy` contains additional features and design choices that solve several challenges unique to EIP-7702-delegated accounts. A goal in designing the `EIP7702Proxy` was to enable the closest possible parity between “standard-deploy” Coinbase Smart Wallets and EIP-7702-delegated Coinbase Smart Wallets, which meant abstracting the additional complexity demanded by the mechanics of EIP-7702 into the dedicated proxy and continuing to rely on the original implementation of the `CoinbaseSmartWallet`. The solution to this challenge can be usefully applied to any implementation logic, not just the `CoinbaseSmartWallet` implementation, while helping EOAs stay safe in a 7702-enabled environment.

We describe below the specific challenges and corresponding design solutions that allow us to securely adapt any existing smart contract wallet implementation to be used for EIP-7702 upgrades.

---

## Challenge #1: Enforcing secure initialization

The first major hurdle in implementing EIP-7702 stems from its initialization constraints. Traditional smart contract wallets, including the `CoinbaseSmartWallet`, typically handle secure initialization (the establishment of account ownership) atomically during their deployment via a separate factory contract. This atomicity means many such implementations have unprotected initializer functions that can be called exactly once. EIP-7702's design, however, does not permit execution of initialization calldata during the code delegation process (the comparable step to “deployment”) and therefore this can’t be done atomically.\

This separation of steps creates a critical vulnerability window. When an implementation contract is "deployed" to an EOA via EIP-7702, there's no guarantee that this 7702 upgrade and the standard EVM transaction that initializes the wallet will be executed atomically. The code setting authorization could technically be applied independently of the initialization transaction, even if they are submitted simultaneously, and this could allow an attacker to front-run the initialization transaction with their own payload and claim ownership of the smart account.

### Solution: Require EOA signature to atomically set implementation and initialize

Note that existing Coinbase smart wallets are deployed behind an [ERC-1967 proxy](https://docs.openzeppelin.com/contracts/4.x/api/proxy#ERC1967Proxy) with a [UUPSUpgradeable](https://docs.openzeppelin.com/contracts/4.x/api/proxy#UUPSUpgradeable) implementation (the actual `CoinbaseSmartWallet` logic). The code at the actual account address is a proxy, and the proxy uses a conventional storage location defined by ERC-1967 to hold a pointer to its implementation logic.  Our solution to the initialization vulnerability in a 7702 context involves recognizing that any implementation logic only becomes active (and therefore dangerous) when the proxy actually establishes a connection to it. Therefore, if we can’t enforce atomic _deployment_ with initialization, we can instead enforce atomic _implementation setting_ with initialization.

![EIP-7702 CoinbaseSmartWallet contract architecture and logical delegation flow](https://www.base.org/images/blog/securing-eip-7702-upgrades/01.webp 'EIP-7702 CoinbaseSmartWallet contract architecture and logical delegation flow')

In the context of EIP-7702 the EOA itself is the initial authority over any changes to its account, and must provide a signature to authorize the initialization and establish any owners of the new smart account. Our `EIP7702Proxy` contract implements a setImplementation function that can atomically set the new logical implementation and initialize the account. The `setImplementation` function:

1. Validates a signature from the EOA across key data such as the address of the new implementation contract, initialization calldata, the address of a validator contract that will evaluate the safety of the resulting account state, and basic signature replayability protections such as a nonce and and expiry
2. Sets the value of the ERC-1967 pointer to the new implementation and executes the provided calldata against the new logical implementation
3. Makes a call to the `validateAccountState` function that must be implemented by the validator included in the signature. \

The validator is an implementation-specific contract that contains logic to evaluate whether it considers the resulting account state to be secure. For example, in the case of the `CoinbaseSmartWallet`, the `CoinbaseSmartWalletValidator` will check whether the ownership state of the account is non-empty, and therefore no longer susceptible to arbitrary initialization.

---

## Challenge #2: Shared storage across EIP-7702 delegates

Perhaps the most intricate challenge of EIP-7702 relates to storage management. The EOA can freely re-delegate its logic to different contracts, or completely remove delegation at any time. All delegates share the same storage space at the EOA address. Multiple contracts sharing access to the same storage over time can lead to a "storage collision" problem. Storage collisions happen when two contracts make different changes to or assumptions about the same storage location, potentially leading to unpredictable bugs.\

The management of storage collisions is already a familiar problem in the proxy design space, where mutable implementation logic is used to govern shared storage. Even though upgradeable proxies can change implementations, the proxy code itself (for non-7702 addresses) cannot change. This brings certainty and guarantees to the upgrade process. 7702 re-delegation introduces another layer of total mutability to the potential logic that can govern this shared storage. This essentially removes any guarantees around the effect an arbitrary delegate may have on storage. For example, if an EOA delegates from delegate A to B and back to A again the returning delegate cannot make assumptions about the state of its storage, which may have been erased or manipulated by delegate B into a state that would have been impossible to achieve via the logic of delegate A alone. This is true for any 7702 delegate, regardless of delegation pattern, as a prior delegate may have stored or removed anything in any storage location.

**Example of an invalid state for Delegate A induced by A → B → A delegation pattern**

![](https://www.base.org/images/blog/securing-eip-7702-upgrades/02.webp)

### Solution: Externalization of security-critical storage values

EOA delegation can arbitrarily affect account state. If an EOA delegates to a malicious or destructive contract, no incumbent delegate can protect against this. Like signing a drainer transaction, authorizing malicious 7702 delegates could be ruinous, and protecting against these outcomes is outside our design scope.

We designed the `EIP7702Proxy` to be self-defensive against foreseeable problems in a multi-wallet, 7702-enabled ecosystem of well-intentioned but potentially chaotic actors. It cannot protect EOAs that authorize truly malicious or buggy delegates.

One foreseeable problem involves signatures for `setImplementation` calls and the risks introduced by mutable account state. The `EIP7702Proxy` relies on EOA signatures to set implementation logic and initialize to a safe state. These signatures could become liabilities if they were ever replayable. For example, if a signature authorizes an initial owner who later gets compromised and removed, a replayable signature could re-establish the compromised owner or forcibly downgrade the implementation.

Common protection against signature replay uses nonces in signed messages, marked as consumed when verified. The risk for 7702 accounts: other delegates could compromise this nonce-tracking storage. If storage tracking nonce usage gets erased, the EOA's `setImplementation` signature (publicly available in the mempool) could be reapplied when delegating back to the EIP7702Proxy.

To guarantee signature non-replayability, we implemented a separate NonceTracker singleton that maintains nonce status in an immutable contract location outside the account's storage. Only the EOA can affect their nonces (incrementally only), preventing other delegates from manipulating these security-critical values. The `NonceTracker` ensures each `setImplementation` signature works only once, regardless of account storage changes.

---

## Challenge #3: Heightened risk of shared conventional storage locations

Standardized storage slots like those defined by [ERC-1967](https://eips.ethereum.org/EIPS/eip-1967) are particularly vulnerable to potential storage collisions by virtue of being conventional locations likely to be used by multiple delegate implementations. The ERC-1967 implementation slot is the only standard storage location used in the `EIP7702Proxy` and it holds the address of the logical implementation pointed to by the proxy. Our design guarantees that regardless of the value at this storage location (which determines much of the logic available at the account), the `EIP7702Proxy` will always be able to successfully set its implementation logic to a contract desired by the EOA.

To more clearly illustrate the problem being solved, note that when an account transitions between different delegates (A→B→A) _where both delegates implement ERC-1967 proxy patterns_, delegate B will naturally use the same storage slot that delegate A was using to store its implementation address. During its tenure, delegate B could modify or overwrite this slot, either intentionally or as a normal part of its own proxy operations. In a UUPSUpgradeable proxy pattern, the logic for upgrading an implementation is defined on the implementation contract itself. If the implementation put in place in this pointer location by delegate B does not contain the `upgradeToAndCall` interface expected on an implementation, then when returning to delegate A, the very mechanism for changing its implementation may not exist on the current available logic.\

**Example of overwriting shared conventional storage location by new delegate**

![](https://www.base.org/images/blog/securing-eip-7702-upgrades/03.webp)

### Solution: Upgrade mechanism available on the `EIP7702Proxy`

Our `EIP7702Proxy` addresses this through its `setImplementation` function, which provides an implementation-independent upgrade mechanism directly on the proxy itself. This ensures that even if an intervening delegate has pointed the ERC-1967 implementation at an invalid implementation (or removed it entirely), the original EOA, after delegating back to an `EIP7702Proxy`, maintains the ability to reconfigure the proxy’s ERC-1967 pointer to their chosen logical implementation.

---

## Challenge #4: Backward compatibility with standard EOA behavior

A design goal of the `EIP7702Proxy` was to maintain backward compatibility with the account’s EOA functionality in addition to the new smart contract functionality. The presence or absence of code at an address can affect the execution flow of protocols interacting with the address, as they predicate on this quality to differentiate between EOAs and smart contracts. This required considering two primary behaviors: signature verification and token receiving behavior.

### Signature verification

Smart contracts have a different standard for signature validation than standard EOAs. Smart contracts implement the `isValidSignature` interface defined by [ERC-1271](https://eips.ethereum.org/EIPS/eip-1271) and are free to define arbitrary logic that determines whether the contract considers a signature valid. For standard EOAs, a signature is validated with a standard `ecrecover` check that ensures the signer recovers to the expected EOA address.\

To ensure existing or future EOA signatures will continue to be honored at the EOA after a 7702 upgrade, the `EIP7702Proxy` implements a version of `isValidSignature` that first delegates signature validation to the `isValidSignature` function that should be defined on the logical implementation, but follows a failed validation with a final `ecrecover` check. If this passes, the signature is considered valid. In this way, EOAs using the `EIP7702Proxy` can guarantee that simple EOA signatures will always be honored at their address regardless of the isValidSignature implementation of their smart contract wallet.

### Token receipt

Some token standards (specifically [ERC-1155](https://ethereum.org/en/developers/docs/standards/tokens/erc-1155/) and [ERC-721](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/)) attempt to protect against tokens getting stuck in smart contracts that may have no ability to manage them. These tokens require any smart contract that would receive such tokens to declare this capability by implementing standard token receiver interfaces that are called by the token contract during a token send. It’s also essential that the logic at the upgraded EOA contains a standard `receive` function or payable fallback to be able to receive native tokens. An account should never be in a state that leaves it unable to receive ETH or other tokens, however briefly.

Since our proxy lacks an initial implementation, we include an immutable `DefaultReceiver` implementation as the default logic for the `EIP7702Proxy` in the absence of an ERC-1967 pointer. This receiver implements a receive function and the receiver hooks for these common token standards, ensuring the account can accept token transfers prior to explicitly setting a new implementation.

---

## Conclusion

The `EIP7702Proxy` design allows us to maintain close parity with standard-deploy CoinbaseSmartWallets and to continue using the existing `CoinbaseSmartWallet` implementation while solving the unique security challenges that arise in the context of EIP-7702. By carefully considering initialization security, the implications of storage impermanence and interference, the need for uninterrupted token handling and backward compatibility with standard EOA signature verification, we've created a proxy for securely delegating and managing EIP-7702 smart contract wallets. While the `EIP7702Proxy` was designed with the `CoinbaseSmartWallet` V1 implementation in mind, this proxy is ultimately implementation-agnostic. We encourage developers to evaluate this solution for 7702-proofing other smart contract wallet implementations.

## Try it out today

- The `EIP7702Proxy` delegate and its supporting contracts are deployed on all [networks](https://docs.base.org/identity/smart-wallet/concepts/features/built-in/networks?utm_source=base_dot_org) supported by Coinbase Smart Wallet.
- The contracts repository is open source at [https://github.com/base/eip-7702-proxy](https://github.com/base/eip-7702-proxy).
- Deployment addresses can be found [here](https://github.com/base/eip-7702-proxy/releases/tag/v1.0.0).
- An example app demonstrating the delegation of new EOAs to the `EIP7702Proxy` with a `CoinbaseSmartWallet` implementation via EIP-7702 is live against Base Sepolia [here](https://eip7702-viem-demo.vercel.app/) and the source code can be found [here](https://github.com/amiecorso/eip7702-viem-demo).
