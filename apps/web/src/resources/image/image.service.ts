"use server";

import { getToken } from "@/resources/auth/auth.service";
import {
  ImageProcessRequest,
  ImageProcessResponse,
} from "@/resources/image/image.types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * processImageService
 * process image with API
 * @export
 * @param {ImageProcessRequest} { file, operation }
 * @return {*}  {Promise<ImageProcessResponse | null>}
 */
export async function processImageService({
  file,
  operation,
}: ImageProcessRequest): Promise<ImageProcessResponse | null> {
  const token = await getToken();

  if (!token) {
    return null;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("operation", operation);

    const response = await fetch(`${BASE_URL}/images/process`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to process image");
    }

    // server actions cant handle binary data,
    // so i need to convert it to base64
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = blob.type || "image/png";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return {
      processedImage: dataUrl,
    };
  } catch (error) {
    console.error("Error processing image:", error);
    return null;
  }
}
