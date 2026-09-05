"""
Reading Assessment API routes.

Endpoints
─────────
POST   /api/assessments/upload            – upload audio + create assessment
GET    /api/assessments/{assessment_id}    – get single assessment
GET    /api/assessments/user/me            – list own assessments (child)
GET    /api/assessments/user/{child_uid}   – list a child's assessments (parent/teacher)
PATCH  /api/assessments/{assessment_id}/results – patch AI results
DELETE /api/assessments/{assessment_id}    – delete assessment
"""
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.api.dependencies import (
    get_current_child,
    get_current_user,
    require_roles,
)
from app.models.assessment import (
    AssessmentCreateMeta,
    AssessmentLanguage,
    AssessmentListResponse,
    AssessmentResponse,
    AssessmentStatus,
    AssessmentUpdateResults,
    DifficultyLevel,
)
from app.models.user import MessageResponse, UserResponse, UserRole
from app.services.assessment_service import (
    AssessmentError,
    create_assessment,
    delete_assessment,
    get_assessment,
    list_user_assessments,
    update_assessment_results,
)

router = APIRouter(prefix="/assessments", tags=["Reading Assessments"])


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
def _raise(exc: AssessmentError) -> None:
    raise HTTPException(status_code=exc.status_code, detail=str(exc))


# ── Upload audio & create assessment ──────────────────────────────────────────
@router.post(
    "/upload",
    response_model=AssessmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload audio recording and create a reading assessment",
    description=(
        "Upload an audio file (WAV, WebM, MP3, OGG, M4A, FLAC) along with "
        "assessment metadata. The audio is stored in Firebase Storage and "
        "the assessment record is saved in the Realtime Database.\n\n"
        "**Auth:** Child role required."
    ),
)
async def upload_assessment(
    # Auth
    current_user: Annotated[UserResponse, Depends(get_current_child)],
    # Audio file
    audio_file: UploadFile = File(
        ...,
        description="Audio recording of the child reading the passage",
    ),
    # Form fields (metadata)
    language: AssessmentLanguage = Form(
        ...,
        description="Language of the reading passage (english / telugu)",
    ),
    passage_title: str = Form(
        ...,
        min_length=1,
        max_length=200,
        description="Title of the passage being read",
    ),
    passage_text: Optional[str] = Form(
        None,
        max_length=5000,
        description="Full text of the passage for accuracy comparison",
    ),
    difficulty: DifficultyLevel = Form(
        DifficultyLevel.BEGINNER,
        description="Difficulty level of the passage",
    ),
) -> AssessmentResponse:
    meta = AssessmentCreateMeta(
        language=language,
        passage_title=passage_title,
        passage_text=passage_text,
        difficulty=difficulty,
    )
    try:
        return await create_assessment(
            child_uid=current_user.uid,
            meta=meta,
            audio_file=audio_file,
        )
    except AssessmentError as exc:
        _raise(exc)


# ── Get single assessment ─────────────────────────────────────────────────────
@router.get(
    "/{assessment_id}",
    response_model=AssessmentResponse,
    summary="Get a single assessment by ID",
    description="Any authenticated user can fetch assessment details.",
)
def get_single_assessment(
    assessment_id: str,
    _user: Annotated[UserResponse, Depends(get_current_user)],
) -> AssessmentResponse:
    try:
        return get_assessment(assessment_id)
    except AssessmentError as exc:
        _raise(exc)


# ── List own assessments (child) ──────────────────────────────────────────────
@router.get(
    "/user/me",
    response_model=AssessmentListResponse,
    summary="List my assessments (child)",
    description="Returns all assessments for the currently logged-in child.",
)
def list_my_assessments(
    current_user: Annotated[UserResponse, Depends(get_current_child)],
    language: Optional[AssessmentLanguage] = None,
    status_filter: Optional[AssessmentStatus] = None,
) -> AssessmentListResponse:
    results = list_user_assessments(
        child_uid=current_user.uid,
        language=language,
        status_filter=status_filter,
    )
    return AssessmentListResponse(total=len(results), assessments=results)


# ── List a child's assessments (parent / teacher) ─────────────────────────────
@router.get(
    "/user/{child_uid}",
    response_model=AssessmentListResponse,
    summary="List a child's assessments (parent / teacher)",
    description=(
        "Returns all assessments for a specific child. "
        "Only parents and teachers may call this endpoint."
    ),
)
def list_child_assessments(
    child_uid: str,
    _user: Annotated[
        UserResponse,
        Depends(require_roles(UserRole.PARENT, UserRole.TEACHER)),
    ],
    language: Optional[AssessmentLanguage] = None,
    status_filter: Optional[AssessmentStatus] = None,
) -> AssessmentListResponse:
    results = list_user_assessments(
        child_uid=child_uid,
        language=language,
        status_filter=status_filter,
    )
    return AssessmentListResponse(total=len(results), assessments=results)


# ── Patch AI analysis results ─────────────────────────────────────────────────
@router.patch(
    "/{assessment_id}/results",
    response_model=AssessmentResponse,
    summary="Update assessment with AI analysis results",
    description=(
        "Patch WPM, accuracy, fluency, hesitations, risk score, and AI feedback "
        "onto an existing assessment. Intended for the AI analysis pipeline or "
        "teacher corrections.\n\n"
        "**Auth:** Teacher role required."
    ),
)
def patch_results(
    assessment_id: str,
    payload: AssessmentUpdateResults,
    _teacher: Annotated[UserResponse, Depends(require_roles(UserRole.TEACHER))],
) -> AssessmentResponse:
    try:
        return update_assessment_results(assessment_id, payload)
    except AssessmentError as exc:
        _raise(exc)


# ── Delete assessment ─────────────────────────────────────────────────────────
@router.delete(
    "/{assessment_id}",
    response_model=MessageResponse,
    summary="Delete an assessment",
    description=(
        "Deletes the assessment record and its audio file from storage. "
        "Only the child who created it or a teacher may delete."
    ),
)
def delete_single_assessment(
    assessment_id: str,
    current_user: Annotated[UserResponse, Depends(get_current_user)],
) -> MessageResponse:
    # Fetch first to check ownership
    try:
        assessment = get_assessment(assessment_id)
    except AssessmentError as exc:
        _raise(exc)

    # Only the owner (child) or a teacher may delete
    if current_user.uid != assessment.child_uid and current_user.role != UserRole.TEACHER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own assessments.",
        )

    try:
        delete_assessment(assessment_id, assessment.child_uid)
    except AssessmentError as exc:
        _raise(exc)

    return MessageResponse(message="Assessment deleted successfully.")
