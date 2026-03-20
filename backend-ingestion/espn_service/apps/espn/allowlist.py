"""Allowlisted competitions for v1 ingestion (soccer-focused + UFC/NBA/tennis).

Girabola: slug TBD — row is disabled until discovered (see docs/sports discovery).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Final


@dataclass(frozen=True, slots=True)
class CompetitionRow:
    """One allowlisted competition row."""

    sport_slug: str
    league_slug: str
    team_source: str  # "league_roster" | "tournament_roster"
    display_name: str
    enabled: bool = True


# Plan: ~25 soccer rows + UFC + NBA + ATP + WTA
COMPETITION_ALLOWLIST: Final[tuple[CompetitionRow, ...]] = (
    # Main domestic leagues
    CompetitionRow("soccer", "ang.1", "league_roster", "Girabola (Angola) — slug TBD, using ang.1 placeholder", False),
    CompetitionRow("soccer", "esp.1", "league_roster", "La Liga"),
    CompetitionRow("soccer", "eng.1", "league_roster", "Premier League"),
    CompetitionRow("soccer", "por.1", "league_roster", "Liga NOS"),
    CompetitionRow("soccer", "ger.1", "league_roster", "Bundesliga"),
    CompetitionRow("soccer", "ita.1", "league_roster", "Serie A"),
    CompetitionRow("soccer", "fra.1", "league_roster", "Ligue 1"),
    # UEFA / FIFA
    CompetitionRow("soccer", "uefa.champions", "tournament_roster", "UEFA Champions League"),
    CompetitionRow("soccer", "uefa.europa", "tournament_roster", "UEFA Europa League"),
    CompetitionRow("soccer", "uefa.europa.conf", "tournament_roster", "UEFA Conference League"),
    CompetitionRow("soccer", "uefa.nations", "tournament_roster", "UEFA Nations League"),
    CompetitionRow("soccer", "fifa.world", "tournament_roster", "FIFA World Cup"),
    CompetitionRow("soccer", "fifa.cwc", "tournament_roster", "FIFA Club World Cup"),
    CompetitionRow("soccer", "fifa.friendly", "tournament_roster", "International friendlies"),
    # CAF / Africa
    CompetitionRow("soccer", "caf.champions", "tournament_roster", "CAF Champions League"),
    CompetitionRow("soccer", "caf.confed", "tournament_roster", "CAF Confederation Cup"),
    CompetitionRow("soccer", "caf.nations", "tournament_roster", "Africa Cup of Nations"),
    CompetitionRow("soccer", "caf.nations_qual", "tournament_roster", "AFCON qualifying"),
    CompetitionRow("soccer", "fifa.worldq.caf", "tournament_roster", "FIFA World Cup qualifying (CAF)"),
    # Domestic cups
    CompetitionRow("soccer", "por.taca.portugal", "tournament_roster", "Taça de Portugal"),
    CompetitionRow("soccer", "esp.copa_del_rey", "tournament_roster", "Copa del Rey"),
    CompetitionRow("soccer", "ita.coppa_italia", "tournament_roster", "Coppa Italia"),
    CompetitionRow("soccer", "ger.dfb_pokal", "tournament_roster", "DFB-Pokal"),
    CompetitionRow("soccer", "fra.coupe_de_france", "tournament_roster", "Coupe de France"),
    CompetitionRow("soccer", "eng.fa", "tournament_roster", "FA Cup"),
    # Other sports
    CompetitionRow("mma", "ufc", "tournament_roster", "UFC"),
    CompetitionRow("basketball", "nba", "league_roster", "NBA"),
    CompetitionRow("tennis", "atp", "league_roster", "ATP"),
    CompetitionRow("tennis", "wta", "league_roster", "WTA"),
)


def enabled_competitions() -> list[CompetitionRow]:
    return [r for r in COMPETITION_ALLOWLIST if r.enabled]
