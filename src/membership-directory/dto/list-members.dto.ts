import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";

export class ListMembersDto {
  @ApiPropertyOptional({ example: "alpha" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: "Architects" })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: ["All", "Founding Membership", "Annual Membership", "Individual Membership"] })
  @IsOptional()
  @IsIn(["All", "Founding Membership", "Annual Membership", "Individual Membership"])
  membershipType?: "All" | "Founding Membership" | "Annual Membership" | "Individual Membership";

  @ApiPropertyOptional({ example: "A" })
  @IsOptional()
  @IsString()
  startsWith?: string;
}
