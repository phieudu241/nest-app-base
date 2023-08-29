import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Transform } from "class-transformer";
import { Matches } from "class-validator";

import { NAME_REGEX, PASSWORD_REGEX } from "shared/constants/global.constants";
import { MESSAGES } from "shared/constants/messages.constants";
import { EmailField, StringField } from "shared/decorators/dto.decorator";

export class AuthResponseDTO {
  @ApiProperty()
  user: Partial<User>;
  accessToken: string;
}

export class RegisterUserDTO {
  @Transform(({ value }: { value: string }) => value?.trim())
  @EmailField({}, { min: 1, max: 256 })
  email: string;

  @Matches(PASSWORD_REGEX, { message: MESSAGES.INVALID_PASSWORD })
  @StringField()
  password: string;

  @Matches(NAME_REGEX, { message: MESSAGES.INVALID_NAME })
  @StringField()
  name: string;
}

export class LoginDTO {
  @EmailField({}, { min: 1, max: 256 })
  email: string;

  @Matches(PASSWORD_REGEX, { message: MESSAGES.INVALID_PASSWORD })
  @StringField()
  password: string;
}

export class EmailDTO {
  @EmailField({}, { min: 1, max: 256 })
  email: string;
}

export class ForgotPasswordDTO extends EmailDTO {}

export class ChangePasswordDTO {
  @Matches(PASSWORD_REGEX, { message: MESSAGES.INVALID_PASSWORD })
  @StringField()
  password: string;
}

export class ResetPasswordDTO {
  @StringField()
  token: string;

  @Matches(PASSWORD_REGEX, { message: MESSAGES.INVALID_PASSWORD })
  @StringField()
  password: string;
}
