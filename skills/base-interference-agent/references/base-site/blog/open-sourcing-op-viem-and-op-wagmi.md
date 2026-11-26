# blog/open-sourcing-op-viem-and-op-wagmi

Source: https://www.base.org/blog/open-sourcing-op-viem-and-op-wagmi.md

# Open sourcing op-viem and op-wagmi

> TLDR: Today, we’re open sourcing op-viem and op-wagmi, extensions to the popular developer tools viem and wagmi. We’ve developed these libraries, in collaboration with the…

- Date: 2023-12-15
- Author: Base
- URL: https://www.base.org/blog/open-sourcing-op-viem-and-op-wagmi

**_TLDR:_** _Today, we’re open sourcing op-viem and op-wagmi, extensions to the popular developer tools viem and wagmi. We’ve developed these libraries, in collaboration with the community, to empower developers to build faster and easier on OP Stack chains._

**Building for OP chains with op-viem and op-wagmi**

Base aims to bring the next million builders and billion users onchain, giving builders an easy-to-use, fast, and cheap development platform.

While L2s like Base offer developers cost and speed advantages, they can have their own development challenges. As we started to build on the OP Stack ourselves, we found gaps in tooling that weren't addressed by existing Ethereum development frameworks. That’s why we decided to extend popular Ethereum libraries for developers building on the OP Stack, and are open sourcing them so that anyone can review the codebase and contribute.

**Why?**

Today, developers building on Ethereum can use a number of libraries to simplify development, including the popular tools viem and wagmi. **Viem** is a low-level library compatible with any JavaScript code, abstracting the complexity of sending transactions on Ethereum. **Wagmi,** built on Viem, lets developers build an application’s frontend using modern React idioms.

Although viem and wagmi work out-of-the-box on the OP Stack, they don’t easily support features specific to L2s, such as bridging and cross-layer messaging. Developers looking to build these features into their applications still need to write custom code, making the process more complex and error-prone. For example, if a developer called the bridge contract code incorrectly, user assets could be lost.

With op-viem and op-wagmi, developers can add OP Stack bridging functionality into any application with dramatically less code and time spent. For example, creating a withdrawal proof can now be done via the code below, which replaces a 100+ line implementation of a React hook that would be needed without these libraries.

![](https://www.base.org/images/blog/open-sourcing-op-viem-and-op-wagmi/01.webp)

The full-featured React hooks in op-wagmi streamline adding cross-chain functionality to React-based dapps. For JavaScript developers using frontend frameworks other than React, op-viem provides all the building blocks needed to adopt the same functionality to their framework of choice.

![](https://www.base.org/images/blog/open-sourcing-op-viem-and-op-wagmi/02.webp)

**Growing the onchain ecosystem, one bridge at a time**

L2s enable users to use apps quickly and cheaply. But when users start onchain, they often don't have assets on an L2 right away.

As [more and more users get onchain and transact on L2s](https://l2beat.com/scaling/activity), developers will need to offer their users a secure and intuitive way to bridge as a critical first step.

With op-viem and op-wagmi, you can build bridging functionality inside your apps with minimal custom code. Op-viem also provides lower-level utilities that can help with things like [getting L2 hashes for deposit transactions](https://www.opviem.sh/docs/actions/public/L1/getL2HashesForDepositTx.html), [getting outputs on L1 for L2 blocks](https://www.opviem.sh/docs/actions/public/L1/getOutputForL2Block.html), and more.

**Public goods**

Base is committed to building in the open, and in the spirit of empowering the entire ecosystem, we built op-viem and op-wagmi as open-source libraries. Our goal is to not only benefit builders on Base, but everyone who is building on the OP Stack and contributing towards the Superchain vision.

You can check out the code for [op-viem](https://www.opwagmi.sh/) and [op-wagmi](https://www.opwagmi.sh/), and contribute any feedback that you might have. We're excited to hear from you and to see what you build!

Spotted a cool project built on Base? Don’t forget to nominate them for a [Base Grant](https://paragraph.xyz/@grants.base.eth/calling-based-builders)!
