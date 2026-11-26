# blog/scaling-with-base-appchains

Source: https://www.base.org/blog/scaling-with-base-appchains.md

# Scaling with Base Appchains

> Base is launching Appchains - dedicated rollups for applications

- Date: 2025-02-27
- Author: Chris Hunter
- URL: https://www.base.org/blog/scaling-with-base-appchains

**TL;DR:** Base Appchains are app-specific rollups designed for independent scaling, customization, and seamless integration with Base via near-instant bridging. They deliver dedicated blockspace, predictable performance, and access to Base’s users and liquidity. Perfect for high-throughput apps like gaming platforms, social networks, or systems publishing provable, auditable, and composable data.\
\
By rolling up to Base via an Appchain, apps can build solutions to their specific needs. Whether it’s a game needing to scale into its own fee market or an app that needs to publish auditable, composable data onchain at low cost, Appchains enable builders to build what they need within the Base ecosystem.

## **The Power of Dedicated Blockspace**

One of the core value propositions of Base Appchains is the provision of _dedicated blockspace_. Instead of competing for resources on a shared chain (like Base itself, or Ethereum mainnet), each Appchain gets its own, independent execution environment. This offers several key advantages:

- Performance and Predictability: Your application's performance is no longer affected by the activity of other applications. You get consistent, predictable transaction speeds and gas costs, regardless of overall network congestion. This is crucial for applications that require high throughput and low latency, such as games, high-frequency trading platforms, or social media applications.
- Scalability on Demand: Your Appchain can scale its resources independently to meet the specific demands of your application. As your user base grows, you can increase your chain's capacity without impacting the performance of Base or other Appchains.
- Customization: You have greater control over the configuration of your Appchain, including custom gas tokens and permissions. Though current customization is limited, there are many different customizations we plan to explore.

## **Composability and the Base Ecosystem**

Base Appchains balance dedicated resources with tight integration into the Base ecosystem, delivering key benefits:

- Seamless Integration: Designed as natural extensions of Base, Appchains enable fast, frictionless asset movement between Base and your chain, ensuring a cohesive user experience.
- Access to Base Liquidity: Your Appchain can tap into Base’s existing liquidity and user base.
- Coinbase Onboarding: Leveraging Coinbase’s infrastructure, Appchains simplify user onboarding. Tools like Coinbase Smart Wallet and Onchain Kit—complete with pre-built components like bridging—work across any Appchain.

## **The Critical Need for Fast Withdrawals**

The ability to move assets quickly and seamlessly between Base gives a unified experience. Existing rollup solutions do not yet enable the instantaneous withdrawals required for this experience.

- Optimistic Rollups: These rely on a challenge period (often 7 days) to validate state transitions, delaying withdrawals.
- ZK Rollups: ZK rollups offer the promise of fast finality and withdrawals without a challenge period. However, generating ZK proofs for the EVM is computationally intensive and expensive. While ZK rollups represent a promising long-term solution, current implementations are not yet performant enough to meet the needs of high-throughput, low-latency applications that require instant withdrawals _today_.

Base Appchains, with their TEE-powered proving system, offer a solution that bridges this gap, providing near-instant withdrawals while maintaining a high level of security and performance. The next section dives deep into the technical details of how this is achieved.

---

## **OP Stack and TEE Proving**

Base Appchains empower developers with dedicated blockspace while maintaining a seamless user experience. Central to this is the ability to move assets between an Appchain and Base swiftly and efficiently—a feat traditional bridging solutions struggle to achieve due to inherent delays. Base Appchains overcome this by building on the same technology as Base, enhanced with Trusted Execution Environments (TEEs) to enable rapid withdrawal proofs.

## **A TEE-Powered OP Stack Fork**

