> ## Documentation Index
> Fetch the complete documentation index at: https://docs.cdp.coinbase.com/llms.txt
> Use this file to discover all available pages before exploring further.

# CDP_EXTENSION_GAS_SPONSORING_ERC20_APPROVAL

```ts theme={null}
const CDP_EXTENSION_GAS_SPONSORING_ERC20_APPROVAL: "erc20ApprovalGasSponsoring";
```

Defined in: [server-extensions.ts:49](https://github.com/coinbase/cdp-sdk/blob/a1195adcfa5a93627bd3cb79831b188cc13073a1/typescript/packages/cdp-sdk/src/x402/server-extensions.ts#L49)

Extension key for ERC-20 approval gas-sponsored payments.

When advertised, the x402 EVM client signs an ERC-20 `approve(Permit2, MaxUint256)`
transaction and the CDP Facilitator broadcasts it, covering the user's gas cost.
