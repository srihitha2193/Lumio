"""
Pydantic schemas for Reading Assessments.

Supabase table: `assessments`
  assessment_id  TEXT PRIMARY KEY
  child_uid      TEXT NOT NULL REFERENCES users(uid)
"""
from __future__ import annotations

from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------
class AssessmentLanguage(str, Enum):
    ENGLISH = "english"
    TELUGU = "telugu"


class AssessmentStatus(str, Enum):
    UPLOADED = "uploaded"           # audio received, not yet analysed
    PROCESSING = "processing"       # AI pipeline running
    COMPLETED = "completed"         # analysis done, results available
    FAILED = "failed"               # analysis encountered an error


class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


# ---------------------------------------------------------------------------
# Request schemas (used by the route layer)
# ---------------------------------------------------------------------------
class AssessmentCreateMeta(BaseModel):
    """
    Metadata sent alongside the audio file upload (as form fields).
    The audio file itself is received as an UploadFile, not in this schema.
    """
    language: AssessmentLanguage = Field(
        ...,
        description="Language of the reading passage",
        examples=["english"],
    )
    passage_title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Title of the passage being read",
        examples=["The Magic Treehouse Ch.3"],
    )
    passage_text: Optional[str] = Field(
        None,
        max_length=5000,
        description="Full text of the passage (used for accuracy comparison)",
    )
    difficulty: DifficultyLevel = Field(
        DifficultyLevel.BEGINNER,
        description="Difficulty level of the passage",
    )


# ---------------------------------------------------------------------------
# DB record / response schemas
# ---------------------------------------------------------------------------
class AssessmentInDB(BaseModel):
    """Full assessment record stored in Supabase (assessments table)."""
    assessment_id: str
    child_uid: str
    language: AssessmentLanguage
    passage_title: str
    passage_text: Optional[str] = None
    difficulty: DifficultyLevel

    # Audio
    audio_filename: str              # original uploaded filename
    audio_storage_path: str          # path inside Supabase Storage bucket
    audio_url: str                   # public download URL
    audio_size_bytes: int
    audio_content_type: str

    # Status & results
    status: AssessmentStatus = AssessmentStatus.UPLOADED
    wpm: Optional[float] = None                 # words per minute
    accuracy: Optional[float] = None            # 0–100 %
    fluency_score: Optional[float] = None       # 0–100
    hesitation_count: Optional[int] = None
    mispronounced_words: Optional[list[str]] = []
    risk_score: Optional[float] = None          # 0.0–1.0  (dyslexia risk)
    ai_feedback: Optional[str] = None           # free-text feedback from AI

    # Timestamps (ISO-8601)
    created_at: str
    updated_at: str
    completed_at: Optional[str] = None


class AssessmentResponse(BaseModel):
    """Safe outbound representation of an assessment."""
    assessment_id: str
    child_uid: str
    language: AssessmentLanguage
    passage_title: str
    passage_text: Optional[str] = None
    difficulty: DifficultyLevel

    audio_filename: str
    audio_url: str
    audio_size_bytes: int

    status: AssessmentStatus
    wpm: Optional[float] = None
    accuracy: Optional[float] = None
    fluency_score: Optional[float] = None
    hesitation_count: Optional[int] = None
    mispronounced_words: Optional[list[str]] = []
    risk_score: Optional[float] = None
    ai_feedback: Optional[str] = None

    created_at: str
    updated_at: str
    completed_at: Optional[str] = None

    model_config = {"from_attributes": True}


class AssessmentListResponse(BaseModel):
    """Paginated list wrapper."""
    total: int
    assessments: list[AssessmentResponse]


class AssessmentUpdateResults(BaseModel):
    """
    Used internally (or by a future AI worker endpoint) to patch
    analysis results onto an existing assessment.
    """
    status: Optional[AssessmentStatus] = None
    wpm: Optional[float] = Field(None, ge=0)
    accuracy: Optional[float] = Field(None, ge=0, le=100)
    fluency_score: Optional[float] = Field(None, ge=0, le=100)
    hesitation_count: Optional[int] = Field(None, ge=0)
    mispronounced_words: Optional[list[str]] = None
    risk_score: Optional[float] = Field(None, ge=0, le=1)
    ai_feedback: Optional[str] = Field(None, max_length=2000)
