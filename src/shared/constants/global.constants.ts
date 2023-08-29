// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

export const JWT_SECRET = process.env.JWT_SIGNATURE;

export enum Environment {
  Development = "development",
  Test = "test",
  Production = "production",
}

export enum Role {
  PUBLIC = "Public",
  USER = "User",
  ADMIN = "Admin",
  SUPER_ADMIN = "SuperAdmin",
}

export const API_PREFIX = "/api/v1";
//Regex
export const NAME_REGEX = /^[ぁ-ゖァ-ヿA-Za-z\u4E00-\u9FFF \s]{0,256}$/;
export const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)[^\s]{8,16}$/;
export const BLACK_LIST_FIELDS = ["password", "token"];

export const IMAGE_MIME_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

export const SHORT_DATE = "YYYY-MM-DD";

export const MAX_IMAGE_SIZE = 10; // MB
