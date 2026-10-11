# Admin Dashboard Client

Next.js 16 (App Router) admin dashboard for the Laravel API in [`../server`](../server). React 19, TypeScript, Tailwind CSS 4, Axios. Package manager: Bun.

## Run

```bash
bun install
bun dev          # http://localhost:3000
```

The API must be reachable at `http://localhost:8000` (Docker backend or `php artisan serve`). Next.js proxies `/api/*` to it, so no CORS setup is needed.

Whole stack in Docker, from the repo root:

```bash
docker compose up --build
```

## Scripts

| Command | What it does |
|---|---|
| `bun dev` | Dev server with hot reload |
| `bun run build` | Production build (`output: "standalone"`) |
| `bun start` | Serve the production build |
| `bun run lint` | ESLint |

## How it talks to the API

- `next.config.ts` rewrites `/api/:path*` to `${BACKEND_URL}/api/:path*`.
  - `BACKEND_URL` defaults to `http://localhost:8000`.
  - In Docker it is `http://backend:8000` (the Compose service name).
  - It is read at **build time**, so changing it needs a rebuild.
- `lib/api.ts` is the shared Axios instance: `baseURL` is `NEXT_PUBLIC_API_URL` or `/api`, and it attaches `Authorization: Bearer <token>` from `localStorage` (`token`).
- The API is versioned, so request paths include the version, e.g. `api.post("/v1/login", ...)`.

## Environment

| Variable | Default | Purpose |
|---|---|---|
| `BACKEND_URL` | `http://localhost:8000` | Rewrite target for `/api/*` (build time) |
| `NEXT_PUBLIC_API_URL` | `/api` | Axios base URL; set only to bypass the proxy |

## Structure

```
client/
├── app/
│   ├── components/
│   │   ├── auth/            # auth screens
│   │   ├── ui/              # SideBar, Content, Logo, Option, TitleSection, ToggleClose
│   │   └── Dashboard.tsx
│   ├── types/               # shared TypeScript types
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── hooks/                   # custom hooks
├── lib/api.ts               # Axios instance
├── public/
├── next.config.ts
└── Dockerfile               # multi-stage: bun install, build, node:22-alpine runtime
```

## Docker image

Multi-stage build: dependencies and build with `oven/bun`, runtime on `node:22-alpine` running the standalone server on port 3000. Build arg `BACKEND_URL` sets the proxy target.
