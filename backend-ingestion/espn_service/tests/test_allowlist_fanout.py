"""Tests for allowlist horizon fan-out orchestration."""

import uuid
from datetime import date, datetime, timedelta, timezone as dt_timezone
from unittest.mock import MagicMock, patch

import pytest
from django.test.utils import override_settings

from apps.espn.models import AllowlistedCompetition
from apps.ingest.tasks import (
    MAX_FUTURE_DAYS,
    compute_allowlist_horizon_dates,
    fan_out_allowlist_horizon_task,
    fan_out_monthly_allowlist_teams_task,
    refresh_scoreboard_task,
)


@pytest.mark.parametrize(
    ("extend_cursor", "expected_first"),
    [
        (None, None),  # first batch starts at today
        (date(2025, 1, 10), date(2025, 1, 11)),  # next is cursor+1
    ],
)
def test_compute_allowlist_horizon_dates(extend_cursor, expected_first):
    today = date(2025, 1, 5)
    dates = compute_allowlist_horizon_dates(extend_cursor, today, max_future_days=MAX_FUTURE_DAYS)
    if extend_cursor is None:
        assert dates == [today, today + timedelta(days=1), today + timedelta(days=2)]
    else:
        assert dates[0] == expected_first
        assert len(dates) == 3


def test_compute_allowlist_horizon_respects_cap():
    today = date(2025, 1, 1)
    cap_days = 2
    dates = compute_allowlist_horizon_dates(None, today, max_future_days=cap_days)
    cap = today + timedelta(days=cap_days)
    assert all(d <= cap for d in dates)
    assert dates == [today, today + timedelta(days=1), today + timedelta(days=2)]


@pytest.mark.django_db
@patch("apps.ingest.tasks.chain")
def test_fan_out_allowlist_enqueues_staggered_chains(mock_chain, settings):
    settings.ALLOWLIST_FANOUT_STAGGER_SECONDS = 120
    settings.ALLOWLIST_FANOUT_MAX_CHAINS_PER_RUN = 0
    settings.ALLOWLIST_FANOUT_FIRST_SLOT_OFFSET_SECONDS = 0

    AllowlistedCompetition.objects.all().update(enabled=False)
    u = uuid.uuid4().hex[:8]
    AllowlistedCompetition.objects.create(
        sport_slug="basketball",
        league_slug=f"fanout-nba-{u}",
        team_source=AllowlistedCompetition.TEAM_SOURCE_LEAGUE,
        display_name="NBA",
        enabled=True,
        extend_cursor_date=None,
        sort_order=0,
    )
    AllowlistedCompetition.objects.create(
        sport_slug="football",
        league_slug=f"fanout-nfl-{u}",
        team_source=AllowlistedCompetition.TEAM_SOURCE_LEAGUE,
        display_name="NFL",
        enabled=True,
        extend_cursor_date=None,
        sort_order=1,
    )

    chain_instances: list[MagicMock] = []

    def chain_side_effect(*_args, **_kwargs):
        inst = MagicMock()
        chain_instances.append(inst)
        return inst

    mock_chain.side_effect = chain_side_effect

    fixed_now = datetime(2025, 6, 15, 3, 15, tzinfo=dt_timezone.utc)
    with patch("apps.ingest.tasks.timezone.now", return_value=fixed_now):
        summary = fan_out_allowlist_horizon_task.apply().result

    assert mock_chain.call_count == 2
    assert len(chain_instances) == 2
    assert summary["_meta"]["enqueued_chains"] == 2
    assert summary["_meta"]["stagger_seconds"] == 120

    first_eta = chain_instances[0].apply_async.call_args.kwargs["eta"]
    second_eta = chain_instances[1].apply_async.call_args.kwargs["eta"]
    assert first_eta == fixed_now
    assert second_eta == fixed_now + timedelta(seconds=120)


