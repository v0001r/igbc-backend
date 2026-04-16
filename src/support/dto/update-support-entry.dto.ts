import { PartialType } from "@nestjs/swagger";
import { CreateSupportEntryDto } from "./create-support-entry.dto";

export class UpdateSupportEntryDto extends PartialType(CreateSupportEntryDto) {}
