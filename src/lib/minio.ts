import { Client } from "minio";

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

export async function uploadToMinio(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  try {
    await ensureBucketExists();
    await minioClient.putObject(BUCKET_NAME, filename, buffer, buffer.length, {
      "Content-Type": contentType,
    });
    return filename;
  } catch (error) {
    console.error("Error uploading to MinIO:", error);
    throw error;
  }
}

export const uploadImageToMinio = async (
  image?: File | null
): Promise<string | null> => {
  console.log("uploading image to minio", image);
  if (!image) {
    return null;
  }

  const imageBytes = await image.arrayBuffer();
  const imageBuffer = Buffer.from(imageBytes);
  const uniqueFilename = `post_images/${image.name}-${Date.now()}`;

  await uploadToMinio(imageBuffer, uniqueFilename, image.type);
  return uniqueFilename;
};

export const uploadImagesToMinio = async (
  images?: File[] | null
): Promise<string[]> => {
  // TODO: Fix why this is calling uploadImageToMinio an extra time with undefined image
  console.log("uploading images to minio", images);

  if (images && images.length > 0) {
    return (await Promise.all(images.map(uploadImageToMinio))).filter(
      (url) => url !== null
    ) as string[];
  }
  return [];
};

export const uploadVideoToMinio = async (
  video?: File | null
): Promise<string | null> => {
  if (!video) {
    return null;
  }

  const videoBytes = await video.arrayBuffer();
  const videoBuffer = Buffer.from(videoBytes);
  const uniqueFilename = `post_videos/${video.name}-${Date.now()}`;

  await uploadToMinio(videoBuffer, uniqueFilename, video.type);
  return uniqueFilename;
};
