"""
Utility helpers shared across the application.
"""
from datetime import datetime, timezone


def utc_now_iso() -> str:
    """Return the current UTC timestamp as an ISO-8601 string."""
    return datetime.now(timezone.utc).isoformat()


def sanitize_firebase_key(value: str) -> str:
    """
    Firebase Realtime Database keys cannot contain:
      . $ # [ ] /

    Replace forbidden characters with underscores.
    """
    forbidden = {'.', '$', '#', '[', ']', '/'}
    return ''.join('_' if c in forbidden else c for c in value)
