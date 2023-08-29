import { Module } from "@nestjs/common";
import { MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { MulterModule } from "@nestjs/platform-express";

import { UserModule } from "modules/user/user.module";
import { AuthModule } from "modules/auth/auth.module";
import { PrismaModule } from "services/prisma/prisma.module";
import { GLOBAL_CONFIG } from "configs/global.config";
import { LoggerModule } from "services/logger/logger.module";
import { LoggerMiddleware } from "middlewares/logger.middleware";
import { AppService } from "modules/app/app.service";
import { AppController } from "modules/app/app.controller";
import { ErrorReportModule } from "modules/error-report/error-report.module";
import { JwtAuthGuard } from "modules/auth/auth.jwt.guard";
import { UploadFileModule } from "modules/upload-file/upload-file.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => GLOBAL_CONFIG] }),
    MulterModule.register({
      dest: "uploads/",
    }),
    LoggerModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ErrorReportModule,
    UploadFileModule,
    ConfigModule.forRoot({ isGlobal: true, load: [() => GLOBAL_CONFIG] }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
