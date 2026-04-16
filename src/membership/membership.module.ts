import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { MembershipCategoryMaster } from "./membership-category.entity";
import { MembershipController } from "./membership.controller";
import { MembershipApplication } from "./membership-application.entity";
import { MembershipPlanMaster } from "./membership-plan.entity";
import { MembershipService } from "./membership.service";
import { MembershipTypeMaster } from "./membership-type.entity";

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      MembershipApplication,
      MembershipTypeMaster,
      MembershipCategoryMaster,
      MembershipPlanMaster,
    ]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
