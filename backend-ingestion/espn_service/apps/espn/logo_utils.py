"""Normalize ESPN team logo payloads (variable shape across endpoints)."""

from __future__ import annotations

from typing import Any


def normalize_espn_logos(raw: Any) -> list[dict[str, Any]]:
    """Coerce ESPN `logo` / `logos` fields into a list of logo dicts.

    Scoreboard competitors often use ``logo`` (singular); team directory uses ``logos``.
    Values may be a list, a single dict, empty, or missing.
    """
    if raw is None:
        return []
    if isinstance(raw, dict):
        return [raw]
    if isinstance(raw, str):
        s = raw.strip()
        return [{"href": s, "rel": ["default"]}] if s else []
    if isinstance(raw, list):
        out: list[dict[str, Any]] = []
        for item in raw:
            if isinstance(item, dict):
                out.append(item)
            elif isinstance(item, str) and item.strip():
                out.append({"href": item.strip(), "rel": ["default"]})
        return out
    return []


def primary_logo_href(logos: list[dict[str, Any]]) -> str | None:
    """Pick the best display URL from normalized logo dicts (``href`` / ``url``)."""
    if not logos:
        return None

    def href_of(logo: dict[str, Any]) -> str | None:
        h = logo.get("href") or logo.get("url")
        return h.strip() if isinstance(h, str) and h.strip() else None

    def rel_tokens(logo: dict[str, Any]) -> set[str]:
        rel = logo.get("rel")
        if rel is None:
            return set()
        if isinstance(rel, str):
            return {rel.lower()}
        if isinstance(rel, list):
            return {str(x).lower() for x in rel}
        return set()

    # ESPN usually marks the main mark with "default" in rel (often alongside "full")
    for logo in logos:
        if "default" in rel_tokens(logo):
            h = href_of(logo)
            if h:
                return h

    for logo in logos:
        h = href_of(logo)
        if h:
            return h
    return None
