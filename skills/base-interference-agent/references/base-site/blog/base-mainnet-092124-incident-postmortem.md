# blog/base-mainnet-092124-incident-postmortem

Source: https://www.base.org/blog/base-mainnet-092124-incident-postmortem.md

# Base Mainnet 09/21/24 Incident Postmortem

> Lessons learned from Base’s recent block building outage

- Date: 2024-09-27
- Author: Base
- URL: https://www.base.org/blog/base-mainnet-092124-incident-postmortem

**_Lessons learned from Base’s recent block building outage_**

Base is committed to building in the open, including public retrospectives to share learnings when issues arise.

On 09/21/2024 at 15:14 UTC, Base Mainnet experienced a 17 minute block building outage. The integrity of the chain was not affected, all funds on Base were safe, and block production resumed after we mitigated the incident. This retrospective dives into the root cause, the impact, how we mitigated, and what we plan to improve moving forward.

The root cause of the block building outage was a misconfiguration on our sequencer cluster. When the current block producer became unhealthy, it was unable to successfully start block building on another instance. The incident was mitigated by manually starting block production on a correctly configured instance.

![Graph displaying the stall in the progression of the chain, which is measured by unsafe head block number](https://www.base.org/images/blog/base-mainnet-092124-incident-postmortem/01.webp 'Graph displaying the stall in the progression of the chain, which is measured by unsafe head block number')

## **Impact**

**Block Production**

No blocks were produced for 17 minutes, beginning at 15:14 UTC. Blocks [20071146](https://basescan.org/block/20071146) to [20071691](https://basescan.org/block/20071691) contain no user transactions, as they were created by the protocol after sequencing resumed.

**Transaction Processing**

Transactions are submitted to Base through the \`eth_sendRawTransaction\` RPC call, which places them in the mempool. During the incident, the mempool instances continued to function correctly. However, fewer transactions were submitted in that time frame, which can be seen in the graph below.

There was an immediate drop in both successful and failed \`eth_sendRawTransaction\` requests after the outage started, followed by a slow rise in failed requests. Our current hypothesis is that less transactions were submitted because applications were impaired by the halt in block production.

![Graph of RPC request status for eth_sendRawTransaction calls to our routing services](https://www.base.org/images/blog/base-mainnet-092124-incident-postmortem/02.webp 'Graph of RPC request status for eth_sendRawTransaction calls to our routing services')

Once block production resumed, many of the transactions that were submitted during the incident were included in the blocks immediately following 20071691.

## Root Cause

**Background**

Over the past year, Base has designed and built [op-conductor](https://github.com/ethereum-optimism/optimism/tree/develop/op-conductor#readme) to improve the reliability of block production. Our goal with building op-conductor is to increase the overall availability of the system, with a target of achieving 99.99% availability. Prior to op-conductor, any failure of the sequencer would result in an outage. op-conductor enables us to operate multiple sequencers and upon a failure start block production on a healthy instance.

![Diagram of before and after migrating to the op-conductor enabled sequencer cluster](https://www.base.org/images/blog/base-mainnet-092124-incident-postmortem/03.webp 'Diagram of before and after migrating to the op-conductor enabled sequencer cluster')

On 9/20/2024, we migrated block production from the single sequencer to the op-conductor cluster. However the op-conductor instances were in a misconfigured state, where op-node was not submitting new unsafe block payloads to op-conductor.

**Trigger**

On 9/21/2024 at 15:14 UTC, the currently active sequencer experienced delays in block production. op-conductor correctly detected the issue and began the process to transfer leadership to another instance. As part of the leadership transfer, op-conductor stopped the local op-node from building blocks.

Due to the misconfiguration, the new block producer was unable to start production as the start operation requires the unsafe payload from op-conductor, which the previous leader did not write. This caused the cluster to enter a state in which no instance was able to become an active block producer.

Below is a log snippet containing one sample of a failed leadership transfer:

![](https://www.base.org/images/blog/base-mainnet-092124-incident-postmortem/04.webp)

**Mitigation**

The incident was mitigated by reverting to the single sequencer topology while the op-conductor cluster configuration was fixed.

## What we’re fixing going forward

- We [implemented](https://github.com/ethereum-optimism/optimism/pull/12047) a bidirectional handshake between op-node and op-conductor at startup to ensure proper communication configuration.
- Improve our internal configuration management process to prevent and detect misconfigurations.
