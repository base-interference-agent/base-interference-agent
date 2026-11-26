# blog/benchmarking-zkp-systems

Source: https://www.base.org/blog/benchmarking-zkp-systems.md

# Benchmarking ZKP Systems for Passkey ECDSA Verification

> TL;DR: A deep-dive into benchmarking passkey-wallet signature verification within a zero-knowledge proof (ZKP) using popular ZKP systems: SnarkJS, Rapidsnark, Gnark and Noir.

- Date: 2025-09-02
- Author: Elena Nadolinski
- URL: https://www.base.org/blog/benchmarking-zkp-systems

The Base team is exploring various ways to enable onchain privacy for smart wallet passkey-based accounts, and in the spirit of building in the open, we're sharing our recent deep dive into four leading ZKP systems: SnarkJS, Rapidsnark, Gnark, and Noir. We benchmarked their performance on verifying a passkey signature and focused on two metrics:

- **Proof generation time**: Time it took to create the ZKP on various hardware configurations.
- **Gas cost**: The gas required on an EVM to verify the proof in a smart contract.

Full details on the benchmarking setup, including scripts and configurations, are available in our [GitHub repository](https://github.com/lukasrosario/zk-snark-ecdsa-benchmarks).

---

## **What Are Zero-Knowledge Proofs (ZKPs)?**

Zero-knowledge proofs let you prove you know something without revealing what you know. They work by constructing mathematical proofs that demonstrate you performed a computation correctly, without revealing the secret inputs you used. Think of it like proving you're over 18 without showing your exact age, or proving you have enough money in your account without revealing your balance.

In crypto, ZKPs are making an impact on both privacy and scaling related use cases.

For privacy, projects like Zcash or Iron Fish use ZKPs to enable fully private transactions where amounts, asset types, and transaction participants are hidden, yet the network can still verify transactions are valid.

For scaling, zkRollups use ZKPs to process thousands of transactions offchain, then submit a single compact proof that mathematically guarantees all those transactions are valid, saving on both storage and compute cost. General-purpose zkVMs like Risc0 and SP1 enable proving arbitrary program execution, opening up use cases beyond just transaction processing.

---

## **Why Benchmark Passkey Verification in Zero-Knowledge?**

Passkeys are the modern passwordless authentication system. You might have noticed a number of major platforms such as Google, GitHub, PayPal, and other popular websites you use today offer passkey logins as opposed to just using your password.

Passkey based smart wallets work similarly. Unlike traditional seed phrases or private keys that users must memorize or store securely, passkeys are securely stored and managed by your device's operating system. In many implementations they can be accessed via biometric data like Face ID or fingerprint offering better UX, and can be automatically synced across your devices via services like iCloud, 1Password, or Google Password Manager.

Base Accounts are passkey-based smart wallets, relying on the sec256r1 (P-256) curve for ECDSA signature generation, the same standard used by Apple, Google, and the FIDO2 WebAuthn specification. ​​Verifying a passkey signature within a zero-knowledge proof enables powerful privacy features. Users can prove ownership of a public key by proving validity of a signature without directly revealing their public key enabling:

- Anonymous group membership proofs for DAOs
- Private authentication for sensitive applications
- Delegating proof generation to relayers while maintaining privacy

Please note that in practice such proofs would have two steps: one step to prove ownership over a key (e.g. validity of a signature within a ZKP), and the second step would be to prove that the public key (or even a commitment/hash of that public key) is within a certain set, such as a merkle tree, onchain. For these benchmarks we just focused on the first step of verifying a passkey signature within a ZKP to validate the idea.

Although these are just explorations for now, it’s a topic that the Base Privacy pod (acquired team from Iron Fish) is really passionate about.

Generating zero-knowledge proofs for passkey signatures is also a fun technical problem. Passkeys use the P-256 elliptic curve for signatures, but most efficient and popular ZKP systems for EVMs use the BN254 curve that has a different mathematical field. This creates a "curve mismatch" problem. Think of it like trying to do math where your calculator only works with numbers 1-100, but you need to work with numbers 1-1000. You need to break down the larger numbers into smaller pieces and emulate the math you want to do. P-256 curve elements can't be directly represented as single values in BN254-based ZKP systems. Instead, they must be "emulated" through complex mathematical operations, resulting in large circuits with around 2 million constraints. For comparison, the most complex ZKP circuit in both Iron Fish and Zcash is around 100k constraints.

---

## **Methodology**

We tested four leading ZKP frameworks, each with different strengths:

- SnarkJS: JavaScript-based, runs in browsers, great for development
- Rapidsnark: C++ optimized version of SnarkJS for production speed
- Gnark: Go-based system with strong security features
- Noir: Rust-based with specialized optimizations for complex operations\

All of these frameworks rely on circuit engines, which convert high-level code into the low-level mathematical constraints that ZKP systems understand. Each framework has its own way of expressing and optimizing these constraints.

Some ZKP systems have what’s called a “trusted setup” that is unique per every circuit and must be generated as part of the setup phase. The more complicated a circuit/program is, the more computationally intensive the trusted setup step is. Noir uses a ZKP system that relies on a “universal trusted setup” instead, which is generated just once and reused for many circuits. Not having to regenerate the trusted setup was a huge developer experience benefit.

**Key Technical Choices:**

- BN254 curve vs BLS12-381: We chose BN254 for better performance and lower gas costs in EVM environments
- P-256 Implementation: Since building P-256 field arithmetic from scratch was outside our scope, we used existing optimized implementations (called "gadgets") where available
- For Noir specifically, we leveraged their "blackbox" functionality which are specialized operations handled directly by the underlying Barretenberg proving system in optimized C++ code, rather than being expressed as individual ZKP constraints.

| **ZKP stack** | **Browser support?** | **Language** | **Strengths** | **Proving system & curve** | **Setup Requirements** |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------ | ----------------------------------------------------------- | -------------------------- | ----------------------- |
| **Proof generation:** [**SnarkJS**](https://github.com/iden3/snarkjs) Circuit engine: [circom](https://docs.circom.io/) + [p256 gadget](https://github.com/privacy-scaling-explorations/circom-ecdsa-p256) | Yes | JavaScript | Versatile, browser compatible, but slower on large circuits | Groth16 BN254 curve | Trusted setup |
| **Proof generation:**[**Rapidsnark**](https://github.com/iden3/rapidsnark) Circuit engine: [circom](https://docs.circom.io/) + [p256 gadget](https://github.com/privacy-scaling-explorations/circom-ecdsa-p256) | No | C++ | Optimized for speed | Groth16 BN254 curve | Trusted setup |
| **Proof generation** [Gnark](https://github.com/Consensys/gnark) Circuit engine: gnark | No | Go | Strong security features and fast proving speeds | Groth16 BN254 curve | Trusted setup |
| **Circuit engine:** [**Noir**](https://github.com/noir-lang) using [P256 ECDSA signature](https://noir-lang.org/docs/noir/standard_library/cryptographic_primitives/ecdsa_sig_verification#ecdsa_secp256r1verify_signature-1) blackbox Proof generation: [BB](https://github.com/AztecProtocol/barretenberg) (barretenberg) | Yes , but WASM support is 3.5-4x slower than native Benchmarks were done using native Noir | Rust | Efficient for custom ops with blackboxes | UltraHonk BN254 curve | Universal trusted setup |

---

## **Benchmark Setup**

We ran the benchmarks on AWS EC2 instances to simulate real-world cloud environments:

- **t4g.medium**: ARM Graviton2, 2 vCPUs, 4GB RAM—Cost-effective ARM
- **c7g.xlarge**: ARM Graviton3, 4 vCPUs, 8GB RAM
- **c7i.2xlarge:** Intel, 8 vCPUs, 16GB RAM
- **c7i.4xlarge:** Intel, 16 vCPUs, 32GB RAM
- **c7i.8xlarge:** Intel, 32 vCPUs, 64GB RAM

Each benchmark involved generating proofs for the ECDSA signature verification circuit multiple times to capture minimum, average, and maximum values, along with standard deviations. Gas costs were measured for on-chain verification in an EVM-compatible smart contract.

The raw data and plots are available in our [results directory](https://github.com/lukasrosario/zk-snark-ecdsa-benchmarks/tree/main/ec2-benchmarks/collected_results_20250708_190933).

---

## **Results**

### **Proof Generation Times**

Noir dominated in speed, consistently achieving 5-50x faster proof generation than Groth16-based systems:

- c7i.2xlarge (8 vCPU, 16GB RAM): Noir ~2.1s, others 40-50s
- c7i.4xlarge (16 vCPU, 32GB RAM): Noir ~1.1s, others 20-30s
- c7i.8xlarge (32 vCPU, 64GB RAM): Noir ~0.6s, others 15-25s

Among Groth16 systems, Gnark performed best, followed by Rapidsnark and SnarkJS.

Below are summarized benchmark runs (all times in seconds):

### **t4g.medium (2 vCPUs, 4GB)**

_Couldn’t run SnarkJS and Rapidsnark due to memory overhead of generating the trusted setup_

![](https://www.base.org/images/blog/benchmarking-zkp-systems/01.webp)

### **c7g.xlarge (4 vCPUs, 8GB RAM)**

_Couldn’t run SnarkJS and Rapidsnark due to memory overhead of generating the trusted setup_

![](https://www.base.org/images/blog/benchmarking-zkp-systems/02.webp)

### **c7i.2xlarge (8 vCPUs, 16GB RAM)**

![](https://www.base.org/images/blog/benchmarking-zkp-systems/03.webp)

### **c7i.4xlarge (16 vCPUs, 32GB RAM)**

![](https://www.base.org/images/blog/benchmarking-zkp-systems/04.webp)

### **c7i.8xlarge (32 vCPUs, 64GB RAM)**

![](https://www.base.org/images/blog/benchmarking-zkp-systems/05.webp)

---

### **Gas Costs for On-Chain Verification**

Whereas Noir won on speed, it dramatically fell behind on gas cost.

Gas costs largely depend on proof size. Groth16 systems produce constant-size proofs regardless of circuit complexity. Noir's UltraHonk system generates proofs that scale logarithmically with circuit complexity:

| **Suite** | **Average gas cost** | **Difference** |
| ---------- | -------------------- | ------------------------------ |
| SnarkJS | 347,665 | Baseline |
| Rapidsnark | 347,665 | Baseline |
| Gnark | 407,664 | +17% (extra security features) |
| Noir | 2,396,575 | +590% (6-7x higher) |

![](https://www.base.org/images/blog/benchmarking-zkp-systems/06.webp)

---

## **Discussion**

Noir stood out on proof generation time, 5-50x faster than Groth16 counterparts on the same hardware yet 6-7x costlier on gas.

Noir's speed advantage largely comes from its blackbox implementation. The black box functions are hand-coded mini-circuits that the Aztec team wrote directly in their proving system, barretenberg, that use highly specialized custom gates for specific operations. Specifically, barretenberg has an algebraic gate that directly evaluates non-native field operations efficiently. Noir calls these custom gates directly, dramatically reducing circuit size and proving time.

These results reveal fundamental trade-offs rather than clear winners. Noir excels in proof generation speed for certain operations making it in some cases great for applications where users generate proofs client-side on mobile or browser environments, while having a higher gas cost due to proof size. It's also ideal when development velocity and iteration matter most or when you can use Layer 2s to reduce the gas cost impact. Groth16 systems like SnarkJS, Rapidsnark, and Gnark become the better choice for complex general computations that Noir can’t optimize for, or when onchain verification costs are the primary constraint.

However, keep in mind that the ZKP landscape continues to evolve rapidly and new innovations and techniques are coming out every day. Happy building!

For raw data, code, and plots, visit our [GitHub repo](https://github.com/lukasrosario/zk-snark-ecdsa-benchmarks). Feedback and contributions welcome!

---

If you’re interested in helping us build a global economy that increases innovation, creativity, and freedom, [we’re hiring](https://www.base.org/jobs) — and we’d love to hear from you.

Follow us on social to stay up to date with the latest: [X](https://x.com/base) ([Base team on X](https://x.com/i/lists/1876354838289932418)) | [Farcaster](https://warpcast.com/base/) | [Discord](https://discord.com/invite/buildonbase?utm_source=dotorg&utm_medium=nav)
