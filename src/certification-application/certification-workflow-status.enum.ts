export type CertificationWorkflowStatus =
  | "draft"
  | "final_submitted"
  | "assigned_to_staff"
  | "assigned_to_tpa"
  | "under_review"
  | "completed";

export const CERTIFICATION_WORKFLOW_STATUSES: CertificationWorkflowStatus[] = [
  "draft",
  "final_submitted",
  "assigned_to_staff",
  "assigned_to_tpa",
  "under_review",
  "completed",
];
