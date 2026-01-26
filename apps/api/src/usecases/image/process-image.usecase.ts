export class ProcessImageUseCase {
  private readonly workerUrl: string;

  constructor() {
    this.workerUrl = process.env.WORKER_IMAGE_URL || "http://localhost:8000";
  }

  async execute(
    fileBuffer: Buffer,
    filename: string,
    operation: string,
  ): Promise<Buffer> {
    const formData = new FormData();
    const blob = new Blob([new Uint8Array(fileBuffer)]);
    formData.append("file", blob, filename);
    formData.append("operation", operation);

    const response = await fetch(`${this.workerUrl}/process`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Worker error: ${error}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }
}

export const processImageUseCase = new ProcessImageUseCase();
