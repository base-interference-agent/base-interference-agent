# blog/commerce-payments-protocol

Source: https://www.base.org/blog/commerce-payments-protocol.md

# Engineering the Commerce Payments Protocol Powering Shopify

> Launching a new standard for scalable, trust-minimized commerce

- Date: 2025-06-12
- Author: Amie Corso
- URL: https://www.base.org/blog/commerce-payments-protocol

Coinbase and Shopify are launching the Commerce Payments Protocol to address a major gap in crypto: enabling real-world commerce. While most onchain payments today work well for peer-to-peer transfers, they fall short of handling the complexity of commercial purchases, which require a multi-stage payment commitment process.

This protocol brings sophisticated, multi-step payment flows onchain, while preserving crypto’s core advantages of speed, low cost, and global reach. It bridges the promise of crypto with the realities of commerce.

Available now on Base and open to all developers, this protocol powers Shopify’s new USDC payment method, which is rolling out to millions of stores using Shopify Payments. This means merchants worldwide can soon accept USDC on Base seamlessly through Shopify Payments.

---

## Why Crypto Payments Matter

Crypto payments with Base improve the traditional payment experience and unlock entirely new opportunities. Payments settle faster, cheaper, globally and without intermediaries. Onchain payments are also programmable, carrying not just value but also instructions that can trigger other actions across the financial ecosystem.

### Faster

For cashflow-conscious businesses, the difference between having money now and having money next week can be existential. For goods and services that are delivered immediately, delayed settlement puts merchants at risk of bounced payments and being at a loss. On Base, payments can land as quickly as 200 milliseconds, even across international borders, providing an unmatched merchant experience.

### Cheaper

Transaction fees imposed by existing payment networks can detract a significant amount of merchants’ take-home profits, especially internationally. Transaction fees on Base are dramatically cheaper at typically less than $0.01 and consistently decreasing as network capacity grows. Base’s cheaper fees enable a more fluid economy where commerce can put more value in the pockets of those creating it.

### Globally Accessible

Base is internet-native and does not have borders. Anyone with an internet connection can have the opportunity to transact in a global economy. This opens up new markets for merchants and access to goods and services for buyers around the world.

### Composable

Existing financial infrastructure is a patchwork of different gatekeepers and standards. This increases the difficulty of building integrated systems and leads to a proliferation of different apps and accounts for users, complicating the experience for everyone. Blockchains establish a shared ledger that enables different systems to reference the same source of truth. This has led to the emergence of shared standards that simplify the integration process, empowering developers to build novel, interconnected experiences that benefit all.

---

## Commerce: The Missing Piece

Crypto payments have been around for many years, but large-scale commerce has lagged.

Fifteen years ago, someone successfully paid for two pizzas with Bitcoin. Most onchain payments today still have not deviated from these direct token transfer implementations. We have been unfortunately stuck in a local maximum that works enough for basic things but not beyond.

Commerce demands more sophistication. Commercial payments involve race conditions between checkout, settlement, and fulfillment. Inventory can sell out between completing checkout and payment processing. Tax obligations can change between checkout and settlement. Buyers or merchants may want to cancel partial or full orders and refund payment.

Traditional finance addresses some of these concerns by separating buyer approval (e.g. entering card details) from the asynchronous checks a storefront performs before executing payment. The crypto analogy is letting buyers sign off on spending funds without immediately broadcasting a blockchain transaction.

After buyers approve a payment, funds must be locked while still allowing either party to cancel if needed. Traditional payments handle this with a two-step “authorize and capture” process: first locking buyer funds (authorize), then disbursing them to the merchant (capture).

This simple pattern has supported commerce complexities well before blockchains by providing:

- **Merchant protection** through payment guarantees
- **Buyer protection** through reserved but not yet finalized payment
- **Lower costs for merchants** because they only pay fees on captured payments
- **Custom payment finalization** by capturing in parts, potentially not up to the full amount

Until now, onchain payments have been missing this capability. To make onchain payments work for commerce at scale, we needed to design a new protocol capable of achieving the same payment properties.

---

## Escrow Architecture

