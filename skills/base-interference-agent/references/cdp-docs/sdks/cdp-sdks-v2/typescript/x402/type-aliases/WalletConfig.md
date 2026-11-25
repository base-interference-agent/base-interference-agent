> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# WalletConfig

```ts theme={null}
type WalletConfig = 
  | {
  type: "eoa";
  accountName?: string;
}
  | {
  type: "smart";
  accountName?: string;
  ownerAccountName: string;
};
```

Defined in: [client.ts:35](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/client.ts#L35)

Wallet configuration for the CDP x402 client.

## Type Declaration

```ts theme={null}
{
  type: "eoa";
  accountName?: string;
}
```

### type

```ts theme={null}
type: "eoa";
```

CDP Server Wallet (EOA). Default when `type` is omitted.

### accountName?

```ts theme={null}
optional accountName: string;
```

Named CDP account. Defaults to `"x402-client-wallet-1"`.

```ts theme={null}
{
  type: "smart";
  accountName?: string;
  ownerAccountName: string;
}
```

### type

```ts theme={null}
type: "smart";
```

CDP Smart Contract Wallet.

### accountName?

```ts theme={null}
optional accountName: string;
```

Named CDP smart account. Defaults to `"x402-client-wallet-1"`.

### ownerAccountName

```ts theme={null}
ownerAccountName: string;
```

Owner EOA account name. Required for `"smart"` type.
