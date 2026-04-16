import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateIf,
} from "class-validator";

export class UpdateMembershipPaymentDto {
  @ApiProperty({ enum: ["online", "offline"], description: "Use online for gateway payment, offline for DD/Cheque/UTR submission." })
  @IsIn(["online", "offline"])
  paymentMode!: "online" | "offline";

  @ApiPropertyOptional({ enum: ["razorpay", "stripe"] })
  @ValidateIf((o: UpdateMembershipPaymentDto) => o.paymentMode === "online")
  @IsIn(["razorpay", "stripe"])
  gateway?: "razorpay" | "stripe";

  @ApiProperty({ enum: ["success", "failure"] })
  @IsIn(["success", "failure"])
  status!: "success" | "failure";

  @ApiPropertyOptional({ example: "txn_123456" })
  @ValidateIf((o: UpdateMembershipPaymentDto) => o.paymentMode === "online")
  @IsNotEmpty()
  transactionId?: string;

  @ApiPropertyOptional({ example: "card" })
  @ValidateIf((o: UpdateMembershipPaymentDto) => o.paymentMode === "online")
  @IsNotEmpty()
  paymentMethod?: string;

  @ApiPropertyOptional({ example: "UTR123456789", description: "DD / Cheque / UTR Number" })
  @ValidateIf((o: UpdateMembershipPaymentDto) => o.paymentMode === "offline")
  @IsNotEmpty()
  ddChequeUtrNumber?: string;

  @ApiPropertyOptional({ example: "HDFC0001234", description: "IFSC Code" })
  @ValidateIf((o: UpdateMembershipPaymentDto) => o.paymentMode === "offline")
  @IsNotEmpty()
  ifscCode?: string;

  @ApiPropertyOptional({ example: "HDFC Bank", description: "Bank Name" })
  @ValidateIf((o: UpdateMembershipPaymentDto) => o.paymentMode === "offline")
  @IsNotEmpty()
  bankName?: string;

  @ApiPropertyOptional({ example: "Banjara Hills", description: "Branch" })
  @ValidateIf((o: UpdateMembershipPaymentDto) => o.paymentMode === "offline")
  @IsNotEmpty()
  branch?: string;

  @ApiPropertyOptional({ example: 11800, description: "Amount in INR" })
  @ValidateIf((o: UpdateMembershipPaymentDto) => o.paymentMode === "offline")
  @Type(() => Number)
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({ example: "2026-08-12", description: "Payment date in YYYY-MM-DD" })
  @ValidateIf((o: UpdateMembershipPaymentDto) => o.paymentMode === "offline")
  @IsDateString()
  paymentDate?: string;

  @ApiPropertyOptional({ example: "Paid via NEFT", description: "Remarks" })
  @IsOptional()
  remarks?: string;
}
