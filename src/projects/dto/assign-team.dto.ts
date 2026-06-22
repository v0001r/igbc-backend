import { IsInt, IsNumber, IsUUID, Min } from "class-validator";

export class AssignTeamDto {
  @IsUUID()
  staffId!: string;

  @IsUUID()
  tpaId!: string;

  @IsNumber()
  @Min(0)
  fee!: number;

  @IsInt()
  @Min(0)
  count!: number;
}
