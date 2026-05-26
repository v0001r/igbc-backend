import { Transform, Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Min,
  ValidateIf,
} from "class-validator";

export class UpsertCertificationStepThreePaymentDto {
  @ApiProperty({ example: "offline", enum: ["online", "offline"] })
  @IsIn(["online", "offline"])
  paymentMethod!: "online" | "offline";

  @ApiPropertyOptional({
    description: "Payment gateway response for online payment",
    example: {
      orderId: "order_12345",
      paymentId: "pay_12345",
      signature: "gateway-signature",
      status: "captured",
    },
  })
  @ValidateIf((dto: UpsertCertificationStepThreePaymentDto) => dto.paymentMethod === "online")
  @IsObject()
  @IsNotEmpty()
  gatewayResponse?: Record<string, unknown>;

  @ApiPropertyOptional({ example: "Demand Draft" })
  @ValidateIf((dto: UpsertCertificationStepThreePaymentDto) => dto.paymentMethod === "offline")
  @IsString()
  @IsNotEmpty()
  paymentType?: string;

  @ApiPropertyOptional({ example: "DD1234567890", description: "DD/Cheque/UTR number" })
  @ValidateIf((dto: UpsertCertificationStepThreePaymentDto) => dto.paymentMethod === "offline")
  @IsString()
  @IsNotEmpty()
  transactionReference?: string;

  @ApiPropertyOptional({ example: "HDFC0001234" })
  @ValidateIf((dto: UpsertCertificationStepThreePaymentDto) => dto.paymentMethod === "offline")
  @IsString()
  @IsNotEmpty()
  ifscCode?: string;

  @ApiPropertyOptional({ example: "HDFC Bank" })
  @ValidateIf((dto: UpsertCertificationStepThreePaymentDto) => dto.paymentMethod === "offline")
  @IsString()
  @IsNotEmpty()
  bankName?: string;

  @ApiPropertyOptional({ example: "Gachibowli Branch" })
  @ValidateIf((dto: UpsertCertificationStepThreePaymentDto) => dto.paymentMethod === "offline")
  @IsString()
  @IsNotEmpty()
  branch?: string;

  @ApiPropertyOptional({ example: 30000 })
  @ValidateIf((dto: UpsertCertificationStepThreePaymentDto) => dto.paymentMethod === "offline")
  @Transform(({ value }) =>
    value === undefined || value === null || value === "" ? undefined : Number(value),
  )
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ example: "2026-04-28", description: "Supports yyyy-mm-dd or dd/mm/yyyy" })
  @ValidateIf((dto: UpsertCertificationStepThreePaymentDto) => dto.paymentMethod === "offline")
  @Matches(/^(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})$/, {
    message: "paymentDate must be in yyyy-mm-dd or dd/mm/yyyy format",
  })
  paymentDate?: string;

  @ApiPropertyOptional({ example: "Submitted at branch counter" })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ example: 30000 })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null || value === "" ? undefined : Number(value),
  )
  @IsNumber()
  @Min(0)
  paymentAmount?: number;

  @ApiPropertyOptional({ example: "Submitted at branch counter" })
  @IsOptional()
  @IsString()
  paymentRemarks?: string;
}
