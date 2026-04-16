import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, Matches } from "class-validator";

export class UpsertMembershipContactDto {
  @ApiProperty({
    description: "Show Primary Contact Info in Membership Directory",
    example: true,
  })
  @IsBoolean()
  showInDirectory!: boolean;

  @ApiProperty({ example: "Mr" })
  @IsNotEmpty()
  salutation!: string;

  @ApiProperty({ example: "Bhushan" })
  @IsNotEmpty()
  firstName!: string;

  @ApiPropertyOptional({ example: "Robert" })
  @IsOptional()
  middleName?: string;

  @ApiProperty({ example: "Yadav" })
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ example: "Indian e-truck coalition" })
  @IsNotEmpty()
  organization!: string;

  @ApiProperty({ example: "Chairman Emeritus" })
  @IsNotEmpty()
  designation!: string;

  @ApiProperty({ example: "Coordination & Business Development" })
  @IsNotEmpty()
  department!: string;

  @ApiProperty({ example: "India" })
  @IsNotEmpty()
  country!: string;

  @ApiProperty({ example: "Telangana" })
  @IsNotEmpty()
  state!: string;

  @ApiProperty({ example: "Kalwakurthy" })
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: "21-22, PAHARPUR BUSINESS CENTRE" })
  @IsNotEmpty()
  addressLine1!: string;

  @ApiPropertyOptional({ example: "Survey No.64..." })
  @IsOptional()
  addressLine2?: string;

  @ApiProperty({ example: "110019" })
  @Matches(/^\d{6}$/, {
    message: "Pincode must be exactly 6 digits",
  })
  pincode!: string;

  @ApiProperty({ example: "9182374720" })
  @Matches(/^\d{10,15}$/, {
    message: "Mobile must be between 10 and 15 digits",
  })
  mobile!: string;

  @ApiPropertyOptional({ example: "04012345678" })
  @IsOptional()
  @Matches(/^\d{6,15}$/, {
    message: "Telephone must be between 6 and 15 digits",
  })
  telephone?: string;

  @ApiProperty({ example: "bhushany@yopmail.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "BHYPY2637M" })
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: "PAN format is invalid",
  })
  pan!: string;

  @ApiPropertyOptional({ example: "36ABCDE1234F1Z5" })
  @IsOptional()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]{3}$/, {
    message: "GST format is invalid",
  })
  gst?: string;
}
