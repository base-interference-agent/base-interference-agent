# blog/open-sourcing-bases-contracts-and-frontend

Source: https://www.base.org/blog/open-sourcing-bases-contracts-and-frontend.md

# Open Sourcing Base’s Contracts and Frontend

> One of Base’s core values is building in the open. We believe this is foundational to building an onchain ecosystem because it creates accountability and enables collaboration.

- Date: 2023-10-19
- Author: Base
- URL: https://www.base.org/blog/open-sourcing-bases-contracts-and-frontend

**Why We’re Building in the Open**

One of Base’s core values is building in the open. We believe this is foundational to building an onchain ecosystem because it creates accountability and enables collaboration.

By sharing our work openly, we enable the community to track our progress and ensure that we're living up to our commitments. This transparency also serves as a catalyst for collaboration, as it allows developers to tap into our knowledge base, building upon and refining what's already in place. Further, it provides a channel for valuable community feedback, whether it's about improving documentation or spotting an overlooked bug.

In this spirit, today we’re excited to share that we’ve open sourced our smart contract and web GitHub repositories.

**Increasing Transparency with our Smart Contract Repos**

We’ve open sourced our smart contract repos to provide developers with increased transparency around Base’s contract development, deployment, and upgrade process.

All contracts and scripts for Base are publicly available on [GitHub](https://github.com/base-org/contracts). For the execution code and artifacts related to Base contract deployments and upgrades, visit [this GitHub link](https://github.com/base-org/contract-deployments) for more details around incident responses, upgrades, contract deployments and calls, and one-off deployments.

We’re also committed to providing transparency around our key management practices. Earlier this year, we shared details around [our multisig and challenger key setup](https://base.mirror.xyz/aBwt4flT1WAKJGQTj2AXBpH_8Qd3umQ-ZECLAJoO_nE). We partnered with the Optimism team to ensure that our upgrade process is documented thoroughly and well reviewed. This reduces the likelihood of an honest error significantly and ensures that any activity with malicious intent would be publicly visible and easier to detect. In a task involving a Base multisig ([example](https://github.com/base-org/contract-deployments/tree/main/mainnet/2023-08-15-support-eas)) you can see the script run by multisig signers, commands used to sign them, and records of executing these transactions onchain. In the docs, you can see all [Base Admin Addresses](https://docs.base.org/base-contracts/?utm_source=base_dot_org#base-admin-addresses), which includes addresses used to set up and secure the Base ecosystem. Through this transparency, we’re aiming to hold ourselves accountable to a thoughtful, secure key management process.

Our GitHub preserves each onchain action as we ran it at the time. Each action, like a contract deployment, call, or upgrade, is kept in its own special directory, neatly organized under the network it was performed on, and named after the date and a description of the action. This not only makes actions easy to reproduce, but it also shows how our process has evolved over time.

If you’re a builder, we’d love you to check out our smart contracts and codebase, and [submit a Git issue](https://github.com/orgs/base-org/repositories?q=&type=public&language=&sort=) with any feedback.

If you’re security-minded and spot a security issue in any of our code, our [HackerOne bounty program](https://hackerone.com/coinbase) covers the Base network, the Base bridge contracts, and Base infrastructure with bounty payouts of up to $1,000,000.

**Open Sourcing our Web Repos**

We’ve also open sourced all of Base’s web properties including base.org, docs.base.org, and bridge.base.org to increase transparency and invite developers to provide feedback and contribute. Alongside these core web properties, we  will continue to contribute to open source projects (including the OP Stack itself) and have open sourced improvements to tools like [OP-viem](https://github.com/base-org/op-viem). You can check out our docs on docs.base.org, and open an issue with ideas for improvement.

On bridge.base.org, you can see the code that submits deposits and withdrawals from Base. If you’re looking to build something similar, you can see how we did it and make your own iterations. If you have any feedback on our code, [you can submit it here](https://github.com/base-org/web/issues/new/choose).

**Building Onchain, Together**

Open source is a win-win for our onchain future.

Builders get access to a trove of knowledge, improve on what’s already been done, and in turn inspire others in the space. Through collaboration and transparency, we can accomplish the big vision: bringing the next billion people onchain.

We’re grateful for all builders whose contributions are helping us grow and secure the ecosystem.
