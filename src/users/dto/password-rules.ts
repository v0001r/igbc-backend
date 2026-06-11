import { Matches, MinLength } from "class-validator";

export const PASSWORD_MIN_LENGTH = 8;

export const PasswordComplexityRules = [
  MinLength(PASSWORD_MIN_LENGTH),
  Matches(/[A-Z]/, { message: "Password must include an uppercase letter" }),
  Matches(/[a-z]/, { message: "Password must include a lowercase letter" }),
  Matches(/\d/, { message: "Password must include a number" }),
  Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must include a special character" }),
] as const;
