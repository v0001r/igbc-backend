ALTER TABLE certification_applications
  ADD COLUMN IF NOT EXISTS is_pending BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS certificate_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS certificate_accepted_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS certificate_accepted_by UUID NULL,
  ADD COLUMN IF NOT EXISTS certificate_rejected_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS certificate_rejected_by UUID NULL,
  ADD COLUMN IF NOT EXISTS certificate_reject_remarks TEXT NULL;

CREATE TABLE IF NOT EXISTS certificate_customizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id INT NOT NULL UNIQUE REFERENCES certification_applications(id) ON DELETE CASCADE,
  project_name VARCHAR(500) NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certificate_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id INT NOT NULL REFERENCES certification_applications(id) ON DELETE CASCADE,
  action VARCHAR(30) NOT NULL,
  remarks TEXT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificate_action_logs_application
  ON certificate_action_logs(application_id, created_at DESC);
