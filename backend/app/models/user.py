"""
Pydantic schemas for Users and Auth flows.

Naming convention:
  <Entity>Base      – shared fields (never has id/password hash)
  <Entity>Create    – inbound payload for creation
  <Entity>Update    – inbound payload for updates (all optional)
  <Entity>InDB      – the full record stored in Firebase (has hashed_password)
  <Entity>Response  – outbound payload (no hashed_password)
"""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


# ---------------------------------------------------------------------------
# Role enum
# ---------------------------------------------------------------------------
class UserRole(str, Enum):
    CHILD = "child"
    PARENT = "parent"
    TEACHER = "teacher"


# ---------------------------------------------------------------------------
# User schemas
# ---------------------------------------------------------------------------
class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, examples=["Sarah Johnson"])
    email: EmailStr
    role: UserRole


class UserCreate(UserBase):
    """
    Registration payload.
    Password must be ≥ 8 chars, contain at least one digit and one letter.
    """
    password: str = Field(..., min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit.")
        if not any(c.isalpha() for c in v):
            raise ValueError("Password must contain at least one letter.")
        return v


class UserUpdate(BaseModel):
    """Partial update — all fields optional."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None


class UserInDB(UserBase):
    """
    Full user record as stored in Firebase.
    Never return this directly to clients — use UserResponse instead.
    """
    uid: str                         # Firebase push-key or custom uid
    hashed_password: str
    is_active: bool = True
    created_at: str                  # ISO-8601 string (Firebase stores strings)
    updated_at: str

    # Role-specific optional fields
    # Child
    age: Optional[int] = None
    level: Optional[int] = 1
    xp: Optional[int] = 0
    parent_id: Optional[str] = None
    teacher_id: Optional[str] = None

    # Parent
    children_ids: Optional[list[str]] = []

    # Teacher
    school: Optional[str] = None
    grade: Optional[str] = None
    student_ids: Optional[list[str]] = []


class UserResponse(UserBase):
    """Safe public representation — no password hash."""
    uid: str
    is_active: bool
    created_at: str

    # Selective role fields (populated only when relevant)
    age: Optional[int] = None
    level: Optional[int] = None
    xp: Optional[int] = None
    school: Optional[str] = None
    grade: Optional[str] = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Auth-flow schemas
# ---------------------------------------------------------------------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class TokenPair(BaseModel):
    """Returned on login and token-refresh."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int        # seconds until access token expires
    role: UserRole
    uid: str


class AccessTokenResponse(BaseModel):
    """Returned on token-refresh (access token only)."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshRequest(BaseModel):
    refresh_token: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=72)

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not any(c.isdigit() for c in v):
            raise ValueError("New password must contain at least one digit.")
        if not any(c.isalpha() for c in v):
            raise ValueError("New password must contain at least one letter.")
        return v


class MessageResponse(BaseModel):
    """Generic success message."""
    message: str
