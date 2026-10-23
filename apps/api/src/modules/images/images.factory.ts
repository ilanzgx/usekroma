import { ProcessImageUseCase } from "./process-image.usecase";
import { ImageController } from "./images.controller";

export function makeImageController(): ImageController {
  const processImageUseCase = new ProcessImageUseCase();
  return new ImageController(processImageUseCase);
}
