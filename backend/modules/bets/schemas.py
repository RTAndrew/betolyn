from pydantic import BaseModel
from typing import Optional


class BetCreate(BaseModel):
    name: str
    secret_name: str
    age: Optional[int] = None


class BetResponse(BaseModel):
    id: int
    name: str
    secret_name: str
    age: Optional[int] = None

    class Config:
        from_attributes = True
