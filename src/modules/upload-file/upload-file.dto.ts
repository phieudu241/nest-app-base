import { ApiProperty } from "@nestjs/swagger";

import { ResField } from "shared/decorators/dto.decorator";

export class UploadResponseDTO {
  @ResField()
  url: string;
}

export class UploadRequestDTO {
  @ApiProperty({ type: "string", format: "binary", required: true })
  file: Express.Multer.File;
}
