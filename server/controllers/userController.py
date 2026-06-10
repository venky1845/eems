from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class SignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    company: str
    account_role: str   # "user" or "admin"
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
    role: str               # 'admin' | 'user'
    status: str             # 'Active' | 'Inactive'
    created_at: Optional[datetime]

    class Config:
        from_attributes = True