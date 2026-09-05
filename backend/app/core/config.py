from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables / .env file.
    All sensitive values must live in .env — never hard-code them here.
    """

    # JWT (our own tokens, separate from Supabase auth)
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Supabase — all auth, DB, and Storage is handled via Supabase
    SUPABASE_URL: str           # e.g. https://xyzxyz.supabase.co
    SUPABASE_SERVICE_KEY: str   # service_role key (full DB + Storage access)

    # Audio uploads
    MAX_AUDIO_SIZE_MB: int = 25
    ALLOWED_AUDIO_EXTENSIONS: str = ".wav,.webm,.mp3,.ogg,.m4a,.flac"
    SUPABASE_AUDIO_BUCKET: str = "audio-recordings"

    @property
    def max_audio_bytes(self) -> int:
        return self.MAX_AUDIO_SIZE_MB * 1024 * 1024

    @property
    def allowed_audio_ext_list(self) -> list[str]:
        return [e.strip().lower() for e in self.ALLOWED_AUDIO_EXTENSIONS.split(",")]

    # App
    APP_ENV: str = "development"
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        # Ignore any extra env vars (e.g. leftover Firebase vars) without errors
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Cached settings — instantiated once for the lifetime of the process."""
    return Settings()
