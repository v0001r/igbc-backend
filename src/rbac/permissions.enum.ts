export enum Permission {
  USERS_MANAGE = "users.manage",
  SETTINGS_MANAGE = "settings.manage",
  PROJECTS_MANAGE = "projects.manage",
  PROJECTS_VIEW_ASSIGNED = "projects.view_assigned",
  PROJECTS_REVIEW = "projects.review",
  PROJECTS_ASSIGN_STAFF = "projects.assign_staff",
  PROJECTS_ASSIGN_TPA = "projects.assign_tpa",
  REPORTS_LIMITED = "reports.limited",
  DASHBOARD_ADMIN = "dashboard.admin",
  DASHBOARD_STAFF = "dashboard.staff",
  DASHBOARD_TPA = "dashboard.tpa",
}

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ADMIN: Object.values(Permission),
  IGBC_STAFF: [
    Permission.PROJECTS_VIEW_ASSIGNED,
    Permission.PROJECTS_REVIEW,
    Permission.PROJECTS_ASSIGN_STAFF,
    Permission.PROJECTS_ASSIGN_TPA,
    Permission.REPORTS_LIMITED,
    Permission.DASHBOARD_STAFF,
  ],
  TPA: [
    Permission.PROJECTS_VIEW_ASSIGNED,
    Permission.PROJECTS_REVIEW,
    Permission.DASHBOARD_TPA,
  ],
  CLIENT: [],
};
