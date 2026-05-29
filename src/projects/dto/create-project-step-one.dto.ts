import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateProjectStepOneDto {
  @ApiPropertyOptional({
    example: 101,
    description: "Existing project id for updating step-1 during resume flow",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectId?: number;

  @ApiPropertyOptional({
    example: "P00101",
    description: "Existing temporary project id for updating step-1 during resume flow",
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  temporaryProjectId?: string;

  @ApiProperty({ example: 2, description: "Project category id" })
  @IsInt()
  @Min(1)
  category!: number;

  @ApiProperty({ example: "IGBC Green New Buildings" })
  @IsString()
  @IsNotEmpty()
  ratingSystem!: string;

  @ApiPropertyOptional({ example: 2, description: "rating_type.id from database" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  ratingTypeId?: number;

  @ApiPropertyOptional({ example: "Owner Occupied", description: "Specific/sub rating type" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subRatingType?: string;

  @ApiProperty({ example: "Offices" })
  @IsString()
  @IsNotEmpty()
  projectType!: string;

  @ApiProperty({ example: "New / Upcoming" })
  @IsString()
  @IsNotEmpty()
  constructionType!: string;
}
