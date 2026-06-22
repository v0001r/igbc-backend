import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new pg.Client({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT || 5432),
  user: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "igbc",
});

await client.connect();

const upd = await client.query(`
  UPDATE certification_applications
  SET submission_count = 1
  WHERE is_submitted = TRUE AND (submission_count IS NULL OR submission_count < 1)
`);
console.log("backfilled submission_count rows:", upd.rowCount);

const projectId = 8;
const cert = await client.query(
  `SELECT "projectId", submission_count FROM certification_applications WHERE "projectId" = $1`,
  [projectId],
);
console.log("project 8 cert:", cert.rows[0]);

await client.end();
