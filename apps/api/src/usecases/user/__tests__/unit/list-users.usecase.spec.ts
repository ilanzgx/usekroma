import { describe, it, vi, expect, beforeEach, type Mocked } from "vitest";
import { ListUsersUseCase } from "../../list-users.usecase";
import { IUserRepository } from "@/repositories/user.repository.interface";
import { randomUUID } from "node:crypto";

describe("ListUsersUseCase unit tests", () => {
  let sut: ListUsersUseCase;
  let mockRepository: Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
    };
    sut = new ListUsersUseCase(mockRepository);
  });

  it("should list all users", async () => {
    // Arrange
    const expectedUsers = [
      {
        id: randomUUID(),
        name: "John Doe",
        email: "john.doe@example.com",
        credits: 50,
        googleId: "abc",
        picture: "https://example.com/a.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Ilan Fonseca",
        email: "ilan@gmail.com",
        credits: 50,
        googleId: "abc",
        picture: "https://example.com/a.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    mockRepository.findAll.mockResolvedValue(expectedUsers);

    // Act
    const result = await sut.execute();

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(mockRepository.findAll).toHaveBeenCalledOnce();
  });

  it("should return an empty array when there are no users", async () => {
    // Arrange
    mockRepository.findAll.mockResolvedValue([]);

    // Act
    const result = await sut.execute();

    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveLength(0);
    expect(mockRepository.findAll).toHaveBeenCalledOnce();
  });
});
