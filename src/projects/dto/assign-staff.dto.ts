import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class AssignStaffDto {
  @ApiProperty()
  @IsUUID()
  staffId!: string;
}
