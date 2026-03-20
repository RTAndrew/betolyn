"""Celery tasks for data ingestion.

These tasks can be scheduled via Celery Beat or triggered manually.
"""

from datetime import date, datetime, timedelta

import structlog
from celery import chain, shared_task
from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.ingest.services import ScoreboardIngestionService, TeamIngestionService
from apps.espn.models import AllowlistedCompetition

logger = structlog.get_logger(__name__)

# Horizon extension cap (days ahead of calendar "today", inclusive).
MAX_FUTURE_DAYS = 20

# All major leagues to refresh in scheduled tasks.
# Covers all 17 ESPN sports with primary professional leagues.
ALL_LEAGUES_CONFIG: list[tuple[str, str]] = [
    # Football
    ("football", "nfl"),
    ("football", "college-football"),
    ("football", "cfl"),
    ("football", "ufl"),
    # Basketball
    ("basketball", "nba"),
    ("basketball", "wnba"),
    ("basketball", "mens-college-basketball"),
    ("basketball", "womens-college-basketball"),
    ("basketball", "nba-development"),
    # Baseball
    ("baseball", "mlb"),
    ("baseball", "college-baseball"),
    # Hockey
    ("hockey", "nhl"),
    ("hockey", "mens-college-hockey"),
    # Soccer (major leagues)
    ("soccer", "eng.1"),
    ("soccer", "usa.1"),
    ("soccer", "esp.1"),
    ("soccer", "ger.1"),
    ("soccer", "ita.1"),
    ("soccer", "fra.1"),
    ("soccer", "mex.1"),
    ("soccer", "uefa.champions"),
    ("soccer", "uefa.europa"),
    ("soccer", "usa.nwsl"),
    # MMA
    ("mma", "ufc"),
    # Golf
    ("golf", "pga"),
    ("golf", "lpga"),
    ("golf", "liv"),
    # Tennis
    ("tennis", "atp"),
    ("tennis", "wta"),
    # Racing
    ("racing", "f1"),
    ("racing", "irl"),
    ("racing", "nascar-premier"),
    # Rugby (numeric slugs)
    ("rugby", "164205"),   # Rugby World Cup
    ("rugby", "180659"),   # Six Nations
    ("rugby", "267979"),   # Gallagher Premiership
    ("rugby", "242041"),   # Super Rugby Pacific
    # Rugby League
    ("rugby-league", "3"),
    # Lacrosse
    ("lacrosse", "pll"),
    ("lacrosse", "nll"),
    # Australian Football
    ("australian-football", "afl"),
    # Cricket
    ("cricket", "icc.t20"),
    ("cricket", "ipl"),
    # Volleyball
    ("volleyball", "fivb.w"),
    ("volleyball", "fivb.m"),
]


def compute_allowlist_horizon_dates(
    extend_cursor: date | None,
    today: date,
    max_future_days: int = MAX_FUTURE_DAYS,
) -> list[date]:
    """Calendar dates to fetch for one allowlist row (same rules as legacy daily task)."""
    cap = today + timedelta(days=max_future_days)
    if extend_cursor is None:
        chunk = [today + timedelta(days=i) for i in range(3)]
    else:
        chunk = [extend_cursor + timedelta(days=i) for i in range(1, 4)]
    return [d for d in chunk if d <= cap]


