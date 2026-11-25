> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Base Earn API FAQ

> Answers to common questions about choosing a protocol, withdrawals, custody, accounts, API keys, liquidation risk, and Aave v4 in the Base Earn API.

> [accordion] Which protocol should I start with?
>
> Morpho is the default integration path in this guide. Morpho Earn and Borrow are coming soon; Upshift Earn is available in early access. Choose the approved vault or product for your use case; do not select the first catalog result automatically.

> [accordion] How does withdrawal differ?
>
> Morpho Earn uses `/lend/withdraw` with an asset amount and explicit slippage bound, with no queue or claim step. Upshift uses `/lend/request-withdraw` with shares, then a wait and `/lend/claim`. Read `withdrawalMode` instead of treating every vault alike.

> [accordion] Is synchronous withdrawal guaranteed or fee-free?
>
> No. It depends on liquidity and successful execution. Morpho vault fees depend on the selected offering and underlying strategy. An absent `assetsAfterFee` field does not mean there are no fees. Upshift's current fee-adjusted valuation is not guaranteed settlement proceeds.

> [accordion] Does Base hold funds or keys?
>
> No. Base Earn builds unsigned calls. The user's wallet signs and submits them, and protocol contracts hold the resulting deposits or collateral.

> [accordion] Do users need a new account?
>
> No. Users keep their existing wallet. Your app supplies their address and handles wallet approval. Register your app's builder code in Base Dashboard.

> [accordion] Do I need an API key?
>
> No. The API needs no API key or account. Read requests, such as `GET /lend/vaults` and `GET /lend/positions`, need no credentials. Write requests need your app's [builder code](https://docs.base.org/specifications/builder-codes/overview.md) from [Base Dashboard](https://dashboard.base.org?utm_source=docs) in the `builderCode` field; the API rejects requests without it.

> [accordion] Who manages liquidation risk?
>
> Your app should display current collateral, debt and available risk data, and let users add collateral or repay. Base Earn does not monitor or defend positions after execution.

> [accordion] When does Aave v4 ship?
>
> Aave v4 support is coming soon. We have not announced a release date.
