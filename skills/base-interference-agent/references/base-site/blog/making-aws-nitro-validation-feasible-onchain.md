# blog/making-aws-nitro-validation-feasible-onchain

Source: https://www.base.org/blog/making-aws-nitro-validation-feasible-onchain.md

# Making AWS Nitro Validation feasible onchain

> TL;DR: A redesign of the base/nitro-validator library makes EVM Nitro Enclave attestations feasible onchain again post the Fusaka upgrade and even cheaper than before. Ethereum's…

- Date: 2026-08-11
- Author: Elena Nadolinski
- URL: https://www.base.org/blog/making-aws-nitro-validation-feasible-onchain

**TL;DR:** A redesign of the base/nitro-validator library makes EVM Nitro Enclave attestations feasible onchain again post the Fusaka upgrade and even cheaper than before. Ethereum's Fusaka upgrade repriced MODEXP (EIP-7883) and capped transactions at 16.7M gas (EIP-7825), which made the original base/nitro-validator too expensive to run. We restored it with _hinted_ P-384 signature verification: the expensive modular inverses are computed offchain and passed in as calldata, where the contract only has to check them. This cuts gas dramatically without adding any trust in the offchain hint generator.

## **Why verify Nitro attestations onchain?**

More and more applications are moving computation offchain. When that computation needs to be trustworthy, running it inside a Trusted Execution Environment (TEE) — such as AWS Nitro — is often the cleanest option. A TEE runs code in an isolated environment and produces a signed statement about _which_ code ran and in _what_ environment, bound to application data like an output, a nonce, or an enclave public key.

Verifying that statement onchain is what makes it powerful. Instead of trusting an operator who says "I ran the right code," a contract can verify an attestation that cryptographically ties an output to a specific enclave image. That unlocks patterns like:

- **External verification** — accept claims, proofs, or state commitments from an approved offchain verifier.
- **Custom execution engines** — run specialized logic outside the EVM and verify the result came from approved enclave code.
- **Private compute** — run auctions, matching, scoring, or policy checks inside an enclave, exposing only a signed result onchain.
- **Oracle and risk pipelines** — accept updates computed inside a measured data-processing environment.
- **Enclave-backed signers** — authorize keys only after verifying the Nitro attestation that produced them.
- **Bridges, settlement, and keepers** — gate privileged actions on signatures from approved enclave code.

The biggest problem is that Nitro attestations are signed on the P-384 curve, and that curve is unfortunately not supported as a precompile by the latest EVM that Base and Ethereum L1 rely on. Consequently,  P-384 signature verification is extraordinarily expensive (to a point of being infeasible) onchain today.

## **What Fusaka changed**

Before Fusaka, onchain Nitro verification was costly but doable. One P-384 signature check cost ~7.9M gas. A full cold attestation which requires five signature checks, CBOR/COSE parsing, X.509 handling, and cert caching came to ~53M gas total spread across several transactions,

Fusaka changed the math in two ways:

- **EIP-7883** repriced large MODEXP calls upward.
- **EIP-7825** capped every transaction at 16.7M gas.

Under the new schedule, a single unhinted P-384 verification jumped to **~50.6M gas** — already over the per-transaction cap on its own. A full attestation needs five of them: **~267M gas total.** The original library simply couldn't run anymore.

So we changed the unit of work.

## **The expensive part: 570 huge exponentiations**

Why does one P-384 verification cost ~50.6M gas post Fusaka? ECDSA verification requires elliptic-curve arithmetic onchain since there’s no precompile. The verifier has to reconstruct a point on the curve and check that its x-coordinate matches the signature.

This implementation uses affine coordinates, where point addition and doubling compute slopes via finite-field division. Division requires finding the scalar-field inverse:

`a / b mod m  =  a · b⁻¹ mod m`

And computing the inverse requires exponentiation to a 384-bit exponent (number on the order of 10¹¹⁵) using Fermat’s Little Theorem: \
\
`b⁻¹ = b^(m − 2) mod m`\
\
One signature check requires that roughly **570 times**!

For P-384, m is either the field prime p or the group order n — both ~384-bit primes, and both numbers on the order of 10¹¹⁵. Raising to that exponent ~570 times per signature is where the gas goes.

But inversion has a useful asymmetry:

- Computing an inverse is **expensive**.
- Checking an inverse is **cheap**.

If someone claims inv is the inverse of b, the contract can confirm it with a single multiplication and equality check:

`b · inv == 1 mod m`

That's the whole idea behind hints.

## **Our Solution: Checked hints**

Instead of computing each inverse onchain, we compute them offchain and pass them in as _hints_ in calldata. For every division, the verifier reads the next 48-byte hint and checks it before using it:

```
need  a / b mod m
  →  read next hint inv
  →  require b · inv == 1 mod m
  →  use a · inv mod m
```

Hints are never trusted. A bad hint reverts. A truncated hint stream reverts. A stream with extra unused hints reverts. A caller can waste their own gas, but can't make the verifier accept a signature it would otherwise reject.

