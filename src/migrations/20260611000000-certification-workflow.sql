-- Certification workflow migration (reference; TypeORM synchronize also applies in dev)

ALTER TABLE certification_applications
  ADD COLUMN IF NOT EXISTS is_submitted BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS workflow_status VARCHAR(32) NOT NULL DEFAULT 'draft';

CREATE TABLE IF NOT EXISTS project_staff_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id INT NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_tpa_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id INT NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  tpa_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id INT NOT NULL,
  actor_user_id UUID NULL,
  action VARCHAR(64) NOT NULL,
  metadata JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_audit_logs_project_id ON project_audit_logs(project_id);
