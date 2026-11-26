// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// ERC-4626 vault where only the owner can deposit and withdraw.
/// Shares are minted to and burned from the owner. Unaudited: test with small amounts.
contract OwnerVault is ERC4626, Ownable {
    constructor(IERC20 asset_, string memory name_, string memory symbol_, address owner_)
        ERC20(name_, symbol_)
        ERC4626(asset_)
        Ownable(owner_)
    {}

    function deposit(uint256 assets, address receiver)
        public override onlyOwner returns (uint256)
    {
        require(receiver == owner(), "receiver must be owner");
        return super.deposit(assets, receiver);
    }

    function mint(uint256 shares, address receiver)
        public override onlyOwner returns (uint256)
    {
        require(receiver == owner(), "receiver must be owner");
        return super.mint(shares, receiver);
    }

    function withdraw(uint256 assets, address receiver, address shareOwner)
        public override onlyOwner returns (uint256)
    {
        require(receiver == owner() && shareOwner == owner(), "owner only");
        return super.withdraw(assets, receiver, shareOwner);
    }

    function redeem(uint256 shares, address receiver, address shareOwner)
        public override onlyOwner returns (uint256)
    {
        require(receiver == owner() && shareOwner == owner(), "owner only");
        return super.redeem(shares, receiver, shareOwner);
    }
}
