import { File as PrismaFile } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { Client } from "minio";
import { extname } from "path";
import sharp, { ResizeOptions } from "sharp";

if (!process.env.MINIO_ENDPOINT) throw new Error("MINIO_ENDPOINT is required");
if (!process.env.MINIO_PORT) throw new Error("MINIO_PORT is required");
if (!process.env.MINIO_ACCESS_KEY)
  throw new Error("MINIO_ACCESS_KEY is required");
if (!process.env.MINIO_SECRET_KEY)
  throw new Error("MINIO_SECRET_KEY is required");
if (!process.env.MINIO_BUCKET_NAME)
  throw new Error("MINIO_BUCKET_NAME is required");

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.NODE_ENV === "production",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

export interface UploadResult {
  path: string;
  mimeType: string;
  size: number;
}

export async function ensureBucketExists() {
  const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
  if (!bucketExists) {
    await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
    // Make the bucket public
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
        },
      ],
    };
    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
  }
}

export async function getPresignedUrl(key: string): Promise<string> {
  try {
    return await minioClient.presignedGetObject(BUCKET_NAME, key, 3600); // 1 hour expiration
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
}

export async function deleteFromMinio(file: PrismaFile): Promise<void> {
  await minioClient.removeObject(BUCKET_NAME, file.path);
}

async function uploadToMinio(
  buffer: Buffer,
  path: string,
  mimeType: string
): Promise<UploadResult> {
  try {
    await ensureBucketExists();
    const size = buffer.length;
    await minioClient.putObject(BUCKET_NAME, path, buffer, size, {
      "Content-Type": mimeType,
    });
    return { path, mimeType, size: size };
  } catch (error) {
    console.error("Error uploading to MinIO:", error);
    throw error;
  }
}

export async function uploadAvatar(
  file: File,
  userId: string
): Promise<UploadResult> {
  const path = `avatars/${userId}${extname(file.name)}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const resizeOptions: ResizeOptions = {
    width: 256,
    height: 256,
    fit: "cover",
  };

  const resizedImage = await sharp(buffer).resize(resizeOptions).toBuffer();

  return uploadToMinio(resizedImage, path, file.type);
}

export const uploadImageToMinio = async (
  image?: File | null
): Promise<UploadResult | null> => {
  if (!image) {
    return null;
  }

  const path = `post_images/${randomUUID()}${extname(image.name)}`;

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return uploadToMinio(buffer, path, image.type);
};

export const uploadImagesToMinio = async (
  images?: File[] | null
): Promise<UploadResult[]> => {
  // TODO: Fix why this is calling uploadImageToMinio an extra time with undefined image

  if (images && images.length > 0) {
    return (await Promise.all(images.map(uploadImageToMinio))).filter(
      (url) => url !== null
    ) as UploadResult[];
  }
  return [];
};

export const uploadVideoToMinio = async (
  video?: File | null
): Promise<UploadResult | null> => {
  if (!video) {
    return null;
  }

  const uniqueFilename = `post_videos/${randomUUID()}${extname(video.name)}`;

  const bytes = await video.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return uploadToMinio(buffer, uniqueFilename, video.type);
};
