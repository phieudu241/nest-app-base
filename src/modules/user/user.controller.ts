import { Controller, Get, Param } from "@nestjs/common";
import { User } from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";

import { AuthUser } from "modules/auth/auth.user.decorator";
import { HasRoles } from "modules/auth/auth.has-roles.decorator";
import { Role } from "shared/constants/global.constants";

import { UserService } from "./user.service";

@ApiTags("users")
@Controller("/users")
export class UserController {
  constructor(private userService: UserService) {
  }

  @Get()
  @HasRoles(Role.ADMIN)
  async getAll(): Promise<User[]> {
    return this.userService.findAll({});
  }

  @Get("user/:id")
  async getUserById(@Param("id") id: string): Promise<User> {
    return this.userService.findOne({ id: Number(id) });
  }

  @Get("me")
  async getUser(@AuthUser() user: User): Promise<User> {
    return this.userService.findOne({ id: user.id });
  }
}
