import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MinLength } from "class-validator";
import { PASSWORD_MIN_LENGTH } from "./password-rules";

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword!: string;

  @ApiProperty()
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  @Matches(/[A-Z]/, { message: "Password must include an uppercase letter" })
  @Matches(/[a-z]/, { message: "Password must include a lowercase letter" })
  @Matches(/\d/, { message: "Password must include a number" })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must include a special character" })
  newPassword!: string;
}
