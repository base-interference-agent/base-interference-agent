// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// USDC bounty escrow. The poster locks USDC, a claimant asks to do the task, and the poster
/// approves the payout, rejects the claim, or cancels for a refund.
/// TRUST MODEL: the poster decides. A claimant has no on-chain protection after submitting work.
/// The poster can reject the claim and then cancel. For anything non-trivial, use JobEscrow
/// (it has an arbiter and a review window).
/// Asset must be a standard ERC-20 (for example USDC). Fee-on-transfer tokens are rejected.
/// Unaudited: test with small amounts.
contract BountyEscrow {
    using SafeERC20 for IERC20;

    struct Bounty {
        address poster;
        address claimant; // address(0) when nobody has claimed
        uint256 amount;
        bool open;
        string details;
    }

    IERC20 public immutable usdc;
    uint256 public nextId;
    uint256 private _lock = 1;
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
    error ClaimActive();
    error ZeroAmount();
    error TransferAmountMismatch();
    error Reentrant();

    modifier nonReentrant() {
        if (_lock != 1) revert Reentrant();
        _lock = 2;
        _;
        _lock = 1;
    }

    constructor(IERC20 usdc_) {
        usdc = usdc_;
    }

    function createBounty(uint256 amount, string calldata details) external nonReentrant returns (uint256 id) {
        if (amount == 0) revert ZeroAmount();
        id = nextId++;
        bounties[id] = Bounty(msg.sender, address(0), amount, true, details);
        uint256 before = usdc.balanceOf(address(this));
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        if (usdc.balanceOf(address(this)) - before != amount) revert TransferAmountMismatch();
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
    function approvePayout(uint256 id) external nonReentrant {
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

    /// Poster cancels an open bounty with no active claim, and gets the USDC back.
    /// To cancel after a claim, the poster must reject the claim first.
    function cancel(uint256 id) external nonReentrant {
        Bounty storage b = bounties[id];
        if (msg.sender != b.poster) revert NotPoster();
        if (!b.open) revert NotOpen();
        if (b.claimant != address(0)) revert ClaimActive();
        b.open = false;
        uint256 amount = b.amount;
        usdc.safeTransfer(b.poster, amount);
        emit Cancelled(id, amount);
    }
}
