import type { ActivityTypeValue } from "../activity-type.enum";

export type LogActivityDto = {
  projectId?: number | null;
  certificationApplicationId?: number | null;
  userId?: string | null;
  userRole?: string | null;
  activityType: ActivityTypeValue | string;
  module?: string | null;
  tabName?: string | null;
  subtabName?: string | null;
  activityTitle: string;
  activityDescription?: string | null;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  pointsAwarded?: number | string | null;
  pointsDeducted?: number | string | null;
  documentName?: string | null;
  documentCount?: number | null;
  submissionCount?: number | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};
