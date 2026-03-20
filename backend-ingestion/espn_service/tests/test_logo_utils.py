"""Tests for ESPN logo normalization."""

from apps.espn.logo_utils import normalize_espn_logos, primary_logo_href


def test_normalize_singular_logo_dict():
    raw = {"href": "https://a.png", "rel": ["full", "default"]}
    assert normalize_espn_logos(raw) == [raw]


def test_normalize_logos_plural_list():
    raw = [{"href": "https://b.png", "rel": ["default"]}]
    assert normalize_espn_logos(raw) == raw


def test_normalize_scoreboard_logo_key_list():
    raw = [{"href": "https://c.png"}]
    assert normalize_espn_logos(raw) == raw


def test_normalize_empty():
    assert normalize_espn_logos(None) == []
    assert normalize_espn_logos([]) == []


def test_primary_prefers_default_rel():
    logos = [
        {"href": "https://alt.png", "rel": ["full"]},
        {"href": "https://main.png", "rel": ["full", "default"]},
    ]
    assert primary_logo_href(logos) == "https://main.png"


def test_primary_falls_back_to_first_href():
    logos = [{"href": "https://only.png", "rel": ["full"]}]
    assert primary_logo_href(logos) == "https://only.png"


def test_primary_accepts_url_field():
    logos = [{"url": "https://u.png"}]
    assert primary_logo_href(logos) == "https://u.png"
