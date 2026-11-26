# blog/demystifying-mtcannon

Source: https://www.base.org/blog/demystifying-mtcannon.md

# Demystifying MTCannon

> Deep dive into the MTCannon implementation.

- Date: 2025-04-23
- Author: Emrah Sariboz
- URL: https://www.base.org/blog/demystifying-mtcannon

**_​​TL;DR:_** _Optimistic rollups rely on fault proofs to verify state transitions, enabling a dispute game between groups of defenders and challengers to resolve inconsistencies. MTCannon is a Fault Proof Virtual Machine (FPVM) that emulates MIPS64 with multithreading, improving execution efficiency and enabling garbage collection. MIPS64.sol is the Solidity contract that verifies a single MIPS instruction within the EVM, ensuring deterministic dispute resolution onchain. In this blog, we deep dive into the implementation details of the MIPS64.sol smart contract._

## What is MIPS64.sol?

Optimistic rollups, such as Optimism and Base, operate on the assumption that every state transition is valid unless proven otherwise. These systems batch transactions offchain, posting minimal data to Ethereum to enhance scalability and reduce costs. To ensure state transition integrity, Optimism and Base rely on fault proofs, allowing anyone to challenge posted states. A dispute game is created for every proposed state root, utilizing a bisection game to resolve disputes. Any party can challenge the posted state. If someone challenges the posted state, a dispute game unfolds between a defender (who asserts the new state is correct) and a challenger (who disputes it). This process narrows the disagreement down to a single state transition step, which is then executed onchain using MIPS64.sol smart contract. \

Multithreaded Cannon (MTCannon) is an FPVM that emulates 64-bit, Big-Endian architecture with built-in multithreading support. MIPS64.sol—architected and developed by Optimism—is the Solidity-based implementation of FPVM used for verifying single MIPS instruction proofs onchain. Unlike its predecessor, the single threaded 32-bit version of Cannon, MTCannon introduces multithreading logic, thread scheduling, synchronization, and management within the emulated environment in order to enable a key feature, garbage collection. Additionally, MTCannon expands the memory architecture from 32-bit to 64-bit, which significantly increases the addressable memory space and enhances the performance for more complex computations.

Although the Ethereum Virtual Machine (EVM) does not natively support multithreading, MIPS64.sol emulates the multithreaded model of MTCannon to maintain consistency with its Golang-based counterpart, which is crucial for handling dispute games deterministically. While both replicate the same state transitions, they serve fundamentally different roles. The Go implementation acts as the offchain executor, handling complex responsibilities like multithreading, scheduling, and garbage collection. On the other hand, MIPS64.sol is the onchain verifier—it doesn’t execute the full program, but rather validates one instruction step at a time by comparing the pre- and post-state. MIPS64.sol deterministically mimics multithreading effects, but doesn’t perform actual multithreading or garbage collection onchain.\

MTCannon executes a single instruction at a time through the step() function, which processes a _Microprocessor without Interlocked Pipeline Stages (MIPS)_ instruction or system call and updates the VM state accordingly. When the challenger and defender reach the maximum depth of the bisection tree—where each leaf represents a single intermediate instruction—the active FaultDisputeGame contract calls step() with a specific instruction to resolve the dispute onchain. The step() function further calls the doStep() function, which handles the main logic for executing the single MIPS instruction.

## Results

