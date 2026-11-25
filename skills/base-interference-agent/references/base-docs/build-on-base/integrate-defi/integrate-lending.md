> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Integrate Lending

> Let users deposit into Morpho and Upshift vaults on Base and withdraw again through the Base Earn API.

Let users lend assets into third-party vaults on Base through the [Base Earn API](https://docs.base.org/sdks/base-earn/overview.md). Your backend requests unsigned transactions from the API; the user's wallet approves and submits them. Base Earn never signs or holds funds.

> [!NOTE]
>
> The Base Earn API is in developer preview. Upshift Earn is available in early access. Morpho Earn is coming soon.

## Choose a Vault

Call [`GET /lend/vaults?network=base`](https://docs.base.org/sdks/base-earn/api-reference/list-vaults) and select the approved vault for your app by `vaultId`. Do not pick the first catalog result automatically. Read each vault's `withdrawalMode` to choose the exit flow:

| Provider | Asset | `withdrawalMode` | Exit flow |
| - | - | - | - |
| Morpho | USDC | `synchronous` | One [`POST /lend/withdraw`](https://docs.base.org/sdks/base-earn/api-reference/withdraw) with an asset amount and `maxSlippageBps`. No queue or claim step. |
| Upshift | cbXRP | `queued` | [`POST /lend/request-withdraw`](https://docs.base.org/sdks/base-earn/api-reference/request-withdraw) with shares, wait for the claim date, then [`POST /lend/claim`](https://docs.base.org/sdks/base-earn/api-reference/claim). |

Discovery, position reads, and deposits use the same endpoints for both providers. Sending an Upshift vault to `/lend/withdraw`, or a Morpho vault to the queued endpoints, returns `400`.

## Deposit and Withdraw

This Morpho example uses `earn()` and `attribution` from [Call the API](https://docs.base.org/sdks/base-earn/call-the-api.md) and `execute()` from [Execute Calls in a Wallet](https://docs.base.org/sdks/base-earn/execute-calls.md). `earn()` runs on your backend; `execute()` runs in the user's wallet. The Python and Go versions return each batch to the client, which submits it with `execute()`; the Go `earn.Call` helper adds `builderCode` to writes for you. Each write is a separate user action.

```typescript TypeScript lines wrap expandable highlight={2,4,9,14,17,19} theme={null}
// 1. Resolve the approved vault and check its withdrawal mode.
const { vaults } = await earn("GET", "/lend/vaults?network=base");
const vault = vaults.find(v => v.vaultId === configuredVaultId &&
  v.provider === "morpho" && v.withdrawalMode === "synchronous");
if (!vault) throw new Error("Selected Morpho vault is not available");

// 2. Deposit 1 USDC. Amounts are atomic-unit strings; read decimals from discovery.
const assets = (1n * 10n ** BigInt(vault.asset.decimals)).toString();
await execute(await earn("POST", "/lend/deposit", {
  address, vaultId: vault.vaultId, assets, ...attribution,
}));

// 3. After confirmation, refresh the position shown in your UI.
const { positions } = await earn("GET", `/lend/positions?address=${address}`);

// 4. Later, on the user's withdrawal action, build a fresh request.
await execute(await earn("POST", "/lend/withdraw", {
  address, vaultId: vault.vaultId, assets,
  maxSlippageBps: userSelectedSlippageBps, ...attribution,
}));
```

```python Python lines wrap expandable highlight={2,4,10,16,19,21} theme={null}
# 1. Resolve the approved vault and check its withdrawal mode.
vaults = earn("GET", "/lend/vaults?network=base")["vaults"]
vault = next((v for v in vaults if v["vaultId"] == configured_vault_id
              and v["provider"] == "morpho" and v["withdrawalMode"] == "synchronous"), None)
if vault is None:
    raise RuntimeError("Selected Morpho vault is not available")

# 2. Build a 1 USDC deposit. Amounts are atomic-unit strings; read decimals from discovery.
assets = str(1 * 10 ** vault["asset"]["decimals"])
deposit_batch = earn("POST", "/lend/deposit", {
    "address": address, "vaultId": vault["vaultId"], "assets": assets, **attribution,
})
# Return deposit_batch to the client, which submits it with execute().

# 3. After the client confirms execution, refresh the position shown in your UI.
positions = earn("GET", f"/lend/positions?address={address}")["positions"]

# 4. Later, on the user's withdrawal action, build a fresh request.
withdraw_batch = earn("POST", "/lend/withdraw", {
    "address": address, "vaultId": vault["vaultId"], "assets": assets,
    "maxSlippageBps": user_selected_slippage_bps, **attribution,
})
# Return withdraw_batch to the client, which submits it with execute().
```

```go Go lines wrap expandable highlight={14,26,39,46,51,53} theme={null}
// earn.Call adds builderCode to every write and returns raw JSON.
// Return each write's batch to the client, which submits it with execute().
type Vault struct {
	VaultID        string `json:"vaultId"`
	Provider       string `json:"provider"`
	WithdrawalMode string `json:"withdrawalMode"`
	Asset          struct {
		Decimals int `json:"decimals"`
	} `json:"asset"`
}

// 1. Resolve the approved vault and check its withdrawal mode.
func findMorphoVault(configuredVaultID string) (*Vault, error) {
	raw, err := earn.Call("GET", "/lend/vaults?network=base", nil)
	if err != nil {
		return nil, err
	}
	var catalog struct {
		Vaults []Vault `json:"vaults"`
	}
	if err := json.Unmarshal(raw, &catalog); err != nil {
		return nil, err
	}
	for i, v := range catalog.Vaults {
		if v.VaultID == configuredVaultID &&
			v.Provider == "morpho" && v.WithdrawalMode == "synchronous" {
			return &catalog.Vaults[i], nil
		}
	}
	return nil, errors.New("selected Morpho vault is not available")
}

// 2. Build a 1 USDC deposit. Amounts are atomic-unit strings; read decimals from discovery.
func oneToken(vault *Vault) string {
	return new(big.Int).Exp(big.NewInt(10), big.NewInt(int64(vault.Asset.Decimals)), nil).String()
}

func buildDeposit(address string, vault *Vault) ([]byte, error) {
	return earn.Call("POST", "/lend/deposit", map[string]any{
		"address": address, "vaultId": vault.VaultID, "assets": oneToken(vault),
	})
}

// 3. After the client confirms execution, refresh the position shown in your UI.
func readPositions(address string) ([]byte, error) {
	return earn.Call("GET", "/lend/positions?address="+address, nil)
}

// 4. Later, on the user's withdrawal action, build a fresh request.
func buildWithdraw(address string, vault *Vault, userSelectedSlippageBps int) ([]byte, error) {
	return earn.Call("POST", "/lend/withdraw", map[string]any{
		"address": address, "vaultId": vault.VaultID, "assets": oneToken(vault),
		"maxSlippageBps": userSelectedSlippageBps,
	})
}
```

`maxSlippageBps` is required for withdrawals: an integer from `0` through `9999`, where `50` means 0.5%. Use the tolerance the user chose. Deposits do not accept a slippage bound, so do not present estimated shares as a guaranteed minimum.

For the Upshift deposit, queued withdrawal, and claim, see [End-to-End Lend Examples](https://docs.base.org/sdks/base-earn/lend-example.md#upshift). Persist the claim date confirmed from the mined request; `estimatedClaimDate` is only an estimate and can roll to the next UTC day.

> [!WARNING]
>
> Yield is variable and funds are exposed to protocol risk. Withdrawals depend on available liquidity and protocol conditions, and a position's current value is not guaranteed withdrawal proceeds. Show the action, assets, and approvals before the user signs, wait for successful execution, and request fresh calls rather than replaying an old batch.

## See Also

> [card] [Base Earn API](https://docs.base.org/sdks/base-earn/overview.md)
>
> Supported protocols, endpoints, and quick start.

> [card] [Concepts](https://docs.base.org/sdks/base-earn/concepts.md)
>
> Withdrawal modes, atomic units, slippage bounds, and queued withdrawals.

> [card] [End-to-End Lend Examples](https://docs.base.org/sdks/base-earn/lend-example.md)
>
> Morpho and Upshift walkthroughs, plus testing guidance.

> [card] [Integrate an Earn Product](https://docs.base.org/build-on-base/integrate-defi/integrate-earn-product.md)
>
> Design a one-deposit earn experience on the same API.
