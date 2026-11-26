# blog/base-mainnet-sep-5th-incident-postmortem

Source: https://www.base.org/blog/base-mainnet-sep-5th-incident-postmortem.md

# Base Mainnet Sep 5th Incident Postmortem

> TL;DR. The Base mainnet network briefly stalled on September 5, 2023 (incident). We’re sharing this postmortem as part of our commitment to building Base in a decentralized, open…

- Date: 2023-09-15
- Author: Base
- URL: https://www.base.org/blog/base-mainnet-sep-5th-incident-postmortem

**TL;DR.** _The Base mainnet network briefly stalled on September 5, 2023 (_[_incident_](https://status.base.org/incidents/n3q0q4z24b7h)_). We’re sharing this postmortem as part of our commitment to building Base in a decentralized, open source manner and with an eye towards continually improving the reliability and resiliency of the Base network._

## Root cause

At approximately 2:25 pm PT, the Base mainnet network stopped producing blocks for 29 minutes. This was due to dependence on a set of L1 nodes that all exhausted their disk space at 2:15 pm, causing the L1 nodes to become unavailable to the sequencer.

Each new L2 block contains a reference to an L1 block called the “L1 origin.” The sequencer will periodically refresh the latest L1 block to ensure the L2 blocks are referencing recent L1 blocks, and will not produce any new L2 blocks if the L1 origin block is older than a threshold called the max sequencer drift (currently configured to 10 minutes on both mainnet and goerli).

![](https://www.base.org/images/blog/base-mainnet-sep-5th-incident-postmortem/01.webp)

## Mitigation

The primary mitigation strategy was to point our sequencer and verifier nodes at alternate L1 nodes. We first worked on the sequencer, replacing the L1 URL with a working RPC, restarting op-node, and resuming sequencing blocks. We also had to restart posting batches and proposing state roots to the L1. Next we focused on getting our verifier nodes healthy, including some nodes that are responsible for gossiping new L2 blocks to the network and the nodes that serve our public RPC endpoint: [mainnet.base.org](https://mainnet.base.org).

## Forward work

To prevent this failure mode in the future, we are building resilience against L1 RPC failures. One particular inflight improvement is a proxy layer that will ensure that healthy L1 nodes are available to the L2 at all times, including redundancy across multiple L1 node providers.

While the sequencer currently isn’t an absolute requirement for interaction with Base (users can include transactions in the L2 using the [L1 messenger contracts](https://community.optimism.io/docs/developers/bridge/messaging/)), we recognize that the user experience is severely degraded when block building has stalled. This is why we are [committed to decentralization](https://base.mirror.xyz/aBwt4flT1WAKJGQTj2AXBpH_8Qd3umQ-ZECLAJoO_nE) via the Superchain. One advantage this brings is the possibility of permissionless sequencing modes via  [modular sequencing](https://stack.optimism.io/docs/understand/explainer/#configurable-sequencer-per-op-chain), which would allow block building to be decentralized, removing the sequencer as a single-point-of-failures in the network.

We’ll continue to increase the resilience and decentralization of the Base network over the coming months and years.
