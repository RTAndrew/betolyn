# Deploy backend on Render (no Docker Compose)

Render runs a **single Docker image** and does **not** use Docker Compose. Use either the **Blueprint** (recommended) or **manual** setup.

The app reads Render’s **DATABASE_URL** and **REDIS_URL** and maps them to Spring Boot config, so you don’t need to set `SPRING_DATASOURCE_*` or `SERVICES_REDIS_*` by hand when using Render Postgres and Render Redis.

---

## Option A: Blueprint (one-click from repo)

1. Push this repo to GitHub/GitLab and connect the repo to [Render](https://render.com).
2. In the Render dashboard: **New → Blueprint**. Point it at this repo; it will use the **render.yaml** in the repo root.
3. Render will create:
   - **Web Service** `betolyn-backend` (Docker build from `backend/Dockerfile`)
   - **PostgreSQL** `betolyn-db`
   - **Redis (Key Value)** `betolyn-redis`
4. When prompted, set **APP_CORS_ALLOWEDORIGINS** (e.g. `https://your-frontend.onrender.com` or your production origin).
5. **First deploy with empty DB:** add an env var **SPRING_JPA_HIBERNATE_DDL_AUTO** = `create-only`, deploy once, then remove that env var (or set it to `validate`) for future deploys.

Your backend URL will be something like `https://betolyn-backend.onrender.com`.

---

## Option B: Manual setup (no Blueprint)

1. **Create a Web Service**
   - **New → Web Service**, connect your repo.
   - **Runtime:** Docker.
   - **Dockerfile path:** `backend/Dockerfile`.
   - **Docker context:** `backend` (root dir for the build).

2. **Create PostgreSQL**
   - **New → PostgreSQL**, create a database (e.g. `betolyn`).
   - In the DB’s **Connect** tab, copy the **Internal** connection URL.

3. **Create Redis**
   - **New → Redis** (Key Value).
   - In the instance’s **Connect** tab, copy the **Internal** connection URL.

4. **Configure the Web Service**
   - In the Web Service → **Environment**:
     - **DATABASE_URL** = Internal Postgres URL from step 2.
     - **REDIS_URL** = Internal Redis URL from step 3.
     - **APP_AUTH_JWTSECRET** = generate or set a long random secret.
     - **APP_CORS_ALLOWEDORIGINS** = your frontend origin(s).
     - **SPRING_PROFILES_ACTIVE** = `docker` (optional; uses production-style settings).
   - **Health check path:** `/actuator/health` (if you use Actuator).

5. **First deploy (empty DB)**  
   Add **SPRING_JPA_HIBERNATE_DDL_AUTO** = `create-only`, deploy once, then remove it or set to `validate`.

---

## Env vars the app understands on Render

| Source | Env var | Effect |
|--------|--------|--------|
| Render (from Postgres) | `DATABASE_URL` | Parsed into `spring.datasource.url`, `username`, `password`. |
| Render (from Redis) | `REDIS_URL` | Parsed into `services.redis.host` and `port`. |
| You set | `APP_AUTH_JWTSECRET` | JWT signing secret (required in production). |
| You set | `APP_CORS_ALLOWEDORIGINS` | Allowed CORS origins (e.g. frontend URL). |
| Optional | `SPRING_PROFILES_ACTIVE` | Use `docker` for production-style config (no SQL logging, validate schema). |
| Optional (first deploy only) | `SPRING_JPA_HIBERNATE_DDL_AUTO` | `create-only` once to create schema, then remove or set `validate`. |

---

## Notes

- Use **Internal** database and Redis URLs so traffic stays on Render’s network.
- The Dockerfile is the same one used for local `docker compose`; only the env (e.g. `DATABASE_URL` / `REDIS_URL`) changes on Render.
