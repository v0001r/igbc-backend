import { IsInt, IsOptional, IsString, MinLength } from "class-validator";

export class CreateProjectDto {
  @IsInt()
  ratingTypeId!: number;

  @IsString()
  @MinLength(1)
  projectName!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  constructionType?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  ownerName?: string;

  @IsOptional()
  @IsString()
  ownerMobile?: string;

  @IsOptional()
  @IsString()
  ownerEmail?: string;

  @IsOptional()
  @IsString()
  ownerOrg?: string;

  @IsOptional()
  @IsString()
  paymentMode?: string;

  /** Must be one of rating type's `version_type` values; defaults to latest */
  @IsOptional()
  @IsString()
  versionType?: string;
}
