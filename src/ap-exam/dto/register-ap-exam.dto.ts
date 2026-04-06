import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Matches,
  Min,
  ValidateNested,
} from "class-validator";

class PersonalInformationDto {
  @ApiProperty({ example: "Vicky" })
  @IsNotEmpty()
  @Matches(/^[A-Za-z]+$/, {
    message: "First name must contain only alphabets",
  })
  firstName!: string;

  @ApiProperty({ example: "Rao" })
  @IsNotEmpty()
  @Matches(/^[A-Za-z]+$/, {
    message: "Last name must contain only alphabets",
  })
  lastName!: string;

  @ApiProperty({ example: "vicky@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "9876543210" })
  @Matches(/^\d{10}$/, {
    message: "Mobile number must be exactly 10 digits",
  })
  mobileNumber!: string;
}

class AddressDetailsDto {
  @ApiProperty({ example: "Flat 101, Green Residency" })
  @IsNotEmpty()
  addressLine1!: string;

  @ApiPropertyOptional({ example: "Near central park" })
  @IsOptional()
  addressLine2?: string;

  @ApiProperty({ example: "Hyderabad" })
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: "Telangana" })
  @IsNotEmpty()
  state!: string;

  @ApiProperty({ example: "500081" })
  @Matches(/^\d{6}$/, {
    message: "Pincode must be exactly 6 digits",
  })
  pincode!: string;
}

class EducationalDetailsDto {
  @ApiProperty({ example: "B.Tech" })
  @IsNotEmpty()
  highestQualification!: string;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  yearsOfExperience!: number;
}

class OrganizationDetailsDto {
  @ApiPropertyOptional({ example: "IGBC Pvt Ltd" })
  @IsOptional()
  organizationName?: string;

  @ApiPropertyOptional({ example: "Architect" })
  @IsOptional()
  designation?: string;
}

class ExamSlotSelectionDto {
  @ApiProperty({
    example: "2026-05-02",
    description: "Must be 1st or 3rd Saturday of month",
  })
  @IsNotEmpty()
  examDate!: string;
}

export class RegisterApExamDto {
  @ApiProperty({ type: PersonalInformationDto })
  @ValidateNested()
  @Type(() => PersonalInformationDto)
  personalInformation!: PersonalInformationDto;

  @ApiProperty({ type: AddressDetailsDto })
  @ValidateNested()
  @Type(() => AddressDetailsDto)
  addressDetails!: AddressDetailsDto;

  @ApiProperty({ type: EducationalDetailsDto })
  @ValidateNested()
  @Type(() => EducationalDetailsDto)
  educationalDetails!: EducationalDetailsDto;

  @ApiPropertyOptional({ type: OrganizationDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrganizationDetailsDto)
  organizationDetails?: OrganizationDetailsDto;

  @ApiProperty({ type: ExamSlotSelectionDto })
  @ValidateNested()
  @Type(() => ExamSlotSelectionDto)
  examSlotSelection!: ExamSlotSelectionDto;
}
