from sqlmodel import Field, Relationship, SQLModel
import datetime


class MatchRepository(SQLModel, table=True):
    __tablename__ = "matches"  # pyright: ignore[reportAssignmentType]

    id: int | None = Field(default=None, primary_key=True)

    home_team: str
    away_team: str
    home_team_score: int
    away_team_score: int

    status: str

    criteria: None | list["CriteriaRepository"] = Relationship(back_populates="matches")  # pyright: ignore[reportUndefinedVariable]  # noqa: F821

    start_time: datetime.datetime | None = Field(default=None)
    end_time: datetime.datetime | None = Field(default=None)

    created_at: datetime.datetime = Field(default_factory = datetime.datetime.now)
    updated_at: datetime.datetime = Field(default_factory = datetime.datetime.now)
