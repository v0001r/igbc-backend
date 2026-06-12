-- Track how many times a certification application has been finally submitted

ALTER TABLE certification_applications
  ADD COLUMN IF NOT EXISTS submission_count INT NOT NULL DEFAULT 0;
