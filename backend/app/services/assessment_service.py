"""
Reading Assessment service layer — backed by Supabase (PostgreSQL + Storage).

All Supabase interactions happen here.
Routes call these functions — they never touch Supabase directly.

Supabase table: `assessments`
Columns:
  assessment_id        TEXT PRIMARY KEY
  child_uid            TEXT NOT NULL REFERENCES users(uid)
  language             TEXT NOT NULL     -- 'english' | 'telugu'
  passage_title        TEXT NOT NULL
  passage_text         TEXT
  difficulty           TEXT NOT NULL     -- 'beginner' | 'intermediate' | 'advanced'
  audio_filename       TEXT NOT NULL
  audio_storage_path   TEXT NOT NULL
  audio_url            TEXT NOT NULL
  audio_size_bytes     INTEGER NOT NULL
  audio_content_type   TEXT NOT NULL
  status               TEXT DEFAULT 'uploaded'
  wpm                  FLOAT
  accuracy             FLOAT
  fluency_score        FLOAT
  hesitation_count     INTEGER
  mispronounced_words  TEXT[]  DEFAULT '{}'
  risk_score           FLOAT
  ai_feedback          TEXT
  created_at           TIMESTAMPTZ DEFAULT NOW()
  updated_at           TIMESTAMPTZ DEFAULT NOW()
  completed_at         TIMESTAMPTZ

Supabase Storage bucket: `audio-recordings`   (set to private or public per your policy)
"""
from __future__ import annotations

import os
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import UploadFile

from app.core.config import get_settings
from app.core.supabase import get_supabase
from app.models.assessment import (
    AssessmentCreateMeta,
    AssessmentLanguage,
    AssessmentResponse,
    AssessmentStatus,
    AssessmentUpdateResults,
)

settings = get_settings()
TABLE = "assessments"


# ---------------------------------------------------------------------------
# Domain errors
# ---------------------------------------------------------------------------
class AssessmentError(Exception):
    """Base assessment domain error."""
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.status_code = status_code


class AssessmentNotFoundError(AssessmentError):
    def __init__(self):
        super().__init__("Assessment not found.", status_code=404)


class InvalidAudioError(AssessmentError):
    def __init__(self, detail: str):
        super().__init__(detail, status_code=422)


class StorageUploadError(AssessmentError):
    def __init__(self):
        super().__init__("Failed to upload audio to storage.", status_code=500)


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------
def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _validate_audio_file(file: UploadFile) -> None:
    """
    Validate the uploaded audio file:
      • Must have a recognised extension.
      • Content-type must start with 'audio/' or be octet-stream.
    """
    if not file.filename:
        raise InvalidAudioError("Audio file must have a filename.")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.allowed_audio_ext_list:
        raise InvalidAudioError(
            f"Unsupported audio format '{ext}'. "
            f"Allowed: {', '.join(settings.allowed_audio_ext_list)}"
        )

    content_type = file.content_type or ""
    if not content_type.startswith("audio/") and content_type != "application/octet-stream":
        raise InvalidAudioError(
            f"Invalid content type '{content_type}'. Expected audio/*."
        )


async def _read_and_validate_size(file: UploadFile) -> bytes:
    """Read the entire upload into memory and enforce the size limit."""
    data = await file.read()
    if len(data) > settings.max_audio_bytes:
        raise InvalidAudioError(
            f"Audio file too large ({len(data) / (1024*1024):.1f} MB). "
            f"Maximum allowed: {settings.MAX_AUDIO_SIZE_MB} MB."
        )
    if len(data) == 0:
        raise InvalidAudioError("Audio file is empty.")
    return data


def _upload_to_supabase_storage(
    data: bytes,
    storage_path: str,
    content_type: str,
) -> str:
    """
    Upload raw bytes to Supabase Storage.

    Returns the public URL for the uploaded file.
    Uses upsert=True so re-uploads overwrite safely.
    """
    try:
        sb = get_supabase()
        bucket = settings.SUPABASE_AUDIO_BUCKET
        sb.storage.from_(bucket).upload(
            path=storage_path,
            file=data,
            file_options={"content-type": content_type, "upsert": "true"},
        )
        # Build the public URL
        public_url = (
            f"{settings.SUPABASE_URL}/storage/v1/object/public/{bucket}/{storage_path}"
        )
        return public_url
    except Exception as exc:
        raise StorageUploadError() from exc


def _to_response(raw: dict) -> AssessmentResponse:
    """Convert a Supabase row dict to an AssessmentResponse."""
    return AssessmentResponse(
        assessment_id=raw["assessment_id"],
        child_uid=raw["child_uid"],
        language=AssessmentLanguage(raw["language"]),
        passage_title=raw["passage_title"],
        passage_text=raw.get("passage_text"),
        difficulty=raw["difficulty"],
        audio_filename=raw["audio_filename"],
        audio_url=raw["audio_url"],
        audio_size_bytes=raw["audio_size_bytes"],
        status=AssessmentStatus(raw["status"]),
        wpm=raw.get("wpm"),
        accuracy=raw.get("accuracy"),
        fluency_score=raw.get("fluency_score"),
        hesitation_count=raw.get("hesitation_count"),
        mispronounced_words=raw.get("mispronounced_words") or [],
        risk_score=raw.get("risk_score"),
        ai_feedback=raw.get("ai_feedback"),
        created_at=raw["created_at"],
        updated_at=raw["updated_at"],
        completed_at=raw.get("completed_at"),
    )


# ---------------------------------------------------------------------------
# Public service functions
# ---------------------------------------------------------------------------

