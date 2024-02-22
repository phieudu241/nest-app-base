import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

import { MESSAGES } from "shared/constants/messages.constants";
import { UserService } from "modules/user/user.service";
import { AuthHelpers } from "shared/helpers/auth.helpers";
import { GLOBAL_CONFIG } from "configs/global.config";
import { MailService } from "services/mail/mail.service";
import { MAIL_TEMPLATES } from "services/mail/mail.constants";

import { AuthResponseDTO, ForgotPasswordDTO, LoginDTO, RegisterUserDTO, ResetPasswordDTO } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {
  }

  public async login(loginUserDTO: LoginDTO): Promise<AuthResponseDTO> {
    const userData = await this.userService.findOne({
      email: loginUserDTO.email,
    });

    if (!userData) {
      throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIAL);
    }

    const isMatch = await AuthHelpers.verify(
      loginUserDTO.password,
      userData.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIAL);
    }

    const payload = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: GLOBAL_CONFIG.security.expiresIn,
    });

    return {
      user: payload,
      accessToken: accessToken,
    };
  }

  public async register(user: RegisterUserDTO): Promise<User> {
    if (await this.userService.checkExistingEmail(user.email)) {
      throw new BadRequestException(MESSAGES.EMAIL_ALREADY_TAKEN);
    }
    const token = AuthHelpers.generateToken();
    const newUser = {
      ...user,
      token,
    };
    const createdUser = await this.userService.create(newUser);

    this.mailService.sendEmail(
      user.email,
      MAIL_TEMPLATES.VERIFY_ACCOUNT,
      {
        name: user.name,
        link: `${GLOBAL_CONFIG.external.frontend_url}/verify/${token}`,
      },
    );
    return createdUser;
  }

  public async forgotPassword(dto: ForgotPasswordDTO): Promise<void> {
    const { email } = dto;
    const user = await this.userService.findOne({ email });
    if (!user) {
      throw new BadRequestException(MESSAGES.EMAIL_NOT_FOUND);
    }

    this.mailService.sendEmail(email, MAIL_TEMPLATES.RESET_PASSWORD, {
      link: `${GLOBAL_CONFIG.external.frontend_url}/reset-password/${user.token}`,
    });

    return;
  }

  public async resetPassword(dto: ResetPasswordDTO): Promise<User> {
    const { token, password } = dto;
    const isExisting = await this.userService.checkExistingToken(token);
    if (!isExisting) {
      throw new BadRequestException(MESSAGES.INVALID_TOKEN);
    }

    const encryptedPass = await AuthHelpers.hash(password);
    return await this.userService.update({
      where: { token },
      data: { password: encryptedPass },
    });
  }

  public async verifyToken(token: string): Promise<void> {
    const isExisting = await this.userService.checkExistingToken(token);
    if (!isExisting) {
      throw new BadRequestException(MESSAGES.INVALID_TOKEN);
    } else {
      await this.userService.update({
        where: { token },
        data: { emailVerifiedAt: new Date() },
      });
    }
  }
}
