# blog/achieving-more-blob-space-in-2025

Source: https://www.base.org/blog/achieving-more-blob-space-in-2025.md

# blob/acc: Achieving more blob space in 2025

> To support a global onchain economy and ensure Ethereum’s success, Base believes it’s crucial to ship the Fusaka hardfork in Q3 2025 by aligning on the following plan:

- Date: 2025-02-27
- Author: Francis Li
- URL: https://www.base.org/blog/achieving-more-blob-space-in-2025

**TLDR:**

To support a global onchain economy and ensure Ethereum’s success, Base believes it’s crucial to ship the **Fusaka hardfork** in **Q3 2025** by aligning on the following plan:

1. Lock current Fusaka scope to only include [PeerDAS](https://ethresear.ch/t/peerdas-a-simpler-das-approach-using-battle-tested-p2p-components/16541) and EOF
2. Ship Fusaka as soon as PeerDAS is ready (ideally early Q3 2025), with as high blob number as testing allows
3. Ship Fusaka with built-in blob increase mechanism support, allowing future blob increases with minimal effort
4. Formalize [hardware](https://hackmd.io/G3MvgV2_RpKxbufsZO8VVg?view) / [bandwidth](https://hackmd.io/DsDcxDAVShSSLLwHWdfynQ?view) requirements to provide clarify for further scaling
5. Analyze the post-Fusaka mainnet network and increase the blob count further once network conditions allow. Aiming for ~50 blobs by EOY to achieve another 10X scaling this year

## Why blobs matter

Ethereum is poised for significant growth, with the potential to one day serve a vast global user base seeking a freer, more open economy. Right now, [blob usage](https://dune.com/hildobby/blobs) has been saturated for several months, resulting in higher fees for users and constrained ecosystem growth. Even though Pectra increase will offer some relief, the expected increase in blob count won’t be enough to handle explosive growth as more rollups come online. Base, for instance, is already aiming to scale to [250 Mgas/s by the end of the year](https://www.base.org/blog/scaling-base-in-2025) (10x from our current throughput), highlighting the intense demand to deliver a truly global onchain economy. \

We believe the time we are in now is akin to  the early days of the internet: success wasn’t about monetizing limited bandwidth, but rather expanding capacity so everyone could benefit from a new wave of innovation. That same ethos—growing the “pie” instead of making it more expensive—applies to Ethereum now, where the focus should be on long-term infrastructure, developer tooling, and user experience, rather than price discovery of network usage. There is urgency in ensuring we don’t bottleneck the ecosystem’s growth; if we succeed in boosting data availability, we can keep transaction costs low, empower more onchain applications, and onboard the next wave of users.

## How do we get there

We propose finalizing EOF and PeerDAS for a mid-year release with a moderate initial blob target (24), then iterating and scaling up through streamlined upgrades.\

**Fusaka Scope**: we propose limiting Fusaka to PeerDAS and EOF, deferring any additional EIPs to the following hardfork.

1. EOF is already implemented, tested, and has a [stable live multi-client devnet](https://eof-devnet-0.ethpandaops.io/) running, the remaining changes are slated to be [finalized](https://notes.ethereum.org/@ipsilon/eof-testnets-plan) around April (Pectra activation time). And as proposed by Danno in [EL ACDE #205](https://www.youtube.com/live/N90-qDkUPAo?si=2PqPQm-5u_gvBtmY&t=3578), EOF can be shipped as-is as soon as PeerDAS is ready to be shipped
2. PeerDAS has been in development since mid-last year, the specifications are near stable, with [one more optimization](https://github.com/ethereum/EIPs/pull/9378) to be finalized soon. Even though there is still a decent amount of work needed to ship, we believe it could be drastically accelerated if given client teams’ full attention from now on.

This plan maximizes our chances of delivering Fusaka by mid-year—provided we lock the scope now and dedicate our efforts to these two features.\

**When to ship**: given the rapidly growing needs of rollups, we propose launching Fusaka as soon as PeerDAS is ready, starting with a 24-blob target per block (or as high as testing supports).

Currently, the estimated maximum throughput for 1D PeerDAS is [around 50 blobs target per block](https://x.com/adietrichs/status/1880392818470056192). However, we acknowledge that PeerDAS introduces a completely new networking paradigm that it would be unlikely to launch immediately at the highest theoretical throughput. Instead, we propose shipping as soon as possible with a more modest throughput—around 24 blobs per block (or as high as testing supports)—and then iterating from there. This approach helps us realize the benefits of 1D PeerDAS quickly while refining and scaling over time. We believe 24 blobs per block is a sensible starting point given that PeerDAS requires the weakest nodes to use [roughly 8x less bandwidth](https://x.com/fradamt/status/1880389727041515981) than before, aligning with current bandwidth levels (3 blobs per block).\

**Blob increase mechanism support**: if Fusaka doesn’t launch at the theoretical maximum of around 50 blobs per block, we’ll need a way to raise the blob target as demand grows without waiting for the typical once-a-year hardfork. Several approaches to achieve this flexibility are currently under discussion.

1. Multisig contract controlled by core devs and upgrade via a config upgrade
2. Onchain voting mechanism like validator voted gas limit
3. [BPO (blob parameter only) forks](https://ethereum-magicians.org/t/blob-parameter-only-bpo-forks/22623) proposed by Optimism
4. [Mark (ethDreamer)](https://x.com/EthDreamer) from Lighthouse proposed a slight modification to BPO hardfork that instead of retrieving blob target number by fork id, we instead tie it with epoch number.\

We believe that #4 would be the best option, as it avoids the larger changes needed for solution #1 and #2, and also avoids requiring clients to set up with cumbersome standard hard fork boilerplate code. It still functions like a hard fork in that all validators will be required to upgrade their software, but it creates a minimum amount of burden on both the client devs and the operators.\

**Formalizing** [**hardware**](https://hackmd.io/G3MvgV2_RpKxbufsZO8VVg?view) **/** [**bandwidth**](https://hackmd.io/DsDcxDAVShSSLLwHWdfynQ?view) **requirements** is vital to maintaining Ethereum’s decentralization while minimizing operational challenges. Clear minimum standards empower researchers and developers to design, optimize, and test new protocols with confidence, knowing they will remain accessible to a wide range of participants. We believe the proposed solutions strike the right balance between decentralization and scalability.\

**~50 blobs target by EOY**: we propose continuously analyzing mainnet performance after the Fusaka release, identifying bottlenecks, and refining design and client implementations with the goal of reaching a 50-blob target by the end of 2025.

## Calling for contributors

At Base, we believe scaling Ethereum to billions of users is a collective endeavor—one that’s already seeing major strides forward. We’re teaming up with partners like Optimism (OP), Sunnyside Labs, and others to contribute to PeerDAS development that includes but not limited to

1. PeerDAS research (Fusaka spec completion)
2. Consensus Layer Client implementations
3. Network simulation & analysis
4. Proposed [BPO](https://ethereum-magicians.org/t/blob-parameter-only-bpo-forks/22623) (blob parameter only) hard fork to achieve faster blob increase cadence

\
Of course, we can’t do this alone. We’ve created a [public dashboard](https://github.com/orgs/ethereum-optimism/projects/121/views/1) along with [core dev’s PeerDAS readiness checklist](https://github.com/ethereum/pm/blob/master/Fusaka/peerdas-readiness.md) that helps track everything needed to accelerate PeerDAS. We’re extending an open invitation to the entire community. L2s, developers, researchers — your ideas, skills, and enthusiasm could play a critical role in making Fusaka upgrade a reality. We look forward to collaborating with anyone who shares our vision for a more scalable, inclusive, and open onchain world!
