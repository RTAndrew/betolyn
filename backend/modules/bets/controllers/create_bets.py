from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import Annotated

from modules.bets.repositories.bet_slips_repository import BetSlipsRepository
from utils.database import get_session

from modules.bets.schemas import BetCreate

# Create a router for POST operations
router = APIRouter(prefix="/api/bets", tags=["bets"])


@router.post("/", response_model=BetSlipsRepository)
def create_bet(bet_data: BetCreate, session: Annotated[Session, Depends(get_session)]):
    """Create a new bet"""
    try:
        # Create a new bet instance
        new_bet = BetSlipsRepository(**bet_data.model_dump())

        # Add to session and commit
        session.add(new_bet)
        session.commit()
        session.refresh(new_bet)

        return new_bet

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create bet: {str(e)}")
