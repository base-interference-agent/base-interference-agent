# o1 API proxy

## Easiest: deploy on Render (no coding)
1. Go to https://dashboard.render.com, sign in, and click **New > Blueprint**.
2. Connect GitHub and pick the repo `base-interference-agent`.
3. Render reads `proxy/render.yaml`. When it asks for `O1_API_KEY`, paste your key there. The key is stored only in Render.
4. Click **Apply** and wait for the deploy to finish. Copy the URL Render gives you (for example, `https://o1-api-proxy.onrender.com`).
5. Check it: open `<that URL>/healthz` in a browser. It should show `{"ok":true}`.
6. In each user's `.env`, set `LAUNCHPAD_PROXY_URL=<that URL>`.

Note: Render's free plan sleeps after inactivity, so the first request can be slow. Use a paid plan for steady use.


Keeps the o1 Launchpad API key on a server you control. The skill calls this proxy, so users never see the key.

## Run
```bash
O1_API_KEY=<your key> PORT=8787 node server.mjs
```
Set `O1_API_KEY` in the host's secret manager, never in the repo. Requires Node 18+.

## Settings
- `O1_API_KEY` (required): the o1 key. Without it, the proxy returns 503.
- `PORT` (default 8787)
- `RATE_PER_MIN` (default 60 requests per client IP per minute)
- `O1_UPSTREAM` (default `https://api.launch.o1.exchange`)

## What it does
- Forwards only the o1 paths the skill needs (tokens, swaps, launches prepare, claims, creators, wallets, transactions, config, health). Everything else returns 404.
- Adds the key on the server. The client's `x-api-key` header is ignored.
- Limits each IP and caps request bodies at 64 KB.
- Doesn't log requests or keys.

## Limits to know
- Rate limiting is per IP and in memory. It resets on restart, and one server doesn't share limits with another. Put it behind a real gateway if you run several.
- Anyone who can reach the proxy can use the key's quota. Restrict it with a firewall, or add an access token, if you need that.
- Only the "prepare" endpoints return unsigned transactions. The proxy never signs anything.
