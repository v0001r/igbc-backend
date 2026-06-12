-- Optional one-time backfill: copy historical project_audit_logs into project_activity_log.
-- Run manually in environments that need legacy timeline data in the unified table.

INSERT INTO project_activity_log (
  project_id,
  user_id,
  activity_type,
  activity_title,
  activity_description,
  new_value,
  created_at
)
SELECT
  pal.project_id,
  pal.actor_user_id,
  pal.action,
  pal.action,
  pal.action,
  pal.metadata,
  pal.created_at
FROM project_audit_logs pal
WHERE NOT EXISTS (
  SELECT 1
  FROM project_activity_log existing
  WHERE existing.project_id = pal.project_id
    AND existing.activity_type = pal.action
    AND existing.created_at = pal.created_at
);
