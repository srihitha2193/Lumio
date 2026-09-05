"""
JWT token creation and verification utilities.

Tokens carry a ``sub`` (user-id), ``role``, and ``type`` (access | refresh).
"""
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()

# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------
_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    """Return the bcrypt hash of *plain*."""
    return _pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if *plain* matches *hashed*."""
    return _pwd_context.verify(plain, hashed)


# ---------------------------------------------------------------------------
# Token creation
# ---------------------------------------------------------------------------
def _make_token(data: dict[str, Any], expires_delta: timedelta) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + expires_delta
    payload["iat"] = datetime.now(timezone.utc)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_access_token(uid: str, role: str) -> str:
    """Create a short-lived access token."""
    return _make_token(
        {"sub": uid, "role": role, "type": "access"},
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(uid: str, role: str) -> str:
    """Create a long-lived refresh token."""
    return _make_token(
        {"sub": uid, "role": role, "type": "refresh"},
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )


# ---------------------------------------------------------------------------
# Token verification
# ---------------------------------------------------------------------------
def decode_token(token: str) -> dict[str, Any]:
    """
    Decode and validate a JWT.

    Raises :class:`jose.JWTError` on any validation failure (expired,
    tampered, wrong algorithm, etc.).  Callers should catch this and
    raise an appropriate HTTP exception.
    """
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])


def verify_access_token(token: str) -> dict[str, Any]:
    """
    Decode *token*, asserting it is an **access** token.

    Raises :class:`jose.JWTError` if the token is invalid or is a
    refresh token presented as an access token.
    """
    payload = decode_token(token)
    if payload.get("type") != "access":
        raise JWTError("Token type mismatch: expected access token")
    return payload
