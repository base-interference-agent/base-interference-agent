> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Standard Bridges

> Specification of the standard bridge contracts enabling cross-domain ETH and ERC-20 token transfers between L1 and L2 on Base.

The standard bridges support cross-domain ETH and ERC-20 transfers between Ethereum (L1) and Base (L2). They are built on top of the [cross-domain messenger contracts](https://docs.base.org/specifications/base-protocol/bridging/cross-domain-messengers.md) and provide a standard interface for moving tokens between domains.

For the underlying transaction mechanisms, see [Deposits](https://docs.base.org/specifications/base-protocol/bridging/deposits.md) and [Withdrawals](https://docs.base.org/specifications/base-protocol/bridging/withdrawals.md).

## Overview

The standard bridges are responsible for allowing cross domain
ETH and ERC20 token transfers. They are built on top of the cross domain
messenger contracts and give a standard interface for depositing tokens.

The bridge works for both L1 native tokens and L2 native tokens. The legacy API
is preserved to ensure that existing applications will not experience any
problems with the Bedrock `StandardBridge` contracts.

The `L2StandardBridge` is a predeploy contract located at
`0x4200000000000000000000000000000000000010`.

```solidity StandardBridge.sol lines wrap expandable theme={null}
interface StandardBridge {
    event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData);
    event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData);
    event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData);
    event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData);

    function bridgeERC20(address _localToken, address _remoteToken, uint256 _amount, uint32 _minGasLimit, bytes memory _extraData) external;
    function bridgeERC20To(address _localToken, address _remoteToken, address _to, uint256 _amount, uint32 _minGasLimit, bytes memory _extraData) external;
    function bridgeETH(uint32 _minGasLimit, bytes memory _extraData) payable external;
    function bridgeETHTo(address _to, uint32 _minGasLimit, bytes memory _extraData) payable external;
    function deposits(address, address) view external returns (uint256);
    function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes memory _extraData) external;
    function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes memory _extraData) payable external;
    function messenger() view external returns (address);
    function OTHER_BRIDGE() view external returns (address);
}
```

## Upgradability

Both the L1 and L2 standard bridges should be behind upgradable proxies.
