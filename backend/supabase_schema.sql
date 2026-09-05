-- ============================================================
-- Lumio — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    uid                TEXT PRIMARY KEY,
    name               TEXT NOT NULL,
    email              TEXT UNIQUE NOT NULL,
    role               TEXT NOT NULL CHECK (role IN ('child', 'parent', 'teacher')),
    hashed_password    TEXT NOT NULL,
    is_active          BOOLEAN DEFAULT TRUE,

    -- Child fields
    age                INTEGER,
    level              INTEGER DEFAULT 1,
    xp                 INTEGER DEFAULT 0,
    parent_id          TEXT REFERENCES users(uid),
    teacher_id         TEXT REFERENCES users(uid),

    -- Parent fields
    children_ids       TEXT[] DEFAULT '{}',

    -- Teacher fields
    school             TEXT,
    grade              TEXT,
    student_ids        TEXT[] DEFAULT '{}',

    created_at         TIMESTAMPTZ DEFAULT NOW(),
    updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ── Assessments ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessments (
    assessment_id        TEXT PRIMARY KEY,
    child_uid            TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
    language             TEXT NOT NULL CHECK (language IN ('english', 'telugu')),
    passage_title        TEXT NOT NULL,
    passage_text         TEXT,
    difficulty           TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),

    -- Audio
    audio_filename       TEXT NOT NULL,
    audio_storage_path   TEXT NOT NULL,
    audio_url            TEXT NOT NULL,
    audio_size_bytes     INTEGER NOT NULL,
    audio_content_type   TEXT NOT NULL,

    -- AI results
    status               TEXT DEFAULT 'uploaded'
                             CHECK (status IN ('uploaded', 'processing', 'completed', 'failed')),
    wpm                  FLOAT,
    accuracy             FLOAT CHECK (accuracy BETWEEN 0 AND 100),
    fluency_score        FLOAT CHECK (fluency_score BETWEEN 0 AND 100),
    hesitation_count     INTEGER,
    mispronounced_words  TEXT[] DEFAULT '{}',
    risk_score           FLOAT CHECK (risk_score BETWEEN 0 AND 1),
    ai_feedback          TEXT,

    created_at           TIMESTAMPTZ DEFAULT NOW(),
    updated_at           TIMESTAMPTZ DEFAULT NOW(),
    completed_at         TIMESTAMPTZ
);

-- Index for fast per-child queries
CREATE INDEX IF NOT EXISTS idx_assessments_child_uid
    ON assessments (child_uid, created_at DESC);

-- ── Row Level Security (Optional — disable for dev, enable for prod) ──────────
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
-- (The backend uses service_role key which bypasses RLS anyway)
