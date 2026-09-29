import { ProcessImageUseCase } from "@/usecases/image/process-image.usecase";
import { ImageController } from "@/controllers/image.controller";

export function makeImageController(): ImageController {
  const processImageUseCase = new ProcessImageUseCase();
  return new ImageController(processImageUseCase);
}
