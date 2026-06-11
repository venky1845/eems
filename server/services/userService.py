from sqlalchemy.orm import Session
from fastapi import HTTPException
from jose import jwt, JWTError
from datetime import datetime, timedelta

from server.repositories import userRepository
from server.utils.hash import hash_password, verify_password
from server.utils.email import send_reset_email
from server.models.user import User

# ── JWT config (no .env needed) ───────────────────────────────────────────────
SECRET_KEY    = "your_secret_key_here"   # change to any long random string
ALGORITHM     = "HS256"
FRONTEND_URL  = "http://localhost:5173"

# ── Role map ──────────────────────────────────────────────────────────────────
ROLE_MAP = {
    "admin": "admin",
    "user":  "user",
    "Admin — Full system access":          "admin",
    "User — Dashboard & Employees only":   "user",
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

    role          = ROLE_MAP.get(account_role, "user")
    password_hash = hash_password(password)

    return userRepository.create(db, full_name, email, company, role, password_hash)


def login(db: Session, email: str, password: str):
    user = userRepository.get_by_email(db, email)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if user.status == "Inactive":
        raise HTTPException(status_code=403, detail="ACCOUNT_DEACTIVATED")

    return user


def deactivate(db: Session, user_id: int):
    user = userRepository.set_status(db, user_id, "Inactive")
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


def forgot_password(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"message": "If that email exists, a reset link has been sent."}

    expire = datetime.utcnow() + timedelta(minutes=30)
    token  = jwt.encode(
        {"sub": str(user.id), "exp": expire},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    try:
        send_reset_email(user.email, reset_link)
    except Exception as e:
        print("EMAIL ERROR:", repr(e))   # ← check your terminal for this
        raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")

    return {"message": "If that email exists, a reset link has been sent."}


def reset_password(db: Session, token: str, new_password: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token.")

    user = userRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.password_hash = hash_password(new_password)
    db.commit()
    db.refresh(user)

    return {"message": "Password reset successfully."}