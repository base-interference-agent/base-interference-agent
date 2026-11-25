// Each API the proxy forwards. Add one entry per API.
// Clients call  https://<proxy>/<name>/<upstream path>  and never send the key.
// The key is read from the env var named in keyEnv, set on the server only.
export const APIS = {
  o1: {
    upstream: "https://api.launch.o1.exchange",
    keyEnv: "O1_API_KEY",
    authHeader: "x-api-key",
    allow: [
      /^\/v1\/tokens(\/|$|\?)/,
      /^\/v1\/swaps\/(quote|prepare)$/,
      /^\/v1\/launches\/prepare$/,
      /^\/v1\/claims\//,
      /^\/v1\/creators\//,
      /^\/v1\/wallets\//,
      /^\/v1\/transactions\//,
      /^\/v1\/config(\?|$)/,
      /^\/v1\/health$/,
    ],
  },
  // Example for the next API (uncomment and fill in):
  // alpha: {
  //   upstream: "https://api.example.com",
  //   keyEnv: "ALPHA_API_KEY",
  //   authHeader: "authorization", // value is "Bearer <key>" if the API uses bearer tokens
  //   allow: [/^\/v1\/prices(\/|$|\?)/],
  // },
};
