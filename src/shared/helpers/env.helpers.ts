import { GLOBAL_CONFIG } from "configs/global.config";
import { Environment } from "shared/constants/global.constants";

export const isDev = () => {
  return GLOBAL_CONFIG.env === Environment.Development;
};

export const isProd = () => {
  return GLOBAL_CONFIG.env === Environment.Production;
};

export const isTest = () => {
  return GLOBAL_CONFIG.env === Environment.Test;
};
