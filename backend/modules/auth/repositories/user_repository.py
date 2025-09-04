
from sqlmodel import Field, SQLModel


class UserRepository(SQLModel, table=True):
    __tablename__ = "users"  # pyright: ignore[reportAssignmentType]

    id: int | None = Field(default=None, primary_key=True,)
    username: str = Field(nullable=False, unique=True)
    email: str = Field(nullable=False, unique=True)