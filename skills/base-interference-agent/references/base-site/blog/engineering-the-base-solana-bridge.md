# blog/engineering-the-base-solana-bridge

Source: https://www.base.org/blog/engineering-the-base-solana-bridge.md

# Engineering the Base-Solana Bridge

> TL;DR: The new Base-Solana bridge is a custom-engineered solution for direct asset and message transfers between the chains. It represents our first major step towards an…

- Date: 2025-12-11
- Author: Jack Chuma
- URL: https://www.base.org/blog/engineering-the-base-solana-bridge

**TL;DR:** The new Base-Solana bridge is a custom-engineered solution for direct asset and message transfers between the chains. It represents our first major step towards an interconnected multichain global economy.

---

We recently launched a [bridge between Base and Solana](https://www.base.org/blog/base-solana-bridge), enabling token transfers and arbitrary message passing between the chains. This post details the architecture, the engineering constraints that influenced our design choices, and our roadmap for future improvements and decentralization.

## Why Build a Bridge?

To build a global economy, we need to make it dead simple for people to move assets at the speed of the internet and tap into liquidity across every chain. While the Ethereum ecosystem is already a highly interconnected web of L2s, a canonical connection to chains outside this ecosystem has been missing.

Our first step is unlocking access to Solana, a network with [over $8B TVL and $5B in daily trading volume](https://www.coingecko.com/en/chains/solana). There are existing bridging options between Base \<> Solana operated by unaffiliated third parties, so why invest in building a bridge?

We believe there is value in solving this problem at the protocol level in Base. Existing third party protocols compete for blockspace in the public mempool, subjecting them to variable costs and latency constraints. Adding native interop within Base allows us to:

- Introduce canonical Solana asset representation within Base, and canonical Base asset representation on Solana.
- Lower costs, as the native bridge does not need to charge a protocol fee outside of covering existing gas costs.
- Index finalized Solana state in real time for lower latency.
- Own the security properties affecting cross-chain assets.

## Bridge Design

We designed the bridge as a low-level primitive, taking inspiration from the native bridge between Base and Ethereum. It is asymmetric by necessity, leveraging the unique strengths and working around the constraints of both chains. Supported actions include token transfers, arbitrary function calls, and combinations of the two.

## System Properties

### **Token Bridging**

Before bridging a source chain asset, a corresponding token wrapper must be created on the destination chain. These wrappers are tokens owned by the bridge, granting the bridge the exclusive permission to mint and burn them as assets move across the network.

This mechanism creates a ‘lock and mint’ concept. First, source chain assets are locked in a bridge-owned vault; the bridge then mints an equivalent amount of wrapped tokens on the destination chain for the user. Then to bridge back, the destination chain wrapped tokens are burned, which triggers the unlocking of the original assets from the source vault.

### **Latency**

End-to-end latency is strictly bound by source chain finality and oracle verification overhead.

- **Solana → Base:** Latency is dictated by Solana's `finalized` [commitment level](https://docs.solanalabs.com/consensus/commitments). Messages are not processed until a supermajority of the validator set (66%+) confirms the slot, ensuring reorg protection (approx. 15 seconds).
- **Base → Solana:** Latency is bound by Ethereum L1 finality. State updates are propagated only after the sequencer batch is posted to Ethereum and the L1 block reaches `finalized` status (approx. 15 minutes).

### **Fees**

Cross-chain bridging presents a fundamental resource pricing challenge: executing a transaction on the destination chain requires paying for blockspace in that chain's native asset, but the user initiates the action on the source chain.

In our existing canonical system, deposits from Ethereum to Base are automatically included by the sequencer, whereas withdrawals from Base to Ethereum require users to manually prove and execute the transaction on L1.

We designed the Solana bridge to follow this exact pattern:

- **Solana → Base:** This path functions like a [deposit](https://docs.optimism.io/op-stack/bridging/cross-domain#deposit-flow). The protocol guarantees the _ability_ to execute on Base by pre-validating the transaction. The bridge collects a fee to cover the cost of this submission. Users can optionally pay for automatic relaying by specifying a gas limit as well. The exact fee collected is derived algorithmically via a mechanism adapted from Ethereum’s [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559).
- **Base → Solana:** This path functions like a [withdrawal](https://docs.optimism.io/op-stack/bridging/cross-domain#withdrawal-flow). The protocol propagates state roots but does not perform execution. Users or third-party solvers are responsible for submitting inclusion proofs and paying the requisite SOL gas fees directly on Solana. No in-protocol fee is required.

## Architecture

The bridge relies on two primary onchain deployments: a monolithic [Anchor](https://www.anchor-lang.com/docs) program on Solana and a set of modular smart contracts on Base. It also relies on offchain validators operated by Coinbase and Chainlink.

![](https://www.base.org/images/blog/engineering-the-base-solana-bridge/01.webp)

### **Solana Architecture**

On Solana, we deployed a single Anchor-based [bridge program](https://github.com/base/bridge/blob/39b6f53a1e2c623bef1dd2fc9626389784d32e4c/solana/programs/bridge/src/lib.rs) as the gateway for all cross-chain activity. This program handles three critical functions.

- Message Egress: Creates discrete `OutgoingMessage` accounts for every action targeting Base.
- State Verification: Maintains a registry of valid Base roots and verifies inclusion proofs for incoming messages.
- Asset Custody: Manages [Program Derived Addresses](https://solana.com/pt/docs/core/pda) (PDAs) that act as vaults for locked SPL tokens and holds the mint authority for wrapped Base assets.

### **Base Architecture**

On Base, we chose a modular system to handle EVM state management and execution complexity:

- [Bridge](https://github.com/base/bridge/blob/39b6f53a1e2c623bef1dd2fc9626389784d32e4c/base/src/Bridge.sol): The central hub. Handles message ingress/egress, holds locked assets (ETH and ERC20s), and controls minting/burning of wrapped Solana assets.
- [BridgeValidator](https://github.com/base/bridge/blob/39b6f53a1e2c623bef1dd2fc9626389784d32e4c/base/src/BridgeValidator.sol): Verifies batches of messages from Solana before execution.
- [Twin](https://github.com/base/bridge/blob/39b6f53a1e2c623bef1dd2fc9626389784d32e4c/base/src/Twin.sol): A deterministic execution context for Solana users, allowing interactions with Base dApps without managing a separate EVM key.
- [CrossChainERC20Factory](https://github.com/base/bridge/blob/39b6f53a1e2c623bef1dd2fc9626389784d32e4c/base/src/CrossChainERC20Factory.sol): Deploys and manages canonical wrapped representations of Solana tokens.

### **Offchain Architecture**

We operate a custom indexer to tie the onchain components together. This service monitors the state of both the Solana program and the Base contracts. When a state transition occurs (e.g., an outgoing message is emitted), the oracle:

1. Indexes the event data from the source chain.
2. Requests signatures from the Chainlink [Decentralized Oracle Network](https://chain.link/education/blockchain-oracles) (DON) and our internal validators.
3. Relays the signed state to the destination chain.

## Flow Diagrams

### **Solana → Base Bridging**

![](https://www.base.org/images/blog/engineering-the-base-solana-bridge/02.webp)

1. A user calls the `Bridge` program on Solana.

 - Note that because the calldata required for an EVM transaction can easily exceed the transaction size limits on Solana (1232 bytes), this can optionally be broken into multiple steps where the calldata is loaded into a temporary buffer account before initiating the bridging flow.

2. The program locks funds in a PDA vault and initializes an `OutgoingMessage` account containing the execution payload.
3. The Base oracle indexes the new `OutgoingMessage` account.
4. The oracle computes the message hash and requests [ECDSA](https://www.cyfrin.io/blog/elliptic-curve-digital-signature-algorithm-and-signatures) signatures from Base and Chainlink validators.
5. The oracle submits the message and validator signatures to the `BridgeValidator` contract on Base.
6. A relayer or user calls the `Bridge` contract to execute the message.
7. The `Bridge` contract verifies pre-validation in `BridgeValidator` and executes the payload.

### **Base → Solana Bridging**

![](https://www.base.org/images/blog/engineering-the-base-solana-bridge/03.webp)

1. A user calls the `Bridge` contract on Base.
2. The contract appends the encoded message to an onchain [Merkle Mountain Range](https://commonware.xyz/blogs/mmr) (MMR) data structure.

 - We chose an MMR because it generates compact inclusion proofs that fit easily within Solana’s transaction size limits. It is also highly efficient to maintain; appending to the structure on Base costs less than 1/10th of a cent, and we won't hit Solana’s size constraints until the tree reaches ~17 billion nodes.

3. The Base oracle detects a new MMR root at a finalized block height.
4. The oracle requests ECDSA signatures for the new root from Base and Chainlink validators.
5. The oracle submits the signed root to the `bridge` program on Solana.
6. A relayer or user generates an inclusion proof against the updated root (via `Bridge.generateProof`).
7. The relayer or user submits the inclusion proof to Solana.
8. The program verifies the proof and executes the message.

## Security

The bridge was designed with security as a top priority to ensure solvency and safe bridging. While building the bridge, several invariants we viewed as foundational were:

- **Solana → Base:** Transactions executed on Base match a deposit on Solana
- **Base → Solana:**

 - State roots posted on Solana match those derived on Base
 - Withdrawals proved against state roots match a transaction on Base

- The amount of minted wrapped tokens on any chain cannot exceed the amount of locked tokens on the opposite chain

To increase our confidence in the bridge’s security, we conducted:

- Internal audits of the codebase that spanned from the design phase to deployment
- A threat model and evaluated design trade offs
- Penetration tests on the infrastructure
- Extensive external audits by

 - Cantina for the smart contracts
 - Trail of Bits for the oracle

- Unit tests and end-to-end tests of all important workflows

As the current design involves a centralized oracle, we worked towards mitigating risks produced by this component until decentralization is achieved.

As explained in the design, one of the novel aspects of this bridge is the use of a Merkle Mountain Range for state roots instead of a traditional Merkle tree. Our own cryptography team worked with our internal auditors to find hash collisions and write a proof that the current implementation is sound.

We also have several monitors set up to alert us of anomalous behaviour or broken invariants, such as

- Unexpected deposits/withdrawals
- Discrepancies between the locked amount and minted amount of a bridged token
- Any privileged function call
- Delayed or failed transactions by the oracle
- Changes to our bridge partner’s smart contracts or API availability

Runbooks were also created to prepare our team for incident response. These cover escalation paths and playbooks for specific scenarios from on-chain hacks and transaction discrepancies to off-chain oracle outages and partner availability.

### Key Management

Bridge exploits frequently occur due to key compromise, so we implemented a separation of concerns for the private keys involved with the operation of the bridge:

- **Configuration keys:** Controlled by a multisig for parameter changes and emergency pauses
- **Upgrade keys:** Separate multisig with different owners for contract upgrades
- **Signing keys:** Used to sign messages between Base and Solana. These are split between Coinbase and Chainlink infrastructure, requiring signatures from both parties

Each of these operations have designated independent multisignature accounts with at least a 3-of-5 threshold. In particular, as the signing keys are particularly critical to bridge operations, our partnership with Chainlink ensures that the keys are distributed among separate infrastructure, so compromising either party alone cannot move funds.

To decrease the risk exposed by these keys, our vision is to decentralize as much as possible so that the trust model is similar to our current bridge between Ethereum and Base, as explained in the next section.

## Decentralization Roadmap

While the distributed validator set gives us good security properties, our preference is to explore cryptographic unlocks enabling a future system secured only by the consensus of Solana + Ethereum.

The transition to a fully trust-minimized bridge, we’re thinking in three phases, beginning with the current Proof-of-Authority model secured via independent validator attestations. Subsequent phases will detail efforts toward protocol enshrinement, integrating verification logic for improved efficiency, and the long-term goal of the ZK Prove architecture, which seeks to achieve full decentralization by replacing attestations with cryptographic proofs of consensus.

## Phase 1: Proof-of-Authority (Current State)

We secure Phase 1 with a shared responsibility model requiring independent attestations from two parties: an oracle run by Base and the Chainlink DON.

The Chainlink DON attestation currently operates with a 3-of-5 multisignature scheme, and our plan is to increase to a 9-of-16 threshold in the near future. Both the Base oracle and the Chainlink DON must attest to a message for successful processing.

Validator operators maintain two distinct [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) keypairs to generate ECDSA signatures—one dedicated to Base and another to Solana. We enforce this key isolation to ensure that a compromise of a validator's key on one chain does not put the other chain at risk. For tracking these addresses, Chainlink manages an onchain registry (a smart contract on Base and a program on Solana) where these chain-specific public keys are registered. Our bridge contracts query these registries dynamically to verify signatures.

### **Solana → Base Validation**

For transactions moving from Solana to Base, the Base Oracle and Chainlink validators verify message batches before they are relayed to our `BridgeValidator` contract.\

1. The Base oracle calls the Chainlink API with an array of message hashes corresponding to `OutgoingMessage` accounts on Solana.
2. Validators confirm that every message hash in the batch corresponds to a valid `OutgoingMessage` account created by the Solana bridge program.
3. Once verified, validators generate an ECDSA signature over the Keccak-256 hash of the tightly packed array of message hashes (`keccak256(abi.encodePacked(messageHashes))`).
4. The Chainlink API collects the required threshold of signatures and returns them to the Base oracle, which submits the batch onchain in a single transaction.

### **Base → Solana Validation**

As mentioned above, the process for validating transactions from Base to Solana uses an MMR to represent the state of the bridge, which helps keep proofs under Solana’s transaction size limit.\

1. The Base oracle fetches the latest MMR root, the associated Base block number, and the MMR leaf count from the getRoot function on the Base bridge contract.
2. Chainlink validators verify that the proposed Base block number is finalized and that the output root proposed by the oracle matches the onchain state.
3. Validators provide an ECDSA signature over the Keccak-256 hash of the concatenated MMR root, Base block number, and MMR leaf count.
4. The Base oracle collects these signatures and includes them in the `register_output_root` transaction it submits to the Solana bridge program.

## Phase 2: Enshrinement

![](https://www.base.org/images/blog/engineering-the-base-solana-bridge/04.webp)

Phase 2 improves cost and latency by moving verification logic into the protocol layer. Rather than verifying Solana messages via smart contracts, we modify the Base protocol to natively index Solana data.

We plan to utilize a component analogous to the Optimism Superchain's [op-supervisor](https://docs.optimism.io/chain-operators/reference/components/op-supervisor). This service ingests `OutgoingMessage` accounts from Solana and forwards them to the execution engine, enabling nodes to verify cross-chain transactions natively.

However, native indexing introduces a security paradox. Base derives its security from Ethereum via an [optimistic fault proof system](https://docs.optimism.io/op-stack/fault-proofs/explainer). This system is capable of verifying state transitions because it has access to all needed inputs on L1 (deposits and blobs). Since L1 has no visibility into Solana's state, it cannot verify the validity of transactions derived from natively indexed Solana data.

To resolve this, we must make Solana state available on Ethereum. We introduce a **State Prover** service that posts Solana state representations to L1, allowing the fault proof system to verify inclusion proofs against a trusted root.

Solana's architecture complicates this. Unlike EVM chains, Solana does not include a global state root in its block header. To bridge this gap, we run a sidecar to Solana validator nodes that computes a merklized root of the bridge state. In Phase 2, Chainlink and Base validators attest to this derived root.

For the Base → Solana path, we integrate [op-enclave](https://github.com/base/op-enclave), a relatively small modification to the op-stack that proves state transitions in an AWS Nitro Enclave and outputs the resulting state root. This removes the need for the 7-day challenge period and allows for immediate withdrawals. The State Prover relays these roots to Solana accompanied by the TEE proof, eliminating the need for validator attestations in this direction.

We intend to modify `op-enclave` to prove the bridge MMR root directly, rather than the entire Base state root, preserving the existing client-side proof interface.

## Phase 3: ZK Prove

![](https://www.base.org/images/blog/engineering-the-base-solana-bridge/05.webp)

We are sharing our current thinking to provide transparency into our long-term roadmap towards fully trust-minimized architecture, though we have not yet committed to specific design choices. We welcome any and all feedback on the following.

The objective of Phase 3 is to remove the need for validator attestations entirely. Instead, we aim to rely solely on cryptographic proofs of consensus.

The primary engineering constraint is verifying Solana's consensus rules within the EVM's resource limits. Solana currently operates with 400ms slot times and a large validator set, requiring the verification of thousands of Ed25519 signatures per block. Replicating this logic directly in a solidity smart contract is gas-prohibitive due to the lack of cheap Ed25519 precompiles and the prohibitive cost of calldata for the signatures.

We are investigating a ZK-based approach to compress this verification. The proposed system would utilize a ZK circuit to ingest Solana block headers and aggregate signatures, outputting a succinct proof of the valid state root.

For the Base → Solana path, we propose leveraging the output roots Base already posts to Ethereum. Since verifying Ethereum consensus via ZK is a well-understood problem space, we aim to submit Base roots to Solana accompanied by two proofs:

1. **Consensus Proof:** Verifies the Ethereum state root.
2. **Storage Proof:** Proves the inclusion of the Base output root within that Ethereum state.

A critical open question is the latency of this path. Under the current optimistic fault proof system, Base output roots on Ethereum are subject to a 7-day challenge period. Waiting for this finality would degrade the bridge experience significantly (15 minutes → 7 days). Thus, this design assumes Base has a future as a zk-rollup where time to finality is far lower.

---

## Looking Forward

The Base-Solana bridge is live on mainnet today. We invite you to learn more in our [docs](https://docs.base.org/base-chain/quickstart/base-solana-bridge?utm_source=base_dot_org) and [Github repo](https://github.com/base/bridge) and share your feedback.

We'll continue to push the limits of what is possible. We envision Base as the central hub of the global economy, with native ability to interop with all major chains–Solana is only the beginning. If you're interested in working on the hardest problems in the industry, [we're hiring](https://www.base.org/jobs), and we'd love to hear from you.

---

Follow us on social to stay up to date with the latest: [X](https://x.com/base) ([Base team on X](https://x.com/i/lists/1876354838289932418)) | [Farcaster](https://warpcast.com/base/) | [Discord](https://discord.com/invite/buildonbase?utm_source=dotorg&utm_medium=nav)
