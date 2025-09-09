from sqlmodel import select
from modules.bets.repositories.match_criteria_repository import CriteriaRepository
from utils.database import get_session
from sqlmodel import Session
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/api/criteria", tags=["criteria"])

@router.get("/", response_model=list[CriteriaRepository])
def get_all_criteria(
    session: Annotated[Session, Depends(get_session)],

):
    try:
        criteria = session.exec(select(CriteriaRepository)).all()
        return criteria
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get all criteria: {str(e)}"
        )

@router.get("/{id}", response_model=list[CriteriaRepository])
def get_criteria_by_id(id: int,
    session: Annotated[Session, Depends(get_session)],
):
    try:
        criteria = session.exec(select(CriteriaRepository).where(CriteriaRepository.id == id)).first()
        return criteria
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get all criteria: {str(e)}"
        )
