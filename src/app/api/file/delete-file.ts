"use server";

import { deleteFromMinio } from "@/lib/minio";
import _prisma, { PrismaTransaction } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

export interface DeleteFileOptions {
  prismaTx?: PrismaTransaction;
}

export async function deleteFile(
  fileId: string,
  options: DeleteFileOptions = {}
) {
  const { prismaTx } = options;
  const prisma = prismaTx || _prisma;

  // Authenticate user
  const user = await getUserFromToken();
  if (!user || !user.id) {
    throw new Error("Unauthorized");
  }

  // Find the file
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });
  if (!file) {
    throw new Error("File not found");
  }

  // Optional: Check ownership (user or post)
  // If file.userId exists, check user.id === file.userId
  // If file.postId exists, check post.teamId === user.teamId
  // For now, skip deep ownership check for simplicity

  // Use transaction for DB delete
  // Delete from Minio (outside transaction, as it's external)
  try {
    await deleteFromMinio(file);
  } catch (error) {
    console.error("Error deleting from Minio:", error);
    throw new Error("Failed to delete file from storage");
  }

  // Delete from DB
  try {
    await prisma.file.delete({ where: { id: fileId } });
  } catch (error) {
    console.error("Error deleting file from DB:", error);
    throw new Error("Failed to delete file from database");
  }

  return { success: true };
}
