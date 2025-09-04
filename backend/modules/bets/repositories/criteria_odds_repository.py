import datetime
from sqlmodel import Field, SQLModel


class CriteriaOddsRepository(SQLModel, table=True):
  __tablename__ = "criteria_odds" # pyright: ignore[reportAssignmentType]

  id: int | None = Field(default=None, primary_key=True)
  criteria_id: str
  name: str
  value: str

  created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
  updated_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
