import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "@prisma/client";

import { JWT_SECRET } from "shared/constants/global.constants";
import { PrismaService } from "services/prisma/prisma.service";
import { isDev } from "shared/helpers/env.helpers";

const cookieExtractor = (req) => req?.cookies.accessToken;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromHeader("authorization"),
        ExtractJwt.fromUrlQueryParameter("token"),
        cookieExtractor
      ]),
      ignoreExpiration: isDev(),
      secretOrKey: JWT_SECRET,
      passReqToCallback: true
    });
  }

  async validate(req: Request & { roles: string[] },
    payload: Partial<User> & { iat: number }): Promise<User & { latestLoggedInAt?: string; }> {
    const email = payload.email;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException();
    }

    // Check permissions
    const roles = req.roles;
    if (roles && roles.length > 0) {
      const hasPermission = roles.includes(user.role);
      if (!hasPermission) {
        throw new ForbiddenException();
      }
    }

    const latestLoggedInAt = new Date(payload.iat * 1000).toISOString();

    return { ...user, latestLoggedInAt };
  }
}
