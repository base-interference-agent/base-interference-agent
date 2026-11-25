> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# L1 Block Attributes

> L1 attributes transaction changes in the Isthmus upgrade, extending calldata to include operator fee scalar and constant parameters.

## Overview

The L1 block attributes transaction is updated to include the operator fee parameters.

| Input arg | Type | Calldata bytes | Segment |
| - | - | - | - |
| 160012734 | | 0-3 | n/a |
| baseFeeScalar | uint32 | 4-7 | 1 |
| blobBaseFeeScalar | uint32 | 8-11 | |
| sequenceNumber | uint64 | 12-19 | |
| l1BlockTimestamp | uint64 | 20-27 | |
| l1BlockNumber | uint64 | 28-35 | |
| basefee | uint256 | 36-67 | 2 |
| blobBaseFee | uint256 | 68-99 | 3 |
| l1BlockHash | bytes32 | 100-131 | 4 |
| batcherHash | bytes32 | 132-163 | 5 |
| operatorFeeScalar | uint32 | 164-167 | 6 |
| operatorFeeConstant | uint64 | 168-175 | |

Note that the first input argument, in the same pattern as previous versions of the L1 attributes transaction,
is the function selector: the first four bytes of `keccak256("setL1BlockValuesIsthmus()")`.

In the activation block, there are two possibilities:

* If Isthmus is active at genesis, there are no transactions in the activation block
  and therefore no L1 Block Attributes transaction to consider.
* If Isthmus activates after genesis [`setL1BlockValuesEcotone()`](../ecotone/l1-attributes)
  method must be used. This is because the L1 Block contract will not yet have been upgraded.

In each subsequent L2 block, the `setL1BlockValuesIsthmus()` method must be used.

When using this method, the pre-Isthmus values are migrated over 1:1
and the transaction also sets the following new attributes to the values
from the [`SystemConfig`](https://docs.base.org/specifications/base-protocol/consensus/derivation#system-configuration):

* `operatorFeeScalar`
* `operatorFeeConstant`
