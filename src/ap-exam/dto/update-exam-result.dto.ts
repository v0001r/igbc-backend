import { ApiProperty } from "@nestjs/swagger";
import { IsIn } from "class-validator";

export class UpdateExamResultDto {
  @ApiProperty({ enum: ["pass", "fail"] })
  @IsIn(["pass", "fail"])
  result!: "pass" | "fail";
}
