// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// USDC job escrow for building work, paid in milestones.
/// Poster locks USDC for N milestones with a deadline, an arbiter, and a review window.
/// Worker claims the job and submits a deliverable link per milestone.
/// Poster approves or disputes. If the poster does nothing for the review window,
/// the worker can release the milestone. The arbiter resolves disputes.
/// After the deadline, the poster can reclaim milestones that were never submitted.
/// Asset must be a standard ERC-20 (for example USDC). Fee-on-transfer tokens are rejected.
/// Unaudited: test with small amounts.
contract JobEscrow {
    using SafeERC20 for IERC20;

    enum MState { Pending, Submitted, Disputed, Paid, Refunded }

    struct Milestone {
        uint256 amount;
        MState state;
        uint64 submittedAt;
        string deliverable; // link or file hash, keep it short
    }

    struct Job {
        address poster;
        address worker;   // address(0) until claimed
        address arbiter;
        uint64 deadline;     // unix seconds
        uint64 reviewWindow; // seconds the poster has to act on a submitted milestone
        bool open;
        string details;
        Milestone[] milestones;
    }

    IERC20 public immutable usdc;
    uint256 public nextId;
    uint64 public constant MIN_REVIEW_WINDOW = 1 days;
    uint64 public constant MAX_REVIEW_WINDOW = 90 days;
    uint256 private _lock = 1;
    mapping(uint256 => Job) private jobs;

    event JobCreated(uint256 indexed id, address indexed poster, uint256 total, uint64 deadline, uint64 reviewWindow);
    event JobClaimed(uint256 indexed id, address indexed worker);
    event MilestoneSubmitted(uint256 indexed id, uint256 indexed m, string deliverable);
    event MilestonePaid(uint256 indexed id, uint256 indexed m, uint256 amount);
    event MilestoneDisputed(uint256 indexed id, uint256 indexed m);
    event DisputeResolved(uint256 indexed id, uint256 indexed m, bool paidWorker);
    event Refunded(uint256 indexed id, uint256 amount);
    event JobCancelled(uint256 indexed id, uint256 amount);

    error NotPoster();
    error NotWorker();
    error NotArbiter();
    error NotOpen();
    error AlreadyClaimed();
    error PastDeadline();
    error BeforeDeadline();
    error BadState();
    error BadInput();
    error ReviewWindowNotOver();
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

    /// Lock the sum of `amounts`. The poster must approve this contract first.
    function createJob(
        uint256[] calldata amounts,
        uint64 deadline,
        address arbiter,
        string calldata details,
        uint64 reviewWindow
    ) external nonReentrant returns (uint256 id) {
        if (amounts.length == 0 || amounts.length > 20) revert BadInput();
        if (arbiter == address(0) || arbiter == msg.sender) revert BadInput();
        if (deadline <= block.timestamp) revert BadInput();
        if (reviewWindow < MIN_REVIEW_WINDOW || reviewWindow > MAX_REVIEW_WINDOW) revert BadInput();
        uint256 total;
        id = nextId++;
        Job storage j = jobs[id];
        j.poster = msg.sender;
        j.arbiter = arbiter;
        j.deadline = deadline;
        j.reviewWindow = reviewWindow;
        j.open = true;
        j.details = details;
        for (uint256 i = 0; i < amounts.length; i++) {
            if (amounts[i] == 0) revert BadInput();
            total += amounts[i];
            j.milestones.push(Milestone(amounts[i], MState.Pending, 0, ""));
        }
        _pullExact(msg.sender, total);
        emit JobCreated(id, msg.sender, total, deadline, reviewWindow);
    }

    /// One worker per job, before the deadline.
    function claimJob(uint256 id) external {
        Job storage j = jobs[id];
        if (!j.open) revert NotOpen();
        if (j.worker != address(0)) revert AlreadyClaimed();
        if (block.timestamp >= j.deadline) revert PastDeadline();
        if (msg.sender == j.poster) revert BadInput();
        j.worker = msg.sender;
        emit JobClaimed(id, msg.sender);
    }

    /// Worker submits the deliverable for one milestone, before the deadline.
    function submitMilestone(uint256 id, uint256 m, string calldata deliverable) external {
        Job storage j = jobs[id];
        if (!j.open) revert NotOpen();
        if (msg.sender != j.worker) revert NotWorker();
        if (block.timestamp >= j.deadline) revert PastDeadline();
        Milestone storage ms = j.milestones[m];
        if (ms.state != MState.Pending) revert BadState();
        ms.state = MState.Submitted;
        ms.submittedAt = uint64(block.timestamp);
        ms.deliverable = deliverable;
        emit MilestoneSubmitted(id, m, deliverable);
    }

    /// Poster approves a submitted milestone; the worker is paid.
    function approveMilestone(uint256 id, uint256 m) external nonReentrant {
        Job storage j = jobs[id];
        if (msg.sender != j.poster) revert NotPoster();
        _pay(id, m);
    }

    /// Worker releases a submitted milestone if the poster didn't approve or dispute it within the review window.
    function releaseAfterReview(uint256 id, uint256 m) external nonReentrant {
        Job storage j = jobs[id];
        if (msg.sender != j.worker) revert NotWorker();
        Milestone storage ms = j.milestones[m];
        if (ms.state != MState.Submitted) revert BadState();
        if (block.timestamp < uint256(ms.submittedAt) + j.reviewWindow) revert ReviewWindowNotOver();
        _pay(id, m);
    }

    /// Poster or worker disputes a submitted milestone. The arbiter decides.
    function disputeMilestone(uint256 id, uint256 m) external {
        Job storage j = jobs[id];
        if (msg.sender != j.poster && msg.sender != j.worker) revert BadInput();
        Milestone storage ms = j.milestones[m];
        if (ms.state != MState.Submitted) revert BadState();
        ms.state = MState.Disputed;
        emit MilestoneDisputed(id, m);
    }

    /// Arbiter resolves a dispute: pay the worker, or refund the poster.
    function resolveDispute(uint256 id, uint256 m, bool payWorker) external nonReentrant {
        Job storage j = jobs[id];
        if (msg.sender != j.arbiter) revert NotArbiter();
        Milestone storage ms = j.milestones[m];
        if (ms.state != MState.Disputed) revert BadState();
        if (payWorker) {
            ms.state = MState.Paid;
            usdc.safeTransfer(j.worker, ms.amount);
            emit MilestonePaid(id, m, ms.amount);
        } else {
            ms.state = MState.Refunded;
            usdc.safeTransfer(j.poster, ms.amount);
            emit Refunded(id, ms.amount);
        }
        emit DisputeResolved(id, m, payWorker);
        _maybeClose(id);
    }

    /// Poster takes back a milestone that was never submitted, after the deadline.
    function reclaimPending(uint256 id, uint256 m) external nonReentrant {
        Job storage j = jobs[id];
        if (msg.sender != j.poster) revert NotPoster();
        if (block.timestamp < j.deadline) revert BeforeDeadline();
        Milestone storage ms = j.milestones[m];
        if (ms.state != MState.Pending) revert BadState();
        ms.state = MState.Refunded;
        usdc.safeTransfer(j.poster, ms.amount);
        emit Refunded(id, ms.amount);
        _maybeClose(id);
    }

    /// Poster cancels a job nobody has claimed and gets everything back.
    function cancelUnclaimed(uint256 id) external nonReentrant {
        Job storage j = jobs[id];
        if (msg.sender != j.poster) revert NotPoster();
        if (!j.open) revert NotOpen();
        if (j.worker != address(0)) revert AlreadyClaimed();
        j.open = false;
        uint256 total;
        for (uint256 i = 0; i < j.milestones.length; i++) {
            Milestone storage ms = j.milestones[i];
            ms.state = MState.Refunded;
            total += ms.amount;
        }
        usdc.safeTransfer(j.poster, total);
        emit JobCancelled(id, total);
    }

    function _pay(uint256 id, uint256 m) internal {
        Job storage j = jobs[id];
        Milestone storage ms = j.milestones[m];
        if (ms.state != MState.Submitted) revert BadState();
        ms.state = MState.Paid;
        usdc.safeTransfer(j.worker, ms.amount);
        emit MilestonePaid(id, m, ms.amount);
        _maybeClose(id);
    }

    function _pullExact(address from, uint256 amount) internal {
        uint256 before = usdc.balanceOf(address(this));
        usdc.safeTransferFrom(from, address(this), amount);
        if (usdc.balanceOf(address(this)) - before != amount) revert TransferAmountMismatch();
    }

    function _maybeClose(uint256 id) internal {
        Job storage j = jobs[id];
        for (uint256 i = 0; i < j.milestones.length; i++) {
            MState s = j.milestones[i].state;
            if (s == MState.Pending || s == MState.Submitted || s == MState.Disputed) return;
        }
        j.open = false;
    }

    // ---- views ----
    function jobInfo(uint256 id)
        external view returns (address poster, address worker, address arbiter, uint64 deadline, bool open, string memory details, uint256 milestoneCount, uint64 reviewWindow)
    {
        Job storage j = jobs[id];
        return (j.poster, j.worker, j.arbiter, j.deadline, j.open, j.details, j.milestones.length, j.reviewWindow);
    }

    function milestoneInfo(uint256 id, uint256 m)
        external view returns (uint256 amount, MState state, uint64 submittedAt, string memory deliverable)
    {
        Milestone storage ms = jobs[id].milestones[m];
        return (ms.amount, ms.state, ms.submittedAt, ms.deliverable);
    }
}
