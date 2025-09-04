import datetime
from sqlmodel import Field, Relationship, SQLModel

from modules.bets.repositories.match_repository import MatchRepository


class CriteriaRepository(SQLModel, table=True):
    __tablename__ = "criteria"  # pyright: ignore[reportAssignmentType]

    id: int | None = Field(default=None, primary_key=True)
    name: str
    created_by: str

    match_id: int = Field(default=None, foreign_key="matches.id")
    match: MatchRepository = Relationship(back_populates="criteria")

    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.now)