# BINT (Base Interference) token

Page: https://launch.o1.exchange/token/0xb200000000000000000000231734d0c898f56201?chain=8453
Token address (Base Mainnet, chain ID 8453): `0xb200000000000000000000231734d0c898f56201`
Described by the project owner as the first token launched by Claude. This is their claim, not verified here.

## Token data (from the o1 Launchpad API, read on the date of this commit)
- Name: Base Interference
- Symbol: BINT
- Decimals: 18
- Total supply: 1,000,000,000 BINT (raw `1000000000000000000000000000`)
- Description: "A token whose image is a three-source wave interference lattice, rendered in Base blue. Built on Base."
- Image: https://sapphire-negative-junglefowl-959.mypinata.cloud/ipfs/bafybeiaoiz23gl4ilm7ofezpajdugwmvovhtfmnhdktx4wna33adxxarae
- Contract URI: ipfs://bafkreib3qhpd4rukjjzpb6pbwd2hgsz6myzfg75elswrnpxgx34ysmed2e

## Launch
- Launch suite: `base-mainnet-launchpad-v4-minimal`
- Quote (trading pair) token: ANT, `0xb20000000000000000000016e38fd364d271ba28` (8 decimals). Trades are against ANT, not ETH.
- Pool ID: `0xf7055b08a04b22b28ca87f71ab71a9629512ac698836d8135b02809dc2fddaa5`
- Launch transaction: `0x762c645ec2a5176e0c141...` (see the token page for the full hash)
- Creator and creator fee recipient: `0x5b1265a2c04956e1c9c581988f967824f1aede96`
- Contracts: factory `0x1176122eb77AD6a2339322Cda7C4D7ea9BfA63dC`, hook `0x1f91c998e7c2F4b690D75BDBf6502BDcD6e02AcC`, fee escrow `0xB3F11a3fb06A88059b7F7F423Ec0Dda506356866`, announcement registry `0xAB1243C97a37361115d5Cef7666bf49AD2Fb6BAa`
- Features: no allocations, no vesting, metadata not editable.

## How to use it in the skill
- Price and trades: read the token page or call the o1 Launchpad API token endpoints (the user's own key, see `references/o1-launchpad-api/`).
- Buy or sell BINT: quote through the o1 trading endpoints (ANT pair) or KyberSwap if a route is available. Show the minimum received and approve before signing.
- Creator actions (announcements, fee claims) only work from the creator's wallet.
