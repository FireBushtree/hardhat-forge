# Hardhat Forge

Hardhat Forge is a helper toolkit for local Hardhat networks. It ships with a React dashboard and a Hardhat plugin so you can inspect accounts, blocks, transactions, and compiled contracts while you build and test smart contracts.

## Key Features
- 📊 **Visual dashboard** built with React, Tailwind, and Vite (pages for Accounts, Blocks, Transactions, Contracts).
- 🔌 **Hardhat plugin** that registers a `forge` task to spin up an Express server and expose a REST API.
- 🔁 **Live blockchain data** fetched from a local JSON-RPC endpoint (`http://127.0.0.1:8545`) via `ethers`.
- 🤝 **Shared TypeScript types** under `@hardhat-forge/shared` to keep client and server in sync.

## Monorepo Layout
- `packages/client` – Vite + React frontend (pages, hooks, components).
- `packages/hardhat-forge` – Hardhat plugin plus Express API implementation.
- `packages/shared` – Shared TypeScript declarations for responses, accounts, etc.
- `example` – Sample Hardhat project showing how to wire in the plugin.

## Getting Started

### 1. Install dependencies
```bash
pnpm install
```

### 2. Launch a local Hardhat chain
```bash
pnpm chain
```
This runs `hardhat node` from the example project and exposes JSON-RPC at `http://127.0.0.1:8545`.

### 3. Run the frontend dashboard (development mode)
```bash
pnpm client:dev
```
Visit the printed Vite URL (default `http://127.0.0.1:5173`).

### 4. Serve the dashboard through the Hardhat plugin (optional)
If you want the dashboard behind the Express server that the plugin provides:
```bash
pnpm --filter @hardhat-forge/client build   # build static assets
pnpm dev                                    # runs `hardhat forge`
```
By default the Express server listens on port `7004`. Override it with `hardhat forge --port 8000`.

## Available Scripts (root `package.json`)
- `pnpm chain` – Start the Hardhat JSON-RPC node (`pnpm --filter example chain`).
- `pnpm dev` – Run the example project’s `forge` task (Express API + plugin).
- `pnpm client:dev` – Start the React dashboard with Vite dev server.
- `pnpm lint` / `pnpm lint:fix` – Check or auto-fix code quality via Biome.

## REST API
| Endpoint | Description | Response shape |
| --- | --- | --- |
| `GET /api/accounts` | Returns local accounts with balance and private key metadata. | `{ code, data: Account[], timestamp }` |
| `GET /api/contracts` | Lists compiled contracts plus deployment status detected on the local chain. | `{ code, data: { contracts: ContractItem[] }, timestamp }` |

Responses use the `ResponseCode` enum from `@hardhat-forge/shared`; `code === 0` indicates success.

## Dashboard Pages
- **Accounts** – Displays development accounts, balances, copy-to-clipboard actions, and private key visibility toggles.
- **Blocks** – Shows recent blocks with hashes, parent hashes, gas usage, and timestamps.
- **Transactions** – Traverses recent blocks to surface transactions, including from/to, gas details, and calldata preview.
- **Contracts** – Lists compiled artifacts, ABI counts, bytecode preview, and whether a contract is deployed locally.

> Additional pages (e.g., Home, Events) can be extended as needed.

## Development Notes
- The client currently assumes the RPC URL `http://127.0.0.1:8545`; change `packages/client/src/services/chain.ts` if you expose a different endpoint.
- New REST endpoints should be defined under `packages/hardhat-forge/src/controllers` and registered in `server.ts`.
- Tailwind CSS 4 (via `@tailwindcss/vite`) is used; component styling lives next to each page.

## License
ISC © firebushtree
