import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { CertificationFieldDto } from "./certification-field.dto";

export class SaveCertificationSectionDto {
  @IsString()
  @MinLength(1)
  tab!: string;

  @IsString()
  @MinLength(1)
  subtab!: string;

  @IsOptional()
  @IsString()
  currentTab?: string;

  @IsOptional()
  @IsString()
  currentSubtab?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationFieldDto)
  fields!: CertificationFieldDto[];
}
