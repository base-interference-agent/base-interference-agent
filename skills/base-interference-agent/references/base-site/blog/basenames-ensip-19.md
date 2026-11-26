# blog/basenames-ensip-19

Source: https://www.base.org/blog/basenames-ensip-19.md

# L2 Primary Names are coming to Basenames: ENSIP-19

> The Basenames protocol will upgrade to support ENSIP-19: a new protocol spec from ENS for L2 Primary Names. With this, Basenames will become a portable identity solution for any…

- Date: 2025-08-15
- Author: Katzman
- URL: https://www.base.org/blog/basenames-ensip-19

## Background

[Basenames](https://base.org/names) are the Base-native identity layer, a decentralized open protocol built on top of ENS, and the identity solution for your Base Account. Every new user that onboards to The Base App gets a unique username that fits the form name.base.eth; that’s a Basename!

[“Primary names”](https://support.ens.domains/en/articles/7890756-the-primary-name) are a cornerstone of the ENS protocol.  They allow any client or third party app to use the address of a connected account to reverse-lookup the name associated with that account. This is the mechanism that allows a user to look like they’re logged in as `jesse.base.eth` in the wallet pip in-app instead of appearing as a `0x1234…` address. And if you hold multiple names, you can specify which one you want to be represented by.

Under the hood, resolving names or addresses are called forward and reverse resolution respectively. Forward and reverse resolution are reciprocal processes and can be visualized simply like this:

![](https://www.base.org/images/blog/basenames-ensip-19/01.webp)

Today, Basenames natively supports primary names but with some caveats:

- When Basenames launched there wasn’t support from the ENS protocol to achieve primary names for subdomain issuers on L2s. The only supported path to primary name setting required an expensive transaction on mainnet against ENS’s ReverseRegistrar contract.
- Apps that want to support Basenames primary names have to use a Basenames-specific lookup, supported most commonly by our [OnchainKit snippet](https://docs.base.org/builderkits/onchainkit/guides/use-basename-in-onchain-app?utm_source=base_dot_org).

This means apps that don’t specifically integrate with the custom Basenames reverse resolution flow are unable to check our users’ primary names. Additionally, if a user wants to take their Basename identity to other chains like Ethereum L1 or Optimism, their Basename can’t follow them.

---

## Enter ENSIP-19

In close collaboration with the Basenames team, ENS has refined and produced a [formal specification](https://docs.ens.domains/ensip/19/) for supporting L2 primary names. The ENS DAO voted to enable this protocol upgrade as of [Tuesday 7/29](https://www.tally.xyz/gov/ens/proposal/42524979896803285837776370636134389407867034021879791462477783237030656381157) with overwhelming support from the community. With the finalization of this update, Basenames is now moving to upgrade to support this spec.

Once fully integrated, we get the following benefits for all Basename users:

- Primary name resolution on all apps using modern webapp clients like wagmi; not just ones that integrate directly with Basenames via onchainkit.
- Basenames can serve as your primary name for [many networks](https://discuss.ens.domains/t/executable-enable-l2-reverse-registrars-and-new-eth-registrar-controller/20969), not just Base.

---

## How ENSIP-19 works under the hood

ENS deployed a new contract called the [L2ReverseRegistrar](https://github.com/ensdomains/ens-contracts/blob/staging/contracts/reverseRegistrar/L2ReverseRegistrar.sol) to each supported chain. These contracts let any address set its primary name for that chain. When a user connects their wallet to an app on one of these supported chains, the client can begin the reverse resolution flow for the user.

Let’s explore how this works  by following a reverse resolution request for Jesse connecting to an app on Optimism:

1. Jesse connects his wallet to an app on Optimism which kicks off the ENSIP-19 reverse resolution flow.
2. A reverse resolution request is sent to the ENS Universal Resolver on L1 asking for the primary name of Jesse’s address for the Optimism network.
3. The resolution request is forwarded to an L1 Resolver contract responsible for reverse resolution on Optimism specifically.
4. This request kicks off a [CCIP-read](https://eips.ethereum.org/EIPS/eip-3668) flow which delegates the resolution to an offchain Gateway.
5. The Gateway queries for the Name set in the L2ReverseRegistrar associated with Jesse’s address on Optimism and constructs a state proof for the fetched data.
6. The Gateway provides this response to the client so it can call back into the L1 Resolver with the data and the state proof used for verifying validity.

The client now knows that Jesse’s address is associated with jesse.base.eth, but we’re not done! When setting a name on the L2 Reverse Registrar, this contract cannot verify that an address is setting its primary name to a name that it controls. As such, there’s a close-loop validation step to the ENSIP-19 flow, very similar to the existing reverse resolution flow which verifies the retrieved name forward resolves to the original address.    \

7. The client now requests the forward resolution data for jesse.base.eth for the optimism network which is configured in the Basenames contracts on Base in accordance with ENSIP-11.
8. Through a similar CCIP-read flow, the forward resolution data for Jesse’s name is fetched from the Basenames contracts.
9. If the address connected to the client matches the address returned by the optimism-specific forward resolution request ([ENSIP-11](https://docs.ens.domains/ensip/11)), then the Primary Name is valid and Jesse shows up as jesse.base.eth!

A complete swimlane for this flow can be found in the [Appendix](https://www.base.org/blog/basenames-ensip-19) below.

---

## Next steps for Basenames

With the ENS contracts, gateway and tooling integrations live, modern clients will be capable of using ENSIP-19 to reverse resolve any Basename. However,  Basenames user data is missing two pieces to support these requests:

- Basenames users today write their reverse resolution data straight into a generic  resolver contract deployed before ENSIP-19 was finalized. This data instead needs to be located in the ENSIP-19-defined L2ReverseRegistrar to be available for the ENSIP-19 lookup flow (steps 3-6 above).
- The ENSIP-19 flow requires that users write network-specific data defined by [ENSIP-11](https://docs.ens.domains/ensip/11/) for each network where they want a name to be primary. Many Basename users today are missing data in this format for any network other than Ethereum mainnet.\

Since existing Basenames user data exists with accurate content already, but is located in the nonstandardized combination of contracts or storage slots, the Basenames team is taking a proactive approach. We are choosing to migrate the data on behalf of all users. In so doing, users won’t have to return to a Basenames surface to migrate their own data and will inherit the benefits of ENSIP-19 as soon as the migration and integrations are complete.

### New Contracts

To support these efforts, we are deploying three new contracts. Each of these contracts is undergoing rigorous testing today and will be externally audited before going live.

#### Upgradeable Registrar Controller

Today our existing RegistrarController manages the business logic associated with Basenames. It handles registrations, discounted registrations and renewals. Since it can register new names, it has unique permissions within the protocol. Specifically, it is allowed to write records to our immutable BaseRegistrar contract which tokenizes unique names and handles expiry. This upgradeable version will do everything the existing registrar does and will also write ENSIP-19 compliant records on behalf of users during registrations.

#### Upgradeable L2 Resolver

The L2 Resolver contract currently deployed is immutable. Though it inherits all of the most modern ENS resolver profiles, the Basenames team has plans to add functionality and features in the future. We also need a new Resolver target for our new Upgradeable Registrar Controller. So we’re taking this as an opportunity to get more data into a resolver which can accept new functionality seamlessly. Functionally, the only change to this contract over our existing L2Resolver is upgradeability.

#### Migration Controller

This temporary contract is designed to assist in the forward resolution data migration.  It has an admin-only hook that can be used to set ENSIP-11-compliant forward resolution data on behalf of Basename users. The primary motivations for building this hook into this contract are twofold:

1. It has a planned obsolescence at the end of this project
2. It has permission to write records on behalf of users in the L2Resolver contract where the forward resolution records need to land.

### Migration Steps

There are two large data migrations that need to be accomplished to convert all existing records into ENSIP-19 compliance. With over 750,000 Basenames active today, we need to perform a large scale series of transactions over multiple blocks. To ensure this migration doesn’t cause network congestion or spike gas costs on Base for everyone, we’re going to throttle the number of records we write per block to ensure our activities will have minimal impact on the gas market for other users.

Since the migration itself cannot occur atomically and will instead take place over 3000 blocks, our contracts and surfaces need to be configured in a way to support a zero-downtime switchover. To accomplish this, we are leveraging two strategies:

1. Set up a new, parallel registration path through our new Upgradeable Registrar Controller which can accomplish both legacy and ENSIP-19 reverse resolution writes.
2. Similarly, perform “dual writes” when users opt to change their primary name ensuring legacy and modern reverse records are available to integrators.

![Registration flow for both The Base App and Web, showing the dual-write strategy enabled by UpgradeableRegistrarController.](https://www.base.org/images/blog/basenames-ensip-19/02.webp 'Registration flow for both The Base App and Web, showing the dual-write strategy enabled by UpgradeableRegistrarController.')

Once all new registrations and primary changes are ENSIP-19 compliant we can safely deprecate the legacy registration paths. This deprecation ensures no data will be missed when we migrate state.

First, we’ll migrate user forward resolution data. By leveraging our new Migration Controller, we can safely copy the data that exists for users in the coinType == 60 address field and move it into the Base chain-specific slot at coinType == 0x80002105. This means that our users will now have Base-specific forward resolution data available for the close-loop steps of ENSIP-19.

Second, we can begin moving the reverse resolution data from our L2 Resolver to ENS’s L2ReverseRegistrar. ENS was kind enough to include an admin hook for us in the [Base implementation](https://github.com/ensdomains/ens-contracts/blob/feature/simplify-reverse-resolver/contracts/reverseRegistrar/L2ReverseRegistrarWithMigration.sol) so that we can safely migrate the data on behalf of our users.

Once both data migrations are complete, the Basenames technical work is complete! At this point we will start working with integrators to switch over to using updated tooling (wagmi, ethers, viem) which supports ENSIP-19.

---

### Conclusion

We’re well into the development cycle for this project and our most recent batch of contracts to support this are currently under external audit. At current pace, we’re targeting an early September data migration with earlier cut-overs to the new registration and set-primary flows.

If you run an app on Base and either integrate with Basenames today or want to in the future, we’ll have updated docs published along with the public announcements soon. If your app integrates with Basenames today, rest assured our migration is initially backwards compatible. However, you will need to upgrade when we deactivate legacy data writing for the sake of saving users’ gas.  We will contact our ecosystem with details as integrators must upgrade.

That’s all for now! If you don’t already have your basename, register one today at [https://base.org/name](https://base.org/name). And please stay tuned for updates from the Base Account squad as we roll this out.

## Appendix

![](https://www.base.org/images/blog/basenames-ensip-19/03.webp)
