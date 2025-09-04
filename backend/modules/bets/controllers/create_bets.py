from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import Annotated

from modules.bets.bets_repo import BetsRepository
from utils.database import get_session

from modules.bets.schemas import BetCreate, BetResponse

# Create a router for POST operations
router = APIRouter(prefix="/api/bets", tags=["bets"])


@router.post("/", response_model=BetResponse)
def create_bet(bet_data: BetCreate, session: Annotated[Session, Depends(get_session)]):
    """Create a new bet"""
    try:
        # Create a new bet instance
        new_bet = BetsRepository(**bet_data.model_dump())

        # Add to session and commit
        session.add(new_bet)
        session.commit()
        session.refresh(new_bet)

        return new_bet

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create bet: {str(e)}")
