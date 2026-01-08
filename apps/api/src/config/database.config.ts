import type { Options } from "postgres";

export const databaseConfig: Options<{}> = {
  max: 10, // max connections
  idle_timeout: 20, // seconds before closing idle connection
  connect_timeout: 10, // seconds for connection timeout
};

export const DATABASE_URL = process.env.DATABASE_URL!;
