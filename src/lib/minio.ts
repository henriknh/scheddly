import { Client } from "minio";

if (!process.env.MINIO_ENDPOINT) {
  throw new Error("MINIO_ENDPOINT is not defined");
}

if (!process.env.MINIO_PORT) {
  throw new Error("MINIO_PORT is not defined");
}

if (!process.env.MINIO_ACCESS_KEY) {
  throw new Error("MINIO_ACCESS_KEY is not defined");
}

if (!process.env.MINIO_SECRET_KEY) {
  throw new Error("MINIO_SECRET_KEY is not defined");
}

if (!process.env.MINIO_BUCKET_NAME) {
  throw new Error("MINIO_BUCKET_NAME is not defined");
}

export const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

// Initialize bucket if it doesn&apos;t exist
export async function initializeBucket() {
  try {
    const bucketExists = await minioClient.bucketExists(MINIO_BUCKET_NAME);
    if (!bucketExists) {
      await minioClient.makeBucket(MINIO_BUCKET_NAME, "us-east-1");
      console.log(`Bucket ${MINIO_BUCKET_NAME} created successfully`);
    }
  } catch (error) {
    console.error("Error initializing MinIO bucket:", error);
    throw error;
  }
}

export async function getPresignedUrl(key: string): Promise<string> {
  try {
    return await minioClient.presignedGetObject(MINIO_BUCKET_NAME, key, 3600); // 1 hour expiration
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
}

export async function uploadToMinio(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  try {
    await minioClient.putObject(
      MINIO_BUCKET_NAME,
      filename,
      buffer,
      buffer.length,
      {
        "Content-Type": contentType,
      }
    );
    return filename;
  } catch (error) {
    console.error("Error uploading to MinIO:", error);
    throw error;
  }
}
