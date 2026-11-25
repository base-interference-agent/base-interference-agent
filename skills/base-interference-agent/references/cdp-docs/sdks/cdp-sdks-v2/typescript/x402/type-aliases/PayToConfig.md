> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# PayToConfig

```ts theme={null}
type PayToConfig = 
  | {
  type: "eoa";
  accountName?: string;
}
  | {
  type: "smart";
  accountName?: string;
  ownerAccountName: string;
}
  | {
  type: "address";
  evm?: Address;
  solana?: string;
};
```

Defined in: [server.ts:217](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server.ts#L217)

Receiver wallet configuration for `createX402Server`.

Controls how receiver wallet addresses are resolved:

* `"eoa"` — provision a CDP EVM EOA + Solana account (default)
* `"smart"` — provision a CDP Smart Contract Wallet + Solana account
* `"address"` — use provided addresses directly, no provisioning needed

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

Named CDP account to use as the receiver wallet.
Defaults to `"x402-receiver-wallet-1"`.

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

Named CDP smart account. Defaults to `"x402-receiver-wallet-1"`.

### ownerAccountName

```ts theme={null}
ownerAccountName: string;
```

Owner EOA account name. Required for `"smart"` type.

```ts theme={null}
{
  type: "address";
  evm?: Address;
  solana?: string;
}
```

### type

```ts theme={null}
type: "address";
```

Use provided addresses directly.
No wallet provisioning is performed — `CDP_WALLET_SECRET` is not required.
API key credentials (`CDP_API_KEY_ID` / `CDP_API_KEY_SECRET`) are still
needed for the CDP facilitator.
At least one of `evm` or `solana` should be provided, or all routes
must supply explicit `payTo` values in the full x402 `RouteConfig` format.

### evm?

```ts theme={null}
optional evm: Address;
```

EVM address to receive payments.

### solana?

```ts theme={null}
optional solana: string;
```

Solana address to receive payments.
