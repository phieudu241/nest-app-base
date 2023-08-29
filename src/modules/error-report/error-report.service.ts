import { Injectable } from "@nestjs/common";

import { Logger } from "services/logger/logger.service";
import { AppError } from "shared/types/entity.type";

@Injectable()
export class ErrorReportService {
  constructor(private logger: Logger) {
  }

  async report(error: AppError): Promise<void> {
    return this.logger.error(error.message, error.stack);
  }
}
