from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from server.config.db import get_db
from server.controllers.userController import SignupRequest, LoginRequest, UserResponse
from server.services import userService

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    """Get all members — both admin and user roles can call this."""
    return userService.list_users(db)


@router.post("/signup", response_model=UserResponse, status_code=201)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    """Register a new user. Open endpoint, no auth required."""
    return userService.register(
        db,
        full_name=payload.full_name,
        email=payload.email,
        company=payload.company,
        account_role=payload.account_role,
        password=payload.password,
        confirm_password=payload.confirm_password,
    )


@router.post("/login", response_model=UserResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a user by email and password."""
    return userService.login(db, email=payload.email, password=payload.password)


@router.patch("/{user_id}/deactivate", response_model=UserResponse)
def deactivate_user(user_id: int, db: Session = Depends(get_db)):
    """Deactivate a user. UI restricts this to admins only."""
    return userService.deactivate(db, user_id)