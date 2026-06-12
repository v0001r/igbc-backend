import { AsyncLocalStorage } from "async_hooks";

export type ActivityLogRequestContext = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

export const activityLogContextStorage = new AsyncLocalStorage<ActivityLogRequestContext>();

export function getActivityLogContext(): ActivityLogRequestContext | undefined {
  return activityLogContextStorage.getStore();
}
