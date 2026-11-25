> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Batch High-Frequency Payments

> Verify cumulative x402 vouchers per request and settle high-frequency API usage in batches.

Use `batch-settlement` when an agent makes many small requests and per-request settlement would dominate cost. Each request advances a cumulative voucher; your channel manager later claims, settles, or refunds the latest state.

## Price a High-Frequency Route

```typescript TypeScript · Express lines wrap expandable highlight={1,3,9} theme={null}
app.use(paymentMiddleware({
  "GET /stream": {
    accepts: [{ scheme: "batch-settlement", price: "$0.01", network, payTo }],
    description: "High-frequency price tick",
    mimeType: "application/json",
  },
}, resourceServer));
app.get("/stream", (_request, response) => {
  setSettlementOverrides(response, { amount: "50%" });
  response.json({ asset: "ETH", price: "3200.00" });
});
```

```go Go · net/http lines wrap expandable highlight={2,6} theme={null}
routes["GET /stream"] = x402http.RouteConfig{
	Accepts: x402http.PaymentOptions{{Scheme: batchsettlement.SchemeBatched, Price: "$0.01", Network: network, PayTo: payTo}},
	Description: "High-frequency price tick", MimeType: "application/json",
}
mux.HandleFunc("GET /stream", func(w http.ResponseWriter, _ *http.Request) {
	nethttpmw.SetSettlementOverrides(w, &x402.SettlementOverrides{Amount: "50%"})
	_ = json.NewEncoder(w).Encode(map[string]string{"asset": "ETH", "price": "3200.00"})
})
```

```python Python · FastAPI lines wrap expandable highlight={2,10} theme={null}
routes["GET /stream"] = RouteConfig(
    accepts=[PaymentOption(scheme=SCHEME_BATCH_SETTLEMENT, price="$0.01", network=network, pay_to=pay_to)],
    description="High-frequency price tick",
    mime_type="application/json",
)


@app.get("/stream")
async def stream(response: Response) -> dict[str, str]:
    set_settlement_overrides(response, {"amount": "50%"})
    return {"asset": "ETH", "price": "3200.00"}
```

> [!TIP]
>
> Each accepted request advances the stored cumulative voucher, while onchain transactions occur only when the channel is claimed, settled, or refunded.

> [!NOTE]
>
> The complete fixtures configure a dedicated `RECEIVER_AUTHORIZER_PRIVATE_KEY` for channel claim and refund signatures. Keep it separate from the receiving wallet and store it in a server-side key manager.

> [!WARNING]
>
> The examples use file-backed storage for one process. Use Redis, Valkey, or a transactional database with atomic updates for serverless or multi-instance deployments.

## See Also

> [card] [Charge for an API](https://docs.base.org/build-on-base/accept-payments/charge-for-an-api.md)
>
> Use exact per-request settlement for lower frequency traffic.

> [card] [Call a Paid Service](https://docs.base.org/build-on-base/accept-payments/call-a-paid-service.md)
>
> Configure the buyer to support batch settlement.
