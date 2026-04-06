import { IsEmail, IsIn, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({ example: "Mr." })
  @IsString()
  salutation!: string;

  @ApiProperty({ example: "John" })
  @IsString()
  firstName!: string;

  @ApiPropertyOptional({ example: "K" })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: "John Doe" })
  @IsString()
  displayName!: string;

  @ApiProperty({ example: "john@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Tamil Nadu" })
  @IsString()
  state!: string;

  @ApiPropertyOptional({ example: "9999999999" })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiPropertyOptional({ example: "0441234567" })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiProperty({ example: "Strong@123" })
  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: "Password must include an uppercase letter" })
  @Matches(/[a-z]/, { message: "Password must include a lowercase letter" })
  @Matches(/\d/, { message: "Password must include a number" })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must include a special character" })
  password!: string;

  @ApiPropertyOptional({
    enum: ["m", "s", "a", "T"],
    example: "m",
    description: "m=client, s=staff, a=admin, T=TPA",
  })
  @IsOptional()
  @IsIn(["m", "s", "a", "T"], {
    message: "userType must be one of m, s, a, T",
  })
  userType?: "m" | "s" | "a" | "T";
}
