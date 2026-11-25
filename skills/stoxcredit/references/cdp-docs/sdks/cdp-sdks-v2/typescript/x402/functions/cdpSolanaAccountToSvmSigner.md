> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# cdpSolanaAccountToSvmSigner

```ts theme={null}
function cdpSolanaAccountToSvmSigner(account: CdpSolanaAccount): TransactionSigner;
```

Defined in: [account-signers.ts:159](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/account-signers.ts#L159)

Converts a CDP Solana account into an x402-compatible `TransactionSigner`.

Handles the translation between CDP's base64-encoded transaction strings and
`@solana/kit`'s compiled transaction objects.

## Parameters

### account

[`CdpSolanaAccount`](https://docs.cdp.coinbase.com/sdks/cdp-sdks-v2/typescript/x402/index#cdpsolanaaccount)

A CDP Solana account from `cdpClient.solana.getOrCreateAccount()`

## Returns

`TransactionSigner`

A `TransactionSigner` compatible with `@x402/svm`'s `registerExactSvmScheme`
