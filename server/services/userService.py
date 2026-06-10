from sqlalchemy.orm import Session
from fastapi import HTTPException

from server.repositories import userRepository
from server.utils.hash import hash_password, verify_password

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

    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    existing = userRepository.get_by_email(db, email)
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    role = ROLE_MAP.get(account_role, "user")
    password_hash = hash_password(password)

    return userRepository.create(
        db,
        full_name,
        email,
        company,
        role,
        password_hash
    )

def login(db: Session, email: str, password: str):
    user = userRepository.get_by_email(db, email)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if user.status == "Inactive":
        raise HTTPException(status_code=403, detail="Your account has been deactivated. Please contact an administrator.")

    return user

def deactivate(db: Session, user_id: int):
    user = userRepository.set_status(db, user_id, "Inactive")
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user