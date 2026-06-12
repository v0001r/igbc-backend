-- Centralized project activity log (reference; TypeORM synchronize also applies in dev)

CREATE TABLE IF NOT EXISTS project_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id INT NULL REFERENCES projects(id) ON DELETE CASCADE,
  certification_application_id INT NULL REFERENCES certification_applications(id) ON DELETE SET NULL,
  user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
  user_role VARCHAR(32) NULL,
  activity_type VARCHAR(64) NOT NULL,
  module VARCHAR(64) NULL,
  tab_name VARCHAR(128) NULL,
  subtab_name VARCHAR(128) NULL,
  activity_title VARCHAR(255) NOT NULL,
  activity_description TEXT NULL,
  old_value JSONB NULL,
  new_value JSONB NULL,
  points_awarded NUMERIC(10,2) NULL,
  points_deducted NUMERIC(10,2) NULL,
  document_name VARCHAR(255) NULL,
  document_count INT NULL,
  submission_count INT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pal_project_id ON project_activity_log(project_id);
CREATE INDEX IF NOT EXISTS idx_pal_user_id ON project_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_pal_activity_type ON project_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_pal_created_at ON project_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_pal_project_created ON project_activity_log(project_id, created_at DESC);
