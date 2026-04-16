import { Type } from "class-transformer";
import { IsIn, IsOptional, Min } from "class-validator";

export class ListSupportQueryDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  department?: string;

  @IsOptional()
  @IsIn(["active", "inactive"])
  status?: "active" | "inactive";

  @IsOptional()
  @IsIn(["name", "createdAt"])
  sortBy?: "name" | "createdAt";

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
