import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RejectCertificationApplicationDto {
  @ApiProperty({ example: "Payment details incomplete" })
  @IsString()
  @IsNotEmpty()
  remark!: string;
}
