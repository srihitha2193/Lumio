"""
Lumio FastAPI Application
─────────────────────────
Entry point: uvicorn app.main:app --reload

This module:
  • Creates the FastAPI app instance
  • Configures CORS
  • Registers all routers under /api
  • Wires up global exception handlers
  • Warms up the Supabase client at startup
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.core.supabase import get_supabase   # warms up the cached Supabase client
from app.api.routes.auth import router as auth_router
from app.api.routes.users import router as users_router
from app.api.routes.assessment import router as assessment_router

settings = get_settings()


# ---------------------------------------------------------------------------
# Lifespan (startup / shutdown)
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Supabase client is warmed up by the import above.
    # Add any other async startup tasks here (e.g. warm up ML model).
    print("🚀 Lumio API starting up...")
    yield
    # Shutdown tasks here if needed
    print("🛑 Lumio API shutting down.")


# ---------------------------------------------------------------------------
# App instance
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Lumio API",
    description=(
        "AI-Powered Foundational Learning and Early Dyslexia Detection Platform. "
        "Supports Child, Parent, and Teacher roles."
    ),
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Global exception handlers
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Catch-all so internal errors never leak stack traces to clients."""
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."},
    )


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
API_PREFIX = "/api"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(users_router, prefix=API_PREFIX)
app.include_router(assessment_router, prefix=API_PREFIX)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/api/health", tags=["Health"], summary="Health check")
def health():
    return {"status": "ok", "service": "lumio-api", "version": "1.0.0"}
