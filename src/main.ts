import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import cors from "cors";
import { useContainer } from "class-validator";

import { SwaggerConfig } from "configs/config.interface";
import { GLOBAL_CONFIG } from "configs/global.config";
import { AllExceptionsFilter } from "filters/all.exceptions.filter";
import { InvalidFormExceptionFilter } from "filters/invalid.form.exception.filter";
import { AppModule } from "modules/app/app.module";
import { Logger } from "services/logger/logger.service";
import { API_PREFIX } from "shared/constants/global.constants";
import { isDev } from "shared/helpers/env.helpers";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "error", "warn"],
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)), new InvalidFormExceptionFilter());

  app.use(
    cors({
      origin: isDev() ? [GLOBAL_CONFIG.external.frontend_url, "http://localhost:3000"]
        : GLOBAL_CONFIG.external.frontend_url,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const configService = app.get<ConfigService>(ConfigService);
  const swaggerConfig = configService.get<SwaggerConfig>("swagger");

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || "Nestjs")
      .setDescription(swaggerConfig.description || "The nestjs API description")
      .setVersion(swaggerConfig.version || "1.0")
      .addBearerAuth()
      .addSecurityRequirements("bearer")
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || "api", app, document);
  }

  const PORT = process.env.PORT || GLOBAL_CONFIG.nest.port;
  await app.listen(PORT, async () => {
    const myLogger = await app.resolve(Logger);
    myLogger.log(`Server started listening: ${PORT}`);
  });
}

bootstrap();
