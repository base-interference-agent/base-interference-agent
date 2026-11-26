// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// USDC bounty escrow. The poster locks USDC, a claimant asks to do the task,
/// and the poster approves the payout (or rejects the claim, or cancels for a refund).
/// Only the poster can move money out. Unaudited: test with small amounts.
contract BountyEscrow {
    using SafeERC20 for IERC20;

    struct Bounty {
        address poster;
        address claimant; // address(0) when nobody has claimed
        uint256 amount;   // USDC base units (6 decimals)
        bool open;        // false once paid out or cancelled
        string details;   // short task description or link (keep it short)
    }

    IERC20 public immutable usdc;
    uint256 public nextId;
    mapping(uint256 => Bounty) public bounties;

    event BountyCreated(uint256 indexed id, address indexed poster, uint256 amount);
    event ClaimSubmitted(uint256 indexed id, address indexed claimant);
    event ClaimRejected(uint256 indexed id, address indexed claimant);
    event PaidOut(uint256 indexed id, address indexed claimant, uint256 amount);
    event Cancelled(uint256 indexed id, uint256 refund);

    error NotPoster();
    error NotOpen();
    error NoClaim();
    error ClaimExists();
    error ZeroAmount();

    constructor(IERC20 usdc_) {
        usdc = usdc_;
    }

    /// Lock `amount` USDC for a task. The poster must approve this contract first.
    function createBounty(uint256 amount, string calldata details) external returns (uint256 id) {
        if (amount == 0) revert ZeroAmount();
        id = nextId++;
        bounties[id] = Bounty(msg.sender, address(0), amount, true, details);
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        emit BountyCreated(id, msg.sender, amount);
    }

    /// Anyone can ask to do the task. One claimant at a time.
    function submitClaim(uint256 id) external {
        Bounty storage b = bounties[id];
        if (!b.open) revert NotOpen();
        if (b.claimant != address(0)) revert ClaimExists();
        b.claimant = msg.sender;
        emit ClaimSubmitted(id, msg.sender);
    }

    /// Poster rejects the current claim so someone else can claim.
    function rejectClaim(uint256 id) external {
        Bounty storage b = bounties[id];
        if (msg.sender != b.poster) revert NotPoster();
        if (!b.open) revert NotOpen();
        if (b.claimant == address(0)) revert NoClaim();
        emit ClaimRejected(id, b.claimant);
        b.claimant = address(0);
    }

    /// Poster approves the work and pays the claimant.
    function approvePayout(uint256 id) external {
        Bounty storage b = bounties[id];
        if (msg.sender != b.poster) revert NotPoster();
        if (!b.open) revert NotOpen();
        if (b.claimant == address(0)) revert NoClaim();
        b.open = false;
        uint256 amount = b.amount;
        address to = b.claimant;
        usdc.safeTransfer(to, amount);
        emit PaidOut(id, to, amount);
    }

    /// Poster cancels an open bounty that hasn't been paid and gets the USDC back.
    function cancel(uint256 id) external {
        Bounty storage b = bounties[id];
        if (msg.sender != b.poster) revert NotPoster();
        if (!b.open) revert NotOpen();
        b.open = false;
        uint256 amount = b.amount;
        usdc.safeTransfer(b.poster, amount);
        emit Cancelled(id, amount);
    }
}
