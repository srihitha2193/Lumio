"""
User management routes — demonstrates RBAC in action.

These endpoints are intentionally scoped to show how require_roles() works:
  • /api/users/child-home   → child only
  • /api/users/parent-home  → parent only
  • /api/users/teacher-home → teacher only
  • /api/users/{uid}        → any authenticated user (own data) or teacher
"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import (
    get_current_teacher,
    get_current_user,
    require_roles,
)
from app.models.user import MessageResponse, UserResponse, UserRole
from app.services.auth_service import AuthError, UserNotFoundError, get_user_by_uid

router = APIRouter(prefix="/users", tags=["Users"])


# ── Role-gated demo endpoints ─────────────────────────────────────────────────
@router.get(
    "/child-home",
    response_model=MessageResponse,
    summary="Child-only endpoint",
)
def child_home(
    _user: Annotated[UserResponse, Depends(require_roles(UserRole.CHILD))],
) -> MessageResponse:
    return MessageResponse(message=f"Welcome, {_user.name}! Ready to learn today?")


@router.get(
    "/parent-home",
    response_model=MessageResponse,
    summary="Parent-only endpoint",
)
def parent_home(
    _user: Annotated[UserResponse, Depends(require_roles(UserRole.PARENT))],
) -> MessageResponse:
    return MessageResponse(message=f"Welcome, {_user.name}! Here is your family dashboard.")


@router.get(
    "/teacher-home",
    response_model=MessageResponse,
    summary="Teacher-only endpoint",
)
def teacher_home(
    _user: Annotated[UserResponse, Depends(require_roles(UserRole.TEACHER))],
) -> MessageResponse:
    return MessageResponse(message=f"Welcome, {_user.name}! Your class is waiting.")


# ── Shared: any authenticated role ────────────────────────────────────────────
@router.get(
    "/me",
    response_model=UserResponse,
    summary="Alias for GET /auth/me — any authenticated user",
)
def get_my_profile(
    current_user: Annotated[UserResponse, Depends(get_current_user)],
) -> UserResponse:
    return current_user


# ── Teacher/Admin: view any user by uid ───────────────────────────────────────
@router.get(
    "/{uid}",
    response_model=UserResponse,
    summary="Get user by UID (teacher access)",
)
def get_user(
    uid: str,
    _teacher: Annotated[UserResponse, Depends(get_current_teacher)],
) -> UserResponse:
    """
    Returns any user's public profile.
    Restricted to teachers so that children/parents cannot enumerate users.
    """
    try:
        return get_user_by_uid(uid)
    except UserNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
