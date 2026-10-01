import type { Options } from "postgres";
import { envConfig } from "@/config/env.config";

export const databaseConfig: Options<Record<string, never>> = {
  max: 10, // max connections
  idle_timeout: 20, // seconds before closing idle connection
  connect_timeout: 10, // seconds for connection timeout
};

export const DATABASE_URL = envConfig.DATABASE_URL;
