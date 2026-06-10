from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    company: str
    account_role: str
    password: str
    confirm_password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    company: str
    role: str
    status: str
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class ForgotPasswordRequest(BaseModel):
    email: EmailStr