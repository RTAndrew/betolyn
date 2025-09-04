import datetime
import enum
from sqlmodel import Column, Enum, Field, SQLModel


class EBetSlipsStatus(str, enum.Enum):
    WIN = "win"
    LOSS = "loss"
    PENDING = "pending"
    CANCELLED = "cancelled"


class BetSlipsRepository(SQLModel, table=True):
    __tablename__ = "bet_slips"  # pyright: ignore[reportAssignmentType]

    id: int | None = Field(default=None, primary_key=True)
    user_id: str

    total_odds: float
    amount: float
    status: EBetSlipsStatus = Field(
        default=EBetSlipsStatus.PENDING, sa_column=Column(Enum(EBetSlipsStatus))
    )
    created_at: datetime.datetime | None = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime | None = Field(default_factory=datetime.datetime.now)