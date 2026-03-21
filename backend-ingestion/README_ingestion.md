# Betolyn ingestion stack (`espn_service`)

This directory is the **ingestion side** of Betolyn: a Django REST service that pulls data from ESPN’s public (undocumented) HTTP APIs, stores it in PostgreSQL, and exposes **write ingest** and **read sync** HTTP APIs for consumers such as the main Betolyn Java backend.

The large **[README.md](README.md)** in this folder is mostly **reference documentation for ESPN’s public endpoints**. This file describes **how our service ingests data and how it is scheduled**.

---

## What lives where

| Path | Role |
|------|------|
| [`espn_service/`](espn_service/) | Django project: models, ESPN client, ingest views, sync API, Celery tasks |
| [`espn_service/README.md`](espn_service/README.md) | Service quick start, endpoint tables, Docker notes |
| [`espn_service/docs/ingestion_cadence.md`](espn_service/docs/ingestion_cadence.md) | Celery Beat, allowlist fan-out, staggered `eta`, env vars |
| [`espn_service/docs/plans/`](espn_service/docs/plans/) | Architecture plans: ESPN→feed→Betolyn sync, Celery allowlist fan-out (copied from Cursor plans) |
| [`espn_service/docs/deployment_feed_schema.md`](espn_service/docs/deployment_feed_schema.md) | Optional PostgreSQL `feed` schema layout |
| [`docker-compose.yml`](docker-compose.yml) | Postgres, Redis, Django `web`, Celery `worker`, Celery `beat` |

---

## End-to-end flow

1. **ESPN** — `espn_service` uses a Python client (`clients/espn_client.py`) to call ESPN site/core APIs (scores, teams, etc.).
2. **Persist** — Responses are normalized into Django models under `apps/espn` (teams, events, competitors, allowlist rows, etc.) via ingestion services in `apps/ingest/services.py`.
3. **Triggers** — Work is started in two main ways:
   - **HTTP write ingest** (on demand): `POST /api/v1/ingest/teams/` and `POST /api/v1/ingest/scoreboard/` run ingestion synchronously in the web process.
   - **Celery** (scheduled / background): Beat runs orchestrator tasks that enqueue `refresh_scoreboard_task` and `refresh_teams_task` with staggered execution so ESPN is not hammered in a tight loop (see cadence doc).
4. **Downstream read sync** — Consumers poll **`GET /api/sync/v1/teams`** and **`GET /api/sync/v1/events`** with cursor parameters (`limit`, optional `after_updated_at` + `after_id`) for incremental replication. Responses look like `{ "results": [...], "has_more": bool }`.

The main Betolyn backend can **POST ingest** when a league is missing data, then **GET sync** pages to upsert its own `Team` / `Match` entities.

---

## HTTP API surface (ingestion-related)

Mounted in [`espn_service/config/urls.py`](espn_service/config/urls.py):

| Prefix | Purpose |
|--------|---------|
| `/api/v1/ingest/` | **Write path**: teams + scoreboard ingestion (`apps/ingest/urls.py`) |
| `/api/sync/v1/` | **Public read path** for cursor sync (`apps/ingest/sync_urls.py`) — unauthenticated by design for the internal consumer; protect at the network layer in production |
| `/api/v1/` | Query APIs for teams/events (DRF list/detail) |
| `/healthz` | Liveness |

OpenAPI/Swagger: `/api/docs/` when the service is running.

---

## Running locally (Docker)

From **`backend-ingestion/`**:

```bash
cd espn_service
cp .env.example .env
cd ..
docker compose up --build
```

- **API**: `http://localhost:8010` (compose maps host `8010` → container `8000`).
- **Worker** listens on `celery` and `ingest` queues; **Beat** drives the schedule.

For Postgres credentials and port overrides, see [`espn_service/README.md`](espn_service/README.md).

**Dev note:** Local Django settings may use `CELERY_TASK_ALWAYS_EAGER=True` so tasks run in-process. For behavior that matches production (tasks on the worker), set eager mode off and rely on worker + Beat — as described in `espn_service/README.md` under allowlist/Celery.

---

## Allowlist and scheduling

Scheduled ingestion is driven by **`AllowlistedCompetition`** (admin + seed data). Orchestrators:

- **Daily horizon** — extend scoreboard coverage date-by-date with chains of `refresh_scoreboard_task`, cursor updates only after successful ingests.
- **Monthly teams** — `refresh_teams_task` per enabled row, staggered.

Details, environment variables (`ALLOWLIST_FANOUT_*`, `CELERY_ROUTE_INGEST_TO_QUEUE`, etc.), and queue names are documented in [**ingestion_cadence.md**](espn_service/docs/ingestion_cadence.md).

---

## Tests and operations

- Python tests live under `espn_service/tests/` (e.g. `test_ingestion.py`, `test_allowlist_fanout.py`).
- CI: [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

---

## Related documentation

- **ESPN endpoint reference** (this repo root): [README.md](README.md)  
- **Service runbook**: [espn_service/README.md](espn_service/README.md)  
- **Cadence & env**: [espn_service/docs/ingestion_cadence.md](espn_service/docs/ingestion_cadence.md)  
- **Optional DB schema**: [espn_service/docs/deployment_feed_schema.md](espn_service/docs/deployment_feed_schema.md)
