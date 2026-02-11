import { ProcessImageUseCase } from "@/usecases/image/process-image.usecase";
import { ImageController } from "@/controllers/image.controller";
import { envConfig } from "@/config/env.config";

export function makeImageController(): ImageController {
  const processImageUseCase = new ProcessImageUseCase(
    envConfig.WORKER_IMAGE_URL,
  );

  return new ImageController(processImageUseCase);
}
