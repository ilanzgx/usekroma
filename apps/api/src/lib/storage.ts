import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { envConfig } from "@/config/env.config";
import { Readable } from "node:stream";

const s3Client = new S3Client({
  endpoint: envConfig.STORAGE_ENDPOINT,
  region: envConfig.STORAGE_REGION,
  credentials: {
    accessKeyId: envConfig.STORAGE_ACCESS_KEY,
    secretAccessKey: envConfig.STORAGE_SECRET_KEY,
  },
  forcePathStyle: true, // Necessário para o MinIO local
});

const BUCKET = envConfig.STORAGE_BUCKET;

export const storage = {
  async upload(key: string, buffer: Buffer, contentType: string): Promise<string> {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    return key;
  },

  async download(key: string): Promise<Buffer> {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
      }),
    );

    if (!response.Body) {
      throw new Error(`Arquivo não encontrado no storage: ${key}`);
    }

    const stream = response.Body as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  },

  async delete(key: string): Promise<void> {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      }),
    );
  },
};
