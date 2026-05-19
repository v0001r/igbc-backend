import { IsOptional, IsString, MinLength } from "class-validator";

export class CertificationFieldDto {
  @IsString()
  @MinLength(1)
  paramName!: string;

  @IsString()
  @MinLength(1)
  type!: string;

  @IsOptional()
  @IsString()
  value?: string;
}