def _commit_allowlist_horizon_cursor(comp_id: int, end_date: date) -> None:
    """Persist horizon cursor after a successful chained ingest (Option B)."""
    with transaction.atomic():
        comp = AllowlistedCompetition.objects.select_for_update().get(pk=comp_id)
        comp.extend_cursor_date = end_date
        comp.save(update_fields=["extend_cursor_date", "updated_at"])


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=600,
    max_retries=2,
    acks_late=True,
)
def refresh_scoreboard_task(
    self,
    sport: str,
    league: str,
    date: str | None = None,
    allowlist_competition_id: int | None = None,
    finalize_allowlist_horizon: bool = False,
) -> dict:
    """Celery task to refresh scoreboard data.

    Args:
        sport: Sport slug (e.g., "basketball")
        league: League slug (e.g., "nba")
        date: Optional date in YYYYMMDD format
        allowlist_competition_id: When set with a horizon chain, ties ingest to allowlist row
        finalize_allowlist_horizon: If True, advance extend_cursor_date when ingest has no errors

    Returns:
        Dict with ingestion results
    """
    logger.info(
        "starting_scoreboard_refresh_task",
        sport=sport,
        league=league,
        date=date,
        task_id=self.request.id,
        finalize_allowlist_horizon=finalize_allowlist_horizon,
    )

    service = ScoreboardIngestionService()
    result = service.ingest_scoreboard(sport, league, date)

    if (
        finalize_allowlist_horizon
        and allowlist_competition_id is not None
        and date
        and result.errors == 0
    ):
        end = datetime.strptime(date, "%Y%m%d").date()
        _commit_allowlist_horizon_cursor(allowlist_competition_id, end)
        logger.info(
            "allowlist_horizon_cursor_advanced",
            allowlist_competition_id=allowlist_competition_id,
            extend_cursor_date=end.isoformat(),
        )
    elif finalize_allowlist_horizon and allowlist_competition_id is not None and result.errors > 0:
        logger.warning(
            "allowlist_horizon_finalize_skipped_due_to_errors",
            allowlist_competition_id=allowlist_competition_id,
            date=date,
            errors=result.errors,
        )

    logger.info(
        "completed_scoreboard_refresh_task",
        sport=sport,
        league=league,
        date=date,
        created=result.created,
        updated=result.updated,
        errors=result.errors,
        task_id=self.request.id,
    )

    return result.to_dict()


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=600,
    max_retries=2,
    acks_late=True,
)
def refresh_teams_task(
    self,
    sport: str,
    league: str,
) -> dict:
    """Celery task to refresh team data.

    Args:
        sport: Sport slug (e.g., "basketball")
        league: League slug (e.g., "nba")

    Returns:
        Dict with ingestion results
    """
    logger.info(
        "starting_teams_refresh_task",
        sport=sport,
        league=league,
        task_id=self.request.id,
    )

    service = TeamIngestionService()
    result = service.ingest_teams(sport, league)

    logger.info(
        "completed_teams_refresh_task",
        sport=sport,
        league=league,
        created=result.created,
        updated=result.updated,
        errors=result.errors,
        task_id=self.request.id,
    )

    return result.to_dict()


@shared_task(bind=True)
def refresh_all_teams_task(self) -> dict:
    """Celery task to refresh team data for all configured leagues.

    Covers all 17 ESPN sports. Failures per league are logged and
    aggregated; the task completes even if individual leagues fail.

    Returns:
        Dict with aggregated results by league key (sport/league)
    """
    results = {}

    for sport, league in ALL_LEAGUES_CONFIG:
        try:
            service = TeamIngestionService()
            result = service.ingest_teams(sport, league)
            results[f"{sport}/{league}"] = result.to_dict()
        except Exception as e:
            logger.error(
                "league_teams_refresh_failed",
                sport=sport,
                league=league,
                error=str(e),
            )
            results[f"{sport}/{league}"] = {"error": str(e)}

    return results


@shared_task(bind=True)
def refresh_daily_scoreboards_task(self) -> dict:
    """Celery task to refresh today's scoreboards for all leagues.

    Covers all 17 ESPN sports. Failures per league are logged and
    aggregated; the task completes even if individual leagues fail.

    Returns:
        Dict with aggregated results by league key (sport/league)
    """
    today = datetime.now().strftime("%Y%m%d")
    results = {}

    for sport, league in ALL_LEAGUES_CONFIG:
        try:
            service = ScoreboardIngestionService()
            result = service.ingest_scoreboard(sport, league, today)
            results[f"{sport}/{league}"] = result.to_dict()
        except Exception as e:
            logger.error(
                "league_scoreboard_refresh_failed",
                sport=sport,
                league=league,
                date=today,
                error=str(e),
            )
            results[f"{sport}/{league}"] = {"error": str(e)}

    return results


