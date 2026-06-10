from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from server.config.db import Base

class User(Base):
    __tablename__ = "users"

    id           = Column(Integer, primary_key=True, index=True)
    full_name    = Column(String(100), nullable=False)
    email        = Column(String(150), unique=True, nullable=False, index=True)
    company      = Column(String(100), nullable=False, default="Company A")
    role         = Column(String(10), nullable=False, default="user")   # 'admin' | 'user'
    password_hash= Column(String(255), nullable=False)
    status       = Column(String(10), nullable=False, default="Active") # 'Active' | 'Inactive'
    created_at   = Column(DateTime(timezone=True), server_default=func.now())