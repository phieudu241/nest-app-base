import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

import { Logger } from "services/logger/logger.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {
  }
  use(req: Request, res: Response, next: CallableFunction): void {
    this.logger.info(
      `[API Request] ${req.method} ${req.originalUrl}: ${JSON.stringify(
        req.body,
      )}`,
    );
    next();
  }
}
