import { describe, it, vi, expect, beforeEach, type Mocked } from "vitest";
import { UserController } from "@/controllers/user.controller";
import { ListUsersUseCase } from "@/usecases/user/list-users.usecase";
import { GetUserByEmailUseCase } from "@/usecases/user/get-user-by-email.usecase";
import { User } from "@/models/user.model";
import { randomUUID } from "node:crypto";
import { FastifyReply, FastifyRequest } from "fastify";

const createUser = (overrides: Partial<User> = {}): User => ({
  id: randomUUID(),
  name: "John Doe",
  email: "john.doe@example.com",
  credits: 0,
  googleId: "google_id",
  picture: "https://example.com/picture.jpg",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const createMockReply = (): FastifyReply => {
  const reply = {
    status: vi.fn(),
    send: vi.fn(),
  };
  reply.status.mockReturnValue(reply);
  return reply as unknown as FastifyReply;
};

describe("UserController unit tests", () => {
  let sut: UserController;
  let mockListUsersUseCase: Mocked<ListUsersUseCase>;
  let mockGetUserByEmailUseCase: Mocked<GetUserByEmailUseCase>;

  beforeEach(() => {
    mockListUsersUseCase = {
      execute: vi.fn(),
    } as unknown as Mocked<ListUsersUseCase>;
    mockGetUserByEmailUseCase = {
      execute: vi.fn(),
    } as unknown as Mocked<GetUserByEmailUseCase>;

    sut = new UserController(mockListUsersUseCase, mockGetUserByEmailUseCase);
  });

  describe("listUsers endpoint", () => {
    it("should return 200 with all users", async () => {
      // Arrange
      const users = [
        createUser(),
        createUser({ email: "ilan@gmail.com", name: "Ilan Fonseca" }),
      ];
      mockListUsersUseCase.execute.mockResolvedValue(users);

      const req = {} as FastifyRequest;
      const res = createMockReply();

      // Act
      await sut.listUsers(req, res);

      // Assert
      expect(mockListUsersUseCase.execute).toHaveBeenCalledOnce();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(users);
    });

    it("should propagate error when usecase throws error", async () => {
      // Arrange
      mockListUsersUseCase.execute.mockRejectedValue(new Error("Test error"));
      const req = {} as FastifyRequest;
      const res = createMockReply();

      // Act & Assert
      await expect(sut.listUsers(req, res)).rejects.toThrowError("Test error");
    });
  });

  describe("getUserByEmail endpoint", () => {
    it("should return 200 with the user", async () => {
      // Arrange
      const user = createUser();
      mockGetUserByEmailUseCase.execute.mockResolvedValue(user);

      const req = {
        user: {
          email: "john.doe@example.com",
        },
      } as FastifyRequest;
      const reply = createMockReply();

      // Act
      await sut.getUserByEmail(req, reply);

      // Assert
      expect(mockGetUserByEmailUseCase.execute).toHaveBeenCalledWith(
        "john.doe@example.com",
      );
      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(user);
    });

    it("should propagate error when usecase throws error", async () => {
      // Arrange
      mockGetUserByEmailUseCase.execute.mockRejectedValue(
        new Error("User not found"),
      );
      const req = {
        user: {
          email: "john.doe@example.com",
        },
      } as FastifyRequest;
      const reply = createMockReply();

      // Act & Assert
      await expect(sut.getUserByEmail(req, reply)).rejects.toThrowError(
        "User not found",
      );
    });
  });
});