def _fan_out_allowlist_horizon_work(task_id: str | None) -> dict[str, object]:
    """Enqueue one Celery chain per allowlist row: sequential dates, staggered chain starts."""
    today = timezone.now().date()
    stagger = max(0, int(getattr(settings, "ALLOWLIST_FANOUT_STAGGER_SECONDS", 600)))
    max_chains = int(getattr(settings, "ALLOWLIST_FANOUT_MAX_CHAINS_PER_RUN", 0))
    offset = max(0, int(getattr(settings, "ALLOWLIST_FANOUT_FIRST_SLOT_OFFSET_SECONDS", 0)))

    anchor = timezone.now() + timedelta(seconds=offset)
    summary: dict[str, object] = {}
    slot = 0
    enqueued = 0
    skipped_cap: list[str] = []

    comps = list(
        AllowlistedCompetition.objects.filter(enabled=True).order_by("sort_order", "id")
    )

    for comp in comps:
        key = f"{comp.sport_slug}/{comp.league_slug}"
        to_fetch = compute_allowlist_horizon_dates(comp.extend_cursor_date, today)
        if not to_fetch:
            summary[key] = {"status": "at_cap_or_noop"}
            continue

        if max_chains > 0 and enqueued >= max_chains:
            skipped_cap.append(key)
            summary[key] = {"status": "deferred_cap", "dates": [d.isoformat() for d in to_fetch]}
            continue

        date_strs = [d.strftime("%Y%m%d") for d in to_fetch]
        chain_sigs = []
        for j, ds in enumerate(date_strs):
            is_last = j == len(date_strs) - 1
            # Immutable signatures: chain would otherwise pass the previous task's
            # return value as the first arg and break refresh_scoreboard_task's params.
            chain_sigs.append(
                refresh_scoreboard_task.si(
                    comp.sport_slug,
                    comp.league_slug,
                    ds,
                    allowlist_competition_id=comp.id,
                    finalize_allowlist_horizon=is_last,
                )
            )

        eta = anchor + timedelta(seconds=slot * stagger)
        chain(*chain_sigs).apply_async(
            eta=eta,
        )
        logger.info(
            "allowlist_horizon_chain_enqueued",
            task_id=task_id,
            allowlist_key=key,
            dates=date_strs,
            eta=eta.isoformat(),
            slot=slot,
            stagger_seconds=stagger,
        )
        summary[key] = {
            "enqueued_dates": date_strs,
            "chain_eta_utc": eta.isoformat(),
            "slot": slot,
        }
        slot += 1
        enqueued += 1

    if skipped_cap:
        logger.warning(
            "allowlist_horizon_fanout_cap_reached",
            task_id=task_id,
            max_chains=max_chains,
            skipped_keys=skipped_cap,
        )

    summary["_meta"] = {
        "enqueued_chains": enqueued,
        "stagger_seconds": stagger,
        "max_chains_per_run": max_chains,
    }
    return summary


@shared_task(bind=True)
def fan_out_allowlist_horizon_task(self) -> dict[str, object]:
    """Orchestrator: enqueue staggered scoreboard chains for allowlisted horizon extension."""
    return _fan_out_allowlist_horizon_work(self.request.id)


@shared_task(bind=True)
def daily_allowlist_horizon_extend_task(self) -> dict[str, object]:
    """Backward-compatible name; same behavior as fan_out_allowlist_horizon_task."""
    return _fan_out_allowlist_horizon_work(self.request.id)


def _fan_out_monthly_allowlist_teams_work(task_id: str | None) -> dict[str, object]:
    stagger = max(0, int(getattr(settings, "ALLOWLIST_TEAMS_FANOUT_STAGGER_SECONDS", 600)))
    max_tasks = int(getattr(settings, "ALLOWLIST_TEAMS_FANOUT_MAX_TASKS_PER_RUN", 0))
    anchor = timezone.now()
    summary: dict[str, object] = {}
    slot = 0
    enqueued = 0
    skipped_cap: list[str] = []

    for comp in AllowlistedCompetition.objects.filter(enabled=True).order_by("sort_order", "id"):
        key = f"{comp.sport_slug}/{comp.league_slug}"
        if max_tasks > 0 and enqueued >= max_tasks:
            skipped_cap.append(key)
            summary[key] = {"status": "deferred_cap"}
            continue

        eta = anchor + timedelta(seconds=slot * stagger)
        refresh_teams_task.apply_async(
            args=[comp.sport_slug, comp.league_slug],
            eta=eta,
        )
        logger.info(
            "allowlist_teams_task_enqueued",
            task_id=task_id,
            allowlist_key=key,
            eta=eta.isoformat(),
            slot=slot,
            stagger_seconds=stagger,
        )
        summary[key] = {"enqueued": True, "eta_utc": eta.isoformat(), "slot": slot}
        slot += 1
        enqueued += 1

    if skipped_cap:
        logger.warning(
            "allowlist_teams_fanout_cap_reached",
            task_id=task_id,
            max_tasks=max_tasks,
            skipped_keys=skipped_cap,
        )

    summary["_meta"] = {
        "enqueued": enqueued,
        "stagger_seconds": stagger,
        "max_tasks_per_run": max_tasks,
    }
    return summary


@shared_task(bind=True)
def fan_out_monthly_allowlist_teams_task(self) -> dict[str, object]:
    """Orchestrator: enqueue staggered team refreshes per allowlist row."""
    return _fan_out_monthly_allowlist_teams_work(self.request.id)


@shared_task(bind=True)
def monthly_allowlist_teams_task(self) -> dict[str, object]:
    """Backward-compatible name; same behavior as fan_out_monthly_allowlist_teams_task."""
    return _fan_out_monthly_allowlist_teams_work(self.request.id)
