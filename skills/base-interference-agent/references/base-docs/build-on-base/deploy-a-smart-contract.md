> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Deploy a Smart Contract

> How smart contracts work on Base, which Foundry versions support Base's native precompiles and the Denim upgrade, and how to deploy a contract to Base Sepolia with Foundry.

Base is an EVM-equivalent Ethereum L2. Smart contracts are written in Solidity or Vyper and deploy exactly as they do on Ethereum — the same bytecode, ABIs, and tooling apply.

## Token Standards

A token standard implemented as a smart contract deploys on Base as it does on Ethereum. That includes [ERC-20](https://eips.ethereum.org/EIPS/eip-20), [ERC-721](https://eips.ethereum.org/EIPS/eip-721), [ERC-1155](https://eips.ethereum.org/EIPS/eip-1155), [ERC-4626](https://eips.ethereum.org/EIPS/eip-4626) vaults, and permissioned-token designs such as [ERC-3643](https://eips.ethereum.org/EIPS/eip-3643) and the [ERC-1400](https://github.com/ethereum/EIPs/issues/1411) security token proposal. You or your provider deploy and maintain these contracts, and upgrade them if the implementation is upgradeable. The Base node does not implement them as native precompiles; they run as ordinary contract bytecode on the EVM.

[B20](https://docs.base.org/specifications/b20.md) is Base's native token standard. It is implemented by precompiles in the node. It keeps selector and behavior parity with the core ERC-20 methods and events, so tools that use those methods and events work with B20 tokens. B20 method and event signatures are part of the chain's consensus surface, and B20 changes ship at [network upgrade](https://docs.base.org/upgrades/overview.md) boundaries. Existing selectors do not change and new functionality ships by addition, but an upgrade can include breaking behavior changes. Check the [B20 changelog](https://docs.base.org/specifications/b20/changelog.md) for the changes in each upgrade.

## How Base Differs

Base adds **native precompiles** at fixed addresses that extend the EVM with functionality built into the node itself, such as the [B20 token standard](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md), the PolicyRegistry, and the B20 Factory. These addresses hold no contract bytecode, so a local EVM that does not implement them reverts when a contract calls them.

[Foundry](https://getfoundry.sh/) v1.8.4 and later implement Base's precompiles in `forge`, `cast`, `anvil`, and `chisel`. Foundry v1.9.0 and later also run the [Denim](https://docs.base.org/upgrades/denim/overview.md) upgrade, which is live on Base Mainnet and Base Sepolia. Enable Base by setting a Base hardfork, as shown below.

> [!WARNING]
>
> Foundry versions before v1.8.4 do not implement Base's precompiles. A contract that reads or writes a Base precompile, for example one that deploys or calls a [B20 token](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md), fails in local tests and simulations under those versions.

## Set Up Your Environment

1. Create a new project directory

```bash Terminal theme={null}
mkdir my-base-project && cd my-base-project
```

2. Install Foundry v1.9.0 or later

```bash Terminal theme={null}
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Run `forge --version` to confirm the version.

3. Initialize a new Solidity project

```bash Terminal theme={null}
forge init
```

4. Enable Base's precompiles for local tests by adding a Base hardfork to the `[profile.default]` section of `foundry.toml`. `base:Denim` matches the upgrade that is live on Base Mainnet and Base Sepolia:

```toml foundry.toml theme={null}
hardfork = "base:Denim"
```

Your project is ready. You'll find an example `Counter` contract in `src/Counter.sol`, which you can replace with your own contracts.

> [!TIP]
>
> See [Foundry for Base](https://docs.base.org/sdks/base-anvil.md) for how to enable Base in `anvil` and forks, which hardfork value to use, and how Foundry relates to Base's [base-anvil](https://github.com/base/base-anvil) fork.

## Configure a Node Connection and Deployer Key

1. Create a `.env` file in your project root and add the Base RPC URLs

```bash .env theme={null}
BASE_RPC_URL="https://mainnet.base.org"
BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"
```

2. Load the variables

```bash Terminal theme={null}
source .env
```

3. Store your deployer private key in Foundry's secure keystore

```bash Terminal theme={null}
cast wallet import deployer --interactive
```

Enter your private key and a password when prompted. The key is stored in `~/.foundry/keystores`, which is not tracked by git.

> [!WARNING]
>
> Never share or commit your private key. Always keep it secure and handle it with care.

> [!TIP]
>
> Base Sepolia is the test network for Base, used for the rest of this guide. Get free Base Sepolia ETH from one of the [faucets listed on the Get Funds page](https://docs.base.org/get-started/get-funds.md#testnet-base-sepolia).

## Deploy a Contract

1. (Optional) Dry-run the deployment to confirm your configuration:

```bash Terminal theme={null}
forge create ./src/Counter.sol:Counter --rpc-url $BASE_SEPOLIA_RPC_URL --account deployer
```

This simulates the deployment without broadcasting. You'll see the transaction details and contract ABI, but nothing is deployed.

2. Deploy by adding the `--broadcast` flag:

```bash Terminal theme={null}
forge create ./src/Counter.sol:Counter --rpc-url $BASE_SEPOLIA_RPC_URL --account deployer --broadcast
```

The contract path format is `<contract-path>:<contract-name>`.

3. On success you'll see the deployed address:

```text Example Output theme={null}
Deployer: 0x...
Deployed to: 0x...  <-- YOUR CONTRACT ADDRESS
Transaction hash: 0x...
```

## Verify Your Deployment

1. Check the transaction on [Sepolia Basescan](https://sepolia.basescan.org/) using the transaction hash.
2. Read the contract's state from the command line:

```bash Terminal theme={null}
cast call <CONTRACT_ADDRESS> "number()(uint256)" --rpc-url $BASE_SEPOLIA_RPC_URL
```

This returns the initial value of the `Counter` contract's `number` variable, `0`.

## Next Steps

> [card] [B20 Token Standard](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md)
>
> Launch Base's native token standard, built in at the precompile level.

> [card] [Connect to Base](https://docs.base.org/get-started/connect-to-base.md)
>
> Network details, RPC endpoints, and wallet configuration.

Use [wagmi](https://wagmi.sh) or [viem](https://viem.sh) to connect your frontend to your contracts, and see the [Foundry scripting guide](https://www.getfoundry.sh/forge/scripting) for command-line interaction.
