from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from modules.bets.repositories.bet_slips_repository import BetSlipsRepository
from utils.database import get_session

# Create a router for GET operations
router = APIRouter(prefix="/api/bets", tags=["bets"])

@router.get("/", response_model=list[BetSlipsRepository])
def get_bets(session: Annotated[Session, Depends(get_session)]):
    """Get all bets"""
    query = select(BetSlipsRepository)
    bets = session.exec(query).all()
    return bets

@router.get("/{bet_id}", response_model=BetSlipsRepository)
def get_bet(bet_id: int, session: Annotated[Session, Depends(get_session)]):
    """Get a specific bet by ID"""
    query = select(BetSlipsRepository).where(BetSlipsRepository.id == bet_id)
    bet = session.exec(query).first()
    if not bet:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Bet not found")
    return bet