@pytest.mark.django_db
@patch("apps.ingest.tasks.chain")
def test_fan_out_allowlist_respects_max_chains(mock_chain, settings):
    settings.ALLOWLIST_FANOUT_STAGGER_SECONDS = 60
    settings.ALLOWLIST_FANOUT_MAX_CHAINS_PER_RUN = 1

    AllowlistedCompetition.objects.all().update(enabled=False)
    u = uuid.uuid4().hex[:8]
    for i in range(2):
        AllowlistedCompetition.objects.create(
            sport_slug="basketball",
            league_slug=f"fanout-cap-{u}-{i}",
            team_source=AllowlistedCompetition.TEAM_SOURCE_LEAGUE,
            display_name=f"L{i}",
            enabled=True,
            sort_order=i,
        )

    chain_inst = MagicMock()
    mock_chain.return_value = chain_inst

    summary = fan_out_allowlist_horizon_task.apply().result

    assert mock_chain.call_count == 1
    assert summary["_meta"]["enqueued_chains"] == 1
    skipped = [k for k, v in summary.items() if k != "_meta" and v.get("status") == "deferred_cap"]
    assert len(skipped) == 1


@pytest.mark.django_db
@patch("apps.ingest.tasks.refresh_teams_task.apply_async")
def test_fan_out_monthly_teams_stagger(mock_apply, settings):
    settings.ALLOWLIST_TEAMS_FANOUT_STAGGER_SECONDS = 90
    settings.ALLOWLIST_TEAMS_FANOUT_MAX_TASKS_PER_RUN = 0

    AllowlistedCompetition.objects.all().update(enabled=False)
    u = uuid.uuid4().hex[:8]
    slug = f"fanout-epl-{u}"
    AllowlistedCompetition.objects.create(
        sport_slug="soccer",
        league_slug=slug,
        team_source=AllowlistedCompetition.TEAM_SOURCE_LEAGUE,
        display_name="EPL",
        enabled=True,
        sort_order=0,
    )

    fixed_now = datetime(2025, 1, 1, 4, 30, tzinfo=dt_timezone.utc)
    with patch("apps.ingest.tasks.timezone.now", return_value=fixed_now):
        summary = fan_out_monthly_allowlist_teams_task.apply().result

    assert mock_apply.call_count == 1
    assert mock_apply.call_args.kwargs["eta"] == fixed_now
    assert mock_apply.call_args.kwargs["args"] == ["soccer", slug]
    assert summary["_meta"]["enqueued"] == 1


@pytest.mark.django_db
@override_settings(CELERY_TASK_ALWAYS_EAGER=True, CELERY_TASK_EAGER_PROPAGATES=True)
def test_refresh_scoreboard_finalize_advances_cursor():
    from apps.ingest.services import IngestionResult

    u = uuid.uuid4().hex[:8]
    slug = f"fanout-cursor-{u}"
    comp = AllowlistedCompetition.objects.create(
        sport_slug="basketball",
        league_slug=slug,
        team_source=AllowlistedCompetition.TEAM_SOURCE_LEAGUE,
        display_name="NBA",
        enabled=True,
        extend_cursor_date=None,
    )

    with patch(
        "apps.ingest.tasks.ScoreboardIngestionService"
    ) as mock_svc_cls:
        mock_svc_cls.return_value.ingest_scoreboard.return_value = IngestionResult(
            created=0, updated=0, errors=0
        )
        refresh_scoreboard_task.apply(
            args=("basketball", slug, "20250620"),
            kwargs={
                "allowlist_competition_id": comp.id,
                "finalize_allowlist_horizon": True,
            },
        ).get()

    comp.refresh_from_db()
    assert comp.extend_cursor_date == date(2025, 6, 20)


@pytest.mark.django_db
@override_settings(CELERY_TASK_ALWAYS_EAGER=True, CELERY_TASK_EAGER_PROPAGATES=True)
def test_refresh_scoreboard_finalize_skipped_when_errors():
    from apps.ingest.services import IngestionResult

    u = uuid.uuid4().hex[:8]
    slug = f"fanout-err-{u}"
    comp = AllowlistedCompetition.objects.create(
        sport_slug="basketball",
        league_slug=slug,
        team_source=AllowlistedCompetition.TEAM_SOURCE_LEAGUE,
        display_name="NBA",
        enabled=True,
        extend_cursor_date=date(2025, 6, 1),
    )

    with patch(
        "apps.ingest.tasks.ScoreboardIngestionService"
    ) as mock_svc_cls:
        mock_svc_cls.return_value.ingest_scoreboard.return_value = IngestionResult(
            created=0, updated=0, errors=1
        )
        refresh_scoreboard_task.apply(
            args=("basketball", slug, "20250620"),
            kwargs={
                "allowlist_competition_id": comp.id,
                "finalize_allowlist_horizon": True,
            },
        ).get()

    comp.refresh_from_db()
    assert comp.extend_cursor_date == date(2025, 6, 1)
