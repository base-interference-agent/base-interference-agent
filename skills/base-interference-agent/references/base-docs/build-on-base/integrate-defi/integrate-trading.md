> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Integrate Trading

> Let users swap tokens on Base with executable routes from the 0x Swap API.

Add token swaps to your app with the 0x Swap API. 0x searches liquidity across decentralized exchanges and market makers, then returns a transaction that the user's wallet can simulate, sign, and submit on Base.

## Route a Swap with 0x

Use the [AllowanceHolder flow](https://docs.0x.org/docs/introduction/quickstart/swap-tokens-with-0x-swap-api) for a B20 or ERC-20 swap:

1. Request an indicative `/price` while the user edits the trade.
2. Request a firm `/quote` when the user is ready to review and sign.
3. If `issues.allowance` is present, approve only the returned `spender` for the sell amount.
4. Fetch a fresh quote, simulate its `transaction`, submit it, and wait for confirmation.

> [!WARNING]
>
> Never approve the 0x Settler contract. Approve only the AllowanceHolder or Permit2 address returned by the API in `issues.allowance.spender` or `allowanceTarget`.

Install `viem@2.55.19`, create Base `publicClient` and `walletClient` instances in `clients.ts`, and keep `ZERO_EX_API_KEY` on your server. The Python version uses `requests` and web3.py 7, and the Go version uses `net/http` and go-ethereum; both read `PRIVATE_KEY` and `ZERO_EX_API_KEY` from the environment. This example sells 100 USDC for WETH on Base mainnet.

> [!NOTE]
>
> The verified sample uses a server-side wallet only to keep the example runnable. In a user-facing app, request the quote from your backend, return the reviewed transaction fields to the frontend, and submit them with the user's connected wallet.

> [!NOTE]
>
> This snippet is illustrative. It shows the shape of a routed trading integration on Base, not production-ready code. Follow the [0x Swap API documentation](https://docs.0x.org/evm/0x-swap-api/introduction) for current API behavior, supported liquidity sources, fees, and contract details.

```typescript TypeScript lines wrap expandable highlight={24-25,28-29,43,46,61-62} theme={null}
import { publicClient, walletClient } from './clients.js';
import { formatUnits, parseAbi, parseUnits, type Address, type Hex } from 'viem';
import { required } from '../shared/env.js';

const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const WETH = '0x4200000000000000000000000000000000000006';
const sellAmount = parseUnits('100', 6);
const user = walletClient.account.address;

type Quote = {
  liquidityAvailable: boolean;
  buyAmount: string;
  minBuyAmount: string;
  issues: {
    allowance: null | { spender: Address };
    balance: null | { actual: string; expected: string };
    simulationIncomplete: boolean;
  };
  transaction?: { to: Address; data: Hex; value: string | null };
};

async function getQuote(): Promise<Quote> {
  const params = new URLSearchParams({
    chainId: '8453', sellToken: USDC, buyToken: WETH,
    sellAmount: sellAmount.toString(), taker: user, slippageBps: '50',
  });
  const response = await fetch(
    `https://api.0x.org/swap/allowance-holder/quote?${params}`,
    { headers: { '0x-api-key': required('ZERO_EX_API_KEY'), '0x-version': 'v2' } },
  );
  if (!response.ok) throw new Error(`0x quote failed: ${response.status} ${await response.text()}`);
  return (await response.json()) as Quote;
}

let quote = await getQuote();
if (!quote.liquidityAvailable) throw new Error('No route is currently available');
if (quote.issues.balance) throw new Error('Insufficient USDC balance');

if (quote.issues.allowance) {
  const approval = await publicClient.simulateContract({
    account: user, address: USDC,
    abi: parseAbi(['function approve(address,uint256) returns (bool)']),
    functionName: 'approve', args: [quote.issues.allowance.spender, sellAmount],
  });
  await publicClient.waitForTransactionReceipt({
    hash: await walletClient.writeContract(approval.request),
  });
  quote = await getQuote();
}

if (quote.issues.allowance) throw new Error('Token allowance is still insufficient');
if (quote.issues.simulationIncomplete) throw new Error('0x could not complete its simulation');
if (!quote.transaction) throw new Error('Quote did not include transaction data');

const transaction = {
  account: walletClient.account,
  to: quote.transaction.to,
  data: quote.transaction.data,
  value: BigInt(quote.transaction.value ?? '0'),
};
await publicClient.call({ ...transaction, account: user });
const hash = await walletClient.sendTransaction(transaction);
await publicClient.waitForTransactionReceipt({ hash });

