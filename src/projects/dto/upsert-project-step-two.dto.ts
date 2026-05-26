import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from "class-validator";

export class UpsertProjectStepTwoDto {
  @ApiProperty({ example: "My Green Tower" })
  @IsString()
  @IsNotEmpty()
  projectName!: string;

  @ApiProperty({ example: "Plot 12, Financial District" })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({ example: "Hyderabad" })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: "Telangana" })
  @IsString()
  @IsNotEmpty()
  state!: string;

  @ApiProperty({ example: "500081" })
  @Matches(/^\d{6}$/, { message: "pincode must be a 6 digit number" })
  pincode!: string;

  @ApiProperty({ example: 12500.5 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  siteAreaSqm!: number;

  @ApiProperty({ example: 134550.7 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  siteAreaSqft!: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  numberOfBuildings!: number;

  @ApiProperty({ example: 250000.2 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalBuiltUpAreaSqft!: number;

  @ApiProperty({ example: 23225.8 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalBuiltUpAreaSqm!: number;

  @ApiPropertyOptional({ example: "2026-05-20" })
  @IsOptional()
  @IsDateString()
  constructionStartDate?: string;

  @ApiPropertyOptional({ example: "2027-12-20" })
  @IsOptional()
  @IsDateString()
  targetCertificationDate?: string;
}
