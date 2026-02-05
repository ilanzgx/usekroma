import { describe, it, expect, vi, beforeEach } from "vitest";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { FastifyRequest, FastifyReply } from "fastify";

// Mock for FastifyRequest
const createMockRequest = (overrides: Record<string, unknown> = {}) =>
  ({
    url: "/v1/users",
    routeOptions: { config: {} },
    jwtVerify: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }) as unknown as FastifyRequest;

// Mock for FastifyReply
const createMockReply = () => {
  const reply = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };
  return reply as unknown as FastifyReply;
};

describe("authMiddleware unit tests", () => {
  let mockReply: FastifyReply;

  beforeEach(() => {
    mockReply = createMockReply();
    vi.clearAllMocks();
  });

  describe("public routes (should skip auth)", () => {
    it("should skip auth for /health route", async () => {
      // Arrange
      const mockRequest = createMockRequest({ url: "/health" });

      // Act
      await authMiddleware(mockRequest, mockReply);

      // Assert
      expect(mockRequest.jwtVerify).not.toHaveBeenCalled();
      expect(mockReply.status).not.toHaveBeenCalled();
    });

    it("should skip auth for /docs route", async () => {
      // Arrange
      const mockRequest = createMockRequest({ url: "/docs" });

      // Act
      await authMiddleware(mockRequest, mockReply);

      // Assert
      expect(mockRequest.jwtVerify).not.toHaveBeenCalled();
    });

    it("should skip auth for /docs/openapi.json route", async () => {
      // Arrange
      const mockRequest = createMockRequest({ url: "/docs/openapi.json" });

      // Act
      await authMiddleware(mockRequest, mockReply);

      // Assert
      expect(mockRequest.jwtVerify).not.toHaveBeenCalled();
    });

    it("should skip auth for /v1/auth/google route", async () => {
      // Arrange
      const mockRequest = createMockRequest({ url: "/v1/auth/google" });

      // Act
      await authMiddleware(mockRequest, mockReply);

      // Assert
      expect(mockRequest.jwtVerify).not.toHaveBeenCalled();
    });

    it("should skip auth for /v1/auth/google/callback route", async () => {
      // Arrange
      const mockRequest = createMockRequest({
        url: "/v1/auth/google/callback",
      });

      // Act
      await authMiddleware(mockRequest, mockReply);

      // Assert
      expect(mockRequest.jwtVerify).not.toHaveBeenCalled();
    });

    it("should skip auth for /v1/auth/logout route", async () => {
      // Arrange
      const mockRequest = createMockRequest({ url: "/v1/auth/logout" });

      // Act
      await authMiddleware(mockRequest, mockReply);

      // Assert
      expect(mockRequest.jwtVerify).not.toHaveBeenCalled();
    });

    it("should skip auth when route config has public: true", async () => {
      // Arrange
      const mockRequest = createMockRequest({
        url: "/v1/some-protected-route",
        routeOptions: { config: { public: true } },
      });

      // Act
      await authMiddleware(mockRequest, mockReply);

      // Assert
      expect(mockRequest.jwtVerify).not.toHaveBeenCalled();
    });
  });

  describe("protected routes (should require auth)", () => {
    it("should call jwtVerify for protected routes", async () => {
      // Arrange
      const mockRequest = createMockRequest({ url: "/v1/users" });

      // Act
      await authMiddleware(mockRequest, mockReply);

      // Assert
      expect(mockRequest.jwtVerify).toHaveBeenCalledOnce();
    });

    it("should allow access when JWT is valid", async () => {
      // Arrange
      const mockRequest = createMockRequest({
        url: "/v1/users/me",
        jwtVerify: vi.fn().mockResolvedValue(undefined),
      });

      // Act
      await authMiddleware(mockRequest, mockReply);

      // Assert
      expect(mockRequest.jwtVerify).toHaveBeenCalledOnce();
      expect(mockReply.status).not.toHaveBeenCalled();
      expect(mockReply.send).not.toHaveBeenCalled();
    });

    it("should return 401 when JWT verification fails", async () => {
      // Arrange
      const mockRequest = createMockRequest({
        url: "/v1/users",
        jwtVerify: vi.fn().mockRejectedValue(new Error("Invalid token")),
      });

      // Act
      await authMiddleware(mockRequest, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: "Unauthorized",
        message: "Invalid or missing authentication token",
      });
    });

    it("should return 401 when token is missing", async () => {
      // Arrange
      const mockRequest = createMockRequest({
        url: "/v1/images/process",
        jwtVerify: vi
          .fn()
          .mockRejectedValue(new Error("No Authorization header")),
      });

      // Act
      await authMiddleware(mockRequest, mockReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: "Unauthorized",
        message: "Invalid or missing authentication token",
      });
    });
  });
});
