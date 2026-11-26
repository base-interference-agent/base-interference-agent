# blog/introducing-onchaintestkit

Source: https://www.base.org/blog/introducing-onchaintestkit.md

# OnchainTestKit: A Framework for End-to-End Testing of Onchain Applications

> Making Onchain Application Testing Reliable and Straightforward

- Date: 2025-09-29
- Author: Matthew Bunday
- URL: https://www.base.org/blog/introducing-onchaintestkit

## Introduction

Testing decentralized applications has always been fundamentally different from testing traditional web applications. While conventional apps deal with straightforward HTTP requests and predictable database states, onchain apps must navigate the complex world of blockchain interactions: wallet connections, transaction approvals, network switches, and chain state. Each of these interactions introduces unique challenges that existing testing frameworks weren't designed to handle.

\
We encountered many of these challenges when writing end-to-end tests for the [Verified Pools project](https://www.coinbase.com/en-ca/blog/the-future-of-onchain-Liquidity-is-here-via-coinbase-verified-pools). This sophisticated DeFi application brought institutional-grade liquidity infrastructure to onchain markets, requiring testing of complex user flows across frontend, backend, and smart contract integrations. For example, a user connecting their wallet, approving token spending, signing Permit2 messages, providing liquidity to pools, and managing their positions across multiple contracts. What should have been a straightforward testing effort quickly became a weeks-long odyssey of technical challenges and productivity bottlenecks.

## The Core Challenges of E2E Onchain Testing

Testing decentralized applications introduces complexities that live at the intersection of web automation and blockchain interaction. Standard end-to-end testing frameworks are not inherently built for this environment, forcing developers to solve several fundamental problems before they can write effective tests.

Based on our experience, there are 4 major testing hurdles:

**1. Wallet Extension Setup** Every test requires a browser wallet to be installed, configured, and funded from scratch. This process is unique for each wallet (like MetaMask or Coinbase Wallet) and can lead to brittle, custom scripts.

**2. Unpredictable Wallet Pop-ups** During a test, user actions trigger wallet pop-ups for transaction approvals, message signing, and network switches. These pop-ups appear asynchronously with inconsistent timing and UI patterns, leading to unpredictability and flakiness.

**3. Shared On-Chain State** True test parallelism is impossible on a shared blockchain. When multiple tests run at once, they use the same wallet addresses and interact with the same smart contracts on the same blockchain. This causes tests to interfere with each other's state, leading to unpredictable failures that are difficult to debug.

**4. Contract Deployment and State Management** A fundamental tooling gap exists between smart contract development in Solidity (using Foundry) and end-to-end testing in TypeScript. Tests require contracts to be deployed with a specific initial state, but contract addresses are non-deterministic, which breaks the link with the frontend.

---

## How OnchainTestKit Solves Each Problem

OnchainTestKit directly addresses each of the four critical problems with purpose-built solutions:

### Solution 1: Automatic Wallet Management

Instead of manually setting up each wallet type, OnchainTestKit handles everything automatically, with a unified interface that works for all wallet types. Here's an example of how to configure a test with Coinbase Wallet:

```
// Configure the test with a local node and a coinbase wallet
const coinbaseWalletConfig = configure()
  .withLocalNode({
    chainId: baseSepolia.id,
    forkUrl: process.env.E2E_TEST_FORK_URL,
    forkBlockNumber: BigInt(process.env.E2E_TEST_FORK_BLOCK_NUMBER ?? "0"),
    hardfork: "cancun",
  })
  .withCoinbase()
  .withSeedPhrase({
    seedPhrase: DEFAULT_SEED_PHRASE ?? "",
    password: DEFAULT_PASSWORD,
  })
  .withNetwork({
    name: "Base Sepolia",
    chainId: baseSepolia.id,
    symbol: "ETH",
    rpcUrl: "http://localhost:8545",
  })
  .build();
```

**Result**: Developer-friendly, wallet agnostic, and easy to use. We hide all the complexity of wallet setup and management from the developer.

### Solution 2: Reliable Wallet Popup Handling

OnchainTestKit provides a unified interface that abstracts all popup complexity:

```
// Instead of dealing with timing and popup detection:
await coinbaseWallet.handleAction(BaseActionType.CONNECT_TO_DAPP);
await coinbaseWallet.handleAction(BaseActionType.HANDLE_TRANSACTION, {
  approvalType: ActionApprovalType.APPROVE
});

await coinbaseWallet.handleAction(BaseActionType.CHANGE_SPENDING_CAP, {
  approvalType: ActionApprovalType.APPROVE
});
```

**Intelligent Waiting Strategies & Retries**: OnchainTestKit uses smart waiting strategies that understand blockchain timing patterns and wallet behavior. Built-in retry mechanisms handle transient failures automatically, while adaptive timeouts adjust based on network conditions and popup complexity.

**Result**: Tests pass reliably. No more flaky tests due to timing issues or unpredictable wallet behavior.

### Solution 3: True Test Isolation

OnchainTestKit provides each test with its own isolated Anvil blockchain node, eliminating all state conflicts:

```
// Each test gets its own LocalNodeManager
test('parallel test A', async ({ localNodeManager, smartContractManager }) => {
  // Automatically starts Anvil node on available port (e.g., 10543)
  // This test's transactions only affect its own blockchain
  await page.click('#swap-button');
  // Test logic...
});

test('parallel test B', async ({ localNodeManager, smartContractManager }) => {
  // Automatically starts separate Anvil node on different port (e.g., 10847)
  // Completely independent blockchain state
  await page.click('#approve-button');
  // Test logic...
});
```

**How LocalNodeManager Works**: OnchainTestKit automatically allocates available ports across processes and spins up isolated Anvil nodes for each test. It supports three different parallel testing strategies:

**1. Fork Existing Networks**: Fork a testnet or mainnet at a specific block number without deploying contracts. Perfect for testing against existing protocol deployments:

```
.withLocalNode({
  forkUrl: process.env.BASE_MAINNET_RPC_URL,
  forkBlockNumber: process.env.E2E_TEST_FORK_BLOCK_NUMBER,
  chainId: 8453
})
```

**2. Clean Local State**: Start with a fresh blockchain and deploy all dependent contracts. Ideal for testing new protocols or complex state setups:

```
.withLocalNode({
  chainId: 84532,
  // No fork - starts with clean state
})

// Then deploy contracts via smartContractManager
```

**3. Hybrid Approach**: Fork a network and deploy additional test contracts on top. Combines real protocol state with custom test contracts:

```
.withLocalNode({
  forkUrl: process.env.BASE_SEPOLIA_RPC_URL,
  forkBlockNumber: 10_000_000n,
  chainId: 84532
})

// Then deploy additional test contracts as needed
```

Each approach provides complete test isolation with independent blockchain state, allowing tests to manipulate time, account balances, and contract state without affecting other tests.

**Smart RPC Routing**: One of the key innovations is automatic request interception. Your frontend can always use a fixed RPC URL like `localhost:8545`, and LocalNodeManager automatically routes these requests to the correct Anvil node for each test. No need to dynamically configure different ports—the framework handles the routing transparently.

**Automatic Cleanup**: LocalNodeManager handles the complete node lifecycle, gracefully terminating each Anvil process after its test completes. This ensures no resource leaks or port conflicts, even when running large test suites with dozens of parallel nodes.

**Result**: Fully parallelized testing with no coordination overhead. CI times drop from hours to minutes.

### Solution 4: Deterministic Contract Deployments

OnchainTestKit bridges the Solidity/TypeScript gap using CREATE2 for deterministic contract deployments:

```
await smartContractManager.setContractState({
  deployments: [
    { 
      name: 'MockUSDC', 
      salt: '0x1234...', // CREATE2 salt for deterministic address
      deployer: admin,
      args: ['USD Coin', 'USDC', 6] 
    },
    { 
      name: 'DEXContract', 
      salt: '0x5678...', 
      deployer: admin,
      args: [mockUsdcAddress] 
    }
  ],
  calls: [
    { target: mockUsdcAddress, functionName: 'mint', args: [user, amount], account: admin },
    { target: mockUsdcAddress, functionName: 'approve', args: [dexAddress, amount], account: user }
  ]
});
```

**How CREATE2 Works**: OnchainTestKit uses CREATE2 deployment with fixed salts to ensure contracts always deploy to the same addresses. The SmartContractManager predicts deployment addresses before deployment, checks if contracts already exist at those addresses, and loads Foundry artifacts automatically from your out/ artifact directory. This creates a seamless bridge between your Solidity contracts and TypeScript tests.

**Foundry Integration**: Automatically loads compiled contract artifacts, eliminating manual ABI management or deployment script coordination between contract and test teams.

**Result**: Reliable contract testing with predictable addresses. Full user journeys from smart contract interaction to UI feedback work consistently across all test runs.

---

## How We Use OnchainTestKit in Verified Pools

Here's a real example from our Verified Pools project showing how OnchainTestKit transforms complex onchain app testing into clean, readable tests:

```
// walletConfig/metamaskWalletConfig.ts
import { baseSepolia } from 'viem/chains';
import { configure } from '@coinbase/onchaintestkit';

export const DEFAULT_PASSWORD = 'PASSWORD';
export const DEFAULT_SEED_PHRASE = process.env.E2E_TEST_SEED_PHRASE;

// Reusable configuration for MetaMask tests with Base Sepolia fork
const metamaskConfig = configure()
  .withLocalNode({
    chainId: baseSepolia.id,
    forkUrl: process.env.E2E_TEST_FORK_URL,
    forkBlockNumber: BigInt(process.env.E2E_TEST_FORK_BLOCK_NUMBER ?? '0'),
    hardfork: 'cancun',
  })
  .withMetaMask()
  .withSeedPhrase({
    seedPhrase: DEFAULT_SEED_PHRASE ?? '',
    password: DEFAULT_PASSWORD,
  })
  .withNetwork({
    name: 'Base Sepolia',
    chainId: baseSepolia.id,
    symbol: 'ETH',
    rpcUrl: 'http://localhost:8545', // Fixed URL, auto-routed to correct port
  })
  .build();

export { metamaskConfig };
```

This test covers a complete user journey in Verified Pools:

1. Connect MetaMask wallet to the onchain app
2. Navigate to the swap interface
3. Enter swap amount (0.0001 ETH)
4. Execute the swap transaction
5. Handle all required wallet popups (spending cap approval, Permit2 signature, transaction confirmation)
6. Verify the swap completed successfully\

```
// swap.spec.ts

import { createOnchainTest } from '@coinbase/onchaintestkit';
import { NotificationPageType } from '@coinbase/onchaintestkit/wallets/MetaMask';
import { ActionApprovalType, BaseActionType } from '@coinbase/onchaintestkit/wallets/BaseWallet';
import { metamaskConfig } from './walletConfig/metamaskWalletConfig';

const test = createOnchainTest(metamaskConfig);
const { expect } = test;

test.describe('Verified Pools Swap', () => {
  test('connect wallet and swap @tx', async ({ page, metamask }) => {
    if (!metamask) throw new Error('MetaMask fixture is required');

    // Navigate to swap interface
    await page.goto('/swap');

    // Connect wallet - OnchainTestKit handles all the complexity
    await page.getByTestId('ockConnectButton').first().click();
    await page.getByTestId('ockModalOverlay')
      .first()
      .getByRole('button', { name: 'MetaMask' })
      .click();
    await metamask.handleAction(BaseActionType.CONNECT_TO_DAPP);
    await page.getByRole('button', { name: /^Accept$/ }).click();

    // Set up the swap
    const inputField = page.locator('input[placeholder="0.0"]').first();
    await inputField.fill('0.0001');

    // Execute swap
    await page.getByRole('button', { name: 'Swap' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Handle spending cap approval (Permit2)
    let notificationType = await metamask.identifyNotificationType();
    if (notificationType === NotificationPageType.SpendingCap) {
      await metamask.handleAction(BaseActionType.CHANGE_SPENDING_CAP, {
        approvalType: ActionApprovalType.APPROVE,
      });
      notificationType = await metamask.identifyNotificationType();
    }

    // Handle signature for Permit2
    if (notificationType === NotificationPageType.SpendingCap) {
      await metamask.handleAction(BaseActionType.HANDLE_SIGNATURE, {
        approvalType: ActionApprovalType.APPROVE,
      });
      notificationType = await metamask.identifyNotificationType();
    }

    // Handle the actual swap transaction
    if (notificationType === NotificationPageType.Transaction) {
      await metamask.handleAction(BaseActionType.HANDLE_TRANSACTION, {
        approvalType: ActionApprovalType.APPROVE,
      });
    }

    // Verify swap completion
    await expect(page.getByRole('link', { name: 'View on Explorer' })).toBeVisible({
      timeout: 10_000,
    });
  });
});
```

**What This Shows:**

- **No Custom Wallet Setup**: OnchainTestKit handles MetaMask installation and configuration automatically
- **Fork Testing**: Tests run against real Base Sepolia network at a specific block number where all dependent contracts are deployed, but each test gets its own isolated fork
- **Reliable Popup Handling**: Complex wallet interactions reduced to simple handleAction calls
- **Smart RPC Routing**: Frontend uses fixed `localhost:8545`, framework routes to correct test node
- **Automatic Cleanup**: No manual resource management needed

This same test would have required hundreds of lines of custom wallet automation code before OnchainTestKit. Now it's clean, readable, and maintainable.

### Production CI/CD with OnchainTestKit

Here's how we run these tests at scale in our Verified Pools CI pipeline:

```
# .github/workflows/playwright.yml

jobs:
  e2e-tests:
    # additional setup steps omitted for brevity
    # Install xvfb for headless browser testing

    - name: Install xvfb
      run: |
        sudo apt-get update
        sudo apt-get install -y xvfb

    - name: Install dependencies
      run: yarn install --frozen-lockfile

    - name: Install Playwright Browsers
      run: yarn playwright install --with-deps

    - name: Build application
      run: yarn build
      env:
        NEXT_PUBLIC_BASE_SEPOLIA_RPC_URLS: http://localhost:8545

    - name: Prepare MetaMask Extension
      run: yarn e2e:metamask:prepare

    # Run transaction tests in parallel with 10 workers
    - name: Run Playwright TX tests with xvfb
      run: xvfb-run --auto-servernum --server-args="-screen 0 1280x960x24" yarn playwright test --workers=10 --reporter=list,github
      env:
        E2E_TEST_SEED_PHRASE: ${{ secrets.E2E_TEST_SEED_PHRASE }}
```

**Key Production Features:**

- **Parallel Execution**: --workers=10 runs 10 tests simultaneously, each with isolated blockchain nodes
- **Environment Isolation**: Each test gets its own fork of Base Sepolia without conflicts
- **Robust CI Setup**: Handles headless browser automation with xvfb and proper cleanup

**Results**: Our CI runs 100+ comprehensive onchain app tests in parallel in under 10 minutes.

---

## Try OnchainTestKit Today

OnchainTestKit is available now and has been published to NPM. To get started, check out the documentation and examples in the [GitHub repository](https://github.com/coinbase/onchaintestkit).

## Interested in Improving Onchain Developer Experience?

If increasing the impact of onchain developers piques your interest, please know that our Onchain DevX team would love to meet you! [We're Hiring](https://www.coinbase.com/careers/positions/7081419).
