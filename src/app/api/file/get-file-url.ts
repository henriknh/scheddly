"use server";

import { getPresignedUrl } from "@/lib/minio";
import prisma from "@/lib/prisma";

export async function getFileUrl(fileId: string) {
  if (!fileId) {
    throw new Error("File id is required");
  }

  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    throw new Error("File not found");
  }

  const presignedUrl = await getPresignedUrl(file.path);

  if (!presignedUrl) {
    throw new Error("Failed to generate presigned URL");
  }

  return presignedUrl;
}
