import datetime
from sqlmodel import Column, Enum, Field, SQLModel
import enum


class EBetSlipItemsStatus(str, enum.Enum):
    WIN = "win"
    LOSS = "loss"
    PENDING = "pending"
    CANCELLED = "cancelled"
    CLOSED = "closed"


class BetSlipItemsRepository(SQLModel, table=True):
    __tablename__ = "bet_slip_items"  # pyright: ignore[reportAssignmentType]

    id: int | None = Field(default=None, primary_key=True)
    bet_slip_id: str
    criteria_odd_id: str
    user_id: str

    amount: float
    status: EBetSlipItemsStatus = Field(
        default=EBetSlipItemsStatus.PENDING, sa_column=Column(Enum(EBetSlipItemsStatus))
    )
    # status: str  # "WIN", "LOSS", "PENDING", "CANCELLED"
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.now)