> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Base Proofs

> Overview of the offchain services and onchain contracts that make L2 checkpoint proposals verifiable from Ethereum in the Azul proof system.

The proof system is the set of offchain services and onchain contracts that make L2 checkpoint
proposals verifiable from Ethereum. A proposal claims an output root for a fixed L2 block range.
Independent proof actors recompute that claim, provide proof material, and dispute the game if the
claim is invalid.

This section describes the component roles used by the Azul proof system.

* [Challenger](https://docs.base.org/specifications/base-protocol/proofs/challenger.md): checks in-progress games against canonical L2 state and disputes
  invalid claims.
* [Proposer](https://docs.base.org/specifications/base-protocol/proofs/proposer.md): creates new checkpoint proposals.
* [Registrar](https://docs.base.org/specifications/base-protocol/proofs/registrar.md): maintains the onchain registry of accepted TEE signer identities.
* [TEE Prover](https://docs.base.org/specifications/base-protocol/proofs/tee-prover.md): produces Nitro Enclave-backed proofs for the common proposal path.
* [ZK Prover](https://docs.base.org/specifications/base-protocol/proofs/zk-prover.md): produces permissionless proofs for proposal and dispute paths.
* [Contracts](https://docs.base.org/specifications/base-protocol/proofs/proof-contracts.md): verify proof material, track game state, and release withdrawals and
  bonds according to the game result.
