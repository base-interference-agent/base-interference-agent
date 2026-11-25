> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Reth V2

> Ships Reth V2 as the reference execution client for Base nodes, delivering significant sync speed and throughput improvements.

## Motivation

As Base targets higher throughput, the execution client must keep pace. Reth V2 delivers the sync speed and sustained throughput needed to support the network's scaling goals.

## What Changed

Reth V2 replaces the previous Reth execution client as the reference implementation for Base nodes. The upgrade brings improvements to initial sync speed and sustained throughput.

## Migration

Node operators should upgrade to the Reth V2 binary before Beryl activation. No application-level changes are required.

Nodes must also use reth V2 storage. Base no longer publishes V1 node snapshots, so download a V2 snapshot or, for archival nodes only, migrate existing data with `base-reth-node db migrate-v2`. See [Node Snapshots](https://docs.base.org/specifications/node-operators/snapshots.md) for both paths.
