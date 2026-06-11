import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { RoleName } from "../../rbac/role.enum";

export class UpdateAdminUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  organization?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ enum: [RoleName.IGBC_STAFF, RoleName.TPA] })
  @IsOptional()
  @IsEnum(RoleName)
  role?: RoleName.IGBC_STAFF | RoleName.TPA;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  ratingTypeIds?: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  projectIds?: number[];

  @ApiPropertyOptional({ enum: ["active", "inactive"] })
  @IsOptional()
  @IsEnum(["active", "inactive"])
  status?: "active" | "inactive";

  @ApiPropertyOptional({ description: "IGBC Staff only — marks user as a lead" })
  @IsOptional()
  @IsBoolean()
  isLead?: boolean;
}
