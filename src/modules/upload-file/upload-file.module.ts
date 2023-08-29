import { Module } from "@nestjs/common";

import { UploadFileController } from "modules/upload-file/upload-file.controller";
import { UploadFileService } from "modules/upload-file/upload-file.service";
import { S3Module } from "services/s3/s3.module";

@Module({
  imports: [S3Module],
  controllers: [UploadFileController],
  providers: [UploadFileService],
  exports: [UploadFileService],
})
export class UploadFileModule {}