The core innovation of Base Appchains lies in op-enclave, a modified version of the **OP Stack** that leverages Trusted Execution Environments (TEEs) for state transition proofs. This replaces the traditional optimistic rollup challenge period with a TEE-based trusted proof security model, enabling near-instant withdrawals. You can check it out at [https://github.com/base/op-enclave](https://github.com/base/op-enclave)

## **Trusted Execution Environments (TEEs)**

Base Appchains harness Trusted Execution Environments (TEEs) for security and performance. Our initial choice, AWS Nitro Enclaves, offers robust security and standard AWS integrations, though the modular design supports future adoption of alternatives like Intel SGX.

**What are TEEs?**

A TEE can be visualized as a secure, isolated "vault" within a processor. It's a protected region within the CPU and memory that provides hardware-enforced confidentiality and integrity for the code and data it processes. Key characteristics of a TEE include:

- **Isolation:** The enclave is isolated from the rest of the system, including the operating system, hypervisor, and other applications. This isolation is enforced by the CPU itself.
- **Confidentiality:** Data and code within the enclave are encrypted and protected from unauthorized access, even by privileged software like the OS.
- **Integrity:** The enclave's code and data cannot be tampered with. Hardware mechanisms detect and prevent any unauthorized modification attempts.
- **Attestation:** Enclaves can generate cryptographically signed attestations, proving:

 - The code running inside the enclave (represented by a cryptographic hash, such as the PCR0 in Nitro Enclaves).
 - That the code is running within a genuine TEE (verified by the TEE provider's signing key).

In AWS Nitro Enclaves, code is bundled into an Enclave Image File (EIF). During boot, the Nitro hypervisor measures the EIF, producing a cryptographic hash—PCR0 (Platform Configuration Register 0)—that uniquely identifies the enclave’s code and configuration. Any alteration yields a new PCR0. Base Appchains also leverage the Nitro Secure Module (NSM), a hardware component providing cryptographic services like secure random number generation for enclave key pairs.

**Trust Assumptions**

While TEEs offer significant security advantages, it's important to understand the underlying trust assumptions:

- **Hardware Integrity:** We rely on the hardware integrity of the AWS Nitro System. This includes trusting AWS's design and manufacturing processes and the absence of undiscovered vulnerabilities. Physical security of the hardware is also crucial.
- **Attestation Process:** We trust the integrity of the Nitro attestation certificate keys.
- **AWS as a Trusted Party:** We rely on AWS to maintain the security and integrity of their Nitro Enclave infrastructure.
- **PCR0 Integrity:** We assume the PCR0 measurement is accurate and tamper-proof.

## How op-enclave works

**Stateless**

Base Appchains are powered by op-enclave, which leverages all the properties we just outlined above to build a secure and efficient proving system for withdrawals from the Appchain to Base.

For a withdrawal to work, we need to prove the state of the rollup. In the OP Stack, this is done through an output root, which encapsulates key information about the rollup's state. This includes the state root of the Merkle-Patricia-Trie ([MPT](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/)) for all execution-layer accounts, the state root of storage for the Message Passer contract and the latest block hash. With posted and proven output root, a wallet with a withdrawal in that output will be able to submit a proof of the withdrawal and withdraw the funds onto Base. \
\
We can use the enclave to execute the same OP Stack code as it would normally, and therefore it would have the output root ready to be attested to. The issue is that this would mean running a full node within the enclave. Our goal is to provide proving to hundreds to thousands of Appchains, so this is not scalable.

Instead we run the enclave in a stateless manner, so we pass all the information required for the OP Stack to execute a given block. This includes per chain configurations, all state read during execution, previous output roots, sequenced transactions, Base transactions, code that will be executed, Merkle proofs, and the message contract states. Since this is stateless and simply re-executes the transactions on the given data, it works for any number of chains with a single enclave. This information is fetched from a running sequencer using the debug_executionWitness rpc method.

![](https://www.base.org/images/blog/scaling-with-base-appchains/01.webp)

After executing the Appchain block, the enclave will create a proposal object that contains a signature over the chain specific configuration, the Base block, the Appchain block number, the previous output root, and the current final output root computed. This signature proves the block was properly executed within the secure enclave and is what is used onchain as proof for the output root. \
\
Proofs do not need to be submitted each block and can be aggregated until an onchain submission is required by the protocol. This can be done by passing along a previously proven but not submitted output root to the enclave then holding on to the returned proven output for either further aggregation or submission by the proposer.

**Enclave keys**\
\
As we have mentioned above, an enclave has a signing key which is used for onchain verification of submitted proofs. But how does a signature prove it's from the enclave and where does it come from?

The Nitro Secure Module (NSM), a hardware component in AWS Nitro Enclaves, provides cryptographically secure entropy. On startup, an enclave generates a new signing key using this randomness. An attestation will prove that this key came from within the enclave.\
\
**Scaling up - key sync**\
\
How do we scale up the number of enclaves? If all enclaves share the same key then they can communicate with each other securely and any enclave can be trusted onchain with a single address check. Therefore we need to share the key from one enclave to another without ever exposing that key outside of an enclave. We are able to achieve this using a combination of asymmetric encryption and attestations.\
\
The process starts when one enclave (the requester) asks another (the holder) to share its signing key. The holder verifies the requester’s attestation, checking its PCR0 to confirm it’s a trusted, isolated enclave running the expected code. Included in the attestation is the requester’s public RSA key, which the holder uses to encrypt its signing key before sending it back. Only the requester, with its private RSA key, can decrypt it. Our enclaves have a RSA decryption key, used for decrypting key sharing messages and a ECDSA signer key used for signing output roots which is shared across all enclaves with the same PCR0.

**Why This Works:**

- **Confidentiality:** Only the requesting enclave, with its private RSA key, can decrypt the signer key. An eavesdropper or even a compromised operating system on either machine cannot access the key.
- **Integrity:** The attestation process ensures that the remote enclave is communicating with a genuine enclave running the correct code (verified by PCR0). This prevents a malicious enclave from impersonating the local enclave.
- **Authentication:** The remote enclave knows it's sending the key to the correct enclave because it's using the public key from a verified attestation.

**Onchain**

To use a signing key for proving output roots we need to take an attestation document from our enclave, verify it, and register the enclave's public key as a valid signer with the **SystemConfigGlobal** smart contract on Base. This contract is used for all Appchains for proof verification.\
\
To trust an attestation document we must trust the certificates used in the attestation. The **CertificateManager** contract onchain keeps a mapping of verified X.509 certificates specifically for AWS Nitro enclaves, with the AWS Nitro root certificate serving as the root of trust. It implements certificate chain validation by verifying signatures, checking validity periods, and enforcing basic constraints.\
\
Once we can trust certificates we can move forward to the next issue, trusting attestations themselves. The **NitroValidator** contract validates attestations from AWS Nitro Enclaves by verifying their encoded structure, checking signatures, and validating the certificate chain that proves the attestation came from a genuine AWS Nitro Enclave.

To add a signer to be used for output roots, we now just need to:

- Get an attestation for the enclave (which includes its pubkey)
- Ensure all the certificates used in the attestation are already validated in **CertificateManager**
- Register the PCR0 on the **SystemConfigGlobal**
- Call **registerSigner** which will:

 - Validate the attestation
 - Validate that the PCR0 from the attestation is registered
 - Validate timestamps
 - Get the public key and calculate the address of the enclave, which is registered as accepted.

![](https://www.base.org/images/blog/scaling-with-base-appchains/02.webp)

We can use signatures from these registered addresses as proof that the computation came from _within the enclave_. All Appchain OutputOracle contracts then call the GlobalSystemConfig to check if the output proposal contains a valid signer, giving fast withdrawals for any number of chains. Keeping this as a simple signature check also keeps gas costs low for the proposer!

## **OP Stack Modifications**

The OP Stack’s modular design makes building rollups easy, and op-enclave uses its modularity to swap in some new components while keeping the existing battle tested code in place. \
\
Since our main goal with op-enclave is to have lightning fast withdrawals, we will need to modify several of the typical OP Stack entities you’re familiar with. In order to enable a withdrawal, an output root must be posted by the proposer. Lets explore those changes first \
\
**The Proposer**\
\
The proposer now interfaces with an AWS Nitro TEE running op-enclave. It maintains an up-to-date proven state and, upon detecting a withdrawal, ensures the proof includes that block before submitting the proposal to Base. The proposer only proposes safe blocks (post-batch submission), and if no withdrawals occur, it submits a proof every 15 minutes to keep the state current.

**The Batcher**

The batcher posts transaction batches for deriving Appchain state, and is required for submitting output proposals at the same height. The batcher is modified such that if a block contains a withdrawal event, the batcher immediately treats the current channel as full and submits the batch to L2. This prioritizes withdrawal transactions for rapid processing. The batcher will also submit a batch every 15 minutes if no withdrawals are seen.\
\
**Data Availability**\
\
OP Stack also enables alternative data availability (“altDA”) solutions. Base Appchains leverage Amazon S3 to store batch data, with only an identifier to that data recorded onchain.  By reducing the amount of data stored on the blockchain we can deliver significant gas savings to Appchain users. Since the chain state is verified independently through the enclave, there’s less reliance on highly decentralized data availability, which is typically needed to support the construction of fault proof challenges. External parties can still verify chain state, though not through a fully decentralized manner.

Looking ahead, we will explore providing support for additional altDA solutions, such as EigenDA and Celestia, after launch.

**Permissions**

Though not an op-enclave feature, Appchains allow chain owners to set permissions on what contracts can be called via the standard RPC. This feature allows chain owners to effectively manage their blockspace and ensure chain resources are used as intended. Chain users are always protected from censorship by being able to force include transactions via deposit calls through the bridge. This effectively works as two lanes - an owner controlled high throughput lane and an all traffic lane that doesn’t get the high speed pass.

## **All together now**

Putting this all together, we can do a quick recap of the proving flow.

**Transactions and Batching:** Users submit transactions to the L3 Appchain. The batcher collects these transactions and commits the identifier of it to L2 (Base) and the compressed transaction data to S3.

**Enclave Execution:** The proposer submits the required information to the enclave to allow it to execute the transactions _statelessly_, recomputing the Appchain state.

**Attestation Generation:** After execution, the enclave generates an attestation, including the new Appchain output root and a signature from the enclave's private key.

**Proposer Submission:** The proposer receives the output root and attestation from the enclave(s) and submits it to the OutputOracle contract on Base when a withdrawal occurs or a specified timeframe passes.

**Signature Check:** The OutputOracle contract checks if the signer is registered on the SystemConfigGlobal contract. If it is, the output root is accepted as this means it came from an attested AWS Nitro enclave running the correct code.

**Fast Withdrawals:** Because the output root is accepted based on the TEE attestation (and the trusted signer check), withdrawals can be processed almost instantly.

![](https://www.base.org/images/blog/scaling-with-base-appchains/03.webp)

## **Verification**

You are able to verify the PCR0 yourself onchain to ensure that the Appchain system is only using what you expect. The GlobalSystemConfig contract can be monitored for any changes to ensure only trusted images are ever run. \
\
To generate the PCR0 that we use and check onchain value you can see an example here [https://github.com/base/op-enclave/tree/main/tools/pcr0-verifier](https://github.com/base/op-enclave/tree/main/tools/pcr0-verifier)

**Security**

Building the TEE proving system means we do have some trusted parties, but as we wait for ZK technology to mature it offers a performant and pragmatic solution.

| | **Enclave** | **Optimistic** | **Zero Knowledge** |
| ------------------- | ----------------------------------- | ----------------------------------------------- | -------------------------------------------- |
| **Trust** | Trust TEE provider and Proposer Key | Cryptographic games (challenge / fraud proving) | Cryptographic proofs, minimal trust |
| **Withdrawal Time** | 10 seconds | Typically 7 days | ~1 hr withdrawal time |
| **Cost** | Medium proving cost (enclave) | No proving cost | High proving costs (ZK is compute intensive) |

\
The op-enclave system currently relies on Amazon AWS’s Public Key Infrastructure (PKI) for certificates and the integrity of its enclave hardware. A compromise in either could allow invalid output roots to be passed to the rollup. However, an additional safeguard mitigates this risk: the proposer, controlled by us, only submits output roots it locally verifies. For an attack to succeed, both AWS PKI and our services would need to be compromised simultaneously—neither can undermine the system alone. AWS cannot bypass the proposer’s validation, and Coinbase cannot forge the AWS Nitro signature required for attestation.

Presently, Coinbase holds the upgrade keys for the SystemConfigGlobal contract, and while this is the case then Coinbase can still act unilaterally. We plan to progressively decentralize this by transferring control to a security council long-term or allowing chain owners to decide when—or if—they upgrade.\
\
All contracts and systems have undergone audits, with details available in their respective repositories.

## **Building in the open**

Base's approach to building in the open creates accountability and enables meaningful collaboration across the ecosystem. By making Op-enclave open source from its inception, Base has established a transparent development environment that accelerates technological advancement while ensuring greater security through community review and contribution. This transparency serves as a catalyst for collaboration, allowing developers to tap into and build upon existing knowledge while providing channels for valuable community feedback.\
\
We’ve supplied rollup-as-a-service providers, such as Conduit and Caldera, with all the details for running op-enclave for their customers and will collaborate with them and roll-up research teams like those at Spire.\
\
In addition to the [op-enclave](https://github.com/base/op-enclave) repo, [Nitro-Validator](https://github.com/base/nitro-validator) can be used as a general onchain validator for anyone that wants to use AWS Nitro!  Shout outs to the team at Marlin Protocol for inspiration and their work on [Nitro Prover](https://github.com/marlinprotocol/NitroProver).

---

## **Coinbase Supported**

Base Appchains are designed for seamless interoperability with Base. For now, a key component of this is the bridging mechanism, which allows users to move assets between Base and their chosen Appchain.

### **OnchainKit**

Using OnchainKit, bridging in and out of your Appchain just works. OnchainKit provides pre-built React components that handle the complexities of interacting with the bridge contracts. Among many other components OnchainKit now offers a drop-in bridge UI which gives you a fully functional styled bridge you can put anywhere. \
\
Check it out here [https://www.base.org/builders/onchainkit](https://www.base.org/builders/onchainkit)

### **Expanding Coinbase Product Integration**

The integration with OnchainKit and Smart Wallet is just the beginning. Base is actively working to enable seamless integration with a broader range of Coinbase products and services, making it easier for users to discover and interact with your Appchain.

---

## **Future**

Base Appchains is just starting, with an amazing future to build together! We envision a world of highly customizable Appchains where developers have the freedom to create exactly the blockchain environment they need—leveraging our TEE-based proving system for fast finality today, while maintaining compatibility for integration with ZK proofs as that technology matures. We're excited to see what innovative applications and protocols the community will build, and we're committed to evolving this technology based on real-world feedback and needs. Whether you're reimagining gaming, DePIN, DeFi, social platforms, or exploring entirely new use cases, we invite you to join us in shaping the future of Base Appchains through open collaboration.

---

## **Get Started**

To start building on your Base Appchain today, check out: \
[https://docs.cdp.coinbase.com/appchains/docs/welcome](https://docs.cdp.coinbase.com/appchains/docs/welcome)
