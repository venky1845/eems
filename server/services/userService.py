from sqlalchemy.orm import Session
from fastapi import HTTPException

from server.repositories import userRepository
from server.utils.hash import hash_password

ROLE_MAP = {
    "admin": "admin",
    "user": "user",
    "Admin — Full system access": "admin",
    "User — Dashboard & Employees only": "user",
}

def list_users(db: Session):
    return userRepository.get_all(db)

def register(db: Session, full_name: str, email: str, company: str,
             account_role: str, password: str, confirm_password: str):

    print("ACCOUNT ROLE:", account_role)

    role = ROLE_MAP.get(account_role)
    print("MAPPED ROLE:", role)

    password_hash = hash_password(password)
    print("PASSWORD HASH GENERATED")

    return userRepository.create(
        db,
        full_name,
        email,
        company,
        role,
        password_hash
    )

def deactivate(db: Session, user_id: int):
    user = userRepository.set_status(db, user_id, "Inactive")
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user