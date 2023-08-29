import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { User } from "@prisma/client";

import { Role } from "shared/constants/global.constants";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  roles: string[];

  constructor(private reflector: Reflector) {
    super(reflector);
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (roles?.includes(Role.PUBLIC)) {
      return true;
    } else {
      request.roles = roles;
    }
    return super.canActivate(context);
  }

  // @ts-ignore
  handleRequest(err: Error, user: User): User {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
