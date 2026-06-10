from sqlalchemy.orm import Session
from server.models.user import User

def get_all(db: Session):
    return db.query(User).all()

def get_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create(db: Session, full_name: str, email: str, company: str,
           role: str, password_hash: str):

    try:
        user = User(
            full_name=full_name,
            email=email,
            company=company,
            role=role,
            password_hash=password_hash,
            status="Active",
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        print("USER CREATED SUCCESSFULLY")

        return user

    except Exception as e:
        print("CREATE USER ERROR:", repr(e))
        raise

def set_status(db: Session, user_id: int, status: str):
    user = get_by_id(db, user_id)
    if not user:
        return None
    user.status = status
    db.commit()
    db.refresh(user)
    return user