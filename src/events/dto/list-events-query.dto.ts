import { Type } from "class-transformer";
import { IsIn, IsOptional, Min } from "class-validator";

export class ListEventsQueryDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsIn(["active", "draft", "inactive"])
  status?: "active" | "draft" | "inactive";

  @IsOptional()
  dateFrom?: string;

  @IsOptional()
  dateTo?: string;

  @IsOptional()
  @IsIn(["title", "startDateTime", "location", "status", "createdAt"])
  sortBy?: "title" | "startDateTime" | "location" | "status" | "createdAt";

  @IsOptional()
  @IsIn(["ASC", "DESC", "asc", "desc"])
  sortOrder?: "ASC" | "DESC" | "asc" | "desc";

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
