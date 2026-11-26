# blog/scaling-base-accelerating-decentralization

Source: https://www.base.org/blog/scaling-base-accelerating-decentralization.md

# Scaling Base: Accelerating Decentralization

> A summary of our benchmarking of Fault Proofs components to ensure they remain stable throughout our scaling efforts

- Date: 2025-01-06
- Author: Brian Bland
- URL: https://www.base.org/blog/scaling-base-accelerating-decentralization

## Fault Proofs in the OP Stack

Base [recently launched](https://base.mirror.xyz/eOsedW4tm8MU5OhdGK107A9wsn-aU7MAb8f3edgX5Tk) fault proofs on mainnet, marking a significant milestone in our journey towards progressive decentralization. Fault proofs allow anyone to participate in securing Base, creating a more trusted and open economy. A core property of fault proofs is that if there’s at least one honest participant, or “challenger” engaging in the fault proof game, then the game should resolve correctly. They are a critical component of the Base stack, and as we continue to increase throughput on Base, we need to ensure that our scaling efforts do not introduce any incompatibilities with fault proofs. Therefore, we launched a dedicated initiative aimed at analyzing how the Fault Proof System in the OP Stack would be impacted by our scaling efforts, and ensuring that we can continue to scale fault proofs safely. Today, Base’s Fault Proof System leverages the [Cannon Fault Proof Virtual Machine](https://blog.oplabs.co/mips-sol/) (FPVM). You can read more about fault proofs in the OP Stack [here](https://docs.optimism.io/stack/protocol/fault-proofs/explainer).

[Cannon](https://docs.optimism.io/stack/fault-proofs/cannon) is the [first](https://blog.oplabs.co/cannon-cannon-cannon-introducing-cannon/) Fault Proof VM (FPVM) supported by the OP Stack. It combines onchain and offchain components in order to effectively run the EVM _within_ the EVM, ensuring that any state transition can be audited, and permissionlessly challenged. Unlike typical Ethereum implementations which only ensure that a transaction has a deterministic output (e.g. balances and token transfers), the Cannon FPVM emulates a computer which behaves deterministically - down to the individual MIPS instruction - all while running its own instance of the EVM.

## Identifying the constraints

Given the complexity associated with fault proofs, today’s Cannon implementation contains certain simplifications. Cannon implements a minimal set of unix system calls - just enough to allocate memory, read and write to a [preimage oracle](https://specs.optimism.io/fault-proof/index.html#pre-image-oracle), and exit gracefully. Notably, this excludes syscalls related to creating and managing threads, or other concurrency primitives. As Cannon is written in Go, a garbage-collected language optimized for concurrent code, this has a few drawbacks. Most importantly, Cannon is unable to clean up memory once it’s no longer needed, causing the footprint to grow until either the program completes or it hits the hard limit imposed by the 32-bit MIPS architecture. This means that each Cannon execution has a hard constraint on the available memory. Because the execution behavior is entirely deterministic (an essential property of a Fault Proof System), any input which causes Cannon to run out of memory will always cause it to fail.

Cannon isn’t only racing against its memory limit, but also against the clock. Base provides a set window of time for anyone to verify or challenge the state published back to L1. In a fault proof dispute game with two players, each player has just over 3 days to run Cannon from start to finish in order to participate. Because Cannon provides several layers of virtual machine abstraction, and optimizes for determinism, block execution is many orders of magnitude slower on Cannon than on a standard Base node.

In order to safely ship fault proofs to mainnet with these restrictions, we needed to ensure that all blocks would always be provable - especially as [we raise our gas target](https://base.mirror.xyz/6NDvVKw8x5obo3h1OgQx582hF73m81CnJabgbRneW2Q). In other words, no combination of blocks could “break” Cannon by taking too much time or memory. This of course meant we needed to stress-test the system in as many ways as possible.

## Introducing new tooling

To address this challenge, we built an [open source tool](https://github.com/base-org/fp-test-cases/) to generate repeatable fault proof test cases within a local devnet. We first generated and executed these tests outside of Cannon to develop and iterate more quickly, and then ran them in the slower Cannon environment for comparison and metrics collection.

Each test scenario consisted of a single transaction configured with a given gas target. This transaction would deploy a contract that would repeatedly perform a specific operation pattern until the gas target was met or surpassed. Each contract and associated forge script is defined in the testing repository, linked above. These test scenarios were executed at 4 gas targets: 1Mgas, 2Mgas, 3Mgas, and 20Mgas, in order to produce and validate a linear scaling model, which then allowed us to forecast the impact of a block containing 100Mgas with the same characteristics. Test coverage included ETH Transfers, ERC20 Transfers, Storage Writes, Storage Reads, Contract Deploys, as well as the majority of precompiled contracts. We omitted precompiles that do not pose a risk to resource constraints in Cannon, such as those which can be offloaded to the L1 EVM.

For each test case, we specifically evaluated the Cannon MIPS instruction count, memory usage, and wall clock runtime. We performed these tests on a less-performant runtime environment than our production challenger. From this baseline we again rounded down to an extremely conservative 10M instructions per second execution speed, in order to forecast the worst case challenger proof time for each test fixture.

## What we learned

From these tests we identified two specific usage patterns which stood out the most in terms of resource constraints, the p256Verify and ECAdd precompiles, which are detailed below. Importantly, we validated that these constraints will not limit our scaling efforts below 60Mgas/sec.

### p256Verify: Time intensive

The p256Verify precompile (introduced in [RIP-7212](https://github.com/ethereum/RIPs/blob/master/RIPS/rip-7212.md)) consumes the largest amount of Cannon instructions per gas unit, and cannot be simply accelerated in the onchain MIPS.sol contract using the existing L1 precompile preimage execution pattern, as it is not yet deployed on L1. At around 10,000 Cannon instructions per gas, and using an extremely conservative execution estimate of 10,000,000 instructions per second, the p256Verify precompile can consume around 1ms per gas. At a much higher block gas limit of 100Mgas, execution may take as long as 28 hours with these performance characteristics. Fortunately, this is still well under the challenge timeout of ~3.5 days, and minor improvements to the challenger’s setup, such as faster hardware or software optimizations can significantly reduce this duration.\

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| --------------- | ------------- | ----------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 17,049,500,014 | 131.29 MB | 1,277,339 |
| 2Mgas | 2,000,000 | 27,803,520,661 | 129.99 MB | 1,878,936 |
| 3Mgas | 3,000,000 | 38,780,421,364 | 133.84 MB | 2,585,735 |
| 20Mgas | 20,000,000 | 210,254,748,805 | 155.70 MB | 13,078,063 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 223,456,106,163 | 154.60 MB | 13,689,567 |
| 100Mgas | 100,000,000 | 1,224,139,467,745 | 288.95 MB | 75,132,093 |

_p256Verify: Memory usage and runtime in ms given actual and estimated gas usage_

### ECAdd: Memory intensive

The ECAdd precompile shows the largest rate of memory consumption with respect to gas usage, at around 7 bytes per gas. Verifying a 20Mgas block primarily consisting of ECAdd precompiles required roughly 250MB of Cannon memory (inclusive of ~135MB of L1 block overhead), suggesting that a 100Mgas block following this pattern may use roughly 690MB of memory. This is still well below the 32bit MIPS Cannon heap limit of ~1.1GB, and will allow for up to a 2x margin of error on top of typical consumption from real-world L1 blocks.\

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| --------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 7,018,067,400 | 143.96 MB | 549,523 |
| 2Mgas | 2,000,000 | 7,614,519,602 | 150.25 MB | 584,388 |
| 3Mgas | 3,000,000 | 8,483,630,982 | 162.28 MB | 643,260 |
| 20Mgas | 20,000,000 | 15,553,134,512 | 250.38 MB | 1,241,447 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 20,895,478,233 | 317.06 MB | 1,436,023 |
| 100Mgas | 100,000,000 | 50,658,462,679 | 689.75 MB | 4,134,394 |

_ECAdd: Memory usage and runtime in ms given actual and estimated gas usage_

Instruction count, memory usage, and wall clock runtime were not materially increased by modest increases in gas consumption attributed to accelerated precompiles, storage reads/writes, contract deploys, or transfers of ETH or simple ERC-20 tokens. Other non-accelerated precompiles such as SHA256 and ECMul consumed relatively larger amounts of instructions and memory as compared to simple EVM bytecode, but not enough to pose any risks to the integrity of the fault dispute game, even at greatly increased block gas limits.

### Span batch implications

One more important finding is that Cannon’s resource usage is not only influenced by the contents of a single L2 block being validated, but also by the contents of all L2 blocks contained within the same [span batch](https://docs.optimism.io/builders/chain-operators/features/span-batches). This means that even if a single block might need to contain ~200Mgas of ECAdd precompiles in order to break Cannon, far exceeding today’s gas limit, a span batch containing 10 blocks can easily surpass this with room to spare. To mitigate this risk, we’re setting an extremely conservative span batch gas limit of 120Mgas for Base mainnet, and limiting the number of L2 blocks per batch based on the per-block gas limit.

## Looking ahead

With Base building one block every 2 second, and at a limit of 120Mgas per block, we can scale to roughly 60Mgas/sec with the current version of Cannon. This is roughly a 3x increase from where we are today, but far below our [north star goal of 1Gigagas/sec](https://warpcast.com/jessepollak/0x91e6baa0). Fortunately there are a number of workstreams in progress which will help to scale fault proofs alongside our goals.

OP Stack contributors are developing two major upgrades to Cannon which will address the memory constraints, on top of plenty of smaller improvements and optimizations: Multithreaded (MT) and 64bit Cannon. MT Cannon will introduce runtime garbage collection, preventing the memory usage from growing in an unbounded fashion. Additionally, migrating Cannon from a 32bit MIPS architecture to a 64bit architecture will allow the heap to grow by many orders of magnitude, effectively providing unlimited memory to the runtime. Multithreaded and 64bit Cannon are currently undergoing audit and should be ready to go live on testnet in the next couple months

In addition, the Base engineering team is working alongside other OP Stack Core Contributors to develop the upcoming [Holocene OP Stack hardfork](https://specs.optimism.io/protocol/holocene/overview.html). This upgrade adds [partial span batch validation](https://specs.optimism.io/protocol/holocene/derivation.html#span-batches), which reduces resource constraint by removing the need for fault proof programs to execute all L2 blocks in the batch

Now that we’ve developed a foundational set of fault proof tests, tooling, and reference data, we plan to benchmark all future changes to the OP Stack, ensuring that we can continue to safely scale Base and the broader Superchain, and bring the world onchain.

---

## Appendix

In the interest of transparency, we’ve included the raw data from each of our tests below. All tests were performed using Cannon and op-program binaries built from the [v1.9.1 op-stack release](https://github.com/ethereum-optimism/optimism/releases/tag/v1.9.1) using go 1.21.

#### ETH Transfer

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 5,623,138,719 | 111.39 MB | 381,827 |
| 2Mgas | 2,000,000 | 6,928,151,521 | 132.27 MB | 492,737 |
| 3Mgas | 3,000,000 | 6,767,001,159 | 129.62 MB | 463,468 |
| 20Mgas | 20,000,000 | 6,785,483,671 | 129.92 MB | 448,499 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 16,734,192,426 | 288.43 MB | 1,180,780 |
| 100Mgas | 100,000,000 | 8,745,359,260 | 161.04 MB | 490,610 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | -146.62% | -122.01% | -163.27% |

#### ERC20 Transfer

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 6,204,271,686 | 131.99 MB | 452,159 |
| 2Mgas | 2,000,000 | 6,310,449,198 | 131.40 MB | 413,534 |
| 3Mgas | 3,000,000 | 6,589,280,079 | 133.50 MB | 482,149 |
| 20Mgas | 20,000,000 | 11,317,368,094 | 170.07 MB | 791,432 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 9,833,075,858 | 145.90 MB | 719,191 |
| 100Mgas | 100,000,000 | 33,251,618,820 | 336.95 MB | 2,309,041 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | 13.12% | 14.21% | 9.13% |

#### Storage Writes

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 5,765,573,364 | 127.43 MB | 523,396 |
| 2Mgas | 2,000,000 | 5,779,242,866 | 127.70 MB | 564,251 |
| 3Mgas | 3,000,000 | 5,794,625,704 | 128.22 MB | 554,143 |
| 20Mgas | 20,000,000 | 6,258,738,250 | 138.29 MB | 669,946 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 6,041,285,038 | 134.86 MB | 823,986 |
| 100Mgas | 100,000,000 | 8,378,069,765 | 184.85 MB | 1,221,734 |
| **_Observed_** **_Error_** | | | | |
| 20Mgas | 20,000,000 | 3.47% | 2.48% | -22.99% |

#### Storage Reads

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 5,933,015,834 | 127.08 MB | 513,891 |
| 2Mgas | 2,000,000 | 6,290,868,310 | 129.71 MB | 540,739 |
| 3Mgas | 3,000,000 | 6,300,316,628 | 127.04 MB | 559,180 |
| 20Mgas | 20,000,000 | 9,431,852,148 | 126.98 MB | 805,725 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 9,480,440,737 | 127.57 MB | 945,538 |
| 100Mgas | 100,000,000 | 23,909,994,957 | 122.71 MB | 2,001,824 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | -0.52% | -0.47% | -17.35% |

#### Deploys of Tiny Contracts

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 5,777,467,988 | 127.69 MB | 524,860 |
| 2Mgas | 2,000,000 | 5,973,143,239 | 130.88 MB | 555,883 |
| 3Mgas | 3,000,000 | 5,998,996,944 | 131.45 MB | 536,078 |
| 20Mgas | 20,000,000 | 6,164,316,368 | 137.03 MB | 564,437 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 7,910,296,661 | 163.85 MB | 639,902 |
| 100Mgas | 100,000,000 | 7,339,598,094 | 169.39 MB | 680,956 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | -28.32% | -19.57% | -13.37% |

#### SHA256 with small inputs

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 5,983,226,628 | 128.70 MB | 473,537 |
| 2Mgas | 2,000,000 | 6,201,949,185 | 130.35 MB | 498,090 |
| 3Mgas | 3,000,000 | 6,232,516,126 | 128.73 MB | 485,517 |
| 20Mgas | 20,000,000 | 9,330,323,559 | 153.91 MB | 683,860 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 8,382,836,128 | 129.52 MB | 593,535 |
| 100Mgas | 100,000,000 | 23,472,781,822 | 262.44 MB | 1,560,676 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | 10.15% | 15.85% | 13.21% |

#### SHA256 with large inputs

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 6,031,109,395 | 130.37 MB | 476,236 |
| 2Mgas | 2,000,000 | 6,243,997,347 | 133.59 MB | 458,634 |
| 3Mgas | 3,000,000 | 6,432,598,100 | 135.40 MB | 521,362 |
| 20Mgas | 20,000,000 | 8,476,207,979 | 162.85 MB | 598,232 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 9,849,299,959 | 178.39 MB | 891,545 |
| 100Mgas | 100,000,000 | 18,491,349,238 | 295.63 MB | 1,112,098 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | -16.20% | -9.54% | -49.03% |

#### Deploys of Tiny Contracts

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 5,933,015,834 | 127.08 MB | 513,891 |
| 2Mgas | 2,000,000 | 6,290,868,310 | 129.71 MB | 540,739 |
| 3Mgas | 3,000,000 | 6,300,316,628 | 127.04 MB | 559,180 |
| 20Mgas | 20,000,000 | 9,431,852,148 | 126.98 MB | 805,725 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 9,480,440,737 | 127.57 MB | 945,538 |
| 100Mgas | 100,000,000 | 23,909,994,957 | 122.71 MB | 2,001,824 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | -0.52% | -0.47% | -17.35% |

#### RIPEMD160 with small inputs

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 5,875,453,802 | 128.06 MB | 441,286 |
| 2Mgas | 2,000,000 | 5,816,233,429 | 126.04 MB | 450,449 |
| 3Mgas | 3,000,000 | 6,104,706,376 | 129.61 MB | 459,738 |
| 20Mgas | 20,000,000 | 7,940,103,065 | 144.32 MB | 577,400 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 7,995,404,368 | 141.91 MB | 616,559 |
| 100Mgas | 100,000,000 | 16,866,767,431 | 217.19 MB | 1,143,100 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | -0.70% | 1.67% | -6.78% |

#### RIPEMD160 with large inputs

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 6,118,592,793 | 132.25 MB | 444,495 |
| 2Mgas | 2,000,000 | 6,291,711,082 | 133.95 MB | 480,941 |
| 3Mgas | 3,000,000 | 6,444,682,546 | 136.32 MB | 486,372 |
| 20Mgas | 20,000,000 | 8,167,690,035 | 156.55 MB | 567,438 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 9,219,803,251 | 170.82 MB | 847,496 |
| 100Mgas | 100,000,000 | 16,579,834,836 | 256.57 MB | 1,009,693 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | -12.88% | -9.12% | -49.35% |

#### Blake2f

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 6,898,305,181 | 128.29 MB | 511,359 |
| 2Mgas | 2,000,000 | 8,407,611,074 | 131.24 MB | 625,084 |
| 3Mgas | 3,000,000 | 9,774,154,416 | 131.31 MB | 721,918 |
| 20Mgas | 20,000,000 | 33,206,433,070 | 129.59 MB | 2,071,668 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 34,242,666,672 | 157.41 MB | 2,514,485 |
| 100Mgas | 100,000,000 | 143,678,859,859 | 127.70 MB | 8,544,731 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | -3.12% | -21.47% | -21.37% |

#### ECAdd

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 7,018,067,400 | 143.96 MB | 549,523 |
| 2Mgas | 2,000,000 | 7,614,519,602 | 150.25 MB | 584,388 |
| 3Mgas | 3,000,000 | 8,483,630,982 | 162.28 MB | 643,260 |
| 20Mgas | 20,000,000 | 15,553,134,512 | 250.38 MB | 1,241,447 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 20,895,478,233 | 317.06 MB | 1,436,023 |
| 100Mgas | 100,000,000 | 50,658,462,679 | 689.75 MB | 4,134,394 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | -34.35% | -26.63% | -15.67% |

#### ECMul

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 5,895,614,790 | 129.00 MB | 498,306 |
| 2Mgas | 2,000,000 | 6,205,261,740 | 133.21 MB | 501,669 |
| 3Mgas | 3,000,000 | 6,342,304,197 | 135.02 MB | 551,448 |
| 20Mgas | 20,000,000 | 8,229,871,844 | 156.94 MB | 971,344 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 10,167,931,572 | 186.60 MB | 995,419 |
| 100Mgas | 100,000,000 | 17,566,030,097 | 267.25 MB | 2,991,045 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | -23.55% | -18.89% | -2.48% |

#### ECPairing (accelerated by op-program)

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 5,776,645,362 | 127.56 MB | 516,213 |
| 2Mgas | 2,000,000 | 5,963,589,034 | 130.47 MB | 527,470 |
| 3Mgas | 3,000,000 | 5,828,919,975 | 128.34 MB | 511,751 |
| 20Mgas | 20,000,000 | 6,271,050,229 | 135.16 MB | 530,233 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 6,326,856,307 | 135.87 MB | 478,320 |
| 100Mgas | 100,000,000 | 8,116,374,114 | 163.48 MB | 580,276 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | -0.89% | -0.53% | 9.79% |

#### P256Verify

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ----------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 17,049,500,014 | 131.29 MB | 1,277,339 |
| 2Mgas | 2,000,000 | 27,803,520,661 | 129.99 MB | 1,878,936 |
| 3Mgas | 3,000,000 | 38,780,421,364 | 133.84 MB | 2,585,735 |
| 20Mgas | 20,000,000 | 210,254,748,805 | 155.70 MB | 13,078,063 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 223,456,106,163 | 154.60 MB | 13,689,567 |
| 100Mgas | 120,000,000 | 1,224,139,467,745 | 288.95 MB | 75,132,093 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | -6.28% | 0.71% | -4.68% |

#### Identity

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 5,948,955,650 | 132.48 MB | 440,868 |
| 2Mgas | 2,000,000 | 6,071,516,330 | 137.65 MB | 433,790 |
| 3Mgas | 3,000,000 | 6,170,595,841 | 140.73 MB | 441,160 |
| 20Mgas | 20,000,000 | 7,199,877,925 | 171.29 MB | 504,847 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 8,058,450,993 | 211.24 MB | 441,234 |
| 100Mgas | 100,000,000 | 12,286,011,877 | 325.56 MB | 796,554 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | -11.92% | -23.32% | 12.60% |

#### Modexp

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime (ms)** |
| -------------------- | ------------- | ---------------- | ---------------- | ---------------- |
| **_Samples_** | | | | |
| 1Mgas | 1,000,000 | 5,977,197,865 | 131.11 MB | 413,460 |
| 2Mgas | 2,000,000 | 6,022,014,219 | 132.55 MB | 420,963 |
| 3Mgas | 3,000,000 | 5,892,528,187 | 130.86 MB | 411,115 |
| 20Mgas | 20,000,000 | 6,494,391,967 | 150.27 MB | 496,198 |
| **_Estimates_** | | | | |
| 20Mgas | 20,000,000 | 5,201,886,322 | 129.22 MB | 394,074 |
| 100Mgas | 100,000,000 | 8,797,267,453 | 232.79 MB | 851,951 |
| **_Observed Error_** | | | | |
| 20Mgas | 20,000,000 | 19.90% | 14.01% | 20.58% |
