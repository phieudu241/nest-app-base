import { Module } from "@nestjs/common";

import { PrismaService } from "services/prisma/prisma.service";
import { PrismaModule } from "services/prisma/prisma.module";
import { UserService } from "modules/user/user.service";
import { UserController } from "modules/user/user.controller";
import { UserListener } from "modules/user/user.listener";

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, UserListener],
  exports: [UserService],
})
export class UserModule {}
