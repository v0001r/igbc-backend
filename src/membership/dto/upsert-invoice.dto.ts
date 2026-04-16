import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, Matches } from "class-validator";

export class UpsertInvoiceDto {
  @ApiProperty({ example: "Indian e-truck coalition" })
  @IsNotEmpty()
  organization!: string;

  @ApiProperty({ example: "India" })
  @IsNotEmpty()
  country!: string;

  @ApiProperty({ example: "Telangana" })
  @IsNotEmpty()
  state!: string;

  @ApiProperty({ example: "Amudalavalasa" })
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: "21-22..." })
  @IsNotEmpty()
  addressLine1!: string;

  @ApiPropertyOptional({ example: "Near business park" })
  @IsOptional()
  addressLine2?: string;

  @ApiProperty({ example: "110019" })
  @Matches(/^\d{6}$/, {
    message: "Pincode must be exactly 6 digits",
  })
  pincode!: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isSez!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  advanceTaxInvoice!: boolean;
}
