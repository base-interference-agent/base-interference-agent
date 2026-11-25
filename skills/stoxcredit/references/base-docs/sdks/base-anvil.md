> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Foundry for Base

> Build and test Base contracts with Foundry v1.8.4 or later, which runs Base's native precompiles, and v1.9.0 or later for the Denim upgrade. Set a Base hardfork to enable them locally.

[Foundry](https://getfoundry.sh/) v1.8.4 and later run Base natively in `forge`, `cast`, `anvil`, and `chisel`, including Base's hardforks and native precompiles: the [B20 token factory](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md), B20 tokens, the PolicyRegistry, and the ActivationRegistry. Foundry v1.9.0 and later also run the [Denim](https://docs.base.org/upgrades/denim/overview.md) upgrade, which is live on Base Mainnet and Base Sepolia.

> [!WARNING]
>
> Foundry versions before v1.8.4 do not implement Base's precompiles. Their addresses hold no contract bytecode, so a call to them reverts in a local test or simulation. Run `forge --version` and upgrade if it reports an earlier version.

## Install

Install or upgrade to the latest stable Foundry:

```bash Terminal theme={null}
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

To pin a version, run `foundryup --install <version>`, for example `foundryup --install v1.9.0`.

## Enable Base

Foundry runs Ethereum by default. How you turn on Base depends on where the code executes:

| Where it runs | How to enable Base |
| - | - |
| `forge test` and `forge script` locally | Set `hardfork = "base:Denim"` in `foundry.toml`, or pass `--hardfork base:Denim` |
| A local `anvil` node | `anvil --hardfork base:Denim` |
| A fork of Base Mainnet or Base Sepolia | Pass `--fork-url`; Foundry detects Base from the chain ID. Also pass `--hardfork base:Denim` (see below) |
| `cast` against a live Base RPC | Nothing; the Base node executes the precompiles |

To enable Base for every command in a project, add the hardfork to `foundry.toml`:

```toml foundry.toml theme={null}
[profile.default]
src = "src"
out = "out"
libs = ["lib"]
hardfork = "base:Denim"
```

> [!NOTE]
>
> **Set the hardfork explicitly.** `--network base` without `--hardfork` runs `forge` on the Azul upgrade, which predates the B20 and PolicyRegistry precompiles, so calls to them revert. As of v1.9.0, Foundry's built-in Base upgrade schedule ends at Beryl, so a fork of Base Mainnet also runs Beryl rules unless you pass `--hardfork base:Denim`.

## Pick a Base Upgrade

The hardfork value selects which Base upgrade's rules and precompiles Foundry runs. Use the upgrade that is live on the network you target; see the [network upgrades schedule](https://docs.base.org/upgrades/overview.md).

| Value | Base precompiles |
| - | - |
| `base:Azul` | None |
| `base:Beryl` | B20 factory, B20 tokens, PolicyRegistry, ActivationRegistry |
| `base:Cobalt` | Beryl's precompiles with Cobalt's B20 changes |
| `base:Denim` | Cobalt's precompiles with Denim's B20 and PolicyRegistry changes (requires Foundry v1.9.0 or later) |

## base-anvil

[base-anvil](https://github.com/base/base-anvil) is Base's fork of Foundry. It installs `base-forge`, `base-cast`, `base-anvil`, and `base-chisel` alongside stock Foundry and enables Base precompiles by default. Pin a release with `base-foundryup --install <version>`.

The B20 issuance guides' samples still target base-anvil `v1.1.1` and use `base-cast`. Those commands call a live Base RPC, so they also run unchanged with `cast` from Foundry v1.8.4 or later.

| Command | Foundry v1.9.0+ equivalent |
| - | - |
| `base-forge` | `forge` with `hardfork = "base:Denim"` |
| `base-cast` | `cast` |
| `base-anvil` | `anvil --hardfork base:Denim` |
| `base-chisel` | `chisel` |

For new projects, use Foundry v1.9.0 or later.

## Next Steps

> [card] [Deploy a Smart Contract](https://docs.base.org/build-on-base/deploy-a-smart-contract.md)
>
> Deploy a contract to Base Sepolia with Foundry, end to end.

> [card] [B20 Token Standard](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md)
>
> Launch Base's native token standard from the command line.
