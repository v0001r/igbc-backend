import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RatingType } from "./rating-type.entity";
import { RatingTypeService } from "./rating-type.service";
import { RatingTypesController } from "./rating-types.controller";

@Module({
  imports: [TypeOrmModule.forFeature([RatingType])],
  controllers: [RatingTypesController],
  providers: [RatingTypeService],
  exports: [RatingTypeService, TypeOrmModule],
})
export class RatingTypesModule {}
