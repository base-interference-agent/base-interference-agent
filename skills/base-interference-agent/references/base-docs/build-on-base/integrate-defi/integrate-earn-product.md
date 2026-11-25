> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Integrate an Earn Product

> Build a one-deposit earn experience on Base with the Base Earn API: a vault catalog, live positions, and redeemable value.

Give users a simple earn product: they pick a vault, deposit once, and watch the value of their position. The [Base Earn API](https://docs.base.org/sdks/base-earn/overview.md) supplies the vault catalog, position values, and unsigned transactions, so your app focuses on the experience while the user's existing wallet signs every action.

> [!NOTE]
>
> The Base Earn API is in developer preview. Upshift Earn (cbXRP) is available in early access. Morpho Earn (USDC) is coming soon.

## Design the Experience

**1. Show a curated catalog**

Build your list from [`GET /lend/vaults`](https://docs.base.org/sdks/base-earn/api-reference/list-vaults), filtered to the vaults your app has approved. Show each vault's name, asset, and provider. For Upshift, also show `depositsPaused`, `withdrawalsPaused`, and the waiting period from `redemptionLagSeconds`.

**2. Take one deposit**

The user enters an amount and approves one batch from [`POST /lend/deposit`](https://docs.base.org/sdks/base-earn/api-reference/deposit). The batch may include a token approval; execute every call in order.

**3. Show redeemable value**

Read [`GET /lend/positions`](https://docs.base.org/sdks/base-earn/api-reference/list-positions) after each confirmed action. Display `assets`, the current value of the user's shares, rather than a fixed return. For Upshift, `assetsAfterFee` is the value net of the current withdrawal fee.

**4. Set exit expectations**

Read `withdrawalMode` before the user commits. Morpho (`synchronous`) withdraws in one step. Upshift (`queued`) needs a request, a waiting period, and a claim, so show the expected claim date and the queued amount until it is claimed.

## Build the Portfolio View

This example joins the catalog with the user's positions for a portfolio screen. It uses `earn()` from [Call the API](https://docs.base.org/sdks/base-earn/call-the-api.md) in TypeScript, Python, or Go (`earn.Call`, which returns raw JSON); deposits and withdrawals follow [Integrate Lending](https://docs.base.org/build-on-base/integrate-defi/integrate-lending.md) and [End-to-End Lend Examples](https://docs.base.org/sdks/base-earn/lend-example.md).

```typescript TypeScript lines wrap expandable highlight={1-2,12,14} theme={null}
const { vaults } = await earn("GET", "/lend/vaults?network=base");
const { positions } = await earn("GET", `/lend/positions?address=${encodeURIComponent(address)}`);

const portfolio = vaults
  .filter(v => approvedVaultIds.includes(v.vaultId))
  .map(vault => {
    const position = positions.find(p => p.vaultId === vault.vaultId);
    return {
      name: vault.name,
      asset: vault.asset, // symbol and decimals for display
      provider: vault.provider,
      exit: vault.withdrawalMode, // "synchronous" or "queued"
      shares: position?.shares ?? "0",
      value: position?.assetsAfterFee ?? position?.assets ?? "0", // atomic units
    };
  });
```

```python Python lines wrap expandable highlight={3-4,15,17} theme={null}
from urllib.parse import quote

vaults = earn("GET", "/lend/vaults?network=base")["vaults"]
positions = earn("GET", f"/lend/positions?address={quote(address)}")["positions"]

portfolio = []
for vault in vaults:
    if vault["vaultId"] not in approved_vault_ids:
        continue
    position = next((p for p in positions if p["vaultId"] == vault["vaultId"]), None)
    portfolio.append({
        "name": vault["name"],
        "asset": vault["asset"],  # symbol and decimals for display
        "provider": vault["provider"],
        "exit": vault["withdrawalMode"],  # "synchronous" or "queued"
        "shares": position["shares"] if position else "0",
        "value": (position.get("assetsAfterFee") or position["assets"]) if position else "0",  # atomic units
    })
```

```go Go lines wrap expandable highlight={36,43,57,60,62} theme={null}
type Asset struct {
	Address  string `json:"address"`
	Symbol   string `json:"symbol"`
	Decimals int    `json:"decimals"`
}

type Vault struct {
	VaultID        string `json:"vaultId"`
	Name           string `json:"name"`
	Provider       string `json:"provider"`
	WithdrawalMode string `json:"withdrawalMode"`
	Asset          Asset  `json:"asset"`
}

type Position struct {
	VaultID        string `json:"vaultId"`
	Shares         string `json:"shares"`
	Assets         string `json:"assets"`
	AssetsAfterFee string `json:"assetsAfterFee"`
}

type PortfolioRow struct {
	Name, Provider string
	Asset          Asset  // symbol and decimals for display
	Exit           string // "synchronous" or "queued"
	Shares, Value  string // atomic units
}

func portfolio(address string, approvedVaultIDs map[string]bool) ([]PortfolioRow, error) {
	var catalog struct {
		Vaults []Vault `json:"vaults"`
	}
	var holdings struct {
		Positions []Position `json:"positions"`
	}
	raw, err := earn.Call("GET", "/lend/vaults?network=base", nil)
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(raw, &catalog); err != nil {
		return nil, err
	}
	raw, err = earn.Call("GET", "/lend/positions?address="+url.QueryEscape(address), nil)
	if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(raw, &holdings); err != nil {
		return nil, err
	}

	rows := []PortfolioRow{}
	for _, vault := range catalog.Vaults {
		if !approvedVaultIDs[vault.VaultID] {
			continue
		}
		row := PortfolioRow{Name: vault.Name, Provider: vault.Provider, Asset: vault.Asset,
			Exit: vault.WithdrawalMode, Shares: "0", Value: "0"}
		for _, p := range holdings.Positions {
			if p.VaultID == vault.VaultID {
				row.Shares, row.Value = p.Shares, p.Assets
				if p.AssetsAfterFee != "" {
					row.Value = p.AssetsAfterFee
				}
			}
		}
		rows = append(rows, row)
	}
	return rows, nil
}
```

Amounts are atomic-unit strings; format them with each token's `decimals` from discovery. Upshift shares already in the redemption queue are not included in positions, so track queued withdrawals with [`GET /lend/redemptions`](https://docs.base.org/sdks/base-earn/api-reference/get-redemption).

> [!WARNING]
>
> Yield is variable and not guaranteed, and funds are exposed to protocol risk. A position's current value is not guaranteed withdrawal proceeds: withdrawals depend on liquidity and protocol conditions, and fees depend on the vault. An absent fee field does not mean there are no fees. Review each vault before listing it and never present a fixed return.

## See Also

> [card] [Base Earn API](https://docs.base.org/sdks/base-earn/overview.md)
>
> Supported protocols, endpoints, and quick start.

> [card] [Concepts](https://docs.base.org/sdks/base-earn/concepts.md)
>
> Vaults, shares, withdrawal modes, and queued withdrawals.

> [card] [Base Earn API FAQ](https://docs.base.org/sdks/base-earn/faq.md)
>
> Custody, accounts, fees, and withdrawal questions.

> [card] [Integrate Lending](https://docs.base.org/build-on-base/integrate-defi/integrate-lending.md)
>
> Deposit and withdraw through the same API.
