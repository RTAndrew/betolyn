from sqlmodel import Field, Relationship, SQLModel
import datetime


class MatchRepository(SQLModel, table=True):
    __tablename__ = "matches"  # pyright: ignore[reportAssignmentType]

    id: int | None = Field(default=None, primary_key=True)

    home_team: str
    home_team_image_url: str | None = Field(default=None)
    away_team: str
    away_team_image_url: str | None = Field(default=None)
    home_team_score: int
    away_team_score: int

    criteria: list["CriteriaRepository"] = Relationship(back_populates="match")
    # main_criteria_id: int
    # main_criteria: "CriteriaRepository" | None = Relationship(back_populates="match")

    start_time: datetime.datetime | None = Field(default=None)
    end_time: datetime.datetime | None = Field(default=None)

    created_at: datetime.datetime | None = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime | None = Field(default_factory=datetime.datetime.now)


class CriteriaRepository(SQLModel, table=True):
    __tablename__ = "criteria"  # pyright: ignore[reportAssignmentType]

    id: int | None = Field(default=None, primary_key=True)
    name: str
    # created_by: str

    match_id: int = Field(foreign_key="matches.id")
    match: MatchRepository = Relationship(back_populates="criteria")

    created_at: datetime.datetime | None = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime | None = Field(default_factory=datetime.datetime.now)
