import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { ErrorReportService } from "modules/error-report/error-report.service";
import { Role } from "shared/constants/global.constants";
import { HasRoles } from "modules/auth/auth.has-roles.decorator";
import { AppError } from "shared/types/entity.type";

@ApiTags("error-report")
@Controller("/error-report")
export class ErrorReportController {
  constructor(private reportService: ErrorReportService) {
  }

  @Post("")
  @HasRoles(Role.PUBLIC)
  async report(
    @Body() error: AppError,
  ): Promise<void> {
    console.log("error:", error);
    return this.reportService.report(error);
  }
}
