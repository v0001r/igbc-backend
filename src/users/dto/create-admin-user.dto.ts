import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayMinSize,
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

export class CreateAdminUserDto {
  @ApiProperty({ example: "Naveen Kumar" })
  @IsString()
  @MinLength(2)
  fullName!: string;

  @ApiProperty({ example: "staff@igbc.in" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "9999999999" })
  @IsString()
  @MinLength(10)
  phone!: string;

  @ApiProperty({ example: "IGBC Hyderabad" })
  @IsString()
  organization!: string;

  @ApiPropertyOptional({ example: "Mind Space, Hyderabad" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ enum: [RoleName.IGBC_STAFF, RoleName.TPA] })
  @IsEnum(RoleName)
  role!: RoleName.IGBC_STAFF | RoleName.TPA;

  @ApiProperty({ type: [Number], example: [1, 4] })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  ratingTypeIds!: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  projectIds?: number[];

  @ApiPropertyOptional({ enum: ["active", "inactive"], default: "active" })
  @IsOptional()
  @IsEnum(["active", "inactive"])
  status?: "active" | "inactive";

  @ApiPropertyOptional({ description: "IGBC Staff only — marks user as a lead", default: false })
  @IsOptional()
  @IsBoolean()
  isLead?: boolean;
}
