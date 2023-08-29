import { Injectable } from "@nestjs/common";

import { S3Service } from "services/s3/s3.service";
import { MAX_IMAGE_SIZE } from "shared/constants/global.constants";
import { checkFileSize, checkImageType } from "shared/helpers/file.helpers";

@Injectable()
export class UploadFileService {
  constructor(private s3Service: S3Service) {}

  async uploadImage(file: Express.Multer.File) {
    checkImageType(file);
    checkFileSize(file, MAX_IMAGE_SIZE);

    const res = await this.s3Service.uploadFile(file);
    return res.location;
  }
}