# ── Create assessment (upload audio) ──────────────────────────────────────────
async def create_assessment(
    child_uid: str,
    meta: AssessmentCreateMeta,
    audio_file: UploadFile,
) -> AssessmentResponse:
    """
    Create a new reading assessment:
      1. Validate audio file (type, extension, size).
      2. Upload audio bytes to Supabase Storage.
      3. Insert assessment row into Supabase `assessments` table.
      4. Return response.
    """
    # 1. Validate
    _validate_audio_file(audio_file)
    audio_data = await _read_and_validate_size(audio_file)

    # 2. Upload to Supabase Storage
    assessment_id = str(uuid.uuid4())
    ext = os.path.splitext(audio_file.filename)[1].lower()
    safe_filename = f"{assessment_id}{ext}"
    storage_path = f"{child_uid}/{assessment_id}/{safe_filename}"
    content_type = audio_file.content_type or "audio/wav"

    audio_url = _upload_to_supabase_storage(audio_data, storage_path, content_type)

    # 3. Build & insert DB row
    now = _now_iso()
    record: dict = {
        "assessment_id": assessment_id,
        "child_uid": child_uid,
        "language": meta.language.value,
        "passage_title": meta.passage_title,
        "passage_text": meta.passage_text,
        "difficulty": meta.difficulty.value,
        "audio_filename": audio_file.filename,
        "audio_storage_path": storage_path,
        "audio_url": audio_url,
        "audio_size_bytes": len(audio_data),
        "audio_content_type": content_type,
        "status": AssessmentStatus.UPLOADED.value,
        "wpm": None,
        "accuracy": None,
        "fluency_score": None,
        "hesitation_count": None,
        "mispronounced_words": [],
        "risk_score": None,
        "ai_feedback": None,
        "created_at": now,
        "updated_at": now,
        "completed_at": None,
    }

    sb = get_supabase()
    sb.table(TABLE).insert(record).execute()

    return _to_response(record)


# ── Get single assessment ─────────────────────────────────────────────────────
def get_assessment(assessment_id: str) -> AssessmentResponse:
    """
    Fetch a single assessment by ID.

    Raises:
      AssessmentNotFoundError
    """
    sb = get_supabase()
    result = sb.table(TABLE).select("*").eq("assessment_id", assessment_id).execute()
    if not result.data:
        raise AssessmentNotFoundError()
    return _to_response(result.data[0])


# ── List assessments for a user ───────────────────────────────────────────────
def list_user_assessments(
    child_uid: str,
    language: Optional[AssessmentLanguage] = None,
    status_filter: Optional[AssessmentStatus] = None,
) -> list[AssessmentResponse]:
    """
    Return all assessments for a given child, optionally filtered.
    Results are ordered newest-first.
    """
    sb = get_supabase()
    query = (
        sb.table(TABLE)
        .select("*")
        .eq("child_uid", child_uid)
        .order("created_at", desc=True)
    )

    if language:
        query = query.eq("language", language.value)
    if status_filter:
        query = query.eq("status", status_filter.value)

    result = query.execute()
    return [_to_response(row) for row in result.data]


# ── Update assessment results (AI pipeline callback) ──────────────────────────
def update_assessment_results(
    assessment_id: str,
    payload: AssessmentUpdateResults,
) -> AssessmentResponse:
    """
    Patch analysis results onto an existing assessment.
    Typically called by the AI analysis pipeline after processing the audio.

    Raises:
      AssessmentNotFoundError
    """
    sb = get_supabase()

    # Ensure record exists
    check = sb.table(TABLE).select("assessment_id").eq("assessment_id", assessment_id).execute()
    if not check.data:
        raise AssessmentNotFoundError()

    updates: dict = {"updated_at": _now_iso()}

    if payload.status is not None:
        updates["status"] = payload.status.value
        if payload.status == AssessmentStatus.COMPLETED:
            updates["completed_at"] = _now_iso()
    if payload.wpm is not None:
        updates["wpm"] = payload.wpm
    if payload.accuracy is not None:
        updates["accuracy"] = payload.accuracy
    if payload.fluency_score is not None:
        updates["fluency_score"] = payload.fluency_score
    if payload.hesitation_count is not None:
        updates["hesitation_count"] = payload.hesitation_count
    if payload.mispronounced_words is not None:
        updates["mispronounced_words"] = payload.mispronounced_words
    if payload.risk_score is not None:
        updates["risk_score"] = payload.risk_score
    if payload.ai_feedback is not None:
        updates["ai_feedback"] = payload.ai_feedback

    result = (
        sb.table(TABLE)
        .update(updates)
        .eq("assessment_id", assessment_id)
        .execute()
    )
    return _to_response(result.data[0])


# ── Delete assessment ─────────────────────────────────────────────────────────
def delete_assessment(assessment_id: str, child_uid: str) -> None:
    """
    Delete an assessment row and its audio file from Storage.

    Raises:
      AssessmentNotFoundError
    """
    sb = get_supabase()

    result = sb.table(TABLE).select("*").eq("assessment_id", assessment_id).execute()
    if not result.data:
        raise AssessmentNotFoundError()

    storage_path = result.data[0]["audio_storage_path"]

    # Delete audio from Supabase Storage (best-effort)
    try:
        sb.storage.from_(settings.SUPABASE_AUDIO_BUCKET).remove([storage_path])
    except Exception:
        pass  # storage deletion is best-effort

    # Delete DB row
    sb.table(TABLE).delete().eq("assessment_id", assessment_id).execute()
