const WORKER_TIMEOUT_MS = 120000; // 2 minutes (includes container cold start + processing time)

export class ProcessImageUseCase {
  constructor(private readonly workerUrl: string) {}

  async execute(
    fileBuffer: Buffer,
    filename: string,
    operation: string,
    params?: { width?: number; height?: number },
  ): Promise<Buffer> {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(fileBuffer)]);
    formData.append("file", blob, filename);
    formData.append("operation", operation);

    if (params?.width) {
      formData.append("width", String(params.width));
    }
    if (params?.height) {
      formData.append("height", String(params.height));
    }

    const controller = new AbortController(); // AbortController for timeout
    const timeoutId = setTimeout(() => controller.abort(), WORKER_TIMEOUT_MS);

    try {
      const response = await fetch(`${this.workerUrl}/process`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Worker error: ${error}`);
      }

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          "Tempo limite excedido. O processamento demorou muito.",
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
