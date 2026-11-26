// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// USDC job escrow for building work, paid in milestones.
/// Flow: poster locks USDC for N milestones and sets a deadline and an arbiter.
/// One worker claims the job. Worker submits a deliverable link per milestone.
/// Poster approves (pays the worker) or disputes. The arbiter resolves disputes.
/// After the deadline, the poster can reclaim any milestone that was never submitted.
/// Unaudited: test with small amounts.
contract JobEscrow {
    using SafeERC20 for IERC20;

    enum MState { Pending, Submitted, Disputed, Paid, Refunded }

    struct Milestone {
        uint256 amount;
        MState state;
        string deliverable; // link or file hash, keep it short
    }

    struct Job {
        address poster;
        address worker;   // address(0) until claimed
        address arbiter;
        uint64 deadline;  // unix seconds
        bool open;        // false once cancelled or fully settled
        string details;
        Milestone[] milestones;
    }

    IERC20 public immutable usdc;
    uint256 public nextId;
    mapping(uint256 => Job) private jobs;

    event JobCreated(uint256 indexed id, address indexed poster, uint256 total, uint64 deadline);
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
    error NoWorker();
    error PastDeadline();
    error BeforeDeadline();
    error BadState();
    error BadInput();

    constructor(IERC20 usdc_) {
        usdc = usdc_;
    }

    /// Lock the sum of `amounts` in USDC. The poster must approve this contract first.
    function createJob(uint256[] calldata amounts, uint64 deadline, address arbiter, string calldata details)
        external returns (uint256 id)
    {
        if (amounts.length == 0 || amounts.length > 20) revert BadInput();
        if (arbiter == address(0) || arbiter == msg.sender) revert BadInput();
        if (deadline <= block.timestamp) revert BadInput();
        uint256 total;
        id = nextId++;
        Job storage j = jobs[id];
        j.poster = msg.sender;
        j.arbiter = arbiter;
        j.deadline = deadline;
        j.open = true;
        j.details = details;
        for (uint256 i = 0; i < amounts.length; i++) {
            if (amounts[i] == 0) revert BadInput();
            total += amounts[i];
            j.milestones.push(Milestone(amounts[i], MState.Pending, ""));
        }
        usdc.safeTransferFrom(msg.sender, address(this), total);
        emit JobCreated(id, msg.sender, total, deadline);
    }

    /// One worker per job. Must be before the deadline.
    function claimJob(uint256 id) external {
        Job storage j = jobs[id];
        if (!j.open) revert NotOpen();
        if (j.worker != address(0)) revert AlreadyClaimed();
        if (block.timestamp >= j.deadline) revert PastDeadline();
        if (msg.sender == j.poster) revert BadInput();
        j.worker = msg.sender;
        emit JobClaimed(id, msg.sender);
    }

    /// Worker submits the deliverable for one milestone. Before the deadline only.
    function submitMilestone(uint256 id, uint256 m, string calldata deliverable) external {
        Job storage j = jobs[id];
        if (!j.open) revert NotOpen();
        if (msg.sender != j.worker) revert NotWorker();
        if (block.timestamp >= j.deadline) revert PastDeadline();
        Milestone storage ms = j.milestones[m];
        if (ms.state != MState.Pending) revert BadState();
        ms.state = MState.Submitted;
        ms.deliverable = deliverable;
        emit MilestoneSubmitted(id, m, deliverable);
    }

    /// Poster approves a submitted milestone and the worker is paid.
    function approveMilestone(uint256 id, uint256 m) external {
        Job storage j = jobs[id];
        if (msg.sender != j.poster) revert NotPoster();
        Milestone storage ms = j.milestones[m];
        if (ms.state != MState.Submitted) revert BadState();
        ms.state = MState.Paid;
        usdc.safeTransfer(j.worker, ms.amount);
        emit MilestonePaid(id, m, ms.amount);
        _maybeClose(id);
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
    function resolveDispute(uint256 id, uint256 m, bool payWorker) external {
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
    function reclaimPending(uint256 id, uint256 m) external {
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
    function cancelUnclaimed(uint256 id) external {
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
        external view returns (address poster, address worker, address arbiter, uint64 deadline, bool open, string memory details, uint256 milestoneCount)
    {
        Job storage j = jobs[id];
        return (j.poster, j.worker, j.arbiter, j.deadline, j.open, j.details, j.milestones.length);
    }

    function milestoneInfo(uint256 id, uint256 m)
        external view returns (uint256 amount, MState state, string memory deliverable)
    {
        Milestone storage ms = jobs[id].milestones[m];
        return (ms.amount, ms.state, ms.deliverable);
    }
}
