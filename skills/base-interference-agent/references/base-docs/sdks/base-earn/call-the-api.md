> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Call the Base Earn API

> Set up a backend helper in TypeScript, Python, or Go, or use cURL, to call the Base Earn API.

Replace `your_registered_builder_code` with the code from your Base Dashboard project. cURL examples include the full URL and JSON body, with no environment-variable setup. Replace angle-bracket placeholders with your wallet address and the selected vault or market identifiers.

The examples use Node.js 18 or later, Python 3 with `requests`, or cURL. Wallet examples use viem.

```typescript TypeScript lines expandable wrap theme={null}
const BASE_URL = "https://api.base.org/earn/v1";
const builderCode = "your_registered_builder_code";
const attribution = { builderCode };

async function earn(method: "GET" | "POST", path: string, body?: unknown) {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}
```

```python Python lines expandable wrap theme={null}
import requests

BASE_URL = "https://api.base.org/earn/v1"
builder_code = "your_registered_builder_code"
attribution = {"builderCode": builder_code}

def earn(method, path, body=None):
    r = requests.request(method, BASE_URL + path, json=body, timeout=15)
    r.raise_for_status()
    return r.json()
```

```go Go lines expandable wrap theme={null}
package earn

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "time"
 )

func Call(method, path string, body map[string]any) ([]byte, error) {
    const baseURL = "https://api.base.org/earn/v1"
    var buf io.Reader
    if method == http.MethodPost {
        const builderCode = "your_registered_builder_code"
        payload := make(map[string]any, len(body)+1)
        for k, v := range body { payload[k] = v }
        payload["builderCode"] = builderCode
        body = payload
    }
    if body != nil {
        b, err := json.Marshal(body)
        if err != nil { return nil, err }
        buf = bytes.NewReader(b)
    }
    req, err := http.NewRequest(method, baseURL+path, buf)
    if err != nil { return nil, err }
    req.Header.Set("Content-Type", "application/json")
    client := &http.Client{Timeout: 15*time.Second}
    res, err := client.Do(req)
    if err != nil { return nil, err }
    defer res.Body.Close()
    out, err := io.ReadAll(res.Body)
    if err != nil { return nil, err }
    if res.StatusCode >= 300 { return nil, fmt.Errorf("%d %s", res.StatusCode, out) }
    return out, nil
}
```

```bash cURL wrap theme={null}
curl "https://api.base.org/earn/v1/lend/vaults?network=base"
```

Endpoint snippets are examples to adapt inside your application, not standalone programs. They use the helpers above and application values such as the connected wallet address and selected product. TypeScript and Python writes include the `attribution` object; the Go helper adds `builderCode` to writes automatically and returns raw JSON.
