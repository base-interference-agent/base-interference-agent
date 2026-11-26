# blog/bases-security-first-approach

Source: https://www.base.org/blog/bases-security-first-approach.md

# Base’s Security-First Approach

> Base’s goal is to bring the next million developers and billion users onchain. Security is an essential part of this vision. We want to share how we’ve approached security on Base…

- Date: 2023-06-29
- Author: Base
- URL: https://www.base.org/blog/bases-security-first-approach

[Base’s](https://www.coinbase.com/blog/introducing-base) goal is to bring the next million developers and billion users onchain. Security is an essential part of this vision. We want to share how we’ve approached security on Base to date, how we’re preparing for a secure mainnet launch with internal and external security audits, and how we draw on Coinbase’s best practices in onchain security.

## Secured by the open-source OP Stack

Base is built on the [OP Stack](https://stack.optimism.io/), in collaboration with Optimism. This means that out of the gate, we are building on [an incredible amount of security work](https://blog.oplabs.co/bedrock-security/) done by the OP Labs team and the broader Optimism community, including multiple audits from both dedicated firms and community contests.

To further battle-test the OP Stack’s security, Coinbase commissioned an internal audit from its Protocol Security team. Coinbase’s Protocol Security team is a dedicated group who work closely with onchain developers at the company to secure any new products or services that we build, including smart contract auditing and novel blockchain reviews.

Over the last 6 months, the Protocol Security team has worked closely with OP Labs to enhance the security of Base and Optimism, including:

- Auditing all Optimism pre-deploys and contracts on both L1 and L2 to identify vulnerabilities and risks in the technology stack.
- Using [fuzzing](https://owasp.org/www-community/Fuzzing) methods for critical components like the L2 bridge and the sequencer.
- Developing operational runbooks for various risk scenarios and certain distress events.
- Reviewing and auditing the key management setup and contracts for Base. Considerable care has been taken to evaluate each role and determine the correct key management configuration, ensuring that appropriate consensus is in place for use of keys and sufficient disaster recovery plans are in place.

Completing these in-depth security workstreams without discovering critical severity bugs gave the Base team confidence to proceed towards mainnet launch.

## Broadening the audit to external wardens

We know that good security takes a village – the more eyes we can get on a codebase, the better. To prepare Base for mainnet, we engaged the wider community through a public smart contract audit contest via [Code4rena](https://code4rena.com/contests/2023-05-base) to find and report bugs in any part of the OP Stack. This included the OP node software, EVM equivalence vulnerabilities, bridge vulnerabilities, and generic smart contract issues. Alongside this live audit, the Coinbase’s Protocol Security team thoroughly reviewed findings and mitigations from past audit programs ([spearbit](https://spearbit.com/) and [sherlock](https://www.sherlock.xyz/)).

We engaged over 100 security researchers as part of this contest, and are happy to report there were no significant vulnerabilities discovered. We are actively working to resolve all submissions as the engagement from researchers was high, and are currently in the process of ensuring appropriate action for any informative or minor issues that were reported.

## Empowering the ecosystem

Beyond just securing the core OP Stack codebase, we are focused on enhancing the security of the Ethereum ecosystem as a whole. To bolster the security of Base and support other teams running chains built on the OP Stack, we are developing an [open source monitoring tool](https://github.com/base-org/pessimism/tree/master), Pessimism, to provide prompt notification of anomalies in the protocol and network, such as account balance irregularities, contract events, or disparities between L1 and L2 states. This new monitoring tool will stand up alongside existing OP Labs monitoring tools (i.e. [_Fault-Detector_](https://github.com/ethereum-optimism/optimism/tree/develop/packages/fault-detector)), Coinbase in-house blockchain monitoring capabilities, and third-party tools for identifying malicious and out of pattern events. Look out for more details on our monitoring tool in the coming months.

In addition, we are developing tools to let builders increase their confidence in the security of the smart contracts they deploy, including developing a smart contract security scanning tool to help developers reduce the chances of writing a security vulnerability on their contracts. Developers can use this tool to quickly and easily scan their contracts and get results from multiple open source vulnerability detection tools, including Coinbase’s own [proprietary secure trait analyzer](https://patents.justia.com/patent/11544045). You can learn more about this work in our recent Coinbase [blog post](https://www.coinbase.com/blog/how-coinbase-protects-users-from-risky-assets).

## Launching mainnet with a security-first mindset

Base has been developed with a security-first mindset, combining Coinbase’s security best practices with the decentralized security rigor of an open-source codebase. Part of this is starting from the assumption that bad things may happen and that attacks will get increasingly more sophisticated. In that vein, we've held simulated exercises to test and enhance our response capabilities and the overall resilience of Base in the event of a large-scale incident.

Our goal with all our security work is to see around corners and blunt the effectiveness of these attacks. We’re proud of the work we’ve done to secure Base and while even the best controls will sometimes fail, we will always learn and do better.

We can’t wait to bring Base to mainnet soon, continuing to build with uncompromising standards of security to ensure that developers can come onchain with confidence.
