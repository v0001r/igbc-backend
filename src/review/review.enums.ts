export type ReviewCycleStatus =
  | "open"
  | "tpa_locked"
  | "coordinator_locked"
  | "client_pending"
  | "accepted"
  | "rejected"
  | "reappeal_open"
  | "closed";

export type ReviewerRole = "tpa" | "coordinator";

export type CreditReviewRowStatus = "draft" | "submitted" | "locked";

export type ReportReleasePhase =
  | "tpa_preview"
  | "tpa_released"
  | "coordinator_preview"
  | "coordinator_released"
  | "client_delivered";

export type ClientReportResponseType = "accepted" | "rejected";

export type ClientReportStatus = "pending" | "accepted" | "rejected";

export type ReappealPaymentStatus = "pending" | "paid" | "rejected";

export type ReportPhase =
  | "none"
  | "tpa_review"
  | "tpa_released"
  | "coordinator_review"
  | "coordinator_released"
  | "client_pending"
  | "client_accepted"
  | "client_rejected"
  | "reappeal";
