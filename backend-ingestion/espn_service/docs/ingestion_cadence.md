# Ingestion cadence (allowlist + Celery)

**See also:** full-stack ingestion design in [`plans/ingestion-feed-architecture_63e82c3a.plan.md`](plans/ingestion-feed-architecture_63e82c3a.plan.md) and historical Celery fan-out refactor notes in [`plans/celery_allowlist_fan-out_176bfdae.plan.md`](plans/celery_allowlist_fan-out_176bfdae.plan.md).

## Overview

Scheduled allowlist work is split into **orchestrator** tasks (cheap, DB-only) and **worker** tasks (ESPN HTTP). Orchestrators enqueue child work with **wall-clock `eta`** in UTC so execution is spread over time instead of one process hammering ESPN in a tight loop.

## Daily horizon (`extend_cursor_date`)

- **Beat** (default **00:15 UTC**) runs `fan_out_allowlist_horizon_task`.
- The orchestrator loads enabled `AllowlistedCompetition` rows, computes up to **three** calendar dates per row (same rules as before: cold start uses `today..today+2`, else `cursor+1..cursor+3`, capped at `today + MAX_FUTURE_DAYS` in `apps/ingest/tasks.py`).
- For each row with work, it enqueues a **Celery chain** of `refresh_scoreboard_task` calls (one signature per date, **sequential** per competition). Chains for different rows start at staggered **`eta`** values.
- **`extend_cursor_date` (Option B):** the orchestrator does **not** advance the cursor. The **last** step of each chain passes `finalize_allowlist_horizon=True`; after a successful ingest with **`errors == 0`**, that task updates `extend_cursor_date` to that date inside a transaction with `select_for_update`.
- **`refresh_scoreboard_task`:** `acks_late=True`, `max_retries=2` (initial attempt plus two retries).

## Monthly teams

- **Beat** (default **1st of month, 04:30 UTC**) runs `fan_out_monthly_allowlist_teams_task`.
- The orchestrator enqueues one `refresh_teams_task` per enabled row with staggered `eta`.
- **`refresh_teams_task`:** `max_retries=2`, `acks_late=True`.

## Environment variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `ALLOWLIST_FANOUT_STAGGER_SECONDS` | Seconds between **start** of consecutive horizon chains | `600` (10 min) |
| `ALLOWLIST_FANOUT_MAX_CHAINS_PER_RUN` | Max chains enqueued per daily run (`0` = unlimited) | `0` |
| `ALLOWLIST_FANOUT_FIRST_SLOT_OFFSET_SECONDS` | Added to “now” before computing the first `eta` | `0` |
| `ALLOWLIST_TEAMS_FANOUT_STAGGER_SECONDS` | Seconds between monthly team task `eta`s | `600` |
| `ALLOWLIST_TEAMS_FANOUT_MAX_TASKS_PER_RUN` | Cap monthly enqueues (`0` = unlimited) | `0` |
| `CELERY_ROUTE_INGEST_TO_QUEUE` | If `true`, route scoreboard/teams refresh tasks to queue `ingest` | `false` |

## Workers and queues

- Default queue name is `celery`. With `CELERY_ROUTE_INGEST_TO_QUEUE=true`, child refresh tasks go to **`ingest`**.
- Listen on both queues, e.g.:

```bash
celery -A config worker -l INFO -Q celery,ingest
```

- Optional: run a **second** worker process that only consumes `ingest` with higher concurrency for isolation. `docker-compose.yml` / `docker-compose.prod.yml` use `-Q celery,ingest` so routing can be enabled without another container.

## Backward-compatible task names

- `daily_allowlist_horizon_extend_task` — same implementation as `fan_out_allowlist_horizon_task` (manual/legacy triggers).
- `monthly_allowlist_teams_task` — same as `fan_out_monthly_allowlist_teams_task`.

## Related plans

- Cursor plan: **Celery allowlist fan-out** (`celery_allowlist_fan-out_176bfdae.plan.md`).
- Broader architecture: **ingestion-feed-architecture** plan (HTTP sync API, caps, postponed events).
