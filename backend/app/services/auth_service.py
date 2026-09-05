"""
Authentication & User service layer — backed by Supabase (PostgreSQL).

All database interactions happen here via the Supabase PostgREST client.
Routes call these functions — they never touch Supabase directly.

Supabase table: `users`
Columns:
  uid            TEXT PRIMARY KEY
  name           TEXT NOT NULL
  email          TEXT UNIQUE NOT NULL
  role           TEXT NOT NULL          -- 'child' | 'parent' | 'teacher'
  hashed_password TEXT NOT NULL
  is_active      BOOLEAN DEFAULT TRUE
  age            INTEGER
  level          INTEGER DEFAULT 1
  xp             INTEGER DEFAULT 0
  parent_id      TEXT
  teacher_id     TEXT
  children_ids   TEXT[]  DEFAULT '{}'
  school         TEXT
  grade          TEXT
  student_ids    TEXT[]  DEFAULT '{}'
  created_at     TIMESTAMPTZ DEFAULT NOW()
  updated_at     TIMESTAMPTZ DEFAULT NOW()
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional

from jose import JWTError

from app.core.supabase import get_supabase
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.core.config import get_settings
from app.models.user import (
    AccessTokenResponse,
    TokenPair,
    UserCreate,
    UserResponse,
    UserRole,
    UserUpdate,
)

settings = get_settings()
TABLE = "users"


# ---------------------------------------------------------------------------
# Domain errors
# ---------------------------------------------------------------------------
class AuthError(Exception):
    """Domain-level auth error — routes translate this to HTTPException."""
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.status_code = status_code


class DuplicateEmailError(AuthError):
    def __init__(self):
        super().__init__("An account with this email already exists.", status_code=409)


class InvalidCredentialsError(AuthError):
    def __init__(self):
        super().__init__("Invalid email or password.", status_code=401)


class UserNotFoundError(AuthError):
    def __init__(self):
        super().__init__("User not found.", status_code=404)


class InactiveUserError(AuthError):
    def __init__(self):
        super().__init__("This account has been deactivated.", status_code=403)


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------
def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _get_user_by_uid(uid: str) -> Optional[dict]:
    """Fetch a single user row by primary key."""
    sb = get_supabase()
    result = sb.table(TABLE).select("*").eq("uid", uid).execute()
    if result.data:
        return result.data[0]
    return None


def _get_user_by_email(email: str) -> Optional[dict]:
    """Fetch a single user row by email (unique column)."""
    sb = get_supabase()
    result = sb.table(TABLE).select("*").eq("email", email.lower()).execute()
    if result.data:
        return result.data[0]
    return None


def _to_response(raw: dict) -> UserResponse:
    return UserResponse(
        uid=raw["uid"],
        name=raw["name"],
        email=raw["email"],
        role=UserRole(raw["role"]),
        is_active=raw.get("is_active", True),
        created_at=raw["created_at"],
        age=raw.get("age"),
        level=raw.get("level"),
        xp=raw.get("xp"),
        school=raw.get("school"),
        grade=raw.get("grade"),
    )


# ---------------------------------------------------------------------------
# Public service functions
# ---------------------------------------------------------------------------

# ── Register ─────────────────────────────────────────────────────────────────
def register_user(payload: UserCreate) -> UserResponse:
    """
    Create a new user in Supabase.

    Steps:
      1. Check users table for duplicate email.
      2. Generate uid, hash password.
      3. Insert row into `users` table.
      4. Return safe UserResponse.

    Raises:
      DuplicateEmailError: if email already registered.
    """
    sb = get_supabase()

    # 1. Duplicate check
    if _get_user_by_email(payload.email) is not None:
        raise DuplicateEmailError()

    # 2. Prepare record
    uid = str(uuid.uuid4())
    now = _now_iso()

    user_record = {
        "uid": uid,
        "name": payload.name,
        "email": payload.email.lower(),
        "role": payload.role.value,
        "hashed_password": hash_password(payload.password),
        "is_active": True,
        "created_at": now,
        "updated_at": now,
        # role-specific defaults
        "age": None,
        "level": 1,
        "xp": 0,
        "parent_id": None,
        "teacher_id": None,
        "children_ids": [],
        "school": None,
        "grade": None,
        "student_ids": [],
    }

    # 3. Insert
    sb.table(TABLE).insert(user_record).execute()

    return _to_response(user_record)


# ── Login ─────────────────────────────────────────────────────────────────────
def login_user(email: str, password: str) -> TokenPair:
    """
    Authenticate user and return a JWT access + refresh token pair.

    Raises:
      InvalidCredentialsError: on wrong email or password.
      InactiveUserError: if account is deactivated.
    """
    raw = _get_user_by_email(email)
    if raw is None:
        raise InvalidCredentialsError()

    if not verify_password(password, raw["hashed_password"]):
        raise InvalidCredentialsError()

    if not raw.get("is_active", True):
        raise InactiveUserError()

    uid = raw["uid"]
    role = raw["role"]

    return TokenPair(
        access_token=create_access_token(uid, role),
        refresh_token=create_refresh_token(uid, role),
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        role=UserRole(role),
        uid=uid,
    )


# ── Refresh token ─────────────────────────────────────────────────────────────
def refresh_access_token(refresh_token: str) -> AccessTokenResponse:
    """
    Issue a new access token given a valid refresh token.

    Raises:
      AuthError(401): if the refresh token is invalid or expired.
    """
    try:
        payload = decode_token(refresh_token)
    except JWTError as exc:
        raise AuthError(f"Invalid refresh token: {exc}", status_code=401)

    if payload.get("type") != "refresh":
        raise AuthError("Token type mismatch: expected refresh token.", status_code=401)

    uid: str = payload["sub"]
    role: str = payload["role"]

    # Ensure user still exists and is active
    raw = _get_user_by_uid(uid)
    if raw is None or not raw.get("is_active", True):
        raise AuthError("User no longer valid.", status_code=401)

    return AccessTokenResponse(
        access_token=create_access_token(uid, role),
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


# ── Get current user ──────────────────────────────────────────────────────────
def get_user_by_uid(uid: str) -> UserResponse:
    """
    Fetch and return a user's public profile.

    Raises:
      UserNotFoundError: if uid does not exist.
    """
    raw = _get_user_by_uid(uid)
    if raw is None:
        raise UserNotFoundError()
    return _to_response(raw)


# ── Update user ───────────────────────────────────────────────────────────────
def update_user(uid: str, payload: UserUpdate) -> UserResponse:
    """
    Partially update a user's name and/or email.

    Raises:
      UserNotFoundError: if uid does not exist.
      DuplicateEmailError: if the new email is already taken.
    """
    sb = get_supabase()
    raw = _get_user_by_uid(uid)
    if raw is None:
        raise UserNotFoundError()

    updates: dict = {"updated_at": _now_iso()}

    if payload.name is not None:
        updates["name"] = payload.name

    if payload.email is not None and payload.email.lower() != raw["email"]:
        if _get_user_by_email(payload.email) is not None:
            raise DuplicateEmailError()
        updates["email"] = payload.email.lower()

    sb.table(TABLE).update(updates).eq("uid", uid).execute()

    raw.update(updates)
    return _to_response(raw)


# ── Change password ───────────────────────────────────────────────────────────
def change_password(uid: str, current_password: str, new_password: str) -> None:
    """
    Verify current password then update to new hash.

    Raises:
      UserNotFoundError
      InvalidCredentialsError: if current_password is wrong.
    """
    sb = get_supabase()
    raw = _get_user_by_uid(uid)
    if raw is None:
        raise UserNotFoundError()

    if not verify_password(current_password, raw["hashed_password"]):
        raise InvalidCredentialsError()

    sb.table(TABLE).update({
        "hashed_password": hash_password(new_password),
        "updated_at": _now_iso(),
    }).eq("uid", uid).execute()


# ── Deactivate account ────────────────────────────────────────────────────────
def deactivate_user(uid: str) -> None:
    """
    Soft-delete: set is_active = False.

    Raises:
      UserNotFoundError
    """
    sb = get_supabase()
    raw = _get_user_by_uid(uid)
    if raw is None:
        raise UserNotFoundError()

    sb.table(TABLE).update({
        "is_active": False,
        "updated_at": _now_iso(),
    }).eq("uid", uid).execute()