This is safe because the relevant P-384 moduli — the field prime p and the group order n — are both prime. In a prime field every nonzero value has exactly one inverse, so any hint that passes b · inv == 1 mod m _is_ the same inverse the contract would have computed with b^(m − 2). Hints change how the verifier gets the inverse, not which signatures are valid.

![](https://www.base.org/images/blog/making-aws-nitro-validation-feasible-onchain/01.webp)

The system is three contracts, each with one job:

- **P384Verifier** holds the ECDSA-P-384 math and the hint checks. It sits behind an external call so the other two contracts stay under the EIP-170 size limit.
- **CertManager** validates X.509 certificates against the pinned AWS Nitro root, verifies non-root signatures through P384Verifier, caches verified certificate metadata, and enforces revocation.
- **NitroValidator** parses the COSE/CBOR attestation document, walks the certificate bundle through CertManager, and verifies the final attestation signature against the cached leaf key.

The unhinted entrypoints intentionally revert, so the gas profile is explicit: production callers use verifyCACertWithHints, verifyClientCertWithHints, and validateAttestationWithHints, and can't accidentally fall back to the expensive path.

## **Cold and warm verification**

A Nitro attestation carries a certificate bundle and a leaf certificate. The root CA is pinned in CertManager, so it never needs onchain verification. The **cold path** verifies and caches the rest, one signature per transaction:

1. Regional CA
2. Zonal CA
3. Issuer / instance CA
4. Leaf certificate
5. COSE attestation document signature

That's five P-384 checks across five transactions. Once the chain and leaf are cached, later attestations from the same leaf take the **warm path**: a single transaction that verifies the document signature and confirms the cached certificates are present, unexpired, correctly chained, and not revoked.

## **Measured gas**

On Base, the full cold sequence fits in five transactions, each comfortably under the 16,777,216 gas cap:

| **tx** | **action** | **hint bytes** | **gas used** |
| ------ | ----------------------------- | -------------- | ------------ |
| 1 | cache regional CA | 27,456 | 6,825,140 |
| 2 | cache zonal CA | 27,408 | 7,053,669 |
| 3 | cache issuer / instance CA | 27,408 | 6,813,103 |
| 4 | cache leaf cert | 27,504 | 6,825,004 |
| 5 | validate attestation document | 27,312 | 13,775,541 |

The inverses are passed in the calldata as hints. Every inverse is 48 bytes and a signature verification consumes 569–573 of them depending on the signature data making each hint stream ~27 KB. Calldata cost is already included in these receipt numbers.

## **Security model**

The key property: **hints are public proposals, not trusted witnesses.**

The contract checks every inverse before use, meaning that a wrong hint can't bias the elliptic-curve arithmetic — it can only revert. The verifier also enforces exact hint consumption, so callers can't omit required inverses or smuggle unused data through.

The hint mechanism is trustless, however the attestation's validity still rests on trusting AWS Nitro hardware overall.

Application policy stays with the application. NitroValidator proves an attestation is signed by a valid Nitro certificate chain, returns the parsed fields, and the consuming app decides which PCRs, module IDs, nonces, timestamps, and public keys it trusts.

## **Building in the open**

The implementation is open source in [base/nitro-validator](https://github.com/base/nitro-validator). The repo includes:

- the hinted P384Verifier, CertManager, and NitroValidator;
- a no-dependency Node.js reference hint generator;
- Foundry tests covering valid attestations, malformed hints, expired certificates, revocation, parser edge cases, and offchain/onchain hint-stream equivalence; and
- a Base Sepolia demo for the cold and warm paths.

The library has been independently audited by Cantina and you can read the full report [**here**](https://github.com/base/nitro-validator/blob/main/audits/cantina-nitro-validator-05294ec0-2026-08-03.pdf).

Treat the bundled JavaScript as a reference implementation, not a backend dependency — the contract interface is plain calldata, so you can port the hint generator to whatever stack you already run.

## **What's next**

Base itself verifies Nitro attestations in production today using zero-knowledge (ZK) proofs as that was the only known practical way to verify Nitro attestations onchain post the Fusaka upgrade. This hinted P-384 approach makes Nitro attestation practical on Base without a new precompile or a ZK proving service, and we plan to use this approach for the proofs system of our Base canonical bridge in the future replacing the need for ZKPs to verify Nitro onchain attestations.

And this library isn't Base-specific. This can be useful to any EVM use case that needs to run on a post-Fusaka chain (e.g. Ethereum Mainnet and many others). Any EVM app that wants to trust a Nitro enclave can use the same pattern: verify the AWS certificate chain, verify the attestation signature, inspect the returned measurements, and bind the result to your own policy.

## **Get Involved**

If you're building with TEEs, app-specific rollups, oracle networks, or enclave-backed signers, we'd love your feedback! Contribute or open issues on [Github](https://github.com/base/nitro-validator), or reach us on [X](https://x.com/buildonbase) or [Discord](https://discord.com/invite/buildonbase).
