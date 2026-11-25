> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Interfaces

> Canonical B20 Solidity interfaces, source links, and copy-paste imports.

B20 interfaces describe the token, factory, and registry precompile surfaces. Use the linked reference for function-level behavior. The canonical Solidity file is in [`base-std`](https://github.com/base/base-std/tree/main/src/interfaces).

## Available Interfaces

| Interface | Documentation | Canonical Solidity source |
| - | - | - |
| `IB20` | [IB20 reference](https://docs.base.org/specifications/b20/reference/interfaces/ib20) | [IB20.sol](https://github.com/base/base-std/blob/main/src/interfaces/IB20.sol) |
| `IB20Asset` | [IB20Asset reference](https://docs.base.org/specifications/b20/reference/interfaces/ib20-asset) | [IB20Asset.sol](https://github.com/base/base-std/blob/main/src/interfaces/IB20Asset.sol) |
| `IB20Stablecoin` | [IB20Stablecoin reference](https://docs.base.org/specifications/b20/reference/interfaces/ib20-stablecoin) | [IB20Stablecoin.sol](https://github.com/base/base-std/blob/main/src/interfaces/IB20Stablecoin.sol) |
| `IB20Factory` | [IB20Factory reference](https://docs.base.org/specifications/b20/reference/interfaces/ib20-factory) | [IB20Factory.sol](https://github.com/base/base-std/blob/main/src/interfaces/IB20Factory.sol) |
| `IPolicyRegistry` | [IPolicyRegistry reference](https://docs.base.org/specifications/b20/reference/interfaces/i-policy-registry) | [IPolicyRegistry.sol](https://github.com/base/base-std/blob/main/src/interfaces/IPolicyRegistry.sol) |
| `IActivationRegistry` | [IActivationRegistry reference](https://docs.base.org/specifications/b20/reference/interfaces/i-activation-registry) | [IActivationRegistry.sol](https://github.com/base/base-std/blob/main/src/interfaces/IActivationRegistry.sol) |
| `IERC8056` | Asset multiplier interfaces | [IERC8056.sol](https://github.com/base/base-std/blob/main/src/interfaces/IERC8056.sol) |
| `IERC165` | Asset interface detection | [IERC165.sol](https://github.com/base/base-std/blob/main/src/interfaces/IERC165.sol) |

## Copy and paste imports

Use these imports with the `base-std/=src/` Foundry remapping.

### IB20

```solidity filename="IB20.sol" theme={null}
import {IB20} from "base-std/interfaces/IB20.sol";
```

### IB20Asset

```solidity filename="IB20Asset.sol" theme={null}
import {IB20Asset} from "base-std/interfaces/IB20Asset.sol";
```

### IB20Stablecoin

```solidity filename="IB20Stablecoin.sol" theme={null}
import {IB20Stablecoin} from "base-std/interfaces/IB20Stablecoin.sol";
```

### IB20Factory

```solidity filename="IB20Factory.sol" theme={null}
import {IB20Factory} from "base-std/interfaces/IB20Factory.sol";
```

### IPolicyRegistry

```solidity filename="IPolicyRegistry.sol" theme={null}
import {IPolicyRegistry} from "base-std/interfaces/IPolicyRegistry.sol";
```

### IActivationRegistry

```solidity filename="IActivationRegistry.sol" theme={null}
import {IActivationRegistry} from "base-std/interfaces/IActivationRegistry.sol";
```

### IERC8056

```solidity filename="IERC8056.sol" theme={null}
import {
    IScaledUIAmount,
    IScaledUIAmountBalances,
    IScaledUIAmountConversion,
    IScaledUIAmountNewUIMultiplier
} from "base-std/interfaces/IERC8056.sol";
```

### IERC165

```solidity filename="IERC165.sol" theme={null}
import {IERC165} from "base-std/interfaces/IERC165.sol";
```

See [`StdPrecompiles`](https://github.com/base/base-std/blob/main/src/StdPrecompiles.sol) for canonical precompile addresses.
