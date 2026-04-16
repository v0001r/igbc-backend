import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { Event } from "./event.entity";
import { EventsController } from "./events.controller";
import { EventsPublicController } from "./events-public.controller";
import { EventsService } from "./events.service";
import { EventsStorageService } from "./events-storage.service";

@Module({
  imports: [TypeOrmModule.forFeature([Event]), UsersModule],
  controllers: [EventsController, EventsPublicController],
  providers: [EventsService, EventsStorageService],
})
export class EventsModule {}
