# Generated manually for allowlist + sync_cursor_at

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


def seed_allowlist(apps, schema_editor):
    AllowlistedCompetition = apps.get_model("espn", "AllowlistedCompetition")
    # Import tuple at migration time — stable slugs
    from apps.espn.allowlist import COMPETITION_ALLOWLIST

    for i, row in enumerate(COMPETITION_ALLOWLIST):
        AllowlistedCompetition.objects.update_or_create(
            sport_slug=row.sport_slug,
            league_slug=row.league_slug,
            defaults={
                "team_source": row.team_source,
                "display_name": row.display_name,
                "enabled": row.enabled,
                "sort_order": i,
            },
        )


def unseed_allowlist(apps, schema_editor):
    AllowlistedCompetition = apps.get_model("espn", "AllowlistedCompetition")
    AllowlistedCompetition.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ("espn", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="team",
            name="sync_cursor_at",
            field=models.DateTimeField(db_index=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="event",
            name="sync_cursor_at",
            field=models.DateTimeField(db_index=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name="AllowlistedCompetition",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("sport_slug", models.CharField(db_index=True, max_length=50)),
                ("league_slug", models.CharField(db_index=True, max_length=80)),
                (
                    "team_source",
                    models.CharField(
                        choices=[("league_roster", "League roster"), ("tournament_roster", "Tournament roster")],
                        max_length=32,
                    ),
                ),
                ("display_name", models.CharField(max_length=200)),
                ("enabled", models.BooleanField(default=True)),
                ("extend_cursor_date", models.DateField(blank=True, null=True)),
                ("sort_order", models.PositiveSmallIntegerField(default=0)),
            ],
            options={
                "ordering": ["sort_order", "id"],
            },
        ),
        migrations.AddConstraint(
            model_name="allowlistedcompetition",
            constraint=models.UniqueConstraint(fields=("sport_slug", "league_slug"), name="uniq_allowlist_sport_league"),
        ),
        migrations.RunPython(seed_allowlist, unseed_allowlist),
    ]
