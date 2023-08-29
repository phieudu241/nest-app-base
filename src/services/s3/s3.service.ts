import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { HttpStatus, Injectable, UnprocessableEntityException } from "@nestjs/common";

import { GLOBAL_CONFIG } from "configs/global.config";
import { MESSAGES } from "shared/constants/messages.constants";

@Injectable()
export class S3Service {
  private s3: S3Client;
  constructor() {
    this.s3 = new S3Client({
      region: GLOBAL_CONFIG.aws.region,
      credentials: {
        accessKeyId: GLOBAL_CONFIG.aws.aws_access_key_id,
        secretAccessKey: GLOBAL_CONFIG.aws.aws_secret_access_key,
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const fileNameParts = file.originalname.split(".");
    const fileExtension = fileNameParts.length > 1 ? fileNameParts[fileNameParts.length - 1] : null;
    const s3FileName = `${new Date().getTime()}` + (fileExtension ? `.${fileExtension}` : "");

    const command = new PutObjectCommand({
      Bucket: GLOBAL_CONFIG.aws.s3.bucket,
      Key: s3FileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    });

    return this.sendCommand(command);
  }

  async sendCommand(command: PutObjectCommand) {
    const response = await this.s3.send(command);

    let location: string;
    if (response.$metadata.httpStatusCode === HttpStatus.OK) {
      location = this.getFileLocation(command.input.Key);
    } else {
      throw new UnprocessableEntityException(MESSAGES.CAN_NOT_UPLOAD_FILE);
    }

    return {
      location,
      key: command.input.Key
    };
  }

  private getFileLocation(key: string) {
    return `https://${GLOBAL_CONFIG.aws.s3.bucket}.s3.${GLOBAL_CONFIG.aws.region}.amazonaws.com/${key}`;
  }
}