console.log(`Swap confirmed: ${hash}`);
console.log(`Minimum WETH output: ${formatUnits(BigInt(quote.minBuyAmount), 18)} WETH`);
```

```python Python lines wrap expandable highlight={25-26,29-30,45,47,63-64} theme={null}
import os

import requests
from web3 import Web3
from web3.middleware import SignAndSendRawMiddlewareBuilder

w3 = Web3(Web3.HTTPProvider("https://mainnet.base.org"))
account = w3.eth.account.from_key(os.environ["PRIVATE_KEY"])
w3.middleware_onion.inject(SignAndSendRawMiddlewareBuilder.build(account), layer=0)

USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
WETH = "0x4200000000000000000000000000000000000006"
sell_amount = 100 * 10**6  # 100 USDC (6 decimals)
user = account.address

APPROVE_ABI = [{
    "type": "function", "name": "approve", "stateMutability": "nonpayable",
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "outputs": [{"name": "", "type": "bool"}],
}]


def get_quote():
    params = {
        "chainId": "8453", "sellToken": USDC, "buyToken": WETH,
        "sellAmount": str(sell_amount), "taker": user, "slippageBps": "50",
    }
    response = requests.get(
        "https://api.0x.org/swap/allowance-holder/quote", params=params,
        headers={"0x-api-key": os.environ["ZERO_EX_API_KEY"], "0x-version": "v2"}, timeout=15,
    )
    if not response.ok:
        raise RuntimeError(f"0x quote failed: {response.status_code} {response.text}")
    return response.json()


quote = get_quote()
if not quote["liquidityAvailable"]:
    raise RuntimeError("No route is currently available")
if quote["issues"]["balance"]:
    raise RuntimeError("Insufficient USDC balance")

if quote["issues"]["allowance"]:
    spender = Web3.to_checksum_address(quote["issues"]["allowance"]["spender"])
    approve = w3.eth.contract(address=USDC, abi=APPROVE_ABI).functions.approve(spender, sell_amount)
    approve.call({"from": user})  # simulate before sending
    w3.eth.wait_for_transaction_receipt(approve.transact({"from": user}))
    quote = get_quote()

if quote["issues"]["allowance"]:
    raise RuntimeError("Token allowance is still insufficient")
if quote["issues"]["simulationIncomplete"]:
    raise RuntimeError("0x could not complete its simulation")
if not quote.get("transaction"):
    raise RuntimeError("Quote did not include transaction data")

transaction = {
    "from": user,
    "to": Web3.to_checksum_address(quote["transaction"]["to"]),
    "data": quote["transaction"]["data"],
    "value": int(quote["transaction"].get("value") or "0"),
}
w3.eth.call(transaction)
tx_hash = w3.eth.send_transaction(transaction)
w3.eth.wait_for_transaction_receipt(tx_hash)

print(f"Swap confirmed: {tx_hash.to_0x_hex()}")
print(f"Minimum WETH output: {Web3.from_wei(int(quote['minBuyAmount']), 'ether')} WETH")
```

```go Go lines wrap expandable highlight={71-72,74,78-79,118,122,145,148} theme={null}
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/big"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
)

var (
	usdc       = common.HexToAddress("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913")
	weth       = common.HexToAddress("0x4200000000000000000000000000000000000006")
	sellAmount = big.NewInt(100_000_000) // 100 USDC (6 decimals)
)

const approveABI = `[{"type":"function","name":"approve","stateMutability":"nonpayable",
	"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],
	"outputs":[{"name":"","type":"bool"}]}]`

type Quote struct {
	LiquidityAvailable bool   `json:"liquidityAvailable"`
	BuyAmount          string `json:"buyAmount"`
	MinBuyAmount       string `json:"minBuyAmount"`
	Issues             struct {
		Allowance *struct {
			Spender common.Address `json:"spender"`
		} `json:"allowance"`
		Balance *struct {
			Actual   string `json:"actual"`
			Expected string `json:"expected"`
		} `json:"balance"`
		SimulationIncomplete bool `json:"simulationIncomplete"`
	} `json:"issues"`
	Transaction *struct {
		To    common.Address `json:"to"`
		Data  hexutil.Bytes  `json:"data"`
		Value *string        `json:"value"`
	} `json:"transaction"`
}

func required(name string) string {
	value := os.Getenv(name)
	if value == "" {
		log.Fatalf("Missing %s", name)
	}
	return value
}

