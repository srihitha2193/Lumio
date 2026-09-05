"""
Supabase client initialisation.

The client is created once and cached. All other modules import
`get_supabase` from here — they never instantiate Client themselves.

Usage::

    from app.core.supabase import get_supabase

    sb = get_supabase()
    # Database (PostgREST)
    result = sb.table("users").select("*").eq("uid", uid).execute()
    # Storage
    sb.storage.from_("audio-recordings").upload(path, data)
"""
from functools import lru_cache

from supabase import Client, create_client

from app.core.config import get_settings


@lru_cache
def get_supabase() -> Client:
    """
    Return a cached Supabase client initialised with the service role key.

    The service role key bypasses Row Level Security (RLS), giving the
    backend full read/write access — suitable for a trusted server context.
    Never expose this key to the browser / frontend.
    """
    settings = get_settings()
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
