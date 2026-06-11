import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class AssignTpaDto {
  @ApiProperty()
  @IsUUID()
  tpaId!: string;
}
