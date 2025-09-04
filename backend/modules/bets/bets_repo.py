from sqlmodel import Field, SQLModel


class BetsRepository(SQLModel, table=True):
    __tablename__ = "bets"  # pyright: ignore[reportAssignmentType]

    id: int | None = Field(default=None, primary_key=True)
    name: str
    secret_name: str
    age: int | None = None