func check(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func getQuote(user common.Address) (*Quote, error) {
	params := url.Values{
		"chainId": {"8453"}, "sellToken": {usdc.Hex()}, "buyToken": {weth.Hex()},
		"sellAmount": {sellAmount.String()}, "taker": {user.Hex()}, "slippageBps": {"50"},
	}
	req, err := http.NewRequest("GET", "https://api.0x.org/swap/allowance-holder/quote?"+params.Encode(), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("0x-api-key", required("ZERO_EX_API_KEY"))
	req.Header.Set("0x-version", "v2")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	if res.StatusCode >= 300 {
		return nil, fmt.Errorf("0x quote failed: %d %s", res.StatusCode, body)
	}
	var quote Quote
	return &quote, json.Unmarshal(body, &quote)
}

func main() {
	ctx := context.Background()
	client, err := ethclient.Dial("https://mainnet.base.org")
	check(err)
	key, err := crypto.HexToECDSA(strings.TrimPrefix(required("PRIVATE_KEY"), "0x"))
	check(err)
	user := crypto.PubkeyToAddress(key.PublicKey)
	opts, err := bind.NewKeyedTransactorWithChainID(key, big.NewInt(8453))
	check(err)

	quote, err := getQuote(user)
	check(err)
	if !quote.LiquidityAvailable {
		log.Fatal("No route is currently available")
	}
	if quote.Issues.Balance != nil {
		log.Fatal("Insufficient USDC balance")
	}

	if quote.Issues.Allowance != nil {
		erc20, err := abi.JSON(strings.NewReader(approveABI))
		check(err)
		data, err := erc20.Pack("approve", quote.Issues.Allowance.Spender, sellAmount)
		check(err)
		_, err = client.CallContract(ctx, ethereum.CallMsg{From: user, To: &usdc, Data: data}, nil) // simulate
		check(err)
		approval, err := bind.NewBoundContract(usdc, erc20, client, client, client).RawTransact(opts, data)
		check(err)
		_, err = bind.WaitMined(ctx, client, approval)
		check(err)
		quote, err = getQuote(user)
		check(err)
	}

	if quote.Issues.Allowance != nil {
		log.Fatal("Token allowance is still insufficient")
	}
	if quote.Issues.SimulationIncomplete {
		log.Fatal("0x could not complete its simulation")
	}
	if quote.Transaction == nil {
		log.Fatal("Quote did not include transaction data")
	}

	tx := quote.Transaction
	value := new(big.Int)
	if tx.Value != nil {
		value.SetString(*tx.Value, 10)
	}
	_, err = client.CallContract(ctx, ethereum.CallMsg{From: user, To: &tx.To, Data: tx.Data, Value: value}, nil)
	check(err)
	opts.Value = value
	sent, err := bind.NewBoundContract(tx.To, abi.ABI{}, client, client, client).RawTransact(opts, tx.Data)
	check(err)
	_, err = bind.WaitMined(ctx, client, sent)
	check(err)

	fmt.Printf("Swap confirmed: %s\n", sent.Hash())
	minBuy, _ := new(big.Int).SetString(quote.MinBuyAmount, 10)
	fmt.Printf("Minimum WETH output: %s WETH\n", new(big.Rat).SetFrac(minBuy, big.NewInt(1e18)).FloatString(18))
}
```

## 0x Documentation

> [card] [Swap API Quickstart](https://docs.0x.org/docs/introduction/quickstart/swap-tokens-with-0x-swap-api)
>
> Follow the full price, allowance, quote, and submission flow.

> [card] [AllowanceHolder Quote](https://docs.0x.org/api-reference/evm-ap-is/swap/allowanceholder-getquote)
>
> Review every request parameter and response field.

> [card] [Token Allowances](https://docs.0x.org/evm/0x-swap-api/additional-topics/how-to-set-your-token-allowances)
>
> Approve the correct spender and avoid unsafe approvals.

## See Also

> [card] [Integrate Lending](https://docs.base.org/build-on-base/integrate-defi/integrate-lending.md)
>
> Let users deposit into Morpho and Upshift vaults.

> [card] [Integrate Borrowing](https://docs.base.org/build-on-base/integrate-defi/integrate-borrowing.md)
>
> Let users borrow from Morpho Blue markets.

> [card] [Integrate an Earn Product](https://docs.base.org/build-on-base/integrate-defi/integrate-earn-product.md)
>
> Route deposits into yield-bearing vaults.
