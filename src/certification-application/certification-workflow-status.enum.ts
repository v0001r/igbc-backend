export type CertificationWorkflowStatus =
  | "draft"
  | "final_submitted"
  | "assigned_to_staff"
  | "assigned_to_tpa"
  | "tpa_review_in_progress"
  | "tpa_report_released"
  | "coordinator_review_in_progress"
  | "coordinator_report_released"
  | "client_review_pending"
  | "client_accepted"
  | "client_rejected"
  | "reappeal_in_progress"
  | "under_review"
  | "completed";

export const CERTIFICATION_WORKFLOW_STATUSES: CertificationWorkflowStatus[] = [
  "draft",
  "final_submitted",
  "assigned_to_staff",
  "assigned_to_tpa",
  "tpa_review_in_progress",
  "tpa_report_released",
  "coordinator_review_in_progress",
  "coordinator_report_released",
  "client_review_pending",
  "client_accepted",
  "client_rejected",
  "reappeal_in_progress",
  "under_review",
  "completed",
];
