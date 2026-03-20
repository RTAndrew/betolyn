"""Public, unauthenticated read API for Betolyn feed sync (cursor pagination)."""

from __future__ import annotations

from django.db.models import Q
from django.utils import dateparse
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.espn.logo_utils import normalize_espn_logos
from apps.espn.models import Event, Team


def _parse_competitor_score(raw: str | None) -> int | None:
    """ESPN stores score as string; expose integer for sync consumers when possible."""
    if raw is None:
        return None
    s = str(raw).strip()
    if not s.isdigit():
        return None
    return int(s)


def _parse_cursor(after_updated_at: str | None, after_id: str | None) -> tuple[object | None, int | None]:
    """Return (parsed datetime or None, after_id int or None)."""
    adt = None
    if after_updated_at:
        adt = dateparse.parse_datetime(after_updated_at)
        if adt is None:
            return None, None
        if adt.tzinfo is None:
            from django.utils import timezone as dj_tz

            adt = dj_tz.make_aware(adt, dj_tz.get_current_timezone())
    aid: int | None = None
    if after_id is not None and str(after_id).strip() != "":
        try:
            aid = int(after_id)
        except ValueError:
            return None, None
    return adt, aid


def _apply_sync_cursor(qs, adt, aid):
    if adt is None and aid is None:
        return qs
    if adt is None or aid is None:
        # Require both for stable lexicographic cursor
        return qs.none()
    return qs.filter(Q(sync_cursor_at__gt=adt) | Q(sync_cursor_at=adt, id__gt=aid))


class SyncTeamsView(APIView):
    """GET /api/sync/v1/teams — paginated teams for Betolyn upsert."""

    authentication_classes: list = []
    permission_classes: list = []

    def get(self, request: Request) -> Response:
        after_updated_at = request.query_params.get("after_updated_at")
        after_id = request.query_params.get("after_id")
        try:
            limit = min(int(request.query_params.get("limit", 100)), 500)
        except ValueError:
            limit = 100
        if limit < 1:
            limit = 1

        adt, aid = _parse_cursor(after_updated_at, after_id)
        if (after_updated_at or after_id) and (adt is None or aid is None):
            return Response(
                {"detail": "Invalid after_updated_at / after_id pair (ISO-8601 + integer required)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        qs = Team.objects.select_related("league", "league__sport").order_by("sync_cursor_at", "id")
        qs = _apply_sync_cursor(qs, adt, aid)
        rows = list(qs[: limit + 1])
        has_more = len(rows) > limit
        rows = rows[:limit]

        payload = [
            {
                "id": t.id,
                "updated_at": t.sync_cursor_at.isoformat() if t.sync_cursor_at else t.updated_at.isoformat(),
                "espn_id": t.espn_id,
                "sport_slug": t.league.sport.slug,
                "league_slug": t.league.slug,
                "abbreviation": t.abbreviation,
                "display_name": t.display_name,
                "short_display_name": t.short_display_name,
                "name": t.name,
                "location": t.location,
                "color": t.color,
                "alternate_color": t.alternate_color,
                "logo": t.primary_logo,
                "logos": normalize_espn_logos(t.logos),
            }
            for t in rows
        ]
        return Response({"results": payload, "has_more": has_more})


class SyncEventsView(APIView):
    """GET /api/sync/v1/events — paginated events for Betolyn match upsert."""

    authentication_classes: list = []
    permission_classes: list = []

    def get(self, request: Request) -> Response:
        after_updated_at = request.query_params.get("after_updated_at")
        after_id = request.query_params.get("after_id")
        try:
            limit = min(int(request.query_params.get("limit", 100)), 500)
        except ValueError:
            limit = 100
        if limit < 1:
            limit = 1

        adt, aid = _parse_cursor(after_updated_at, after_id)
        if (after_updated_at or after_id) and (adt is None or aid is None):
            return Response(
                {"detail": "Invalid after_updated_at / after_id pair (ISO-8601 + integer required)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        qs = (
            Event.objects.select_related("league", "league__sport", "venue")
            .prefetch_related("competitors__team")
            .order_by("sync_cursor_at", "id")
        )
        qs = _apply_sync_cursor(qs, adt, aid)
        rows = list(qs[: limit + 1])
        has_more = len(rows) > limit
        rows = rows[:limit]

        payload = []
        for e in rows:
            home = away = None
            home_tid = away_tid = None
            home_score = away_score = None
            for c in e.competitors.all():
                if c.home_away == "home":
                    home = c.team.display_name if c.team else None
                    home_tid = c.team.espn_id if c.team else None
                    home_score = _parse_competitor_score(c.score)
                elif c.home_away == "away":
                    away = c.team.display_name if c.team else None
                    away_tid = c.team.espn_id if c.team else None
                    away_score = _parse_competitor_score(c.score)
            payload.append(
                {
                    "id": e.id,
                    "updated_at": e.sync_cursor_at.isoformat() if e.sync_cursor_at else e.updated_at.isoformat(),
                    "espn_id": e.espn_id,
                    "sport_slug": e.league.sport.slug,
                    "league_slug": e.league.slug,
                    "name": e.name,
                    "short_name": e.short_name,
                    "date": e.date.isoformat() if e.date else None,
                    "status": e.status,
                    "venue_name": e.venue.name if e.venue else "",
                    "home_team_espn_id": home_tid,
                    "away_team_espn_id": away_tid,
                    "home_team_name": home,
                    "away_team_name": away,
                    "home_team_score": home_score,
                    "away_team_score": away_score,
                }
            )

        return Response({"results": payload, "has_more": has_more})
