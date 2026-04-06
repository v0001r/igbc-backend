import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: "Mr." })
  @IsOptional()
  @IsString()
  salutation?: string;

  @ApiPropertyOptional({ example: "John" })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: "K" })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiPropertyOptional({ example: "Doe" })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: "John Doe" })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ example: "Tamil Nadu" })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: "India" })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: "9999999999" })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiPropertyOptional({ example: "0441234567" })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({ example: "Hyderabad" })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: "500081" })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiPropertyOptional({ example: "Flat no - 101, ABC Apartment" })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiPropertyOptional({ example: "Madhapur" })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiPropertyOptional({ example: "IGBC Org" })
  @IsOptional()
  @IsString()
  organizationName?: string;

  @ApiPropertyOptional({ example: "Senior Architect" })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional({ example: "Design" })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: "10" })
  @IsOptional()
  @IsString()
  yearsOfExperience?: string;

  @ApiPropertyOptional({ example: "EMP-1001" })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({ example: "Architecture Firm" })
  @IsOptional()
  @IsString()
  organizationType?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  prefEmailNotifications?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  prefSmsAlerts?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  prefNewsletter?: boolean;

  @ApiPropertyOptional({ example: "English" })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  prefShowProfilePublicly?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  prefShowEmailToMembers?: boolean;
}
