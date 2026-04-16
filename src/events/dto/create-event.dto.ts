import { Type } from "class-transformer";
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";

export class CreateEventDto {
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  description?: string;

  @IsDateString()
  startDateTime!: string;

  @IsDateString()
  endDateTime!: string;

  @IsNotEmpty()
  location!: string;

  @IsOptional()
  organizerName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  ticketPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxAttendees?: number;

  @IsOptional()
  @IsIn(["active", "draft", "inactive"])
  status?: "active" | "draft" | "inactive";
}
