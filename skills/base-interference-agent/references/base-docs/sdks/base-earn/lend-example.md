> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# End-to-End Lend Examples

> Run a Morpho deposit and synchronous withdrawal, or an Upshift deposit, queued withdrawal, and claim, with the Base Earn API.

These examples use `earn()` and `attribution` from [Call the API](https://docs.base.org/sdks/base-earn/call-the-api.md) and `execute()` from [Execute Calls in a Wallet](https://docs.base.org/sdks/base-earn/execute-calls.md).

## Morpho Earn

This walkthrough shows separate deposit and withdrawal actions. Each requires the user's approval. `execute` represents the wallet integration; `earn` runs on your backend. Application-specific values such as the selected vault, wallet address and slippage tolerance must come from your app.

Discover and validate the vault first, as shown in [List Vaults](https://docs.base.org/sdks/base-earn/api-reference/list-vaults.md).

```typescript TypeScript lines expandable wrap theme={null}
// 1. Discover the approved vault; validate provider and withdrawalMode as above.
// 2. On the user's deposit action, build and execute a deposit.
const assets = (1n * 10n ** BigInt(vault.asset.decimals)).toString();
await execute(await earn("POST", "/lend/deposit", {
  address, vaultId: vault.vaultId, assets, ...attribution,
}));
// 3. After confirmation, refresh the position shown in your UI.
const afterDeposit = await earn("GET", `/lend/positions?address=${address}`);

// 4. Later, on the user's withdrawal action, build a fresh request.
// This example withdraws 1 USDC, not necessarily the entire balance.
await execute(await earn("POST", "/lend/withdraw", {
  address, vaultId: vault.vaultId, assets,
  maxSlippageBps: userSelectedSlippageBps, ...attribution,
}));
const afterWithdrawal = await earn("GET", `/lend/positions?address=${address}`);
```

## Upshift

Deposit, then on a later user action queue a full withdrawal, wait for maturity, and claim. The wallet integration must supply and persist the confirmed claim date; the response date is only an estimate.

```typescript TypeScript lines expandable wrap theme={null}
const address = user.address;
// Use attribution from the server-side helper.

// 1. Resolve the vault.
const { vaults } = await earn("GET", "/lend/vaults?network=base");
const vault = vaults.find(v => v.provider === "upshift" && v.asset.symbol === "cbXRP");
if (!vault) throw new Error("Upshift vault not available");

// 2. Deposit 25 cbXRP (6 decimals).
const assets = (25n * 10n ** BigInt(vault.asset.decimals)).toString();
await execute(await earn("POST", "/lend/deposit", { address, vaultId: vault.vaultId, assets, ...attribution }));

// 3. Later: queue every share for redemption.
const { positions } = await earn("GET", `/lend/positions?address=${address}`);
const position = positions.find(p => p.vaultId === vault.vaultId);
if (!position || BigInt(position.shares) === 0n) throw new Error("No shares to withdraw");
const shares = position.shares;
const req = await earn("POST", "/lend/request-withdraw", { address, vaultId: vault.vaultId, shares, ...attribution });
await execute(req);
const claimDate = confirmedClaimDate; // persist the actual UTC date from the mined request

// 4. After the lag: check, then claim.
const red = await earn("GET", `/lend/redemptions?address=${address}&vaultId=${vault.vaultId}&claimDate=${claimDate}`);
if (red.claimable) {
  await execute(await earn("POST", "/lend/claim", { address, vaultId: vault.vaultId, claimDate, ...attribution }));
} else {
  console.log("not yet:", red.problem); // e.g. TooEarly(); handle the reported error; do not guess another date
}
```

```python Python lines expandable wrap theme={null}
address = user.address
# Use attribution from the server-side helper.

# 1. Resolve the vault.
vaults = earn("GET", "/lend/vaults?network=base")["vaults"]
vault = next(v for v in vaults if v["provider"] == "upshift" and v["asset"]["symbol"] == "cbXRP")

# 2. Deposit 25 cbXRP (6 decimals).
assets = str(25 * 10 ** vault["asset"]["decimals"])
execute(earn("POST", "/lend/deposit", {"address": address, "vaultId": vault["vaultId"], "assets": assets, **attribution}))

# 3. Later: queue every share for redemption.
positions = earn("GET", f"/lend/positions?address={address}")["positions"]
position = next((p for p in positions if p["vaultId"] == vault["vaultId"]), None)
if position is None or int(position["shares"]) == 0:
    raise RuntimeError("No shares to withdraw")
shares = position["shares"]
req = earn("POST", "/lend/request-withdraw", {"address": address, "vaultId": vault["vaultId"], "shares": shares, **attribution})
execute(req)
claim_date = confirmed_claim_date  # persist the actual UTC date from the mined request

# 4. After the lag: check, then claim.
red = earn("GET", f"/lend/redemptions?address={address}&vaultId={vault['vaultId']}&claimDate={claim_date}")
if red["claimable"]:
    execute(earn("POST", "/lend/claim", {"address": address, "vaultId": vault["vaultId"], "claimDate": claim_date, **attribution}))
else:
    print("not yet:", red.get("problem"))  # e.g. TooEarly(); handle the reported error; do not guess another date
```

## Testing and Going Live

* Confirm that the protocol and vault or product you selected are available in your integration.
* Use reads and unsigned-call generation to test without moving funds. Check the returned chain ID before signing. An early-access endpoint can still build Base Mainnet transactions.
* For Morpho Earn, test an approved-vault deposit and a liquidity-dependent synchronous withdrawal, including explicit zero and missing slippage bounds.
* For Upshift, test the full request/wait/claim lifecycle, persist confirmed dates and handle non-claimable entries.
* For Morpho Borrow, test borrowing with existing collateral and adding collateral with borrowing. Verify the fee breakdown, attribution suffix and atomic execution. Confirm position monitoring and repayment work before offering borrowing to users.
* Test reverted receipts and partial sequential execution. Never report success solely because a transaction hash or batch ID was returned.
* Before sending production traffic, verify your endpoint and builder code, test rate-limit handling, and confirm that transactions are attributed to your app.
