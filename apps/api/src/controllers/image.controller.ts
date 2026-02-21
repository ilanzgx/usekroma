import { FastifyRequest, FastifyReply } from "fastify";
import { ProcessImageUseCase } from "@/usecases/image/process-image.usecase";

export class ImageController {
  constructor(private readonly processImageUseCase: ProcessImageUseCase) {}

  async uploadImage(req: FastifyRequest, reply: FastifyReply) {
    const data = await req.file();

    if (!data) {
      return reply.status(400).send({ error: "No file uploaded" });
    }

    const buffer = await data.toBuffer();
    const operationField = data.fields.operation as
      | { value: string }
      | undefined;
    const operation = operationField?.value || "upscale";

    // Optional params for resize
    const widthField = data.fields.width as { value: string } | undefined;
    const heightField = data.fields.height as { value: string } | undefined;
    const params =
      widthField?.value && heightField?.value
        ? { width: Number(widthField.value), height: Number(heightField.value) }
        : undefined;

    try {
      const processedImage = await this.processImageUseCase.execute(
        buffer,
        data.filename,
        operation,
        params,
      );

      return reply
        .status(200)
        .header("Content-Type", "image/png")
        .header("Content-Disposition", `attachment; filename="processed.png"`)
        .send(processedImage);
    } catch (error) {
      req.log.error(error);
      return reply.status(500).send({
        error: "Failed to process image",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
