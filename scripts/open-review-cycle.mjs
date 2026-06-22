import pg from "pg";
import dotenv from "dotenv";
import { randomUUID } from "crypto";

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
  `SELECT submission_count, is_submitted FROM certification_applications WHERE "projectId" = $1`,
  [projectId],
);
if (!cert.rows[0]?.is_submitted) {
  console.log("Project not submitted");
  process.exit(1);
}
const submissionCount = cert.rows[0].submission_count || 1;

const existing = await client.query(
  `SELECT id FROM review_cycles WHERE project_id = $1 AND submission_count = $2`,
  [projectId, submissionCount],
);
if (existing.rows.length) {
  console.log("Cycle already exists:", existing.rows[0].id);
  await client.end();
  process.exit(0);
}

const project = await client.query(
  `SELECT rating_type_id, version_type FROM projects WHERE id = $1`,
  [projectId],
);
const tpa = await client.query(
  `SELECT tpa_id FROM project_tpa_assignments WHERE project_id = $1`,
  [projectId],
);
const staff = await client.query(
  `SELECT staff_id FROM project_staff_assignments WHERE project_id = $1`,
  [projectId],
);

const id = randomUUID();
await client.query(
  `INSERT INTO review_cycles (
    id, project_id, submission_count, rating_type_id, version_type,
    tpa_id, coordinator_id, cycle_status, total_pending_points,
    certificate_eligible, opened_at, created_at, updated_at
  ) VALUES ($1,$2,$3,$4,$5,$6,$7,'open',0,false,NOW(),NOW(),NOW())`,
  [
    id,
    projectId,
    submissionCount,
    project.rows[0]?.rating_type_id ?? null,
    project.rows[0]?.version_type ?? "3",
    tpa.rows[0]?.tpa_id ?? null,
    staff.rows[0]?.staff_id ?? null,
  ],
);

console.log("Created review cycle", id, "for project", projectId);
await client.end();
