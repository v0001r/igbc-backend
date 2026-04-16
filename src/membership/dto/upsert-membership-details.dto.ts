import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsUUID, Min } from "class-validator";

export class UpsertMembershipDetailsDto {
  @ApiProperty({
    example: "93f43ca7-f24b-4bc9-a4f5-a6cc89567f16",
    description: "users.id (required while creating membership application in step 1)",
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    example: 3,
    description:
      "membership_types.id. Example: 3 for Individual Membership, 1 for Founding Membership, 2 for Annual Membership",
  })
  @IsInt()
  membershipTypeId!: number;

  @ApiProperty({ example: 4, description: "membership_categories.id" })
  @IsInt()
  membershipCategoryId!: number;

  @ApiPropertyOptional({
    example: 1,
    description:
      "membership_plans.id. Required only when selected type is Individual Membership; omit for Founding/Annual.",
  })
  @IsOptional()
  @IsInt()
  membershipPlanId?: number;

  @ApiPropertyOptional({
    description: "Optional override for admin/config use. If provided, must match plan mapping.",
    example: 1770,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  membershipFee?: number;
}
