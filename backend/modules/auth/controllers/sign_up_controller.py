# Create a router for POST operations
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlmodel import Session, select

from modules.auth.repositories.user_repository import UserRepositoy
from modules.auth.auth_schemas import SignUpRequest, SignUpResponse
from utils.database import get_session


router = APIRouter(prefix="/api/auth", tags=["auth"])

# TODO: Add a cookie to the response


@router.post("/signup", response_model=SignUpResponse)
def sign_up(
    request: Request,
    response: Response,
    data: SignUpRequest,
    session: Annotated[Session, Depends(get_session)],
):
    """Create a new user"""
    # print(f"Access token: {request.cookies.get('token')}")

    try:
        exists_user = session.exec(
            select(UserRepositoy).where(
                UserRepositoy.email == data.email,
                UserRepositoy.username == data.username,
            )
        ).first()

        if exists_user:
            raise HTTPException(status_code=400, detail="User already exists")

        new_user = UserRepositoy(**data.model_dump())
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        # response.set_cookie(
        #     key="token",
        #     value=new_user.username,
        #     httponly=True,
        #     secure=True,
        #     max_age=3600,  # 1 hour
        # )

        return new_user

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")