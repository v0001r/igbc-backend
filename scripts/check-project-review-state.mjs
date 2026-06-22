import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const projectId = Number(process.argv[2] || 8);
const client = new pg.Client({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT || 5432),
  user: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "igbc",
});

await client.connect();
const cert = await client.query(
  `SELECT workflow_status, report_phase, submission_count, is_submitted
   FROM certification_applications WHERE "projectId" = $1`,
  [projectId],
);
const cycles = await client.query(
  `SELECT id, submission_count, cycle_status, tpa_locked_at, coordinator_locked_at
   FROM review_cycles WHERE project_id = $1 ORDER BY submission_count DESC`,
  [projectId],
);
const releases = await client.query(
  `SELECT rr.release_phase, rr.released_at
   FROM report_releases rr
   JOIN review_cycles rc ON rc.id = rr.review_cycle_id
   WHERE rc.project_id = $1
   ORDER BY rr.released_at DESC LIMIT 10`,
  [projectId],
);
console.log(JSON.stringify({ cert: cert.rows[0], cycles: cycles.rows, releases: releases.rows }, null, 2));
await client.end();
