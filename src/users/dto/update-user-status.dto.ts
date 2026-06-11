import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class UpdateUserStatusDto {
  @ApiProperty({ enum: ["active", "inactive"] })
  @IsEnum(["active", "inactive"])
  status!: "active" | "inactive";
}
