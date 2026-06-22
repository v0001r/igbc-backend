-- Review & Report Release module schema (reference; TypeORM synchronize applies in dev)

CREATE TABLE IF NOT EXISTS review_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id INT NOT NULL,
  submission_count INT NOT NULL,
  rating_type_id INT NULL,
  version_type VARCHAR(16) NOT NULL DEFAULT '3',
  tpa_id UUID NULL,
  coordinator_id UUID NULL,
  cycle_status VARCHAR(32) NOT NULL DEFAULT 'open',
  tpa_locked_at TIMESTAMPTZ NULL,
  coordinator_locked_at TIMESTAMPTZ NULL,
  total_pending_points NUMERIC(10,2) NOT NULL DEFAULT 0,
  certificate_eligible BOOLEAN NOT NULL DEFAULT FALSE,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, submission_count)
);

CREATE TABLE IF NOT EXISTS credit_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_cycle_id UUID NOT NULL REFERENCES review_cycles(id) ON DELETE CASCADE,
  project_id INT NOT NULL,
  submission_count INT NOT NULL,
  tab VARCHAR(128) NOT NULL,
  subtab VARCHAR(128) NOT NULL,
  reviewer_role VARCHAR(16) NOT NULL,
  reviewer_user_id UUID NOT NULL,
  awarded_points NUMERIC(8,2) NOT NULL DEFAULT 0,
  pending_points NUMERIC(8,2) NOT NULL DEFAULT 0,
  denied_points NUMERIC(8,2) NOT NULL DEFAULT 0,
  technical_advice TEXT NULL,
  review_remarks TEXT NULL,
  row_status VARCHAR(16) NOT NULL DEFAULT 'draft',
  supersedes_review_id UUID NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_cycle_id UUID NOT NULL REFERENCES review_cycles(id) ON DELETE CASCADE,
  release_phase VARCHAR(32) NOT NULL,
  report_doc_key VARCHAR(512) NULL,
  tpa_remark VARCHAR(500) NULL,
  staff_remark VARCHAR(500) NULL,
  released_by UUID NOT NULL,
  released_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_pdf_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_cycle_id UUID NOT NULL REFERENCES review_cycles(id) ON DELETE CASCADE,
  release_id UUID NULL,
  version_no INT NOT NULL,
  phase VARCHAR(32) NOT NULL,
  storage_key VARCHAR(512) NOT NULL,
  sha256 VARCHAR(64) NULL,
  generated_by UUID NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (review_cycle_id, version_no)
);

CREATE TABLE IF NOT EXISTS client_report_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_cycle_id UUID NOT NULL REFERENCES review_cycles(id) ON DELETE CASCADE,
  response VARCHAR(16) NOT NULL,
  client_remark TEXT NULL,
  responded_by UUID NOT NULL,
  responded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reappeal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id INT NOT NULL,
  review_cycle_id UUID NOT NULL REFERENCES review_cycles(id) ON DELETE CASCADE,
  payment_status VARCHAR(16) NOT NULL DEFAULT 'pending',
  reappeal_checklist JSONB NOT NULL DEFAULT '[]',
  approved_tabs JSONB NOT NULL DEFAULT '[]',
  fee_amount NUMERIC(12,2) NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE certification_applications
  ADD COLUMN IF NOT EXISTS report_phase VARCHAR(32) NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS is_reappeal BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS reappeal_payment_status VARCHAR(16) NULL,
  ADD COLUMN IF NOT EXISTS client_report_status VARCHAR(16) NOT NULL DEFAULT 'pending';

ALTER TABLE rating_documents
  ADD COLUMN IF NOT EXISTS submission_count INT NOT NULL DEFAULT 1;
