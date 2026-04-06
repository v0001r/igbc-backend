import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "./client.entity";
import { Organization } from "./organization.entity";
import { ProfileController } from "./profile.controller";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Client, Organization])],
  controllers: [ProfileController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
