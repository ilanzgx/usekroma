import { beforeEach, describe, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { CreateUserUseCase } from "../../create-user.usecase";
import { IUserRepository } from "@/repositories/user.repository.interface";

const mockUser = {
  id: randomUUID(),
  name: "John Doe",
  email: "john.doe@example.com",
  googleId: "1234567890",
  picture: "https://example.com/avatar.jpg",
  createdAt: new Date(),
};

describe("CreateUserUseCase unit tests", () => {
  let sut: CreateUserUseCase;
  let mockRepository: IUserRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn().mockResolvedValue(mockUser),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
    };
    sut = new CreateUserUseCase(mockRepository);
  });

  it("should create a new user", async () => {
    // Arrange
    const input = {
      name: "John Doe",
      email: "john.doe@example.com",
      googleId: "1234567890",
      picture: "https://example.com/avatar.jpg",
    };

    // Act
    const result = await sut.execute(input);

    // Assert
    expect(result).toBeDefined();
    expect(result.id).toBe(mockUser.id);
    expect(result.name).toBe("John Doe");
    expect(result.email).toBe("john.doe@example.com");
    expect(result.picture).toBe("https://example.com/avatar.jpg");
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
