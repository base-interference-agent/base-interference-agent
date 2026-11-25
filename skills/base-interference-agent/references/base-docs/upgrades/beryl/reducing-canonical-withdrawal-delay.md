> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Faster Withdrawals

> The single-proof dispute game finalization window is reduced from 7 days to 5 days. The dual-proof fast path (TEE + ZK) introduced in Azul remains at 1 day.

## Motivation

Shortening the single-proof window frees capital for fast-bridge liquidity providers sooner, reducing fees and improving reliability for users who bridge through third-party partners.

## What Changed

| Path | Before (Azul) | After (Beryl) |
| - | - | - |
| Single-proof dispute game | 7 days | 5 days |
| Dual-proof fast path (TEE + ZK) | 1 day | 1 day (unchanged) |

## Migration

Update any bridge monitoring dashboards or user-facing copy that references the 7-day withdrawal period.
