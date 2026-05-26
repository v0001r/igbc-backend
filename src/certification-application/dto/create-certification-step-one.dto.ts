import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsIn, IsInt, IsNumber, IsOptional, Min } from "class-validator";

export class CreateCertificationStepOneDto {
  @ApiProperty({ example: 101, description: "Approved project id" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectId!: number;

  @ApiPropertyOptional({ example: true, description: "Whether applicant is IGBC member" })
  @IsOptional()
  @IsBoolean()
  isMember?: boolean;

  @ApiPropertyOptional({ example: 1, description: "1: founding, 2: annual" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2])
  memberType?: 1 | 2;

  @ApiPropertyOptional({ example: 1, description: "1: pre-certification, 2: final certification" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([1, 2])
  certificateType?: 1 | 2;

  @ApiPropertyOptional({ example: 1, description: "Certification type selection for application" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  certificationType?: number;

  @ApiPropertyOptional({ example: false, description: "Whether expedited review is requested" })
  @IsOptional()
  @IsBoolean()
  expediteReview?: boolean;

  @ApiPropertyOptional({ example: 15000, description: "Primary area input as per rating system" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  area?: number;

  @ApiPropertyOptional({ example: [12000, 8000], description: "Additional block areas" })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  additional?: number[];

  @ApiPropertyOptional({ example: 2, description: "Subtype selector as used in PHP fee logic" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  subtype?: number;

  @ApiPropertyOptional({ example: 1, description: "Dwelling type for Green Homes logic" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  dwelling?: number;

  @ApiPropertyOptional({ example: 420, description: "Number of units where required" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  units?: number;

  @ApiPropertyOptional({ example: 8, description: "Data center load where required" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  load?: number;

  @ApiPropertyOptional({ example: 180, description: "Number of keys for hotels where required" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  keys?: number;
}