Before diving into how MIPS64 works, we present some benchmarking data to showcase MTCannon’s effectiveness. In a previous [blog post](https://www.base.org/blog/scaling-base-accelerating-decentralization) about benchmarking the 32-bit version of Cannon, there were two main precompiles presenting resource constraints: p256Verify was time intensive while ECAdd was memory intensive. We now present benchmarks for these precompiles with MTCannon:

### p256Verify

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime** |
| --------- | ------------- | ---------------- | ------------------------ | -------------------------- |
| 1MGas | 1,000,000 | 3,064,043,857 | 57.82 MB (56% reduction) | 132308 ms (90% reduction) |
| 2MGas | 2,000,000 | 6,201,994,165 | 65.42 MB (50% reduction) | 270057 ms (86% reduction) |
| 3MGas | 3,000,000 | 8,853,403,266 | 70.99 MB (47% reduction) | 390384 ms (85% reduction) |
| 20MGas | 20,000,000 | 27,255,575,058 | 72.31 MB (53% reduction) | 1071496 ms (91% reduction) |

### ECAdd

| **Label** | **Gas Usage** | **Instructions** | **Memory Usage** | **Runtime** |
| --------- | ------------- | ---------------- | ------------------------ | ------------------------- |
| 1MGas | 1,000,000 | 1,782,332,570 | 58.95 MB (59% reduction) | 91368 ms (83% reduction) |
| 2MGas | 2,000,000 | 3,636,652,866 | 66.30 MB (55% reduction) | 183194 ms (68% reduction) |
| 3MGas | 3,000,000 | 5,901,580,072 | 76.88 MB (52% reduction) | 305114 ms (52% reduction) |
| 20MGas | 20,000,000 | 7,877,161,385 | 86.16 MB (65% reduction) | 359238 ms (71% reduction) |

We see that both runtime and memory usage is much lower than before, improving the scalability of Base.

---

## Execution Flow of MIPS64.sol

## State Initialization and Memory Validation

The doStep() function begins by allocating two in-memory structs: **State** and **ThreadState**. These structs are populated using the **\_stateData** and **\_proof** calldata, which store essential execution details, such as the VM’s current state, the active thread’s execution context, the instruction set, etc. The State struct maintains global VM data such as memory roots and execution steps, while ThreadState tracks per-thread execution details, including registers and program counters. The exited field in State determines whether the VM has reached a termination state.\

Before loading any state, the contract performs a series of checks to ensure the compiler actually placed `state` and `thread` structs at the expected memory addresses, validates the free memory pointer, and checks `_stateData.offset` and `_proof.offset` to ensure that the calldata layout actually matches what the function expects. We summarize the checks and the reasoning behind them in the following table:

| **Offset Description** | **Number of bytes** | **Notes** |
| ---------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| State struct | 0x80 = 128 | The state struct should be placed at memory offset 0x80, which is the free memory pointer at the beginning of the function. |
| Thread struct | 0x260 = 608 | The thread struct should be placed at memory offset 0x260. This is computed by: State struct offset (128) + size of state struct (15 fields \* 32 bytes) = 608. The ThreadState struct consists of: 7 individual 32-byte fields (e.g., threadID, exitCode, pc, etc.), 32 registers (each 32 bytes in size) stored as an array, 1 additional slot to store the length of the register array. |
| Free memory pointer | 59 bytes | The free memory pointer must be updated to reflect the expected memory layout, which includes: - 4 reserved memory slots (32 bytes each), - 15 fields from the State struct, - 40 fields from the ThreadState struct. Adding these together: 4 + 15 + 40 = 59 bytes. |
| Stata data offset | 132 bytes | Validates the **\_stateData** offset, ensuring it is set to **132 bytes**, which is derived as follows: - 4 bytes for the function signature - 32 bytes for the pointer to \_stateData (first argument) - 32 bytes for the pointer to \_proof (second argument) - 32 bytes for \_localContext (third argument, fixed bytes32) - 32 bytes for the length of \_stateData, which is required for dynamic arguments. Adding these together: 4 + (32 × 4) = 132 bytes. |
| Proof data offset | 356 bytes | Validates the **\_proof** offset, ensuring it is set to **356 bytes**, which is derived as follows: - 132 bytes for the \_stateData offset. - \_stateData is 188 bytes, which is rounded to the nearest multiple of 32, which is 192. - Next 32 bytes are allocated for the length of \_proof, which is required for dynamic arguments. Adding these together: 132 + 192 + 32 = 356 bytes. |

### Load VM State

Once the validations pass, the following code block loads VM state from calldata into memory. The putField function reads state fields from \_stateData and stores them in memory.

```
function putField(callOffset, memOffset, size) -> callOffsetOut, memOffsetOut { 
... 
} 
// Unpack state from calldata into memory
.
c, m := putField(c, m, 1) 
c, m := putField(c, m, 1) 
exited := mload(sub(m, 32))
.
```

### Validate Execution Constraints

The validity of the state is then checked, namely

- The exit code is valid and to stop execution if exited.
- The current thread stack is non-empty.

### Load and Validate Thread State

Just like loading the VM state from calldata, the following function extracts a ThreadState struct from \_proof (calldata). This process involves:

1. Validating calldata size to ensure it contains enough bytes for a full ThreadState.
2. Extracting each field (e.g., threadID, exitCode, pc, etc.) sequentially.
3. Loading all 32 general-purpose registers (GPRs), which are essential for MIPS execution.

Note: MIPS64 has exactly 32 GPRs.

```
setThreadStateFromCalldata(thread);
```

The contract maintains two thread stacks, leftThreadStack and rightThreadStack, to manage concurrency in a structured manner. The traverseRight flag determines which stack is currently active:\

- If traverseRight == true, the right stack (rightThreadStack) is active.
- If traverseRight == false, the left stack (leftThreadStack) is active.

After loading the thread into memory, the following function computes the hash of the thread and compares it with the active stack’s hash (either leftThreadStack or rightThreadStack). If the computed hash does not match the expected hash, execution reverts to prevent tampering.

```
validateCalldataThreadWitness(state, thread);
```

Depending on the thread state, the program can end execution if the thread has exited or if the amount of time the thread has used exceeds its quantum.

```
if (thread.exited) {
    popThread(state);
    return outputState();
}

if (state.stepsSinceLastContextSwitch >= sys.SCHED_QUANTUM) {
    preemptThread(state, thread);
    return outputState();
}
```

### Instruction Fetching and Decoding

After loading and validating the state, the current instruction to execute is extracted from memory.

```
uint256 insnProofOffset = MIPS64Memory.memoryProofOffset(MEM_PROOF_OFFSET, 0);
(uint32 insn, uint32 opcode, uint32 fun) =
    ins.getInstructionDetails(thread.pc, state.memRoot, insnProofOffset);
```

There are three possible scenarios for this instruction:

1. It is a Linux system call (syscall)
2. It is a read-modify-write (RMW) operation, namely load-linked or store-conditional
3. All other instructions

## Handle System Calls and Atomic Operations

### Syscall

In MIPS64, all instructions are 32 bits long. Each instruction format is determined by the first 6 bits of the instruction, which is known as the opcode. There are three types of instruction: R-, I-, and J-type. R-type instructions rely on a func field (the last 6 bits of the instruction), which together with opcode determines the specific operation inside an R-type instruction.

In MIPS64, syscalls are encoded as R-type instructions. For syscalls, the MIPS64 specification reserves opcode = 0 (which means it’s an R-type instruction) and function code 0xC, which uniquely identifies the system calls.

```
if (opcode == 0 && fun == 0xC) { return handleSyscall(_localContext); }
```

Arguments for syscalls are first retrieved from the GPRs.

```
// Load the syscall numbers and args from the registers

(uint64 syscall_no, uint64 a0, uint64 a1, uint64 a2) =   

    sys.getSyscallArgs(thread.registers);
```

While there are many syscalls, very few impact the VM’s state. As such, only the following syscalls are of interest:

- **mmap, brk, clone, exit_group, read, write, fcntl, gettid, exit, futex, sched_yield, nanosleep, open, clock_gettime, getpid.**

Several system calls are ignored and those that are not specified by its number will cause the call to revert. After executing the syscall, the state is updated and returned.

### Read-Modify-Write (RMW)

Load-Linked (LL) and Store-Conditional (SC) instructions are used to perform atomic operations in MIPS64. LL reads from a memory address and sets a “reservation” with the intent to make a change on it. SC attempts to store a new value into the same memory location only if no other thread has modified the memory (reservation) since the LL instruction was issued. Atomic operations are crucial to prevent race conditions in multithreading runtimes.

```
// Handle RMW (read-modify-write) ops
if (opcode == ins.OP_LOAD_LINKED || opcode == ins.OP_STORE_CONDITIONAL) {
    return handleRMWOps(state, thread, insn, opcode);
}

if (opcode == ins.OP_LOAD_LINKED64 || opcode == ins.OP_STORE_CONDITIONAL64) {
    return handleRMWOps(state, thread, insn, opcode);
}
```

### Execute Instructions

Each thread maintains its own execution context, including CPU scalar values such as registers, program counter (PC), and other architectural state variables. Before executing the instruction, the code first retrieves the CPU state of the current thread with the getCpuScalars function and constructs a coreStepArgs struct to pass the current execution environment context to the MIPS execution engine.

```
st.CpuScalars memory cpu = getCpuScalars(thread);
ins.CoreStepLogicParams memory coreStepArgs = ins.CoreStepLogicParams({
    .
    memProofOffset: MIPS64Memory.memoryProofOffset(MEM_PROOF_OFFSET, 1),
    .
});
```

The actual execution of the MIPS instruction happens in the execMipsCoreStepLogic function:

```
(state.memRoot, memUpdated, effMemAddr) = ins.execMipsCoreStepLogic(coreStepArgs);
```

At a high level, the `execMipsCoreStepLogic` function performs the following steps:

**1. Instruction Decoding & Classification**

- Determines the instruction type (R-type, I-type, or J-type) based on the opcode.
- If the instruction is a jump (J-type), it processes the jump by computing the new program counter (PC) and returns early without further execution.

**2. Operand Retrieval**

- Extracts the source operands (rs, rt) from registers as needed.
- R-type instructions retrieve two source operands (rs and rt), whereas I-type instructions use one register operand (rs) and an immediate value.
- Handles special 64-bit load instructions.

**3. Execution of Arithmetic and Logical Operations (ALU)**

- Executes the core arithmetic/logical operation using the ALU.
- If the instruction is R-type, the function code (funct) determines the exact operation.
- If the instruction is I-type, certain instructions are mapped to equivalent R-type functions.
- If a memory operation (load/store) is involved, it fetches the memory content or prepares to store a value.

**4. State Update – Stores the computed result in the appropriate register or memory location.**

## Update the CPU state

After executing the instruction, the memory state may change depending on the operation performed. The return values of execMipsCoreStepLogic() provide information about these updates:

- Whether memory was modified (\`memUpdated\`).
- The new memory state root (\`state.memRoot\`).
- The affected memory address (\`effMemAddr\`).

Additionally, the CPU scalar values are updated to reflect the execution state, and the thread root is recalculated to maintain consistency in the multi-threaded environment.

```
(state.memRoot, memUpdated, effMemAddr) = ins.execMipsCoreStepLogic(coreStepArgs);

setStateCpuScalars(thread, cpu);
updateCurrentThreadRoot();

if (memUpdated) {
    handleMemoryUpdate(state, effMemAddr);
}
```

And finally, the function concludes by returning the hash of the MIPS state, which encapsulates crucial information such as memory commitments, heap allocation, multithreading stack state, and execution metadata.

As optimistic rollups mature toward full decentralization, fault-proof systems like MTCannon play a crucial role in ensuring trustless and verifiable state transition. By extending to 64-bit architecture and introducing multithreading, MTCannnon enables efficient execution of complex workloads while supporting definitive dispute resolution.

---

## Let’s Build and Secure the Future of Layer 2

Thanks to the efforts of the Optimism team, MIPS64 architecture pushes the boundaries of what’s possible in Layer 2 scalability, security and decentralization. If you’re interested in working on securing L2 systems, explore our open roles [here](https://www.base.org/jobs). You can also follow us [X](https://x.com/base) ([Base team](https://x.com/i/lists/1876354838289932418) and [Base community leaders](https://x.com/i/lists/1869425408573075694)), [Farcaster](https://warpcast.com/base/), and [Discord](https://discord.com/invite/buildonbase?utm_source=dotorg&utm_medium=nav) to stay up-to-date with the latest on Base.

\
