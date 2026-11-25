// o1 Launchpad API proxy for the Base Interference Agent skill.
// The o1 key lives only in the server environment (O1_API_KEY). Clients never see it.
// Requires Node 18+. No dependencies.
import http from "node:http";
import { APIS } from "./apis.mjs";

const PORT = Number(process.env.PORT || 8787);
const RATE_PER_MIN = Number(process.env.RATE_PER_MIN || 60);
const MAX_BODY = 64 * 1024;


const hits = new Map(); // ip -> { count, reset }
function limited(ip) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now > h.reset) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  h.count += 1;
  return h.count > RATE_PER_MIN;
}

function send(res, status, obj) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://x");
  if (url.pathname === "/healthz") return send(res, 200, { ok: true });

  // Route: /<api>/<upstream path>
  // Bare /v1/... stays as the o1 route, so existing clients keep working.
  let seg = url.pathname.split("/").filter(Boolean);
  if (seg[0] === "v1") seg = ["o1", ...seg];
  const api = APIS[seg[0]];
  if (!api) return send(res, 404, { error: "unknown_api" });
  const upstreamPath = "/" + seg.slice(1).join("/");
  const pathWithQuery = upstreamPath + url.search;

  const key = process.env[api.keyEnv] || "";
  if (!key) return send(res, 503, { error: "proxy_not_configured", api: seg[0] });
  if (!api.allow.some((re) => re.test(pathWithQuery)))
    return send(res, 404, { error: "not_allowed" });
  if (!["GET", "POST"].includes(req.method || ""))
    return send(res, 405, { error: "method_not_allowed" });

  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0].trim();
  if (limited(ip)) return send(res, 429, { error: "rate_limited" });

  let body = "";
  if (req.method === "POST") {
    for await (const chunk of req) {
      body += chunk;
      if (body.length > MAX_BODY) return send(res, 413, { error: "body_too_large" });
    }
  }

  try {
    const up = await fetch(api.upstream + pathWithQuery, {
      method: req.method,
      headers: {
        "content-type": req.headers["content-type"] || "application/json",
        // Key is set here on the server, never taken from the client.
        [api.authHeader]: api.authHeader === "authorization" ? `Bearer ${key}` : key,
      },
      body: req.method === "POST" ? body : undefined,
    });
    const text = await up.text();
    res.writeHead(up.status, { "content-type": up.headers.get("content-type") || "application/json" });
    res.end(text);
  } catch {
    send(res, 502, { error: "upstream_unreachable" });
  }
});

server.listen(PORT, () => console.log(`o1 proxy listening on :${PORT}`));
