# Admin Dashboard: Laravel REST API + Next.js

Full-stack admin dashboard. A Laravel 10 REST API (Passport auth, role-based access, products, orders) and a Next.js 16 client, wired together with Docker Compose so the whole stack starts with one command.

| Part | Stack | Docs |
|---|---|---|
| [`server/`](server) | Laravel 10, PHP 8.4, Passport, Spatie Permission, MySQL 8, Redis | [server/README.md](server/README.md) |
| [`client/`](client) | Next.js 16, React 19, TypeScript, Tailwind 4, Axios, Bun | [client/README.md](client/README.md) |

---

## Architecture

```
Browser ──► localhost:3000 ──► client (Next.js)
                                  │  /api/*  rewritten to  http://backend:8000/api/*
                                  ▼
                              backend (Laravel) ──► db (MySQL 8)
                                  │             └─► redis
                              worker (queue:work) ──► redis, db
```

- The browser only talks to the client on port 3000. Next.js `rewrites` proxy `/api/*` to the backend, so there is no CORS setup and no API URL to configure per machine.
- Inside Docker, services reach each other by service name (`backend`, `db`, `redis`).
- The API is versioned: every endpoint lives under `/api/v1`.

## Repository layout

```
.
├── docker-compose.yml     # client, backend, worker, db, redis
├── client/                # Next.js app (own Dockerfile)
└── server/                # Laravel API (own Dockerfile, entrypoint.sh)
```

---

## Quick start (Docker)

Requires Docker with Compose v2.

```bash
docker compose up --build
```

Migrations and Passport keys are set up automatically on backend start. Then, once:

```bash
# demo roles, permissions, users, products, orders
docker compose exec backend php artisan db:seed
```

| Service | URL / port |
|---|---|
| App (client) | http://localhost:3000 |
| API | http://localhost:8000/api/v1 |
| MySQL | `localhost:33066` (user `root`, password `root`, db `admin`) |
| Redis | `localhost:63790` |

**Demo login:** seeded users all use the password `password`. The first user (id 1) is the Admin. Get its email with:

```bash
docker compose exec backend php artisan tinker --execute="echo App\Models\User::first()->email;"
```

Useful commands:

```bash
docker compose logs -f backend          # API logs
docker compose exec backend php artisan test
docker compose down                     # stop
docker compose down -v                  # stop and wipe the database and redis volumes
```

---

## Run without Docker

You need PHP 8.1+, Composer, MySQL 8 and [Bun](https://bun.sh).

```bash
# API
cd server
composer install
cp .env.example .env        # then set DB_* for your local MySQL
php artisan key:generate
php artisan migrate --seed
php artisan passport:install
php artisan serve           # http://localhost:8000

# Client (second terminal)
cd client
bun install
bun dev                     # http://localhost:3000, proxies /api to localhost:8000
```

Outside Docker, `.env.example` points Redis at the hostname `redis`. Either run a local Redis and set `REDIS_HOST=127.0.0.1`, or switch cache, session and queue to `file` / `file` / `sync`.

To point the client at a separately hosted API, build with `BACKEND_URL=https://api.example.com bun run build` (the rewrite target is baked in at build time).

---

## API at a glance

All routes are under `/api/v1`. Protected routes need `Authorization: Bearer <token>`.

| Area | Endpoints | Access |
|---|---|---|
| Auth | `POST /login`, `POST /register`, `POST /logout` | public / authenticated |
| Profile | `GET /profile`, `PUT /profile/info`, `PUT /profile/password` | authenticated |
| Users, Roles | `/users`, `/roles` (CRUD) | Admin |
| Products | `/products` (CRUD), `POST /uploads`, `GET /chart` | Admin, Editor |
| Orders | `GET /orders`, `GET /orders/{id}`, `GET /orders/export` | authenticated |
| Permissions | `GET /permissions`, `POST /permissions` | authenticated |

The client's Axios instance uses `baseURL: "/api"`, so client code calls paths like `/v1/login`.

Full endpoint table, diagrams and design notes: [server/README.md](server/README.md).

---

## Roadmap

Tracked in [`server/docs`](docs) and [`server/integrations`](docs/integrations):

1. Baseline: tests, security hardening ([UNIT-TEST-TASKS.md](docs/test/UNIT-TEST-TASKS.md))
2. Performance: N+1 removal, indexes, Redis caching, load tests with k6
3. Clean architecture: Domain / Application / Infrastructure / Presentation layers (skeleton in `server/app/Modules`)
4. Runtime: Octane in place of `artisan serve`
5. Payments ([plan](docs/integrations/payment/README.md)), then AI features ([plan](docs/integrations/ai/README.md)), then Kafka-based events

## Setup notes

- Redis is provisioned in Compose. Laravel 10 reads `CACHE_DRIVER` (not `CACHE_STORE`) and the `predis/predis` package must be in `composer.json` before cache, session or queue can actually use it.
- The client image build needs a lockfile: run `bun install` once in `client/` to generate `bun.lock` and commit it.

## Author

**Ahmed Hamdy** · [GitHub](https://github.com/Ahmed-Hamdy101) · [LinkedIn](https://www.linkedin.com/in/ahmed-hamdy-ah)
