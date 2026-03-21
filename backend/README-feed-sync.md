# ESPN feed HTTP sync (Betolyn)

Scheduled job pulls from **`espn_service`** public API:

- `GET {baseUrl}/api/sync/v1/teams`
- `GET {baseUrl}/api/sync/v1/events`

Event rows include **`home_team_score`** / **`away_team_score`** (from competitor `score` when numeric).

Each team row includes **`logo`** (primary URL) and often **`logos`** (ESPN array). Sync writes **one** URL to **`badgeUrl`**: use `logo` when set, otherwise the same primary pick as ingestion (`default` in `rel`, else first `href` / `url`).

## Configuration (`application.yml`)

| Property | Description |
|----------|-------------|
| `app.ingestion.enabled` | `true` to run `@Scheduled` sync |
| `app.ingestion.run-on-startup` | `true` = run **one** full sync when the app finishes starting (no need to enable the scheduler) |
| `app.ingestion.base-url` | ESPN service origin (e.g. `http://localhost:8010`) |
| `app.ingestion.cron` | Default every 5 minutes (`0 */5 * * * *`) |
| `app.ingestion.trigger-ingest-for-pending-leagues` | If an event’s home/away teams are missing in Betolyn, enqueue `(sport_slug, league_slug)` and `POST` espn_service **`/api/v1/ingest/teams/`** + **`/api/v1/ingest/scoreboard/`** (last N UTC days) before the next pass |
| `app.ingestion.ingest-horizon-days` | Days of scoreboard ingest per queued league (1–30, default 7) |
| `app.ingestion.max-sync-passes` | Ingest + pull teams + pull events, repeated up to this many times if the queue is still non-empty |
| `app.ingestion.shadow.enabled` | Log-only shadow tick after sync (diff tooling placeholder) |
| `app.ingestion.shadow.log-diffs` | Extra diff logging when shadow is enabled |

Env overrides: `ESPN_SERVICE_BASE_URL` (via `app.ingestion.base-url` default), or Spring-style `APP_INGESTION_*` / `APP_INGESTION_SHADOW_*` (e.g. `APP_INGESTION_RUN_ON_STARTUP=true`).

### Manual sync (one-shot)

1. **Start ESPN ingestion** on `8010` (or your `base-url`).
2. Run Betolyn with a single sync after startup, then stop or turn the flag off:

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.arguments="--app.ingestion.run-on-startup=true"
```

Or env: `APP_INGESTION_RUN_ON_STARTUP=true ./mvnw spring-boot:run`

3. **Recurring sync**: set `app.ingestion.enabled=true` and keep the app running; the cron fires on schedule.

There is no public HTTP “sync now” endpoint yet; use `run-on-startup` or enable the scheduler.

### How the cursor works (simple)

The API returns teams/events in a **fixed order** (by time updated, then database id).

- **`limit`**: “Give me at most N rows in this bite.” So the server doesn’t send millions of rows at once.
- **`after_updated_at` + `after_id`**: “I already got everything **up to** this exact row; give me the **next** rows after it.”

**Why `after_id` and not only time?**  
Two rows can have the **same** `updated_at` timestamp. If you only said “after this time,” you wouldn’t know **which** row was last—you might **skip** some or **repeat** some. The id is a **tie-breaker**: “same second as last time, but **bigger id** than last row.”

So: **time = which moment**, **id = which row at that moment**. Together they’re a bookmark for “continue from here.”

## Database

Table **`ingestion_state`** stores per-source HTTP cursors (`teams`, `events`). Seeded automatically on empty DB.

Teams and matches gain optional **`espn_id`** (unique) plus fields filled from the feed. Matches synced from the feed may have **null** `created_by` / `updated_by` (no human user in that job).
