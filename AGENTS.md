# AGENTS.md

Guidance for coding agents working in this repository.

## Project Overview

Babablox is a Thai-language e-commerce demo for buying and selling Roblox/Blox Fruits items. It has a Vite + React frontend and an Express + MongoDB backend in the same repo.

- Frontend entry: `src/main.jsx`, `src/App.jsx`
- Frontend routes/pages: `src/pages/`
- Shared frontend components: `src/components/`
- Frontend API/auth helpers: `src/utils/`
- Backend entry: `server/index.js`
- Express app and routes: `server/app.js`, `server/routes/`
- Mongoose models: `server/models/`
- Seed data: `src/data/products.js`, loaded by `server/seed/products.js`
- Static assets: `public/assets/`

The root `AGENTS.md` applies to the whole repository.

## Commands

Use pnpm and the scripts in `package.json`.

```bash
pnpm dev
pnpm build
pnpm preview
pnpm dev:server
pnpm server
pnpm seed:products
pnpm optimize:images
```

Notes:

- `pnpm dev` starts the Vite frontend, normally on `http://localhost:5173`.
- `pnpm dev:server` starts the API with Node watch mode, normally on `http://localhost:3001`.
- `pnpm build` is the main available verification command. There is currently no lint or test script.
- In local Vite dev, frontend `/api/...` requests are proxied to `VITE_API_PROXY_TARGET`, normally `http://localhost:3001`.
- The Vite 8 toolchain requires Node `^20.19.0 || >=22.12.0`.
- The backend requires `.env` values based on `.env.example`, especially `MONGODB_URI` and `JWT_SECRET`.
- Do not commit `.env` or other secret-bearing files.

## Package Management

This project uses pnpm. `package.json` and `pnpm-lock.yaml` are the source of truth for scripts and dependencies. `pnpm-workspace.yaml` is present to approve required build scripts for native/tooling packages used by this app.

- Use `pnpm install` to install dependencies.
- Use `pnpm add <package>` and `pnpm add -D <package>` for dependency changes.
- Keep `packageManager` in `package.json` aligned with the pnpm version used for lockfile updates.
- Keep `pnpm-workspace.yaml` allow-build entries for packages that need install scripts, currently `bcrypt`, `esbuild`, and `sharp`.
- Do not introduce `package-lock.json` or `yarn.lock`.

## Frontend Conventions

- Use ES modules, React function components, hooks, and JSX files matching the existing style.
- Keep imports relative; there is no configured path alias.
- Use double quotes and semicolons, matching the surrounding files.
- Styling is Tailwind CSS v4 via `@import "tailwindcss";` in `src/styles.css`.
- Reuse existing shared CSS helpers before adding new ones: `brand-gradient`, `brand-card`, `brand-ring`, and `hero-cover`.
- Preserve the existing visual language: purple brand surfaces, orange accents, rounded cards/buttons, and dense product/admin panels.
- Preserve Thai UI copy. Some terminals may display Thai text incorrectly; do not bulk-convert, replace, or "fix" Thai strings unless the task is explicitly about copy/encoding.
- SweetAlert2 wrappers live in `src/utils/alerts.js`; use those helpers for toast, warning, error, and confirmation dialogs.
- API calls should go through `apiFetch` or `adminApiFetch` rather than raw `fetch` in pages/components.
- Leave `VITE_API_URL` blank for same-origin `/api` requests unless a deployment needs an explicit API origin.

## Routing And State

- Public routes are declared in `src/App.jsx`.
- `/admin` routes are wrapped in `AdminProvider` and `AdminLayout`.
- The public navbar/footer are intentionally hidden on admin routes.
- `/orders` requires a logged-in user through `RequireAuth`.
- Public auth state uses `AppProvider` and `src/utils/storage.js`.
- Admin auth state uses `AdminProvider` and `src/utils/admin-storage.js`.
- Public and admin tokens intentionally use separate localStorage keys: `authToken` and `adminAuthToken`.

When adding routes, update `src/App.jsx` and keep route ownership clear between public and admin sections.

## Backend Conventions

- The backend is ESM (`"type": "module"`).
- `server/index.js` loads `.env`, validates `JWT_SECRET`, connects MongoDB, and starts the app.
- `server/app.js` owns middleware, CORS, route mounting, health check, and optional static serving of `dist/`.
- Use `asyncHandler` from `server/utils/asyncHandler.js` for async route handlers.
- Use `requireAuth` and `requireAdmin` from `server/middleware/auth.js` for protected endpoints.
- Keep API responses JSON-shaped and consistent with existing `{ error: "..." }`, `{ ok: true }`, and `{ items: [...] }` patterns.
- Never return `passwordHash`; user queries should select it out unless password comparison requires `+passwordHash`.
- Product slugs are generated in the Mongoose pre-validate hook using `server/utils/slugify.js`.

## Auth And Business Rules

- JWTs are normally sent as Bearer tokens by the frontend.
- Cookie auth can be enabled with `JWT_COOKIE=true`, but do not assume it is enabled.
- A registering/logging-in user whose email matches `ADMIN_EMAIL` becomes admin.
- Admin accounts cannot use the cart or place orders.
- User carts snapshot product name, price, image, and quantity at add-to-cart time.
- Creating an order snapshots cart items, computes subtotal server-side, then clears the cart.
- Admin order status updates happen through `PATCH /api/orders/:id/status`.
- Order `status` tracks fulfillment only (`pending`, `fulfilled`, `cancelled`); payment state belongs in `paymentStatus` (`unpaid`, `paid`, `refunded`).
- Admin user management lives under `/api/admin/users`.

Preserve these boundaries unless the task explicitly changes product requirements.

## Data And Assets

- Product seed data is in `src/data/products.js`.
- `pnpm seed:products` deletes all existing products and inserts the seed list. Treat it as destructive for local database contents.
- Current seed product image paths point at `/assets/blox-fruits/*.webp`.
- `pnpm optimize:images` reads `public/assets/` and writes optimized files to `public/assets-optimized/`; do not switch app paths to optimized assets unless the change is intentional and verified.
- Keep large generated assets out of diffs unless the task specifically requires asset generation or optimization.

## Verification

Choose the lightest verification that covers the change:

- Frontend-only changes: run `pnpm build`.
- Backend route/model changes: start or syntax-check the API where practical, and verify affected route behavior manually if MongoDB is available.
- Full-stack changes: run `pnpm build` and, when possible, run frontend and backend together with compatible `VITE_API_URL`/`CORS_ORIGIN` values.
- Dependency changes: verify the lockfile state is intentional and explain it in the final response.

If a check cannot be run because MongoDB or environment variables are unavailable, state that clearly.

## Change Discipline

- Keep edits scoped to the task and follow existing file organization.
- Do not introduce a new state library, router, UI kit, test framework, formatter, or build tool without a clear need.
- Do not rewrite Thai copy, restyle the app globally, or refactor unrelated pages as drive-by cleanup.
- Do not alter `pnpm-lock.yaml`, generated assets, or local environment files unless directly required.
- Avoid changing API contracts without updating all frontend consumers and documenting the change.
- Before changing auth, cart, or order behavior, inspect both frontend consumers and backend enforcement.
