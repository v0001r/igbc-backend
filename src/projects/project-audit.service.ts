import { Injectable } from "@nestjs/common";
import type { EntityManager } from "typeorm";
import { ActivityType } from "../activity-log/activity-type.enum";
import { ActivityLogService } from "../activity-log/activity-log.service";
import type { ProjectAuditAction } from "./project-audit-log.entity";

const AUDIT_ACTION_TITLES: Record<ProjectAuditAction, string> = {
  FINAL_SUBMITTED: "Final submission",
  STAFF_ASSIGNED: "Staff assigned",
  STAFF_REASSIGNED: "Staff reassigned",
  TEAM_ASSIGNED: "Coordinator and TPA assigned",
  TPA_ASSIGNED: "TPA assigned",
  TPA_REASSIGNED: "TPA reassigned",
  WORKFLOW_STATUS_CHANGED: "Status updated",
};

@Injectable()
export class ProjectAuditService {
  constructor(private readonly activityLogService: ActivityLogService) {}

  async log(
    projectId: number,
    action: ProjectAuditAction,
    actorUserId: string | null,
    metadata?: Record<string, unknown>,
    manager?: EntityManager,
  ) {
    await this.activityLogService.log(
      {
        projectId,
        userId: actorUserId,
        activityType: action,
        module: "workflow",
        activityTitle: AUDIT_ACTION_TITLES[action] ?? action,
        activityDescription: AUDIT_ACTION_TITLES[action] ?? action,
        oldValue:
          metadata?.previousStaffId != null || metadata?.previousTpaId != null
            ? {
                staffId: metadata.previousStaffId ?? undefined,
                tpaId: metadata.previousTpaId ?? undefined,
              }
            : null,
        newValue: metadata ?? null,
      },
      manager,
    );
  }

  async getTimeline(projectId: number) {
    const rows = await this.activityLogService.getTimelineForProject(projectId);
    const workflowTypes = new Set<string>([
      ActivityType.FINAL_SUBMITTED,
      ActivityType.FINAL_SUBMIT,
      ActivityType.STAFF_ASSIGNED,
      ActivityType.STAFF_REASSIGNED,
      ActivityType.TEAM_ASSIGNED,
      ActivityType.TPA_ASSIGNED,
      ActivityType.TPA_REASSIGNED,
      ActivityType.WORKFLOW_STATUS_CHANGED,
    ]);

    return rows.filter((r) => workflowTypes.has(r.action));
  }
}
