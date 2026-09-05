"""
FastAPI dependency functions for authentication and role-based access control.

Usage in route files::

    from app.api.dependencies import get_current_user, require_roles
    from app.models.user import UserRole

    # Require any authenticated user
    @router.get("/me")
    def me(user = Depends(get_current_user)):
        ...

    # Require teacher or admin only
    @router.get("/class")
    def class_data(user = Depends(require_roles(UserRole.TEACHER))):
        ...
"""
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError

from app.core.security import verify_access_token
from app.models.user import UserResponse, UserRole
from app.services.auth_service import UserNotFoundError, get_user_by_uid

# HTTPBearer extracts the token from the Authorization: Bearer <token> header.
_bearer_scheme = HTTPBearer(auto_error=True)


# ---------------------------------------------------------------------------
# Core dependency: validate token → return UserResponse
# ---------------------------------------------------------------------------
def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(_bearer_scheme)],
) -> UserResponse:
    """
    Validate the Bearer token and return the authenticated user.

    Raises HTTP 401 if the token is missing, malformed, or expired.
    Raises HTTP 404 if the user uid in the token no longer exists in DB.
    Raises HTTP 403 if the account is deactivated.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = verify_access_token(credentials.credentials)
        uid: str = payload.get("sub", "")
        if not uid:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    try:
        user = get_user_by_uid(uid)
    except UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Authenticated user not found.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    return user


# ---------------------------------------------------------------------------
# Role-based access control
# ---------------------------------------------------------------------------
def require_roles(*allowed_roles: UserRole):
    """
    Dependency factory — returns a FastAPI dependency that raises HTTP 403
    if the current user's role is not in *allowed_roles*.

    Example::

        Depends(require_roles(UserRole.TEACHER, UserRole.PARENT))
    """
    def _check_role(
        current_user: Annotated[UserResponse, Depends(get_current_user)],
    ) -> UserResponse:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Access denied. Required role(s): "
                    f"{', '.join(r.value for r in allowed_roles)}."
                ),
            )
        return current_user

    return _check_role


# ---------------------------------------------------------------------------
# Convenience role aliases
# ---------------------------------------------------------------------------
def get_current_child(
    user: Annotated[UserResponse, Depends(require_roles(UserRole.CHILD))],
) -> UserResponse:
    """Shorthand dependency: authenticated child only."""
    return user


def get_current_parent(
    user: Annotated[UserResponse, Depends(require_roles(UserRole.PARENT))],
) -> UserResponse:
    """Shorthand dependency: authenticated parent only."""
    return user


def get_current_teacher(
    user: Annotated[UserResponse, Depends(require_roles(UserRole.TEACHER))],
) -> UserResponse:
    """Shorthand dependency: authenticated teacher only."""
    return user
