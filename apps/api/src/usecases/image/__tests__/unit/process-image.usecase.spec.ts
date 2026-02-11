import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { ProcessImageUseCase } from "../../process-image.usecase";

const WORKER_URL = "http://mock-worker";

describe("ProcessImageUseCase unit tests", () => {
  let sut: ProcessImageUseCase;

  beforeEach(() => {
    sut = new ProcessImageUseCase(WORKER_URL);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return a buffer when worker returns a successful response", async () => {
    // Arrange
    const fakeImageBytes = new Uint8Array([1, 2, 3, 4]);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(fakeImageBytes.buffer),
      }),
    );

    // Act
    const result = await sut.execute(Buffer.from("test"), "test.jpg", "resize");

    // Assert
    expect(result).toBeInstanceOf(Buffer);
    expect(result).toEqual(Buffer.from(fakeImageBytes));
  });

  it("should call fetch with correct url, method and body", async () => {
    // Arrange
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    });
    vi.stubGlobal("fetch", mockFetch);

    // Act
    const fileBuffer = Buffer.from("test");
    await sut.execute(fileBuffer, "test.jpg", "resize");

    const [url, options] = mockFetch.mock.calls[0];
    const body = options.body as FormData;

    // Assert
    expect(mockFetch).toHaveBeenCalledOnce();
    expect(url).toBe(`${WORKER_URL}/process`);
    expect(options.method).toBe("POST");
    expect(options).toHaveProperty("signal");
    expect(body).toBeInstanceOf(FormData);
    expect(body.get("file")).toBeInstanceOf(Blob);
    expect(body.get("operation")).toBe("resize");
  });

  it("should throw an error when worker returns a non-ok response", async () => {
    // Arrange
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        text: () => Promise.resolve("Unsupported format"),
      }),
    );

    // Act & Assert
    await expect(
      sut.execute(Buffer.from("test"), "test.jpg", "resize"),
    ).rejects.toThrow("Worker error: Unsupported format");
  });

  it("should throw timeout error when fetch is aborted", async () => {
    // Arrange
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(
        Object.assign(new Error("The operation was aborted"), {
          name: "AbortError",
        }),
      ),
    );

    // Act & Assert
    await expect(
      sut.execute(Buffer.from("test"), "test.jpg", "resize"),
    ).rejects.toThrow("Tempo limite excedido. O processamento demorou muito.");
  });

  it("should rethrow unexpected errors as-is", async () => {
    // Arrange
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network failure")),
    );

    // Act & Assert
    await expect(
      sut.execute(Buffer.from("test"), "test.jpg", "resize"),
    ).rejects.toThrow("network failure");
  });
});
