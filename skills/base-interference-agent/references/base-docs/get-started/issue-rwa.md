> ## Documentation Index
> Fetch the complete documentation index at: https://docs.base.org/llms.txt
> Use this file to discover all available pages before exploring further.

> ## Agent Instructions
> For the current source of truth, read https://docs.base.org/llms.txt and connect the Base docs MCP server at https://docs.base.org/mcp.

# Tokenize Assets

> Represent and operate real-world assets on Base with the B20 Asset standard: configurable precision, issuer roles, holder controls, and distributions through one ERC-20-compatible surface.

Represent a real-world asset with the [B20 Asset standard](https://docs.base.org/specifications/b20/concepts/token-types.md#4-asset). Configure precision and issuer roles, distribute units, restrict eligible holders, and run distributions through one ERC-20-compatible surface built into Base. The guides below use a stock token as the worked example; the same flows apply to other asset types.

> [!NOTE]
>
> Real-world asset (RWA) tokenization is one of many use cases for the [B20 Asset standard](https://docs.base.org/specifications/b20/concepts/token-types.md#4-asset). The examples on this page use a stock token for illustration; the same flows apply to other asset types.
>
> Tokenized securities examples shown for illustration. Base is a general-purpose blockchain; issuance and compliance are the responsibility of the issuer under applicable law.

## Guides

> [card] [Create an Asset Token](https://docs.base.org/build-on-base/issue-rwa/create-an-asset-token.md)
>
> Configure a B20 Asset token for one class of units.

> [card] [Issue Units to Holders](https://docs.base.org/build-on-base/issue-rwa/issue-units.md)
>
> Distribute units to multiple approved holders in one batch.

> [card] [Restrict Eligible Holders](https://docs.base.org/build-on-base/issue-rwa/restrict-eligible-holders.md)
>
> Gate issuance and transfers with a shared allowlist.

> [card] [Restrict Who Can Initiate Transfers](https://docs.base.org/build-on-base/issue-rwa/restrict-transfer-initiators.md)
>
> Require a designated initiator, such as a transfer agent, for every transfer.

> [card] [Seize and Cancel Units](https://docs.base.org/build-on-base/issue-rwa/seize-and-cancel-units.md)
>
> Move units from an ineligible holder to safekeeping, then cancel them.

> [card] [Announce a Change to Holders](https://docs.base.org/build-on-base/issue-rwa/announce-a-distribution.md)
>
> Publish an onchain disclosure with the issuance, multiplier update, or burn it describes.

> [card] [Apply a Multiplier](https://docs.base.org/build-on-base/issue-rwa/apply-a-multiplier.md)
>
> Update displayed balances without migrating holders.

> [card] [Pause Transfers](https://docs.base.org/build-on-base/issue-rwa/pause-transfers.md)
>
> Halt transfers during an incident while issuance stays available.
