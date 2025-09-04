from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from modules.bets.repositories.match_repository import MatchRepository
from utils.database import get_session

# Create a router for POST operations
router = APIRouter(prefix="/api/matches", tags=["bets"])


@router.post("/", response_model=MatchRepository)
def create_match(
    body: MatchRepository, session: Annotated[Session, Depends(get_session)]
):
    try:
        new_match = MatchRepository(**body.model_dump())
        session.add(new_match)
        session.commit()
        session.refresh(new_match)
        return new_match
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create match: {str(e)}")
