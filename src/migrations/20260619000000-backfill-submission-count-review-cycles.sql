-- Backfill submission_count for projects final-submitted before counter was wired
UPDATE certification_applications
SET submission_count = 1
WHERE is_submitted = TRUE
  AND (submission_count IS NULL OR submission_count < 1);

-- Open review cycles for submitted projects missing a cycle (run after app deploy ensures openCycle logic)
INSERT INTO review_cycles (
  id,
  project_id,
  submission_count,
  rating_type_id,
  version_type,
  tpa_id,
  coordinator_id,
  cycle_status,
  total_pending_points,
  certificate_eligible,
  opened_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  ca."projectId",
  ca.submission_count,
  p.rating_type_id,
  COALESCE(p.version_type, '3'),
  tpa.tpa_id,
  staff.staff_id,
  'open',
  0,
  FALSE,
  COALESCE(ca.submitted_at, NOW()),
  NOW(),
  NOW()
FROM certification_applications ca
JOIN projects p ON p.id = ca."projectId"
LEFT JOIN project_tpa_assignments tpa ON tpa.project_id = ca."projectId"
LEFT JOIN project_staff_assignments staff ON staff.project_id = ca."projectId"
WHERE ca.is_submitted = TRUE
  AND ca.submission_count >= 1
  AND NOT EXISTS (
    SELECT 1 FROM review_cycles rc
    WHERE rc.project_id = ca."projectId"
      AND rc.submission_count = ca.submission_count
  );
