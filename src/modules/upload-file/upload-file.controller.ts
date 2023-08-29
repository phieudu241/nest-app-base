import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { HasRoles } from "modules/auth/auth.has-roles.decorator";
import { UploadRequestDTO, UploadResponseDTO } from "modules/upload-file/upload-file.dto";
import { UploadFileService } from "modules/upload-file/upload-file.service";
import { Role } from "shared/constants/global.constants";

@ApiTags("Upload file")
@Controller("/upload")
export class UploadFileController {
  constructor(private uploadFileService: UploadFileService) {}

  @Post("/image")
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("file"))
  @HasRoles(Role.USER)
  @ApiOkResponse({ type: UploadResponseDTO })
  async uploadGarbageImage(@Body() body: UploadRequestDTO, @UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadFileService.uploadImage(file);
    return { url };
  }
}
