import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { ApExamController } from "./ap-exam.controller";
import { ApExamRegistration } from "./ap-exam-registration.entity";
import { ApExamService } from "./ap-exam.service";
import { ApExamStorageService } from "./ap-exam-storage.service";

@Module({
  imports: [TypeOrmModule.forFeature([ApExamRegistration]), UsersModule],
  controllers: [ApExamController],
  providers: [ApExamService, ApExamStorageService],
})
export class ApExamModule {}
