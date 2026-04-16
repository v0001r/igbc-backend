import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { SupportController } from "./support.controller";
import { SupportEntry } from "./support.entity";
import { SupportPublicController } from "./support-public.controller";
import { SupportService } from "./support.service";

@Module({
  imports: [TypeOrmModule.forFeature([SupportEntry]), UsersModule],
  controllers: [SupportController, SupportPublicController],
  providers: [SupportService],
})
export class SupportModule {}
