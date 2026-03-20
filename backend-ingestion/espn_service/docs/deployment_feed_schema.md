# PostgreSQL `feed` schema (optional production layout)

Betolyn can consume data via the **public HTTP sync API** (`/api/sync/v1/...`); it does not require JDBC to this database. The Django app still stores ESPN models in the **default database** (often `public` schema).

To isolate ingest tables in a dedicated **`feed`** schema on PostgreSQL:

1. Create schema and grants (adjust role names):

```sql
CREATE SCHEMA IF NOT EXISTS feed;
GRANT USAGE ON SCHEMA feed TO your_ingest_role;
```

2. Move existing `espn_*` tables from `public` to `feed` (order matters for FKs):

```sql
ALTER TABLE espn_sport SET SCHEMA feed;
ALTER TABLE espn_league SET SCHEMA feed;
ALTER TABLE espn_venue SET SCHEMA feed;
ALTER TABLE espn_team SET SCHEMA feed;
ALTER TABLE espn_event SET SCHEMA feed;
ALTER TABLE espn_competitor SET SCHEMA feed;
ALTER TABLE espn_athlete SET SCHEMA feed;
ALTER TABLE espn_allowlistedcompetition SET SCHEMA feed;
```

3. Point Django at qualified table names by setting on each model `Meta.db_table = '"feed"."espn_team"'` (etc.) and generating a migration, **or** set `search_path=feed,public` only for the ingest DB role (leave Django auth tables in `public`).

**SQLite** (tests): keep default `public`-equivalent layout; do not run schema moves.

**Dev reset:** resetting only the Betolyn app database does not clear this feed database when they are separate instances.
