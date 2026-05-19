import { IsOptional, IsString, MinLength } from "class-validator";

export class UploadCertificationDocumentsDto {
  @IsString()
  @MinLength(1)
  tab!: string;

  @IsString()
  @MinLength(1)
  subtab!: string;

  @IsString()
  @MinLength(1)
  paramName!: string;

  @IsOptional()
  @IsString()
  replaceExisting?: string;
}
