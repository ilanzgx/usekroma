import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { processImageUseCase } from "@/usecases/image/process-image.usecase";

export const imageController = (fastify: FastifyInstance) => {
  fastify.post("/process", async (req: FastifyRequest, reply: FastifyReply) => {
    const data = await req.file();

    if (!data) {
      return reply.status(400).send({ error: "No file uploaded" });
    }

    const buffer = await data.toBuffer();
    const operationField = data.fields.operation as
      | { value: string }
      | undefined;
    const operation = operationField?.value || "upscale";

    try {
      const processedImage = await processImageUseCase.execute(
        buffer,
        data.filename,
        operation
      );

      return reply
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
  });
};
