import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsIn, IsOptional, IsString, IsUrl } from "class-validator";

export class UpsertMemberDto {
  @ApiPropertyOptional({ example: "AR" })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ example: "Arcline Architects" })
  @IsString()
  name!: string;

  @ApiProperty({ enum: ["Founding Membership", "Annual Membership", "Individual Membership"] })
  @IsIn(["Founding Membership", "Annual Membership", "Individual Membership"])
  membershipType!: "Founding Membership" | "Annual Membership" | "Individual Membership";

  @ApiProperty({ example: "https://arcline.example.com" })
  @IsUrl({ require_tld: false }, { message: "Website must be a valid URL" })
  website!: string;

  @ApiProperty({ example: "Architects" })
  @IsString()
  category!: string;

  @ApiProperty({ example: "hello@arcline.example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "+91 40 4000 1001" })
  @IsString()
  phone!: string;
}
