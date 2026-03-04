# Docker deployment

The backend runs in Docker together with PostgreSQL and Redis.

## Where to put `.env`

Put the `.env` file in the **project root** (same folder as `docker-compose.yml`). Docker Compose loads `.env` from that directory only.

```
betolyn/
├── docker-compose.yml
├── .env          ← here
├── .env.example  ← copy this to .env
└── backend/
```

## Quick start

From the **project root** (where `docker-compose.yml` lives):

```bash
docker compose up -d
```

- API: http://localhost:8080
- PostgreSQL: localhost:5432 (user/password from env or defaults below)
- Redis: localhost:6379

## Environment variables

Copy `.env.example` to `.env` in the project root, then edit as needed:

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | betolyn | PostgreSQL username |
| `POSTGRES_PASSWORD` | betolyn | PostgreSQL password |
| `POSTGRES_PORT` | 5432 | Host port for PostgreSQL |
| `REDIS_PORT` | 6379 | Host port for Redis |
| `BACKEND_PORT` | 8080 | Host port for the API |
| `APP_AUTH_JWTSECRET` | (dev value) | **Set in production.** JWT signing secret |
| `APP_AUTH_SESSIONEXPIRATIONINDAYS` | 7 | Session expiry in days |
| `APP_AUTH_COOKIESTOKENNAMEKEY` | token | Cookie name for auth token |
| `APP_CORS_ALLOWEDORIGINS` | http://localhost:8001 | Allowed CORS origins |

**Production:** set `POSTGRES_PASSWORD` and `APP_AUTH_JWTSECRET` to secure values.

## First deploy (empty database)

The Docker profile uses `ddl-auto: validate` (no schema changes). If the database is empty, create the schema once:

```bash
docker compose up -d postgres redis   # start DB and Redis
docker compose run --rm -e SPRING_JPA_HIBERNATE_DDL_AUTO=create-only backend
docker compose up -d                   # start backend (and keep using validate)
```

## Health and resilience

- **Actuator:** `GET http://localhost:8080/actuator/health` (used by Docker healthcheck).
- **Restart:** all services use `restart: unless-stopped`.
- **JVM:** backend respects container memory via `JAVA_OPTS` (override in `.env` or compose if needed).

## Build only the backend image

```bash
docker compose build backend
```

## Run without building (pre-built image)

```bash
docker compose up -d postgres redis
# run your backend image or jar elsewhere, pointing to postgres:5432 and redis:6379
```

## Data

- PostgreSQL data: Docker volume `postgres_data`
- Redis data: Docker volume `redis_data`

To reset data, remove volumes and start again:

```bash
docker compose down -v
docker compose up -d
```
