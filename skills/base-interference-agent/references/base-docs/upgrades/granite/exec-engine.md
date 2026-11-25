> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# L2 Execution Engine

> Execution engine changes in the Granite upgrade, restricting bn256Pairing precompile input size to prevent unbounded gas consumption.

## EVM Changes

### `bn256Pairing` Precompile Input Restriction

The `bn256Pairing` precompile execution has additional validation on its input.
The precompile reverts if its input is larger than `112687` bytes.
This is the input size that consumes approximately 20 M gas given the latest `bn256Pairing` gas schedule on L2.
