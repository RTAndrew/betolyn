from typing import Annotated, Sequence
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel

from modules.bets.repositories.match_criteria_repository import (
    MatchRepository,
    CriteriaRepository,
)
from utils.database import get_session


# Create a router for GET operations
router = APIRouter(prefix="/api/matches", tags=["matches"])


class CreateMatchResponse(BaseModel):
    match: MatchRepository

class GetMatchResponse(BaseModel):
    match: MatchRepository


class GetAllMatchesResponse(BaseModel):
    matches: Sequence[MatchRepository]

class CreateMatchRequest(BaseModel):
    home_team: str
    away_team: str
    home_team_score: int
    away_team_score: int
    start_time: str | None = None
    end_time: str | None = None

class CreateCriteriaResponse(BaseModel):
    criteria: CriteriaRepository

@router.get("/", response_model=GetAllMatchesResponse)
def get_all_matches(session: Annotated[Session, Depends(get_session)]):
    try:
        # statement = select(MatchRepository).join(CriteriaRepository.id == MatchRepository.criteria_id)
        statement = select(MatchRepository)
        matches = session.exec(statement).all()
        return GetAllMatchesResponse(matches=matches)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get all matches: {str(e)}"
        )

@router.get("/{match_id}", response_model=GetMatchResponse)
def get_match(match_id: int, session: Annotated[Session, Depends(get_session)]):
    try:
        match = session.exec(
            select(MatchRepository).where(MatchRepository.id == match_id)
        ).first()

        if not match:
            raise HTTPException(status_code=404, detail="Match not found")

        return GetMatchResponse(match=match)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get match: {str(e)}")


@router.post("/", response_model=CreateMatchResponse)
def create_match(
    body: CreateMatchRequest, session: Annotated[Session, Depends(get_session)]
):
    try:
        new_match = MatchRepository(**body.model_dump())
        session.add(new_match)
        session.commit()
        session.refresh(new_match)
        return CreateMatchResponse(match=new_match)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create match: {str(e)}")


class CreateCriteriaRequest(BaseModel):
    name: str

@router.post("/{match_id}/criteria", response_model=CreateCriteriaResponse)
def create_criteria(match_id: int,
    body: CreateCriteriaRequest, session: Annotated[Session, Depends(get_session)]
):
  try:
    match = session.get(MatchRepository, match_id)
    if not match:
      raise HTTPException(status_code=404, detail="Match not found")

      # TODO: validate the user matches the creator of the match

    new_criteria = CriteriaRepository(name=body.name, match_id=match_id)
    session.add(new_criteria)
    session.commit()
    session.refresh(new_criteria)
    return CreateCriteriaResponse(criteria=new_criteria)
  except Exception as e:
    session.rollback()
    raise HTTPException(
        status_code=500, detail=f"Failed to create criteria: {str(e)}"
    )
