import { describe, it, expect } from "vitest";
import z from "zod";

const envSchema = z.object({
  SERVER_HOST: z.string(),
  SERVER_PORT: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
  DATABASE_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  JWT_SECRET: z.string(),
  WORKER_IMAGE_URL: z.string(),
  FRONTEND_URL: z.string(),
});

describe("envConfig unit tests", () => {
  const validEnv = {
    SERVER_HOST: "localhost",
    SERVER_PORT: "8080",
    NODE_ENV: "development",
    LOG_LEVEL: "info",
    DATABASE_URL: "postgres://user:pass@localhost:5432/db",
    GOOGLE_CLIENT_ID: "google-client-id",
    GOOGLE_CLIENT_SECRET: "google-client-secret",
    GOOGLE_CALLBACK_URL: "http://localhost:8080/auth/google/callback",
    JWT_SECRET: "super-secret-jwt-key",
    WORKER_IMAGE_URL: "http://localhost:8000",
    FRONTEND_URL: "http://localhost:3000",
  };

  describe("valid environment variables", () => {
    it("should parse valid environment variables", () => {
      // Arrange & Act
      const result = envSchema.safeParse(validEnv);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.SERVER_HOST).toBe("localhost");
        expect(result.data.SERVER_PORT).toBe("8080");
        expect(result.data.NODE_ENV).toBe("development");
      }
    });

    it("should accept all valid NODE_ENV values", () => {
      // Arrange & Act
      const environments = ["development", "production", "test"] as const;

      // Assert
      for (const env of environments) {
        const result = envSchema.safeParse({ ...validEnv, NODE_ENV: env });
        expect(result.success).toBe(true);
      }
    });

    it("should accept all valid LOG_LEVEL values", () => {
      // Arrange
      const levels = ["debug", "info", "warn", "error"] as const;

      // Act & Assert
      for (const level of levels) {
        const result = envSchema.safeParse({ ...validEnv, LOG_LEVEL: level });
        expect(result.success).toBe(true);
      }
    });
  });

  describe("invalid environment variables", () => {
    it("should fail when SERVER_HOST is missing", () => {
      // Arrange
      const { SERVER_HOST, ...envWithoutHost } = validEnv;

      // Act
      const result = envSchema.safeParse(envWithoutHost);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should fail when NODE_ENV has invalid value", () => {
      // Arrange & Act
      const result = envSchema.safeParse({ ...validEnv, NODE_ENV: "staging" });

      // Assert
      expect(result.success).toBe(false);
    });

    it("should fail when LOG_LEVEL has invalid value", () => {
      // Arrange & Act
      const result = envSchema.safeParse({ ...validEnv, LOG_LEVEL: "trace" });

      // Assert
      expect(result.success).toBe(false);
    });

    it("should fail when DATABASE_URL is missing", () => {
      // Arrange
      const { DATABASE_URL, ...envWithoutDb } = validEnv;

      // Act
      const result = envSchema.safeParse(envWithoutDb);

      // Assert
      expect(result.success).toBe(false);
    });

    it("should fail when JWT_SECRET is missing", () => {
      // Arrange
      const { JWT_SECRET, ...envWithoutJwt } = validEnv;

      // Act
      const result = envSchema.safeParse(envWithoutJwt);

      // Assert
      expect(result.success).toBe(false);
    });
  });
});
