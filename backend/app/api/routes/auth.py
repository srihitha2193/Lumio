"""
Authentication API routes.

Endpoints
─────────
POST  /api/auth/register          – register new user (child / parent / teacher)
POST  /api/auth/login             – email + password → token pair
POST  /api/auth/refresh           – refresh token → new access token
POST  /api/auth/logout            – informational (client drops the token)
GET   /api/auth/me                – return current user profile
PATCH /api/auth/me                – update name / email
POST  /api/auth/me/change-password – change password
DELETE /api/auth/me               – soft-delete own account
"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_current_user
from app.models.user import (
    AccessTokenResponse,
    ChangePasswordRequest,
    LoginRequest,
    MessageResponse,
    RefreshRequest,
    TokenPair,
    UserCreate,
    UserResponse,
    UserUpdate,
)
from app.services.auth_service import (
    AuthError,
    change_password,
    deactivate_user,
    get_user_by_uid,
    login_user,
    refresh_access_token,
    register_user,
    update_user,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ---------------------------------------------------------------------------
# Helper: map service AuthError → HTTPException
# ---------------------------------------------------------------------------
def _raise(exc: AuthError) -> None:
    raise HTTPException(status_code=exc.status_code, detail=str(exc))


# ── Register ─────────────────────────────────────────────────────────────────
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description=(
        "Create a new account. Role must be **child**, **parent**, or **teacher**. "
        "Returns the created user profile (no password in response)."
    ),
)
def register(payload: UserCreate) -> UserResponse:
    try:
        return register_user(payload)
    except AuthError as exc:
        _raise(exc)


# ── Login ─────────────────────────────────────────────────────────────────────
@router.post(
    "/login",
    response_model=TokenPair,
    summary="Login and obtain JWT token pair",
    description=(
        "Authenticate with email + password. Returns an **access token** "
        "(short-lived) and a **refresh token** (long-lived)."
    ),
)
def login(payload: LoginRequest) -> TokenPair:
    try:
        return login_user(payload.email, payload.password)
    except AuthError as exc:
        _raise(exc)


# ── Refresh ───────────────────────────────────────────────────────────────────
@router.post(
    "/refresh",
    response_model=AccessTokenResponse,
    summary="Refresh access token",
    description=(
        "Exchange a valid **refresh token** for a new **access token**. "
        "The refresh token itself is not rotated in this implementation."
    ),
)
def refresh(payload: RefreshRequest) -> AccessTokenResponse:
    try:
        return refresh_access_token(payload.refresh_token)
    except AuthError as exc:
        _raise(exc)


# ── Logout ────────────────────────────────────────────────────────────────────
@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout (client-side token discard)",
    description=(
        "Stateless logout — the client must discard the access and refresh tokens. "
        "For full server-side revocation, implement a token deny-list in Redis."
    ),
)
def logout(
    _current_user: Annotated[UserResponse, Depends(get_current_user)],
) -> MessageResponse:
    # Stateless: no server action needed.
    # A production system would add the token jti to a Redis deny-list here.
    return MessageResponse(message="Logged out successfully. Please discard your tokens.")


# ── Get current user ──────────────────────────────────────────────────────────
@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile",
)
def get_me(
    current_user: Annotated[UserResponse, Depends(get_current_user)],
) -> UserResponse:
    return current_user


# ── Update current user ───────────────────────────────────────────────────────
@router.patch(
    "/me",
    response_model=UserResponse,
    summary="Update current user profile (name / email)",
)
def update_me(
    payload: UserUpdate,
    current_user: Annotated[UserResponse, Depends(get_current_user)],
) -> UserResponse:
    try:
        return update_user(current_user.uid, payload)
    except AuthError as exc:
        _raise(exc)


# ── Change password ───────────────────────────────────────────────────────────
@router.post(
    "/me/change-password",
    response_model=MessageResponse,
    summary="Change current user's password",
)
def change_my_password(
    payload: ChangePasswordRequest,
    current_user: Annotated[UserResponse, Depends(get_current_user)],
) -> MessageResponse:
    try:
        change_password(
            current_user.uid,
            payload.current_password,
            payload.new_password,
        )
    except AuthError as exc:
        _raise(exc)
    return MessageResponse(message="Password changed successfully.")


# ── Deactivate account ────────────────────────────────────────────────────────
@router.delete(
    "/me",
    response_model=MessageResponse,
    summary="Deactivate (soft-delete) current user account",
)
def deactivate_me(
    current_user: Annotated[UserResponse, Depends(get_current_user)],
) -> MessageResponse:
    try:
        deactivate_user(current_user.uid)
    except AuthError as exc:
        _raise(exc)
    return MessageResponse(message="Account deactivated successfully.")
