import * as chalk from "chalk";
import { createLogger, LoggerOptions } from "winston";
import { Injectable, LoggerService } from "@nestjs/common";
import DailyRotateFile from "winston-daily-rotate-file";

import { GLOBAL_CONFIG } from "configs/global.config";

const dailyRotateFile = new DailyRotateFile({
  level: GLOBAL_CONFIG.logger.level,
  filename: `${GLOBAL_CONFIG.logger.folder_path}/%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: false,
  maxSize: "20m",
  maxFiles: "90d"
});

@Injectable()
export class Logger implements LoggerService {
  private readonly logger;

  private level = GLOBAL_CONFIG.logger.level;

  private context: string;

  constructor() {
    this.logger = createLogger(this.getLoggerOptions(this.level));
    this.setContext("Main");
  }

  public getLoggerOptions(level: string): LoggerOptions {
    return {
      level: level,
      transports: [
        dailyRotateFile,
      ],
    };
  }

  public setContext(context: string): this {
    this.context = context;

    return this;
  }

  public setLevel(level: string): this {
    this.level = level;

    const loggerOptions = this.getLoggerOptions(level);
    this.overrideOptions(loggerOptions);

    return this;
  }

  log(message: string): void {
    this.setLevel("info");
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });

    this.logToConsole("info", message);
  }

  error(message: string, trace?: string): void {
    console.log("message:", message);
    this.setLevel("error");
    const currentDate = new Date();
    this.logger.error(`${message} -> (${trace || "trace not provided !"})`, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.logToConsole("error", message);
  }

  warn(message: string): void {
    this.setLevel("warn");
    const currentDate = new Date();
    this.logger.warn(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.logToConsole("warn", message);
  }

  info(message: string): void {
    this.setLevel("info");
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.logToConsole("info", message);
  }

  debug(message: string): void {
    this.setLevel("debug");
    const currentDate = new Date();
    this.logger.info(message, {
      timestamp: currentDate.toISOString(),
      context: this.context,
    });
    this.logToConsole("debug", message);
  }

  overrideOptions(options: LoggerOptions): void {
    this.logger.configure(options);
  }

  // this method just for printing a cool log in your terminal , using chalk
  private logToConsole(level: string, message: string): void {
    let result: string;
    const color = chalk.default;
    const currentDate = new Date();
    const time = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;

    switch (level) {
      default:
      case "info":
        result = `[${color.blue("INFO")}] ${color.dim.yellow.bold.underline(time)} [${color.green(
          this.context
        )}] ${message}`;
        break;
      case "error":
        result = `[${color.red("ERR")}] ${color.dim.yellow.bold.underline(time)} [${color.green(
          this.context
        )}] ${message}`;
        break;
      case "warn":
        result = `[${color.yellow("WARN")}] ${color.dim.yellow.bold.underline(time)} [${color.green(
          this.context
        )}] ${message}`;
        break;
    }
    console.log(result); // TODO: DON'T remove this console.log

    this.logger.close();
  }
}
