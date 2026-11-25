> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Charge for an API

> Protect a fixed-price API route with the x402 exact scheme on Base.

Charge a known amount before returning an API response. In the Base USDC flow used here, x402 carries an EIP-3009 authorization through the HTTP `402 Payment Required` handshake, then a facilitator verifies and settles it.

These examples target Base Sepolia (`eip155:84532`) and the public `x402.org` test facilitator. To take a route live, see [Move to Base Mainnet](#move-to-base-mainnet).

**1. Return Payment Requirements**

The unpaid request receives a 402 response with the scheme, network, token, price, and recipient.

**2. Sign and Retry**

The buyer applies its spend policy, signs the advertised payment, and retries with `PAYMENT-SIGNATURE`.

**3. Verify Before Work**

Seller middleware verifies the payload before your protected handler runs.

**4. Settle**

The facilitator submits the payment and returns settlement details with the response.

## Price a Fixed Route

```typescript TypeScript · Express lines wrap expandable highlight={1,3} theme={null}
app.use(paymentMiddleware({
  "GET /fixed": {
    accepts: [{ scheme: "exact", price: "$0.01", network, payTo }],
    description: "Fixed-price market report",
    mimeType: "application/json",
  },
}, resourceServer));
app.get("/fixed", (_request, response) => response.json({ report: "Base market summary" }));
```

```go Go · net/http lines wrap expandable highlight={3} theme={null}
routes := x402http.RoutesConfig{
	"GET /fixed": {
		Accepts: x402http.PaymentOptions{{Scheme: "exact", Price: "$0.01", Network: network, PayTo: payTo}},
		Description: "Fixed-price market report", MimeType: "application/json",
	},
}
mux := http.NewServeMux()
mux.HandleFunc("GET /fixed", func(w http.ResponseWriter, _ *http.Request) {
	_ = json.NewEncoder(w).Encode(map[string]string{"report": "Base market summary"})
})
```

```python Python · FastAPI lines wrap expandable highlight={3} theme={null}
routes = {
    "GET /fixed": RouteConfig(
        accepts=[PaymentOption(scheme="exact", price="$0.01", network=network, pay_to=pay_to)],
        description="Fixed-price market report",
        mime_type="application/json",
    )
}


@app.get("/fixed")
async def fixed() -> dict[str, str]:
    return {"report": "Base market summary"}
```

> [!TIP]
>
> An unpaid request receives 402; a valid paid retry reaches the handler and returns the resource once.

> [!WARNING]
>
> Treat the facilitator response and your own fulfillment record as separate checks. Make the route idempotent so a retried paid request cannot deliver the same one-time resource twice.

## Move to Base Mainnet

The public `x402.org` facilitator supports testnets only. Before you take a route live on Base mainnet:

1. Choose a production facilitator path: a hosted facilitator that supports Base mainnet, such as the [CDP Facilitator](https://docs.cdp.coinbase.com/x402/seller/facilitator), your own facilitator, or [self-facilitation](https://github.com/x402-foundation/x402/tree/main/examples/typescript/servers/self-facilitation) inside your resource server. The x402 docs list other [production facilitators](https://docs.x402.org/dev-tools/facilitators).
2. Set `network` to Base mainnet (`eip155:8453`) and `payTo` to a mainnet address you control.
3. Confirm the asset. A dollar price such as `"$0.01"` on Base resolves to USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`), which settles through EIP-3009 `transferWithAuthorization` on the USDC contract. Other ERC-20 tokens settle through Permit2.
4. Call your facilitator's supported endpoint and check that it lists `eip155:8453` with the scheme your route uses.

The CDP Facilitator supports Base mainnet with the `exact`, `upto`, and `batch-settlement` schemes, screens payments against OFAC and KYT checks, and authenticates with a CDP API key. See [Network and token support](https://docs.x402.org/core-concepts/network-and-token-support) for other networks and assets.

## See Also

> [card] [Settle Usage-Based Payments](https://docs.base.org/build-on-base/accept-payments/settle-usage-based-payments.md)
>
> Set the final charge after successful work.

> [card] [Call a Paid Service](https://docs.base.org/build-on-base/accept-payments/call-a-paid-service.md)
>
> Add network, asset, and spend policy on the buyer.
