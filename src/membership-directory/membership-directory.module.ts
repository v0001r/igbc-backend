import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MembershipDirectoryController } from "./membership-directory.controller";
import { MembershipDirectoryMember } from "./membership-directory.entity";
import { MembershipDirectoryService } from "./membership-directory.service";

@Module({
  imports: [TypeOrmModule.forFeature([MembershipDirectoryMember])],
  controllers: [MembershipDirectoryController],
  providers: [MembershipDirectoryService],
})
export class MembershipDirectoryModule {}
