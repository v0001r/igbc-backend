export enum RoleName {
  ADMIN = "ADMIN",
  IGBC_STAFF = "IGBC_STAFF",
  TPA = "TPA",
  CLIENT = "CLIENT",
}

export const ROLE_USER_TYPE_MAP: Record<RoleName, "a" | "s" | "T" | "m"> = {
  [RoleName.ADMIN]: "a",
  [RoleName.IGBC_STAFF]: "s",
  [RoleName.TPA]: "T",
  [RoleName.CLIENT]: "m",
};

export const USER_TYPE_ROLE_MAP: Record<"a" | "s" | "T" | "m", RoleName> = {
  a: RoleName.ADMIN,
  s: RoleName.IGBC_STAFF,
  T: RoleName.TPA,
  m: RoleName.CLIENT,
};

export const DEFAULT_STAFF_PASSWORD = "IgbcPwd@1234";
