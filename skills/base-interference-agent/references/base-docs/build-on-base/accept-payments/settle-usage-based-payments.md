> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Settle Usage-Based Payments

> Authorize a maximum x402 payment and settle the actual API usage after the handler succeeds.

Use x402 `upto` when you know the maximum price before work but calculate the final charge afterward. It is the agentic counterpart to a capped variable checkout.

## Advertise the Maximum and Set the Actual Charge

```typescript TypeScript · Express lines wrap expandable highlight={1,3,9} theme={null}
app.use(paymentMiddleware({
  "GET /metered": {
    accepts: [{ scheme: "upto", price: "$0.10", network, payTo }],
    description: "Usage-priced inference",
    mimeType: "application/json",
  },
}, resourceServer));
app.get("/metered", (_request, response) => {
  setSettlementOverrides(response, { amount: "$0.04" });
  response.json({ tokens: 812, result: "Generated response" });
});
```

```go Go · net/http lines wrap expandable highlight={2,6} theme={null}
routes["GET /metered"] = x402http.RouteConfig{
	Accepts: x402http.PaymentOptions{{Scheme: "upto", Price: "$0.10", Network: network, PayTo: payTo}},
	Description: "Usage-priced inference", MimeType: "application/json",
}
mux.HandleFunc("GET /metered", func(w http.ResponseWriter, _ *http.Request) {
	nethttpmw.SetSettlementOverrides(w, &x402.SettlementOverrides{Amount: "40000"})
	_ = json.NewEncoder(w).Encode(map[string]any{"tokens": 812, "result": "Generated response"})
})
```

```python Python · FastAPI lines wrap expandable highlight={2,10} theme={null}
routes["GET /metered"] = RouteConfig(
    accepts=[PaymentOption(scheme="upto", price="$0.10", network=network, pay_to=pay_to)],
    description="Usage-priced inference",
    mime_type="application/json",
)


@app.get("/metered")
async def metered(response: Response) -> dict[str, object]:
    set_settlement_overrides(response, {"amount": "$0.04"})
    return {"tokens": 812, "result": "Generated response"}
```

Set the settlement override only after you have computed successful usage. Keep the charged amount at or below the maximum advertised in the 402 requirements.

> [!TIP]
>
> The buyer authorizes up to $0.10, the successful response records $0.04 of actual usage, and settlement charges \$0.04.

> [!WARNING]
>
> Do not return billable output before middleware has verified the authorization. Define how failures, timeouts, and partial work map to a charge before you expose the endpoint.

## See Also

> [card] [Charge for an API](https://docs.base.org/build-on-base/accept-payments/charge-for-an-api.md)
>
> Use `exact` when price is known before work.

> [card] [Capture an Authorization](https://docs.base.org/build-on-base/accept-payments/capture-an-authorization.md#capture-a-partial-amount)
>
> Build the wallet-checkout version with a constrained permit.
