> ## Documentation Index
> Fetch the complete documentation index at: https://docs.o1.exchange/llms.txt
> Use this file to discover all available pages before exploring further.

# Trading API

> Execute trades programmatically with MEV protection, Permit2 support, and automatic slippage handling

## Overview

The o1 Terminal Trading API enables programmatic trading with enterprise-grade features including built-in MEV protection, Permit2 support for gasless approvals, and automatic slippage handling.

> [card] Key Benefits
>
> * **MEV Protection**: Private mempool routing to prevent sandwich attacks
> * **Gasless Approvals**: One-time Permit2 signatures for unlimited trading
> * **Automatic Slippage**: Built-in slippage protection with customizable limits

## Prerequisites

> [card] Wallet
>
> Ethereum wallet with private key

> [card] Gas Fees
>
> ETH for transaction costs

> [card] Runtime
>
> Node.js environment

## Quick Start

### 1. Generate API Key

**1. Navigate to API Trading**

Visit [https://o1.exchange/api-trading](https://o1.exchange/api-trading)

**2. Create API Key**

Generate your secure API token for authentication

### 2. Create Transaction Batch

> [tab] Request
>
> **Endpoint:** `POST https://api.o1.exchange/api/v2/order`
>
> **Headers:**
>
> ```json theme={null}
> {
>   "Authorization": "Bearer <YOUR_API_TOKEN>",
>   "Content-Type": "application/json"
> }
> ```
>
> **Body:**
>
> ```json theme={null}
> {
>   "networkId": 8453, // Network ID (8453 = Base, 56 = BSC, 1399811149 = Solana)
>   "signerAddress": "0x...",  // Your wallet address
>   "tokenAddress": "0x...",   // Token contract address
>   "uiAmount": "1.0",         // Amount in human-readable format
>   "direction": "buy",        // "buy" or "sell"
>   "slippageBps": 300,        // Slippage in basis points (300 = 3%)
>   "mevProtection": true,      // Enable MEV protection
>   "quoteTokenAddress": "0x...", // (Optional) Quote token for stablecoin trades (Base only)
>   "poolAddress": "0x..." // (Optional) Specific liquidity pool (Base, BSC)
> }
> ```

> [tab] Response
>
> ```json theme={null}
> {
>   "success": true,
>   "id": "batch_123...",
>   "transactions": [
>     {
>       "id": "tx_456...",
>       "unsigned": {
>         "to": "0x...",
>         "data": "0x...",
>         "value": "0x...",
>         "gasLimit": "0x...",
>         "chainId": 1
>       },
>       "permit2": {
>         "eip712": {
>           "domain": {...},
>           "types": {...},
>           "values": {...}
>         }
>       }
>     }
>   ]
> }
> ```

### 3. Sign Transaction and Permit2

> [accordion] Implementation Details
>
> For each transaction in the response:
>
> 1. **Sign Permit2 (if present):**
>    * Extract the EIP-712 typed data from `permit2.eip712`
>    * Sign using wallet's `signTypedData` method
>    * Replace the signature placeholder in transaction data
> 2. **Sign the transaction:**
>    * Create transaction object from the unsigned data
>    * Sign using wallet's `signTransaction` method
>
> ```javascript theme={null}
> // Fixed signature placeholder - don't change
> const SIGNATURE_PLACEHOLDER =
>   "42f68902113a2a579bcc207c91254c8516d921250e748c18a082d91d74908f8e9a05f27b72a030c6a42d77d0e0aab6fb09219b01a01e7b5b24e4f322ee1762ff1b";
>
> for (const ctx of data.transactions) {
>   const unsignedTx = Transaction.from(ctx.unsigned);
>
>   // Handle Permit2 signature if present
>   if (ctx?.permit2?.eip712) {
>     const { domain, types, values } = ctx.permit2.eip712;
>     const signature = await wallet.signTypedData(domain, types, values);
>
>     // Replace placeholder with actual signature
>     let txData = unsignedTx.data;
>     txData = txData.replace(SIGNATURE_PLACEHOLDER, signature.slice(2));
>     unsignedTx.data = txData;
>   }
>
>   // Sign the transaction
>   const signedTx = await wallet.signTransaction(unsignedTx);
> }
> ```

### 4. Submit Transaction

> [tab] Request
>
> **Endpoint:** `POST https://api.o1.exchange/api/v2/order/complete`
>
> **Headers:**
>
> ```json theme={null}
> {
>   "Authorization": "Bearer <YOUR_API_TOKEN>",
>   "Content-Type": "application/json"
> }
> ```
>
> **Body:**
>
> ```json theme={null}
> {
>   "id": "batch_123...",     // Batch ID from create response
>   "transactions": [
>     {
>       "id": "tx_456...",     // Transaction ID
>       "signed": "0x...",     // Signed transaction hex
>       "permit2": {
>         "eip712": {
>           "signature": "0x..." // Permit2 signature
>         }
>       }
>     }
>   ]
> }
> ```

> [tab] Response
>
> ```json theme={null}
> {
>   "success": true,
>   "transactions": [
>     {
>       "hash": "0x...",        // Transaction hash
>       "status": "pending",    // Transaction status
>       "tokenDelta": "1000000" // Token balance change
>     }
>   ]
> }
> ```

## Sample Scripts & Examples

> [card] Complete Sample Repository
>
> **GitHub Repository:** [https://github.com/CohumanSpace/o1-api](https://github.com/CohumanSpace/o1-api)
>
> This repository contains complete sample scripts for using the o1 Terminal API, including:
>
> * Interactive CLI trading application
> * Complete integration examples
> * Proper error handling patterns
> * Environment setup guides

## Interactive Example

> [card] Complete CLI Trading App
>
> See `execute-trade-interactive.js` in the [sample repository](https://github.com/CohumanSpace/o1-api) for a fully functional CLI trading application that demonstrates all integration steps with proper error handling and user interaction.

### Setup Environment

Create a `.env.local` file:

```env theme={null}
EXECUTE_TRADE_PRIVATE_KEY=<YOUR_PRIVATE_KEY>
EXECUTE_TRADE_API_TOKEN=<YOUR_API_TOKEN>
EXECUTE_TRADE_BASE_URL=<API_BASE_URL>
EXECUTE_TRADE_RPC_URL=<ETHEREUM_RPC_URL>
```

### Run Interactive CLI

```bash theme={null}
node execute-trade-interactive.js
```

**1. Token Address**

Enter token contract address (e.g., `0x06ca615ac72a18e76b63bd4b5c320b6c8e291f8b`)

**2. Trade Direction**

Choose `buy` or `sell`

**3. Amount**

Enter amount in ETH (for buy) or tokens (for sell)

**4. Confirm**

Review trade details and execute

**5. Results**

View balance changes after execution

## Advanced Features

> [card] Permit2 Integration
>
> **Gasless token approvals** using EIP-712 signatures
>
> <ul>
>   <li>Automatic signature placeholder replacement</li>
>   <li>One-time approval for unlimited trading</li>
>   <li>Reduced gas costs for frequent traders</li>
> </ul>

> [card] MEV Protection
>
> **Protection against sandwich attacks**
>
> <ul>
>   <li>Private mempool routing</li>
>   <li>Reduced slippage from MEV bots</li>
>   <li>Enable with `mevProtection: true`</li>
> </ul>

### Slippage Control

> [!NOTE]
>
> Specify `slippageBps` in basis points where **100 bps = 1%**
>
> **Recommendations:**
>
> * **Normal conditions:** 300 bps (3%)
> * **Volatile tokens:** 500-1000 bps (5-10%)
> * **Large trades:** Increase as needed

## Error Handling

> [!WARNING]
>
> Always implement proper error handling for:
>
> * Network connectivity issues
> * Insufficient balance or gas
> * Transaction reverts
> * API rate limiting

> [!TIP]
>
> The interactive example includes comprehensive error handling patterns you can reference for your own implementation.


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.