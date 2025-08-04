"use server";

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
        
        if (statusData.processing_info?.state === "succeeded") {
          console.log(`Media ${mediaId} processing completed successfully`);
          return; // Success
        } else if (statusData.processing_info?.state === "failed") {
          const errorMessage = statusData.processing_info?.error?.message || "Unknown error";
          console.error(`Media ${mediaId} processing failed:`, errorMessage);
          throw new Error(`Media processing failed: ${errorMessage}`);
        } else if (statusData.processing_info?.state === "pending") {
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

// Initialize media upload
export async function initializeMediaUpload(options: MediaUploadOptions): Promise<string> {
  const { accessToken, mediaCategory, mediaType, totalBytes } = options;

  console.log(`Initializing media upload: ${mediaCategory}, type: ${mediaType}, size: ${totalBytes} bytes`);

  // Validate MIME type for Twitter API
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/mov'];
  
  if (mediaCategory === 'tweet_image' && !validImageTypes.includes(mediaType)) {
    console.warn(`Unsupported image MIME type: ${mediaType}. Supported types: ${validImageTypes.join(', ')}`);
  }
  
  if (mediaCategory === 'tweet_video' && !validVideoTypes.includes(mediaType)) {
    console.warn(`Unsupported video MIME type: ${mediaType}. Supported types: ${validVideoTypes.join(', ')}`);
  }

  const requestBody = {
    media_category: mediaCategory,
    media_type: mediaType,
    total_bytes: totalBytes,
  };

  console.log('Media upload request body:', JSON.stringify(requestBody, null, 2));

  const response = await fetch(`${xApiUrl}/2/media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to initialize media upload:", {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
      url: `${xApiUrl}/2/media`,
    });
    
    let errorMessage = `Failed to initialize media upload: ${response.status} ${response.statusText}`;
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.errors && errorData.errors.length > 0) {
        errorMessage += ` - ${errorData.errors[0].message}`;
      }
    } catch (e) {
      // If parsing fails, use the raw error text
      errorMessage += ` - ${errorText}`;
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const mediaId = data.media_id_string;
  console.log(`Media upload initialized with ID: ${mediaId}`);
  
  return mediaId;
}

// Append media data (for single chunk uploads like images)
export async function appendMediaData(
  mediaId: string,
  accessToken: string,
  mediaData: string
): Promise<void> {
  console.log(`Appending media data to ${mediaId}`);

  const response = await fetch(`${xApiUrl}/2/media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_id: mediaId,
      segment_index: 0,
      media_data: mediaData,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Failed to append media data:", error);
    throw new Error(`Failed to append media data: ${response.status} ${response.statusText}`);
  }

  console.log(`Media data appended successfully to ${mediaId}`);
}

// Append media chunk (for multi-chunk uploads like videos)
export async function appendMediaChunk(
  mediaId: string,
  accessToken: string,
  segmentIndex: number,
  mediaData: string
): Promise<void> {
  console.log(`Appending media chunk ${segmentIndex + 1} to ${mediaId}`);

  const response = await fetch(`${xApiUrl}/2/media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_id: mediaId,
      segment_index: segmentIndex,
      media_data: mediaData,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Failed to append media chunk:", error);
    throw new Error(`Failed to append media chunk ${segmentIndex + 1}: ${response.status} ${response.statusText}`);
  }

  console.log(`Media chunk ${segmentIndex + 1} appended successfully to ${mediaId}`);
}

// Finalize media upload
export async function finalizeMediaUpload(mediaId: string, accessToken: string): Promise<void> {
  console.log(`Finalizing media upload for ${mediaId}`);

  const response = await fetch(`${xApiUrl}/2/media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_id: mediaId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Failed to finalize media upload:", error);
    throw new Error(`Failed to finalize media upload: ${response.status} ${response.statusText}`);
  }

  console.log(`Media upload finalized successfully for ${mediaId}`);
}

// Upload media in chunks (for videos)
export async function uploadMediaInChunks(
  mediaId: string,
  accessToken: string,
  mediaBuffer: ArrayBuffer,
  chunkSize: number = 1024 * 1024 // 1MB chunks
): Promise<void> {
  const totalChunks = Math.ceil(mediaBuffer.byteLength / chunkSize);
  console.log(`Uploading media in ${totalChunks} chunks of ${chunkSize} bytes each`);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, mediaBuffer.byteLength);
    const chunk = mediaBuffer.slice(start, end);
    const base64Chunk = Buffer.from(chunk).toString("base64");

    await appendMediaChunk(mediaId, accessToken, i, base64Chunk);

    // Add a small delay between chunks to avoid rate limiting (important for free tier)
    if (i < totalChunks - 1) {
      await new Promise((resolve) => setTimeout(resolve, 200)); // Increased delay for free tier
    }
  }

  console.log(`All ${totalChunks} chunks uploaded successfully for ${mediaId}`);
}