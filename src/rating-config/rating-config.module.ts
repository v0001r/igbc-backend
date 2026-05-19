import { Module } from "@nestjs/common";
import { FieldRulesService } from "./field-rules/field-rules.service";
import { RatingConfigService } from "./rating-config.service";

@Module({
  providers: [RatingConfigService, FieldRulesService],
  exports: [RatingConfigService, FieldRulesService],
})
export class RatingConfigModule {}
