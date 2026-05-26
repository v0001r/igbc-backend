import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from "class-validator";

export class UpsertCertificationStepTwoDto {
  @ApiProperty({ example: "ABC Constructions Pvt Ltd" })
  @IsString()
  @IsNotEmpty()
  organizationName!: string;

  @ApiProperty({ example: "Plot 12, Financial District" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @ApiPropertyOptional({ example: "Plot 12, Financial District" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organizationAddress?: string;

  @ApiProperty({ example: "Hyderabad" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiPropertyOptional({ example: "Hyderabad" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organizationCity?: string;

  @ApiProperty({ example: "Telangana" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  state?: string;

  @ApiPropertyOptional({ example: "Telangana" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organizationState?: string;

  @ApiProperty({ example: "500081" })
  @IsOptional()
  @Matches(/^\d{6}$/, { message: "pinCode must be a 6 digit number" })
  pinCode?: string;

  @ApiPropertyOptional({ example: "500081" })
  @IsOptional()
  @Matches(/^\d{6}$/, { message: "organizationPinCode must be a 6 digit number" })
  organizationPinCode?: string;

  @ApiProperty({ example: "AAAAA1234A" })
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, { message: "panNumber must be a valid PAN" })
  panNumber!: string;

  @ApiProperty({ example: true })
  @Type(() => Boolean)
  @IsBoolean()
  hasGstNumber!: boolean;

  @ApiPropertyOptional({ example: "36ABCDE1234F1Z5" })
  @ValidateIf((dto: UpsertCertificationStepTwoDto) => dto.hasGstNumber)
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: "gstNumber must be a valid GSTIN",
  })
  gstNumber?: string;

  @ApiProperty({ example: false, description: "If true, GST is not applied" })
  @Type(() => Boolean)
  @IsBoolean()
  sezSelected!: boolean;

  @ApiProperty({ example: true, description: "If true, 10% TDS is deducted" })
  @Type(() => Boolean)
  @IsBoolean()
  tdsSelected!: boolean;

  @ApiPropertyOptional({ example: "SUMMER50" })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({
    example: {
      notes: "Step-2 invoice details for certification application",
    },
  })
  @IsOptional()
  @IsObject()
  additionalData?: Record<string, unknown>;
}
