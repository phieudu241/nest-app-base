import { Prisma, User } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { getUsers } from "@prisma/client/sql";

import { UserRepo } from "modules/user/user.repo";
import { convertToRawQueryRecordToPrismaModel } from "shared/helpers/sql.helpers";

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.userRepo.findOne(userWhereUniqueInput);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.userRepo.findAll({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.userRepo.create(data);
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.userRepo.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.userRepo.delete(where);
  }

  async checkExistingEmail(email: string): Promise<boolean> {
    const user = await this.findOne({ email });
    return !!user;
  }

  async checkExistingToken(token: string): Promise<boolean> {
    const user = await this.findOne({ token });
    return !!user;
  }

  async getUsersByEmail(email: string): Promise<User[]> {
    const records = await this.userRepo.execQueryRawTyped(getUsers(email));
    const users = records
      .map((record) => convertToRawQueryRecordToPrismaModel(record, "User") as User);
    return users;
  }
}
