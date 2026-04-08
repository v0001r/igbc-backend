import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsString, Matches } from "class-validator";

export class RescheduleExamDto {
  @ApiProperty({ enum: ["prepone", "postpone"] })
  @IsIn(["prepone", "postpone"])
  mode!: "prepone" | "postpone";

  @ApiProperty({ example: "2026-07-18" })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "newExamDate must be in YYYY-MM-DD format",
  })
  newExamDate!: string;
}
