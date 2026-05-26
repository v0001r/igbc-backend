import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RejectProjectDto {
  @ApiProperty({ example: "Insufficient mandatory documents submitted." })
  @IsString()
  @IsNotEmpty()
  remark!: string;
}
