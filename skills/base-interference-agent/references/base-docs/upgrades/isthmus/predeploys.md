> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Predeploys

> Predeploy changes in the Isthmus upgrade, including updates to L1Block and the new OperatorFeeVault contract.

## Overview

### L1Block

#### Interface

##### `setIsthmus`

This function is meant to be called once on the activation block of the Isthmus network upgrade.
It MUST only be callable by the `DEPOSITOR_ACCOUNT` once. When it is called, it MUST call
call each getter for the network specific config and set the returndata into storage.

### GasPriceOracle

Following the Isthmus upgrade, a new method is introduced: `getOperatorFee(uint256)`. This method
returns the operator fee for the given `gasUsed`. The operator fee calculation follows the formula
outlined in the [Operator Fee](https://docs.base.org/upgrades/isthmus/exec-engine.md#operator-fee) section of the execution engine spec.

The value returned by `getOperatorFee(uint256)` is capped at `U256` max value.

### OperatorFeeVault

This vault implements `FeeVault`, like `BaseFeeVault`, `SequencerFeeVault`, and `L1FeeVault`.
No special logic is needed in order to insert or withdraw funds.

Its address will be `0x420000000000000000000000000000000000001b`.

See also [Fee Vaults](https://docs.base.org/upgrades/isthmus/exec-engine.md#fee-vaults).

## Security Considerations
