import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApExamController } from "./ap-exam.controller";
import { ApExamRegistration } from "./ap-exam-registration.entity";
import { ApExamService } from "./ap-exam.service";

@Module({
  imports: [TypeOrmModule.forFeature([ApExamRegistration])],
  controllers: [ApExamController],
  providers: [ApExamService],
})
export class ApExamModule {}
