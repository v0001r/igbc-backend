import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class SaveCreditReviewDto {
  @IsOptional()
  @IsNumber()
  awardedPoints?: number;

  @IsOptional()
  @IsNumber()
  pendingPoints?: number;

  @IsOptional()
  @IsNumber()
  deniedPoints?: number;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  technicalAdvice?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  reviewRemarks?: string;
}

export class ReleaseReportDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;
}

export class AcceptRejectReportDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remark?: string;
}

export class InitiateReappealDto {
  @IsString({ each: true })
  tabs!: string[];

  @IsOptional()
  @IsNumber()
  feeAmount?: number;
}

export class CertificateRejectDto {
  @IsString()
  @MaxLength(2000)
  remarks!: string;
}

export class CertificateEditDto {
  @IsString()
  @MaxLength(500)
  projectName!: string;

  @IsString()
  @MaxLength(2000)
  address!: string;
}

export class CertificateAcceptDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remark?: string;
}
