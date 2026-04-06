import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";

export class PaymentUpdateDto {
  @ApiProperty({ enum: ["success", "failure"] })
  @IsIn(["success", "failure"])
  status!: "success" | "failure";

  @ApiPropertyOptional({ example: "txn_igbc_12345" })
  @IsOptional()
  @IsString()
  transactionId?: string;
}
