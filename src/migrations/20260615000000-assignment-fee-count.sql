-- Lead assignment fee/count on staff assignment row (reference; TypeORM synchronize also applies in dev)

ALTER TABLE project_staff_assignments
  ADD COLUMN IF NOT EXISTS fee DECIMAL(12, 2) NULL,
  ADD COLUMN IF NOT EXISTS count INT NULL;
