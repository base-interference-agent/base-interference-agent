# blog/embracing-optimism-with-pessimism

Source: https://www.base.org/blog/embracing-optimism-with-pessimism.md

# Embracing Optimism with Pessimism

> TL;DR.* We’ve built Pessimism, an open source monitoring system designed to enhance the security of Base (as well as the broader OP Stack and Ethereum ecosystems) by quickly…

- Date: 2023-09-19
- Author: Base
- URL: https://www.base.org/blog/embracing-optimism-with-pessimism

**_We skipped Nihilism_**

**_TL;DR._**\* We’ve built Pessimism, an open source monitoring system designed to enhance the security of Base (as well as the broader OP Stack and Ethereum ecosystems) by quickly detecting and responding to a myriad of protocol threats.\*

## **Introduction**

As we worked to launch Base, we chose to create an open and permissionless network that would allow creative projects of all kinds to come to life. At the same time, given this open nature, we wanted to ensure we have the best in-house monitoring capabilities to swiftly detect and respond to live protocol threats.

Enter [Pessimism](https://github.com/base-org/pessimism) — a monitoring system crafted to help support the security of all [OP Stack](https://stack.optimism.io/) and EVM-compatible chains. The Coinbase team has been running Pessimism internally to oversee and monitor Base mainnet 24/7 since launch. Now, in the spirit of contributing to public goods, we are open-sourcing Pessimism under an MIT license as free and permissionless software.

### **What is monitoring and why does it matter?**

Monitoring involves the collection, analysis, and interpretation of data to ensure that everything is functioning as expected. This is important for time-sensitive incident response as well as the overall security of a blockchain, as we can only take action against a threat once we become aware of it.

Monitoring is crucial on Base for the following reasons:

1. **Performance Evaluation:** We can assess the network’s performance by monitoring response times, throughput (how fast transactions are processed), and error rates. Because of this, we can take action in the event of a potential malfunction.  Examples of performance data analyzed include the block production rate, the frequency of state updates to L1, and message passing between L2 and L1.
2. **Security:** We can identify and mitigate security threats and vulnerabilities, detecting unauthorized access attempts, unusual behavior, and potential breaches.

## **How Pessimism detects threats**

Pessimism can detect protocol threats specific to the OP Stack (_Withdrawal Enforcement, Fault Detection_) as well as general EVM blockchain events _(Balance Enforcement, Event Emission)_. This lets us detect unauthorized or malicious events on the Base native bridge as well as the L1/L2 system contracts on Base. Additionally, we can capture liveness failures for sensitive protocol roles like the proposer.

Currently, Pessimism supports monitoring for the following use cases:

- **(OP Stack) Ensuring user withdrawal safety:** Many critical exploits happen on bridges, which is why it’s critical to monitor withdrawal events. Pessimism’s withdrawal-enforcement heuristic determines whether a proven OP Stack bridge withdrawal on L1 has a corresponding initiation event on the L2 chain. This is essential for ensuring that all native bridge withdrawals undergo proper two-step accreditation for L2→L1 withdrawals. If not, it could be an indication of a potential exploit.
- **(OP Stack) Detecting potential faults:** The fault-detector heuristic ensures that all proposer submitted output roots from L2→L1 (hashed transactions showing activity from L2 to L1) are valid. To do this, Pessimism actually [recreates](https://github.com/base-org/pessimism/blob/840073f8193fd23fd6ef88e875709212a0a0947f/internal/engine/registry/fault_detector.go#L116-L175) an output root locally to cross validate it for equivalence with the one submitted to the L2OutputOracle contract. This is crucial for ensuring integrity of the [L2Proposer](https://github.com/ethereum-optimism/optimism/blob/develop/specs/proposals.md) and the output roots that are submitted. If a forged output root could ever be generated, an attacker could drain all funds from the L1 portal contract. \*
- **(EVM) Enforcing balance boundaries for accounts:** The balance-enforcement heuristic ensures that an address’s native ETH amount always falls above or below some user defined thresholds. This is critical for monitoring privileged protocol accounts (e.g. proposer, batcher) on OP Stack chains for potential out-of-funds liveness failures. \*
- **(EVM) Detecting smart contract events:** The contract-event heuristic monitors for emitted smart contract events. It requires a smart contract address and a set of event signatures to run. This is critical for catching potential access management changes (e.g threshold update for a gnosis safe multisig) and malicious superuser operations (e.g. an OP Stack Guardian pausing the native bridge unexpectedly).

The most up-to-date information about the heuristics that Pessimism supports can be found in the project’s [documentation](https://base-org.github.io/pessimism/heuristics).

![](https://www.base.org/images/blog/embracing-optimism-with-pessimism/01.webp)

Pessimism consists of three primary subsystems that monitor, assess, and alert:

- **ETL:** The ETL (extract, transform, load) subsystem is responsible for parsing and transforming real-time blockchain data (e.g. blocks, events, account balances) into application-consumable formats.
- **Risk Engine:** The risk engine is where heuristics are actively assessed for alerts using data from the ETL.
- **Alerting:** The alerting subsystem is responsible for propagating alerts to downstream dependency systems (i.e. Slack, Pagerduty).

Pessimism also has a [REST API](https://base-org.github.io/pessimism/api) that will allow for the creation, deletion, and modification of monitoring heuristics. As of now, only heuristic creation requests are supported. We expect to roll out support for deletion and modification in the near future.

When an abnormal activity or event perceived as a security threat is detected, Pessimism alerts the team to swiftly address any potential risks.

## **Performance**

Currently, our [metrics](https://github.com/base-org/pessimism/blob/master/docs/telemetry.markdown) are reporting that Pessimism performs ETL processing in less than 100 ms, with the average invariant execution taking less than 15 ms, for end-to-end processing within 200 ms.

One of the greatest parts of the OP Stack is its modularized design; modularity being the organization of a system into separate, self-contained modules that can be developed and operated independently while interacting with each other. Due to this modularity, we’ve been able to seamlessly test every heuristic implementation [end-to-end](https://github.com/base-org/pessimism/tree/master/e2e) utilizing the [op-e2e](https://github.com/ethereum-optimism/optimism/tree/d74dfb83abbb9536644f68fe180380ec02e02425/op-e2e) testing framework. This allows us to build confidence in each heuristic, since failure cases are reproduced and captured using a localized instance of an OP Stack chain. Additionally, we’ve taken great diligence in unit testing the software.

Going forward, we plan to run coverage audits with third-party data providers to ensure our heuristics are appropriately capturing all events.

### **Alert Routing**

Pessimism supports alert routing, which enables teams to define global alerting policies that specify alerting destinations by severity. We currently support Slack and PagerDuty as alerting destinations, with plans to add additional integrations as needed. More information about global alert policies can be found [here](https://base-org.github.io/pessimism/alert-routing).

## **What’s next for Pessimism?**

### **Comprehensive Bridge Coverage**

The native bridge is a critical piece of technology within the OP Stack that allows users to transfer funds from L2 to Ethereum. Given that this is where the highest TVL lives, it's absolutely critical to ensure that we’re monitoring all failure cases and threat scenarios that can affect its secure operation. We’ll be dedicating the next months to implement [supply monitoring](https://github.com/base-org/pessimism/issues/148) as well as large withdrawal detections within Pessimism.

### **Emerging Threat Detections**

The OP Stack will continue to undergo upgrades (e.g. fraud proofs, shared sequencing), and we will continue to introduce new features and heuristics to Pessimism to ensure adequate coverage of the evolving protocol threat landscape.

### **You Decide**

Pessimism is a community-driven technology, and we welcome all users to file feature requests via [GitHub issues](https://github.com/base-org/pessimism/issues) within the repository. Additionally, if you’d like to start working on Pessimism, we have a lot of [good first issues](https://github.com/base-org/pessimism/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) that could use your help and attention!
