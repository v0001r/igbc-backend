import { IsIn, IsOptional } from "class-validator";

export class UpdateProjectStatusDto {
  @IsOptional()
  @IsIn(["draft", "pending", "in-review", "approved", "rejected"])
  registrationStatus?: "draft" | "pending" | "in-review" | "approved" | "rejected";

  @IsOptional()
  @IsIn(["not_started", "pending", "approved", "accepted"])
  certificationStatus?: "not_started" | "pending" | "approved" | "accepted";
}
