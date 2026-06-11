import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsEnum, IsUUID } from "class-validator";

export class BulkStatusDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("4", { each: true })
  userIds!: string[];

  @ApiProperty({ enum: ["active", "inactive"] })
  @IsEnum(["active", "inactive"])
  status!: "active" | "inactive";
}
