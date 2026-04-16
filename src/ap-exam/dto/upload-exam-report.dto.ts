import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class UploadExamReportDto {
  @ApiProperty({ example: 78, description: "Score out of 100" })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;
}
