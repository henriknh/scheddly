"use server";

import mime from "mime-types";
import { xApiUrl } from "./index";

export interface MediaUploadOptions {
  accessToken: string;
  mediaCategory: "tweet_image" | "tweet_video";
  mediaType: string;
  totalBytes: number;
}

export interface MediaUploadResult {
  mediaId: string;
  success: boolean;
  error?: string;
}

// Helper function to chunk buffer for video uploads
function chunkBuffer(buffer: ArrayBuffer, chunkSize: number = 1024 * 1024): ArrayBuffer[] {
  const chunks: ArrayBuffer[] = [];
  const totalBytes = buffer.byteLength;
  
  for (let i = 0; i < totalBytes; i += chunkSize) {
    const end = Math.min(i + chunkSize, totalBytes);
    chunks.push(buffer.slice(i, end));
  }
  
  return chunks;
}

// Helper function to check media upload status with exponential backoff
export async function checkMediaStatus(
  mediaId: string,
  accessToken: string,
  maxAttempts: number = 30
): Promise<void> {
  let attempts = 0;
  let delay = 1000; // Start with 1 second delay

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      const statusResponse = await fetch(`${xApiUrl}/2/media?media_id=${mediaId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        
        if (statusData.data?.processing_info?.state === "succeeded") {
          console.log(`Media ${mediaId} processing completed successfully`);
          return; // Success
        } else if (statusData.data?.processing_info?.state === "failed") {
          const errorMessage = statusData.data.processing_info?.error?.message || "Unknown error";
          console.error(`Media ${mediaId} processing failed:`, errorMessage);
          throw new Error(`Media processing failed: ${errorMessage}`);
        } else if (statusData.data?.processing_info?.state === "pending" || 
                   statusData.data?.processing_info?.state === "in_progress") {
          console.log(`Media ${mediaId} still processing, attempt ${attempts + 1}/${maxAttempts}`);
          // Continue waiting
        } else {
          // If no processing_info, assume it's ready
          console.log(`Media ${mediaId} ready (no processing info)`);
          return;
        }
      } else {
        console.warn(`Status check failed for media ${mediaId}, attempt ${attempts + 1}/${maxAttempts}`);
      }
    } catch (error) {
      console.warn(`Error checking media status for ${mediaId}:`, error);
    }

    attempts++;
    // Exponential backoff: double the delay each time, max 30 seconds
    delay = Math.min(delay * 2, 30000);
  }

  throw new Error("Media processing timeout after maximum attempts");
}

// Initialize media upload using the latest X API v2
export async function initializeMediaUpload(options: MediaUploadOptions): Promise<string> {
  const { accessToken, mediaCategory, mediaType, totalBytes } = options;

  console.log(`Initializing media upload: ${mediaCategory}, type: ${mediaType}, size: ${totalBytes} bytes`);

  const response = await fetch(`${xApiUrl}/2/media/upload/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_category: mediaCategory,
      media_type: mediaType,
      total_bytes: totalBytes,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Failed to initialize media upload:", error);
    throw new Error(`Failed to initialize media upload: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const mediaId = data.data?.id;
  
  if (!mediaId) {
    throw new Error("No media ID received from X API");
  }
  
  console.log(`Media upload initialized with ID: ${mediaId}`);
  return mediaId;
}

// Append media data using FormData (for images and single-chunk uploads)
export async function appendMediaData(
  mediaId: string,
  accessToken: string,
  mediaBuffer: ArrayBuffer,
  segmentIndex: number = 0
): Promise<void> {
  console.log(`Appending media data to ${mediaId}, segment ${segmentIndex}`);

  // Convert ArrayBuffer to base64
  const base64Data = Buffer.from(mediaBuffer).toString("base64");

  const response = await fetch(`${xApiUrl}/2/media/upload/${mediaId}/append`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_data: base64Data,
      segment_index: segmentIndex,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Failed to append media data:", error);
    throw new Error(`Failed to append media data: ${response.status} ${response.statusText}`);
  }

  console.log(`Media data appended successfully to ${mediaId}, segment ${segmentIndex}`);
}

// Finalize media upload
export async function finalizeMediaUpload(mediaId: string, accessToken: string): Promise<void> {
  console.log(`Finalizing media upload for ${mediaId}`);

  const response = await fetch(`${xApiUrl}/2/media/upload/${mediaId}/finalize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Failed to finalize media upload:", error);
    throw new Error(`Failed to finalize media upload: ${response.status} ${response.statusText}`);
  }

  console.log(`Media upload finalized successfully for ${mediaId}`);
}

// Upload media in chunks (for videos and large files)
export async function uploadMediaInChunks(
  mediaId: string,
  accessToken: string,
  mediaBuffer: ArrayBuffer,
  chunkSize: number = 1024 * 1024 // 1MB chunks
): Promise<void> {
  const chunks = chunkBuffer(mediaBuffer, chunkSize);
  console.log(`Uploading media in ${chunks.length} chunks of ${chunkSize} bytes each`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    await appendMediaData(mediaId, accessToken, chunk, i);

    // Add a small delay between chunks to avoid rate limiting
    if (i < chunks.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  console.log(`All ${chunks.length} chunks uploaded successfully for ${mediaId}`);
}

// Main function to upload media (images and videos)
export async function uploadMedia(
  buffer: ArrayBuffer,
  mediaType: string,
  accessToken: string
): Promise<string> {
  const totalBytes = buffer.byteLength;
  const isVideo = mediaType.startsWith('video');
  const category = isVideo ? 'tweet_video' : 'tweet_image';

  console.log(`Starting media upload: ${category}, type: ${mediaType}, size: ${totalBytes} bytes`);

  // Step 1: Initialize media upload
  const mediaId = await initializeMediaUpload({
    accessToken,
    mediaCategory: category,
    mediaType,
    totalBytes,
  });

  // Step 2: Upload media data
  if (isVideo || totalBytes > 1024 * 1024) {
    // For videos or large files, upload in chunks
    await uploadMediaInChunks(mediaId, accessToken, buffer);
  } else {
    // For images and small files, upload in single chunk
    await appendMediaData(mediaId, accessToken, buffer);
  }

  // Step 3: Finalize media upload
  await finalizeMediaUpload(mediaId, accessToken);

  // Step 4: Check media upload status and wait for processing
  await checkMediaStatus(mediaId, accessToken);

  console.log(`Media upload completed successfully: ${mediaId}`);
  return mediaId;
}

// Helper function to get MIME type from file extension
export function getMimeType(filename: string): string {
  const mimeType = mime.lookup(filename);
  if (!mimeType) {
    throw new Error(`Unsupported file type: ${filename}`);
  }
  
  // Fix common MIME type issues
  if (mimeType === 'application/mp4') {
    return 'video/mp4';
  }
  
  return mimeType;
}

// Helper function to validate media file
export function validateMediaFile(
  buffer: ArrayBuffer,
  mimeType: string,
  maxSizeBytes: number = 512 * 1024 * 1024 // 512MB default limit
): void {
  if (buffer.byteLength > maxSizeBytes) {
    throw new Error(`File too large: ${buffer.byteLength} bytes exceeds limit of ${maxSizeBytes} bytes`);
  }

  const isVideo = mimeType.startsWith('video');
  const isImage = mimeType.startsWith('image');

  if (!isVideo && !isImage) {
    throw new Error(`Unsupported media type: ${mimeType}`);
  }

  // X API specific limits
  if (isImage && buffer.byteLength > 5 * 1024 * 1024) {
    throw new Error("Image file too large: maximum 5MB for images");
  }

  if (isVideo && buffer.byteLength > 512 * 1024 * 1024) {
    throw new Error("Video file too large: maximum 512MB for videos");
  }
}