import { describe, it, vi, expect, beforeEach, type Mocked } from "vitest";
import { GoogleAuthUseCase } from "../../google-auth.usecase";
import { IUserRepository } from "@/repositories/user.repository.interface";
import { User } from "@/models/user.model";
import { randomUUID } from "node:crypto";

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: randomUUID(),
  email: "johndoe@gmail.com",
  name: "John Doe",
  googleId: "abc",
  picture: "https://example.com/a.jpg",
  credits: 50,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("GoogleAuthUseCase unit tests", () => {
  let sut: GoogleAuthUseCase;
  let mockRepository: Mocked<IUserRepository>;

  const input = {
    email: "johndoe@gmail.com",
    name: "John Doe",
    googleId: "abc",
    picture: "https://example.com/a.jpg",
  };

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
    };
    sut = new GoogleAuthUseCase(mockRepository);
  });

  it("should create a new user with 50 credits when user does not exist", async () => {
    // Arrange
    const expectedUser = makeUser();
    mockRepository.findByEmail.mockResolvedValue(undefined);
    mockRepository.create.mockResolvedValue(expectedUser);

    // Act
    const result = await sut.execute(input);

    // Assert
    expect(result).toBeDefined();
    expect(mockRepository.findByEmail).toHaveBeenCalledOnce();
    expect(mockRepository.create).toHaveBeenCalledWith({
      ...input,
      credits: 50,
    });
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should update existing user data without overwriting credits", async () => {
    // Arrange
    const existingUser = makeUser();
    const updatedUser = makeUser({ name: "John Doe Updated" });
    mockRepository.findByEmail.mockResolvedValue(existingUser);
    mockRepository.update.mockResolvedValue(updatedUser);

    // Act
    const result = await sut.execute(input);

    // Assert
    expect(result).toEqual(updatedUser);
    expect(mockRepository.findByEmail).toHaveBeenCalledOnce();
    expect(mockRepository.update).toHaveBeenCalledWith(existingUser.id, {
      name: input.name,
      googleId: input.googleId,
      picture: input.picture,
    });
    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});
