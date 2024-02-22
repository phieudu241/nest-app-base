import { Prisma } from "@prisma/client";

import { GLOBAL_CONFIG } from "configs/global.config";

export type LogLevel = "info" | "query" | "warn" | "error";
export type LogDefinition = {
  level: LogLevel;
  emit: "stdout" | "event";
};

export const PRISMA_LOG_CONFIG: Array<LogDefinition> = GLOBAL_CONFIG.prisma.log_levels.map((level: LogLevel) => {
  return { level, emit: "stdout" };
});

export const PRISMA_CLIENT_OPTIONS: Prisma.PrismaClientOptions = {
  log: PRISMA_LOG_CONFIG,
};

export const SOFT_DELETE_MODEL_NAMES = [];
