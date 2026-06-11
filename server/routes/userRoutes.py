from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from server.config.db import get_db
from server.controllers.userController import (
    SignupRequest,
    LoginRequest,
    UserResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from server.services import userService

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return userService.list_users(db)


@router.post("/signup", response_model=UserResponse, status_code=201)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    return userService.register(
        db,
        full_name        = payload.full_name,
        email            = payload.email,
        company          = payload.company,
        account_role     = payload.account_role,
        password         = payload.password,
        confirm_password = payload.confirm_password,
    )


@router.post("/login", response_model=UserResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return userService.login(
        db,
        email    = payload.email,
        password = payload.password,
    )


@router.post("/forgot-password")
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    return userService.forgot_password(db, email=payload.email)


@router.post("/reset-password")
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    return userService.reset_password(db, token=payload.token, new_password=payload.new_password)


@router.patch("/{user_id}/deactivate", response_model=UserResponse)
def deactivate_user(user_id: int, db: Session = Depends(get_db)):
    return userService.deactivate(db, user_id)