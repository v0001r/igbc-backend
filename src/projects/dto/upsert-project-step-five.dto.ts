import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from "class-validator";

export class UpsertProjectStepFiveDto {
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
  @ValidateIf((dto: UpsertProjectStepFiveDto) => dto.paymentMethod === "online")
  @IsObject()
  @IsNotEmpty()
  gatewayResponse?: Record<string, unknown>;

  @ApiPropertyOptional({ example: "Demand Draft" })
  @ValidateIf((dto: UpsertProjectStepFiveDto) => dto.paymentMethod === "offline")
  @IsString()
  @IsNotEmpty()
  paymentType?: string;

  @ApiPropertyOptional({ example: "DD1234567890", description: "DD/Cheque/UTR number" })
  @ValidateIf((dto: UpsertProjectStepFiveDto) => dto.paymentMethod === "offline")
  @IsString()
  @IsNotEmpty()
  transactionReference?: string;

  @ApiPropertyOptional({ example: "HDFC0001234" })
  @ValidateIf((dto: UpsertProjectStepFiveDto) => dto.paymentMethod === "offline")
  @IsString()
  @IsNotEmpty()
  ifscCode?: string;

  @ApiPropertyOptional({ example: "HDFC Bank" })
  @ValidateIf((dto: UpsertProjectStepFiveDto) => dto.paymentMethod === "offline")
  @IsString()
  @IsNotEmpty()
  bankName?: string;

  @ApiPropertyOptional({ example: "Gachibowli Branch" })
  @ValidateIf((dto: UpsertProjectStepFiveDto) => dto.paymentMethod === "offline")
  @IsString()
  @IsNotEmpty()
  branch?: string;

  @ApiPropertyOptional({ example: 30000 })
  @ValidateIf((dto: UpsertProjectStepFiveDto) => dto.paymentMethod === "offline")
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({ example: "2026-04-28" })
  @ValidateIf((dto: UpsertProjectStepFiveDto) => dto.paymentMethod === "offline")
  @IsDateString()
  paymentDate?: string;

  @ApiPropertyOptional({ example: "Submitted at branch counter" })
  @IsOptional()
  @IsString()
  remarks?: string;
}
