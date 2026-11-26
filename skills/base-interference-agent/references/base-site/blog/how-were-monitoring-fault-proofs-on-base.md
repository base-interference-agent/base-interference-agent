# blog/how-were-monitoring-fault-proofs-on-base

Source: https://www.base.org/blog/how-were-monitoring-fault-proofs-on-base.md

# How We’re Monitoring Fault Proofs on Base

> This post explores how we monitor fault proofs on Base, showcasing the framework and monitoring solutions we've developed in Hexagate to secure the system. Additionally, we share…

- Date: 2025-02-04
- Author: Tom
- URL: https://www.base.org/blog/how-were-monitoring-fault-proofs-on-base

**Decentralization isn’t just a goal—it’s a commitment to creating systems that are secure, transparent, and resilient by design.** The recent launch of [fault proofs on Base Mainnet](https://base.mirror.xyz/eOsedW4tm8MU5OhdGK107A9wsn-aU7MAb8f3edgX5Tk) represents a significant milestone in advancing our network’s decentralization. Fault proofs serve as a critical safeguard, validating state claims and ensuring the integrity of the system.

Guided by a security-first approach, our fault proof system was subjected to rigorous audits, extensive resiliency testing, and thorough validation to ensure a robust and reliable foundation. Securing this launch required more than just engineering the system; it involved building a resilient framework that upholds stability and fosters trust across the ecosystem.

Recognizing that security does not end at deployment, we developed a comprehensive monitoring framework to further protect the system. Designed to address potential risks across multiple levels—from overarching system operations to individual dispute games and components—this framework leverages Hexagate’s monitoring capabilities to enable precise, real-time threat detection and proactive mitigation.

To promote transparency and collaboration within the ecosystem, we have [open-sourced our fault proof invariant monitors](https://github.com/base-org/fault-proof-monitors), empowering the broader community to adopt and enhance these tools. By sharing these resources, we aim to collectively strengthen the security of layer 2s working to further decentralize their systems. In this blog, we’ll highlight how our monitoring framework secures the fault proof system on Base, covering system-wide operations, dispute games, and key components.

_Note: This blog is written assuming a general understanding of fault proofs and how optimistic rollups operate. If you need to brush up on fault proofs, please read_ [_Optimism’s explainer_](https://docs.optimism.io/stack/fault-proofs/explainer)_._

## Fault Proof Monitoring Framework

Our monitoring framework is built to identify potential threats at various system layers. This structured approach categorizes alerts into system-wide, dispute game-specific, challenger-specific, and component-level tiers, allowing us to accurately assess and respond based on alert severity. This layered strategy ensures that critical issues are escalated swiftly, while more localized component issues are monitored for potential systemic impacts.

- **System:** The system layer covers all fault proof smart contracts and core operations. Issues here could threaten the entire system, posing a risk to Base's overall stability and security.
- **Dispute Games:** The process for validating individual state claims. Issues within the dispute games can escalate to systemic issues affecting trust in the fault proof system.
- **Challenger:** The role ensuring state claim validity. Risks involve potential loss of challenger funds, and failures here can undermine the system’s reliability and allow incorrect dispute game resolutions.
- **Components:** The technical modules underpinning fault proofs, such as the dispute game bond holder. Failures can escalate from isolated issues to major disruptions, threatening overall system integrity.

## Monitors Supporting Framework

Designing monitors to support the framework posed a few challenges. First, implementing complex invariants demanded a deep understanding of fault proof mechanisms. Second, a dispute game system required deploying and managing a monitor for each individual game. Finally, effectively handling monitors after dispute resolutions was crucial to preventing system overload.

We can now go in-depth into each tier to understand how the fault proof monitors help us identify specific threats:

#### **_System Monitors_**

- **Purpose**: Safeguard the fault proof system’s operations and management by tracking critical functions and events within smart contracts.
- **Key Focus**: Monitoring essential processes for the fault proof system—including tracking system-wide function calls and contract events to identify potential failures in real time.
- **Significance**: Provides observability and insight into core system operations.

#### **_Dispute Game Monitors_**

- **Purpose**: Verify the integrity of each individual dispute game by validating moves and subgame resolutions.
- **Key Focus**: Observing the flow of each dispute game, including timing, event sequences, and expected/unexpected behaviors.
- **Significance**: Detects potential anomalies in dispute game flows.

#### **_Challenger Monitors_**

- **Purpose**: Verify that challengers act according to protocol by tracking participation against valid and invalid state claims.
- **Key Focus**: Tracking challenger actions such as challenge issuance, bond management, and balance changes.
- **Significance**: Validates fair dispute resolution, identifies invalid claims, and supports stable network operations.

#### **_Component Monitors_**

- **Purpose**: Monitor the integrity of the technical modules within the fault proof system, such as bond calculations and withdrawals.
- **Key Focus**: Monitoring the functionality of key components beyond the main dispute game logic to identify potential issues before they escalate into systemic failures.
- **Significance**: Evaluates specific components for unexpected outcomes.

## Building Monitors in Hexagate

We built monitors using [Hexagate](https://www.hexagate.com/), leveraging its platform interface to set up function call, contract event, balance change, and custom invariant monitors. To monitor individual dispute games, we developed an automated workflow using Hexagate’s webhook alert delivery and monitoring management API. This setup allows us to deploy monitors dynamically for each new dispute game as it is created, ensuring comprehensive and scalable coverage.

---

### Let’s build a more secure, decentralized future together

Monitoring fault proofs is just one part of our broader commitment to securing Base and the OP stack ecosystem. By open-sourcing our monitors, we aim to strengthen fault proof security and support decentralization efforts across L2 networks.

If you’re interested in working on advanced onchain security challenges, explore our open roles [here](https://www.base.org/jobs). You can also follow us [X](https://x.com/base) ([Base team](https://x.com/i/lists/1876354838289932418) and [Base community leaders](https://x.com/i/lists/1869425408573075694)), [Farcaster](https://warpcast.com/base/), and [Discord](https://discord.com/invite/buildonbase?utm_source=dotorg&utm_medium=nav) to stay up-to-date with the latest on Base.