To implement authorization and capture, we introduce an escrow smart contract to sit between buyer and merchant. On authorization, funds move into the escrow from the buyer. On capture, funds move out of the escrow to the merchant. The smart contract enforces that if funds are authorized, then they are put on hold to guarantee the ability to capture at a later date. For generalization clarified later, the protocol describes a buyer as “payer” and merchant as “receiver” to state their purpose more plainly.

![](https://www.base.org/images/blog/commerce-payments-protocol/01.webp)

An escrow architecture also allows us to make no assumptions about the payer or receiver addresses and their capabilities. For example an alternative construction would be to introduce a locking mechanism on the payer’s wallet, but this comes with many assumptions about the payer that reduce compatibility.

Anyone can use the escrow smart contract and no one can turn it off or change its code. This provides best-in-class guarantees for prospective integrators and users. It is meant to be shared for all payments across the ecosystem and is a hub for commerce.

---

## Operators

Like normal payments, blockchain transactions require a fee to execute. While the status quo in crypto expects payers to incur this fee, traditional commerce places this burden on the receiver. A fee-free payer experience is important for conversion, but introduces a new problem for receivers who would have to manage blockchain transactions to authorize their payments. To resolve this friction, we introduce a new role called an operator to facilitate movement of funds between the transacting parties.

![](https://www.base.org/images/blog/commerce-payments-protocol/02.webp)

Similar to payers and receivers, the protocol is not concerned with how the operator is implemented and just recognizes it as an address. Operators could be simple externally-owned accounts or advanced smart contracts. Operators could also be controlled via API to easily integrate with existing commerce workflows. Coinbase provides such a service and the protocol is open for anyone to build their own as well.

While operators exist for payer and receiver convenience, this benefit should not supersede security. Users should not have to trust any operator or managing entity to be safe. We have invested in multiple efforts to limit the controls given to operators to stay true to this crypto ethos.

First, operators cannot modify the original payment intent of the payer. This includes things like the receiver address, token of payment, maximum amount to be paid, and expiries for authorization and other operations. We mitigate the ability for operators to mutate any of these fields by having the payer sign over a hash of these details. By hashing this information, we probabilistically guarantee that any change to any field will result in a new hash easily identifiable as different from the original. By signing over this hash, we guarantee that a given set of payment information is aligned with the payer’s intent. Additionally, the protocol rejects attempts at using a signed payment more than once.

Second, operators cannot lock funds in the escrow. If the authorization expires and the operator has not yet captured or voided the payment, the payer is able to reclaim funds directly from the escrow without operator intervention. This hopefully never needs to happen as this mitigation and lack of incentive is not clearly worth a potentially malicious operator’s time.

Third, operators cannot impact the activities of another operator. Given anyone can become an operator, this is important to protect all honest actors even if some begin to act maliciously. The operator address is encoded into the payment information sealed by the payer in the signing process. This guarantees that only one operator can manage the payment through its lifecycle. Additionally, the payments managed by different operators are escrowed in different buckets. This measure proactively reduces the risk of a theoretical vulnerability being discovered in the future. You can read more about our security preparation [here](https://github.com/base/commerce-payments/blob/main/docs/Security.md).

---

## Payment Operations

The protocol implements six core operations that cover the complete payment lifecycle:

1. `authorize`: transfer funds from payer to escrow
2. `capture`: transfer funds from escrow to receiver
3. `charge`: transfer funds from payer to escrow to receiver (1-step authorization + capture)
4. `void`: return of uncaptured funds from escrow to payer
5. `reclaim`: payer-initiated void, only available after authorization expires
6. `refund`: return of captured funds to payer\

Each operation updates payment accounting in the protocol, tracking authorized payments available for capture and captured payments available for refund. The protocol enforces that payment transitions only occur in the valid time window defined by the payment’s various expiries.

### Authorize

Reserve payer funds in escrow for future capture, enabling delayed settlement and guaranteeing merchant payment. The protocol leaves collecting funds from payers open-ended and extensible, but our initial implementation integrates with the [ERC-3009](https://eips.ethereum.org/EIPS/eip-3009) standard. This standard allows payers of all wallet types to grant permission to spend funds with just a signature, deferring transactions to operators. The protocol enforces that “pre-approvals” like this signature must be used to authorize payment before an expiry.

![](https://www.base.org/images/blog/commerce-payments-protocol/03.webp)

### Capture

Transfer authorized funds from escrow to receivers to finalize payment. Captures can be made in multiple partial increments to support merchants that may fulfill goods in multiple deliveries. The protocol enforces that the total captured amount cannot exceed the authorized amount. Captures must be made before the authorization expires, defined at the time of payment signing.

![](https://www.base.org/images/blog/commerce-payments-protocol/04.webp)

### Charge

Combines authorization and capture into a single transaction to improve efficiency for payments that do not require delayed captures. Follows the same flexible payment collection and pre-approval expiry patterns as authorize. This is analogous to the “sale” credit card transaction type.

![](https://www.base.org/images/blog/commerce-payments-protocol/05.webp)

### Void

Cancel an authorized payment, returning escrowed funds back to the payer. Used to cancel transactions for errors potentially unrelated to payment or if merchants are no longer able to fulfill the order. Can be made at any time but only once per payment, reversing the entire remaining authorized amount.

![](https://www.base.org/images/blog/commerce-payments-protocol/06.webp)

### Reclaim

Effectively a payer-initiated void where payers retrieve their own funds from the escrow. Can only be performed if an authorization has expired and serves primarily as a safety mechanism against malfunctioning operators. This is the only payment operation not controlled by the operator.

![](https://www.base.org/images/blog/commerce-payments-protocol/07.webp)

### Refund

Return funds to payers after payment has been captured to the receiver. The protocol leaves collecting funds for payers open-ended and extensible, but our initial implementation integrates with the [ERC-3009](https://eips.ethereum.org/EIPS/eip-3009) standard. We use this standard to add flexibility to withdraw capital from multiple potential sources such as the receiver, another merchant-controlled address, or the operator. Refunds must be made before an expiry after which captured payments are considered final.

![](https://www.base.org/images/blog/commerce-payments-protocol/08.webp)

---

## Example Payment Flow

To start paying with crypto, a merchant storefront requests a buyer to sign payment information with their wallet. The merchant storefront requests payment authorization from an operator service, providing the signed payment information. The operator service submits a blockchain transaction, directing the operator to call the escrow smart contract to authorize the provided payment. On successful execution, the buyer is given confirmation that they have paid. At a later point in time, the merchant can capture or void this payment.

![](https://www.base.org/images/blog/commerce-payments-protocol/09.webp)

---

## Build With Us

Coinbase and Shopify are stewards of the protocol and its initial participants, but the protocol is open. Anyone can build on it and no one can shut it off.

The core of the protocol is radically simple with only 6 payment operations. This helped us reach confidence in its security, but also left open the potential to build new features on top of this foundation.

To call out a few design directions we are excited about:

1. **Operator smart contracts.** As the drivers of money movement, composing payment with additional smart contract systems is powerful at the operator layer. It is also possible here to peel back some of the control given to 3rd parties and delegate operations to other roles or back to payers and receivers.
2. **Receiver smart contracts.** Layer in revenue splits, currency swaps, privacy systems, and more.
3. **Token Collector smart contracts.** Our exact mechanics for collecting tokens for payment and refunds are under-discussed thus far for brevity. We originally implemented an integration with [ERC-3009](https://eips.ethereum.org/EIPS/eip-3009) to support gas-less payments with USDC, but many other opportunities exist for signing payment authorization. This pattern also extends to refunds where liquidity to make a payer whole can come from any location, allowing more flexible resolution between operator and merchant. Opportunities for discounts, chain abstraction, and paying with any token likely exist here.

For a complete breakdown of the protocol, find the full implementation and documentation [here](http://github.com/base/commerce-payments). You can also reach out with questions in the [Base Discord server](https://discord.com/invite/buildonbase).\

The future of commerce is onchain, permissionless, and decentralized. The infrastructure is ready. Now it's time to build.
