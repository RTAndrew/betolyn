"""URL routes for public sync read API (Betolyn)."""

from django.urls import path

from apps.ingest.sync_views import SyncEventsView, SyncTeamsView

urlpatterns = [
    path("teams", SyncTeamsView.as_view(), name="sync-teams"),
    path("events", SyncEventsView.as_view(), name="sync-events"),
]
