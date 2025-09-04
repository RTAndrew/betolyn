from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from modules.bets.bets_repo import BetsRepository
from utils.database import get_session
from modules.bets.schemas import BetResponse

# Create a router for GET operations
router = APIRouter(prefix="/api/bets", tags=["bets"])

@router.get("/", response_model=list[BetResponse])
def get_bets(session: Annotated[Session, Depends(get_session)]):
    """Get all bets"""
    query = select(BetsRepository)
    bets = session.exec(query).all()
    return bets

@router.get("/{bet_id}", response_model=BetResponse)
def get_bet(bet_id: int, session: Annotated[Session, Depends(get_session)]):
    """Get a specific bet by ID"""
    query = select(BetsRepository).where(BetsRepository.id == bet_id)
    bet = session.exec(query).first()
    if not bet:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Bet not found")
    return bet
