import { describe, it, vi, expect, beforeEach, type Mocked } from "vitest";
import { GetUserByEmailUseCase } from "../../get-user-by-email.usecase";
import { IUserRepository } from "@/repositories/user.repository.interface";
import { randomUUID } from "crypto";
import { User } from "@/models/user.model";

describe("GetUserByEmailUseCase unit tests", () => {
  let sut: GetUserByEmailUseCase;
  let mockRepository: Mocked<IUserRepository>;
  let mockUser: User;

  beforeEach(() => {
    mockUser = {
      id: randomUUID(),
      name: "John Doe",
      email: "john.doe@example.com",
      credits: 50,
      googleId: "abc",
      picture: "https://example.com/a.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn().mockResolvedValue(mockUser),
      findAll: vi.fn(),
      update: vi.fn(),
    };
    sut = new GetUserByEmailUseCase(mockRepository);
  });

  it("should get a user by email", async () => {
    // Act
    const result = await sut.execute(mockUser.email);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(mockUser);
    expect(result.id).toBe(mockUser.id);
    expect(result.name).toBe(mockUser.name);
    expect(result.email).toBe(mockUser.email);
    expect(result.credits).toBe(mockUser.credits);
    expect(result.googleId).toBe(mockUser.googleId);
    expect(result.picture).toBe(mockUser.picture);
    expect(result.createdAt).toBe(mockUser.createdAt);
    expect(result.updatedAt).toBe(mockUser.updatedAt);
  });

  it("should throw an error if user is not found", async () => {
    // Arrange
    mockRepository.findByEmail.mockResolvedValue(undefined);

    // Act
    await expect(sut.execute(mockUser.email)).rejects.toThrow("User not found");
  });
});
